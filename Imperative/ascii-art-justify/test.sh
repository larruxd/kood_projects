#!/bin/bash

echo "Ascii-art-justify program testing"
echo
echo "Testing: --align right something standard"
echo
go run . --align right something standard

read -p "Next: --align=right left standard, Press any key to continue" -n1 -s
echo 
go run . --align=right left standard

read -p "Next: --align=left right standard , Press any key to continue" -n1 -s
echo 
go run . --align=left right standard 

read -p "Next: --align=center hello shadow, Press any key to continue" -n1 -s
echo 
go run . --align=center hello shadow

read -p "Next: --align=justify \"1 Two 4\" shadow, Press any key to continue" -n1 -s
echo 
go run . --align=justify "1 Two 4" shadow

read -p "Next: --align=right 23/32 standard, Press any key to continue" -n1 -s
echo 
go run . --align=right 23/32 standard

read -p "Next: --align=right ABCabc123 thinkertoy, Press any key to continue" -n1 -s
echo 
go run . --align=right ABCabc123 thinkertoy

read -p "Next: --align=center \"#$%&\"\" thinkertoy, Press any key to continue" -n1 -s
echo
go run . --align=center "#$%&\"" thinkertoy

read -p "Next: --align=left '23Hello World!' standard, Press any key to continue " -n1 -s
echo
go run . --align=left '23Hello World!' standard 

read -p "Next: --align=justify 'HELLO there HOW are YOU?!' thinkertoy, Press any key to continue" -n1 -s
echo 
go run . --align=justify 'HELLO there HOW are YOU?!' thinkertoy

read -p "Next: --align=right \"a -> A b -> B c -> C\" shadow, Press any key to continue" -n1 -s
echo 
go run . --align=right "a -> A b -> B c -> C" shadow

read -p "Next: --align=right abcd shadow, Press any key to continue" -n1 -s
echo 
go run . --align=right abcd shadow

read -p "Next: --align=center ola standard, Press any key to continue" -n1 -s
echo 
go run . --align=center ola standard

read -p "Next: random string with lower and upper case letters, and the align flag (\"--align=\") followed by a random alignment, Press any key to continue" -n1 -s
echo 
go run . --align=center 123abc standard

read -p "Next: random string with lower case letters, numbers and spaces, and the align flag (\"--align=\") followed by a random alignment, Press any key to continue" -n1 -s
echo 
go run . --align=left "123 abc" standard

read -p "Next: random string with special characters, and the align flag (\"--align=\") followed by a random alignment, Press any key to continue" -n1 -s
echo 
go run . --align=justify "123 abc $&" standard

read -p "Next: random string with lower, upper case, spaces and numbers letters, and the align flag (\"--align=\") followed by a random alignment, Press any key to continue" -n1 -s
echo 
go run . --align=right "123 aBc $&" standard