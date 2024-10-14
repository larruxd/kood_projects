import argparse
import ctypes
import hashlib
import os
import re
import psutil
import winreg
import logging
import time
import concurrent.futures

"""
Description: This program will take the hash of the file, directory to start scanning from and hash type as input,
and scan the filesystem for files matching the given hash.
It will kill the malware, remove its execution from the startup of the machine,
stops and removes it from the virtual machine and display the ip address of the attacker.
"""

start_time = time.time()

# Set up logging
log_folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), "logs")
os.makedirs(log_folder, exist_ok=True)
log_file = os.path.join(log_folder, f"mal-track_{time.strftime('%Y_%m_%d_%H%M%S')}.log")

logging.basicConfig(
    filename=log_file,
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)


def main():
    parser = argparse.ArgumentParser(
        description="Find and remove malware from the system"
    )
    parser.add_argument("--hash", type=str, help="hash of the file")
    parser.add_argument(
        "--dir", type=str, default="C:\\", help="Root directory to start scanning from"
    )
    parser.add_argument("--hash-type", type=str, default="sha256", help="Hash type")
    args = parser.parse_args()

    if args.hash:

        # Check if the hash is valid
        if len(args.hash) != 64:
            print("Invalid hash. Please provide a valid hash.")
            parser.print_help()
            return

        # Check if the program is running with admin privileges
        if not ctypes.windll.shell32.IsUserAnAdmin():
            print("Please run the program as an administrator to remove malware.")
            parser.print_help()
            return

        antimalware(
            args.hash.lower(),
            args.dir,
            args.hash_type,
        )

        logging.info(
            "Scanning completed at %s, took %s seconds",
            time.strftime("%Y-%m-%d %H:%M:%S"),
            round(time.time() - start_time, 2),
        )

    else:
        print("Please provide the hash of the file.")
        parser.print_help()


def antimalware(target_hash, root_dir, hash_type):
    logging.info(
        "Scanning started at %s, for hash: %s",
        time.strftime("%Y-%m-%d %H:%M:%S"),
        target_hash,
    )

    with concurrent.futures.ThreadPoolExecutor() as executor:
        futures = []
        for dirpath, _, filenames in os.walk(root_dir):
            for filename in filenames:
                file_path = os.path.join(dirpath, filename)
                print(f"{file_path}", end="\r")
                futures.append(
                    executor.submit(scan_file, file_path, target_hash, hash_type)
                )

        # Wait for all futures to complete
        concurrent.futures.wait(futures)

    return


def scan_file(file_path, target_hash, hash_type):
    try:
        file_hash = calculate_file_hash(file_path, hash_type)
        if file_hash == target_hash:
            print(f"Match found: {file_path}")
            logging.info("Match found: %s", file_path)
            kill_process(target_hash)
            find_ip(file_path)
            remove_from_startup(file_path)
            delete_file(file_path)
    except Exception as e:
        print(f"Could not read file: {file_path} ({e})")
        # logging.error("Could not read file: %s (%s)", file_path, e)


def calculate_file_hash(file_path, hash_type):

    hash_function = hashlib.new(hash_type)
    with open(file_path, "rb") as f:
        while chunk := f.read(8192):
            hash_function.update(chunk)
    return hash_function.hexdigest()


def remove_from_startup(filepath):
    registry_paths = [
        "Software\\Microsoft\\Windows\\CurrentVersion\\Run",
        "Software\\Microsoft\\Windows\\CurrentVersion\\RunOnce",
    ]

    hives = [
        winreg.HKEY_CURRENT_USER,
        winreg.HKEY_LOCAL_MACHINE,
    ]

    for hive in hives:
        for reg_path in registry_paths:
            try:
                # Open the registry key with write access
                key = winreg.OpenKey(
                    hive, reg_path, 0, winreg.KEY_SET_VALUE | winreg.KEY_READ
                )
                # Check each value under the key
                num_values = winreg.QueryInfoKey(key)[1]
                for i in range(num_values):
                    value_name, value_data, _ = winreg.EnumValue(key, i)
                    if value_data == filepath:
                        winreg.DeleteValue(key, value_name)
                        logging.info(
                            "Removed %s from %s in %s", value_name, reg_path, hive
                        )
                        break
                winreg.CloseKey(key)
            except FileNotFoundError:
                # If the registry key doesn't exist, skip it
                logging.error("Registry path %s not found in %s.", reg_path, hive)
            except PermissionError:
                logging.error("Permission denied to access %s in %s.", reg_path, hive)
            except Exception as e:
                logging.error("Error processing %s in %s: %s", reg_path, hive, e)


def find_ip(file_path):
    logging.info("Searching for IP address in file: %s", file_path)

    strings = extract_strings(file_path)

    ip_pattern = re.compile(r"\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b")
    ip_addresses = set()
    for string in strings:
        ips = ip_pattern.findall(string)
        ip_addresses.update(ips)

    logging.info("IP addresses found in file: %s", ip_addresses)


def extract_strings(file_path):
    strings = []
    with open(file_path, "rb") as f:
        data = f.read()
        ascii_strings = re.findall(rb"[ -~]{4,}", data)
        strings.extend(ascii_strings)
    return [s.decode("latin-1") for s in strings]


def kill_process(target_hash, hash_type="sha256"):
    for process in psutil.process_iter(["pid", "name", "exe"]):
        try:
            # Get the executable path of the process
            exe_path = process.info["exe"]
            if exe_path and os.path.exists(exe_path):
                # Calculate the hash of the executable
                file_hash = calculate_file_hash(exe_path, hash_type)
                # If the hash matches, terminate the process
                if file_hash == target_hash:
                    logging.info(
                        "Killing process %s (PID: %s)",
                        process.info["name"],
                        process.info["pid"],
                    )
                    process.terminate()  # Attempt to terminate the process gracefully
                    process.wait(timeout=5)  # Wait for process to terminate
                    logging.info(
                        "Process %s (PID: %s) terminated.",
                        process.info["name"],
                        process.info["pid"],
                    )
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess) as e:
            logging.error(
                "Could not process %s (PID: %s): %s",
                process.info["name"],
                process.info["pid"],
                e,
            )


def delete_file(path):
    try:
        os.remove(path)
        logging.info("Removed malware file: %s", path)
    except Exception as e:
        logging.error("Failed to remove malware file: %s (%s)", path, e)


if __name__ == "__main__":
    main()
