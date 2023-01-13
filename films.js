// Creation de la variable pour recuperer les drapeaux des nationnalites des acteurs
const flags = {
  Américaine: "🇺🇸",
  Française: "🇫🇷",
  Japonaise: "🇯🇵",
  Canadienne: "🇨🇦",
};

// Recuperation des pieces depuis le fichier JSON
const header = document.querySelector("header");
const container = document.querySelector("main");

let data = {};
getData();


async function getData() {
  const reponse = await fetch("films.json");
  data = await reponse.json();
  /**
   * @type {array}
   *  */
  const films = data.films;

  // On cree une variable article faisant reference aux 1er objet sur json //
  // on cree un seul film ici 

  //   const film = films[0];
  //   const card = createCard(film);
  //   container.append(card);
  
  // ----------------------------------------------------------------------//
// On cree la boucle 
  for (let i = 0; i < films.length; i++) {
    const film = films[i];
    const card = createCard(film);
    films[i].element = card;
    container.append(card);
  }
}

//Creation de la fonction pour creer les cartes des films
function createCard(film) {
    // je cree un document image contenant l'affiche du film
  const imageElement = document.createElement("img");
  imageElement.style.height = '500px'
  // imageElement.style.background = 'center cover'
  imageElement.src = film.image;

 
 // -----------------------------------------------------------------------------------------------------//

    // je cree la variable acteur 
 const actors = film.actors;
  const actorsHtml = [];
  for (let i = 0; i < actors.length; i++) {
    const actor = actors[i];
    actorsHtml.push(
      createElement("li", "d-flex", [
        createElement("span", "me-3", `${actor.firstName} ${actor.lastName}`),
        createElement("span", "ms-auto", flags[actor.nationality]),
      ])
    );
  }
  //   const actorsHtml = film.actors.map((actor) =>
  //     createElement("li", "d-flex", [
  //       createElement("span", "me-3", `${actor.firstName} ${actor.lastName}`),
  //       createElement("span", "ms-auto", actor.nationality),
  //     ])
  //   );

  // "Directeur " + film.director ceci est exemple de concatenation

  // je cree les information de la carte comprise dans le li
  const informationsHtml = [
    createElement("li", "", `Durée: ${timeToString(film.duration)}`),
    createElement("li", "", `Directeur: ${film.director}`),
    createElement("li", "", `Année: ${film.yearOfProduction}`),
    createElement("li", "", `Festival: ${film.festivals.join(", ")}`),
    createElement("li", "d-flex", [
      "Acteurs: ",
      createElement("ul", "", actorsHtml),
    ]),
  ];

  // je cree la variable qui va contenir les elements de notre carte
  const card = createElement("div", "col", [
    createElement("article",  "card h-100", [
      imageElement,
      createElement("div", "card-body", [
        createElement("h3", "text-center", [film.title]),
        createElement("h4", "", ["Informations"]),
        createElement("ul", "ps-0 card-text", informationsHtml),
      ]),
    ]),
  ]);
  return card;
}

/**
 * @arg {string} type
 * @arg {string} cls
 * @arg {array} children
 */
function createElement(type, cls, children) {
  const elem = document.createElement(type);
  for (const child of children) {
    elem.append(child);
  }
  if (cls != "") {
    elem.className = cls;
  }
  return elem;
}

const search = document.getElementById("search");
search.addEventListener('input', searching);

function searching(event) {
  const recherche = event.target.value;

  data.films.forEach((film) => {
    if (film.title.toLowerCase().includes(recherche.toLowerCase())) {
      film.element.style.display = ""; // affiche 
    } else {
      film.element.style.display = "none"; //cache
    }
  });
}

const sort = document.querySelector('select');
const alphaOrder = document.querySelectorAll('option')[1];

alphaOrder.addEventListener('click', sortAlpha);
console.log('test')

function sortBy(arr, key) {
  return Array.from(arr).sort((a, b) => a[key].toString().localeCompare(b[key]))
}

function sortAlpha() {
  console.log("clicked")
  let sortedFilms = Array.from(data.films);
  sortedFilms.sort((film1, film2) => film1.title.charAt(0).localeCompare(film2.title));

}

 // ------------------------------------------
 var items = ["réservé", "premier", "cliché", "communiqué", "café" ,"adieu"];
 items.sort(function (a, b) {
   return a.localeCompare(b);
 });
//--------------------------------------------------------------------------------------



        // code de rani barre de recherche
// function searching() {
//     const search = document.getElementById("search").value;
//     if (search === "MAMAN J'AI LE FEU AU CUL"){
        
//     }
    
    
// }

function timeToString(minutes) {
  const heures = Math.floor(minutes / 60);
  minutes %= 60;
  if (heures) return `${heures}h${minutes}min`;
  return `${minutes}min`
}