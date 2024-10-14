package main

import (
	"strconv"
	"strings"
)

func hexToDecimal(str string) string {

	value, _ := strconv.ParseUint(str, 16, 64)

	return strconv.FormatUint(value, 10)
}

func binToDecimal(str string) string {

	value, _ := strconv.ParseUint(str, 2, 64)

	return strconv.FormatUint(value, 10)
}

func toUpperCase(str string) string {
	return strings.ToUpper(str)
}

func toLowerCase(str string) string {
	return strings.ToLower(str)
}

func capitalize(str string) string {
	return strings.Title(str)
}
