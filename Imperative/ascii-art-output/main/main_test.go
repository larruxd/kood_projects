package main

import (
	"testing"
)

func TestFixArgs(t *testing.T) {
	have := FixArgs(`Hello\n\nThere`)
	want := "Hello\n\nThere"
	if have != want {
		t.Fatalf("got %v, wanted %v", have, want)
	}
}

/*
func Test_main(t *testing.T) {
	tests := []struct {
		Args   []string
		Output string
	}{
		{
			Args: []string{"", "Hello\\nThere"},
			Output: ` _    _          _   _
| |  | |        | | | |
| |__| |   ___  | | | |   ___
|  __  |  / _ \ | | | |  / _ \
| |  | | |  __/ | | | | | (_) |
|_|  |_|  \___| |_| |_|  \___/


 _______   _
|__   __| | |
   | |    | |__     ___   _ __    ___
   | |    |  _ \   / _ \ | '__|  / _ \
   | |    | | | | |  __/ | |    |  __/
   |_|    |_| |_|  \___| |_|     \___|


`,
		},
	}
	for _, tt := range tests {
		// Initialize test.
		os.Args = tt.Args
		out := bytes.NewBuffer(nil)
		// Run main() function.
		main()
		// Evaluate the output.
		if actual := out.(*bytes.Buffer).String(); actual != tt.Output {
			t.Errorf("expected \n%s, but got \n%s", tt.Output, actual)
		}
	}
}
*/
