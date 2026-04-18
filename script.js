const button = document.getElementById("hello-btn");
const message = document.getElementById("message");

button?.addEventListener("click", () => {
  const now = new Date();
  message.textContent = `Hello from Cloudflare! ${now.toLocaleString()}`;
});
