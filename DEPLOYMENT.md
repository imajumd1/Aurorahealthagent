# Aurora Deployment Guide 🚀

## 🤖 OpenAI Integration Required

Aurora now uses **hybrid intelligence** - combining built-in knowledge with OpenAI GPT-4 for enhanced responses.

### **🔑 Required: OpenAI API Key**

You **MUST** set your OpenAI API key in the deployment environment for Aurora to work properly.

### **🌐 Platform Support**

Aurora works on any Node.js hosting platform:
- **Railway** (recommended)
- **Heroku** 
- **Vercel**
- **DigitalOcean**
- **AWS**
- **Google Cloud**
- **Docker**

## 🔐 Required Environment Variables

```bash
# REQUIRED for Aurora to work
OPENAI_API_KEY=your_openai_api_key_here

# Optional configuration
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-domain.com
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

### **🚨 Important**: 
Without the `OPENAI_API_KEY`, Aurora will crash with:
```
OpenAIError: The OPENAI_API_KEY environment variable is missing or empty
```

## 🚀 Platform-Specific Setup

### **Railway (Recommended)**

1. **Connect your GitHub repository to Railway**
2. **Set environment variables in Railway dashboard:**
   - Go to your project → Variables tab
   - Add: `OPENAI_API_KEY` = `your_openai_api_key_here`
   - Add: `NODE_ENV` = `production`
3. **Deploy automatically** - Railway detects changes and redeploys

### **Heroku**

1. **Set environment variables via CLI:**
   ```bash
   heroku config:set OPENAI_API_KEY=your_openai_api_key_here
   heroku config:set NODE_ENV=production
   ```
2. **Deploy:** `git push heroku main`

### **Other Platforms**

For other platforms (Vercel, DigitalOcean, etc.), set the environment variables in their respective dashboards or configuration files.

## Deployment Steps

### **1. Set Environment Variables FIRST**
⚠️ **Critical**: Set your `OPENAI_API_KEY` in your deployment platform BEFORE deploying

### **2. Deploy Your Code**
Push your Aurora code to your chosen hosting platform

### **2. Test Your Deployment**
```bash
# Test the health endpoint
curl https://your-aurora-url.app/health

# Should return: {"status":"ok","service":"Aurora Autism Assistant"...}
```

### **3. Test Aurora's Functionality**
```bash
# Test autism question
curl -X POST https://your-aurora-url.app/api/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "What are early signs of autism?"}'
```

## Benefits of Hybrid Intelligence

✅ **Smart responses** - OpenAI for complex questions, knowledge base for simple ones  
✅ **Fast performance** - Knowledge base provides instant responses when possible  
✅ **Intelligent routing** - Automatically chooses the best response method  
✅ **Detailed guidance** - Can create 504 plans, find local resources, etc.  
✅ **Fallback protection** - Falls back to knowledge base if OpenAI fails  
✅ **Cost efficient** - Only uses OpenAI when needed for complex questions  

## 🔍 How to Fix Common Deployment Issues

### **OpenAI API Key Error**
```
OpenAIError: The OPENAI_API_KEY environment variable is missing or empty
```
**Solution**: Set the `OPENAI_API_KEY` environment variable in your deployment platform (see platform-specific instructions above).

### **Testing Your Deployment**
```bash
# Test Aurora is working
curl https://your-aurora-url.com/health

# Test simple question (uses knowledge base)
curl -X POST https://your-aurora-url.com/api/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "What is autism?"}'

# Test complex question (uses OpenAI)  
curl -X POST https://your-aurora-url.com/api/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "How do I create a 504 plan for my autistic child?"}'
```

Your intelligent Aurora autism assistant is ready to help families! 🧩✨🤖