// frontend/index.ts
var bipEvent = null;
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  bipEvent = event;
});
document.querySelector("#btnInstall").addEventListener("click", (event) => {
  if (bipEvent) {
    bipEvent.prompt();
  } else {
    alert("To install the app look for Add to Homescreen or Install in your browser's menu");
  }
});
