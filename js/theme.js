// theme.js - Pizzeria Theme and UI Scroll Controller

document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    // Get saved theme or default to dark
    let activeTheme = localStorage.getItem('pizzeria-theme') || 'dark';
    
    // Initial run
    applyTheme(activeTheme);

    // Click handler
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            activeTheme = activeTheme === 'dark' ? 'light' : 'dark';
            applyTheme(activeTheme);
        });
    }

    // Function to set data-theme and update toggle icon
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('pizzeria-theme', theme);

        // Update the Lucide icon dynamically
        if (themeIcon) {
            themeIcon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
            if (window.lucide) {
                window.lucide.createIcons();
            }
        }
    }

    // Smooth navbar scroll transition
    const navbar = document.getElementById('main-navbar');
    if (navbar) {
        // Run once on load in case of refresh midway
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        }
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
});
