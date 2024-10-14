# - Passive -

### Links

[Subject](https://github.com/01-edu/public/tree/master/subjects/cybersecurity/passive)

[Audit questions](https://github.com/01-edu/public/tree/master/subjects/cybersecurity/passive/audit)

> ❗ **[Audit video and answers here](https://01.kood.tech/git/laurilaretei/passive/src/branch/master/audit.md)** ❗

### Description

Passive is an open-source intelligence (OSINT) information gathering tool that utilizes open source investigative methods to scrape the web or pull from APIs in order to search for information about full names, usernames, or IP addresses.

### Features

1. Full name - With first and last name perform a search in a whitepages database to find that persons address and phone number if exists.
2. Username - Look if entered user exists in Facebook, Reddit, Instagram, Github or Youtube.
3. IP address - Gather info about your own or any other ip address.

## Getting started

### Requirements

- [Python](https://www.python.org/downloads/)
- [Pip](https://pip.pypa.io/en/stable/cli/pip_install/)

```sh
python --version
python -m ensurepip --upgrade
```

### Setup

1. **Clone repo**

```sh
git clone https://01.kood.tech/git/laurilaretei/passive
```

2. Create a new virtual environment

```sh
python3 -m venv env
source env/bin/activate
```

3. Install dependencies

```sh
pip install -r requirements.txt
```

## Usage

Help:

```sh
$> python3 passive.py -h

usage: passive.py [-h] [-fn FULL_NAME] [-ip IP_ADDRESS] [-u USERNAME]

Passive Reconnaissance Tool

options:
  -h, --help            show this help message and exit
  -fn FULL_NAME, --full-name FULL_NAME
                        Search with full name
  -ip IP_ADDRESS, --ip-address IP_ADDRESS
                        Search with ip address
  -u USERNAME, --username USERNAME
                        Search with username
```

Full name:

```sh
$> passive -fn "Jean Dupont"

    First name: JEAN
    Last name: DUPONT
    Address: Rue du Baron Nothomb 18
    5600 Merlemont (Philippeville)
    Number: +3271570686
```

IP:

```sh
$> passive -ip 127.0.0.1

    ISP: FSociety, S.A.
    City Lat/Lon:	(13.731) / (-1.1373)
    Saved in result2.txt
```

Username:

```sh
$> passive -u "@user01"

    5/5 found for user1
    Facebook: Yes
    Reddit: Yes
    Youtube: Yes
    Instagram: Yes
    Github: Yes
```

## Author

**[Lauri Laretei](https://01.kood.tech/git/laurilaretei)**

## Disclaimer

> ⚠️ These methods and tools are for educational purposes only. You must ensure that you do not attempt any exploit-type activity without the explicit permission of the owner of the machine, system or application. Failure to obtain permission risks breaking the law.
