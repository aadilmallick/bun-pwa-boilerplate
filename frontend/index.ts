let bipEvent: Event | null = null;
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  bipEvent = event;
});

document.querySelector("#btnInstall")!.addEventListener("click", (event) => {
  if (bipEvent) {
    bipEvent.prompt();
  } else {
    // incompatible browser, your PWA is not passing the criteria, the user has already installed the PWA
    alert(
      "To install the app look for Add to Homescreen or Install in your browser's menu"
    );
  }
});
