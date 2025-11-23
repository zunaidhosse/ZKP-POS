// Modal management utilities

function showQuickInfoModal() {
    const modal = document.getElementById('quickInfoModal');
    
    // Pre-fill with current values
    document.getElementById('quickName').value = document.getElementById('customerName').value;
    document.getElementById('quickAddress').value = document.getElementById('customerAddress').value;
    document.getElementById('quickDate').value = document.getElementById('invoiceDate').value;
    
    modal.classList.remove('hidden');
    document.body.classList.add('no-scroll');
}

function closeQuickInfoModal() {
    const modal = document.getElementById('quickInfoModal');
    modal.classList.add('hidden');
    document.body.classList.remove('no-scroll');
}

function applyQuickInfoAndPrint() {
    applyQuickInfo();
    closeQuickInfoModal();
    
    setTimeout(() => {
        printInvoice();
    }, 200);
}

function applyQuickInfoAndDownload() {
    applyQuickInfo();
    closeQuickInfoModal();
    
    setTimeout(() => {
        downloadPNG();
    }, 200);
}

function applyQuickInfo() {
    // Get values from modal
    const name = document.getElementById('quickName').value;
    const address = document.getElementById('quickAddress').value;
    const date = document.getElementById('quickDate').value;
    
    // Apply to invoice
    document.getElementById('customerName').value = name;
    document.getElementById('customerAddress').value = address;
    document.getElementById('invoiceDate').value = date || getCurrentFormattedDateTime();
}