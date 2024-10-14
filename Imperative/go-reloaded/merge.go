package main

func mergeTokens(tokens []token) string {
	str := ""

	inQuoute := false

	for i := range tokens {
		buffer := ""
		spaceBefore := ""
		spaceAfter := ""

		writeString := func() {
			str += spaceBefore + buffer + spaceAfter
			buffer, spaceBefore, spaceAfter = "", "", ""
		}

		// Adds punctuation
		if tokens[i].kind == Punctuation {
			buffer = tokens[i].str
			for tokenIndex := i + 1; tokenIndex < len(tokens); tokenIndex++ {
				if tokens[tokenIndex].kind == Word {
					spaceAfter = " "
					break
				}
			}
		}

		// Adds words
		if tokens[i].kind == Word {
			// Indefinite article check (a/an)
			if toLowerCase(tokens[i].str) == "a" || toLowerCase(tokens[i].str) == "an" {
				for nextToken := i + 1; nextToken < len(tokens); nextToken++ {
					if tokens[nextToken].kind == Punctuation {
						break
					}

					if tokens[nextToken].kind == Word {
						tokens[i].str = correctArticle(tokens[i].str, tokens[nextToken].str)
						break
					}
				}
			}

			buffer = tokens[i].str

			// Add space after word
			for nextToken := i + 1; nextToken < len(tokens); nextToken++ {
				if tokens[nextToken].kind == WhiteSpace || tokens[nextToken].kind == Operation {
					continue
				} else if tokens[nextToken].kind == Word {
					spaceAfter = " "
				} else {
					break
				}
			}
		}

		// Adds quotes
		if tokens[i].kind == Quote {
			buffer = tokens[i].str
			if i == 0 || tokens[i-1].kind == WhiteSpace || i >= len(tokens)-1 || tokens[i+1].kind == WhiteSpace {
				if inQuoute {
					spaceAfter = " "
				} else {
					for tokenIndex := i - 1; tokenIndex >= 0; tokenIndex-- {
						if tokens[tokenIndex].kind == Word {
							spaceBefore = " "
							break
						}
						if tokens[tokenIndex].kind == Punctuation {
							break
						}
					}
				}
				inQuoute = !inQuoute
			}
		}

		// Removes spaces from start and end of string
		if i == 0 {
			spaceBefore = ""
		}
		if i == len(tokens)-1 {
			spaceAfter = ""
		}

		writeString()
	}
	return str
}
