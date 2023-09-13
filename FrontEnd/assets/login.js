const login = document.querySelector(".login");
const form = document.querySelector("form");

login.style.fontWeight = "bold";

form.addEventListener("submit", (e) => {
  e.preventDefault();
  loginUser();
});
const inputs = document.querySelectorAll("#email, #password");
inputs.forEach((input) => {
  input.addEventListener("input", (e) => {
    switch (e.target.id) {
      case "email":
        isValidEmail(e.target.value);
        break;
      case "password":
        isValidPassword(e.target);
        break;
      default:
        null;
    }
  });
});
/**
 * Fontcion d'affichage d'erreur pour validation formulaire
 * @param {string} tag - Element HTML (balise)
 * @param {string} message - message a afficher si classe "error"
 * @param {boolean} valid - si false ajoute la classe "error", si true enlève ".error"
 */
const errorDisplay = (tag, message, valid) => {
  const container = document.querySelector(`.${tag}-container`);
  const span = document.querySelector(`.${tag}-container > span`);
  !valid
    ? (container.classList.add("error"), (span.textContent = message))
    : (container.classList.remove("error"), (span.textContent = message));
};
/**
 * Fonction permettant la vérification du mail correct
 * @param {string} input - HTML element
 * @returns bool
 */
const isValidEmail = (value) => {
  if (!value.match(/^[\w._-]+@[\w-]+\.[a-z]{2,4}$/i)) {
    errorDisplay("email", "Le mail n'est pas valide");
    return false;
  }
  errorDisplay("email", "", true);
  return true;
};
/**
 * Fonction validation champ "mot de passe"
 * @param {string} input HTML element
 * @returns bool true ou false
 */
const isValidPassword = (input) => {
  const password = input.value.trim();
  if (password.length === 0) {
    errorDisplay("password", 'Le champ "Mot de passe" est obligatoire');
    return false;
  }
  errorDisplay("password", "", true);
  return true;
};
/**
 * Fonction fetch method "post" pour envoie données d'identification
 */
const loginUser = () => {
  //récupération de ce qu'il est renseigné dans les champs "email" et "password"
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  //création d'un objet "user" contenant l'email et le password renseigné
  let user = {
    email,
    password,
  };

  //envoie requête a l'api avec la méthode "post"
  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((res) => {
      //vérification de la réponse du serveur et redirection en cas d'utilisateur autorisé
      if (res.ok) {
        window.location.href = "./index.html";
      } else {
        errorDisplay("email", "Le mail n'est pas valide");
        errorDisplay("password", 'Le champ "Mot de passe" est obligatoire');
      }
      return res.json();
    })
    //stockage du token d'authentification dans le session storage
    .then((data) => sessionStorage.setItem("token", data.token));
};
