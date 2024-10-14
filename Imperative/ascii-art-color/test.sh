echo TESTING go run . --color red "'banana'"
go run . --color red "banana"
echo ________________________________________
echo TESTING go run . --color=red "'hello world'"
go run . --color=red "hello world"
echo ________________________________________
echo TESTING go run . --color=green "'1 + 1 = 2'"
go run . --color=green "1 + 1 = 2"
echo ________________________________________
echo TESTING go run . --color=yellow "'(%&) ??'"
go run . --color=yellow "(%&) ??"
echo ________________________________________
echo TESTING go run . --color=blue "'anana'" "'banana'"
go run . --color=blue "anana" "banana"
echo ________________________________________
echo TESTING go run . --color=purple "'e'" "'Hello World'"
go run . --color=purple "e" "Hello World"
echo ________________________________________
echo TESTING go run . --color=yellow "'Wo'" "'Hello World'"
go run . --color=yellow "Wo" "Hello World"
echo ________________________________________
echo TESTING go run . --color=cyan "'GuYs'" "'HeY GuYs'"
go run . --color=cyan "GuYs" "HeY GuYs"
echo ________________________________________
echo TESTING go run . --color=blue "'B'" "'RGB()'"
go run . --color=blue 'B' 'RGB()'
echo ________________________________________
echo TESTING go run . --color=orange "'hElLo wOrlD'"
go run . --color=orange "hElLo wOrlD"
echo ________________________________________
echo TESTING go run . --color=yellow "'123 abc'"
go run . --color=yellow "123 abc"
echo ________________________________________
echo TESTING go run . --color=green "'}'" "'[&]{}%?+/'"
go run . --color=green "}" "[&]{}%?+/"
echo ________________________________________
echo TESTING go run . --color=cyan "'61B'" "'h[%l61B }+A!s'"
go run . --color=cyan "61B" "h[%l61B }+A!s"
echo ________________________________________
echo TEST DONE!
