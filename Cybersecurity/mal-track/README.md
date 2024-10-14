# Mal-Track

- ### [Subject](https://github.com/01-edu/public/tree/master/subjects/cybersecurity/mal-track)

- ### [Audit questions](https://github.com/01-edu/public/tree/master/subjects/cybersecurity/mal-track/audit)

- ### [Video▶️](https://youtu.be/etngpUy8TYI)

## Table of contents

1. [Description](#description)
2. [Requirements](#requirements)
3. [Usage](#usage)
4. [Answers for audit questions](#answers-for-audit-questions)
   - [Managing startup programs in Windows](#is-the-student-able-to-explain-clearly-how-we-can-manage-the-startup-programs-in-windows)
   - [Getting the IP of the attacker from the malware](#is-the-student-able-to-explain-clearly-how-he-get-the-ip-of-the-attacker-from-the-malware)
   - [How the program works](#is-the-student-able-to-explain-clearly-how-his-program-works)
5. [Author](#author)

## Description

The goal of this project is to understand the basic operation of a computer virus on a Windows environment and simple methods to eradicate them.

In this project I created a program that will kill the malware, remove its execution from the startup of the machine, stop and remove it from the virtual machine and display the ip address of the attacker.

## Requirements

- Windows based machine
- Access to admin privileges
- [Python](https://www.python.org/downloads/)
  - psutil (`pip install psutil`)

## Usage

Find file hash:

```powershell
Get-FileHash C:\Path\To\Your\file.exe
```

Copy the file hash

Run powershell as admin

```powershell
PS C:\> python.exe C:\path\to\mal-track.py -h

usage: mal-track.py [-h] [--hash HASH] [--dir DIR] [--hash-type HASH_TYPE]

Find and remove malware from the system

options:
  -h, --help            show this help message and exit
  --hash HASH           hash of the file
  --dir DIR             Root directory to start scanning from
  --hash-type HASH_TYPE
                        Hash type
```

## Answers for audit questions

- ### Is the student able to explain clearly how we can manage the startup programs in windows?

  Startup programs in Windows are applications and services that are configured to launch automatically when the operating system starts.

  How to manage them:

1.  Task Manager - Startup Tab
    - Location: Accessible via the Task Manager (Ctrl + Shift + Esc), under the "Startup" tab.
    - Details: This tab lists programs that have been registered to start at boot. These programs typically have registry entries or shortcuts in specific system folders.
2.  Startup Folder

    - For individual users: C:\Users\<YourUsername>\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup
    - For all users: C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Startup

3.  Windows Registry

    - For the current user: HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run
    - For all users: HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Run

4.  Scheduled Tasks

    - Accessible through the Task Scheduler (taskschd.msc).

- ### Is the student able to explain clearly how he get the ip of the attacker from the malware?

  The program finds potential attacker IP addresses from an executable file by performing static analysis on the binary. It first reads the entire contents of the executable file as raw binary data. Then, it extracts all sequences of printable ASCII characters (strings), using a regular expression that matches these sequences within the binary. Once the strings are extracted, the function scans them using another regular expression specifically designed to identify IPv4 addresses, which are typically formatted as four sets of digits separated by periods (e.g., 192.168.0.1).

- ### Is the student able to explain clearly how his program works?

  The script begins by setting up logging. It creates a directory named "logs" in the same directory as the script, and logs are saved with a filename that includes the current timestamp. The logging configuration specifies that logs should be written to a file, with a format that includes the timestamp, log level, and message.

  `main` function uses argparse to define and parse command-line arguments. It expects a hash (--hash), a root directory to start scanning from (--dir), and a hash type (--hash-type). If the hash is provided and valid, and the script is run with administrative privileges, it calls the `antimalware` function to start the scanning process.

  `antimalware` function scans the filesystem starting from the specified root directory. For each file, it calculates the file's hash and compares it to the target hash. If a match is found, it logs the match, kills the associated process, finds the attacker's IP address in the file, removes the file from startup, and deletes the file.

  `calculate_file_hash` function reads a file in chunks and calculates its hash using the specified hash type.

  `remove_from_startup` function removes a file path from the Windows Registry's Run and RunOnce keys, ensuring the malware does not execute on startup.

  `find_ip` function searches for IP addresses in a file by extracting printable strings and using a regular expression to find IP patterns.

  `extract_strings` function extracts printable strings from a binary file.

  `kill_process` function iterates over all running processes, calculates the hash of each process's executable, and terminates processes whose executable hash matches the target hash. `

  `delete_file` function attempts to delete a file and logs the result.

## Author

[laurilaretei](https://01.kood.tech/git/laurilaretei)
