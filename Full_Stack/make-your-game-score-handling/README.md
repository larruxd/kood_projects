# Make-your-game-score-handling

## Description

It's Pacman.

This project has an implemented scoreboard to see how you compare to other players.

## Implementation

The scoreboard gets its data from the server by making a GET request. Data is stored inside `scoreboard.json` file.
When player finishes the game, inputs their name and clicks "submit score", a POST request gets made to the server, the server then decodes the request, adds the data to the json file and lastly sorts the data based on score and time. If two players have the same score the player with better time gets a better position on the scoreboard.

## How To Run

1. Clone the repo.
2. Use `go run .` or `go run server.go` in the terminal and go to [http://localhost:8080] in your browser.

## How to Play

1. Press start.
2. Arrow keys to move.
3. "Esc" or "Space" keys to pause/unpause the game.

## Testing

For easier testing you can change the map at `tileMap.js` line `75` by changing `map = this.maps[1];` to `map = this.maps[2];`

## Links

[score-handling](https://github.com/01-edu/public/tree/master/subjects/make-your-game/score-handling)

[audit](https://github.com/01-edu/public/blob/master/subjects/make-your-game/score-handling/audit.md)

## Authors

[MarkusKa](https://01.kood.tech/git/MarkusKa)

[laurilaretei](https://01.kood.tech/git/laurilaretei)
