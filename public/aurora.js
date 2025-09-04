// Aurora Frontend JavaScript
const API_BASE = '/api';
let conversationHistory = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('questionInput');
    const charCount = document.getElementById('charCount');
    const askButton = document.getElementById('askButton');
    const textTab = document.getElementById('textTab');
    const fileTab = document.getElementById('fileTab');
    const textInput = document.getElementById('textInput');
    const fileInput = document.getElementById('fileInput');
    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileInputElement = document.getElementById('fileInputElement');
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const removeFile = document.getElementById('removeFile');
    
    let selectedFile = null;
    
    // Ask button click handler
    askButton.addEventListener('click', askQuestion);
    
    // Tab switching
    textTab.addEventListener('click', () => switchTab('text'));
    fileTab.addEventListener('click', () => switchTab('file'));
    
    // File upload handlers
    fileUploadArea.addEventListener('click', () => fileInputElement.click());
    fileUploadArea.addEventListener('dragover', handleDragOver);
    fileUploadArea.addEventListener('dragleave', handleDragLeave);
    fileUploadArea.addEventListener('drop', handleDrop);
    fileInputElement.addEventListener('change', handleFileSelect);
    removeFile.addEventListener('click', clearFile);
    
    // Topic button click handlers
    document.querySelectorAll('.topic-button').forEach(button => {
        button.addEventListener('click', function() {
            const question = this.getAttribute('data-question');
            useExampleQuestion(question);
        });
    });
    
    // Character counter
    input.addEventListener('input', function() {
        const count = input.value.length;
        charCount.textContent = `${count} / 2000`;
        charCount.style.color = count > 1800 ? '#dc3545' : 'var(--text-light)';
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

    // Load example on first visit
    if (localStorage.getItem('aurora-first-visit') === null) {
        setTimeout(() => {
            useExampleQuestion('What are some sensory strategies for autism?');
        }, 1000);
        localStorage.setItem('aurora-first-visit', 'false');
    }
    
    // Tab switching function
    function switchTab(tab) {
        if (tab === 'text') {
            textTab.classList.add('active');
            fileTab.classList.remove('active');
            textInput.classList.remove('hidden');
            fileInput.classList.add('hidden');
        } else {
            fileTab.classList.add('active');
            textTab.classList.remove('active');
            textInput.classList.add('hidden');
            fileInput.classList.remove('hidden');
        }
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
        fileName.textContent = file.name;
        fileSize.textContent = formatFileSize(file.size);
        fileInfo.classList.remove('hidden');
        fileUploadArea.style.display = 'none';
    }
    
    function clearFile() {
        selectedFile = null;
        fileInputElement.value = '';
        fileInfo.classList.add('hidden');
        fileUploadArea.style.display = 'block';
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
    console.log('🔍 Ask button clicked!'); // Debug log
    const input = document.getElementById('questionInput');
    const button = document.getElementById('askButton');
    const textTab = document.getElementById('textTab');
    const fileInput = document.getElementById('fileInput');
    
    let question = '';
    let isFileUpload = false;
    
    // Check if we're in text or file mode
    if (textTab.classList.contains('active')) {
        question = input.value.trim();
        if (!question) {
            showError('Please enter a question - I can help with autism topics or guide you elsewhere.');
            return;
        }
    } else {
        // File upload mode
        const fileInputElement = document.getElementById('fileInputElement');
        if (!fileInputElement.files || fileInputElement.files.length === 0) {
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
        button.innerHTML = 'Ask';
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
    const conversationContent = document.getElementById('conversation-content');
    
    // Clear initial message if this is the first interaction
    if (conversationHistory.length === 0) {
        conversationContent.innerHTML = '';
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;

    let html = `<div class="message-content ${type === 'question' ? 'question-text' : 'answer-text'}">${formatContent(content)}</div>`;

    // Add file upload indicator for questions
    if (type === 'question' && isFileUpload) {
        const fileIndicator = '<div style="margin-top: 10px; padding: 8px; background: #e3f2fd; border-radius: 4px; font-size: 0.85rem; color: #1565c0;"><strong>📄 File Upload Question</strong></div>';
        html += fileIndicator;
    }

    // Add topic indicator for answers
    if (type === 'answer') {
        const topicIndicator = isAutismRelated 
            ? '<div style="margin-top: 10px; padding: 8px; background: #e8f5e8; border-radius: 4px; font-size: 0.85rem; color: #2d5a2d;"><strong>🧩 Autism Support Response</strong></div>'
            : '<div style="margin-top: 10px; padding: 8px; background: #fff3cd; border-radius: 4px; font-size: 0.85rem; color: #856404;"><strong>💡 General Question Response</strong></div>';
        html += topicIndicator;
    }

    if (references && references.length > 0) {
        html += '<div class="references">';
        html += '<h4>📚 References:</h4>';
        references.forEach(ref => {
            const linkText = ref.url ? 
                `<a href="${ref.url}" target="_blank" rel="noopener noreferrer" style="color: var(--primary-blue); text-decoration: underline;">${ref.title}</a>` : 
                ref.title;
            html += `<div class="reference">• ${linkText} - ${ref.organization}</div>`;
        });
        html += '</div>';
    }

    // Add feedback buttons for answers
    if (type === 'answer' && showFeedback) {
        const feedbackId = 'feedback-' + Date.now();
        html += `
            <div class="feedback-section">
                <span class="feedback-label">Was this helpful?</span>
                <div class="feedback-buttons">
                    <button class="feedback-button thumbs-up" onclick="handleFeedback('${feedbackId}', 'up')">
                        👍 Yes
                    </button>
                    <button class="feedback-button thumbs-down" onclick="handleFeedback('${feedbackId}', 'down')">
                        👎 No
                    </button>
                </div>
            </div>
        `;
        messageDiv.setAttribute('data-feedback-id', feedbackId);
    }

    messageDiv.innerHTML = html;
    conversationContent.appendChild(messageDiv);

    // Scroll to bottom
    conversationContent.scrollTop = conversationContent.scrollHeight;

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
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/(\d+\.\s)/g, '<br>$1') // Add line breaks before numbered items
        .replace(/(^|\n)([-*•]\s)/g, '$1<br>$2') // Add line breaks before bullet points
        .replace(/\n/g, '<br>')
        .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" style="color: var(--primary-blue); text-decoration: underline;">$1</a>');
}

function showThinking() {
    const conversationContent = document.getElementById('conversation-content');
    const thinkingDiv = document.createElement('div');
    const thinkingId = 'thinking-' + Date.now();
    
    thinkingDiv.id = thinkingId;
    thinkingDiv.className = 'thinking';
    thinkingDiv.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; padding: 20px;">
            <div style="margin-right: 10px; animation: thinking 2s ease-in-out infinite;">🤔</div>
            <div>
                <div style="font-weight: 600; margin-bottom: 5px;">Processing your question with AI intelligence...</div>
                <div style="font-size: 0.9rem; opacity: 0.8;">Analyzing and generating thoughtful response</div>
            </div>
        </div>
    `;
    
    conversationContent.appendChild(thinkingDiv);
    conversationContent.scrollTop = conversationContent.scrollHeight;
    
    return thinkingId;
}

function removeThinking(thinkingId) {
    const thinkingDiv = document.getElementById(thinkingId);
    if (thinkingDiv) {
        thinkingDiv.remove();
    }
}

function showError(message) {
    const conversationContent = document.getElementById('conversation-content');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<strong>⚠️ Error:</strong> ${message}`;
    
    conversationContent.appendChild(errorDiv);
    conversationContent.scrollTop = conversationContent.scrollHeight;

    // Auto-remove error after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

// Feedback handling function
function handleFeedback(feedbackId, type) {
    const messageDiv = document.querySelector(`[data-feedback-id="${feedbackId}"]`);
    if (!messageDiv) return;
    
    const thumbsUp = messageDiv.querySelector('.thumbs-up');
    const thumbsDown = messageDiv.querySelector('.thumbs-down');
    
    // Remove active state from both buttons
    thumbsUp.classList.remove('active');
    thumbsDown.classList.remove('active');
    
    // Add active state to clicked button
    if (type === 'up') {
        thumbsUp.classList.add('active');
        thumbsDown.disabled = true;
        console.log('👍 Feedback: Helpful');
    } else {
        thumbsDown.classList.add('active');
        thumbsUp.disabled = true;
        console.log('👎 Feedback: Not helpful');
    }
    
    // Send feedback to server (optional)
    sendFeedbackToServer(feedbackId, type);
}

// Send feedback to server with reinforcement learning data
async function sendFeedbackToServer(feedbackId, type) {
    try {
        // Find the conversation entry for this feedback
        const messageDiv = document.querySelector(`[data-feedback-id="${feedbackId}"]`);
        if (!messageDiv) return;
        
        // Extract question and answer from the conversation
        const questionElement = messageDiv.querySelector('.question-text');
        const answerElement = messageDiv.querySelector('.answer-text');
        
        const question = questionElement ? questionElement.textContent.trim() : '';
        const answer = answerElement ? answerElement.textContent.trim() : '';
        
        const response = await fetch(`${API_BASE}/feedback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                feedbackId: feedbackId,
                type: type === 'up' ? 'positive' : 'negative',
                timestamp: new Date().toISOString(),
                question: question,
                answer: answer
            })
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ Feedback processed:', result);
            
            // Show feedback confirmation
            showFeedbackConfirmation(type === 'up' ? 'positive' : 'negative');
        }
    } catch (error) {
        console.log('Feedback submission failed:', error);
        // Don't show error to user as this is optional
    }
}

// Show feedback confirmation
function showFeedbackConfirmation(type) {
    const messageDiv = document.querySelector('.feedback-confirmation');
    if (messageDiv) {
        messageDiv.remove();
    }
    
    const confirmation = document.createElement('div');
    confirmation.className = 'feedback-confirmation';
    confirmation.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'positive' ? '#4CAF50' : '#f44336'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 1000;
            font-size: 14px;
            animation: slideIn 0.3s ease-out;
        ">
            ${type === 'positive' ? '👍 Thank you! Your feedback helps us improve.' : '👎 Thank you! We\'ll work on improving this response.'}
        </div>
    `;
    
    document.body.appendChild(confirmation);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (confirmation.parentNode) {
            confirmation.parentNode.removeChild(confirmation);
        }
    }, 3000);
}

// Accessibility improvements
document.addEventListener('keydown', function(e) {
    // ESC to clear input
    if (e.key === 'Escape') {
        document.getElementById('questionInput').value = '';
        document.getElementById('charCount').textContent = '0 / 2000';
    }
});