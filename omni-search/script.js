document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Current Year ---
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // --- 2. Theme Toggle Logic ---
  const themeToggle = document.getElementById("themeToggle");
  const themeText = document.getElementById("themeText");
  const htmlDoc = document.documentElement;

  const updateToggleUI = (theme) => {
    if (theme === "light") {
      themeText.textContent = "Light mode";
    } else {
      themeText.textContent = "Dark mode";
    }
  };

  // Initial UI state based on attribute set in head
  updateToggleUI(htmlDoc.getAttribute("data-theme"));

  themeToggle.addEventListener("click", () => {
    const currentTheme = htmlDoc.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";

    htmlDoc.setAttribute("data-theme", newTheme);
    localStorage.setItem("omnisearch-site-theme", newTheme);
    updateToggleUI(newTheme);
  });

  // --- 3. Scroll Reveal Animation ---
  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          // Once visible, we can stop observing this element
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // --- 4. Image/Video Fallback Handler ---
  // If an image or video fails to load, we can show a placeholder or log the error
  const mediaElements = document.querySelectorAll("img, video");
  mediaElements.forEach((media) => {
    media.addEventListener("error", function () {
      const fallbackMsg = this.getAttribute("data-fallback");
      if (fallbackMsg) {
        console.warn(`Resource failed to load: ${this.src}. ${fallbackMsg}`);
        
        // If it's an image, we could replace it with a styled div placeholder
        if (this.tagName === "IMG") {
          const placeholder = document.createElement("div");
          placeholder.className = "media-placeholder";
          placeholder.innerHTML = `<span>${fallbackMsg}</span>`;
          this.replaceWith(placeholder);
        }
      }
    });
  });

  // --- 5. Smooth Scroll Adjustments ---
  // (Optional) ensure header height is accounted for if needed, 
  // though CSS scroll-margin-top is usually cleaner.
  const navLinks = document.querySelectorAll('.nav-links a, .btn[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href.startsWith("#") && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      }
    });
  });
});