const translations = {
  en: {
    advice: "Advice #101"
  },
  ro: {
    advice: "Citat motivațional #101"
  },
  es: {
    advice: "Consejo #101"
  },
  fr: {
    advice: "Conseil #101"
  }
};

const languages = ["en", "ro", "es", "fr"];
const flags = ["🇬🇧", "🇷🇴", "🇪🇸", "🇫🇷"];
let currentLangIndex = 0;

// Detect and set user's preferred language
const supportedLangs = ["en", "ro"];
let userLang = localStorage.getItem("lang") || (navigator.language || navigator.userLanguage || "en").slice(0, 2);
userLang = supportedLangs.includes(userLang) ? userLang : "en";

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

  // Optional: update the toggle button label if needed
  const toggleButton = document.getElementById("toggle-lang");
  if (toggleButton && translations[lang].button) {
    toggleButton.textContent = translations[lang].button;
  }

  // Update flag display
  document.getElementById("langButton").innerText = flags[currentLangIndex];
}

// Cycle through languages on button click
document.getElementById("langButton").onclick = function () {
  currentLangIndex = (currentLangIndex + 1) % languages.length;
  lang = languages[currentLangIndex];
  localStorage.setItem("lang", lang);
  updateTexts();
};

// Language toggle button for en/ro only
function toggleLanguage() {
  lang = lang === "en" ? "ro" : "en";
  currentLangIndex = languages.indexOf(lang);
  localStorage.setItem("lang", lang);
  updateTexts();
}

// On page load
document.addEventListener("DOMContentLoaded", () => {
  updateTexts();
  const toggleBtn = document.getElementById('toggle-lang');
  if (toggleBtn) toggleBtn.addEventListener('click', toggleLanguage);
});


const API_URL = "https://quotes.stoicaemanuelnicolae.workers.dev";

async function getQuote() {
  const lang = languages[currentLangIndex];
  const quoteBox = document.getElementById("quoteBox");
  
  try {
    const res = await fetch(`${API_URL}/quote?lang=${lang}`);
    
    // Handle response status other than 2xx
    if (!res.ok) {
      if (res.status === 429) {
        const data = await res.json();
        throw new Error(data.error || "Rate limit exceeded. Please try again later.");
      }
      throw new Error(`Failed to fetch quote: ${res.statusText}`);
    }

    const data = await res.json();
    
    if (!data.quote || !data.author) {
      throw new Error("Received data does not have the expected format.");
    }

    quoteBox.innerHTML = `
      <h2>"${data.quote}"</h2>
      <p>— ${data.author}</p>
    `;
  } catch (error) {
    console.error(error);

    if (error.message.includes("CORS")) {
      quoteBox.innerText = "CORS error: Unable to access the API. Please check your configuration.";
    } else {
      quoteBox.innerText = error.message || "Error fetching quote. Please try again later.";
    }
  }
}

document.getElementById("getQuoteBtn").addEventListener("click", getQuote); 
