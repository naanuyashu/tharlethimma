// js/script.js
document.addEventListener('DOMContentLoaded', () => {
    const appContent = document.getElementById('app-content');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const closeMobileMenuButton = document.getElementById('close-mobile-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavLinks = document.querySelectorAll('#mobile-menu [data-mobile-link]');

    // Get the "View Episodes" button
    const viewEpisodesButton = document.querySelector('#home-page header button');

    // Function to load page content dynamically
    async function loadPage(pageName) {
        try {
            const response = await fetch(`pages/${pageName}.html`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const content = await response.text();
            appContent.innerHTML = content;

            // Activate the loaded section
            const newPageSection = appContent.querySelector('.page-section');
            if (newPageSection) {
                newPageSection.classList.add('active');
            }
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
        } catch (error) {
            console.error('Error loading page:', error);
            appContent.innerHTML = `<p class="text-red-500 text-center text-xl">Failed to load content for ${pageName}.</p>`;
        }
    }

    // Function to open mobile menu
    function openMobileMenu() {
        mobileMenu.classList.remove('hidden');
        mobileMenu.classList.remove('-translate-x-full');
        mobileMenu.classList.add('translate-x-0');
    }

    // Function to close mobile menu
    function closeMobileMenu() {
        mobileMenu.classList.add('-translate-x-full');
        mobileMenu.classList.remove('translate-x-0');
        // Hide after transition
        setTimeout(() => {
            mobileMenu.classList.add('hidden');
        }, 300); // Duration matches transition-duration-300
    }

    // Handle navigation clicks for desktop
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageName = link.getAttribute('href').substring(1); // e.g., "home", "profile", "audio-platforms"
            loadPage(pageName);
            window.history.pushState({ page: pageName }, '', link.getAttribute('href'));
        });
    });

    // Handle navigation clicks for mobile
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageName = link.getAttribute('href').substring(1);
            loadPage(pageName);
            closeMobileMenu(); // Close menu after selection
            window.history.pushState({ page: pageName }, '', link.getAttribute('href'));
        });
    });

    // Mobile menu button event listeners
    mobileMenuButton.addEventListener('click', openMobileMenu);
    closeMobileMenuButton.addEventListener('click', closeMobileMenu);

    // Add functionality to the "View Episodes" button on the home page
    if (viewEpisodesButton) {
        viewEpisodesButton.addEventListener('click', () => {
            const popularEpisodesSection = document.querySelector('.py-16.px-6.md\\:px-12.lg\\:px-24.mt-8');
            if (popularEpisodesSection) {
                popularEpisodesSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }


    // Handle initial load and hash changes
    function handleHashChange() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            loadPage(hash);
        } else {
            loadPage('home'); // Default to home page if no hash
            window.history.replaceState({ page: 'home' }, '', '#home');
        }
    }

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Call on initial load
});
