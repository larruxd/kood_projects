package main

import "unicode"

type tokenKind int64

const (
	NoKind tokenKind = iota
	Word
	WhiteSpace
	Punctuation
	Quote
	Operation
)

type opData struct {
	ptr   *func(str string) string
	count int
}

type token struct {
	str  string
	kind tokenKind
	op   opData
}

func getPunctuation() map[rune]bool {
	return map[rune]bool{
		'.': false,
		',': false,
		'!': false,
		'?': false,
		':': false,
		';': false,
	}
}

func getTokenKind(r rune) tokenKind {
	if unicode.IsSpace(r) {
		return WhiteSpace
	}

	punctuation := getPunctuation()

	if _, exists := punctuation[r]; exists {
		return Punctuation
	}

	if r == '\'' {
		return Quote
	}

	return Word
}

func tokenize(str string) []token {
	var tokens []token

	currentKind := NoKind
	start := 0

	// Skips last character bug
	for i, r := range str {
		if i < start {
			continue
		}

		addToken := func(tokenStr string, kind tokenKind, function *func(str string) string, count int) {
			if currentKind != NoKind {
				tokens = append(tokens, token{tokenStr, kind, opData{function, count}})
			}
		}

		addCurrentToken := func() {
			addToken(str[start:i], currentKind, nil, 0)
		}

		// 1. Checks if it is an operation Operation and creates token
		// 2. Checks Word token types
		// 3. Get's last token
		if valid, count, function, snippet := getOperation(str[i:]); valid {
			addCurrentToken()
			addToken(snippet, Operation, &function, count)

			start = i + len(snippet)
			currentKind = NoKind
		} else {
			if runeKind := getTokenKind(r); runeKind != currentKind {
				addCurrentToken()

				start = i
				currentKind = runeKind
			}

			if i == len(str)-1 {
				addToken(str[start:i+1], currentKind, nil, 0)
			}
		}
	}
	return tokens
}

func correctArticle(article, noun string) string {
	type sound int64

	const (
		Consonant sound = iota
		Vowel
		NonLetter
	)

	soundType := func(r rune) sound {
		vowels := map[rune]bool{
			'a': false,
			'e': false,
			'i': false,
			'o': false,
			'u': false,
			'h': false,
		}

		if unicode.IsLetter(r) {
			_, isVowel := vowels[unicode.ToLower(r)]
			if isVowel {
				return Vowel
			}
			return Consonant
		}
		return NonLetter
	}

	wordBeginsWith := func(str string) sound {
		var r rune
		if len(str) > 0 {
			runes := []rune(str)
			r = runes[0]
		}
		return soundType(r)
	}

	if len(noun) > 0 {
		if toLowerCase(article) == "a" && wordBeginsWith(noun) == Vowel {
			return article[0:1] + "n"
		}

		if toLowerCase(article) == "an" && wordBeginsWith(noun) == Consonant {
			return article[0:1]
		}
	}

	return article
}
