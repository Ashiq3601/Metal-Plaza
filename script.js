const body = document.body;
const siteNav = document.querySelector(".site-nav");
const hero = document.querySelector(".hero");
const navLinks = document.querySelectorAll(".nav-links a[href^='#']");
const revealItems = document.querySelectorAll(".reveal, .reveal-item, .image-reveal");
const sections = [...navLinks]
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

let ticking = false;

function finishLoading() {
    window.setTimeout(() => {
        body.classList.add("is-loaded");
    }, 1350);
}

function updateNavState() {
    if (!siteNav) {
        return;
    }

    siteNav.classList.toggle("scrolled", window.scrollY > 18);
}

function updateHeroDepth() {
    if (!hero) {
        return;
    }

    const shift = Math.min(window.scrollY * 0.08, 44);
    const emblemShift = Math.min(window.scrollY * -0.025, 0);
    hero.style.setProperty("--hero-shift", `${shift}px`);
    hero.style.setProperty("--emblem-shift", `${emblemShift}px`);
}

function updateActiveNav() {
    let activeSection = null;

    sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= 150) {
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

function onScroll() {
    if (ticking) {
        return;
    }

    window.requestAnimationFrame(() => {
        updateNavState();
        updateHeroDepth();
        updateActiveNav();
        ticking = false;
    });

    ticking = true;
}

function setupReveals() {
    if (!("IntersectionObserver" in window)) {
        revealItems.forEach((item) => item.classList.add("active"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                const group = [...entry.target.parentElement.children].filter((item) =>
                    item.classList && item.classList.contains("reveal-item")
                );
                const index = group.indexOf(entry.target);

                if (index >= 0) {
                    entry.target.style.transitionDelay = `${index * 120}ms`;
                }

                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            });
        },
        { threshold: 0.16, rootMargin: "0px 0px -70px" }
    );

    revealItems.forEach((item) => observer.observe(item));
}

finishLoading();
setupReveals();
updateNavState();
updateHeroDepth();
updateActiveNav();

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);
