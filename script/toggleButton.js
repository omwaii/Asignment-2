const darkModeToggle = document.getElementById("dark-mode-toggle");

if (!localStorage.getItem("theme")) {
    localStorage.setItem("theme", "dark"); 
}

document.body.classList.toggle("light-mode", localStorage.getItem("theme") === "light");
darkModeToggle.checked = localStorage.getItem("theme") === "light";

darkModeToggle.addEventListener("change", () => {
    if (darkModeToggle.checked) {
        document.body.classList.add("light-mode");
        localStorage.setItem("theme", "light");
    } else {
        document.body.classList.remove("light-mode");
        localStorage.setItem("theme", "dark");
    }
});

