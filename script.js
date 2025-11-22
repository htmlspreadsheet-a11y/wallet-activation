// ---- CONFIGURATION: paste your Google Apps Script Web App URL below ----
// Replace the string below with your deployed Web App URL from Google Apps Script.
// Example: const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbx.../exec";
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyZjxpmhMyWJp1XEzS9xBYhNi6E9srCEtbpXSuhXCVQlcvUfBqbmY9cY6_N5vEKqRvr/exec";

// ----- form handling -----
const phoneInput = document.getElementById("phone");
const submitBtn = document.getElementById("submitBtn");
const statusText = document.getElementById("status");

function validatePhone(v){
  // basic validation: ensure digits (you can expand to country-specific formats)
  const digits = v.replace(/\D/g,'');
  return digits.length >= 7; // minimal acceptance
}

submitBtn.addEventListener("click", async () => {
  statusText.textContent = "";
  const phone = phoneInput.value.trim();

  if (!phone) {
    statusText.style.color = "#c0392b";
    statusText.textContent = "Please enter a phone number.";
    return;
  }

  if (!validatePhone(phone)) {
    statusText.style.color = "#c0392b";
    statusText.textContent = "Please enter a valid phone number (at least 7 digits).";
    return;
  }

  submitBtn.disabled = true;
  submitBtn.style.opacity = "0.7";
  statusText.style.color = "#333";
  statusText.textContent = "Submitting...";

  try {
    // We POST JSON to the Apps Script endpoint.
    // Note: many simple Apps Script setups require 'mode: "no-cors"' to avoid preflight issues when
    // you haven't set up CORS on the server — in that case Apps Script won't return a readable response,
    // but the request still reaches the script. If you'd like readable responses, configure CORS in the script.
    await fetch(WEB_APP_URL, {
      method: "POST",
      mode: "no-cors", // if you want to allow reading the response, remove this and configure CORS on the Apps Script
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ phone })
    });

    // Because of no-cors, we cannot inspect the response — assume success if no fetch error thrown.
    statusText.style.color = "#2d6a4f";
    statusText.textContent = "Submitted successfully ✔️";
    phoneInput.value = "";
  } catch (err) {
    console.error(err);
    statusText.style.color = "#c0392b";
    statusText.textContent = "Submission failed. Check console and Web App URL.";
  } finally {
    submitBtn.disabled = false;
    submitBtn.style.opacity = "1";
  }
});
