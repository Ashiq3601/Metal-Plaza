const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

menuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("open");
});

document.querySelectorAll(".mobile-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
  });
});

// Liquid glass light movement
document.querySelectorAll(".glass-panel, .glass-nav, .mobile-menu").forEach((panel) => {
  panel.addEventListener("mousemove", (event) => {
    const rect = panel.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    panel.style.setProperty("--x", `${x}%`);
    panel.style.setProperty("--y", `${y}%`);
  });
});

// Reveal animation
const revealItems = document.querySelectorAll(
  ".hero-card, .hero-logo-card, .stats, .intro, .product-card, .projects, .contact"
);

revealItems.forEach((item) => {
  item.classList.add("reveal");
});

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

// Small parallax effect
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const bg = document.querySelector(".page-bg");

  bg.style.transform = `scale(1.04) translateY(${scrollY * 0.08}px)`;
});