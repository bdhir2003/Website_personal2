/* =============================================
   main.js — Render site content + animations
   ============================================= */

document.addEventListener("DOMContentLoaded", () => {
    const data = getSiteData();
    renderAbout(data.about);
    renderSkills(data.skills);
    renderProjects(data.projects);
    renderContact(data.contact);
    initScrollAnimations();
    initMobileMenu();
});

/* --- Render Helpers --- */

function renderAbout(about) {
    const el = (id) => document.getElementById(id);
    const greeting = el("hero-greeting");
    const name = el("hero-name");
    const tagline = el("hero-tagline");
    const desc = el("hero-desc");

    if (greeting) greeting.textContent = about.greeting;
    if (name) name.textContent = about.name;
    if (tagline) tagline.textContent = about.tagline;
    if (desc) desc.textContent = about.description;
}

function renderSkills(skills) {
    const container = document.getElementById("skills-grid");
    if (!container) return;

    container.innerHTML = skills
        .map(
            (skill) => `
    <div class="skill-card fade-in">
      <h3>${escapeHtml(skill.category)}</h3>
      <ul>
        ${skill.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </div>
  `
        )
        .join("");
}

function renderProjects(projects) {
    const container = document.getElementById("projects-grid");
    if (!container) return;

    container.innerHTML = projects
        .map((project) => {
            const actionHtml = project.link && project.link.trim() !== ""
                ? `<a href="${escapeHtml(project.link)}" target="_blank" rel="noopener noreferrer" class="btn-project">
              View Live Project
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>`
                : `<span class="badge-research">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
              Research Project
            </span>`;

            return `
    <div class="project-card fade-in">
      <div class="image-wrapper">
        <img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)}" class="project-image" loading="lazy" />
      </div>
      <div class="project-body">
        <h3>${escapeHtml(project.title)}</h3>
        <p>${escapeHtml(project.description)}</p>
        ${actionHtml}
      </div>
    </div>`;
        })
        .join("");
}

function renderContact(contact) {
    const emailLink = document.getElementById("contact-email-link");
    const emailDisplay = document.getElementById("contact-email-display");

    if (emailLink) emailLink.href = `mailto:${contact.email}`;
    if (emailDisplay) emailDisplay.textContent = contact.email;
}

/* --- Scroll Animations --- */
function initScrollAnimations() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                }
            });
        },
        { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll(".fade-in").forEach((el) => {
        observer.observe(el);
    });
}

/* --- Mobile Menu --- */
function initMobileMenu() {
    const toggle = document.querySelector(".menu-toggle");
    const navbar = document.querySelector(".navbar");

    if (toggle && navbar) {
        toggle.addEventListener("click", () => {
            navbar.classList.toggle("open");
        });

        // Close menu when clicking a link
        navbar.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                navbar.classList.remove("open");
            });
        });
    }
}

/* --- Utility --- */
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}
