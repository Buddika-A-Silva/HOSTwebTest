function initializeMobileNavigation() {
  const sidebar = document.querySelector(".site-sidebar");
  const navigation = document.querySelector(".main-nav");
  const toggle = document.querySelector(".nav-toggle");

  if (sidebar && navigation && toggle) {
    const closeMenu = (returnFocus = false) => {
      sidebar.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      if (returnFocus) toggle.focus();
    };

    sidebar.classList.add("has-mobile-menu");
    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      sidebar.classList.toggle("is-open", !isOpen);
    });

    navigation.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.closest("a")) closeMenu();
    });

    document.addEventListener("click", (event) => {
      if (window.matchMedia("(max-width: 900px)").matches && !sidebar.contains(event.target)) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && sidebar.classList.contains("is-open")) closeMenu(true);
    });

    const desktopViewport = window.matchMedia("(min-width: 901px)");
    if (desktopViewport.addEventListener) {
      desktopViewport.addEventListener("change", () => closeMenu());
    } else {
      desktopViewport.addListener(() => closeMenu());
    }
  }

  initializeSiteIntro();
  initializeScrollMotion();
}

function initializeScrollMotion() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    return;
  }

  const elements = document.querySelectorAll(".site-main > section, .site-main > .site-footer, .team-grid > .card");
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries, activeObserver) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in-view");
        activeObserver.unobserve(entry.target);
      }
    }
  }, { threshold: 0.08, rootMargin: "0px 0px -36px 0px" });

  for (const element of elements) {
    element.classList.add("motion-reveal");
    observer.observe(element);
  }
}

function initializeSiteIntro() {
  const loadingScreen = document.querySelector(".site-loading-screen");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!loadingScreen || reduceMotion) return;

  document.body.classList.add("site-intro-active");

  let pageLoaded = document.readyState === "complete";
  let minimumElapsed = false;
  let isDismissed = false;

  const dismiss = () => {
    if (!isDismissed && pageLoaded && minimumElapsed) {
      isDismissed = true;
      document.body.classList.remove("site-intro-active");
      document.body.classList.add("site-revealed");
    }
  };

  window.addEventListener("load", () => {
    pageLoaded = true;
    dismiss();
  }, { once: true });

  window.setTimeout(() => {
    minimumElapsed = true;
    dismiss();
  }, 1100);

  window.setTimeout(() => {
    pageLoaded = true;
    minimumElapsed = true;
    dismiss();
  }, 2800);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeMobileNavigation, { once: true });
} else {
  initializeMobileNavigation();
}
