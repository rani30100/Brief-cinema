// Creation de la variable pour recuperer les drapeaux des nationnalites des acteurs
const flags = {
  Américaine: "🇺🇸",
  Française: "🇫🇷",
  Japonaise: "🇯🇵",
  Canadienne: "🇨🇦",
  Algerienne: "🇩🇿",
};

// VARIABLE tri inverse()
let sortOrder = 1; // une valeur negative correspond a un tri inverse
let displayEnd = 0;

const header = document.querySelector("header");
const container = document.querySelector("main");
const buttonReverse = document.getElementById('btnReverse');
buttonReverse.style.width = '3%';
buttonReverse.style.height = '50px';


const search = document.getElementById("search");
search.addEventListener('input', filterAndSort);
search.style.width = '70%';

const sort = document.querySelector('#sort');
sort.addEventListener("change", filterAndSort);
sort.style.width = '20%';

let data = {
  films:[],
  sorted:[],
};
getData();


// Recuperation des pieces depuis le fichier JSON
async function getData() {
  const reponse = await fetch("films.json");
  data = await reponse.json();
  /**
   * @type {array}
   */
  let films = data.films;
  data.sorted = films;
  filterAndSort(); // permet de gerer le tri si il a été fait avant le chargement de la page

  // on cree un seul film ici 
  // On cree une variable article faisant reference aux 1er objet sur json //
  //   const film = films[0];
  //   const card = createCard(film);
  //   container.append(card);
}

function createCards(films) {
  for (let i = 0; i < films.length; i++) {
    const film = films[i];
    const card = createCard(film);
    films[i].element = card;
    container.append(card);
  }
}

function displayMore() {
  const displayStart = displayEnd; 
  displayEnd += 6;
  let newItems = data.sorted.slice(displayStart, displayEnd);
  createCards(newItems);
}

function filterAndSort() {
  const filtered = filterBy(data.films, search.value);
  const sorted = sortBy(filtered, sort.value);

  data.sorted = sorted;

  container.innerHTML = ""; // Clears the currently displayed items;
  
  displayEnd = 0;
  displayMore();
}
//Creation de la fonction pour creer les cartes des films
function createCard(film) {
    // je cree un document image contenant l'affiche du film
  const imageElement = document.createElement("img");
  // imageElement.style.height = '500px'
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
      createElement("div", "card-body mt-auto flex-grow-0 border-top", [
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

function filterBy(films, title) {
  title = title.toLowerCase();
  const filteredFilms = [];
  for (const film of films) {
    if(film.title.toLowerCase().includes(title)) {
      filteredFilms.push(film);
    }
  }
 
  return filteredFilms;
}

function sortBy(arr, key) {
  if (key == "") return arr; // gestion cas aucun tri selectionné
  const sortedFilms = Array.from(arr).sort((film1, film2) => 
    sortOrder*film1[key].toString().localeCompare(film2[key], "fr", { numeric: true })
  );
  return sortedFilms;
}

// function sortAlpha() {
//   console.log("clicked")
//   let sortedFilms = Array.from(data.films);
//   sortedFilms.sort((film1, film2) => film1.title.localeCompare(film2.title));
//   sortedFilms.forEach((film, index) => {film.element.style.order = index;});
// }



function timeToString(minutes) {
  const heures = Math.floor(minutes / 60);
  minutes %= 60;
  if (heures) return `${heures}h${minutes}min`;
  return `${minutes}min`
}


buttonReverse.addEventListener('click', reverse);

function reverse() {
  sortOrder *= -1;
  filterAndSort()
}

const handleIntersect = (entries) => {
  console.log(entries);
  if (entries[0].isIntersecting) {
    displayMore();
  }
};

const watcher = document.querySelector(".intersection-watcher");

new IntersectionObserver(handleIntersect, {
  rootMargin: "200px"
}).observe(watcher)