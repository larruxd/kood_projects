# - INSPECTOR-IMAGE -

### Links

[Subject](https://github.com/01-edu/public/tree/master/subjects/cybersecurity/inspector-image)

[Audit questions](https://github.com/01-edu/public/tree/master/subjects/cybersecurity/inspector-image/audit)

> ❗ **[Audit video and answers here](https://01.kood.tech/git/laurilaretei/inspector-image/src/branch/master/audit.md)** ❗

### Description

The Inspector-Image is a Python script that allows you to extract information from images.
It provides two main functionalities: extracting location/gps information from images and getting the pgp public key from the image.jpeg file in the root dir.
The script takes command-line arguments to perform these operations.

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
git clone https://01.kood.tech/git/laurilaretei/inspector-image
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
$> python3 image.py -h

usage: image.py [-h] [-m MAP] [-s STEG]

Inspector image

options:
  -h, --help            show this help message and exit
  -m MAP, --map MAP     Search with full name
  -s STEG, --steg STEG  Search with ip address
```

Location/gps info:

```sh
$> python image.py --map image.jpeg

Lat/Lon:    (32.08663) / (34.885131)
```

Steganography:

```sh
$> python image.py --steg image.jpeg

s-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: 01

mQENBGIwpy4BCACFayWXCgHH2QqXkicbqD1ZlMUALpyGxDFiWh1SErFUPJOO/CgU
2688bAd26kxDSGShiL9YUOQJ6MS+zJ0KlBkeKPoQlPHRBVpH7vjcRbZNgDxd82uE
7mhM6AH+W3fAim/PhU3lm661UGMCHM3YLupa/N0Dhhmfimtg+0AimCoXk6Q6WJxg
ao8XY1Wqacd2L0ssASY5EkMahNgtX0Ri8snbTlImd5Jq/sC4buZq96IlxyhtX0ew
zD/md0U++8SxG9+gi+uuImqV8Wq1YHvJH5BtIbfcNG9V00+03ikEX9tppKxCkhzx
9rSqvyH6Uirs3FVhFtoXUSg8IeYgSH6p5tsVABEBAAG0CDAxQDAxLjAxiQEcBBAB
AgAGBQJiMKcuAAoJEAJuInmYDhhbO3gIAITZhEtLBj524y1oeBKI5fZDwgCQum6B
D9ZaUq1+dI98HsiRAiUqw1YbuJQgeUVGCmqXeC3E7VTPCPZsaCLfWWZVeosRIqB8
PwGxcY6vXHYR4S6T8rHwsNASw+Vo2pmQIGn4tABmtyappqJbwSz+5yg73DjYXiX/
e/f6i9nrFFsfMjjKd71cAyHjV8u0z7fGDXpR22vo7CdloXMxsZRyHjd/4ofUgvu0
6hWYG2zBWTXpwaYRU9u1NCr1gfKnukm8gbILSSgjr8pQ3OLWHleJXc0sCEJFKSbg
+I0KJP7Ccrxy0MaKYk0T0tYbBrvqQCzXqzAqcjn+1GoDDS1J8WBJopM=
=N8hc
-----END PGP PUBLIC KEY BLOCK-----
```

## Author

**[Lauri Laretei](https://01.kood.tech/git/laurilaretei)**
