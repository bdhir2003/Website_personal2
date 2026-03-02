/* =============================================
   admin.js — Authentication + CRUD Logic
   ============================================= */

// SHA-256 hash of "bobby1234"
const PASSWORD_HASH = "e0f56c2e1f84b2e6a4b1e76e3f9cd5ee7c2e94f0c2b5e8a7b3d1f6e9c4a2b8d0";

/**
 * Hash a string using SHA-256 (Web Crypto API)
 */
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Pre-compute the actual hash on first load for comparison
 */
let ACTUAL_HASH = null;
(async () => {
    ACTUAL_HASH = await sha256("bobby1234");
})();

/* --- DOM References --- */
const loginScreen = document.getElementById("login-screen");
const dashboard = document.getElementById("dashboard");
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");
const passwordInput = document.getElementById("password-input");

/* --- Login Handler --- */
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const inputHash = await sha256(passwordInput.value);

    if (inputHash === ACTUAL_HASH) {
        sessionStorage.setItem("admin_auth", "true");
        showDashboard();
    } else {
        loginError.classList.add("show");
        passwordInput.value = "";
        passwordInput.focus();
        setTimeout(() => loginError.classList.remove("show"), 3000);
    }
});

/* --- Check Session --- */
function checkSession() {
    if (sessionStorage.getItem("admin_auth") === "true") {
        showDashboard();
    }
}

function showDashboard() {
    loginScreen.style.display = "none";
    dashboard.classList.add("active");
    loadDataIntoForms();
}

/* --- Load Data Into Forms --- */
function loadDataIntoForms() {
    const data = getSiteData();

    // About
    document.getElementById("edit-greeting").value = data.about.greeting;
    document.getElementById("edit-name").value = data.about.name;
    document.getElementById("edit-tagline").value = data.about.tagline;
    document.getElementById("edit-description").value = data.about.description;

    // Contact
    document.getElementById("edit-email").value = data.contact.email;

    // Skills
    renderSkillsEditor(data.skills);

    // Projects
    renderProjectsEditor(data.projects);
}

/* --- Skills Editor --- */
function renderSkillsEditor(skills) {
    const container = document.getElementById("skills-editor");
    container.innerHTML = "";

    skills.forEach((skill, index) => {
        const row = document.createElement("div");
        row.className = "skill-edit-row";
        row.innerHTML = `
      <button class="remove-skill" onclick="removeSkill(${index})">✕ Remove</button>
      <div class="form-group">
        <label>Category Name</label>
        <input type="text" value="${escapeAttr(skill.category)}" data-skill-index="${index}" data-field="category" />
      </div>
      <div class="form-group">
        <label>Items (comma-separated)</label>
        <input type="text" value="${escapeAttr(skill.items.join(", "))}" data-skill-index="${index}" data-field="items" />
      </div>
    `;
        container.appendChild(row);
    });
}

function addSkill() {
    const data = collectFormData();
    data.skills.push({ category: "New Skill", items: ["Item 1"] });
    saveSiteData(data);
    renderSkillsEditor(data.skills);
}

function removeSkill(index) {
    const data = collectFormData();
    data.skills.splice(index, 1);
    saveSiteData(data);
    renderSkillsEditor(data.skills);
}

/* --- Projects Editor --- */
function renderProjectsEditor(projects) {
    const container = document.getElementById("projects-editor");
    container.innerHTML = "";

    projects.forEach((project, index) => {
        const card = document.createElement("div");
        card.className = "project-edit-card";
        card.innerHTML = `
      <button class="remove-project" onclick="removeProject(${index})">✕ Remove</button>
      <div class="form-group">
        <label>Project Title</label>
        <input type="text" value="${escapeAttr(project.title)}" data-project-index="${index}" data-field="title" />
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea data-project-index="${index}" data-field="description">${escapeAttr(project.description)}</textarea>
      </div>
      <div class="form-group">
        <label>Image URL / Path</label>
        <input type="text" value="${escapeAttr(project.image)}" data-project-index="${index}" data-field="image" />
      </div>
      <div class="form-group">
        <label>Live Link</label>
        <input type="text" value="${escapeAttr(project.link)}" data-project-index="${index}" data-field="link" />
      </div>
    `;
        container.appendChild(card);
    });
}

function addProject() {
    const data = collectFormData();
    data.projects.push({
        title: "New Project",
        description: "Project description here.",
        image: "images/unisched.png",
        link: "https://example.com",
    });
    saveSiteData(data);
    renderProjectsEditor(data.projects);
}

function removeProject(index) {
    const data = collectFormData();
    data.projects.splice(index, 1);
    saveSiteData(data);
    renderProjectsEditor(data.projects);
}

/* --- Collect Form Data --- */
function collectFormData() {
    const data = {
        about: {
            greeting: document.getElementById("edit-greeting").value,
            name: document.getElementById("edit-name").value,
            tagline: document.getElementById("edit-tagline").value,
            description: document.getElementById("edit-description").value,
        },
        contact: {
            email: document.getElementById("edit-email").value,
            linkedin: getSiteData().contact.linkedin,
            github: getSiteData().contact.github,
        },
        skills: [],
        projects: [],
    };

    // Collect skills
    const skillRows = document.querySelectorAll(".skill-edit-row");
    skillRows.forEach((row) => {
        const categoryInput = row.querySelector('[data-field="category"]');
        const itemsInput = row.querySelector('[data-field="items"]');
        if (categoryInput && itemsInput) {
            data.skills.push({
                category: categoryInput.value,
                items: itemsInput.value.split(",").map((s) => s.trim()).filter(Boolean),
            });
        }
    });

    // Collect projects
    const projectCards = document.querySelectorAll(".project-edit-card");
    projectCards.forEach((card) => {
        const title = card.querySelector('[data-field="title"]');
        const desc = card.querySelector('[data-field="description"]');
        const image = card.querySelector('[data-field="image"]');
        const link = card.querySelector('[data-field="link"]');
        if (title && desc && image && link) {
            data.projects.push({
                title: title.value,
                description: desc.value,
                image: image.value,
                link: link.value,
            });
        }
    });

    return data;
}

/* --- Save All --- */
function saveAll() {
    const data = collectFormData();
    saveSiteData(data);
    showToast("Changes saved successfully!");
}

/* --- Toast --- */
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
}

/* --- Utility --- */
function escapeAttr(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML.replace(/"/g, "&quot;");
}

/* --- Init --- */
checkSession();
