const API_URL = "https://quotes.stoicaemanuelnicolae.workers.dev";

const languages = ["en", "ro", "es", "fr"];
const flags = ["🇬🇧", "🇷🇴", "🇪🇸", "🇫🇷"];
let currentLangIndex = 0;

document.getElementById("langButton").onclick = function() {
  currentLangIndex = (currentLangIndex + 1) % languages.length;
  document.getElementById("langButton").innerText = `${flags[currentLangIndex]}`;
};


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



