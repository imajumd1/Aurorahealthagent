# Autism Virtual Agent - UI Design

## Desktop Layout (Primary View)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                 │
│  ╔═══════════════════════════════════════════════════════════════════════════╗  │
│  ║                           🧩 Aurora                                      ║  │
│  ║              Your autism support assistant (Beta)                        ║  │
│  ╚═══════════════════════════════════════════════════════════════════════════╝  │
│                                                                                 │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                                                                         │   │
│  │  💬 Previous Conversation                                               │   │
│  │                                                                         │   │
│  │  Q: How can I help my child with sensory overload?                     │   │
│  │                                                                         │   │
│  │  A: Here are evidence-based strategies for sensory overload:           │   │
│  │     • Create a calm-down space with soft lighting                      │   │
│  │     • Use noise-canceling headphones in noisy environments            │   │
│  │     • Establish regular sensory breaks throughout the day              │   │
│  │                                                                         │   │
│  │  📚 References:                                                         │   │
│  │     • Autism Speaks Sensory Guide                                      │   │
│  │     • Occupational Therapy Journal (2023)                             │   │
│  │                                                                         │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                                                                         │   │
│  │  💭 Ask me anything about autism...                                    │   │
│  │  ┌───────────────────────────────────────────────────────────────────┐ │   │
│  │  │ How do I prepare my autistic teenager for college?               │ │   │
│  │  │                                                                   │ │   │
│  │  │                                                                   │ │   │
│  │  └───────────────────────────────────────────────────────────────────┘ │   │
│  │                                                  [  Ask  ]           │   │
│  │                                                                         │   │
│  │  💡 Suggested Topics:                                                  │   │
│  │  • Early Signs & Diagnosis    • School Support    • Daily Routines    │   │
│  │  • Communication Tips         • Sensory Issues    • Family Resources  │   │
│  │                                                                         │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ ℹ️  Disclaimer: I am still in Beta, I can make mistakes.               │   │
│  │   I provide general autism information only. Always consult healthcare │   │
│  │   professionals for medical advice.       🔒 Private & Secure         │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Mobile Layout (Responsive)

```
┌───────────────────────────────┐
│                               │
│  ╔═════════════════════════╗  │
│  ║       🧩 Aurora         ║  │
│  ║   Autism Assistant      ║  │
│  ║        (Beta)           ║  │
│  ╚═════════════════════════╝  │
│                               │
│  ┌─────────────────────────┐   │
│  │                         │   │
│  │ 💬 Chat History         │   │
│  │                         │   │
│  │ Q: Sensory tips?        │   │
│  │                         │   │
│  │ A: Try noise-canceling  │   │
│  │ headphones and create   │   │
│  │ calm spaces...          │   │
│  │                         │   │
│  │ 📚 Sources: Autism      │   │
│  │ Speaks, OT Journal      │   │
│  │                         │   │
│  └─────────────────────────┘   │
│                               │
│  ┌─────────────────────────┐   │
│  │ 💭 Your question...     │   │
│  │ ┌─────────────────────┐ │   │
│  │ │                     │ │   │
│  │ │                     │ │   │
│  │ └─────────────────────┘ │   │
│  │           [Ask]         │   │
│  └─────────────────────────┘   │
│                               │
│  ┌─────────────────────────┐   │
│  │ 💡 Quick Topics:        │   │
│  │ • Early Signs           │   │
│  │ • School Help           │   │
│  │ • Communication         │   │
│  │ • Sensory Support       │   │
│  └─────────────────────────┘   │
│                               │
│  ┌─────────────────────────┐   │
│  │ ℹ️  I'm in Beta - I can │   │
│  │   make mistakes.        │   │
│  │   General info only.    │   │
│  │   Consult professionals │   │
│  │   for medical advice    │   │
│  └─────────────────────────┘   │
│                               │
└───────────────────────────────┘
```

## Component Breakdown

### **1. Header Section**
```
╔═══════════════════════════════════════════════════════════════════════════╗
║                           🧩 Aurora                                      ║
║              Your autism support assistant (Beta)                        ║
╚═══════════════════════════════════════════════════════════════════════════╝
```
- **Purpose**: Clear branding with Aurora name and beta status
- **Elements**: Puzzle piece emoji (autism symbol), Aurora name, beta indicator
- **Style**: Clean border, centered text, professional blue theme

### **2. Conversation History**
```
┌─────────────────────────────────────────────────────────────────────────┐
│  💬 Previous Conversation                                               │
│                                                                         │
│  Q: How can I help my child with sensory overload?                     │
│                                                                         │
│  A: Here are evidence-based strategies for sensory overload:           │
│     • Create a calm-down space with soft lighting                      │
│     • Use noise-canceling headphones in noisy environments            │
│                                                                         │
│  📚 References: [Sources listed]                                        │
└─────────────────────────────────────────────────────────────────────────┘
```
- **Purpose**: Show conversation context and build trust through quality responses
- **Elements**: Chat bubble icon, Q&A format, clear source attribution
- **Features**: Scrollable, collapsible on mobile

### **3. Main Input Area (THE FOCUS)**
```
┌─────────────────────────────────────────────────────────────────────────┐
│  💭 Ask me anything about autism...                                    │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ How do I prepare my autistic teenager for college?               │ │
│  │                                                                   │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                  [  Ask  ]           │
└─────────────────────────────────────────────────────────────────────────┘
```
- **Purpose**: Primary interaction point - makes asking questions feel natural
- **Elements**: Thought bubble emoji, placeholder text, large text area, prominent button
- **Features**: Auto-resize, keyboard shortcuts (Enter to submit)

### **4. Suggested Topics**
```
💡 Suggested Topics:
• Early Signs & Diagnosis    • School Support    • Daily Routines
• Communication Tips         • Sensory Issues    • Family Resources
```
- **Purpose**: Help users discover what they can ask about
- **Elements**: Light bulb icon, clickable topic pills
- **Features**: Quick-start for common questions

### **5. Footer Disclaimer**
```
ℹ️  Disclaimer: I am still in Beta, I can make mistakes.
   I provide general autism information only. Always consult healthcare
   professionals for medical advice.       🔒 Private & Secure
```
- **Purpose**: Beta transparency, legal protection and trust building
- **Elements**: Info icon, beta warning, clear disclaimer, security badge
- **Features**: Always visible, non-intrusive, honest about limitations

## Color Scheme (CSS Implementation Guide)

```css
/* Primary Colors */
--primary-blue: #4A90E2      /* Trust, calm */
--accent-purple: #7B68EE     /* Autism awareness */
--success-green: #28A745     /* Positive actions */
--text-dark: #2C3E50        /* High contrast */
--text-light: #6C757D       /* Secondary text */
--background: #F8F9FA       /* Clean, accessible */
--border: #E9ECEF           /* Subtle separation */

/* Interactive Elements */
--button-primary: #4A90E2
--button-hover: #357ABD
--input-focus: #7B68EE
--link-color: #4A90E2
```

## Accessibility Features

### **Visual Accessibility**
- High contrast text (4.5:1 ratio minimum)
- Large, readable fonts (16px minimum)
- Clear visual hierarchy
- Colorblind-friendly palette

### **Keyboard Navigation**
```
Tab Order:
1. Main input field (auto-focus)
2. Ask button
3. Suggested topic buttons
4. Previous conversation links
5. Navigation elements
```

### **Screen Reader Support**
- Semantic HTML structure
- ARIA labels for all interactive elements
- Alt text for icons and images
- Clear heading hierarchy

## Interactive States

### **Input Field States**
```
Empty State:     💭 Ask me anything about autism...
Typing State:    💭 [User's question appears here]
Thinking State:  🤔 Thinking about your question...
Response State:  ✅ [Response appears in conversation area]
Error State:     ⚠️  Something went wrong. Please try again.
```

### **Button States**
```
Default:    [  Ask  ]
Hover:      [  Ask  ] (slightly darker)
Loading:    [ ... ]   (animated dots)
Success:    [ ✓ ]     (brief success state)
```

## Key Design Principles

### **1. Simplicity First**
- Clean, uncluttered interface
- Single primary action (asking questions)
- Minimal cognitive load

### **2. Trust Building**
- Professional appearance
- Clear source attribution
- Transparent about limitations

### **3. Accessibility Focus**
- Works for users with various needs
- Clear navigation and interaction
- High contrast and readable text

### **4. Mobile-First Responsive**
- Touch-friendly interface
- Readable on small screens
- Fast loading and interaction

### **5. Autism-Aware Design**
- Calm, non-overwhelming colors
- Predictable layout and navigation
- Clear, direct communication

## Implementation Notes

### **Framework Suggestions**
- **React.js**: Component-based, accessible
- **Tailwind CSS**: Utility-first, responsive
- **Framer Motion**: Smooth, subtle animations

### **Key Components**
```javascript
<Header />
<ConversationHistory />
<MainInput onSubmit={handleQuestion} />
<SuggestedTopics onTopicClick={handleTopic} />
<Footer />
```

### **Responsive Breakpoints**
```css
Mobile:     320px - 768px
Tablet:     768px - 1024px
Desktop:    1024px+
```

This design prioritizes the core user journey: **Ask Question → Get Expert Response → Build Trust** while maintaining a clean, professional, and accessible interface that serves the autism community effectively.