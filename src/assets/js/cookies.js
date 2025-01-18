document.addEventListener("DOMContentLoaded", () => {

    const cookieContainer =
        document.getElementById("cookie-container");
    const acceptBtn =
        document.querySelector(".btn-success");
    const rejectBtn =
        document.querySelector(".rejectButton");
    const customBtn =
        document.querySelector(".customizeButton");
    const cookieModal = 
        document.querySelector("#CookieModal");
    const CloseModal = 
        document.querySelector("#CloseCookieModal");


    acceptBtn.addEventListener('click', function () {
        document.cookie = "CookieBy=AntiFra; max-age="
            + 60 * 60 * 24;
        if (document.cookie) {
            cookieContainer.classList.add("hide");
        } else {
            alert
                ("Cookie can't be set! Please" +
                    " unblock this site from the cookie" +
                    " setting of your browser.");
        }
    });

    rejectBtn.addEventListener('click', function () {
        cookieContainer.classList.add("hide");
    });

      // Custom button functionality
      if (customBtn && cookieModal) {
        customBtn.addEventListener("click", function () {
          cookieModal.style.visibility = "visible";
        });
      }

            // Custom button functionality
            if (CloseModal && cookieModal) {
                CloseModal.addEventListener("click", function () {
                  cookieModal.style.visibility = "hidden";
                });
              }


    const contentWrapper = document.querySelector(".cooky-preference-content");
    const showMoreButton = document.querySelector(".cooky-show-more");
    const showLessButton = document.querySelector(".cooky-show-less");
    const additionalParagraphs = Array.from(contentWrapper.querySelectorAll(".cooky-preference-content p:nth-child(n+3)"));

    // Initially hide the additional paragraphs and the "Show less" button
    additionalParagraphs.forEach(p => p.style.display = "none");
    showLessButton.style.display = "none";

    showMoreButton.addEventListener("click", () => {
        // Show additional paragraphs and "Show less" button, hide "Show more" button
        additionalParagraphs.forEach(p => p.style.display = "block");
        showMoreButton.style.display = "none";
        showLessButton.style.display = "inline-block";
    });

    showLessButton.addEventListener("click", () => {
        // Hide additional paragraphs and "Show less" button, show "Show more" button
        additionalParagraphs.forEach(p => p.style.display = "none");
        showMoreButton.style.display = "inline-block";
        showLessButton.style.display = "none";
    });



      // Accordion functionality
      document.addEventListener("click", (event) => {
        const button = event.target.closest(".cooky-accordion-btn");
        if (button) {
          const accordionItem = button.closest(".cooky-accordion-item");
          const body = accordionItem.nextElementSibling;

          if (body && body.classList.contains("cooky-accordion-body")) {
            if (body.style.display === "none" || body.style.display === "") {
              body.style.display = "block";
              body.classList.add("active");
              accordionItem.classList.add("active");
            } else {
              body.style.display = "none";
              body.classList.remove("active");
              accordionItem.classList.remove("active");
            }
          }
        }
      });






});