document.addEventListener("DOMContentLoaded", function () {
  const phoneInput = document.getElementById("phone");
  const form = document.getElementById("authForm");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");
  const tabs = document.getElementsByClassName("tab");
  const steps = document.getElementsByClassName("step");
  let currentTab = 0;

  // Initialize intl-tel-input for phone validation
  const iti = window.intlTelInput(phoneInput, {
    utilsScript: "/assets/vendor/intl-tel-input/build/js/utils.js",
    initialCountry: "auto",
    geoIpLookup: function (callback) {
      fetch("/assets/data/ipapi.json")
        .then(response => response.json())
        .then(data => callback(data.country_code))
        .catch(() => callback("us"));
    },
    separateDialCode: true,
  });

  function validateCurrentTab() {
    const currentTabElement = tabs[currentTab];
    const inputs = currentTabElement.querySelectorAll("input, textarea, select");
    let valid = true;

    inputs.forEach(input => {
      if (input.type === "tel") {
        if (!validatePhone()) {
          valid = false;
        }
      } else if (!input.checkValidity()) {
        input.classList.add("is-invalid");
        valid = false;
      } else {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
      }
    });

    return valid;
  }

  function validatePhone() {
    if (!iti.isValidNumber()) {
      phoneInput.classList.add("is-invalid");
      phoneInput.classList.remove("is-valid");
      return false;
    } else {
      phoneInput.classList.remove("is-invalid");
      return true;
    }
  }

  function updateStepIndicator(n) {
    Array.from(steps).forEach((step, index) => {
      step.classList.remove("active");
      if (index <= n) {
        step.classList.add("active");
      }
    });
  }

  // Show the current tab
  function showTab(n) {
    Array.from(tabs).forEach(tab => {
      tab.style.display = "none";
    });
    tabs[n].style.display = "block";

    prevBtn.style.display = n === 0 ? "none" : "inline";
    nextBtn.textContent = n === tabs.length - 1 ? "Submit" : "Next";

    updateStepIndicator(n);

    // Clear validation styles for hidden tabs
    if (n > 0) {
      tabs[n - 1].querySelectorAll(".is-invalid, .is-valid").forEach(input => {
        input.classList.remove("is-invalid", "is-valid");
      });
    }
  }

  // Handle Next and Previous button clicks
  nextBtn.addEventListener("click", function () {
    if (!validateCurrentTab()) {
      form.classList.add("was-validated");
      return;
    }

    if (nextBtn.textContent === "Submit") {
      // Submit the form via AJAX
      const formData = new FormData(form);
      formData.set("phone", iti.getNumber()); // Use full international number

      fetch("/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData)),
      })
        .then(response => {
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
          return response.json();
        })
        .then(data => {
          form.innerHTML = `<div class="alert alert-success">Your form has been submitted successfully! We understand how much this means to you, and our team is already working to provide the support you need. We'll be in touch soon.</div>`;
        })
        .catch(error => {
          console.error("Submission Error:", error);
          form.innerHTML = `<div class="alert alert-danger">
                              <p>We couldn’t process your form due to an error. Please click 'Go Back' to try again. Don’t worry; we’re here to help every step of the way.</p>
                              <button class="btn btn-primary" onclick="reloadForm()">Go Back</button>
                            </div>`;
        });
      return;
    }

    currentTab += 1;
    if (currentTab < tabs.length) {
      showTab(currentTab);
    }
  });

  prevBtn.addEventListener("click", function () {
    currentTab -= 1;
    if (currentTab >= 0) {
      showTab(currentTab);
    }
  });

  form.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission on Enter
      nextBtn.click(); // Trigger the Next button instead
    }
  });

  function reloadForm() {
    form.reset();        // Reset the form fields
    currentTab = 0;      // Reset to the first tab
    showTab(currentTab); // Display the first tab
  }

  // Initial tab display
  showTab(currentTab);
});
