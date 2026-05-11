document.addEventListener("DOMContentLoaded", () => {
  // Year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile nav toggle
  const toggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (toggle && navLinks) {
    toggle.addEventListener("click", () => navLinks.classList.toggle("is-open"));
    navLinks.querySelectorAll(".nav-link").forEach(l =>
      l.addEventListener("click", () => navLinks.classList.remove("is-open"))
    );
  }

  // Active nav scroll spy
  const links = Array.from(document.querySelectorAll("[data-nav-link]"));
  const sections = Array.from(document.querySelectorAll("[data-nav-section]"));

  function setActiveNav(id) {
    links.forEach(l => l.classList.toggle("is-active", l.dataset.navLink === id));
  }

  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActiveNav(e.target.id); });
    }, { rootMargin: "-20% 0px -70% 0px", threshold: 0 });
    sections.forEach(s => spy.observe(s));
  }

  // Smooth scroll
  links.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = document.getElementById(link.getAttribute("href").substring(1));
      if (target) {
        const y = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    });
  });

  // FAQ accordion
  document.querySelectorAll(".faq-question").forEach(btn => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const wasOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(i => i.classList.remove("open"));
      if (!wasOpen) item.classList.add("open");
    });
  });

  // Fade-up on scroll
  const faders = document.querySelectorAll(".fade-up");
  if ("IntersectionObserver" in window && faders.length) {
    const fadeObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); fadeObs.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    faders.forEach(el => fadeObs.observe(el));
  }

  // GitHub stars
  const starBadge = document.getElementById("github-stars");
  if (starBadge) {
    fetch("https://api.github.com/repos/Eul45/omniclip")
      .then(r => r.json())
      .then(d => {
        if (d.stargazers_count !== undefined) starBadge.textContent = `★ ${d.stargazers_count.toLocaleString()}`;
        else starBadge.style.display = "none";
      })
      .catch(() => { starBadge.style.display = "none"; });
  }

  // Carousel
  const track = document.querySelector(".carousel-track");
  const slides = Array.from(document.querySelectorAll(".carousel-slide"));
  const nextBtn = document.querySelector(".carousel-next");
  const prevBtn = document.querySelector(".carousel-prev");
  const dotsContainer = document.querySelector(".carousel-dots");
  
  if (track && slides.length > 0) {
    let currentIndex = 0;
    
    // Create dots
    slides.forEach((_, idx) => {
      const dot = document.createElement("button");
      dot.classList.add("carousel-dot");
      if (idx === 0) dot.classList.add("active");
      dot.setAttribute("aria-label", `Go to slide ${idx + 1}`);
      dot.addEventListener("click", () => goToSlide(idx));
      dotsContainer.appendChild(dot);
    });
    
    const dots = Array.from(document.querySelectorAll(".carousel-dot"));
    
    function goToSlide(index) {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach(d => d.classList.remove("active"));
      dots[index].classList.add("active");
      currentIndex = index;
    }
    
    nextBtn.addEventListener("click", () => goToSlide(currentIndex + 1));
    prevBtn.addEventListener("click", () => goToSlide(currentIndex - 1));
    
    // Touch swipe support
    let startX = 0;
    let currentX = 0;
    
    track.addEventListener("touchstart", e => {
      startX = e.touches[0].clientX;
      track.style.transition = 'none'; // Disable transition while dragging
    }, { passive: true });
    
    track.addEventListener("touchmove", e => {
      currentX = e.touches[0].clientX;
      const diff = startX - currentX;
      // Optional: add visual feedback during swipe
    }, { passive: true });
    
    track.addEventListener("touchend", e => {
      track.style.transition = 'transform 0.3s ease-in-out';
      if (startX - currentX > 50) {
        goToSlide(currentIndex + 1); // Swipe left
      } else if (currentX - startX > 50) {
        goToSlide(currentIndex - 1); // Swipe right
      } else {
        goToSlide(currentIndex); // Snap back
      }
    });
  }
});
