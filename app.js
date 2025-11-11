// CloudVault Pro - Main Application JavaScript

// Initialize application on DOM load
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Main initialization function
function initializeApp() {
    console.log('CloudVault Pro initialized');
    setupEventListeners();
    loadUserPreferences();
    checkAuthentication();
}

// Setup event listeners
function setupEventListeners() {
    // File upload handlers
    const uploadBtn = document.getElementById('upload-btn');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', handleFileUpload);
    }

    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }

    // Navigation menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }
}

// File upload handler
function handleFileUpload(event) {
    event.preventDefault();
    const fileInput = document.getElementById('file-input');
    
    if (!fileInput || !fileInput.files.length) {
        showNotification('Please select a file', 'warning');
        return;
    }

    const file = fileInput.files[0];
    const maxSize = 100 * 1024 * 1024; // 100MB

    if (file.size > maxSize) {
        showNotification('File size exceeds 100MB limit', 'error');
        return;
    }

    uploadFile(file);
}

// Upload file to server
async function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
        showLoadingSpinner();
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            showNotification('File uploaded successfully!', 'success');
            refreshFileList();
        } else {
            throw new Error('Upload failed');
        }
    } catch (error) {
        console.error('Upload error:', error);
        showNotification('Failed to upload file', 'error');
    } finally {
        hideLoadingSpinner();
    }
}

// Search functionality
function handleSearch(event) {
    const query = event.target.value.trim();
    
    if (query.length < 2) {
        return;
    }

    searchFiles(query);
}

// Search files
async function searchFiles(query) {
    try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });

        if (response.ok) {
            const results = await response.json();
            displaySearchResults(results);
        }
    } catch (error) {
        console.error('Search error:', error);
    }
}

// Utility: Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Authentication helpers
function checkAuthentication() {
    const token = getAuthToken();
    if (!token) {
        window.location.href = '/login';
    }
}

function getAuthToken() {
    return localStorage.getItem('auth_token');
}

// Loading spinner
function showLoadingSpinner() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.style.display = 'block';
    }
}

function hideLoadingSpinner() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.style.display = 'none';
    }
}

// Mobile menu toggle
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
        menu.classList.toggle('open');
    }
}

// Load user preferences
function loadUserPreferences() {
    const theme = localStorage.getItem('theme') || 'light';
    document.body.classList.add(`theme-${theme}`);
}

// Refresh file list
function refreshFileList() {
    // Implementation for refreshing file list
    console.log('Refreshing file list...');
}

// Display search results
function displaySearchResults(results) {
    // Implementation for displaying search results
    console.log('Search results:', results);
}
