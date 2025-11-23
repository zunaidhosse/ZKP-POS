// Download and print utilities

async function downloadPNG() {
    const invoice = document.getElementById('invoice');
    const button = document.getElementById('downloadBtn');

    button.textContent = 'Generating...';
    button.disabled = true;

    // Save original PerformanceObserver so we can restore it
    const OriginalPerformanceObserver = window.PerformanceObserver;

    try {
        // Temporarily disable PerformanceObserver to avoid transferring uncloneable PerformanceServerTiming
        try {
            window.PerformanceObserver = function () {
                this.observe = function () {};
                this.disconnect = function () {};
            };
            window.PerformanceObserver.prototype = {};
        } catch (e) {
            console.warn('Could not override PerformanceObserver:', e);
        }

        // Temporarily hide input borders for cleaner screenshot
        const inputs = document.querySelectorAll('.editable-cell input');
        inputs.forEach(input => {
            input.style.border = 'none';
            input.style.outline = 'none';
        });

        const canvas = await html2canvas(invoice, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false,
            useCORS: true,
            allowTaint: false,
            removeContainer: true,
            imageTimeout: 0,
            ignoreElements: (element) => {
                // Ignore scripts, add-item button container, delete buttons, and menu button
                return element.tagName === 'SCRIPT' || 
                       (element.classList && element.classList.contains('table-actions')) ||
                       (element.classList && element.classList.contains('remove-btn')) ||
                       (element.classList && element.classList.contains('menu-btn'));
            }
        });

        // Restore input styling
        inputs.forEach(input => {
            input.style.border = '';
            input.style.outline = '';
        });

        // Convert to blob and download
        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Invoice_8497_${new Date().getTime()}.png`;
            link.click();
            URL.revokeObjectURL(url);

            button.textContent = 'Download PNG';
            button.disabled = false;
        }, 'image/png');

    } catch (error) {
        console.error('Error generating PNG:', error);
        alert('Error generating PNG. Please try again.');
        button.textContent = 'Download PNG';
        button.disabled = false;
    } finally {
        // Restore original PerformanceObserver
        try {
            if (OriginalPerformanceObserver) {
                window.PerformanceObserver = OriginalPerformanceObserver;
            } else {
                delete window.PerformanceObserver;
            }
        } catch (e) {
            console.warn('Could not restore PerformanceObserver:', e);
        }
    }
}

function printInvoice() {
    // Hide modal or other overlays if any
    const modal = document.getElementById('pwaInstallModal');
    if (modal && !modal.classList.contains('hidden')) {
        modal.classList.add('hidden');
        document.body.classList.remove('no-scroll');
    }

    // Small delay to ensure UI updates before print dialog
    setTimeout(() => {
        window.print();
    }, 150);
}