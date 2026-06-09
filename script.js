const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const scrollProgress = document.getElementById("scrollProgress");

const MotionAPI = window.Motion || null;
const motionAnimate = MotionAPI && typeof MotionAPI.animate === "function"
  ? MotionAPI.animate
  : null;

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

/* Correct active nav state */

const sectionLinks = document.querySelectorAll(".nav-links a, .mobile-menu a");

function updateActiveLink() {
  const sections = ["home", "products", "projects", "about", "contact"];
  const offset = window.innerHeight * 0.28;

  let current = "home";

  sections.forEach((id) => {
    const section = document.getElementById(id);

    if (!section) return;

    const rect = section.getBoundingClientRect();

    if (rect.top <= offset) {
      current = id;
    }
  });

  sectionLinks.forEach((link) => {
    const href = link.getAttribute("href");

    link.classList.toggle("active", href === `#${current}`);
  });
}

window.addEventListener("scroll", updateActiveLink);
window.addEventListener("load", updateActiveLink);

/* Liquid glass mouse light movement */

document.querySelectorAll(".glass-panel, .glass-nav, .mobile-menu").forEach((panel) => {
  panel.addEventListener("mousemove", (event) => {
    const rect = panel.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    panel.style.setProperty("--x", `${x}%`);
    panel.style.setProperty("--y", `${y}%`);
  });

  panel.addEventListener("mouseleave", () => {
    panel.style.setProperty("--x", "25%");
    panel.style.setProperty("--y", "20%");
  });
});

/* Reveal animation using Motion if available */

const revealItems = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (!entry.isIntersecting) return;

      const element = entry.target;

      element.classList.add("visible");

      if (motionAnimate) {
        motionAnimate(
          element,
          {
            opacity: [0, 1],
            transform: [
              "translateY(30px) scale(0.985)",
              "translateY(0px) scale(1)"
            ]
          },
          {
            duration: 0.9,
            delay: index * 0.04,
            easing: [0.22, 1, 0.36, 1]
          }
        );
      }

      revealObserver.unobserve(element);
    });
  },
  {
    threshold: 0.15,
  }
);

revealItems.forEach((item) => {
  revealObserver.observe(item);
});

/* Counting animation */

const counters = document.querySelectorAll(".count-up");

function formatNumber(value, format) {
  const rounded = Math.floor(value);

  if (format === "comma") {
    return rounded.toLocaleString("en-IN");
  }

  return rounded.toString();
}

function animateCounter(counter) {
  if (counter.dataset.done === "true") return;

  counter.dataset.done = "true";

  const target = Number(counter.dataset.target || 0);
  const format = counter.dataset.format || "";

  if (motionAnimate) {
    motionAnimate(
      0,
      target,
      {
        duration: target > 100 ? 2.2 : 1.4,
        easing: "circOut",
        onUpdate: (latest) => {
          counter.textContent = formatNumber(latest, format);
        }
      }
    );

    return;
  }

  const duration = target > 100 ? 2200 : 1400;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    const current = target * eased;

    counter.textContent = formatNumber(current, format);

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.7,
  }
);

counters.forEach((counter) => {
  counterObserver.observe(counter);
});

/* Magnetic button effect */

document.querySelectorAll(".magnetic-btn").forEach((button) => {
  button.addEventListener("mousemove", (event) => {
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    button.style.transform = `translate(${x * 0.08}px, ${y * 0.12}px)`;
  });

  button.addEventListener("mouseleave", () => {
    button.style.transform = "translate(0px, 0px)";
  });
});

/* Scroll progress only. Background stays fixed. */

window.addEventListener("scroll", () => {
  if (!scrollProgress) return;

  const scrollY = window.scrollY;
  const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = pageHeight > 0 ? (scrollY / pageHeight) * 100 : 0;

  scrollProgress.style.width = `${progress}%`;
});