// Aurora Frontend JavaScript
const API_BASE = '/api';
let conversationHistory = [];
let bookmarkedResponses = new Set(); // Track bookmarked responses
let pendingFeedback = null; // Store pending feedback data for comment modal

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('questionInput');
    const charCount = document.getElementById('charCount');
    const askButton = document.getElementById('askButton');
    const textTab = document.getElementById('textTab');
    const fileTab = document.getElementById('fileTab');
    const typePanel = document.getElementById('typePanel');
    const uploadPanel = document.getElementById('uploadPanel');
    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileInputElement = document.getElementById('fileInput');
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const removeFile = document.getElementById('removeFile');
    
    let selectedFile = null;
    
    // Ask button click handler
    askButton.addEventListener('click', askQuestion);
    
    // Tab switching
    textTab.addEventListener('click', function() {
        textTab.classList.add('active');
        fileTab.classList.remove('active');
        typePanel.style.display = 'block';
        uploadPanel.style.display = 'none';
    });
    
    fileTab.addEventListener('click', function() {
        fileTab.classList.add('active');
        textTab.classList.remove('active');
        typePanel.style.display = 'none';
        uploadPanel.style.display = 'block';
    });
    
    // File upload handlers
    if (fileUploadArea) {
        fileUploadArea.addEventListener('click', () => fileInputElement.click());
        fileUploadArea.addEventListener('dragover', handleDragOver);
        fileUploadArea.addEventListener('dragleave', handleDragLeave);
        fileUploadArea.addEventListener('drop', handleDrop);
    }
    if (fileInputElement) {
        fileInputElement.addEventListener('change', handleFileSelect);
    }
    if (removeFile) {
        removeFile.addEventListener('click', clearFile);
    }
    
    // Topic button click handlers
    document.querySelectorAll('.topic-btn').forEach(button => {
        button.addEventListener('click', function() {
            const topicId = this.getAttribute('data-topic-id');
            console.log('Topic button clicked:', topicId);
            
            // If this topic has FAQs, open the modal
            if (topicId) {
                openFAQModal(topicId);
            } else {
                // Otherwise, use the simple question approach
                const question = this.getAttribute('data-question');
                useExampleQuestion(question);
            }
        });
    });
    
    // Character counter
    input.addEventListener('input', function() {
        const count = input.value.length;
        if (charCount) {
            charCount.textContent = count;
        }
    });

    // Enter to submit (Ctrl+Enter for new line)
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.ctrlKey && !e.shiftKey) {
            e.preventDefault();
            askQuestion();
        }
    });

    // Auto-resize textarea
    input.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 200) + 'px';
    });

    // Load bookmarks from localStorage
    const savedBookmarks = localStorage.getItem('aurora-bookmarks');
    if (savedBookmarks) {
        try {
            bookmarkedResponses = new Set(JSON.parse(savedBookmarks));
        } catch (e) {
            console.log('Failed to load bookmarks');
        }
    }
    
    // Event delegation for dynamically added buttons
    document.addEventListener('click', function(e) {
        console.log('Click detected on:', e.target.className);
        
        // Handle bookmark buttons (check both class and parent)
        let target = e.target;
        if (target.classList.contains('bookmark-button') || target.closest('.bookmark-button')) {
            const button = target.classList.contains('bookmark-button') ? target : target.closest('.bookmark-button');
            const answerId = button.getAttribute('data-answer-id');
            console.log('Bookmark button clicked, answerId:', answerId);
            if (answerId) {
                e.preventDefault();
                e.stopPropagation();
                handleBookmark(answerId);
            }
            return;
        }
        
        // Handle share buttons
        if (target.classList.contains('share-button') || target.closest('.share-button')) {
            const button = target.classList.contains('share-button') ? target : target.closest('.share-button');
            const answerId = button.getAttribute('data-answer-id');
            console.log('Share button clicked, answerId:', answerId);
            if (answerId) {
                e.preventDefault();
                e.stopPropagation();
                handleShare(answerId);
            }
            return;
        }
        
        // Handle feedback thumbs up
        if (target.classList.contains('thumbs-up') || target.closest('.thumbs-up')) {
            const button = target.classList.contains('thumbs-up') ? target : target.closest('.thumbs-up');
            const feedbackId = button.getAttribute('data-feedback-id');
            const answerId = button.getAttribute('data-answer-id');
            console.log('Thumbs up clicked, feedbackId:', feedbackId);
            if (feedbackId) {
                e.preventDefault();
                e.stopPropagation();
                handleFeedback(feedbackId, 'up', answerId);
            }
            return;
        }
        
        // Handle feedback thumbs down
        if (target.classList.contains('thumbs-down') || target.closest('.thumbs-down')) {
            const button = target.classList.contains('thumbs-down') ? target : target.closest('.thumbs-down');
            const feedbackId = button.getAttribute('data-feedback-id');
            const answerId = button.getAttribute('data-answer-id');
            console.log('Thumbs down clicked, feedbackId:', feedbackId);
            if (feedbackId) {
                e.preventDefault();
                e.stopPropagation();
                handleFeedback(feedbackId, 'down', answerId);
            }
            return;
        }
    });
    
    // Load example on first visit
    if (localStorage.getItem('aurora-first-visit') === null) {
        setTimeout(() => {
            useExampleQuestion('What are some sensory strategies for autism?');
        }, 1000);
        localStorage.setItem('aurora-first-visit', 'false');
    }
    
    // File upload functions
    function handleDragOver(e) {
        e.preventDefault();
        fileUploadArea.classList.add('dragover');
    }
    
    function handleDragLeave(e) {
        e.preventDefault();
        fileUploadArea.classList.remove('dragover');
    }
    
    function handleDrop(e) {
        e.preventDefault();
        fileUploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            processFile(files[0]);
        }
    }
    
    function handleFileSelect(e) {
        const files = e.target.files;
        if (files.length > 0) {
            processFile(files[0]);
        }
    }
    
    function processFile(file) {
        // Check file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            showError('File size must be less than 10MB');
            return;
        }
        
        // Check file type
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
        if (!allowedTypes.includes(file.type)) {
            showError('Please upload a PDF, DOC, DOCX, or TXT file');
            return;
        }
        
        selectedFile = file;
        if (fileName) fileName.textContent = file.name;
        if (fileSize) fileSize.textContent = formatFileSize(file.size);
        if (fileInfo) {
            fileInfo.style.display = 'block';
            fileInfo.classList.remove('hidden');
        }
        if (fileUploadArea) fileUploadArea.style.display = 'none';
    }
    
    function clearFile() {
        selectedFile = null;
        const fileInputElement = document.getElementById('fileInput');
        const fileInfo = document.getElementById('fileInfo');
        const fileUploadArea = document.getElementById('fileUploadArea');
        
        if (fileInputElement) fileInputElement.value = '';
        if (fileInfo) {
            fileInfo.style.display = 'none';
            fileInfo.classList.add('hidden');
        }
        if (fileUploadArea) fileUploadArea.style.display = 'block';
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
});

async function askQuestion() {
    console.log('🔍 Ask button clicked!');
    const input = document.getElementById('questionInput');
    const button = document.getElementById('askButton');
    const textTab = document.getElementById('textTab');
    const fileInputElement = document.getElementById('fileInput');
    
    let question = '';
    let isFileUpload = false;
    
    // Check if we're in text or file mode
    if (textTab && textTab.classList.contains('active')) {
        question = input.value.trim();
        if (!question) {
            showError('Please enter a question');
            return;
        }
    } else {
        // File upload mode
        if (!fileInputElement || !fileInputElement.files || fileInputElement.files.length === 0) {
            showError('Please select a file to upload.');
            return;
        }
        isFileUpload = true;
        question = `Please analyze this uploaded file and provide insights related to autism support: ${fileInputElement.files[0].name}`;
    }
    
    console.log('📝 Question entered:', question); // Debug log

    // Update UI for loading state
    button.disabled = true;
    button.innerHTML = '<span class="loading-dots">Processing</span>';
    
    // Add question to conversation immediately
    addToConversation('question', question, [], false, isFileUpload);

    // Show enhanced thinking indicator
    const thinkingId = showThinking();

    try {
        console.log('🚀 Making API request to:', `${API_BASE}/ask`); // Debug log
        
        let requestBody;
        if (isFileUpload) {
            // For file uploads, we'll send the file content
            const file = fileInputElement.files[0];
            const fileContent = await readFileContent(file);
            requestBody = JSON.stringify({ 
                question: question,
                fileContent: fileContent,
                fileName: file.name,
                fileType: file.type
            });
        } else {
            requestBody = JSON.stringify({ question });
        }
        
        const response = await fetch(`${API_BASE}/ask`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: requestBody
        });

        console.log('📡 API response status:', response.status); // Debug log
        const data = await response.json();
        console.log('📦 API response data:', data); // Debug log

        // Remove thinking indicator
        removeThinking(thinkingId);

        if (response.ok && !data.error) {
            // Add successful response with enhanced formatting and feedback buttons
            addToConversation('answer', data.answer, data.references, data.isAutismRelated, false, true);
            
            // Clear input
            if (textTab.classList.contains('active')) {
                input.value = '';
                input.style.height = 'auto';
                document.getElementById('charCount').textContent = '0 / 2000';
            } else {
                // Clear file
                clearFile();
            }

            // Log success
            console.log('Aurora response:', data);
            console.log('Topic type:', data.isAutismRelated ? 'Autism-related' : 'General question');
        } else {
            // Handle error response
            showError(data.message || 'Sorry, I encountered an error. Please try again.');
        }

    } catch (error) {
        console.error('❌ Network error:', error);
        console.error('❌ Error details:', error.message);
        removeThinking(thinkingId);
        showError('I\'m having trouble connecting right now. Please check your internet connection and try again.');
    } finally {
        // Reset button
        button.disabled = false;
        button.innerHTML = 'Send';
    }
}

// Helper function to read file content
async function readFileContent(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        
        if (file.type === 'text/plain') {
            reader.readAsText(file);
        } else {
            // For other file types, we'll read as base64
            reader.readAsDataURL(file);
        }
    });
}

// Helper function to clear file (accessible globally)
function clearFile() {
    const fileInputElement = document.getElementById('fileInputElement');
    const fileInfo = document.getElementById('fileInfo');
    const fileUploadArea = document.getElementById('fileUploadArea');
    
    fileInputElement.value = '';
    fileInfo.classList.add('hidden');
    fileUploadArea.style.display = 'block';
}

function useExampleQuestion(question) {
    const input = document.getElementById('questionInput');
    input.value = question;
    input.focus();
    
    // Auto-submit after a short delay
    setTimeout(() => {
        askQuestion();
    }, 500);
}

function addToConversation(type, content, references = [], isAutismRelated = true, isFileUpload = false, showFeedback = false) {
    const convoBody = document.getElementById('convoBody');
    
    // Clear empty state if this is the first interaction
    if (conversationHistory.length === 0) {
        const emptyState = convoBody.querySelector('.empty-state');
        if (emptyState) {
            emptyState.remove();
        }
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'question' ? 'message msg-user' : 'message msg-aurora';

    if (type === 'question') {
        // User question bubble
        messageDiv.innerHTML = `
            <div class="msg-avatar">👤</div>
            <div class="msg-bubble">
                <div class="msg-label">You</div>
                <div class="question-text">${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
            </div>
        `;
    } else {
        // Aurora answer bubble
        const answerId = 'answer-' + Date.now();
        messageDiv.setAttribute('data-answer-id', answerId);
        
        let bubbleContent = `
            <div class="msg-avatar">∞</div>
            <div class="msg-bubble">
                <div class="msg-label">Aurora</div>
                <div class="answer-text">${formatContent(content)}</div>
        `;

        // Add references if available
        if (references && references.length > 0) {
            bubbleContent += '<div class="references-block"><div class="ref-title">📚 References</div><ul class="ref-list">';
            references.forEach(ref => {
                const linkText = ref.url ? 
                    `<a href="${ref.url}" target="_blank" rel="noopener noreferrer">${ref.title}</a>` : 
                    ref.title;
                bubbleContent += `<li><div>${linkText} <span class="ref-source">— ${ref.organization}</span></div></li>`;
            });
            bubbleContent += '</ul></div>';
        }

        // Add action buttons (bookmark and share)
        bubbleContent += `
            <div class="action-row">
                <button class="action-btn bookmark-button" data-answer-id="${answerId}" id="bookmark-${answerId}">
                    🔖 Bookmark
                </button>
                <button class="action-btn share-button" data-answer-id="${answerId}">
                    🔗 Share
                </button>
            </div>
        `;

        // Add feedback buttons
        if (showFeedback) {
            const feedbackId = 'feedback-' + Date.now();
            bubbleContent += `
                <div class="feedback-row">
                    <span class="feedback-label">Was this helpful?</span>
                    <button class="feedback-btn feedback-yes thumbs-up" data-feedback-id="${feedbackId}" data-answer-id="${answerId}">👍 Yes</button>
                    <button class="feedback-btn feedback-no thumbs-down" data-feedback-id="${feedbackId}" data-answer-id="${answerId}">👎 No</button>
                </div>
            `;
            messageDiv.setAttribute('data-feedback-id', feedbackId);
        }

        bubbleContent += '</div>'; // close msg-bubble
        messageDiv.innerHTML = bubbleContent;
    }

    convoBody.appendChild(messageDiv);

    // Scroll to bottom
    convoBody.scrollTop = convoBody.scrollHeight;

    // Add to history
    conversationHistory.push({ type, content, references, isAutismRelated, isFileUpload, timestamp: new Date() });
}

function formatContent(content) {
    // Clean up JSON artifacts and formatting issues
    let cleaned = content;
    
    // Remove control characters and clean up formatting
    cleaned = cleaned.replace(/[\x00-\x1F\x7F]/g, ''); // Remove control characters
    cleaned = cleaned.replace(/^"|"$/g, ''); // Remove leading/trailing quotes
    cleaned = cleaned.replace(/\\n/g, '\n'); // Convert \n to actual newlines
    cleaned = cleaned.replace(/\\"/g, '"'); // Convert \" to "
    cleaned = cleaned.replace(/\\t/g, '  '); // Convert \t to spaces
    
    // Remove JSON object wrapper if present
    if (cleaned.includes('{"answer":') && cleaned.includes('"isAutismRelated"')) {
        try {
            const parsed = JSON.parse(cleaned);
            cleaned = parsed.answer || cleaned;
        } catch (e) {
            // If parsing fails, try to extract answer manually
            const answerMatch = cleaned.match(/"answer":\s*"([^"]*(?:\\.[^"]*)*)"/);
            if (answerMatch) {
                cleaned = answerMatch[1]
                    .replace(/\\n/g, '\n')
                    .replace(/\\"/g, '"')
                    .replace(/\\t/g, '  ');
            }
        }
    }
    
    // Remove any remaining JSON artifacts
    cleaned = cleaned.replace(/^\s*\{.*?"answer":\s*"([^"]*(?:\\.[^"]*)*)".*?\}\s*$/s, '$1');
    cleaned = cleaned.replace(/^"|"$/g, ''); // Remove any remaining quotes
    
    // Basic formatting for Aurora's responses
    return cleaned
        .replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--sage);">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/(\d+\.\s)/g, '<br>$1') // Add line breaks before numbered items
        .replace(/(^|\n)([-*•]\s)/g, '$1<br>$2') // Add line breaks before bullet points
        .replace(/\n/g, '<br>')
        .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" style="color: var(--lavender); text-decoration: underline;">$1</a>');
}

function showThinking() {
    const convoBody = document.getElementById('convoBody');
    const thinkingDiv = document.createElement('div');
    const thinkingId = 'thinking-' + Date.now();
    
    thinkingDiv.id = thinkingId;
    thinkingDiv.className = 'message msg-aurora';
    thinkingDiv.innerHTML = `
        <div class="msg-avatar">∞</div>
        <div class="msg-bubble" style="padding:16px 20px;">
            <div class="msg-label">Aurora</div>
            <span style="color:var(--text-muted); font-style:italic; font-size:0.88rem;">Aurora is thinking…</span>
        </div>
    `;
    
    convoBody.appendChild(thinkingDiv);
    convoBody.scrollTop = convoBody.scrollHeight;
    
    return thinkingId;
}

function removeThinking(thinkingId) {
    const thinkingDiv = document.getElementById(thinkingId);
    if (thinkingDiv) {
        thinkingDiv.remove();
    }
}

function showError(message) {
    showNotification('⚠️ ' + message, '#FFB8B8');
}

// Feedback handling function
function handleFeedback(feedbackId, type, answerId) {
    console.log('📊 Feedback clicked:', type, 'for', feedbackId);
    
    // Find the feedback buttons using data attributes
    const thumbsUp = document.querySelector(`button.thumbs-up[data-feedback-id="${feedbackId}"]`);
    const thumbsDown = document.querySelector(`button.thumbs-down[data-feedback-id="${feedbackId}"]`);
    
    if (!thumbsUp || !thumbsDown) {
        console.error('Feedback buttons not found for:', feedbackId);
        return;
    }
    
    // Get question and answer text
    const messageDiv = document.querySelector(`[data-feedback-id="${feedbackId}"]`);
    let question = '';
    let answer = '';
    
    if (messageDiv) {
        const answerTextElement = messageDiv.querySelector('.answer-text');
        answer = answerTextElement ? answerTextElement.textContent.trim() : '';
        
        // Find the corresponding question (should be the previous message)
        const allMessages = document.querySelectorAll('.message');
        const answerIndex = Array.from(allMessages).indexOf(messageDiv);
        if (answerIndex > 0) {
            const questionDiv = allMessages[answerIndex - 1];
            const questionTextElement = questionDiv.querySelector('.question-text');
            question = questionTextElement ? questionTextElement.textContent.trim() : '';
        }
    }
    
    // Remove active state from both buttons
    thumbsUp.classList.remove('active');
    thumbsDown.classList.remove('active');
    
    if (type === 'up') {
        // Thumbs up - immediate feedback
        thumbsUp.classList.add('active');
        thumbsDown.disabled = true;
        console.log('👍 Feedback: Helpful');
        
        // Send positive feedback immediately
        sendFeedbackToServer(feedbackId, 'positive', question, answer, '');
        showFeedbackConfirmation('positive');
        
    } else {
        // Thumbs down - MUST provide comment
        console.log('👎 Feedback: Not helpful - requesting comment');
        
        // Store pending feedback data
        pendingFeedback = {
            feedbackId: feedbackId,
            type: 'negative',
            question: question,
            answer: answer,
            thumbsUp: thumbsUp,
            thumbsDown: thumbsDown
        };
        
        // Show comment modal
        showCommentModal();
    }
}

// Send feedback to server with reinforcement learning data and CSV logging
async function sendFeedbackToServer(feedbackId, type, question, answer, comment = '') {
    try {
        const response = await fetch(`${API_BASE}/feedback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                feedbackId: feedbackId,
                type: type,
                timestamp: new Date().toISOString(),
                question: question,
                answer: answer,
                comment: comment
            })
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ Feedback saved to CSV:', result);
            return result;
        } else {
            throw new Error('Failed to save feedback');
        }
    } catch (error) {
        console.error('❌ Feedback submission failed:', error);
        throw error;
    }
}

// Show feedback confirmation
function showFeedbackConfirmation(type) {
    const message = type === 'positive' 
        ? '👍 Thank you! Your feedback helps us improve.' 
        : '👎 Thank you for your feedback. We\'ll work on improving.';
    const color = type === 'positive' ? '#88C399' : '#FFB8B8';
    
    showNotification(message, color);
}

// ========================================
// Comment Modal Functionality (for negative feedback)
// ========================================

// Initialize comment modal event listeners
document.addEventListener('DOMContentLoaded', function() {
    const commentModal = document.getElementById('commentModal');
    const cancelBtn = document.getElementById('cancelComment');
    const submitBtn = document.getElementById('submitComment');
    const commentTextarea = document.getElementById('commentTextarea');
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeCommentModal);
    }
    
    if (submitBtn) {
        submitBtn.addEventListener('click', submitComment);
    }
    
    // Close on overlay click
    if (commentModal) {
        commentModal.addEventListener('click', function(e) {
            if (e.target === commentModal) {
                closeCommentModal();
            }
        });
    }
    
    // Clear required warning on typing
    if (commentTextarea) {
        commentTextarea.addEventListener('input', function() {
            document.getElementById('commentRequired').classList.remove('show');
        });
    }
});

// Show comment modal
function showCommentModal() {
    const modal = document.getElementById('commentModal');
    const textarea = document.getElementById('commentTextarea');
    const requiredWarning = document.getElementById('commentRequired');
    
    // Clear previous content
    textarea.value = '';
    requiredWarning.classList.remove('show');
    
    // Show modal
    modal.classList.add('active');
    
    // Focus textarea
    setTimeout(() => textarea.focus(), 100);
}

// Close comment modal
function closeCommentModal() {
    const modal = document.getElementById('commentModal');
    modal.classList.remove('active');
    
    // Reset pending feedback
    pendingFeedback = null;
}

// Submit comment and feedback
async function submitComment() {
    const textarea = document.getElementById('commentTextarea');
    const comment = textarea.value.trim();
    const requiredWarning = document.getElementById('commentRequired');
    
    // Validate that comment is provided
    if (!comment) {
        requiredWarning.classList.add('show');
        textarea.focus();
        return;
    }
    
    if (!pendingFeedback) {
        console.error('No pending feedback data');
        return;
    }
    
    try {
        // Send feedback with comment to server
        await sendFeedbackToServer(
            pendingFeedback.feedbackId,
            pendingFeedback.type,
            pendingFeedback.question,
            pendingFeedback.answer,
            comment
        );
        
        // Update UI
        pendingFeedback.thumbsDown.classList.add('active');
        pendingFeedback.thumbsUp.disabled = true;
        
        // Close modal
        closeCommentModal();
        
        // Show confirmation
        showFeedbackConfirmation('negative');
        
        console.log('✅ Negative feedback submitted with comment');
        
    } catch (error) {
        console.error('Failed to submit feedback:', error);
        alert('Failed to submit feedback. Please try again.');
    }
}

// ========================================
// Bookmark & Share Functionality
// ========================================

// Handle bookmark action
function handleBookmark(answerId) {
    console.log('🔖 Bookmark clicked for:', answerId);
    const button = document.getElementById(`bookmark-${answerId}`);
    
    if (!button) {
        console.error('Bookmark button not found:', answerId);
        return;
    }
    
    // Get the answer content to store
    let answerContent = '';
    let questionContent = '';
    
    // Check if this is an FAQ bookmark
    if (answerId.startsWith('faq-answer-')) {
        const faqAnswerElement = document.getElementById('faqAnswerText');
        const faqQuestionElement = document.getElementById('faqQuestionText');
        if (faqAnswerElement) {
            answerContent = faqAnswerElement.getAttribute('data-full-content') || faqAnswerElement.textContent.trim();
            questionContent = faqAnswerElement.getAttribute('data-question') || (faqQuestionElement ? faqQuestionElement.textContent : '');
        }
    } else {
        // Main conversation bookmark
        const answerDiv = document.querySelector(`[data-answer-id="${answerId}"]`);
        if (answerDiv) {
            const answerTextElement = answerDiv.querySelector('.answer-text');
            if (answerTextElement) {
                answerContent = answerTextElement.textContent.trim();
            }
        }
    }
    
    if (bookmarkedResponses.has(answerId)) {
        // Remove bookmark
        bookmarkedResponses.delete(answerId);
        button.classList.remove('bookmarked');
        button.innerHTML = '🔖 Bookmark';
        showNotification('Bookmark removed', 'var(--text-muted)');
        console.log('✅ Bookmark removed');
    } else {
        // Add bookmark with content
        bookmarkedResponses.add(answerId);
        button.classList.add('bookmarked');
        button.innerHTML = '✅ Bookmarked';
        showNotification('Response bookmarked!', 'var(--sage)');
        console.log('✅ Bookmark added');
        
        // Store bookmark data (optional - for future retrieval feature)
        const bookmarkData = {
            id: answerId,
            question: questionContent,
            answer: answerContent.substring(0, 500),
            timestamp: new Date().toISOString()
        };
        
        // Store in localStorage
        const existingBookmarkData = JSON.parse(localStorage.getItem('aurora-bookmark-data') || '{}');
        existingBookmarkData[answerId] = bookmarkData;
        localStorage.setItem('aurora-bookmark-data', JSON.stringify(existingBookmarkData));
    }
    
    // Store bookmark IDs
    localStorage.setItem('aurora-bookmarks', JSON.stringify([...bookmarkedResponses]));
}

// Handle share action
async function handleShare(answerId) {
    console.log('🔗 Share clicked for:', answerId);
    
    let text = '';
    let questionText = '';
    let answerText = '';
    
    // Check if this is an FAQ answer
    if (answerId.startsWith('faq-answer-')) {
        console.log('Sharing FAQ answer...');
        
        // Get content from FAQ modal
        const faqAnswerElement = document.getElementById('faqAnswerText');
        const faqQuestionElement = document.getElementById('faqQuestionText');
        
        if (faqQuestionElement) {
            questionText = faqQuestionElement.textContent.trim();
        }
        
        if (faqAnswerElement) {
            // Get the stored full content or extract from visible text
            answerText = faqAnswerElement.getAttribute('data-full-content') || faqAnswerElement.textContent.trim();
            
            // Remove the bookmark/share buttons text if present
            answerText = answerText.replace(/🔖 Bookmark|✅ Bookmarked|🔗 Share/g, '').trim();
        }
        
        if (questionText && answerText) {
            text = `Question: ${questionText}\n\nAnswer: ${answerText}\n\n---\nShared from Aurora Autism Assistant`;
        }
        
    } else {
        // Main conversation answer
        console.log('Sharing main conversation answer...');
        
        const answerDiv = document.querySelector(`[data-answer-id="${answerId}"]`);
        if (answerDiv) {
            const answerTextElement = answerDiv.querySelector('.answer-text');
            if (answerTextElement) {
                answerText = answerTextElement.textContent.trim();
            }
            
            // Try to find the corresponding question
            const allMessages = document.querySelectorAll('.message');
            const answerIndex = Array.from(allMessages).indexOf(answerDiv);
            if (answerIndex > 0) {
                const questionDiv = allMessages[answerIndex - 1];
                const questionTextElement = questionDiv.querySelector('.question-text');
                if (questionTextElement) {
                    questionText = questionTextElement.textContent.trim();
                }
            }
            
            if (questionText && answerText) {
                text = `Question: ${questionText}\n\nAnswer: ${answerText}\n\n---\nShared from Aurora Autism Assistant`;
            } else {
                text = answerText + '\n\n---\nShared from Aurora Autism Assistant';
            }
        }
    }
    
    if (!text) {
        console.error('No answer text found for:', answerId);
        showNotification('Failed to share. Please try again.', '#FFB8B8');
        return;
    }
    
    // Clean up HTML and extra whitespace
    text = text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').replace(/ \. /g, '. ').trim();
    
    console.log('Sharing text:', text.substring(0, 100) + '...');
    
    // Try to use Web Share API if available (mobile/supported browsers)
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Aurora - Autism Support',
                text: text.substring(0, 1000) + (text.length > 1000 ? '...' : ''),
                url: window.location.href
            });
            showNotification('Shared successfully!', '#88C399');
            console.log('✅ Shared successfully via Web Share API');
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.log('Share cancelled or failed, using clipboard:', error);
                copyToClipboard(text);
            }
        }
    } else {
        // Fallback - copy to clipboard
        console.log('Web Share API not available, using clipboard');
        copyToClipboard(text);
    }
}

// Helper function to copy to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showNotification('Response copied to clipboard!', '#88C399');
        console.log('✅ Copied to clipboard');
    } catch (error) {
        console.error('Failed to copy:', error);
        showNotification('Failed to copy. Please try again.', '#FFB8B8');
    }
}

// Show notification
function showNotification(message, color = null) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    if (color) {
        notification.style.background = color;
    }
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// ========================================
// FAQ Modal Functionality
// ========================================

let currentFAQData = null;
let currentFAQIndex = 0;
let currentFAQAnswers = {}; // Cache answers by question index

// Initialize FAQ modal event listeners
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('faqModal');
    const closeBtn = document.getElementById('closeFaqModal');
    const prevBtn = document.getElementById('prevQuestion');
    const nextBtn = document.getElementById('nextQuestion');
    
    // Close modal handlers
    closeBtn.addEventListener('click', closeFAQModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeFAQModal();
        }
    });
    
    // Navigation handlers
    prevBtn.addEventListener('click', showPreviousFAQ);
    nextBtn.addEventListener('click', showNextFAQ);
    
    // ESC key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeFAQModal();
        }
    });
});

// Open FAQ modal for a specific topic
async function openFAQModal(topicId) {
    const modal = document.getElementById('faqModal');
    const modalTitle = document.getElementById('faqModalTitle');
    
    try {
        // Show modal with loading state
        modal.classList.add('active');
        if (modalTitle) modalTitle.textContent = 'Loading FAQs...';
        
        // Fetch FAQ data from API
        const response = await fetch(`${API_BASE}/faqs/${topicId}`);
        
        if (!response.ok) {
            throw new Error('Failed to load FAQs');
        }
        
        const data = await response.json();
        currentFAQData = data.topic;
        currentFAQIndex = 0;
        currentFAQAnswers = {};
        
        // Update modal title
        if (modalTitle) modalTitle.textContent = currentFAQData.title;
        
        // Update FAQ info text with topic name
        const faqTopicName = document.getElementById('faqTopicName');
        if (faqTopicName) {
            faqTopicName.textContent = currentFAQData.title;
        }
        
        // Display first question and process answer
        displayCurrentFAQ();
        
        console.log('📚 Loaded', currentFAQData.questions.length, 'FAQs for', currentFAQData.title);
        
    } catch (error) {
        console.error('Error loading FAQs:', error);
        showError('Failed to load FAQs. Please try again.');
        closeFAQModal();
    }
}

// Display the current FAQ question and answer
async function displayCurrentFAQ() {
    if (!currentFAQData) return;
    
    const question = currentFAQData.questions[currentFAQIndex];
    const questionText = document.getElementById('faqQuestionText');
    const answerText = document.getElementById('faqAnswerText');
    const counter = document.getElementById('faqCounter');
    const prevBtn = document.getElementById('prevQuestion');
    const nextBtn = document.getElementById('nextQuestion');
    
    // Update counter
    counter.textContent = `Question ${currentFAQIndex + 1} of ${currentFAQData.questions.length}`;
    
    // Update question
    questionText.textContent = question;
    
    // Update navigation buttons
    prevBtn.disabled = currentFAQIndex === 0;
    nextBtn.textContent = currentFAQIndex === currentFAQData.questions.length - 1 ? 'Close' : 'Next →';
    
    // Check if we already have the answer cached
    if (currentFAQAnswers[currentFAQIndex]) {
        const cachedAnswer = currentFAQAnswers[currentFAQIndex];
        answerText.innerHTML = formatContent(cachedAnswer);
        
        // Re-add bookmark and share buttons for cached answers
        const faqAnswerId = `faq-answer-${currentFAQIndex}`;
        const isBookmarked = bookmarkedResponses.has(faqAnswerId);
        const actionButtonsHtml = `
            <div class="action-row">
                <button class="action-btn bookmark-button ${isBookmarked ? 'bookmarked' : ''}" data-answer-id="${faqAnswerId}" data-is-faq="true" id="bookmark-${faqAnswerId}">
                    ${isBookmarked ? '✅ Bookmarked' : '🔖 Bookmark'}
                </button>
                <button class="action-btn share-button" data-answer-id="${faqAnswerId}" data-is-faq="true">
                    🔗 Share
                </button>
            </div>
        `;
        answerText.innerHTML += actionButtonsHtml;
        
        // Store data attributes for sharing
        answerText.setAttribute('data-full-content', cachedAnswer);
        answerText.setAttribute('data-question', question);
    } else {
        // Show loading state
        answerText.innerHTML = '<div class="faq-loading">Processing your question with Aurora...</div>';
        
        // Fetch answer from Aurora API
        try {
            const response = await fetch(`${API_BASE}/ask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: question })
            });
            
            if (!response.ok) {
                throw new Error('Failed to get answer');
            }
            
            const data = await response.json();
            
            // Cache the answer
            currentFAQAnswers[currentFAQIndex] = data.answer;
            
            // Display the answer
            answerText.innerHTML = formatContent(data.answer);
            
            // Add references if available
            if (data.references && data.references.length > 0) {
                let referencesHtml = '<div class="references-block" style="margin-top: 15px;"><div class="ref-title">📚 References</div><ul class="ref-list">';
                data.references.forEach(ref => {
                    const linkText = ref.url ? 
                        `<a href="${ref.url}" target="_blank" rel="noopener noreferrer">${ref.title}</a>` : 
                        ref.title;
                    referencesHtml += `<li><div>${linkText} <span class="ref-source">— ${ref.organization}</span></div></li>`;
                });
                referencesHtml += '</ul></div>';
                answerText.innerHTML += referencesHtml;
            }
            
            // Add bookmark and share buttons to FAQ modal
            const faqAnswerId = `faq-answer-${currentFAQIndex}`;
            const isBookmarked = bookmarkedResponses.has(faqAnswerId);
            const actionButtonsHtml = `
                <div class="action-row">
                    <button class="action-btn bookmark-button ${isBookmarked ? 'bookmarked' : ''}" data-answer-id="${faqAnswerId}" data-is-faq="true" id="bookmark-${faqAnswerId}">
                        ${isBookmarked ? '✅ Bookmarked' : '🔖 Bookmark'}
                    </button>
                    <button class="action-btn share-button" data-answer-id="${faqAnswerId}" data-is-faq="true">
                        🔗 Share
                    </button>
                </div>
            `;
            answerText.innerHTML += actionButtonsHtml;
            
            // Store the full content for bookmarking/sharing
            answerText.setAttribute('data-full-content', data.answer);
            answerText.setAttribute('data-question', question);
            
            console.log('✅ FAQ answer loaded and cached for question', currentFAQIndex + 1);
            
        } catch (error) {
            console.error('Error getting FAQ answer:', error);
            answerText.innerHTML = '<div style="color: #dc3545;">Sorry, I encountered an error processing this question. Please try again.</div>';
        }
    }
}

// Show previous FAQ
function showPreviousFAQ() {
    if (currentFAQIndex > 0) {
        currentFAQIndex--;
        displayCurrentFAQ();
    }
}

// Show next FAQ or close if at end
function showNextFAQ() {
    if (currentFAQIndex < currentFAQData.questions.length - 1) {
        currentFAQIndex++;
        displayCurrentFAQ();
    } else {
        // At the end, close the modal
        closeFAQModal();
    }
}

// Close FAQ modal
function closeFAQModal() {
    const modal = document.getElementById('faqModal');
    modal.classList.remove('active');
    
    // Reset state
    currentFAQData = null;
    currentFAQIndex = 0;
    currentFAQAnswers = {};
}

// ========================================
// End FAQ Modal Functionality
// ========================================

// Accessibility improvements
document.addEventListener('keydown', function(e) {
    // ESC to clear input (only if modal is not open)
    if (e.key === 'Escape') {
        const modal = document.getElementById('faqModal');
        if (!modal.classList.contains('active')) {
            document.getElementById('questionInput').value = '';
            document.getElementById('charCount').textContent = '0 / 2000';
        }
    }
});