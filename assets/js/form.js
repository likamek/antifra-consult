document.addEventListener("DOMContentLoaded", function () {
  const phoneInput = document.getElementById("phone");
  const form = document.getElementById("authForm");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");
  const tabs = document.getElementsByClassName("tab");
  const steps = document.getElementsByClassName("step");
  let currentTab = 0;
  const okBtn = document.querySelector(".small-next-btn");

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

  function adjustFormHeight() {
    const tab = document.querySelectorAll(".tab")[currentTab];
    const form = document.getElementById("authForm");
    if (tab && form) {
      const tabHeight = tab.offsetHeight;
      form.style.minHeight = `${tabHeight}px`;
    }
  }

  function validateCurrentTab() {
    const currentTabElement = tabs[currentTab];
    const inputs = currentTabElement.querySelectorAll("input, textarea, select");
    let valid = true;

    // Clear old validation states before re-checking
    tabs[currentTab].querySelectorAll(".is-invalid, .is-valid").forEach(input => {
      input.classList.remove("is-invalid", "is-valid");
    });

    inputs.forEach(input => {
      if (input.id === "lossAmount") {
        const amount = parseFloat(input.value);
        if (isNaN(amount) || amount < 5000) {
          input.classList.add("is-invalid");
          input.classList.remove("is-valid");
          valid = false;
          return;
        }
      }

      if (input.type === "tel" && phoneInput) {
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
      tab.querySelectorAll(".is-invalid, .is-valid").forEach(input => {
        input.classList.remove("is-invalid", "is-valid");
      });
      tab.style.display = "none";
      form.classList.remove("was-validated");
    });
    
    tabs[n].style.display = "block";

    const formSteps = document.querySelector(".form-steps");
    if (formSteps) {
      formSteps.classList.remove("animate-form");
      void formSteps.offsetWidth; // trigger reflow
      formSteps.classList.add("animate-form");
    }

    prevBtn.style.display = "inline";
    prevBtn.disabled = n === 0;
    prevBtn.classList.toggle("dimmed", n === 0);    
    nextBtn.textContent = n === tabs.length - 1 ? "Submit" : "Next";

    updateStepIndicator(n);

    // Update progress bar width
    const progressBar = document.getElementById("formProgressBar");
    if (progressBar) {
      const totalTabs = tabs.length;
      const percent = Math.round((n / (totalTabs - 1)) * 100);
      progressBar.style.width = percent + "%";
      progressBar.setAttribute("aria-valuenow", percent);
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
          form.innerHTML = `   <section class="success-page">
    <div class="container">
      <div class="row headline-row-success">
        <div class="col">
          <h1 class="display-2--legal">It Looks Like <br>We Might Be <br>Able To Help</h1>
          <span>So What's Next?</span>
        </div>
        <div class="col">
          <img class="img-fluid" src="/assets/images/WhatsApp Image 2025-03-06 at 3.25.56 PM-2.png" alt="image faq">
        </div>
      </div>
      <div class="row">
        <span class="border-top"></span>
        <div class="col-12 col-md-6 h-100">
          <div class="blue-cards-inner">
            <h2 class="display-2--blue-cards">Investigation
            </h2>
            <p class="display-2--blue-cards">Our fraud investigator will review your inquiry, conducting a thorough
              examination to get the best results.
            </p>
          </div>
        </div>
        <div class="col-12 col-md-6 h-100">
          <div class="blue-cards-inner">
            <h2 class="display-2--blue-cards">Contact</h2>
            <p class="display-2--blue-cards">We will be in touch with you as soon as possible to provide
              updates on your case, and ensure you are well-informed throughout the process.
            </p>
          </div>
        </div>
        <span class="border-bottom"></span>
      </div>
      <div class="row">

        <h2 class="display-2--blue-cards">Hours</h2>
        <small class="text-muted">Weekdays</small>
        <small class="text-muted">11:00 - 19:00pm</small>
        <small class="text-muted">Coordinated Universal Time (UTC)</small>
      </div>

      <div class="row">
        <h2 class="display-2--blue-cards">WE HAVE OVER 30 YEARS EXPERIENCE
        </h2>
        <span class="display-3--title mt-1">1000’s of people choose us to manage<br>their claim</span>
      </div>
      <p>Here's Why:</p>
      <p>Our founding team is made up of people who’ve worked at the Financial Conduct Authority, the Financial
        Ombudsman Service, in banking and in tech. We are experts in banking regulation and the Financial Ombudsman
        Service’s approach to fraud cases.</p>
      <br>
      <p> <strong> Assured, at Refundee, you'll exclusively partner with seasoned experts.</strong></p>
      <br>
      <p> We charge fair fees, we are transparent about what is happening with your case at every stage and we
        provide a personalised service to each customer. We’ll be honest about your chances of success and we won’t
        charge you a penny if you are unsuccessful. Everyone you will deal with from start to finish will be an expert
        in banking regulation so you are in safe hands.</p>
    </div>
  </section>
`;
        })
        .catch(error => {
          console.error("Submission Error:", error);
          form.innerHTML = `<div class="alert-custom-danger mx-auto">
                              <img src="/assets/images/WhatsApp Image 2025-03-06 at 3.25.56 PM-3.png" alt="illutration" class="img-fluid d-block mx-auto">
                              <p>We couldn’t process your form due to an error.
                              Please click 'Go Back' to try again. <br>
                              Don’t worry; we’re here to help every step of the way.</p>
                              <button class="rounded-pill btn-rounded" onclick="reloadForm()">Go Back</button>

                            </div>`;
        });
      return;
    }

    currentTab += 1;
    if (currentTab < tabs.length) {
      showTab(currentTab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  prevBtn.addEventListener("click", function () {
    currentTab -= 1;
    if (currentTab >= 0) {
      showTab(currentTab);
    }
  });

  if (okBtn) {
    okBtn.addEventListener("click", function (event) {
      event.preventDefault();
      nextBtn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      const currentTabElement = tabs[currentTab];
      if (!currentTabElement || currentTabElement.style.display === "none") return;
  
      event.preventDefault();
      if (validateCurrentTab()) {
        nextBtn.click();
      } else {
        form.classList.add("was-validated");
      }
    }
  });

  function reloadForm() {
    window.location.href = "/start-your-claim.html";
  }

  // Initial tab display
  showTab(currentTab);
});
