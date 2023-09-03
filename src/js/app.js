const fs = require("fs");
var path = require("path");

fs.readFile(
    path.resolve(__dirname, "../resources/_wordlist.txt"),
    "utf8",
    (err, data) => {
        if (err) {
            console.error(err);
            return;
        }

        const words = getWords(data);
        const filteredWords = filterWords(words);

        let pairings = pairWords(filteredWords);
        pairings = flattenAndStringify(pairings);
 
        let resultString = "";
        for (let i = 0; i < pairings.length; i++) {
            resultString += pairings[i] + "\n";
        }
        
        fs.appendFile( path.resolve(__dirname, "../resources/pairings.txt"), resultString, (err) => {
            if (err) throw err;
            console.log('The "data to append" was appended to file!');
          });
    }
);

/*
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
HIGH LEVEL FUNCTIONS / REQUIREMENT FUNCTIONS
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
*/

function pairWords(words) {
    const pairs = [];
    while (words.length > 0) {
        let word1 = words[0];
        let wordLength = word1.length;
        const groupIndex = getDeterminantGroupIndex(word1);
        const rhymingPart = getRhymingString(word1, groupIndex);

        for (let c = 0; c < words.length; c++) {
            const word2 = words[c];
            const rhymingPartWord2 = getRhymingString(word2, getDeterminantGroupIndex(word2))
            if ((word2.toLowerCase() == word1.toLowerCase())) continue;
            if (isIncompatibleLengthsForRhyming(word1, word2)) continue;
            if (oneIsPartOfOther(word1, word2)) continue;
            if (doRhyme(rhymingPart, rhymingPartWord2)) pairs.push([word1, word2]);
        }
        words.shift();
    }
 


    const str = pairs.reduce((prev, curr) => {
        return prev.toString() + "\n" + curr.toString();
    })

    return pairs
}

function doRhyme(rhymingPart, rhymingPartWord2) {
    if ((rhymingPart === rhymingPartWord2)) return true;
    return false;
}

function getDeterminantGroupIndex(word) {
    var re = /[AEIOUÄÖÜaeiouäöü]+/g;
    const matchIndexes = [];
    const groups = [];
    
    while ((match = re.exec(word)) != null) {
        matchIndexes.push(match.index);
        groups.push(match);
    }

    const numberOfGroups = matchIndexes.length;

    if (numberOfGroups > 1) return matchIndexes[numberOfGroups - 2];
    else return matchIndexes[0];
}

function getRhymingString(word, index) {
    return word.substring(index);
}

function isLessThanHalf(word, rhymingPartIndex) {
    const part1 = word.substring(0, rhymingPartIndex);
    const part2 = word.substring(rhymingPartIndex);

    return part1.length > part2.length;
}

function oneIsPartOfOther(word1, word2) {
    return word1.endsWith(word2.toLowerCase()) || word2.endsWith(word1.toLowerCase());
}

/*
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
HELPER FUNCTIONS
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
*/

function getWords(text) {
    const words = text.split("\n");
    return words;
}

function filterWords(words) {
    const filtered = [];

    for (let i = 0; i < words.length; i++) {
        let word = words[i];
        let wordLength = word.length;

        if (isTooShort(wordLength)) continue;
        if (isOnlyConsonants(word)) continue;
        if (endsOnConsonant(word) && wordLength === 2) continue;
        if (isLessThanHalf(word, getDeterminantGroupIndex(word))) continue;
        filtered.push(word);
    }

    return filtered;
}

function isTooShort(length) {
    if (length === 1) return true;
    return false;
}

function isOnlyConsonants(str) {
    if (!str.match(/[AEIOUÄÖÜaeiouäöü]/)) return true;
    return false;
}

function endsOnConsonant(str) {
    let lastLetter = str[str.length - 1];
    if (lastLetter.match(/[^aeiouäöü]/)) return true;
    return false;
}

function isIncompatibleLengthsForRhyming(word1, word2) {
    const numberOfGroupsWord1 = word1.match(/[AEIOUÄÖÜaeiouäöü]+/g).length;
    const numberOfGroupsWord2 = word2.match(/[AEIOUÄÖÜaeiouäöü]+/g).length;

    return isUnmatchingGroupNumbers(numberOfGroupsWord1, numberOfGroupsWord2);
}

function isUnmatchingGroupNumbers(number1, number2) {
    return ((number1 === 1 && number2 > number1) || (number1 === 1 && number2 > number1))
}

function flattenAndStringify(arr) {
    const result = arr.map(item => 
        item[0] + " - " + item[1]
    )
    return result;
}