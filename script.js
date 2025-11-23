// Main application initialization

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeCalculations();
    
    // Download and print buttons
    document.getElementById('downloadBtn').addEventListener('click', showQuickInfoModal);
    const printBtn = document.getElementById('printBtn');
    if (printBtn) {
        printBtn.addEventListener('click', showQuickInfoModal);
    }

    // Quick Info Modal listeners
    document.getElementById('quickInfoPrint').addEventListener('click', applyQuickInfoAndPrint);
    document.getElementById('quickInfoDownload').addEventListener('click', applyQuickInfoAndDownload);
    document.getElementById('quickInfoCancel').addEventListener('click', closeQuickInfoModal);
    
    // Close on outside click
    document.getElementById('quickInfoModal').addEventListener('click', (e) => {
        if (e.target.id === 'quickInfoModal') {
            closeQuickInfoModal();
        }
    });

    // Item management
    document.getElementById('addItemBtn').addEventListener('click', addItem);

    // Item library listeners
    document.getElementById('menuBtn').addEventListener('click', openItemLibrary);
    document.getElementById('closeLibraryBtn').addEventListener('click', closeItemLibrary);
    document.getElementById('saveItemBtn').addEventListener('click', saveNewItem);

    // Close modal on outside click
    document.getElementById('itemLibraryModal').addEventListener('click', (e) => {
        if (e.target.id === 'itemLibraryModal') {
            closeItemLibrary();
        }
    });

    registerPWA();
});