/**
 * Book Management System – JSON Based Logic
 * A client-side demonstration of JSON, DOM Manipulation, and Form Validation
 */

// 1. DATA MODEL — Single Source of Truth
let books = [
    {
        title: "1984",
        author: "George Orwell",
        year: 1949,
        genre: "Dystopian"
    },
    {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        year: 1960,
        genre: "Fiction"
    },
    {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        year: 1925,
        genre: "Classic"
    }
];

// 2. DOM ELEMENT REFERENCES
const elements = {
    tableBody: document.getElementById('bookTableBody'),
    updateForm: document.getElementById('updateForm'),
    updateTitle: document.getElementById('updateTitle'),
    updateAuthor: document.getElementById('updateAuthor'),
    updateYear: document.getElementById('updateYear'),
    updateGenre: document.getElementById('updateGenre'),
    removeForm: document.getElementById('removeForm'),
    removeTitle: document.getElementById('removeTitle'),
    btnUpdate: document.getElementById('btnUpdateBook'),
    btnRemove: document.getElementById('btnRemoveBook'),
    messageArea: document.getElementById('messageArea'),
    messageText: document.getElementById('messageText')
};

// 3. UI RENDER FUNCTION
/**
 * Clears the table and re-renders it based on the current JSON array state.
 */
function displayBooks() {
    // Clear existing rows
    elements.tableBody.innerHTML = '';

    // Iterate JSON array and create rows
    books.forEach(book => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${escapeHTML(book.title)}</td>
            <td>${escapeHTML(book.author)}</td>
            <td>${book.year}</td>
            <td>${escapeHTML(book.genre)}</td>
        `;

        elements.tableBody.appendChild(row);
    });
}

// 4. MESSAGING SYSTEM
/**
 * Displays an error or success message
 * @param {string} msg - The message text
 * @param {string} type - 'success' or 'error'
 */
function showMessage(msg, type) {
    elements.messageText.textContent = msg;

    // Reset classes
    elements.messageArea.className = 'message-area';

    // Add specific message type class
    if (type === 'success') {
        elements.messageArea.classList.add('msg-success');
    } else if (type === 'error') {
        elements.messageArea.classList.add('msg-error');
    }

    // After 4 seconds, automatically clear it
    setTimeout(clearMessage, 4000);
}

function clearMessage() {
    elements.messageArea.className = 'message-area hidden';
    elements.messageText.textContent = '';
}

// 5. UPDATE FUNCTIONALITY
function validateUpdateForm() {
    const title = elements.updateTitle.value.trim();
    const author = elements.updateAuthor.value.trim();
    const year = elements.updateYear.value.trim();
    const genre = elements.updateGenre.value.trim();

    // Check for empty fields
    if (!title || !author || !year || !genre) {
        showMessage('All fields are required to update a book.', 'error');
        return null;
    }

    // Check year validity
    const yearNumber = parseInt(year, 10);
    const currentYear = new Date().getFullYear();
    if (isNaN(yearNumber) || yearNumber < 0 || yearNumber > currentYear) {
        showMessage(`Please enter a valid year (up to ${currentYear}).`, 'error');
        return null;
    }

    // Check if title exists
    const bookExists = books.some(b => b.title.toLowerCase() === title.toLowerCase());
    if (!bookExists) {
        showMessage('Book title not found. Target title must be an exact match.', 'error');
        return null;
    }

    return { title, author, year: yearNumber, genre };
}

function updateBook() {
    const validData = validateUpdateForm();
    if (!validData) return;

    // Find index of book
    const index = books.findIndex(b => b.title.toLowerCase() === validData.title.toLowerCase());

    if (index !== -1) {
        // Update object in JSON array
        books[index].author = validData.author;
        books[index].year = validData.year;
        books[index].genre = validData.genre;

        // Re-render UI
        displayBooks();

        // Clear forms
        elements.updateTitle.value = '';
        elements.updateAuthor.value = '';
        elements.updateYear.value = '';
        elements.updateGenre.value = '';

        // Success notification
        showMessage(`Successfully updated "${validData.title}".`, 'success');
    }
}

// 6. REMOVE FUNCTIONALITY
function validateRemoveForm() {
    const title = elements.removeTitle.value.trim();

    if (!title) {
        showMessage('Please enter a target title to remove a book.', 'error');
        return null;
    }

    const bookExists = books.some(b => b.title.toLowerCase() === title.toLowerCase());

    if (!bookExists) {
        showMessage(`Book title "${title}" not found in directory.`, 'error');
        return null;
    }

    return title;
}

function removeBook() {
    const validTitle = validateRemoveForm();
    if (!validTitle) return;

    // Filter out the specific book and update JSON array ref
    const removedBookTitle = validTitle;
    books = books.filter(b => b.title.toLowerCase() !== validTitle.toLowerCase());

    // Re-render UI
    displayBooks();

    // Clear form
    elements.removeTitle.value = '';

    // Success notification
    showMessage(`Successfully removed "${removedBookTitle}" from the directory.`, 'success');
}

// Utility Function: XSS Protection for DOM Insertion
function escapeHTML(str) {
    if (typeof str !== 'string') return str;
    const p = document.createElement('p');
    p.appendChild(document.createTextNode(str));
    return p.innerHTML;
}

// 7. INITIALIZATION & EVENT BINDING
function init() {
    // Initial display of JSON data
    displayBooks();

    // Prevent default form submissions on enter key
    elements.updateForm.addEventListener('submit', function (e) { e.preventDefault(); });
    elements.removeForm.addEventListener('submit', function (e) { e.preventDefault(); });

    // Bind interactive buttons
    elements.btnUpdate.addEventListener('click', updateBook);
    elements.btnRemove.addEventListener('click', removeBook);
}

// Run application upon DOM load
document.addEventListener('DOMContentLoaded', init);
