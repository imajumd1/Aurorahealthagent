# Railway Deployment Guide for Aurora 🚀

## Quick Fix for Railway Deployment

Your Railway app at https://aurorahealthagent-production.up.railway.app/ should work after these steps:

### 1. Set Environment Variables in Railway Dashboard

1. Go to your Railway project dashboard
2. Click on your service
3. Go to the "Variables" tab
4. Add these environment variables:

```
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=production
```

### 2. Redeploy the Application

After setting the environment variables, Railway should automatically redeploy. If not:
1. Go to the "Deployments" tab
2. Click "Redeploy" on the latest deployment

### 3. Test Your Deployment

```bash
# Test health endpoint
curl https://aurorahealthagent-production.up.railway.app/health

# Test Aurora functionality
curl -X POST https://aurorahealthagent-production.up.railway.app/api/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "What are early signs of autism?"}'
```

## What Was Fixed

✅ **Port Configuration**: Removed hardcoded port from package.json  
✅ **Railway Config**: Added railway.json for proper deployment settings  
✅ **CORS Setup**: Updated to work with Railway domains  
✅ **Environment Validation**: Added helpful warnings for missing API keys  
✅ **Health Check**: Configured proper health check endpoint  

## Troubleshooting

### If the app still doesn't work:

1. **Check Railway Logs**:
   - Go to your Railway project
   - Click on "Deployments"
   - Click on the latest deployment
   - Check the "Logs" tab for errors

2. **Common Issues**:
   - Missing `OPENAI_API_KEY` environment variable
   - Port conflicts (should be automatic now)
   - CORS issues (should be fixed)

3. **Force Redeploy**:
   - Make a small change to any file
   - Commit and push to trigger a new deployment

## Expected Behavior

Once deployed correctly, you should see:
- Health endpoint returns: `{"status":"ok","service":"Aurora Autism Assistant"...}`
- Web interface loads at your Railway URL
- API endpoints respond properly
- Feedback system works with reinforcement learning

Your Aurora Health Agent should now be fully functional on Railway! 🧩✨
