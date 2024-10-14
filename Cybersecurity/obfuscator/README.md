# Obfuscator

- ### [Video▶️](https://youtu.be/Krf3_YnboGg)
- ### [Subject](https://github.com/01-edu/public/tree/master/subjects/cybersecurity/obfuscator)
- ### [Audit](https://github.com/01-edu/public/tree/master/subjects/cybersecurity/obfuscator/audit)

## Description

The goal of this project is to understand polymorphic encryption. Principle used by computer virus developers to change the signature of their programs.

This Python script is designed to execute encrypted code, effectively obfuscating its true functionality. It decrypts a hidden payload at runtime and executes it, which in this case could establish a reverse shell, allowing remote access to the host machine. The script then re-encrypts itself with a new key, ensuring that the obfuscation persists across executions.

## Requirements

- Python 3.x (and pip)
- cryptography library

  ```sh
  pip install cryptography
  ```

## Usage

To use this script, follow these steps:

- **Run the Script**:

  - Execute the script using Python. It will automatically decrypt the embedded token using the provided key and execute the decrypted code.

  ```sh
  python obfuscator.py
  ```

- **Reverse Shell**:

  - The script is designed to establish a reverse shell. Ensure that your machine is listening on the appropriate IP address and port to interact with the reverse shell.

  ```sh
  sudo nc -lvnp 1234
  ```

## Answers for audit questions

- ### Is the student able to explain clearly what polymorphic encryption means?

  Polymorphic encryption is a technique where the encryption process dynamically changes with each execution of the program. This ensures that the signature of the program is different every time, making it more challenging for antiviruses to detect and protecting the underlying data from compromise.

- ### Is the student able to explain clearly how he change the signature with each execution?

  The program's signature is altered with each execution by generating a new encryption key and using it to create a new token, which represents the encrypted form of the script. This new token with the key to decrypt it is then written into a new file with the same name, replacing the old one. As a result, the underlying data and functionality of the program remain unchanged, while the encryption itself is different each time.

- ### Is the student able to explain clearly how his program works?

  The script begins by calling the `decrypt()` function. This function takes two arguments: key and token. It uses the key to decrypt the token, which contains an encrypted string. Once decrypted, the string is executed as Python code. This decrypted code then calls the `run()` function, which contains the core malicious logic.

  The `run()` function is responsible for creating a reverse shell. This reverse shell attempts to connect back to a specified IP address and port, allowing the attacker to execute commands on the infected machine remotely. The reverse shell runs in a separate thread to ensure continuous execution.

  After establishing the reverse shell, the `run()` function modifies the script itself. It generates a new encryption key, re-encrypts the decrypted code, and writes the updated key and token back into the script file, effectively re-obfuscating the code. The original file is deleted and replaced with the updated version, ensuring the obfuscation persists each time the script is executed.

## Author

### [laurilaretei](https://01.kood.tech/git/laurilaretei)
