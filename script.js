
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
				
	const initialSight = ["the", "a", "was", "said", "to", "of", "their", "they", "one", "from", "some", "are", "live", "were", "there", "have", "come", "where", "you", "what", "your"];
	
	// some special ones plus others from http://grammar.about.com/od/words/a/comsuffixes.htm
	const suffixes = [ "'s", "s", "ing", "ed",
				"acy", "al", "ance", "ence", "dom", "er", "or", "ism", "ist",
				"ity", "ty", "ment", "ness", "ship", "sion", "tion", "ate", "en", "ify",
				"fy", "ize", "ise", "able", "ible", "al", "esque", "ful", "ic", "ical",
				"ious", "ous", "ish", "ive", "less", "y", "est"];
				
	// some common prefixes: https://www.thoughtco.com/common-prefixes-in-english-1692724
	const prefixes = ["a", "an", "ante", "anti", "auto", "circum", "co", "com", "con", "contra", "contro", 
				"de", "dis", "en", "ex", "extra", "hetero", "homo", "homeo", "hyper", "il", "im", "in", "ir", 
				"in ", "inter", "intra", "intro", "macro", "micro", "mono", "non", "omni", "post", "pre", "pro",
				"sub", "sym", "syn", "tele", "trans", "tri", "un", "uni", "up"];
    
    if (!elButton || !elText ||!elElements || !elSightWords) {
        error("Button/Series/Title/Text not found");
    }

    function getWords(data) {
        data = data.toLocaleLowerCase();
        data = data.replace(/\s*\n/g, "  ");
        data = data.replace(/\s*\r/g, "  ");
        data = data.replace(/[^a-z ]/gi, "");
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
        let used = [];
        for (let i = 0; i < sight.length; i++) {
            const v = sight[i];
            for (let j = 0; j < words.length; j++) {
                if (words[j] === v) {
                    used.push(v);
                    break;
                }
            }
        }
        return "Sight Words\n" + (used.join(", ") || "n/a");
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
	
	function wordSuffixes(word, suffixlist) {
		const sfx = suffixlist.find(s => word.endsWith(s) && word.length > s.length);
		if (!sfx) {
			return [];
		}
		const rest = word.substring(0, word.length - sfx.length);
		const more = wordSuffixes(rest, suffixlist);
		const ret = [];
		if (more.length) {
			ret.push(...more);
		}
		ret.push(sfx)
		return ret;
	}
    
    function getEndings(words) {
		const tosearch = suffixes.slice();
		// sort longest first.
		tosearch.sort((a, b) => b.length - a.length);
		const seen = new Map();
		const seenword = new Map();
		const ordered = [];
		words.forEach(w => {
			if (seenword.has(w)) {
				return;
			}
			const sfxlist = wordSuffixes(w, tosearch);
			sfxlist.forEach(s => seen.set(s, 1));
			seenword.set(w, sfxlist);
			if (sfxlist.length) {
				ordered.push(w);
			}
		});

		ordered.sort();
		const used = [];
		suffixes.forEach(s => {
			if (seen.get(s)) {
				used.push(s);
			}
		});
		
		const report = ordered.map(w => `${w} -> ${seenword.get(w).join('-')}`).join('\n  ');
		
        return `Endings\n${used.join(", ") || "n/a"}\n  ${report}`;
    }
    
	function wordPrefixes(word, prefixlist) {
		const pfx = prefixlist.find(p => word.startsWith(p) && word.length > p.length);
		if (!pfx) {
			return [];
		}
		const rest = word.substring(pfx.length);
		const more = wordPrefixes(rest, prefixlist);
		const ret = [pfx];
		if (more.length) {
			ret.push(...more);
		}
		return ret;
	}
    
    function getBeginnings(words) {
		const tosearch = prefixes.slice();
		// sort longest first.
		tosearch.sort((a, b) => b.length - a.length);
		const seen = new Map();
		const seenword = new Map();
		const ordered = [];
		words.forEach(w => {
			if (seenword.has(w)) {
				return;
			}
			const pfxlist = wordPrefixes(w, tosearch);
			pfxlist.forEach(p => seen.set(p, 1));
			seenword.set(w, pfxlist);
			if (pfxlist.length) {
				ordered.push(w);
			}
		});

		ordered.sort();
		const used = [];
		prefixes.forEach(s => {
			if (seen.get(s)) {
				used.push(s);
			}
		});
		
		const report = ordered.map(w => `${w} -> ${seenword.get(w).join('-')}`).join('\n  ');
		
        return `Beginnings\n${used.join(", ") || "n/a"}\n  ${report}`;
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
