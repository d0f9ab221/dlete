// YouTube Thumbnail Downloader
// Extracts thumbnails from YouTube videos in multiple qualities

// DOM Elements
const youtubeUrlInput = document.getElementById('youtubeUrl');
const downloadBtn = document.getElementById('downloadBtn');
const errorMessage = document.getElementById('errorMessage');
const resultsSection = document.getElementById('resultsSection');

// Thumbnail Elements
const hqThumbnail = document.getElementById('hqThumbnail');
const sdThumbnail = document.getElementById('sdThumbnail');
const maxThumbnail = document.getElementById('maxThumbnail');

// Download Links
const hqDownload = document.getElementById('hqDownload');
const sdDownload = document.getElementById('sdDownload');
const maxDownload = document.getElementById('maxDownload');

// YouTube URL Patterns
const youtubePatterns = [
    /^https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /^https:\/\/youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /^https:\/\/youtu\.be\/([a-zA-Z0-9_-]{11})/
];

// Thumbnail URL Templates
const thumbnailTemplates = {
    max: 'https://img.youtube.com/vi/%s/maxresdefault.jpg',
    hq: 'https://img.youtube.com/vi/%s/hqdefault.jpg',
    sd: 'https://img.youtube.com/vi/%s/sddefault.jpg',
    mq: 'https://img.youtube.com/vi/%s/mqdefault.jpg'
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Add input event listener for real-time validation
    youtubeUrlInput.addEventListener('input', validateInput);
    
    // Add button click event
    downloadBtn.addEventListener('click', extractThumbnails);
    
    // Allow Enter key to trigger extraction
    youtubeUrlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            extractThumbnails();
        }
    });
});

// Validate input
function validateInput() {
    const url = youtubeUrlInput.value.trim();
    
    if (url.length === 0) {
        showError('');
        return false;
    }
    
    // Check if it matches any YouTube pattern
    const isValid = youtubePatterns.some(pattern => pattern.test(url));
    
    if (!isValid) {
        showError('Please enter a valid YouTube URL');
        return false;
    }
    
    showError('');
    return true;
}

// Show error message
function showError(message) {
    if (message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        downloadBtn.disabled = true;
        downloadBtn.style.opacity = '0.6';
        downloadBtn.style.cursor = 'not-allowed';
    } else {
        errorMessage.style.display = 'none';
        downloadBtn.disabled = false;
        downloadBtn.style.opacity = '1';
        downloadBtn.style.cursor = 'pointer';
    }
}

// Extract video ID from YouTube URL
function extractVideoId(url) {
    for (const pattern of youtubePatterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }
    return null;
}

// Extract thumbnails
async function extractThumbnails() {
    if (!validateInput()) {
        return;
    }
    
    const url = youtubeUrlInput.value.trim();
    const videoId = extractVideoId(url);
    
    if (!videoId) {
        showError('Could not extract video ID. Please check the URL.');
        return;
    }
    
    // Hide results section initially
    resultsSection.style.display = 'none';
    
    try {
        // Generate thumbnail URLs
        const maxUrl = generateThumbnailUrl(videoId, 'max');
        const hqUrl = generateThumbnailUrl(videoId, 'hq');
        const sdUrl = generateThumbnailUrl(videoId, 'sd');
        
        // Set image sources
        hqThumbnail.src = hqUrl;
        sdThumbnail.src = sdUrl;
        maxThumbnail.src = maxUrl;
        
        // Set download links
        hqDownload.href = hqUrl;
        sdDownload.href = sdUrl;
        maxDownload.href = maxUrl;
        
        // Show results section with animation
        resultsSection.style.display = 'block';
        resultsSection.classList.add('fade-in');
        
        // Clear any previous error
        showError('');
        
    } catch (error) {
        console.error('Error extracting thumbnails:', error);
        showError('An error occurred while extracting thumbnails. Please try again.');
    }
}

// Generate thumbnail URL based on quality
function generateThumbnailUrl(videoId, quality) {
    const template = thumbnailTemplates[quality];
    if (!template) {
        throw new Error(`Invalid quality: ${quality}`);
    }
    return template.replace('%s', videoId);
}

// Optional: Preload thumbnails when hovering over download buttons
hqDownload.addEventListener('mouseover', () => {
    if (hqThumbnail.src) {
        const img = new Image();
        img.src = hqThumbnail.src;
    }
});

maxDownload.addEventListener('mouseover', () => {
    if (maxThumbnail.src) {
        const img = new Image();
        img.src = maxThumbnail.src;
    }
});

// Optional: Add loading state to download buttons
function addLoadingState(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    button.disabled = true;
    
    return originalText;
}

function removeLoadingState(button, originalText) {
    button.innerHTML = originalText;
    button.disabled = false;
}

// Optional: Add copy link functionality
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = downloadBtn.innerHTML;
        const originalColor = downloadBtn.style.background;
        
        downloadBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        downloadBtn.style.background = '#4CAF50';
        
        setTimeout(() => {
            downloadBtn.innerHTML = originalText;
            downloadBtn.style.background = originalColor;
        }, 2000);
    });
}