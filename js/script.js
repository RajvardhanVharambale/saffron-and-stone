
/* =========================================================
   SAFFRON & STONE — SHARED JAVASCRIPT
   ========================================================= */

"use strict";

/**
 * Select an element safely.
 */
const select = (selector, parent = document) =>
  parent.querySelector(selector);

/**
 * Select multiple elements.
 */
const selectAll = (selector, parent = document) =>
  [...parent.querySelectorAll(selector)];

/**
 * Mobile navigation
 */
function initializeNavigation() {
  const toggle = select(".nav-toggle");
  const navigation = select(".nav-links");

  if (!toggle || !navigation) return;

  function closeNavigation() {
    navigation.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("is-open");

    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close navigation after selecting a page.
  selectAll("a", navigation).forEach((link) => {
    link.addEventListener("click", closeNavigation);
  });

  // Close navigation with Escape.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNavigation();
  });

  // Close navigation when moving to desktop layout.
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 700) closeNavigation();
  });
}

/**
 * Automatically display the current year.
 */
function initializeFooterYear() {
  const yearElement = select("#current-year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

/**
 * Menu category filtering
 */
function initializeMenuFilters() {
  const filterButtons = selectAll("[data-filter]");
  const menuItems = selectAll("[data-category]");

  if (!filterButtons.length || !menuItems.length) return;

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.filter;

      filterButtons.forEach((item) => {
        item.setAttribute(
          "aria-pressed",
          String(item === button)
        );
      });

      menuItems.forEach((item) => {
        const matches =
          category === "all" ||
          item.dataset.category === category;

        item.hidden = !matches;
      });
    });
  });
}

/**
 * Contact and reservation form validation
 */
function initializeForms() {
  const forms = selectAll("[data-validate-form]");

  forms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const fields = selectAll(
        "input[required], textarea[required], select[required]",
        form
      );

      let firstInvalidField = null;

      fields.forEach((field) => {
        const errorElement = select(
          `#${field.id}-error`,
          form
        );

        let message = "";

        if (!field.validity.valid) {
          if (field.validity.valueMissing) {
            message = "This field is required.";
          } else if (field.validity.typeMismatch) {
            message = "Please enter a valid email address.";
          } else if (field.validity.tooShort) {
            message = "Please enter a longer response.";
          } else if (field.validity.rangeUnderflow) {
            message = "Please select a valid date.";
          } else {
            message = "Please check this field.";
          }
        }

        field.setAttribute(
          "aria-invalid",
          String(Boolean(message))
        );

        if (errorElement) {
          errorElement.textContent = message;
        }

        if (message && !firstInvalidField) {
          firstInvalidField = field;
        }
      });

      if (firstInvalidField) {
        firstInvalidField.focus();
        return;
      }

      const status = select(".form-status", form);

      if (status) {
        status.textContent =
          "Your form passed validation! This is a demonstration " +
          "website, so your information has not been sent to a restaurant.";
      }

      form.reset();

      // Remove invalid styling after successful validation.
      fields.forEach((field) => {
        field.setAttribute("aria-invalid", "false");
      });
    });

    // Clear the field's error when the user edits it.
    selectAll("input, textarea, select", form).forEach((field) => {
      field.addEventListener("input", () => {
        field.setAttribute("aria-invalid", "false");

        const errorElement = select(
          `#${field.id}-error`,
          form
        );

        if (errorElement) {
          errorElement.textContent = "";
        }
      });
    });
  });
}

/**
 * Initialize shared functionality.
 */
document.addEventListener("DOMContentLoaded", () => {
  initializeNavigation();
  initializeFooterYear();
  initializeMenuFilters();
  initializeForms();
});
