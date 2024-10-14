# ASCII-art project- REVERSE

Written in **GO**,

## Authors

By **[laurilaretei](https://01.kood.tech/git/laurilaretei)** and **[alpbal](https://01.kood.tech/git/alpbal)** 

___

**Ascii-art-reverse** is a program which consists in receiving a string as an argument and outputting the string in a graphic representation using **ASCII**, as in the [ascii-art](https://01.kood.tech/git/Olya/ascii-art) and with different fonts *standard*, *shadow* and *thinkertoy*, which are located in folder banners that you can justfy text allaign.



## How to use:Input codes are here Examples at the bottom:
Try passing to the reverse flag "--reverse=example00.txt" the example 00.
Hello World

Try passing to the reverse flag "--reverse=example01.txt" the example 01.
123

Try passing to the reverse flag "--reverse=example02.txt" the example 02.
#=\[

Try passing to the reverse flag "--reverse=example03.txt" the example 03.
something&234

Try passing to the reverse flag "--reverse=example04.txt" the example 04.
abcdefghijklmnopqrstuvwxyz

Try passing to the reverse flag "--reverse=example05.txt" the example 05.
\!" #$%&'()*+,-./

Try passing to the reverse flag "--reverse=example06.txt" the example 06.
:;{=}?@

Try passing to the reverse flag "--reverse=example07.txt" the example 07.
ABCDEFGHIJKLMNOPQRSTUVWXYZ

___
If you have troubles with printing *thinkertoy* Open thinkertoy.txt file with vs code and change to LF, try it: [image](https://freeimage.host/i/HoFoxea)
___

## Testing

To test you should use this command: 
```
bash test.sh
```
```
## ascii-reverse-examples

- Create your file and copy the examples into it.
- For a better understanding and formatting purpose, we added the dollar sign ($) at the end. This can be copied if you wish, choose wisely!

### example00

```console
 _    _          _   _                __          __                 _       _  $
| |  | |        | | | |               \ \        / /                | |     | | $
| |__| |   ___  | | | |   ___          \ \  /\  / /    ___    _ __  | |   __| | $
|  __  |  / _ \ | | | |  / _ \          \ \/  \/ /    / _ \  | '__| | |  / _` | $
| |  | | |  __/ | | | | | (_) |          \  /\  /    | (_) | | |    | | | (_| | $
|_|  |_|  \___| |_| |_|  \___/            \/  \/      \___/  |_|    |_|  \__,_| $
                                                                                $
                                                                                $
$
```

### example01

```console
                    $
 _   ____    _____  $
/ | |___ \  |___ /  $
| |   __) |   |_ \  $
| |  / __/   ___) | $
|_| |_____| |____/  $
                    $
                    $
$
```

### example02

```console
   _  _             __       ___  $
 _| || |_   ______  \ \     |  _| $
|_  __  _| |______|  \ \    | |   $
 _| || |_   ______    \ \   | |   $
|_  __  _| |______|    \ \  | |   $
  |_||_|                \_\ | |_  $
                            |___| $
                                  $
$
```

### example03

```console
                                  _     _       _                                                    $
                                 | |   | |     (_)                   ___     ____    _____   _  _    $
 ___    ___    _ __ ___     ___  | |_  | |__    _   _ __     __ _   ( _ )   |___ \  |___ /  | || |   $
/ __|  / _ \  | '_ ` _ \   / _ \ | __| |  _ \  | | | '_ \   / _` |  / _ \/\   __) |   |_ \  | || |_  $
\__ \ | (_) | | | | | | | |  __/ \ |_  | | | | | | | | | | | (_| | | (_>  <  / __/   ___) | |__   _| $
|___/  \___/  |_| |_| |_|  \___|  \__| |_| |_| |_| |_| |_|  \__, |  \___/\/ |_____| |____/     |_|   $
                                                             __/ |                                   $
                                                            |___/                                    $
$
```

### example04

```console
         _                  _           __           _       _     _          _                                                            _                                                    $
        | |                | |         / _|         | |     (_)   (_)  _     | |                                                          | |                                                   $
  __ _  | |__     ___    __| |   ___  | |_    __ _  | |__    _     _  | | _  | |  _ __ ___    _ __     ___    _ __     __ _   _ __   ___  | |_   _   _  __   __ __      __ __  __  _   _   ____ $
 / _` | | '_ \   / __|  / _` |  / _ \ |  _|  / _` | |  _ \  | |   | | | |/ / | | | '_ ` _ \  | '_ \   / _ \  | '_ \   / _` | | '__| / __| | __| | | | | \ \ / / \ \ /\ / / \ \/ / | | | | |_  / $
| (_| | | |_) | | (__  | (_| | |  __/ | |   | (_| | | | | | | |   | | |   <  | | | | | | | | | | | | | (_) | | |_) | | (_| | | |    \__ \ \ |_  | |_| |  \ V /   \ V  V /   >  <  | |_| |  / /  $
 \__,_| |_.__/   \___|  \__,_|  \___| |_|    \__, | |_| |_| |_|   | | |_|\_\ |_| |_| |_| |_| |_| |_|  \___/  | .__/   \__, | |_|    |___/  \__|  \__,_|   \_/     \_/\_/   /_/\_\  \__, | /___| $
                                              __/ |              _/ |                                        | |         | |                                                       __/ /        $
                                             |___/              |__/                                         |_|         |_|                                                      |___/         $
$
```

### example05

```console
__       _   _ _           _  _      _    _   __           _    __ __       _                                   __ $
\ \     | | ( | )        _| || |_   | |  (_) / /   ___    ( )  / / \ \   /\| |/\     _                         / / $
 \ \    | |  V V        |_  __  _| / __)    / /   ( _ )   |/  | |   | |  \ ` ' /   _| |_       ______         / /  $
  \ \   | |              _| || |_  \__ \   / /    / _ \/\     | |   | | |_     _| |_   _|     |______|       / /   $
   \ \  |_|             |_  __  _| (   /  / / _  | (_>  <     | |   | |  / , . \    |_|    _            _   / /    $
    \_\ (_)               |_||_|    |_|  /_/ (_)  \___/\/     | |   | |  \/|_|\/          ( )          (_) /_/     $
                                                               \_\ /_/                    |/                       $
                                                                                                                   $
$
```

### example06

```console
           __          __     ___             $
 _   _    / /  ______  \ \   |__ \     ____   $
(_) (_)  | |  |______|  | |     ) |   / __ \  $
        / /    ______    \ \   / /   / / _` | $
 _   _  \ \   |______|   / /  |_|   | | (_| | $
(_) ( )  | |            | |   (_)    \ \__,_| $
    |/    \_\          /_/            \____/  $
                                              $
$
```

### example07

```console
            ____     _____   _____    ______   ______    _____   _    _   _____        _   _  __  _        __  __   _   _    ____    _____     ____    _____     _____   _______   _    _  __      __ __          __ __   __ __     __  ______ $
    /\     |  _ \   / ____| |  __ \  |  ____| |  ____|  / ____| | |  | | |_   _|      | | | |/ / | |      |  \/  | | \ | |  / __ \  |  __ \   / __ \  |  __ \   / ____| |__   __| | |  | | \ \    / / \ \        / / \ \ / / \ \   / / |___  / $
   /  \    | |_) | | |      | |  | | | |__    | |__    | |  __  | |__| |   | |        | | | ' /  | |      | \  / | |  \| | | |  | | | |__) | | |  | | | |__) | | (___      | |    | |  | |  \ \  / /   \ \  /\  / /   \ V /   \ \_/ /     / /  $
  / /\ \   |  _ <  | |      | |  | | |  __|   |  __|   | | |_ | |  __  |   | |    _   | | |  <   | |      | |\/| | | . ` | | |  | | |  ___/  | |  | | |  _  /   \___ \     | |    | |  | |   \ \/ /     \ \/  \/ /     > <     \   /     / /   $
 / ____ \  | |_) | | |____  | |__| | | |____  | |      | |__| | | |  | |  _| |_  | |__| | | . \  | |____  | |  | | | |\  | | |__| | | |      | |__| | | | \ \   ____) |    | |    | |__| |    \  /       \  /\  /     / . \     | |     / /__  $
/_/    \_\ |____/   \_____| |_____/  |______| |_|       \_____| |_|  |_| |_____|  \____/  |_|\_\ |______| |_|  |_| |_| \_|  \____/  |_|       \___\_\ |_|  \_\ |_____/     |_|     \____/      \/         \/  \/     /_/ \_\    |_|    /_____| $
                                                                                                                                                                                                                                               $
                                                                                                                                                                                                                                               $
$
```