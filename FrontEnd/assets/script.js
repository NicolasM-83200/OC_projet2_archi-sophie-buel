const gallery = document.querySelector(".gallery");
const galleryWrapper = document.querySelector(".gallery-wrapper");

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
const fetchProject = async () => {
  await fetch("http://localhost:5678/api/works")
    .then((res) => res.json())
    .then((data) => (projectData = data));
};

// fonction d'affichage des travaux dans le portfolio avec possibilité de filtrer par catégories
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
    <figure data-id="${project.id}">
      <img src="${project.imageUrl}" alt="${project.title}">
      <figcaption>${project.title}</figcaption>
    </figure>
  `
    )
    .join("");
};
// fonction d'affichage des travaux dans la fenêtre modale
const dataModalDisplay = (tag) => {
  tag.innerHTML = projectData
    .map(
      (project) =>
        `
      <figure data-id="${project.id}">
        <button class="delete-btn" type="button">
          <i class="fa-solid fa-trash-can"></i>
        </button>
        <img src="${project.imageUrl}" alt="${project.title}">
        <figcaption>éditer</figcaption>
      </figure>
    `
    )
    .join("");

  tag.addEventListener("click", (e) => {
    if (e.target.classList.contains("fa-trash-can")) {
      const figure = e.target.closest("figure");
      const workId = figure.dataset.id;
      console.log(workId);

      if (workId) {
        deleteWork(workId);
      }
    }
  });
};
// fonction permettant la suppression des travaux avec leur Id respectif
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
      const figureModal = galleryWrapper.querySelector(
        `figure[data-id="${workId}"]`
      );
      const figureGallery = gallery.querySelector(
        `figure[data-id="${workId}"]`
      );
      if (figureModal) {
        figureModal.remove();
        figureGallery.remove();
      } else {
        console.log("Erreur lors de la suppression du travail.");
      }
    }
  } catch (error) {
    console.error("Erreur lors de requête de suppression.");
  }
};

// affichage des élements dans le portfolio au chargement de la page
window.addEventListener("load", fetchProject());

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
const modal = document.getElementById("modal2");
const modalBtn2 = document.getElementById("modalBtn2");
const modalWrapper = document.querySelector(".modal-wrapper");
const backBtn = document.querySelector(".back");
const closeBtn = document.querySelector(".close");
const heading = document.querySelector("h3");
const addPhotoBtn = document.querySelector(".add-photo-btn");

//ajout de la class "show-modal" pour la faire apparaitre/disparaitre
function toggleModal() {
  modal.classList.toggle("show-modal");
  const isModalOpen = modal.classList.contains("show-modal");
  sessionStorage.setItem("modalOpen", isModalOpen);
}
modalBtn2.addEventListener("click", () => {
  toggleModal();
});
closeBtn.addEventListener("click", toggleModal);
window.addEventListener("click", (e) => {
  if (e.target === modal) toggleModal();
});

// // Evenement au click sur le bouton "ajouter une photo"
addPhotoBtn.addEventListener("click", () => {
  modalWrapper.innerHTML = `
  <div class="top-btn">
    <button class="back">
      <i class="fa-solid fa-arrow-left"></i>
    </button>
    <button class="close">
      <i class="fa-solid fa-xmark"></i>
    </button>
  </div>
  <h3>Ajout photo</h3>
  <div class="form-wrapper">
    <form action="#" method="post">
      <div class="content">
        <i class="fa-regular fa-image"></i>
        <label for="content">+ Ajouter photo</label>
        <input type="file" name="content" id="content">
      </div>
      <div class="title-content">
        <label for="title">Titre</label>
        <input type="text" name="title" id="title"></div>
        <div class="cat-content">
          <label for="category">Catégorie</label>
          <select name="category" id="category">
            <option value="">-- Sélectionnez une catégorie --</option>
            <option value="Objets">Objets</option>
            <option value="Appartements">Appartements</option>
            <option value="Hotêls et Réstaurant">Hotêls et Restaurants</option>
          </select>
        </div>
    </form>
  </div>
  <div class="btn-wrapper">
    <button class="btn add-photo-btn">Ajouter une photo</button>
    <button class="delete-gallery">Supprimer la galerie</button>
  </div>`;
  // createForm();
  // modalWrapper.appendChild(createForm());

  // const deleteGalleryBtn = document.querySelector(".delete-gallery");
  // deleteGalleryBtn.remove();
  // heading.textContent = "Ajout photo";
  backBtn.style.visibility = "visible";
  // addPhotoBtn.textContent = "Valider";
});

// evenement au click sur le bouton retour dans la modal
backBtn.addEventListener("click", () => {
  modalWrapper.innerHTML = `
  <div class="top-btn">
							<button class="back">
								<i class="fa-solid fa-arrow-left"></i>
							</button>
							<button class="close">
								<i class="fa-solid fa-xmark"></i>
							</button>
						</div>
						<h3>Galerie photo</h3>
						<div class="gallery-wrapper"></div>
						<div class="btn-wrapper">
							<button class="btn add-photo-btn">Ajouter une photo</button>
							<button class="delete-gallery">Supprimer la galerie</button>
						</div>`;
  // createGallery();
  fetchProject();
  // const btnWrapper = document.querySelector(".btn-wrapper");
  // const deleteGalleryBtn = document.createElement("button");
  // deleteGalleryBtn.classList.add("delete-gallery");
  // deleteGalleryBtn.textContent = "Supprimer la galerie";
  // btnWrapper.appendChild(deleteGalleryBtn);
  // heading.textContent = "Galerie photo";
  backBtn.style.visibility = "hidden";
  // addPhotoBtn.textContent = "Ajouter une photo";
});

// function createForm() {
//   const formWrapper = document.createElement("div");
//   formWrapper.classList.add("form-wrapper");

//   const form = document.createElement("form");
//   form.setAttribute("action", "#");
//   form.setAttribute("method", "post");

//   const content = document.createElement("div");
//   content.classList.add("content");
//   const icon = document.createElement("i");
//   icon.classList.add("fa-regular", "fa-image");
//   const contentLabel = document.createElement("label");
//   contentLabel.setAttribute("for", "content");
//   contentLabel.textContent = "+ Ajouter photo";
//   const contentInput = document.createElement("input");
//   contentInput.setAttribute("type", "file");
//   contentInput.setAttribute("name", "content");
//   contentInput.setAttribute("id", "content");
//   content.appendChild(icon);
//   content.appendChild(contentLabel);
//   content.appendChild(contentInput);

//   const title = document.createElement("div");
//   title.classList.add("title-content");
//   const titleLabel = document.createElement("label");
//   titleLabel.setAttribute("for", "title");
//   titleLabel.textContent = "Titre";
//   const titleInput = document.createElement("input");
//   titleInput.setAttribute("type", "text");
//   titleInput.setAttribute("name", "title");
//   titleInput.setAttribute("id", "title");
//   title.appendChild(titleLabel);
//   title.appendChild(titleInput);

//   const cat = document.createElement("div");
//   cat.classList.add("cat-content");
//   const catLabel = document.createElement("label");
//   catLabel.setAttribute("for", "category");
//   catLabel.textContent = "Catégorie";
//   const categorySelect = document.createElement("select");
//   categorySelect.setAttribute("name", "category");
//   categorySelect.setAttribute("id", "category");
//   const emptyOption = document.createElement("option");
//   emptyOption.setAttribute("value", ""); // Valeur vide
//   emptyOption.textContent = "-- Sélectionnez une catégorie --";
//   const option1 = document.createElement("option");
//   option1.setAttribute("value", "Objets");
//   option1.textContent = "Objets";
//   const option2 = document.createElement("option");
//   option2.setAttribute("value", "Appartements");
//   option2.textContent = "Appartements";
//   const option3 = document.createElement("option");
//   option3.setAttribute("value", "Hotêls et Réstaurant");
//   option3.textContent = "Hotêls et Restaurants";

//   categorySelect.append(emptyOption, option1, option2, option3);
//   cat.append(catLabel, categorySelect);
//   form.append(content, title, cat);

//   formWrapper.appendChild(form);
//   return formWrapper;
// }
// modalWrapper.replaceChild(
//   formWrapper,
//   modalWrapper.querySelector(".gallery-wrapper")
// );

function createGallery() {
  const newGalleryWrapper = document.createElement("div");
  newGalleryWrapper.classList.add("gallery-wrapper");

  // modalWrapper.replaceChild(
  //   newGalleryWrapper,
  //   modalWrapper.querySelector(".form-wrapper")
  // );
}
