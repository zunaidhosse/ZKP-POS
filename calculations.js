// Invoice calculation utilities

function calculateRow(row) {
    const unitPrice = parseFloat(row.querySelector('.unit-price').value) || 0;
    const quantity = parseFloat(row.querySelector('.quantity').value) || 0;

    // Calculate based on VAT-inclusive unit price
    // taxable_amount = (unit_price / 1.15) × quantity
    const taxableAmount = (unitPrice / 1.15) * quantity;

    // vat_amount = taxable_amount × 0.15
    const vatAmount = taxableAmount * 0.15;

    // item_total_with_vat = unit_price × quantity
    const itemTotal = unitPrice * quantity;

    // Update calculated fields
    row.querySelector('.taxable-amount').textContent = taxableAmount.toFixed(2) + ' SAR';
    row.querySelector('.tax-amount').textContent = vatAmount.toFixed(2) + ' SAR';
    row.querySelector('.item-total').textContent = itemTotal.toFixed(2) + ' SAR';

    return {
        taxableAmount,
        vatAmount,
        itemTotal
    };
}

function updateQRCode(totalAmountDueText) {
    const qrContainer = document.getElementById('qrcode');
    if (!qrContainer) return;

    // Clear existing QR if present
    qrContainer.innerHTML = '';

    // Encode simple plain text that displays Total Amount Due when scanned
    const qrText = `Total Amount Due: ${totalAmountDueText}`;

    // Use QRCode.js to generate
    try {
        new QRCode(qrContainer, {
            text: qrText,
            width: 75,
            height: 75,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    } catch (e) {
        // fallback: show text if QR generation fails
        qrContainer.textContent = qrText;
    }

    // Make tapping/clicking the QR show an alert with the same text (useful on mobile)
    qrContainer.onclick = () => {
        if (window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(20);
        }
        alert(qrText);
    };
}

function calculateTotals() {
    const rows = document.querySelectorAll('.item-row');
    let totalExcludingVAT = 0;
    let totalVAT = 0;

    rows.forEach(row => {
        const result = calculateRow(row);
        totalExcludingVAT += result.taxableAmount;
        totalVAT += result.vatAmount;
    });

    const totalAmountDue = totalExcludingVAT + totalVAT;
    const formattedDue = totalAmountDue.toFixed(2) + ' SAR';

    // Update totals display
    document.getElementById('totalExcVAT').textContent = totalExcludingVAT.toFixed(2) + ' SAR';
    document.getElementById('totalDiscount').textContent = '0.00 SAR';
    document.getElementById('totalTaxable').textContent = totalExcludingVAT.toFixed(2) + ' SAR';
    document.getElementById('totalVAT').textContent = totalVAT.toFixed(2) + ' SAR';
    document.getElementById('totalDue').textContent = formattedDue;

    // Update footer
    document.getElementById('cashAmount').textContent = totalAmountDue.toFixed(2);
    document.getElementById('itemCount').textContent = rows.length;

    // Update QR code whenever totals change
    updateQRCode(formattedDue);
}

function generateInvoiceNumber() {
    const num = Math.floor(1000 + Math.random() * 9000);
    document.getElementById('invoiceNumber').textContent = num;
}

function getCurrentFormattedDateTime() {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');

    const day = pad(now.getDate());
    const month = pad(now.getMonth() + 1);
    const year = now.getFullYear();

    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

function initializeCalculations() {
    // Auto-fill invoice date/time if user hasn't set it
    const invoiceDateInput = document.getElementById('invoiceDate');
    if (invoiceDateInput) {
        if (!invoiceDateInput.value || invoiceDateInput.value.trim() === '') {
            invoiceDateInput.value = getCurrentFormattedDateTime();
        }
        if (invoiceDateInput.value && invoiceDateInput.value.indexOf('/') === -1) {
            invoiceDateInput.value = getCurrentFormattedDateTime();
        }
    }

    // Use event delegation for inputs
    document.getElementById('itemsBody').addEventListener('input', (e) => {
        if (e.target.tagName === 'INPUT') {
            calculateTotals();
        }
    });

    // Initial setup
    generateInvoiceNumber();
    calculateTotals();
}