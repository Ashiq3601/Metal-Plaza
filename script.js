const revealItems = document.querySelectorAll(".reveal");
const siteNav = document.querySelector(".site-nav");
const hero = document.querySelector(".hero");
const navLinks = document.querySelectorAll(".nav-links a[href^='#']");
const sections = [...navLinks]
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

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

function updateHeroParallax() {
    if (!hero) {
        return;
    }

    const shift = Math.min(window.scrollY * 0.08, 42);
    hero.style.setProperty("--hero-shift", `${shift}px`);
}

function updateActiveNav() {
    let activeSection = null;

    sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= 140) {
            activeSection = section;
        }
    });

    navLinks.forEach((link) => {
        link.classList.toggle(
            "active",
            activeSection && link.getAttribute("href") === `#${activeSection.id}`
        );
    });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("scroll", updateNavState);
window.addEventListener("scroll", updateHeroParallax);
window.addEventListener("scroll", updateActiveNav);

revealOnScroll();
updateNavState();
updateHeroParallax();
updateActiveNav();
