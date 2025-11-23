// Item management utilities

let editingItemCode = null; // Track which item is being edited

function addItem() {
    const code = prompt('Enter Item Code:');
    if (!code) return;

    const savedItems = JSON.parse(localStorage.getItem('invoice_items') || '{}');
    const item = savedItems[code.trim()];

    const tbody = document.getElementById('itemsBody');
    const rowCount = tbody.querySelectorAll('.item-row').length;
    const tr = document.createElement('tr');
    tr.className = rowCount % 2 === 0 ? 'item-row' : 'item-row alt';

    const itemName = item ? item.name : 'New Item<br>Arabic Name';
    const itemPrice = item ? item.price.toFixed(2) : '0.00';

    tr.innerHTML = `
        <td class="product-name">
            <button class="remove-btn" onclick="removeRow(this)" title="Remove item">×</button>
            <div contenteditable="true" class="editable-text">${itemName}</div>
        </td>
        <td class="editable-cell">
            <input type="number" class="unit-price" value="${itemPrice}" step="0.01"> SAR
        </td>
        <td class="editable-cell">
            <input type="number" class="quantity" value="1" step="1">
        </td>
        <td class="calculated taxable-amount">0.00 SAR</td>
        <td class="editable-cell">
            <input type="number" class="discount" value="0.00" step="0.01"> SAR
        </td>
        <td class="editable-cell">
            <input type="number" class="tax-rate" value="15.0" step="0.1"> %
        </td>
        <td class="calculated tax-amount">0.00 SAR</td>
        <td class="calculated item-total">0.00 SAR</td>
    `;

    tbody.appendChild(tr);
    calculateTotals();
}

function removeRow(btn) {
    if (confirm('Are you sure you want to delete this item?')) {
        const row = btn.closest('tr');
        row.remove();
        calculateTotals();

        // Re-stripe rows
        const rows = document.querySelectorAll('.item-row');
        rows.forEach((r, i) => {
            r.className = i % 2 === 0 ? 'item-row' : 'item-row alt';
        });
    }
}

function openItemLibrary() {
    const modal = document.getElementById('itemLibraryModal');
    modal.classList.remove('hidden');
    document.body.classList.add('no-scroll');
    editingItemCode = null; // Reset editing state
    clearItemForm();
    displaySavedItems();
}

function closeItemLibrary() {
    const modal = document.getElementById('itemLibraryModal');
    modal.classList.add('hidden');
    document.body.classList.remove('no-scroll');
    editingItemCode = null;
    clearItemForm();
}

function clearItemForm() {
    document.getElementById('newItemCode').value = '';
    document.getElementById('newItemName').value = '';
    document.getElementById('newItemPrice').value = '';
    document.getElementById('saveItemBtn').textContent = 'Save Item';
}

function saveNewItem() {
    const code = document.getElementById('newItemCode').value.trim();
    const name = document.getElementById('newItemName').value.trim();
    const price = parseFloat(document.getElementById('newItemPrice').value);

    if (!code || !name || isNaN(price) || price < 0) {
        alert('Please fill all fields correctly');
        return;
    }

    const savedItems = JSON.parse(localStorage.getItem('invoice_items') || '{}');
    
    // If editing, remove old code entry if code changed
    if (editingItemCode && editingItemCode !== code) {
        delete savedItems[editingItemCode];
    }
    
    savedItems[code] = { name, price };
    localStorage.setItem('invoice_items', JSON.stringify(savedItems));

    editingItemCode = null;
    clearItemForm();
    displaySavedItems();
}

function editItem(code) {
    // Password protection
    const password = prompt('Enter password to edit:');
    if (password !== '123') {
        alert('Incorrect password');
        return;
    }
    
    const savedItems = JSON.parse(localStorage.getItem('invoice_items') || '{}');
    const item = savedItems[code];
    
    if (!item) return;
    
    // Populate form with item data
    document.getElementById('newItemCode').value = code;
    document.getElementById('newItemName').value = item.name;
    document.getElementById('newItemPrice').value = item.price;
    
    // Update button text and track editing state
    document.getElementById('saveItemBtn').textContent = 'Update Item';
    editingItemCode = code;
    
    // Scroll to form
    document.getElementById('newItemCode').focus();
}

function displaySavedItems() {
    const savedItems = JSON.parse(localStorage.getItem('invoice_items') || '{}');
    const container = document.getElementById('savedItemsList');

    if (Object.keys(savedItems).length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666;">No saved items yet</p>';
        return;
    }

    let html = '<div style="text-align: left;">';
    for (const [code, data] of Object.entries(savedItems)) {
        html += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; border-bottom: 1px solid #eee;">
                <div>
                    <strong>${code}</strong> - ${data.name}<br>
                    <small style="color: #666;">${data.price.toFixed(2)} SAR</small>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button onclick="editItem('${code}')" style="background: #2196F3; color: white; border: none; padding: 4px 12px; border-radius: 4px; cursor: pointer;">Edit</button>
                    <button onclick="deleteItem('${code}')" style="background: #ff4444; color: white; border: none; padding: 4px 12px; border-radius: 4px; cursor: pointer;">Delete</button>
                </div>
            </div>
        `;
    }
    html += '</div>';
    container.innerHTML = html;
}

function deleteItem(code) {
    // Password protection
    const password = prompt('Enter password to delete:');
    if (password !== '123') {
        alert('Incorrect password');
        return;
    }
    
    if (!confirm('Delete this item?')) return;
    const savedItems = JSON.parse(localStorage.getItem('invoice_items') || '{}');
    delete savedItems[code];
    localStorage.setItem('invoice_items', JSON.stringify(savedItems));
    
    // Clear form if we were editing this item
    if (editingItemCode === code) {
        editingItemCode = null;
        clearItemForm();
    }
    
    displaySavedItems();
}