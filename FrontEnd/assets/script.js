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
const modalsBtn = document.querySelectorAll(".modal-btn");

if (sessionStorage.getItem("token")) {
  loginBtn.style.display = "none";
  logoutBtn.style.display = "block";
  headerTop.style.display = "flex";
  filterBar.style.display = "none";
  modalsBtn.forEach((modalBtn) => (modalBtn.style.visibility = "visible"));
}

logoutBtn.addEventListener("click", (e) => {
  e.preventDefault();
  sessionStorage.removeItem("token");
  headerTop.style.display = "none";
  logoutBtn.style.display = "none";
  loginBtn.style.display = "block";
  filterBar.style.display = "flex";
  modalsBtn.forEach((modalBtn) => (modalBtn.style.visibility = "hidden"));
});

// **************** Affichage modale **************
const modal = document.querySelector(".modal");
const modalBtn2 = document.getElementById("modalBtn2");
const closeBtn = document.querySelector(".close");
const galleryModal = document.querySelector(".gallery-wrapper");

//ajout de la class "show-modal" pour la faire apparaitre
function toggleModal() {
  modal.classList.toggle("show-modal");
}
// fermetur au click en dehors de la modal
function windowOnClick(event) {
  if (event.target === modal) toggleModal();
}

modalBtn2.addEventListener("click", () => {
  fetchDataModal(), toggleModal();
});
closeBtn.addEventListener("click", toggleModal);
window.addEventListener("click", windowOnClick);

//afficher les éléments dans la modal
const fetchDataModal = async () => {
  await fetch("http://localhost:5678/api/works")
    .then((res) => res.json())
    .then((data) => {
      galleryModal.innerHTML = data
        .map(
          (elem) =>
            `
      <figure data-id="${elem.id}">
        <button class="delete-btn">
          <i class="fa-solid fa-trash-can"></i>
        </button>
        <img src="${elem.imageUrl}" alt="${elem.title}">
        <figcaption>éditer</figcaption>
      </figure>
    `
        )
        .join("");
    });

  const deleteBtns = document.querySelectorAll(".delete-btn");

  deleteBtns.forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const figure = e.currentTarget.closest("figure");
      const workId = figure.dataset.id;
      console.log(workId);

      if (workId) deleteWork(workId);
    });
  });
};

const deleteWork = async (workId) => {
  try {
    const token = sessionStorage.getItem("token");
    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      console.log("Travail supprimé avec succés !");
      fetchDataModal();
    } else {
      console.log("Erreur lors de la suppression du travail.");
      console.log(token);
    }
  } catch (error) {
    console.error("Erreur lors de requête de suppression.");
  }
};
