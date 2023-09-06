window.addEventListener("load", async () => {
  await getDatas();
  displayFigureInContainer(".gallery", category);
  displayLoginUser();
  displayModal();
  deleteWork();
  closeModal();
});
// actions des boutons filtre
document.querySelectorAll(".filter-btn").forEach((button) => {
  button.addEventListener("click", () => {
    category = button.getAttribute("data-category");
    displayFigureInContainer(".gallery", category);
  });
});

/**
 * Déclaration variables globales
 */
const modal = document.getElementById("modal2");
let datas = null; // Initialisation d'une variable pour stocker les données du fetch
let category = "all"; // Initialisation de la variable sur "all" pour afficher tous les éléments
// Utilisation d'un Set pour stocker les catégories valides
const validCategories = new Set([
  "all",
  "Objets",
  "Appartements",
  "Hotels & restaurants",
]);

/*********************************************
 * **************** Fonctions ****************
 **********************************************/

/**
 * Fonction pour récupérer les travaux depuis l'api
 */
const getDatas = async () => {
  try {
    const res = await fetch("http://localhost:5678/api/works");
    if (!res.ok) {
      throw new Error("Erreur de requête");
    }
    const data = await res.json();
    datas = data; // Mise à jour de la variable globale datas avec les données.
    return data; // Renvoie également les données pour pouvoir les utiliser dans la chaîne de promesses ou en dehors.
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    throw error;
  }
};
/**
 * Fonction qui créer la figure
 * @param {Array} data - Données des travaux
 * @returns Code HTML de l'élément
 */
const createFigure = (data) => {
  const figure = document.createElement("figure");
  figure.setAttribute("data-id", `${data.id}`);
  const image = document.createElement("img");
  image.setAttribute("src", `${data.imageUrl}`);
  image.setAttribute("alt", `${data.title}`);
  const figcaption = document.createElement("figcaption");
  figcaption.textContent = `${data.title}`;
  figure.append(image, figcaption);
  return figure;
};
/**
 * Fonction pour afficher les travaux dans le conteneur spécifié
 * @param {string} HTMLelement - Sélécteur du conteneur HTML
 * @param {string} category - Catégorie de filtre
 */
const displayFigureInContainer = (HTMLelement, category) => {
  console.log(datas);
  const container = document.querySelector(HTMLelement);
  const filteredWorks = filterWorks(datas, category);
  if (HTMLelement === ".gallery") {
    container.innerHTML = "";
    filteredWorks.forEach((data) => {
      const figure = createFigure(data);
      container.append(figure);
    });
  } else if (HTMLelement === ".gallery-wrapper") {
    container.innerHTML = filteredWorks
      .map(
        (data) =>
          `
      <figure data-id="${data.id}">
        <button class="delete-work-btn">
          <i class="fa-solid fa-trash-can"></i>
        </button>
        <img src="${data.imageUrl}" alt="${data.title}">
        <figcaption>éditer</figcaption>
      </figure>
    `
      )
      .join("");
  }
};
/**
 * Fonction pour filtrer les travaux par catégorie
 * @param {Array} data - Données des travaux
 * @param {string} category - Catégorie de filtre
 * @returns {Array} - Travaux filtrés
 */
const filterWorks = (data, category) => {
  return data.filter((item) => {
    if (category === "all" || validCategories.has(category)) {
      // Utilisation d'un Set pour vérifier si la catégorie est valide
      return category === "all" || item.category.name === category;
    }
  });
};
/**
 * Fonction de modification affichage lorsque l'administrateur est connecté
 */
const displayLoginUser = () => {
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
};
/**
 * Fait apparaitre la modal au click sur bouton "mofifier"
 */
function displayModal() {
  const modalBtn2 = document.getElementById("modalBtn2");
  modalBtn2.addEventListener("click", async () => {
    toggleModal();
    displayGalleryModal();
    await getDatas();
    displayFigureInContainer(".gallery-wrapper", category);
  });
}
/**
 * Ferme la modal au click sur le bouton "X" ou en dehors de la modal
 */
function closeModal() {
  const closeBtn = document.querySelector(".close");
  closeBtn.addEventListener("click", toggleModal);
  window.addEventListener("click", windowOnClick);
}
/**
 * Ajoute la classe "show-modal" si non présente et l'enlève si présente
 * Ajoute un booléen true si modal ouverte et false si fermée, stocké dans session storage
 */
function toggleModal() {
  modal.classList.toggle("show-modal");
  const isModalOpen = modal.classList.contains("show-modal");
  sessionStorage.setItem("modalOpen", isModalOpen);
}
/**
 *
 * @param {*} e - Si élément pointer est modal (en dehors de la fenêtre) execution de "toggleModal()"
 */
function windowOnClick(e) {
  if (e.target === modal) {
    toggleModal();
  }
}
/**
 * affiche le formulaire dans la modal
 */
const displayFormModal = () => {
  const modalContent = document.querySelector(".modal-content");
  modalContent.innerHTML = createFormModal();
  switchFormToGallery();
};
/**
 * affiche la galerie dans le modal
 */
const displayGalleryModal = () => {
  const modalContent = document.querySelector(".modal-content");
  modalContent.innerHTML = "";
  modalContent.append(createGalleryModal());
  switchGalleryToForm();
};
/**
 * créer le formulaire a afficher dans la modal
 * @return le formulaire
 */
const createFormModal = () => {
  return `
    <h3>Ajout photo</h3>
    <div class="form-wrapper">
      <form action="#" method="post" enctype="multipart/form-data">
        <div class="image-container">
          <i class="fa-regular fa-image"></i>
          <label for="content">+ Ajouter photo</label>
          <input type="file" name="content" id="content">
          <p>Jpg, Png: 4mo max</p>
          <div class="preview">
          </div>
          <span></span>
        </div>
        <div class="title-container">
          <label for="title">Titre</label>
          <input type="text" name="title" id="title">
          <span></span>
        </div>
        <div class="cat-container">
          <label for="category">Catégorie</label>
          <select name="category" id="category">
            <option value="" data-category-id="0">-- Sélectionnez une catégorie --</option>
            <option value="Objets" data-category-id="1">Objets</option>
            <option value="Appartements" data-category-id="2">Appartements</option>
            <option value="Hotêls et Réstaurant" data-category-id="3">Hotêls et Restaurants</option>
          </select>
          <span></span>
        </div>
        <div class="btn-wrapper">
          <input type="submit" value="Valider">
        </div>
      </form>
    </div>`;
};
/**
 * créer la galerie photo a afficher dans la modal
 * @returns la galerie photo
 */
const createGalleryModal = () => {
  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");
  const heading = document.createElement("h3");
  heading.textContent = "Galerie photo";
  const galleryWrapper = document.createElement("div");
  galleryWrapper.classList.add("gallery-wrapper");
  const btnWrapper = document.createElement("div");
  btnWrapper.classList.add("btn-wrapper");
  const addPhotoBtn = document.createElement("button");
  addPhotoBtn.classList.add("btn");
  addPhotoBtn.classList.add("add-photo-btn");
  addPhotoBtn.textContent = "Ajouter une photo";
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-gallery");
  deleteBtn.textContent = "Supprimer la galerie";
  btnWrapper.append(addPhotoBtn, deleteBtn);
  modalContent.append(heading, galleryWrapper, btnWrapper);
  return modalContent;
  // return `
  // <h3>Galerie photo</h3>
  // 	<div class="gallery-wrapper"></div>
  //   <div class="btn-wrapper">
  //     <button class="btn add-photo-btn">Ajouter une photo</button>
  //     <button class="delete-gallery">Supprimer la galerie</button>
  //   </div>`;
};
/**
 * permute l'affichage de la modal pour afficher le formulaire
 */
function switchGalleryToForm() {
  const addPhotoBtn = document.querySelector(".add-photo-btn");
  const backBtn = document.querySelector(".back");
  addPhotoBtn.addEventListener("click", () => {
    displayFormModal();
    displayPreview();
    submitWork();
    backBtn.style.visibility = "visible";
  });
}
/**
 * permute l'affichage de la modal pour afficher la galerie photo
 */
function switchFormToGallery() {
  const backBtn = document.querySelector(".back");
  backBtn.addEventListener("click", async () => {
    displayGalleryModal();
    await getDatas();
    displayFigureInContainer(".gallery-wrapper", category);
    backBtn.style.visibility = "hidden";
  });
}
function deleteWork() {
  window.addEventListener("click", (e) => {
    if (e.target.classList.contains("fa-trash-can")) {
      const figure = e.target.closest("figure");
      const workId = figure.dataset.id;
      console.log(workId);
      if (workId) {
        deleteWorkById(workId);
      }
    }
  });
}
/**
 * fonction permettant la suppression des travaux avec leur Id respectif
 * @param {int} workId - Id de l'élément a supprimer
 */
const deleteWorkById = async (workId) => {
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
      const figures = document.querySelectorAll(`figure[data-id="${workId}"]`);
      figures.forEach((figure) => figure.remove());
    }
  } catch (error) {
    console.error("Erreur lors de requête de suppression.");
  }
};
const createFormData = () => {
  const image = document.getElementById("content");
  const imageFile = image.files[0];
  const fileName = imageFile.name;
  const fileExt = fileName.split(".").pop();
  const title = document.getElementById("title").value;
  const category = document.getElementById("category");
  const selectedOption = category.options[category.selectedIndex];
  const categoryId = selectedOption.dataset.categoryId;

  const formData = new FormData();
  formData.append("image", imageFile, fileName);
  formData.append("title", title);
  formData.append("category", categoryId);

  return formData;
};
/**
 * fonction permettant d'ajouter une photo dans labase de données
 */
const addWork = async () => {
  const token = sessionStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const options = {
    method: "POST",
    headers,
    body: createFormData(),
  };
  fetch("http://localhost:5678/api/works", options)
    .then((response) => response.json())
    .then((data) => {
      console.log("Réponse de l'api :", data);
      const gallery = document.querySelector(".gallery");
      const figure = createFigure(data);
      gallery.appendChild(figure);
    });
};
/**
 * fonction pour soumettre le formulaire et envoyer la photo
 */
const submitWork = () => {
  const formWrapper = document.querySelector(".form-wrapper");
  const form = formWrapper.querySelector("form");
  const contentInput = document.getElementById("content");
  const titleInput = document.getElementById("title");
  const categorySelect = document.getElementById("category");
  // Ajoutez un gestionnaire d'événement à la soumission du formulaire
  form.addEventListener("submit", function (event) {
    // Validez les champs
    let isValid = true;
    // Validation du champ de contenu (image)
    if (!isValidContent(contentInput)) {
      isValid = false;
    }
    // Validation du champ de titre
    if (!isValidTitle(titleInput)) {
      isValid = false;
    }
    // Validation de la catégorie (assurez-vous qu'une option valide est sélectionnée)
    if (!isValidCategory(categorySelect)) {
      isValid = false;
    }
    // Empêchez la soumission du formulaire si la validation a échoué
    if (!isValid) {
      event.preventDefault();
    } else {
      addWork();
    }
  });
};
// Fonction de validation du champ de contenu (image)
function isValidContent(input) {
  const allowedExtensions = ["jpg", "jpeg", "png"];
  const maxSize = 4 * 1024 * 1024; // 4 Mo

  const file = input.files[0];

  if (!file) {
    errorDisplay("image", "Veuillez sélectionner une image.");
    return false;
  }

  const fileName = file.name.toLowerCase();
  const fileExtension = fileName.split(".").pop();

  if (!allowedExtensions.includes(fileExtension)) {
    errorDisplay(
      "image",
      "Seules les images au format JPG et PNG sont autorisées."
    );
    return false;
  }

  if (file.size > maxSize) {
    errorDisplay("image", "L'image ne doit pas dépasser 4 Mo.");
    return false;
  }
  errorDisplay("image", "", true);
  return true;
}

// Fonction de validation du champ de titre
function isValidTitle(input) {
  const title = input.value.trim();
  if (title.length === 0) {
    errorDisplay("title", "Le champ titre est obligatoire.");
    return false;
  }
  errorDisplay("title", "", true);
  return true;
}

// Fonction de validation de la catégorie
function isValidCategory(select) {
  const selectedOption = select.options[select.selectedIndex];
  const categoryId = selectedOption.dataset.categoryId;

  if (!categoryId || categoryId === "0") {
    errorDisplay("cat", "Veuillez sélectionner une catégorie valide.");
    return false;
  }
  errorDisplay("cat", "", true);
  return true;
}

const errorDisplay = (tag, message, valid) => {
  const container = document.querySelector(`.${tag}-container`);
  const span = document.querySelector(`.${tag}-container > span`);
  !valid
    ? (container.classList.add("error"), (span.textContent = message))
    : (container.classList.remove("error"), (span.textContent = message));
};

/**
 * fonction pour afficher la preview de l'image a ajouter
 */
const displayPreview = () => {
  const input = document.querySelector(`input[type="file"]`);
  input.addEventListener("change", updatePreview);
};
/**
 * fonction pour mettre a jour la preview de l'image a ajouter
 */
function updatePreview() {
  const input = document.getElementById("content");
  const preview = document.querySelector(".preview");
  while (preview.firstChild) {
    preview.removeChild(preview.firstChild);
  }
  const currentFile = input.files[0];
  const image = document.createElement("img");
  image.src = URL.createObjectURL(currentFile);
  preview.appendChild(image);
}
