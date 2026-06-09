const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const scrollProgress = document.getElementById("scrollProgress");

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");

    document.body.classList.toggle("menu-open", isOpen);
    menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  document.querySelectorAll(".mobile-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      document.body.classList.remove("menu-open");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });
}

/* Liquid glass mouse light movement */
document.querySelectorAll(".glass-panel, .glass-nav, .mobile-menu").forEach((panel) => {
  panel.addEventListener("mousemove", (event) => {
    const rect = panel.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    panel.style.setProperty("--x", `${x}%`);
    panel.style.setProperty("--y", `${y}%`);
  });
});

/* Reveal animation */
const revealItems = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  {
    threshold: 0.15,
  }
);

revealItems.forEach((item) => {
  observer.observe(item);
});

/* Background parallax and progress bar */
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const bg = document.querySelector(".page-bg");

  if (bg) {
    bg.style.transform = `scale(1.04) translateY(${scrollY * 0.08}px)`;
  }

  if (scrollProgress) {
    const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = pageHeight > 0 ? (scrollY / pageHeight) * 100 : 0;
    scrollProgress.style.width = `${progress}%`;
  }
});