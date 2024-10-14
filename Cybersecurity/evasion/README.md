# Evasion

- ### [Video▶️](https://www.youtube.com/watch?v=cuMV9rD8Kig)
- ### [Subject](https://github.com/01-edu/public/tree/master/subjects/cybersecurity/evasion)
- ### [Audit](https://github.com/01-edu/public/tree/master/subjects/cybersecurity/evasion/audit)

## Table of contents

1. [Introduction](#introduction)
2. [Description](#description)
3. [Requirements](#requirements)
4. [Usage](#usage)
5. [Answers for Audit Questions](#answers-for-audit-questions)
6. [Author](#author)

## Description

The goal of this project was to understand the methods of hackers who bypass anti-viruses and how antivirus works in a little more advanced way than mal-track.

## Requirements

- Windows machine
- Python 3.x (and pip)
  - pyinstaller library
  - pycryptodome library

## Usage

**Install** the required libraries using pip:

```sh
pip install pycryptodome pyinstaller
```

**Run** the encryption script:

```sh
python evasion.py <path_to_executable_file>
```

Replace <path_to_executable_file> with the path to the .exe file you want to encrypt.

**Output**: The script will generate an encrypted file and a decryption script. The decryption script will be packaged into an executable and placed in the same directory as the original file. The output executable will be named <original_file_name>\_encrypted.exe.

**Decrypting the file**: To decrypt the file, simply run the generated decryption executable. It will decrypt the original file and save it as <original_file_name>\_decrypted.exe in the same directory.

## Answers for audit questions

- ### Is the student able to explain how the Anti-Viruses detect the viruses?

  Antiviruses detect viruses by using a combination of methods. They scan files and programs on your computer, looking for known patterns of malicious code, called "signatures," that match the ones in their virus database. They also monitor your system for suspicious behavior, like programs trying to access or modify files in unusual ways, which might indicate a new or unknown virus. When they find something suspicious, they can quarantine or delete the file to keep your computer safe.

- ### Is the student able to explain clearly how he can bypass the Anti-Viruses?

  - Encryption:

    Encryption obscures the contents of a file by converting it into an unreadable format, making it difficult for antivirus software to detect malicious code based on known signatures or patterns.

  - File Padding:

    File padding involves adding extra data to a file to alter its size and structure. This can confuse antivirus systems that use heuristics or size-based rules to detect malware.

  - Dynamic Code Execution:

    Dynamic code execution involves running code only at runtime, often after specific conditions are met. This technique evades static analysis by hiding the actual behavior of the code until it is executed.

  - Anti-Analysis Techniques:

    Anti-analysis techniques, like introducing delays or executing benign loops can outsmart sandbox environments or automated analysis tools that monitor programs for only a short period. These methods help hide malicious actions from detection.

- ### Is the student able to explain clearly how his program works?

  The `main` function uses argparse to parse the command-line argument, which is the path to the executable file to be encrypted. It then checks if the provided file exists, is a file, and has a .exe extension. If these conditions are met, it extracts the directory and filename of the executable, and calls the `encrypt_file` function to encrypt the file. The resulting initialization vector (IV) and encrypted data are then passed to the `create_decryption_script` function to generate a decryption script.

  The `encrypt_file` function handles the encryption process. It reads the content of the specified file, pads the data to match the AES block size, and adds random padding to increase the file size. It then generates a random IV and uses it to encrypt the padded data with AES in CBC mode. The function returns the IV and the encrypted data.

  The `create_decryption_script` function generates a Python script that can decrypt the encrypted file. It converts the encrypted data and IV to hexadecimal strings for embedding in the script. The generated script includes code to increment a counter, sleep for a specified duration, decrypt the data, remove padding, and write the decrypted data to a new executable file. The function then writes this script to a file and uses `pyinstaller` to package it into an executable. Finally, it cleans up temporary files and moves the generated executable to the specified directory.

## Author

### [laurilaretei](https://01.kood.tech/git/laurilaretei)
