// This script should be placed in the <head> to avoid FOUC (Flash of Unstyled Content).

// An immediately-invoked function to set the theme as early as possible.
(function() {
    // Function to apply the theme by adding/removing the 'dark' class on the <html> element.
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }

    let initialTheme;
    // 1. Check for a theme saved in localStorage.
    if (localStorage.getItem('theme')) {
        initialTheme = localStorage.getItem('theme');
    } else {
        // 2. If not found, check the user's OS/browser preference.
        initialTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    // Apply the determined theme.
    applyTheme(initialTheme);
})();


// Wait for the DOM to be fully loaded before attaching event listeners and manipulating the DOM.
document.addEventListener('DOMContentLoaded', function() {
    const themeToggleButton = document.getElementById('theme-toggle');
    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

    // If the button or icons aren't on the page (e.g., login page), exit gracefully.
    if (!themeToggleButton || !themeToggleDarkIcon || !themeToggleLightIcon) {
        return;
    }

    // This function updates which icon (sun or moon) is visible based on the current theme.
    function updateIcons() {
        if (document.documentElement.classList.contains('dark')) {
            // If it's dark mode, show the sun icon and hide the moon icon.
            themeToggleDarkIcon.classList.add('hidden');
            themeToggleLightIcon.classList.remove('hidden');
        } else {
            // If it's light mode, show the moon icon and hide the sun icon.
            themeToggleDarkIcon.classList.remove('hidden');
            themeToggleLightIcon.classList.add('hidden');
        }
    }

    // Set the initial state of the icons when the page loads.
    updateIcons();

    // Add a click event listener to the toggle button.
    themeToggleButton.addEventListener('click', function() {
        // Toggle the 'dark' class on the <html> element.
        document.documentElement.classList.toggle('dark');

        let newTheme;
        // Check the new theme state and save it to localStorage.
        if (document.documentElement.classList.contains('dark')) {
            newTheme = 'dark';
        } else {
            newTheme = 'light';
        }
        localStorage.setItem('theme', newTheme);

        // Update the icon visibility to reflect the change.
        updateIcons();
    });
});