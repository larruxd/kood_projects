# ASCII-ART-COLOR

Written in **GO**,

## Authors

**[laurilaretei](https://01.kood.tech/git/laurilaretei)** and **[taophycnicky](https://01.kood.tech/git/taophycnicky)**


## Testing
```sh
./test.sh
```

## Usage
```sh
go run . --color=<color> <letters to be colored> <string>
```
or
```sh
go run . --color=<color> <string>
```
or
```sh
go run . <string>
```

## Description

**Ascii-art-color** recieves three arguments [OPTION] [LETTERS-TO-BE-COLORED] [STRING]. 
The output manipulates colors using the flag --color=[color] [letters to be colored], in which --color is the flag and [color] is the color desired by the user and [letters to be colored] is the letter or letters that you can chose to be colored. You are able to choose between coloring a single letter or a set of letters. If the letter is not specified, the whole string will be colored. The flag must have exactly the same format as above. Additionally, the program is able to run with a single [STRING] argument.

