var mapObjects = new Map();
var uniqueStreets;
var streetsCount;
var streetsCountStr;
var countM = parseInt(0);
var countF = parseInt(0);
var countO = parseInt(0);
const numbers = "0123456789";
const target = document.getElementById("numberOfStreets");
const COMMON_STREET_WORDS = [
    "Rue", "de", "la", "le", "du", "Avenue", "Chemin", "Route", "Tunnel",
    "Allée", "Place", "Voie", "Boulevard", "des", "Impasse", "Quai",
    "Grande", "et", "du", "les", "", "Montée"
];
const queryRequest = `
[out:json];
area(id:3600120965)->.searchArea;
(
  way["highway"]["name"](area.searchArea);
);
out;
`;

await fetch('Liste_Prenoms.json')
	.then(response => {
		if (!response.ok) {
			throw new Error("Network response wasn't ok");
		}
		return response.json()
	})
	.then(data => {
		for (let i=0; i<data.length; i++) {
			mapObjects.set(data[i].name.charAt(0).toLowerCase() + data[i].name.slice(1), data[i].genre);
		}
		console.log(mapObjects);
	})
	.catch(error => console.error('Error loading listePrenoms.json:', error));




async function getStreetArray(queryRequest) {
	return fetch("https://overpass-api.de/api/interpreter", {
		method: 'POST',
		mode: 'cors',
		body: "data=" + encodeURIComponent(queryRequest)
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return (response.json());
		})
		.then((data) => {
			if (data && data.elements) {
				uniqueStreets = Array.from(new Set(data.elements.map(element => element.tags.name))).filter(Boolean);
				streetsCount = uniqueStreets.length;
				streetsCountStr = streetsCount.toString();
				return (uniqueStreets);
			} else {
				throw new Error('Invalid Data Format');
			}
		})
		.catch(error => {
			console.error('There was a problem with the fetch operation:', error);
		});
}


function loaderStr(target) {
	console.log("tout de suite");
	let iterations = 0;
	let interval = setInterval(() => {
		console.log("tard")
		target.innerText = target.innerText.split("")
		.map((number, index) => {
			if (index < iterations) {
				return streetsCountStr[index];
			}
			return numbers[Math.floor(Math.random() * 10)]
		})
		.join("");
		if (iterations >= 4) {
			clearInterval(interval);
		}

		iterations += 1/10; 
	}, 50);
}

function loaderGlobal(target) {
	let iterations = 0;
	let interval = setInterval(() => {
		let nbr = "";
		for (let i=0; i<4; i++) {
			nbr += Math.floor(Math.random() * 10).toString();
		}
		target.innerText = nbr;
		if (iterations >= 4) {
			clearInterval(interval);
		}

		iterations += 1/10; 
	}, 50);
}

async function countGenre() {
	loaderGlobal(target);
	let streets = await getStreetArray(queryRequest);
	loaderStr(target);
	// document.getElementById("numberOfStreets").onmouseover = event => {
	// 	loaderStr(event.target);
	// }

	for (let i = 0; i < streets.length; i++) {
		let tempTab = streets[i].split(/\s|(?<=l'|s'|d'|L'|S'|D'|Saint-)|-/).filter(Boolean);
		for (let j = 0; j < tempTab.length; j++) {
			if (COMMON_STREET_WORDS.includes(tempTab[j])) {
				continue;
			} else {
				tempTab[j] = tempTab[j].charAt(0).toLowerCase() + tempTab[j].slice(1);
				if (mapObjects.get(tempTab[j]) === 'f') {
					countF += 1;
					break;
				} else if (mapObjects.get(tempTab[j]) === 'm') {
					countM += 1;
					break;
				}
				if (j + 1 >= tempTab.length) {
					console.log(tempTab);
					countO += 1;
				}
			}
		}
	}
}


await countGenre();
document.getElementById("numberOfStreets").innerHTML = streetsCountStr;
console.log("Length streets count : " + streetsCountStr.length);
// for (let i=0; i<4; i++) {
// 	loaderStr(target);
// }
console.log("Féminin : " + countF);
console.log("Masculin : " + countM);
console.log("Other : " + countO);
export var pourcentO = Math.round(100*countO/streetsCount);
export var pourcentP = Math.round(100*(countM+countF)/streetsCount);
export var pourcentM = Math.round(100*countM/streetsCount);
export var pourcentF = Math.round(100*countF/streetsCount);
// console.log("Femmes : " + pourcentF)
// console.log("Other : " + pourcentO)
// console.log("Persons : " + pourcentP)
// console.log("Hommes : " + pourcentM)