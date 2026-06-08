const revealItems = document.querySelectorAll(".reveal");
const siteNav = document.querySelector(".site-nav");

function revealOnScroll() {
    revealItems.forEach((item) => {
        const itemTop = item.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (itemTop < windowHeight - 100) {
            item.classList.add("active");
        }
    });
}

function updateNavState() {
    if (!siteNav) {
        return;
    }

    siteNav.classList.toggle("scrolled", window.scrollY > 16);
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("scroll", updateNavState);

revealOnScroll();
updateNavState();
