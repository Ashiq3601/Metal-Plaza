const body = document.body;
const menuToggle = document.querySelector(".menu-toggle");
const siteMenu = document.querySelector(".site-menu");
const navLinks = [...document.querySelectorAll(".site-menu a, .brand-lockup, .nav-cta")];
const sectionLinks = [...document.querySelectorAll(".site-menu a[href^='#']")];
const revealTargets = [...document.querySelectorAll("[data-reveal]")];
const magneticTargets = [...document.querySelectorAll("[data-magnetic]")];
const parallaxTargets = [...document.querySelectorAll("[data-depth]")];
const glassSurfaces = [...document.querySelectorAll(".glass-surface")];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

let scrollTicking = false;

function markReady() {
  window.setTimeout(() => {
    body.classList.add("is-ready");
  }, reduceMotion.matches ? 100 : 950);
}

function setMenuState(open) {
  const isOpen = Boolean(open);
  body.classList.toggle("menu-open", isOpen);

  if (menuToggle) {
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  }

  if (siteMenu) {
    siteMenu.setAttribute("aria-hidden", String(!isOpen));
  }
}

function updateScrollProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  document.documentElement.style.setProperty("--scroll-progress", progress.toFixed(4));
}

function updateActiveSection() {
  const sections = sectionLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  let currentId = "";

  sections.forEach((section) => {
    const top = section.getBoundingClientRect().top;
    if (top <= 160) currentId = section.id;
  });

  sectionLinks.forEach((link) => {
    const active = currentId && link.getAttribute("href") === `#${currentId}`;
    link.classList.toggle("is-active", active);
  });
}

function updateParallax() {
  if (reduceMotion.matches) return;

  parallaxTargets.forEach((element) => {
    const depth = Number(element.dataset.depth || 0);
    const offset = clamp(window.scrollY * depth, -18, 48);
    element.style.transform = `translate3d(0, ${offset}px, 0)`;
  });
}

function onScroll() {
  if (scrollTicking) return;

  scrollTicking = true;
  window.requestAnimationFrame(() => {
    updateScrollProgress();
    updateActiveSection();
    updateParallax();
    scrollTicking = false;
  });
}

function setupRevealObserver() {
  if (!("IntersectionObserver" in window) || reduceMotion.matches) {
    revealTargets.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  revealTargets.forEach((element) => observer.observe(element));
}

function setupGlassPointer() {
  glassSurfaces.forEach((surface) => {
    surface.addEventListener("pointermove", (event) => {
      const rect = surface.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      surface.style.setProperty("--mx", `${x}%`);
      surface.style.setProperty("--my", `${y}%`);
    });

    surface.addEventListener("pointerleave", () => {
      surface.style.removeProperty("--mx");
      surface.style.removeProperty("--my");
    });
  });
}

function setupMagneticTargets() {
  if (reduceMotion.matches) return;

  magneticTargets.forEach((element) => {
    let frame = null;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const animate = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      element.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

      if (Math.abs(targetX - currentX) < 0.1 && Math.abs(targetY - currentY) < 0.1) {
        frame = null;
        return;
      }

      frame = window.requestAnimationFrame(animate);
    };

    const requestTick = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(animate);
    };

    element.addEventListener("pointermove", (event) => {
      const rect = element.getBoundingClientRect();
      const moveX = (event.clientX - rect.left - rect.width / 2) / rect.width;
      const moveY = (event.clientY - rect.top - rect.height / 2) / rect.height;
      targetX = moveX * 10;
      targetY = moveY * 10;
      requestTick();
    });

    element.addEventListener("pointerleave", () => {
      targetX = 0;
      targetY = 0;
      requestTick();
    });

    element.addEventListener("blur", () => {
      targetX = 0;
      targetY = 0;
      requestTick();
    });
  });
}

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    setMenuState(!body.classList.contains("menu-open"));
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    setMenuState(false);
  });
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenuState(false);
  }
});

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);

setMenuState(false);
markReady();
setupRevealObserver();
setupGlassPointer();
setupMagneticTargets();
updateScrollProgress();
updateActiveSection();
updateParallax();
