document.addEventListener("DOMContentLoaded", () => {
  const mybutton = document.getElementById("back-to-top");
  const footer = document.getElementById("footer");
  const cookieContainer = document.getElementById("cookie-container");
  const btnMarginBottom = parseInt(window.getComputedStyle(mybutton).getPropertyValue("bottom"));

  const isCookieVisible = () => {
    return !cookieContainer.classList.contains("hide");
  };

  window.addEventListener("scroll", function () {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
      mybutton.style.display = "block";
    } else {
      mybutton.style.display = "none";
    }

    const footStartPos = footer.getBoundingClientRect().y;
    const cookieStartPos = cookieContainer.getBoundingClientRect().y;

    if (window.innerHeight > footStartPos) {
      // Stop above the footer
      mybutton.style.bottom = `${window.innerHeight - footStartPos + btnMarginBottom}px`;
    } else if (isCookieVisible() && cookieStartPos < footStartPos) {
      // Stop above cookie container if visible and does not overlap footer
      mybutton.style.bottom = `${window.innerHeight - cookieStartPos + btnMarginBottom}px`;
    } else {
      // Default button position
      mybutton.style.bottom = `${btnMarginBottom}px`;
    }
  });

  // Video Modal Logic
  const videoModal = document.getElementById("videoModal");
  const videoElement = videoModal?.querySelector("video");
  const openModalLink = document.getElementById("openModal");

  if (openModalLink) {
    openModalLink.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent the default behavior of the link
      const modalInstance = new bootstrap.Modal(videoModal);
      modalInstance.show();

      // Play the video when the modal is shown
      videoModal.addEventListener("shown.bs.modal", () => {
        if (videoElement) {
          videoElement.play();
        }
      });

      // Pause and reset the video when the modal is hidden
      videoModal.addEventListener("hidden.bs.modal", () => {
        if (videoElement) {
          videoElement.pause();
          videoElement.currentTime = 0;
        }
      });
    });
  } else {
    console.error("Modal trigger link not found!");
  }
});
