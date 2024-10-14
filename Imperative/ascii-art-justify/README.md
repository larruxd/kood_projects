# ASCII-ART-JUSTIFY

Written in **GO**,

## Author

**[laurilaretei](https://01.kood.tech/git/laurilaretei)** and **[taophycnicky](https://01.kood.tech/git/taophycnicky)**


## Testing
```sh
./test.sh
```

## Usage
```sh
go run . --align=<option> <string> <banner>
```
or
```sh
go run . --align=<option> <string>
```
or
```sh
go run . <string>
```
Options are: **left, right, center, justify**

## Description

**Ascii-art-justify** recieves three arguments [OPTION] [STRING] [BANNER]. <br />
To change the alignment of the output use a flag `--align=<type>`, in which type can be :
- center
- left
- right
- justify <br />
Representation is adapted to the terminal size. If you reduce the terminal window the graphical representations is still adapted to the terminal size.
Only text that fits the terminal size will be tested.

