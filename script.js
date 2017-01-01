
function WordCountSetup() {
    "use strict";
    
    function error(msg) {
        console.log(msg);
        window.alert(msg);
    }

    const elButton = document.getElementById("analyze");
    const elText = document.getElementById("analytics-text");
    const elSightWords = document.getElementById("sight-words");
    const elElements = document.getElementById("elements");
    
    const vowels = "aeiou".split("");
    const consonants = "bcdfghjklmnpqrstvwxyz".split("");
    const digraphs = ["ck", "th", "sh", "ch", "ph", "wh", "gh", "kn", "wr", "mb", "qu"];
    const trigraphs = ["dge", "tch"];
    const consonantBlends = [
                "bl", "br", "cl", "cr", "dr", "fl", "fr", "gl", "gr", "pl", "pr",
				"sc", "sk", "sl", "sm", "sn", "sp", "st", "sw", "tr", "tw",
                "sch", "scr", "spl", "spr", "squ", "str"];
				
	const initialSight = ["the", "a", "was", "said"];
	
	// some special ones plus others from http://grammar.about.com/od/words/a/comsuffixes.htm
	const suffixes = [ "'s", "s", "ing", "ed",
	
				"acy", "al", "ance", "ence", "dom", "er", "or", "ism", "ist",
				"ity", "ty", "ment", "ness", "ship", "sion", "tion", "ate", "en", "ify",
				"fy", "ize", "ise", "able", "ible", "al", "esque", "ful", "ic", "ical",
				"ious", "ous", "ish", "ive", "less", "y"];
    
    if (!elButton || !elText ||!elElements || !elSightWords) {
        error("Button/Series/Title/Text not found");
    }

    function getWords(data) {
        data = data.toLocaleLowerCase();
        data = data.replace(/\s*\n/g, "  ");
        data = data.replace(/\s*\r/g, "  ");
        data = data.replace(/[-",!?.0-9]/g, "");
        data = data.trim();
        let words = data.split(/ +/g);
        return words
    }
    
    function intersect(letters, words) {
        let used = [];
        for (let i = 0; i < letters.length; i++) {
            const v = letters[i];
            for (let j = 0; j < words.length; j++) {
                if (words[j].includes(v)) {
                    used.push(v);
                    break;
                }
            }
        }
        return used;
    }
	
	function beginnings(words) {
		// add y in as a vowel
		const vwls = "[" + vowels.join("") + "y]";
		const re = new RegExp(vwls);
		return words.map(w => w.split(re, 2)[0]);
	}
    
    function getVowels(words) {
        return "Vowels\n" + (intersect(vowels, words).join(", ") || "n/a");
    }
    
    function getDigraphs(words) {
        return "Digraphs\n" + (intersect(digraphs, words).join(", ") || "n/a");
    }

    function getTrigraphs(words) {
        return "Trigraphs\n" + (intersect(trigraphs, words).join(", ") || "n/a");
    }

    function getConsonants(words) {
        return "Consonants\n" + (intersect(consonants, words).join(", ") || "n/a");
    }
    
    function getSightWords(sight, words) {
        return "Sight Words\n" + (intersect(sight, words).join(", ") || "n/a");
    }

    function getBlends(words) {
		let used = [];
		let startings = beginnings(words);
        let blends = consonantBlends.filter(b => startings.indexOf(b) >= 0);
        return "Beginning Blends\n" + (blends.join(", ") || "n/a");
    }
    
    function getWordCount(words) {
        return "Word Count\n" + words.length;
    }
    
    function getBeginnings(words) {
        return "Beginnings\nNot Implemented";
    }

    function getEndings(words) {
		const tosearch = suffixes.slice();
		// sort longest first.
		tosearch.sort((a, b) => b.length - a.length);
		const seen = new Map()
		words.forEach(w => {
			for (let i = 0; i < tosearch.length; i++) {
				const s = tosearch[i];
				if (s.length >= w.length) {
					continue;
				}
				if (!w.endsWith(s)) {
					continue;
				}
				seen.set(s, 1);
				break;
			}
		});
		
		const used = [];
		suffixes.forEach(s => {
			if (seen.get(s)) {
				used.push(s);
			}
		});
		
        return "Endings\n"  + (used.join(", ") || "n/a");
    }
    
    function getWordList(words) {
        return "Words normalized\n'" + words.join("' '") + "'";
    }

    

    function processBook() {
        const book = elText.value;
        
        let words = getWords(book)
        let sight = getWords(elSightWords.value)
        
        let parts = [
            getVowels(words),
            getDigraphs(words),
            getTrigraphs(words),
            getConsonants(words),
            getSightWords(sight, words),
            getBlends(words),
            getWordCount(words),
            getBeginnings(words),
            getEndings(words),
            getWordList(words)
        ];
        
        let output = parts.join("\n\n");
        elElements.value = output;
    }   
    
    if (elButton.addEventListener)
        elButton.addEventListener("click", processBook, false);
    else if (elButton.attachEvent)
        elButton.attachEvent('onclick', processBook);
	
	elSightWords.value = initialSight.join(", ");

}


if (window.addEventListener)
  window.addEventListener("load", WordCountSetup, false);
else if (window.attachEvent)
  window.attachEvent("onload", WordCountSetup);
else window.onload = WordCountSetup;