/**
 * Feedback Logger - Stores user feedback in CSV format
 */

const fs = require('fs');
const path = require('path');

const FEEDBACK_DIR = path.join(__dirname, '../../feedback-data');
const FEEDBACK_FILE = path.join(FEEDBACK_DIR, 'user-feedback.csv');

// Ensure feedback directory exists
function ensureFeedbackDirectory() {
  if (!fs.existsSync(FEEDBACK_DIR)) {
    fs.mkdirSync(FEEDBACK_DIR, { recursive: true });
    console.log('📁 Created feedback directory:', FEEDBACK_DIR);
  }
}

// Initialize CSV file with headers if it doesn't exist
function initializeFeedbackFile() {
  ensureFeedbackDirectory();
  
  if (!fs.existsSync(FEEDBACK_FILE)) {
    const headers = 'Timestamp,Feedback_Type,Question,Answer,Comment,User_Agent,IP_Address\n';
    fs.writeFileSync(FEEDBACK_FILE, headers, 'utf8');
    console.log('📄 Created feedback CSV file:', FEEDBACK_FILE);
  }
}

// Escape CSV field (handle quotes and commas)
function escapeCsvField(field) {
  if (field === null || field === undefined) {
    return '';
  }
  
  const stringField = String(field);
  
  // If field contains comma, newline, or quote, wrap in quotes and escape quotes
  if (stringField.includes(',') || stringField.includes('\n') || stringField.includes('"')) {
    return '"' + stringField.replace(/"/g, '""') + '"';
  }
  
  return stringField;
}

// Log feedback to CSV
function logFeedback(feedbackData) {
  try {
    initializeFeedbackFile();
    
    const {
      feedbackId,
      type,
      timestamp,
      question,
      answer,
      comment,
      userAgent,
      ipAddress
    } = feedbackData;
    
    // Create CSV row
    const row = [
      escapeCsvField(timestamp),
      escapeCsvField(type),
      escapeCsvField(question),
      escapeCsvField(answer),
      escapeCsvField(comment || ''),
      escapeCsvField(userAgent || ''),
      escapeCsvField(ipAddress || '')
    ].join(',') + '\n';
    
    // Append to file
    fs.appendFileSync(FEEDBACK_FILE, row, 'utf8');
    
    console.log(`✅ Feedback logged: ${type} - ${feedbackId}`);
    
    return {
      success: true,
      message: 'Feedback saved successfully',
      filePath: FEEDBACK_FILE
    };
    
  } catch (error) {
    console.error('❌ Error logging feedback:', error);
    return {
      success: false,
      message: 'Failed to save feedback',
      error: error.message
    };
  }
}

// Get feedback file path
function getFeedbackFilePath() {
  ensureFeedbackDirectory();
  return FEEDBACK_FILE;
}

// Get feedback statistics
function getFeedbackStats() {
  try {
    if (!fs.existsSync(FEEDBACK_FILE)) {
      return {
        totalFeedback: 0,
        positive: 0,
        negative: 0,
        withComments: 0
      };
    }
    
    const content = fs.readFileSync(FEEDBACK_FILE, 'utf8');
    const lines = content.split('\n').filter(line => line.trim());
    
    // Skip header line
    const dataLines = lines.slice(1);
    
    let positive = 0;
    let negative = 0;
    let withComments = 0;
    
    dataLines.forEach(line => {
      if (line.includes(',positive,')) positive++;
      if (line.includes(',negative,')) {
        negative++;
        // Check if comment exists (5th field)
        const fields = line.split(',');
        if (fields.length >= 5 && fields[4].trim()) {
          withComments++;
        }
      }
    });
    
    return {
      totalFeedback: dataLines.length,
      positive,
      negative,
      withComments,
      filePath: FEEDBACK_FILE
    };
    
  } catch (error) {
    console.error('Error reading feedback stats:', error);
    return null;
  }
}

module.exports = {
  logFeedback,
  getFeedbackFilePath,
  getFeedbackStats,
  initializeFeedbackFile
};
