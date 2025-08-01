/**
 * Reference System for Aurora
 * Manages credible sources and citations for autism information
 */

class ReferenceSystem {
  constructor() {
    this.references = this.initializeReferences();
  }

  /**
   * Find relevant sources based on question and response content
   */
  findRelevantSources(question, response, maxSources = 4) {
    const keywords = this.extractKeywords(question + ' ' + response);
    const relevantSources = [];

    // Score references based on keyword relevance
    Object.keys(this.references).forEach(refId => {
      const ref = this.references[refId];
      const score = this.calculateRelevanceScore(ref, keywords);
      
      if (score > 0) {
        relevantSources.push({
          ...ref,
          relevanceScore: score
        });
      }
    });

    // Sort by relevance score and credibility, return top sources
    return relevantSources
      .sort((a, b) => {
        // Primary sort: relevance score
        if (b.relevanceScore !== a.relevanceScore) {
          return b.relevanceScore - a.relevanceScore;
        }
        // Secondary sort: credibility level
        return this.getCredibilityScore(b.credibility) - this.getCredibilityScore(a.credibility);
      })
      .slice(0, maxSources)
      .map(source => ({
        title: source.title,
        organization: source.organization,
        url: source.url,
        type: source.type,
        credibility: source.credibility
      }));
  }

  /**
   * Get default references for general autism information
   */
  getDefaultReferences() {
    return [
      this.references.autism_speaks_main,
      this.references.cdc_autism,
      this.references.national_autism_center,
      this.references.autistic_self_advocacy
    ].map(ref => ({
      title: ref.title,
      organization: ref.organization,
      url: ref.url,
      type: ref.type,
      credibility: ref.credibility
    }));
  }

  /**
   * Get emergency/crisis references
   */
  getEmergencyReferences() {
    return [
      this.references.crisis_text_line,
      this.references.suicide_prevention,
      this.references.autism_speaks_crisis
    ].map(ref => ({
      title: ref.title,
      organization: ref.organization,
      url: ref.url,
      type: ref.type,
      credibility: ref.credibility
    }));
  }

  /**
   * Extract keywords from text for relevance matching
   */
  extractKeywords(text) {
    const keywords = [
      'sensory', 'communication', 'behavior', 'education', 'school', 'iep',
      'therapy', 'treatment', 'intervention', 'aba', 'speech', 'occupational',
      'social', 'skills', 'diagnosis', 'assessment', 'early', 'adult',
      'employment', 'family', 'support', 'insurance', 'funding', 'legal',
      'rights', 'advocacy', 'community', 'research', 'evidence'
    ];

    return keywords.filter(keyword => 
      text.toLowerCase().includes(keyword)
    );
  }

  /**
   * Calculate relevance score for a reference
   */
  calculateRelevanceScore(reference, keywords) {
    let score = 0;
    const refText = (reference.title + ' ' + reference.description + ' ' + 
                   reference.keywords.join(' ')).toLowerCase();

    keywords.forEach(keyword => {
      if (refText.includes(keyword)) {
        score += 1;
      }
    });

    // Boost score for high credibility sources
    score *= this.getCredibilityScore(reference.credibility);
    
    return score;
  }

  /**
   * Get numerical credibility score
   */
  getCredibilityScore(credibility) {
    const scores = {
      'highest': 3.0,
      'high': 2.5,
      'moderate': 2.0,
      'basic': 1.5
    };
    return scores[credibility] || 1.0;
  }

  /**
   * Initialize comprehensive reference database
   */
  initializeReferences() {
    return {
      // Government and Medical Organizations
      cdc_autism: {
        title: "Autism Spectrum Disorder Information",
        organization: "Centers for Disease Control and Prevention",
        url: "https://www.cdc.gov/autism/",
        type: "government",
        credibility: "highest",
        description: "Official CDC information on autism spectrum disorder",
        keywords: ["diagnosis", "prevalence", "research", "early", "signs"]
      },

      nih_autism: {
        title: "Autism Research and Information",
        organization: "National Institute of Mental Health",
        url: "https://www.nimh.nih.gov/health/topics/autism-spectrum-disorders",
        type: "government",
        credibility: "highest",
        description: "NIH research and clinical information on autism",
        keywords: ["research", "treatment", "diagnosis", "clinical"]
      },

      // Major Autism Organizations
      autism_speaks_main: {
        title: "Autism Speaks Resource Library",
        organization: "Autism Speaks",
        url: "https://www.autismspeaks.org/",
        type: "nonprofit",
        credibility: "high",
        description: "Comprehensive autism resources and advocacy",
        keywords: ["advocacy", "family", "support", "resources", "awareness"]
      },

      autism_speaks_sensory: {
        title: "Sensory Issues and Autism",
        organization: "Autism Speaks",
        url: "https://www.autismspeaks.org/sensory-issues",
        type: "nonprofit",
        credibility: "high",
        description: "Guide to sensory processing in autism",
        keywords: ["sensory", "processing", "overstimulation", "environment"]
      },

      national_autism_center: {
        title: "Evidence-Based Practice Guidelines",
        organization: "National Autism Center",
        url: "https://www.nationalautismcenter.org/",
        type: "nonprofit",
        credibility: "highest",
        description: "Research-based autism intervention guidelines",
        keywords: ["evidence", "treatment", "intervention", "research", "guidelines"]
      },

      autistic_self_advocacy: {
        title: "Autistic Self Advocacy Network",
        organization: "ASAN",
        url: "https://autisticadvocacy.org/",
        type: "advocacy",
        credibility: "high",
        description: "Self-advocacy and rights information by autistic people",
        keywords: ["self-advocacy", "rights", "community", "autistic", "perspective"]
      },

      // Educational Resources
      idea_autism_guidelines: {
        title: "IDEA and Autism Educational Services",
        organization: "U.S. Department of Education",
        url: "https://sites.ed.gov/idea/",
        type: "government",
        credibility: "highest",
        description: "Special education law and autism services",
        keywords: ["education", "iep", "504", "school", "legal", "rights"]
      },

      center_autism_education: {
        title: "Center for Autism and Related Disabilities",
        organization: "University of Florida",
        url: "https://card.ufl.edu/",
        type: "academic",
        credibility: "high",
        description: "Educational support and training resources",
        keywords: ["education", "training", "support", "academic", "school"]
      },

      // Therapy and Intervention
      applied_behavior_analysis: {
        title: "ABA Evidence Base",
        organization: "Behavior Analyst Certification Board",
        url: "https://www.bacb.com/",
        type: "professional",
        credibility: "high",
        description: "Applied behavior analysis certification and standards",
        keywords: ["aba", "behavior", "therapy", "intervention", "evidence"]
      },

      speech_pathology_autism: {
        title: "Autism and Communication",
        organization: "American Speech-Language-Hearing Association",
        url: "https://www.asha.org/practice-portal/clinical-topics/autism/",
        type: "professional",
        credibility: "highest",
        description: "Speech-language pathology practice guidelines for autism",
        keywords: ["communication", "speech", "language", "therapy", "aac"]
      },

      occupational_therapy_autism: {
        title: "Occupational Therapy and Autism",
        organization: "American Occupational Therapy Association",
        url: "https://www.aota.org/",
        type: "professional",
        credibility: "high",
        description: "Occupational therapy interventions for autism",
        keywords: ["occupational", "therapy", "sensory", "daily", "living", "skills"]
      },

      // Adult Services
      autism_employment_network: {
        title: "Autism at Work",
        organization: "Autism Speaks",
        url: "https://www.autismspeaks.org/autism-work",
        type: "nonprofit",
        credibility: "high",
        description: "Employment resources for adults with autism",
        keywords: ["employment", "adult", "work", "job", "career", "workplace"]
      },

      adult_autism_services: {
        title: "Adult Autism Services Guide",
        organization: "Organization for Autism Research",
        url: "https://researchautism.org/",
        type: "nonprofit",
        credibility: "high",
        description: "Research and resources for adult autism support",
        keywords: ["adult", "services", "independence", "support", "transition"]
      },

      // Family Support
      family_support_autism: {
        title: "Family Support Resources",
        organization: "Autism Society of America",
        url: "https://www.autism-society.org/",
        type: "nonprofit",
        credibility: "high",
        description: "Family support and local chapter resources",
        keywords: ["family", "support", "parent", "sibling", "local", "chapter"]
      },

      sibling_support_project: {
        title: "Sibling Support Project",
        organization: "The Arc",
        url: "https://www.siblingsupport.org/",
        type: "nonprofit",
        credibility: "high",
        description: "Support for siblings of people with disabilities",
        keywords: ["sibling", "family", "support", "disability", "brother", "sister"]
      },

      // Funding and Insurance
      autism_insurance_advocacy: {
        title: "Insurance Coverage for Autism",
        organization: "Autism Speaks",
        url: "https://www.autismspeaks.org/insurance",
        type: "nonprofit",
        credibility: "high",
        description: "Insurance advocacy and coverage information",
        keywords: ["insurance", "coverage", "advocacy", "funding", "benefits"]
      },

      medicaid_autism_services: {
        title: "Medicaid Autism Services",
        organization: "Centers for Medicare & Medicaid Services",
        url: "https://www.medicaid.gov/",
        type: "government",
        credibility: "highest",
        description: "Medicaid coverage for autism services",
        keywords: ["medicaid", "government", "funding", "services", "waiver"]
      },

      // Crisis Resources
      crisis_text_line: {
        title: "Crisis Text Line",
        organization: "Crisis Text Line",
        url: "https://www.crisistextline.org/",
        type: "crisis",
        credibility: "highest",
        description: "24/7 crisis support via text",
        keywords: ["crisis", "emergency", "mental", "health", "support", "text"]
      },

      suicide_prevention: {
        title: "National Suicide Prevention Lifeline",
        organization: "SAMHSA",
        url: "https://suicidepreventionlifeline.org/",
        type: "crisis",
        credibility: "highest",
        description: "24/7 suicide prevention and crisis support",
        keywords: ["suicide", "prevention", "crisis", "mental", "health", "emergency"]
      },

      autism_speaks_crisis: {
        title: "Autism Crisis Resources",
        organization: "Autism Speaks",
        url: "https://www.autismspeaks.org/autism-safety-project",
        type: "nonprofit",
        credibility: "high",
        description: "Crisis and safety resources for autism community",
        keywords: ["crisis", "safety", "emergency", "autism", "wandering", "elopement"]
      },

      // Research and Evidence
      cochrane_autism: {
        title: "Cochrane Autism Reviews",
        organization: "Cochrane Library",
        url: "https://www.cochranelibrary.com/",
        type: "academic",
        credibility: "highest",
        description: "Systematic reviews of autism interventions",
        keywords: ["research", "evidence", "systematic", "review", "cochrane"]
      },

      journal_autism: {
        title: "Journal of Autism and Developmental Disorders",
        organization: "Springer",
        url: "https://link.springer.com/journal/10803",
        type: "academic",
        credibility: "highest",
        description: "Peer-reviewed autism research journal",
        keywords: ["research", "journal", "peer-reviewed", "academic", "study"]
      }
    };
  }
}

module.exports = { ReferenceSystem };