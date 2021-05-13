/* global window */
let automaticDark = false;
let force = false;

// Add or remove the "dark" class based on if the media query matches
export function toggleDarkTheme(shouldAdd: boolean) {
  document.body.classList.toggle('dark', shouldAdd);
}

// Add or remove the "dark" class based on if the media query matches
export function forceDarkTheme(shouldAdd: boolean) {
  force = shouldAdd;
  document.body.classList.toggle('dark', shouldAdd);
}

export function automaticDarkMode() {
  force = false;
  toggleDarkTheme(automaticDark);
}

if (window) {
  // Use matchMedia to check the user preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  automaticDark = prefersDark.matches;

  // Listen for changes to the prefers-color-scheme media query
  prefersDark.addListener((mediaQuery) => {
    automaticDark = mediaQuery.matches;
    if (!force) {
      toggleDarkTheme(automaticDark);
    }
  });
}
