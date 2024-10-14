package main

import (
	"fmt"
	"os"
	"sort"
	"strings"
)

func paths(data *Data) [][]string {

	roomsSlice := roomsNeighbors(data)
	startRoom := ""
	for _, room := range roomsSlice {
		if room.Start {
			startRoom = room.Name
			break
		}
	}

	visitedRooms := make(map[string]bool)
	allPaths := [][]string{}
	findAllPaths(roomsSlice, startRoom, visitedRooms, []string{}, &allPaths)

	if len(allPaths) == 0 {
		fmt.Println(errPath)
		os.Exit(0)
	}
	return allPaths
}

func roomsNeighbors(data *Data) []Rooms {

	var roomsData = make([]Rooms, len(data.Rooms))
	i := 0
	for _, roomMap := range data.Rooms {
		for name, _ := range roomMap {

			if y := strings.Split(name, " "); y[0] == "start" {
				name = y[1]
				roomsData[i].Start = true
			} else if y[0] == "end" {
				name = y[1]
				roomsData[i].End = true
			}
			for _, link := range data.Links {
				if link[0] == name {
					roomsData[i].Name = name
					roomsData[i].Neighbors = append(roomsData[i].Neighbors, link[1])
				}
				if link[1] == name {
					roomsData[i].Name = name
					roomsData[i].Neighbors = append(roomsData[i].Neighbors, link[0])
				}
			}
		}
		i++
	}
	return roomsData
}

func findAllPaths(roomsSlice []Rooms, currentRoom string, visitedRooms map[string]bool, path []string, allPaths *[][]string) {
	// Mark the current room as visited and add it to the path
	visitedRooms[currentRoom] = true
	path = append(path, currentRoom)

	// If the current room is the end point, add the path to allPaths
	if isEndRoom(roomsSlice, currentRoom) {
		*allPaths = append(*allPaths, append([]string{}, path...))
	} else {
		// Traverse all neighbors of the current room
		for _, neighbor := range getNeighbors(roomsSlice, currentRoom) {
			// Visit unvisited neighbors only
			if !visitedRooms[neighbor] {
				// Recursively find all paths starting from the neighbor
				findAllPaths(roomsSlice, neighbor, visitedRooms, path, allPaths)
			}
		}
	}
	// Mark the current room as unvisited
	visitedRooms[currentRoom] = false
}

func isEndRoom(roomsSlice []Rooms, roomName string) bool {
	for _, room := range roomsSlice {
		if room.Name == roomName && room.End {
			return true
		}
	}
	return false
}

func getNeighbors(roomsSlice []Rooms, roomName string) []string {
	for _, room := range roomsSlice {
		if room.Name == roomName {
			return room.Neighbors
		}
	}
	return nil
}

func uniquePaths(allPaths *[][]string) map[int][][]string {

	sortByLength(allPaths)

	var pathsIntersect bool
	unique := make(map[int][][]string)

	for x, pathX := range *allPaths {
		unique[x] = append(unique[x], pathX)
		for y, pathY := range *allPaths {
			if x == y {
				continue
			}
			if !intersects(pathX, pathY) {
				pathsIntersect = false
				for _, pathZ := range unique[x] {
					if intersects(pathY, pathZ) {
						pathsIntersect = true
						break
					}
				}
				if !pathsIntersect {
					unique[x] = append(unique[x], pathY)
				}
			}
		}
	}
	return unique
}

func intersects(path1 []string, path2 []string) bool {
	var intersects bool
	for _, x := range path1[1 : len(path1)-1] {
		for _, y := range path2[1 : len(path2)-1] {

			if string(x) == string(y) {
				intersects = true
				return intersects
			}
		}
	}
	return intersects
}

func requiredPaths(unique *map[int][][]string, ants int) *[][]string {
	var required [][]string
	finalSteps := 0
	for _, paths := range *unique {
		steps := ants
		for _, path := range paths {
			steps += len(path)
		}

		dividedSteps := steps / len(paths)
		if finalSteps == 0 || finalSteps > dividedSteps {
			finalSteps = dividedSteps
			required = paths
		}
	}
	return sortByLength(&required)
}

func sortByLength(paths *[][]string) *[][]string {
	sort.Slice(*paths, func(i, j int) bool {
		return len((*paths)[i]) < len((*paths)[j])
	})
	return paths
}
