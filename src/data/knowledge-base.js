/**
 * Autism Knowledge Base
 * Curated information about autism topics with practical guidance
 */

class AutismKnowledgeBase {
  constructor() {
    this.topics = this.initializeKnowledgeBase();
  }

  /**
   * Find relevant topics based on user question and detected topics
   */
  findRelevantTopics(question, detectedTopics = []) {
    const relevantTopics = {};
    const searchTerms = this.extractSearchTerms(question);
    
    // Search by detected topics first
    detectedTopics.forEach(topic => {
      if (this.topics[topic]) {
        relevantTopics[topic] = this.topics[topic];
      }
    });

    // Search by keywords if no detected topics
    if (Object.keys(relevantTopics).length === 0) {
      Object.keys(this.topics).forEach(topicKey => {
        const topic = this.topics[topicKey];
        if (this.isTopicRelevant(topic, searchTerms)) {
          relevantTopics[topicKey] = topic;
        }
      });
    }

    return relevantTopics;
  }

  /**
   * Extract search terms from user question (handles typos)
   */
  extractSearchTerms(question) {
    const commonTerms = [
      'school', 'education', 'iep', '504', 'teacher', 'classroom',
      'sensory', 'sound', 'noise', 'touch', 'texture', 'light',
      'communication', 'speech', 'language', 'nonverbal', 'talking',
      'behavior', 'meltdown', 'tantrum', 'stimming', 'routine',
      'social', 'friends', 'interaction', 'play', 'conversation',
      'therapy', 'treatment', 'intervention', 'aba', 'occupational',
      'diagnosis', 'assessment', 'evaluation', 'early', 'signs',
      'family', 'parent', 'sibling', 'support', 'help',
      'adult', 'employment', 'job', 'work', 'independence',
      'insurance', 'funding', 'medicaid', 'government', 'financial'
    ];

    return commonTerms.filter(term => 
      question.toLowerCase().includes(term) ||
      this.fuzzyMatch(question.toLowerCase(), term)
    );
  }

  /**
   * Simple fuzzy matching for typos
   */
  fuzzyMatch(text, term) {
    // Simple Levenshtein distance check for common typos
    const threshold = 2;
    const words = text.split(' ');
    
    return words.some(word => {
      if (Math.abs(word.length - term.length) > threshold) return false;
      
      let distance = 0;
      for (let i = 0; i < Math.max(word.length, term.length); i++) {
        if (word[i] !== term[i]) distance++;
        if (distance > threshold) return false;
      }
      return distance <= threshold;
    });
  }

  /**
   * Check if topic is relevant to search terms
   */
  isTopicRelevant(topic, searchTerms) {
    const allText = [
      topic.summary,
      ...topic.strategies,
      ...topic.keywords
    ].join(' ').toLowerCase();

    return searchTerms.some(term => allText.includes(term));
  }

  /**
   * Initialize the curated autism knowledge base
   */
  initializeKnowledgeBase() {
    return {
      sensory_processing: {
        summary: "Many individuals with autism experience differences in processing sensory information, which can affect their daily functioning and comfort.",
        strategies: [
          "Create sensory-friendly environments with adjustable lighting and sound",
          "Use noise-canceling headphones in overwhelming environments",
          "Provide fidget toys or sensory tools for self-regulation",
          "Establish sensory breaks throughout the day",
          "Use weighted blankets or compression clothing for comfort",
          "Gradually expose to new sensory experiences at a comfortable pace"
        ],
        keywords: ["sensory", "sound", "noise", "touch", "texture", "light", "smell", "overstimulation"],
        references: ["autism_speaks_sensory", "sensory_processing_disorder_foundation"]
      },

      communication: {
        summary: "Communication differences in autism can range from nonverbal to hyperlexic, with many individuals benefiting from alternative communication methods.",
        strategies: [
          "Use visual supports like picture cards or communication boards",
          "Practice turn-taking in conversations",
          "Allow extra processing time for responses",
          "Use clear, concrete language rather than abstract concepts",
          "Implement AAC (Augmentative and Alternative Communication) devices",
          "Focus on functional communication goals"
        ],
        keywords: ["communication", "speech", "language", "nonverbal", "talking", "aac", "pictures"],
        references: ["speech_pathology_autism", "aac_research_institute"]
      },

      education_support: {
        summary: "Educational support for students with autism includes individualized planning, accommodations, and evidence-based teaching strategies.",
        strategies: [
          "Develop comprehensive IEP or 504 plans with specific goals",
          "Use visual schedules and structure in the classroom",
          "Provide quiet spaces for breaks and self-regulation",
          "Implement social skills instruction and peer support",
          "Use assistive technology when appropriate",
          "Collaborate with autism specialists and related service providers"
        ],
        keywords: ["school", "education", "iep", "504", "teacher", "classroom", "learning", "academics"],
        references: ["idea_autism_guidelines", "national_autism_center_education"]
      },

      behavioral_support: {
        summary: "Behavioral approaches for autism focus on understanding the function of behaviors and teaching appropriate alternatives.",
        strategies: [
          "Identify triggers and functions of challenging behaviors",
          "Use positive behavior interventions and supports (PBIS)",
          "Teach coping skills and emotional regulation strategies",
          "Create predictable routines and clear expectations",
          "Use visual cues and social stories for behavior guidance",
          "Implement reinforcement systems for desired behaviors"
        ],
        keywords: ["behavior", "meltdown", "tantrum", "stimming", "routine", "challenging", "aggression"],
        references: ["applied_behavior_analysis", "positive_behavior_support"]
      },

      social_skills: {
        summary: "Social skills development for individuals with autism involves explicit teaching of social conventions and interaction patterns.",
        strategies: [
          "Use social stories to explain social situations",
          "Practice social interactions in structured settings",
          "Teach perspective-taking and emotion recognition",
          "Facilitate peer interactions and friendships",
          "Use video modeling for social skill demonstration",
          "Create social skills groups with similar-aged peers"
        ],
        keywords: ["social", "friends", "interaction", "play", "conversation", "peers", "relationships"],
        references: ["social_thinking_methodology", "peer_mediated_interventions"]
      },

      early_intervention: {
        summary: "Early intervention services for young children with autism focus on developmental skills and family support.",
        strategies: [
          "Begin intervention as early as possible (before age 3 preferred)",
          "Use naturalistic teaching strategies in daily routines",
          "Focus on communication and social engagement",
          "Provide parent training and family support",
          "Implement play-based learning approaches",
          "Coordinate services across multiple disciplines"
        ],
        keywords: ["early", "intervention", "toddler", "baby", "development", "milestones", "signs"],
        references: ["early_intervention_autism", "zero_to_three_autism"]
      },

      adult_support: {
        summary: "Adults with autism benefit from support in employment, independent living, and community participation.",
        strategies: [
          "Develop employment skills and job coaching support",
          "Teach independent living skills and self-advocacy",
          "Provide social opportunities and community connections",
          "Support post-secondary education and training",
          "Address mental health and wellness needs",
          "Facilitate transition planning from school to adult services"
        ],
        keywords: ["adult", "employment", "job", "work", "independence", "college", "transition"],
        references: ["autism_employment_network", "adult_autism_services"]
      },

      family_support: {
        summary: "Family support is crucial for autism care, including education, respite, and emotional support for all family members.",
        strategies: [
          "Connect families with local autism support groups",
          "Provide respite care and family break opportunities",
          "Offer sibling support programs and resources",
          "Share information about autism and evidence-based practices",
          "Support family advocacy and self-determination",
          "Address family stress and mental health needs"
        ],
        keywords: ["family", "parent", "sibling", "support", "help", "stress", "respite"],
        references: ["family_support_autism", "sibling_support_project"]
      },

      funding_resources: {
        summary: "Various funding sources exist to support autism services, including government programs, insurance coverage, and grants.",
        strategies: [
          "Explore Medicaid waiver programs for autism services",
          "Understand insurance coverage for autism treatments",
          "Research state-specific autism funding programs",
          "Apply for grants and scholarships for autism support",
          "Utilize federal programs like Social Security benefits",
          "Connect with local autism organizations for funding assistance"
        ],
        keywords: ["insurance", "funding", "medicaid", "government", "financial", "grants", "money"],
        references: ["autism_insurance_advocacy", "medicaid_autism_services"]
      }
    };
  }
}

module.exports = { AutismKnowledgeBase };