# Aurora Codebase Documentation 🧩
*For New Engineers - Understanding Aurora Through Real-World Metaphors*

## 🏥 The Big Picture: Aurora as a Specialized Medical Center

Think of Aurora like a **specialized autism support center** where people come with questions and receive expert help. Here's how our "digital medical center" works:

```
🚪 Front Door    🧠 Specialist    📚 Medical Library    💬 Response
   (Frontend) ──→ (Aurora Core) ──→ (Knowledge Base) ──→ (Back to User)
```

### The Main Characters in Our Story

1. **🚪 The Receptionist** (Frontend - `public/index.html`)
   - Greets visitors with a friendly interface
   - Takes their questions and makes them comfortable
   - Handles the paperwork (forms, buttons, display)

2. **🛡️ The Security Guard** (Gatekeeper - Part of `aurora-core.js`)
   - Decides if the question is about autism or something else
   - Like a bouncer at a club - only autism questions get through!

3. **🧠 The Autism Specialist** (Expert - Part of `aurora-core.js`)
   - The main doctor who provides expert advice
   - Uses medical knowledge to give detailed answers

4. **📚 The Medical Librarian** (Scholar - Part of `aurora-core.js`)
   - Finds the right research papers and sources
   - Makes sure every answer has credible references

5. **🏢 The Building Manager** (Server - `server.js`)
   - Keeps the whole facility running
   - Manages security, schedules, and operations

---

## 🗂️ File Organization: Like Departments in a Hospital

```
aurora-autism-agent/           🏥 The Hospital Building
├── server.js                  🏢 Hospital Administrator Office
├── package.json              📋 Employee Directory & Supplies List
├── public/                    🚪 Reception & Waiting Area
│   └── index.html            🪑 Reception Desk Interface
└── src/                       🏥 Medical Departments
    ├── intelligence/          🧠 Specialist Doctor's Office  
    │   └── aurora-core.js     👩‍⚕️ The Autism Specialist
    ├── data/                  📚 Medical Library
    │   ├── knowledge-base.js  📖 Autism Medical Textbooks
    │   └── references.js      🔗 Research Paper Catalog
    ├── middleware/            🛡️ Security & Safety Protocols
    │   └── index.js          👮‍♂️ Security Guards & Safety Rules
    └── routes/                🗺️ Hospital Hallways & Directions
        └── index.js          🚏 Directional Signs & Pathways
```

---

## 🔄 The Patient Journey: How a Question Becomes an Answer

Let's follow a question through Aurora like following a patient through a hospital visit:

### Step 1: 🚪 Arrival at Reception (Frontend)
```javascript
// In public/index.html
// Like a patient filling out a form at reception
const question = "How do I help my child with autism?"
```

**Real-world metaphor**: A parent walks into our autism center's reception area, approaches the friendly receptionist, and says their question. The receptionist writes it down on a form and gets ready to help.

### Step 2: 🗂️ Routing to the Right Department (Express Routes)
```javascript
// In src/routes/index.js
app.post('/api/ask', async (req, res) => {
  // Like directing the patient to the autism specialist
  const response = await aurora.processQuestion(question);
});
```

**Real-world metaphor**: The receptionist looks at the form and says, "Oh, you have an autism question! Let me take you to Dr. Aurora, our autism specialist, in Room 3."

### Step 3: 🛡️ Security Check (The Gatekeeper)
```javascript
// In src/intelligence/aurora-core.js
const classification = await this.classifyIntent(cleanedQuestion);
if (!classification.isAutismRelated) {
  return this.createOffTopicResponse(classification);
}
```

**Real-world metaphor**: Before entering the specialist's office, there's a security guard who checks if you're in the right place. If you ask about cooking recipes, they politely say, "I'm sorry, this is the autism center. For cooking questions, you need the culinary school down the street."

### Step 4: 🧠 Consultation with the Specialist (The Expert)
```javascript
// The specialist uses their medical knowledge
const response = await this.generateExpertResponse(question, classification);
```

**Real-world metaphor**: Dr. Aurora (our autism specialist) sits down with you, listens carefully to your question, thinks about all their medical training and experience with autism, and gives you detailed, helpful advice.

### Step 5: 📚 Research Support (The Scholar)
```javascript
// The librarian finds supporting research
const references = await this.findRelevantReferences(question, response);
```

**Real-world metaphor**: While Dr. Aurora is explaining things, the medical librarian quickly finds the most recent research papers and studies that support the advice, then hands them to you as references.

### Step 6: 📝 Documented Response (Back to Frontend)
```javascript
// The complete medical report goes back to reception
return {
  answer: response,
  references: references,
  isAutismRelated: true,
  confidence: classification.confidence
};
```

**Real-world metaphor**: You receive a comprehensive report with the doctor's advice, research references, and a note about the doctor's confidence in the diagnosis - all nicely formatted by the reception staff.

---

## 🧠 Deep Dive: The Three-Layer Intelligence System

Think of Aurora's brain like a **medical consultation team**:

### 🛡️ Layer 1: The Gatekeeper (Security Guard)
**File**: `src/intelligence/aurora-core.js` - `classifyIntent()` method

```javascript
async classifyIntent(question) {
  // Like a security guard checking if you belong here
  const prompt = `You are an autism specialist. Is this question about autism?`;
  // Returns: { isAutismRelated: true/false, confidence: 0.8 }
}
```

**Real-world metaphor**: 
> Imagine a security guard at a specialized autism clinic. Their job is simple but crucial: "Is this person asking about autism, or did they get lost looking for the dentist?" They're really good at this - they can tell even if someone says "My kid has troubles with sounds" (autism-related) vs. "My kid has a toothache" (wrong department).

**Why we need this**: Without the gatekeeper, people might ask about cooking or sports, and Aurora might try to answer, which would be confusing and unhelpful.

### 🧠 Layer 2: The Expert (Autism Specialist Doctor)
**File**: `src/intelligence/aurora-core.js` - `generateExpertResponse()` method

```javascript
async generateExpertResponse(question, classification) {
  // Like a doctor consulting their knowledge and experience
  const relevantKnowledge = this.knowledgeBase.findRelevantTopics(question);
  const prompt = `You are Aurora, an autism specialist. Help with: ${question}`;
  // Returns detailed, compassionate advice
}
```

**Real-world metaphor**: 
> Think of your favorite doctor who specializes in autism. They've studied for years, worked with hundreds of families, and have a warm, caring bedside manner. When you ask a question, they don't just give a quick answer - they think about your specific situation, remember relevant cases they've seen, and give you thorough, evidence-based advice that actually helps.

**Why we need this**: The expert has deep knowledge about autism and knows how to explain complex topics in a caring, understandable way.

### 📚 Layer 3: The Scholar (Medical Librarian)
**File**: `src/intelligence/aurora-core.js` - `findRelevantReferences()` method

```javascript
async findRelevantReferences(question, response) {
  // Like a librarian finding the best research papers
  return this.references.findRelevantSources(question, response);
}
```

**Real-world metaphor**: 
> Picture a super-efficient medical librarian who knows every autism research paper by heart. While the doctor is explaining things to you, the librarian is already pulling the most credible, recent studies that back up what the doctor is saying. They hand you a neat stack of references from places like the CDC, major universities, and respected autism organizations.

**Why we need this**: Trust is crucial in healthcare. People need to know that the advice isn't just opinions, but backed by real research and credible sources.

---

## 📚 The Knowledge Management System

### 🗄️ The Knowledge Base: Like a Medical Textbook Library
**File**: `src/data/knowledge-base.js`

```javascript
const topics = {
  sensory_processing: {
    summary: "How autism affects the senses...",
    strategies: ["noise-canceling headphones", "fidget toys"],
    keywords: ["sensory", "sound", "touch"]
  }
}
```

**Real-world metaphor**: 
> Imagine a well-organized medical library with different sections for each autism topic. Each section has:
> - A clear summary (like a textbook chapter overview)
> - Practical strategies (like treatment protocols)
> - Keywords (like an index to help find information quickly)

**How it works**:
1. When someone asks about "loud noises bothering my child"
2. The system finds keywords: ["sensory", "sound"]
3. It goes to the "sensory_processing" section
4. It pulls out relevant strategies and information

### 📖 The Reference System: Like a Research Paper Database
**File**: `src/data/references.js`

```javascript
const references = {
  cdc_autism: {
    title: "Autism Spectrum Disorder Information",
    organization: "Centers for Disease Control",
    credibility: "highest",
    keywords: ["diagnosis", "prevalence"]
  }
}
```

**Real-world metaphor**: 
> Think of a digital card catalog in a medical library. Each card has:
> - The paper's title and who wrote it
> - How trustworthy it is (government source = highest credibility)
> - What topics it covers
> - Where to find it online

When Aurora gives advice, it's like the librarian quickly flipping through these cards to find the 3-4 most relevant and trustworthy sources.

---

## 🛡️ Safety Protocols: Error Handling & Middleware

### 🚨 Hospital Safety Protocols
**File**: `src/middleware/index.js`

```javascript
const errorHandler = (err, req, res, next) => {
  // Like hospital emergency procedures
  console.error('🔴 Aurora Error:', err);
  res.status(500).json({
    message: "I'm experiencing technical difficulties...",
    betaNotice: "I am still in Beta, I can make mistakes."
  });
};
```

**Real-world metaphor**: 
> Every hospital has safety protocols for when things go wrong:
> - **Fire alarms**: If there's a system error, sound the alarm (log it)
> - **Emergency procedures**: Give patients clear, calm instructions
> - **Honest communication**: "We're having a technical issue, please wait"
> - **Safety notices**: "This is a teaching hospital, mistakes can happen"

### 🔍 Input Validation: Like Medical Intake Forms
```javascript
const validateQuestion = (req, res, next) => {
  if (!question || question.length === 0) {
    return next(new Error('Question is required'));
  }
  // Clean and prepare the question
  req.body.question = question.trim();
};
```

**Real-world metaphor**: 
> Before seeing the doctor, reception checks your forms:
> - "Did you fill out your name?" (question exists?)
> - "Is your handwriting readable?" (format check)
> - "Let me clean up these coffee stains" (normalize input)

---

## 🌐 The Communication System: APIs as Hospital Intercoms

### 📞 Different Types of Communication Channels
**File**: `src/routes/index.js`

```javascript
// Main consultation line
app.post('/api/ask', /* Handle patient questions */);

// Information desk
app.get('/api/topics', /* Provide helpful topics */);

// Hospital status board
app.get('/api/status', /* System health check */);
```

**Real-world metaphor**: 
> A hospital has different communication systems:
> - **🚨 Emergency line** (`/api/ask`): "I need help with autism question NOW"
> - **ℹ️ Information desk** (`/api/topics`): "What kinds of things can you help with?"
> - **📊 Status board** (`/api/status`): "Is the autism department open and running?"

### 🔄 The Request-Response Cycle: Like a Medical Appointment

1. **Scheduling** (HTTP Request): Patient calls to book appointment
2. **Check-in** (Middleware): Verify insurance, fill out forms
3. **Consultation** (Aurora Processing): Meet with doctor
4. **Documentation** (Response): Receive treatment plan and follow-up info

---

## 🏗️ How to Make Changes Safely: Like Hospital Renovations

### 🧪 Adding New Knowledge (Like Adding Medical Books)
**To add new autism information**:

1. **Find the right shelf** (`src/data/knowledge-base.js`)
2. **Add your new book** (new topic object)
3. **Update the catalog** (keywords and references)

```javascript
// Add a new topic like adding a medical textbook
new_topic: {
  summary: "Clear explanation of the topic",
  strategies: ["practical advice", "actionable steps"],
  keywords: ["search", "terms", "related", "words"],
  references: ["credible_source_1", "research_paper_2"]
}
```

### 🔧 Modifying Aurora's Responses (Like Training Staff)
**To change how Aurora responds**:

1. **Training materials** (`src/intelligence/aurora-core.js`)
2. **Update the prompts** (how we instruct Aurora)
3. **Test with sample questions** (quality assurance)

### 🎨 Changing the Interface (Like Redecorating Reception)
**To modify the frontend**:

1. **Reception area** (`public/index.html`)
2. **Change colors, layout, or text**
3. **Test that everything still works**

---

## 🔍 Debugging: Like Medical Diagnostics

### 🩺 When Things Go Wrong: Diagnostic Steps

1. **Check the vital signs** (Is the server running?)
   ```bash
   curl http://localhost:3000/health
   ```

2. **Review the patient history** (Check the logs)
   ```
   🔵 POST /api/ask - User asked a question
   🟢 Response sent in 1500ms
   ```

3. **Test each system** (Try each API endpoint)
   ```bash
   # Test the main function
   curl -X POST http://localhost:3000/api/ask \
     -d '{"question": "test question"}'
   ```

### 🚨 Common Problems and Solutions

| Symptom | Diagnosis | Treatment |
|---------|-----------|-----------|
| "Cannot connect" | Server not running | Run `npm run dev` |
| "OpenAI Error" | Missing API key | Check `.env` file |
| "Slow responses" | Heavy load | Check system resources |
| "Wrong answers" | Knowledge base issue | Review and update content |

---

## 🎯 Quick Reference: Common Tasks

### 🆕 I'm New Here - Where Do I Start?
1. **Read this document** (you're doing great!)
2. **Run the system locally** (follow GETTING_STARTED.md)
3. **Try asking questions** (see how it responds)
4. **Look at the logs** (watch what happens behind the scenes)
5. **Make a small change** (try changing some text in the frontend)

### 🐛 I Found a Bug - What Do I Do?
1. **Document the problem** (what did you expect vs. what happened?)
2. **Check the logs** (what errors appeared?)
3. **Try to reproduce it** (does it happen every time?)
4. **Look at the relevant code** (which component might be responsible?)
5. **Ask for help** (share your findings with the team)

### ✨ I Want to Add a Feature - How Do I Start?
1. **Understand the current flow** (trace through the code)
2. **Identify where to make changes** (which files need updates?)
3. **Start small** (make the minimal change first)
4. **Test thoroughly** (make sure you didn't break anything)
5. **Document your changes** (help the next person understand)

---

## 🤝 Working with the Team

### 📚 Key Concepts to Discuss with Teammates

- **"Gatekeeper, Expert, Scholar"** - Everyone knows these three roles
- **"Autism-focused"** - We stay strictly within our expertise
- **"Beta transparency"** - We're honest about limitations
- **"Evidence-based"** - Every answer needs credible sources

### 🗣️ Common Terminology

| Term | What It Means | Real-World Analogy |
|------|---------------|-------------------|
| "Intent classification" | Figuring out if question is autism-related | Security guard checking if you're in the right building |
| "Knowledge retrieval" | Finding relevant information | Librarian pulling the right books |
| "Response generation" | Creating the final answer | Doctor writing up treatment plan |
| "Reference attribution" | Adding source citations | Providing research paper bibliography |

---

## 🎉 Congratulations!

You now understand Aurora like a medical professional understands their hospital! You know:

- **🏥 The building layout** (file structure)
- **👥 Who does what** (component responsibilities)
- **🔄 How patients flow through** (data flow)
- **🛡️ Safety protocols** (error handling)
- **🔧 How to make improvements** (development workflow)

Remember: Aurora is like a specialized medical center staffed by caring professionals who are experts in autism support. Every piece of code serves the mission of helping people in the autism community get accurate, compassionate, evidence-based guidance.

**Welcome to the team! 🧩**

---

*💡 Pro tip: Keep this document handy as you explore the code. When you see a function name like `classifyIntent()`, you can think "Ah, that's the security guard checking if the question belongs here!" It makes the code much easier to understand.*