go run . "" standard | cat -e
go run . "\n" shadow | cat -e
go run . "Hello\n" thinkertoy| cat -e
go run . "hello" standard | cat -e
go run . "Hello There!" shadow | cat -e
go run . "Hello\nThere!" thinkertoy | cat -e
go run . "Hello\n\nThere" shadow | cat -e
go run . "!#%&/()=@{[]}+-" standard | cat -e