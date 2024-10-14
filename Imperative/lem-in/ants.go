package main

import (
	"fmt"
	"strconv"
	"strings"
)

type Ant struct {
	Num  int
	Pos  string
	Path []string
}

// move all ants through the paths
func moveAnts(data *Data, paths *[][]string) {
	occupied := make(map[string]bool)
	allPaths := *paths
	startRoom := (allPaths)[0][0]
	endRoom := (allPaths)[len(allPaths)-1][len((allPaths)[len(allPaths)-1])-1]
	var antsInEnd []int
	ants := ants(int(data.Ants), startRoom)
	turn := 0
	for ; ; turn++ {
		antsMoved := 0
		for i := 0; i < len(ants); i++ {
			ant := &ants[i]
			tempPaths := [][]string{}
			if ant.Num == len(ants) {
				tempPaths = append(tempPaths, (allPaths)[0])
			} else {
				tempPaths = allPaths
			}
			if ant.Pos == endRoom {
				antsMoved++
				occupied[ant.Pos] = false
				if !isAntInLastRoom(ant, antsInEnd) {
					antsInEnd = append(antsInEnd, ant.Num)
					continue
				}
			}
			for index := range tempPaths {
				for j := 0; j < len(allPaths[index]); j++ {
					if ant.Pos != allPaths[index][j] {
						continue
					}
					if j == len(allPaths[index])-1 {
						break
					}
					nextRoom := allPaths[index][j+1]
					if occupied[nextRoom] || isRoomEmpty(ants, ant.Pos, nextRoom, antsInEnd) {
						continue
					}
					occupied[ant.Pos] = false
					ant.Pos = nextRoom
					ant.Path = append(ant.Path, ant.Pos)
					if nextRoom != endRoom {
						occupied[ant.Pos] = true
					}
					antsMoved++
					break
				}
			}
		}
		printAntMovement(data, ants, &allPaths, antsInEnd)
		if len(antsInEnd) == len(ants) {
			break
		}
		fmt.Println()
	}
	fmt.Printf("\nAmount of turns: %d\n", turn)
}

func printAntMovement(data *Data, ants []Ant, allPaths *[][]string, antsInEnd []int) {
	for i := 0; i < len(ants); i++ {
		ant := ants[i]
		if ant.Pos != (*allPaths)[len((*allPaths))-1][0] && !isAntInLastRoom(&ant, antsInEnd) {
			output := "L" + strconv.Itoa(ant.Num) + "-"
			fmt.Print(output)
			for _, rooms := range data.Rooms {
				for room := range rooms {
					if x := strings.Split(room, " "); len(x) > 1 {
						room = x[1]
					}
					if room == ant.Pos {
						fmt.Print(room)
						break
					}
				}
			}
			fmt.Print(" ")
		}
	}
}

// checks if room is empty
func isRoomEmpty(ants []Ant, antPos string, nextRoom string, antsInEnd []int) bool {
	for _, ant := range ants {
		if x := len(ant.Path); x == 0 || x == 1 {
			return false
		}
		if ant.Path[len(ant.Path)-2] == antPos && ant.Path[len(ant.Path)-1] == nextRoom && !isAntInLastRoom(&ant, antsInEnd) {
			return true
		}
	}
	return false
}

// checks if ant is in last room
func isAntInLastRoom(ant *Ant, antsInEnd []int) bool {
	var isInEnd bool
	for _, r := range antsInEnd {
		if r == ant.Num {
			isInEnd = true
		}
	}
	return isInEnd
}

// populates the ants struct and adds start room in path
func ants(ant int, startRoom string) []Ant {
	var ants []Ant
	for i := 1; i <= ant; i++ {
		var ant Ant
		ant.Num = i
		ant.Pos = startRoom
		ant.Path = append(ant.Path, ant.Pos)
		ants = append(ants, ant)
	}
	return ants
}
