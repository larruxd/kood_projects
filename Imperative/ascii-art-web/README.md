# ASCII-ART-WEB

## Description
This program hosts a server at http://localhost:6969, takes user input [banner] and [string], turns it into ascii art, and sends it back to the webpage.

## Authors
Lauri Laretei / [laurilaretei](https://01.kood.tech/git/laurilaretei)

## Usage
```sh
go run .
```
Opens a server on [localhost:6969](http://localhost:6969/)

## Implementation details: algorithm

`makeAsciiChar()` Takes banner file path and text as inputs. For each letter in text an ascii art character is added to string. Sends banner to makeMap() to get ascii art.

`makeMap()` Makes a map[int][]string, assigning each ascii letter in banner file a corresponding int value.

`isValid()` Checks if entered text characters are in range of 32-126. Also includes 10 and 13 for new lines from html.