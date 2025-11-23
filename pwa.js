// PWA registration and install modal

async function registerPWA() {
    if ('serviceWorker' in navigator) {
        try {
            // register relative path so it resolves correctly when installed or hosted under subpath
            await navigator.serviceWorker.register('./service-worker.js');
            console.log('Service Worker registered.');
        } catch (err) {
            console.warn('Service Worker registration failed:', err);
        }
    }

    // Show install/download modal on first visit (store flag in localStorage)
    const modal = document.getElementById('pwaInstallModal');
    const dismissBtn = document.getElementById('pwaDismiss');
    const githubLink = document.getElementById('githubLink');

    // Set your repository URL here
    githubLink.href = 'https://github.com/your-username/your-repo';

    const shownFlag = localStorage.getItem('pwa_install_shown_v1');
    if (!shownFlag) {
        // Slight delay so page renders before modal (better UX)
        setTimeout(() => {
            modal.classList.remove('hidden');
            document.body.classList.add('no-scroll');
        }, 300);
    }

    dismissBtn.addEventListener('click', () => {
        document.getElementById('pwaInstallModal').classList.add('hidden');
        document.body.classList.remove('no-scroll');
        localStorage.setItem('pwa_install_shown_v1', '1');
    });

    // Dismiss if user clicks outside modal content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
            document.body.classList.remove('no-scroll');
            localStorage.setItem('pwa_install_shown_v1', '1');
        }
    });
}