# Aurora Feedback System Guide

## 📊 How Feedback Works

Aurora now collects user feedback through an intuitive thumbs up/down system with the following features:

### ✅ **Thumbs Up (Positive Feedback)**
- User clicks 👍 Yes button
- Feedback is immediately saved to CSV
- User sees confirmation message

### ⚠️ **Thumbs Down (Negative Feedback) - REQUIRED COMMENT**
- User clicks 👎 No button
- A comment modal pops up
- **User MUST provide a comment** explaining what was unhelpful
- Feedback is saved with the comment to CSV

### 🔖 **Bookmark Feature**
- Every answer includes a 🔖 Bookmark button
- Click to save responses for later reference
- Bookmarks are stored in browser localStorage
- Visual indicator shows bookmarked items (✅ Bookmarked)

### 🔗 **Share Feature**
- Every answer includes a 🔗 Share button
- On mobile: Uses native share sheet
- On desktop: Copies response to clipboard
- Allows users to easily share helpful information

## 📁 Feedback Data Location

### CSV File Path
```
/Users/ishitamajumdar/Desktop/Cursor project/Healthagent/feedback-data/user-feedback.csv
```

### CSV File Structure
```csv
Timestamp,Feedback_Type,Question,Answer,Comment,User_Agent,IP_Address
2026-03-05T12:30:00.000Z,positive,"What are early signs of autism?","Early signs include...","","Mozilla/5.0...","127.0.0.1"
2026-03-05T12:35:00.000Z,negative,"How do I get IEP?","IEP stands for...","Answer was too technical","Mozilla/5.0...","127.0.0.1"
```

### Fields Captured
1. **Timestamp**: When feedback was submitted (ISO 8601 format)
2. **Feedback_Type**: "positive" or "negative"
3. **Question**: The user's original question
4. **Answer**: Aurora's response that was rated
5. **Comment**: User's explanation (required for negative feedback, empty for positive)
6. **User_Agent**: Browser information
7. **IP_Address**: User's IP address

## 🔗 Access Feedback Dashboard

### View Statistics
Visit: **http://localhost:3002/feedback-admin.html**

The dashboard shows:
- Total feedback received
- Positive vs negative counts
- Number of detailed comments
- Direct download link for CSV

### Download CSV File
Two methods:

**Method 1: Dashboard Download**
1. Visit http://localhost:3002/feedback-admin.html
2. Click "📥 Download Feedback CSV" button

**Method 2: Direct API Download**
- URL: http://localhost:3002/api/feedback/download
- Downloads as: `aurora-feedback.csv`

**Method 3: Direct File Access**
```bash
open "/Users/ishitamajumdar/Desktop/Cursor project/Healthagent/feedback-data/user-feedback.csv"
```

## 📈 Analyzing Feedback

### Common Analysis Tasks

**1. Count total feedback entries:**
```bash
# Subtract 1 for header row
wc -l < feedback-data/user-feedback.csv
```

**2. Count positive vs negative:**
```bash
grep ",positive," feedback-data/user-feedback.csv | wc -l
grep ",negative," feedback-data/user-feedback.csv | wc -l
```

**3. View negative feedback with comments:**
```bash
grep ",negative," feedback-data/user-feedback.csv
```

**4. Import into Excel/Google Sheets:**
- Download the CSV file
- Open in Excel or upload to Google Sheets
- All fields are properly escaped for CSV compatibility

## 🛡️ Privacy & Security

### Data Protection
- Feedback CSV file is automatically excluded from Git (added to `.gitignore`)
- File contains user IP addresses and browser info for analytics
- **Do not** commit this file to public repositories
- Consider anonymizing data before sharing

### GDPR Compliance Considerations
If deploying in production, consider:
- User consent for feedback collection
- Data retention policies
- Right to deletion requests
- Anonymization of IP addresses

## 🔄 Feedback Workflow

### For Users:
```
Answer displayed → Rate helpful? → 
  ├─ 👍 Yes → Saved immediately → Confirmation
  └─ 👎 No → Comment modal opens → 
              User enters comment (REQUIRED) → 
              Submit → Saved with comment → Confirmation
```

### For Developers:
1. User provides feedback
2. Frontend validates (comment required for negative)
3. POST to `/api/feedback` with all data
4. Backend logs to CSV file
5. Backend processes for reinforcement learning
6. Response sent to user with confirmation

## 🚀 Testing Feedback System

### Test Positive Feedback
1. Ask Aurora a question
2. Click 👍 Yes
3. Check feedback-admin.html for updated stats
4. Download CSV to verify entry

### Test Negative Feedback
1. Ask Aurora a question
2. Click 👎 No
3. Try to cancel - modal closes, no feedback saved
4. Click 👎 No again
5. Try to submit without comment - see required warning
6. Enter comment and submit
7. Verify in CSV file

### Test Bookmark & Share
1. Ask Aurora a question
2. Click 🔖 Bookmark - should show "✅ Bookmarked"
3. Click again - should remove bookmark
4. Click 🔗 Share:
   - Mobile: Opens native share sheet
   - Desktop: Copies to clipboard

## 💡 Future Enhancements

- Export feedback with date ranges
- Sentiment analysis on comments
- Most common improvement requests
- Feedback trends over time
- Integration with analytics dashboard

---

**CSV Download Link**: http://localhost:3002/api/feedback/download  
**Feedback Dashboard**: http://localhost:3002/feedback-admin.html
