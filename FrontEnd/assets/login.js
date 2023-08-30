const login = document.querySelector(".login");
const form = document.querySelector("form");

login.style.fontWeight = "bold";

form.addEventListener("submit", async (e) => {
  e.preventDefault();

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
      res.ok
        ? (window.location.href = "/FrontEnd/index.html")
        : alert("Erreur dans l'identifiant ou le mot de passe");
      return res.json();
    })
    //stockage du token d'authentification dans le session storage
    .then((data) => sessionStorage.setItem("token", data.token));
});
