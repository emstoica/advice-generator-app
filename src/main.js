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
const supportedLangs = ["en", "ro", "es", "fr"];
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


const API_URL = "https://quotes-api.emanuel-s.workers.dev";

async function getQuote() {
  const lang = languages[currentLangIndex];
  const quoteBox = document.getElementById("quoteBox");
  
  try {

    const res = await fetch(`${API_URL}/quote?lang=${lang}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_API_KEY,
      }
    });
    
    // Handle response status other than 2xx
    if (!res.ok) {
      if (res.status === 429) {
        const data = await res.json();
        throw new Error(data.error || "Rate limit exceeded. Please try again later.");
      }
      throw new Error(`Failed to fetch quote: ${res.statusText}`);
    }

    const data = await res.json();

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

const button = document.getElementById('getQuoteBtn');
const img = button.querySelector('img'); // <-- image tag with the SVG
let isSpinning = false;

// Function to handle the spinning animation
const startSpin = () => {
  if (isSpinning) return;
  isSpinning = true;

  button.style.transition = 'transform 2s linear, box-shadow 2s linear';
  button.style.transform = 'rotate(360deg) scale(1.2)';
  button.style.boxShadow = '0 0 48px var(--clr-green-300)';

  setTimeout(() => {
    button.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    button.style.transform = 'rotate(0deg) scale(1)';
    button.style.boxShadow = '0 0 16px var(--clr-green-300)';
    isSpinning = false;
  }, 1200);
};

// Function to trigger both the animation and the quote fetch
const handleQuoteButtonPress = (e) => {
  e.preventDefault(); // prevent long-press selections, etc.
  startSpin();
  getQuote();
};

// Desktop and mobile support
button.addEventListener('click', handleQuoteButtonPress);
button.addEventListener('touchend', handleQuoteButtonPress);

// Optional: hover effect (desktop only)
button.addEventListener('mouseenter', () => {
  button.style.boxShadow = '0 0 16px var(--clr-green-300)';
});
button.addEventListener('mouseleave', () => {
  if (!isSpinning) {
    button.style.boxShadow = '0 0 8px var(--clr-green-300)';
  }
});

// Prevent long press selection or drag on SVG image
img.addEventListener('touchstart', (e) => e.preventDefault());
img.addEventListener('dragstart', (e) => e.preventDefault());

  