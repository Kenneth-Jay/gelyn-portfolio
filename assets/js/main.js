/*===== MENU SHOW =====*/
const showMenu = (toggleId, navId) => {
  const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId);

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("show");
    });
  }
};
showMenu("nav-toggle", "nav-menu");

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll(".nav__link");

function linkAction() {
  const navMenu = document.getElementById("nav-menu");
  // When we click on each nav__link, we remove the show-menu class
  navMenu.classList.remove("show");
}
navLink.forEach((n) => n.addEventListener("click", linkAction));

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll("section[id]");

const scrollActive = () => {
  const scrollDown = window.scrollY;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight,
      sectionTop = current.offsetTop - 58,
      sectionId = current.getAttribute("id"),
      sectionsClass = document.querySelector(
        ".nav__menu a[href*=" + sectionId + "]",
      );

    if (scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
      sectionsClass.classList.add("active-link");
    } else {
      sectionsClass.classList.remove("active-link");
    }
  });
};
window.addEventListener("scroll", scrollActive);

/*===== CIRCULAR COUNTER CARD COMPONENT =====*/
class CircularCounterCard {
  constructor(cardElement) {
    this.card = cardElement;
    this.targetValue = parseInt(this.card.dataset.counter) || 15;
    this.label = this.card.dataset.label || "Projects";
    this.maxValue = parseInt(this.card.dataset.max) || this.targetValue;

    this.numberElement = this.card.querySelector(".project-number");
    this.labelElement = this.card.querySelector(".project-label");
    this.progressCircle = this.card.querySelector(".progress-bar");
    this.hasAnimated = false; // Prevent multiple animations

    this.setupIntersectionObserver();
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.hasAnimated) {
            this.hasAnimated = true;
            this.init();
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the card is visible
        rootMargin: "0px 0px -50px 0px",
      },
    );

    observer.observe(this.card);
  }

  init() {
    // Set label
    if (this.labelElement) {
      this.labelElement.textContent = this.label;
    }

    // Start animations with delay
    setTimeout(() => {
      this.animateCounter(this.targetValue, 2500);
    }, 300);

    setTimeout(() => {
      this.animateProgress();
    }, 600);
  }

  animateCounter(target, duration = 2500) {
    const start = 0;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth easing with bounce
      const easeOutBack =
        1 + 1.7 * Math.pow(progress - 1, 3) + 0.7 * Math.pow(progress - 1, 2);
      const current = Math.floor(start + (target - start) * easeOutBack);

      this.numberElement.textContent = Math.max(0, current);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        this.numberElement.textContent = target;
      }
    };

    requestAnimationFrame(update);
  }

  animateProgress() {
    // Always show full progress bar
    this.progressCircle.style.strokeDashoffset = 0;
  }

  // Method to update counter value dynamically
  updateCounter(newValue, newMax = null) {
    this.targetValue = newValue;
    if (newMax) this.maxValue = newMax;

    this.hasAnimated = false; // Allow re-animation
    this.animateCounter(newValue, 1500);
    setTimeout(() => this.animateProgress(), 200);
  }
}

// Initialize counter cards
function initCounterCards() {
  const cards = document.querySelectorAll(".counter-card");
  const counterInstances = [];

  cards.forEach((card, index) => {
    const counter = new CircularCounterCard(card);
    counterInstances.push(counter);
  });

  return counterInstances;
}

/*===== SCROLL REVEAL ANIMATION =====*/
const sr = ScrollReveal({
  origin: "top",
  distance: "60px",
  duration: 2000,
  delay: 200,
  //     reset: true
});

sr.reveal(".home__data, .about__img, .skills__subtitle, .skills__text", {});
sr.reveal(".home__img, .about__subtitle, .about__text, .skills__img", {
  delay: 400,
});
sr.reveal(".home__social-icon", { interval: 200 });
sr.reveal(".skills-logos, .work__img, .contact__input", { interval: 200 });

// Add ScrollReveal for project cards with staggered animation
sr.reveal(".project__card", {
  interval: 200,
  delay: 200,
  distance: "60px",
  origin: "bottom",
  duration: 2000,
});

// Add ScrollReveal for counter cards with staggered animation
sr.reveal(".counter-card", {
  interval: 300,
  delay: 200,
  distance: "30px",
  origin: "bottom",
});

/*===== INITIALIZE ON PAGE LOAD =====*/
document.addEventListener("DOMContentLoaded", function () {
  // Initialize counter cards
  initCounterCards();
});

// Make classes available globally
window.CircularCounterCard = CircularCounterCard;
window.initCounterCards = initCounterCards;
