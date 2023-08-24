const gallery = document.querySelector(".gallery");

let projectData = [];
let filterData = "all";

const fetchProjet = async () => {
  await fetch("http://localhost:5678/api/works")
    .then((res) => res.json())
    .then((data) => (projectData = data));
  console.log(projectData);

  projectDisplay();
};

const projectDisplay = () => {
  gallery.innerHTML = projectData
    .filter((project) => {
      if (filterData === "all") {
        return project;
      } else if (filterData === "object") {
        return project.categoryId === 1;
      } else if (filterData === "appart") {
        return project.categoryId === 2;
      } else if (filterData === "hostel") {
        return project.categoryId === 3;
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
// affichage des élements dans le portfolio
window.addEventListener("load", fetchProjet);

// actions des boutons filtre
all.addEventListener("click", () => {
  filterData = "all";
  projectDisplay();
});
object.addEventListener("click", () => {
  filterData = "object";
  projectDisplay();
});
appart.addEventListener("click", () => {
  filterData = "appart";
  projectDisplay();
});
hostel.addEventListener("click", () => {
  filterData = "hostel";
  projectDisplay();
});
