# Getting Started with Aurora 🧩

## Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file in the root directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Start Aurora
```bash
npm run dev
```

### 4. Open in Browser
Visit: `http://localhost:3000`

## Test Aurora

Try these example questions:

### ✅ Autism-Related (Should get detailed responses)
- "What are early signs of autism in toddlers?"
- "How do I help with sensory overload?"
- "What accommodations help in school?"
- "wat r som comunication stratgies?" (testing typo handling)

### ❌ Off-Topic (Should politely redirect)
- "What's the weather like?"
- "How do I cook pasta?"
- "Tell me about dogs"

## API Testing

```bash
# Test the main endpoint
curl -X POST http://localhost:3000/api/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "What are sensory strategies for autism?"}'

# Check system health
curl http://localhost:3000/health
```

## Troubleshooting

### Common Issues

**"OpenAI API key not configured"**
- Make sure your `.env` file has `OPENAI_API_KEY=your_actual_key`

**"Port 3000 already in use"**
- Add `PORT=3001` to your `.env` file or kill the process using port 3000

**"Cannot find module"**
- Run `npm install` to install dependencies

**Frontend not loading**
- Check that the server started successfully
- Try refreshing the browser page

### Getting Help

**Check Server Logs**
The terminal will show Aurora's activity:
```
🧩 Aurora Autism Assistant running on port 3000
🔗 Health check: http://localhost:3000/health
🤖 Ready to help with autism-related questions!
```

**Test API Directly**
Use the `/api/status` endpoint to check system health:
```bash
curl http://localhost:3000/api/status
```

## What Should Happen

### 1. Successful Aurora Response
When you ask "What are early signs of autism?", you should see:
- Detailed, helpful response about autism signs
- 2-4 credible references (CDC, Autism Speaks, etc.)
- Response time under 3 seconds

### 2. Off-Topic Redirection
When you ask "What's the weather?", you should see:
- Polite message: "This is not my area of expertise..."
- Clear explanation of Aurora's autism focus
- No attempt to answer the off-topic question

### 3. Error Handling
When there are issues, you should see:
- User-friendly error messages
- Beta disclaimer acknowledging limitations
- Guidance to try again or seek professional help

## Ready to Go! 🚀

Aurora should now be running and ready to help with autism-related questions. The interface is clean, fast, and handles typos gracefully while maintaining strong boundaries around its autism expertise.

---

**Need help?** Check the main README.md for detailed documentation.