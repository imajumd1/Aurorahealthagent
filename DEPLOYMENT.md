# Aurora Deployment Guide 🚀

## Quick Fix for "OPENAI_API_KEY missing" Error

### **🚄 Railway Deployment (Most Common)**

1. **Go to your Railway dashboard**: https://railway.app/dashboard
2. **Find your Aurora project** 
3. **Click "Variables" tab**
4. **Add this environment variable:**
   ```
   OPENAI_API_KEY = [paste your actual OpenAI API key here]
   ```
5. **Save and redeploy** - Aurora will restart automatically

### **🌐 Other Platforms**

**Heroku:**
```bash
heroku config:set OPENAI_API_KEY=your_actual_key_here
```

**Vercel:**
- Dashboard → Project → Settings → Environment Variables

**Docker:**
```bash
docker run -e OPENAI_API_KEY=your_key_here aurora-app
```

## Required Environment Variables

```bash
# Essential (copy these to your deployment platform)
OPENAI_API_KEY=your_openai_api_key_starting_with_sk
OPENAI_MODEL=gpt-4
NODE_ENV=production
PORT=3000

# Optional
FRONTEND_URL=https://your-domain.com
RATE_LIMIT_MAX_REQUESTS=100
```

## Troubleshooting

### **Local Environment Works, Production Doesn't?**

✅ **The `.env` file is only for local development** - it's not pushed to git for security.

✅ **Production needs environment variables set in the platform dashboard.**

### **Where to Get Your API Key**

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key (starts with `sk-proj-` or `sk-`)
4. Add it to your deployment platform

### **Test Your Deployment**

Once you've added the environment variable:

```bash
# Test the health endpoint
curl https://your-aurora-url.railway.app/health

# Should return: {"status":"ok","service":"Aurora Autism Assistant"...}
```

## Security Notes

🔒 **Never commit real API keys to git**
🔒 **Each platform has its own way to set environment variables**
🔒 **Aurora will show clear error messages if keys are missing**

Your Aurora autism assistant will be live once the API key is configured! 🧩✨