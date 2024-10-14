# - Active -

### Links

[Subject](https://github.com/01-edu/public/tree/master/subjects/cybersecurity/active)

[Audit questions](https://github.com/01-edu/public/tree/master/subjects/cybersecurity/active/audit)

> ❗ **[Audit video and answers here](https://01.kood.tech/git/laurilaretei/active/src/branch/master/audit.md)** ❗

### Description

This port scanner program is a command-line tool written in Python. It allows you to scan for open or closed ports on a specified host using TCP or UDP protocols. You can specify a range of ports to scan and the program will provide the status of each port. It provides a simple and efficient way to check the accessibility of ports on a target machine.

## Getting started

### Requirements

- [Python](https://www.python.org/downloads/)
- [Pip](https://pip.pypa.io/en/stable/cli/pip_install/)

To check if requirements are met use:

```sh
python --version
python -m ensurepip --upgrade
```

### Setup

1. **Clone repo**

```sh
git clone https://01.kood.tech/git/laurilaretei/active
```

2. Create a new virtual environment

```sh
python3 -m venv env
source env/bin/activate
```

## Usage

Help:

```sh
$> python3 tinyscanner.py -h

usage: tinyscanner.py [OPTIONS] [HOST] [PORT]

Tiny scanner

options:
  -h, --help  show this help message and exit
  -t TCP      TCP scan
  -u UDP      UDP scan
  -p PORT     Range of ports to scan

```

TCP Scan:

```sh
$> python3 tinyscanner.py -t 127.0.0.1 -p 80

Port 80 is closed
```

UDP Scan:

```sh
$> python3 tinyscanner.py -u 127.0.0.1 -p 80

Port 80 is open/filtered
```

## Author

**[Lauri Laretei](https://01.kood.tech/git/laurilaretei)**
