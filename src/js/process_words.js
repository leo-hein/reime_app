const fs = require("fs");
var path = require("path");

const wordSet = new Set();

// fs.readFile('/Users/leohein/Projekte/Spielwiese/Algorithmik/BWINF/_41/src/js/raw_data.txt', 'utf8', (err, data) => {
fs.readFile(path.resolve(__dirname, "./raw_data.txt"), "utf8", (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(typeof data);
    // let words = [...data.matchAll(/[a-z]/ig)];
    let words = data.match(/[a-zäöü]+/gi);
    // console.log(words);

    words.forEach((item) => {
        wordSet.add(item);
    });

    let text = "";

    wordSet.forEach((item) => {
        text += item + "\n";
    })
    // console.log(wordSet);

    // wordSet.forEach((item) => console.log(item));
    
    fs.writeFile(path.resolve(__dirname, '/Users/leohein/Projekte/Spielwiese/Algorithmik/BWINF/_41/src/resources/wordlist.txt') , text, err => {
        if (err) {
          console.error(err);
        }
        // file written successfully
      });
});
