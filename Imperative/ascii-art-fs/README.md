# ASCII-ART

### Usage
```sh
$ go run . [STRING] [BANNER]
```
or
```sh
bash test.sh
```

- Banner options: [shadow] [standard] [thinkertoy].
- String of more than one word must be in quotations!

```console
$ go run . "hello" standard | cat -e
 _              _   _          $
| |            | | | |         $
| |__     ___  | | | |   ___   $
|  _ \   / _ \ | | | |  / _ \  $
| | | | |  __/ | | | | | (_) | $
|_| |_|  \___| |_| |_|  \___/  $
                               $
                               $

$ go run . "Hello There!" shadow | cat -e
                                                                                         $
_|    _|          _| _|                _|_|_|_|_| _|                                  _| $
_|    _|   _|_|   _| _|   _|_|             _|     _|_|_|     _|_|   _|  _|_|   _|_|   _| $
_|_|_|_| _|_|_|_| _| _| _|    _|           _|     _|    _| _|_|_|_| _|_|     _|_|_|_| _| $
_|    _| _|       _| _| _|    _|           _|     _|    _| _|       _|       _|          $
_|    _|   _|_|_| _| _|   _|_|             _|     _|    _|   _|_|_| _|         _|_|_| _| $
                                                                                         $
                                                                                         $

$ go run . "Hello There!" thinkertoy | cat -e
                                                $
o  o     o o           o-O-o o                o $
|  |     | |             |   |                | $
O--O o-o | | o-o         |   O--o o-o o-o o-o o $
|  | |-' | | | |         |   |  | |-' |   |-'   $
o  o o-o o o o-o         o   o  o o-o o   o-o O $
                                                $
                                                $
```

## Objectives

You must follow the same instructions as in the first subject but the second argument must be the name of the template. I know some templates may be hard to read, just do not obsess about it.
Ascii-art is a program which consists in receiving a string as an argument and outputting the string in a graphic representation using ASCII. Time to write big.
What we mean by a graphic representation using ASCII, is to write the string received using ASCII characters, as you can see in the example below:

```console
                                 $
_|    _|          _| _|          $
_|    _|   _|_|   _| _|   _|_|   $
_|_|_|_| _|_|_|_| _| _| _|    _| $
_|    _| _|       _| _| _|    _| $
_|    _|   _|_|_| _| _|   _|_|   $
                                 $
                                 $
```

- This project should handle an input with numbers, letters, spaces, special characters and \n.
- Take a look at the ASCII manual.

## Instructions

- Your project must be written in Go.
- The code must respect the good practices.
- It is recommended to have test files for unit testing.
- You can see all about the banners here.
- The usage must respect this format go run . [STRING] [BANNER], any other formats must return the following usage message:
```console
Usage: go run . [STRING] [BANNER]

EX: go run . something standard
```

If there are other ascii-art optional projects implemented, the program should accept other correctly formatted [OPTION] and/or [BANNER].
Additionally, the program must still be able to run with a single [STRING] argument.