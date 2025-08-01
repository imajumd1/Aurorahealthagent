// Aurora Frontend JavaScript
const API_BASE = '/api';
let conversationHistory = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('questionInput');
    const charCount = document.getElementById('charCount');
    const askButton = document.getElementById('askButton');
    
    // Ask button click handler
    askButton.addEventListener('click', askQuestion);
    
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
});

async function askQuestion() {
    console.log('🔍 Ask button clicked!'); // Debug log
    const input = document.getElementById('questionInput');
    const button = document.getElementById('askButton');
    const question = input.value.trim();
    
    console.log('📝 Question entered:', question); // Debug log

    if (!question) {
        console.log('❌ No question entered'); // Debug log
        showError('Please enter a question about autism.');
        return;
    }

    // Update UI for loading state
    button.disabled = true;
    button.innerHTML = '<span class="loading-dots">Thinking</span>';
    
    // Add question to conversation immediately
    addToConversation('question', question);

    // Show thinking indicator
    const thinkingId = showThinking();

    try {
        console.log('🚀 Making API request to:', `${API_BASE}/ask`); // Debug log
        const response = await fetch(`${API_BASE}/ask`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question })
        });

        console.log('📡 API response status:', response.status); // Debug log
        const data = await response.json();
        console.log('📦 API response data:', data); // Debug log

        // Remove thinking indicator
        removeThinking(thinkingId);

        if (response.ok && !data.error) {
            // Add successful response
            addToConversation('answer', data.answer, data.references);
            
            // Clear input
            input.value = '';
            input.style.height = 'auto';
            document.getElementById('charCount').textContent = '0 / 2000';

            // Log success
            console.log('Aurora response:', data);
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

function useExampleQuestion(question) {
    const input = document.getElementById('questionInput');
    input.value = question;
    input.focus();
    
    // Auto-submit after a short delay
    setTimeout(() => {
        askQuestion();
    }, 500);
}

function addToConversation(type, content, references = []) {
    const conversationContent = document.getElementById('conversation-content');
    
    // Clear initial message if this is the first interaction
    if (conversationHistory.length === 0) {
        conversationContent.innerHTML = '';
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;

    let html = `<div class="message-content">${formatContent(content)}</div>`;

    if (references && references.length > 0) {
        html += '<div class="references">';
        html += '<h4>📚 References:</h4>';
        references.forEach(ref => {
            html += `<div class="reference">• ${ref.title} - ${ref.organization}</div>`;
        });
        html += '</div>';
    }

    messageDiv.innerHTML = html;
    conversationContent.appendChild(messageDiv);

    // Scroll to bottom
    conversationContent.scrollTop = conversationContent.scrollHeight;

    // Add to history
    conversationHistory.push({ type, content, references, timestamp: new Date() });
}

function formatContent(content) {
    // Basic formatting for Aurora's responses
    return content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
}

function showThinking() {
    const conversationContent = document.getElementById('conversation-content');
    const thinkingDiv = document.createElement('div');
    const thinkingId = 'thinking-' + Date.now();
    
    thinkingDiv.id = thinkingId;
    thinkingDiv.className = 'thinking';
    thinkingDiv.textContent = 'Thinking about your question...';
    
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

// Accessibility improvements
document.addEventListener('keydown', function(e) {
    // ESC to clear input
    if (e.key === 'Escape') {
        document.getElementById('questionInput').value = '';
        document.getElementById('charCount').textContent = '0 / 2000';
    }
});