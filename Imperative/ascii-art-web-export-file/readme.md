## Description
This is our web implementation of ascii-art in which it is possible to use a GUI version of the previously created ascii-art-fs program. 

## How to run
Run the program using `go run .`, which opens up the server at `https://localhost:8080`. You must also allow the program through firewall when prompted.

Website has a short description of its function, one dropdown menu where one can select the font to be used and an input box where to place the text to be converted to ascii-art. The text must contain ASCII characters with values 32 to 126 (so no öäüõ etc.)

By pressing "Turn into ASCII art" button, the webpage refreshes and the text is displayed under the previous form

By pressing `Download as .txt file`, the browser should open up a prompt to save the output as a .txt file

## Implementation details
The server is generated and maintained by `net/http` and `html/template` standard GO packages.
Input is gathered from a html based form which is then fed to previously created `ascii-art-fs` program, which in turn returns the text converted to ascii-art in the selected banner style for the html GUI to be displayed.

## Authors
*Karl Küün @kyynkarl
*Lauri @laurilaretei