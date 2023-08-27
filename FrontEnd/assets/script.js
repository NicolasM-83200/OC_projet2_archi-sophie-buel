const gallery = document.querySelector(".gallery");

let projectData = [];
let filterData = "all";

// Utilisation d'un Set pour stocker les catégories valides
const validCategories = new Set([
  "all",
  "Objets",
  "Appartements",
  "Hotels & restaurants",
]);

// fonction qui permet la récupération des travaux depuis l'api
const fetchProjet = async () => {
  await fetch("http://localhost:5678/api/works")
    .then((res) => res.json())
    .then((data) => (projectData = data));
  console.log(projectData);

  projectDisplay();
};

// fonction d'affichage des travaux avec possibilité de filtrer par catégories
const projectDisplay = () => {
  gallery.innerHTML = projectData
    .filter((project) => {
      if (filterData === "all" || validCategories.has(filterData)) {
        // Utilisation d'un Set pour vérifier si la catégorie est valide
        return filterData === "all" || project.category.name === filterData;
      }
    })
    .map(
      (project) =>
        `
    <figure>
      <img src="${project.imageUrl}" alt="${project.title}">
      <figcaption>${project.title}</figcaption>
    </figure>
  `
    )
    .join("");
};
// affichage des élements dans le portfolio au chargement de la page
window.addEventListener("load", fetchProjet);

// actions des boutons filtre
all.addEventListener("click", () => {
  filterData = "all";
  projectDisplay();
});
object.addEventListener("click", () => {
  filterData = "Objets";
  projectDisplay();
});
appart.addEventListener("click", () => {
  filterData = "Appartements";
  projectDisplay();
});
hostel.addEventListener("click", () => {
  filterData = "Hotels & restaurants";
  projectDisplay();
});

// **************** Administrateur *******************
const loginBtn = document.querySelector(".login");
const logoutBtn = document.querySelector(".logout");
const headerTop = document.querySelector(".header-top");
const filterBar = document.querySelector(".filter");
const modIcon = document.querySelector(".mod-icon");

if (sessionStorage.getItem("token")) {
  loginBtn.style.display = "none";
  logoutBtn.style.display = "block";
  headerTop.style.display = "flex";
  filterBar.style.display = "none";
  modIcon.style.display = "block";
}

logoutBtn.addEventListener("click", (e) => {
  e.preventDefault();
  sessionStorage.removeItem("token");
  headerTop.style.display = "none";
  logoutBtn.style.display = "none";
  loginBtn.style.display = "block";
  filterBar.style.display = "flex";
  modIcon.style.display = "none";
});
