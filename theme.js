
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.querySelector(".theme-toggle");
  const themeIcon = document.querySelector(".theme-icon");

  const storageKey = "common-thread-theme";

  // Apply the selected theme
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);

    // Update the toggle icon
    if (themeIcon) {
      themeIcon.textContent = theme === "dark" ? "☀" : "☾";
    }

    // Update accessibility label
    if (themeToggle) {
      const label =
        theme === "dark"
          ? "Switch to light mode"
          : "Switch to dark mode";

      themeToggle.setAttribute("aria-label", label);
      themeToggle.setAttribute("title", label);
    }
  }

  // Load saved theme, or use light mode
  let savedTheme = "light";

  try {
    const storedTheme = localStorage.getItem(storageKey);

    if (storedTheme === "light" || storedTheme === "dark") {
      savedTheme = storedTheme;
    }
  } catch (error) {
    console.warn("Theme preference could not be loaded.");
  }

  applyTheme(savedTheme);

  // Toggle between light and dark mode
  themeToggle?.addEventListener("click", () => {
    const currentTheme =
      document.documentElement.getAttribute("data-theme");

    const newTheme = currentTheme === "dark" ? "light" : "dark";

    applyTheme(newTheme);

    try {
      localStorage.setItem(storageKey, newTheme);
    } catch (error) {
      console.warn("Theme preference could not be saved.");
    }
  });
});
