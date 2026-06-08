const translations = {
  en: {
    advice: "Advice #101",
    quote: `"The only limit to our realization of tomorrow is our doubts of today."`
  },
  ro: {
    advice: "Citat motivațional #101",
    quote: `"Singura limită a realizării de mâine sunt îndoielile noastre de astăzi."`
  },
  es: {
    advice: "Consejo #101",
    quote: `"El único límite para nuestra realización de mañana son nuestras dudas de hoy."`
  },
  fr: {
    advice: "Conseil #101",
    quote: `"La seule limite à notre réalisation de demain est nos doutes d'aujourd'hui."`
  }
};

const languages = ["en", "ro", "es", "fr"];
const flags = [
  new URL("./assets/gb.png", import.meta.url).href,
  new URL("./assets/ro.png", import.meta.url).href,
  new URL("./assets/es.png", import.meta.url).href,
  new URL("./assets/fr.png", import.meta.url).href,
];


let currentLangIndex = 0;

// Detect and set user's preferred language
let userLang = localStorage.getItem("lang") || (navigator.language || navigator.userLanguage || "en").slice(0, 2);
userLang = languages.includes(userLang) ? userLang : "en";

// Set currentLangIndex based on userLang
currentLangIndex = languages.indexOf(userLang);
if (currentLangIndex === -1) currentLangIndex = 0; // fallback to English

// Set lang from current index
let lang = languages[currentLangIndex];

// Update all text elements
function updateTexts() {
  document.querySelectorAll("[text-data]").forEach(element => {
    const key = element.getAttribute("text-data");
    element.textContent = translations[lang][key];
  });

  // Update flag display
  document.getElementById("langButton").innerHTML = `<img src="${flags[currentLangIndex]}" alt="${lang}" class="flag-icon">`;
}

// Cycle through languages on button click
document.getElementById("langButton").onclick = function () {
  currentLangIndex = (currentLangIndex + 1) % languages.length;
  lang = languages[currentLangIndex];
  localStorage.setItem("lang", lang);
  updateTexts();
};

// Run on page load
document.addEventListener("DOMContentLoaded", () => {
  updateTexts();
  document.getElementById('langButton').addEventListener('click', toggleLanguage);
});

const API_URL = "https://quotes-api.emanuel-s.workers.dev";

const button = document.getElementById('getQuoteBtn');
const img = button.querySelector('img');

async function getQuote() {
  const lang = languages[currentLangIndex];
  const quoteBox = document.getElementById("quoteBox");

  img.classList.add("spin");

  try {
    const res = await fetch(`/quote?lang=${lang}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch quote: ${res.statusText}`);
    }

    const data = await res.json();

    quoteBox.innerHTML = `
      <h2>"${data.quote}"</h2>
      <p>— ${data.author}</p>
    `;
  } catch (error) {
    console.error(error);
    quoteBox.innerText =
      error.message || "Error fetching quote. Please try again later.";
  } finally {
    img.classList.remove("spin");
  }
}

button.addEventListener('click', getQuote);
