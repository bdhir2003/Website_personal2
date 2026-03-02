/* =============================================
   site-data.js — Default data + localStorage
   ============================================= */

const DEFAULT_DATA = {
  about: {
    greeting: "Hi, I am",
    name: "Bobby Dhir",
    tagline: "Machine Learning & AI Researcher",
    description: "I'm an undergraduate student at the University of Nebraska Omaha, majoring in Computer Science. I enjoy exploring technology, learning new skills, and finding creative ways to solve problems. Outside of academics, I like connecting with people, sharing ideas, and discovering new experiences that help me grow personally and professionally.",
  },

  skills: [
    {
      category: "Generative AI",
      items: ["AI Agents", "Prompt Engineering", "RAG"],
    },
    {
      category: "Gen AI Models",
      items: ["ChatGPT (4/4o/o1)", "Claude", "Gemini", "Perplexity", "Copilot"],
    },
    {
      category: "Statistical Methods",
      items: ["Cross-validation", "Correlation analysis", "ROC–AUC", "Confusion matrix metrics"],
    },
    {
      category: "ML Algorithms",
      items: ["Logistic Regression", "Random Forest", "SVM", "K-Means clustering", "Feedforward NNs"],
    },
    {
      category: "ML Frameworks",
      items: ["Scikit-learn", "TensorFlow", "PyTorch", "Keras"],
    },
    {
      category: "Data Science Libraries",
      items: ["Pandas", "NumPy", "Matplotlib", "Seaborn"],
    },
    {
      category: "Version Control",
      items: ["Git", "GitHub"],
    },
    {
      category: "Cloud Platforms",
      items: ["Google Cloud", "OpenAI"],
    },
    {
      category: "Programming",
      items: ["Python", "C", "Java", "C#"],
    },
  ],

  projects: [
    {
      title: "UniSched – AI University Course Scheduler",
      description: "UniSched is an AI-powered university course scheduling system that helps students generate optimized class schedules based on availability and constraints. It prevents time conflicts and improves academic planning using intelligent logic and scalable cloud deployment.",
      image: "images/unisched.png",
      link: "https://unisched-frontend.onrender.com/",
    },
    {
      title: "GeneGPT – AI Genetics Research Assistant",
      description: "GeneGPT is a Retrieval-Augmented Generation (RAG) based AI research assistant designed for genetics and biomedical exploration. It integrates layered memory systems and evaluation matrices to ensure structured and trustworthy responses for research support.",
      image: "images/genegpt.png",
      link: "https://genegpt2-11.onrender.com",
    },
    {
      title: "FairCare – Fairness Evaluation in Healthcare ML",
      description: "FairCare is a statistical machine learning research project focused on predicting 30-day hospital readmission for diabetic patients using the UCI Diabetes dataset. It implements Logistic Regression, SVM, and Random Forest models while analyzing fairness across demographic groups (age, gender, race) to ensure equitable outcomes in clinical decision-support systems.",
      image: "images/faircare.png",
      link: "",
    },
  ],

  contact: {
    email: "bdhir@unomaha.edu",
    linkedin: "https://www.linkedin.com/in/bobby-dhir-635780298/",
    github: "https://github.com/bdhir2003",
  },
};

/**
 * Get merged site data: localStorage overrides + defaults
 */
function getSiteData() {
  try {
    const stored = localStorage.getItem("portfolio_data");
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        about: { ...DEFAULT_DATA.about, ...(parsed.about || {}) },
        skills: parsed.skills && parsed.skills.length > 0 ? parsed.skills : DEFAULT_DATA.skills,
        projects: parsed.projects && parsed.projects.length > 0 ? parsed.projects : DEFAULT_DATA.projects,
        contact: { ...DEFAULT_DATA.contact, ...(parsed.contact || {}) },
      };
    }
  } catch (e) {
    console.warn("Failed to load stored data, using defaults:", e);
  }
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

/**
 * Save site data to localStorage
 */
function saveSiteData(data) {
  localStorage.setItem("portfolio_data", JSON.stringify(data));
}

/**
 * Get default data (for admin reset)
 */
function getDefaultData() {
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}
