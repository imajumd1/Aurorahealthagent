/**
 * Topic-Specific FAQs - Most Asked Questions by Topic
 * These are cached frequently asked questions that get live-processed answers
 */

const topicFAQs = {
  early_signs: {
    title: 'Early Signs & Diagnosis',
    description: 'Most frequently asked questions about recognizing autism signs and the diagnosis process',
    questions: [
      "What are the earliest signs of autism in babies and toddlers?",
      "At what age can autism be reliably diagnosed?",
      "What is the difference between autism signs and typical developmental delays?",
      "Should I be concerned if my child doesn't make eye contact?",
      "How do I know if I should get my child screened for autism?",
      "What is the autism screening and diagnosis process like?",
      "Can autism be diagnosed in adults who were never evaluated as children?",
      "What are the red flags for autism in a 2-year-old?",
      "Is it normal for autistic children to have speech delays?",
      "What should I do if my pediatrician dismisses my concerns about autism?"
    ]
  },
  
  school_support: {
    title: 'School Support',
    description: 'Most frequently asked questions about educational support and IEPs',
    questions: [
      "What is an IEP and how do I get one for my autistic child?",
      "What accommodations should I request for my child with autism?",
      "How do I prepare for an IEP meeting?",
      "What is the difference between an IEP and a 504 plan?",
      "Can my child with autism attend mainstream school?",
      "What rights do I have as a parent of a child with autism in school?",
      "How can I help my autistic child with homework?",
      "What should I do if the school is not following my child's IEP?",
      "How do I handle bullying of my autistic child at school?",
      "What are the best educational settings for children with autism?"
    ]
  },
  
  daily_routines: {
    title: 'Daily Routines',
    description: 'Most frequently asked questions about managing daily activities',
    questions: [
      "How do I create effective routines for my autistic child?",
      "What are visual schedules and how do I use them?",
      "How can I help my child with transitions between activities?",
      "What strategies work for bedtime routines with autism?",
      "How do I handle meltdowns during daily routines?",
      "What are the best ways to teach daily living skills?",
      "How can I make morning routines less stressful?",
      "What helps with establishing healthy eating routines?",
      "How do I prepare my autistic child for unexpected changes?",
      "What are effective strategies for bathroom training with autism?"
    ]
  },
  
  communication: {
    title: 'Communication Tips',
    description: 'Most frequently asked questions about communication development',
    questions: [
      "What is AAC and how can it help my nonverbal child?",
      "How can I encourage my autistic child to speak?",
      "What are the best speech therapy approaches for autism?",
      "How do I teach my child to express their needs?",
      "What is the difference between speech delay and autism?",
      "How can I improve my child's conversation skills?",
      "What are social stories and how do they help communication?",
      "How do I help my child understand nonverbal cues?",
      "What technology can assist with autism communication?",
      "How can I support my child's language development at home?"
    ]
  },
  
  sensory_issues: {
    title: 'Sensory Issues',
    description: 'Most frequently asked questions about sensory processing',
    questions: [
      "What are common sensory issues in autism?",
      "How do I create a sensory-friendly environment at home?",
      "What helps with sensory overload and meltdowns?",
      "What are sensory seeking vs. sensory avoiding behaviors?",
      "How can occupational therapy help with sensory issues?",
      "What are the best sensory tools and toys for autism?",
      "How do I handle my child's sensitivity to loud noises?",
      "What are weighted blankets and do they help autism?",
      "How can I help my child with tactile sensitivities?",
      "What strategies work for sensory issues in public places?"
    ]
  },
  
  family_resources: {
    title: 'Family Resources',
    description: 'Most frequently asked questions about family support',
    questions: [
      "Where can I find autism support groups for parents?",
      "How do I get respite care for my autistic child?",
      "What financial assistance is available for autism families?",
      "How can I help siblings understand and cope with autism?",
      "What are the best autism organizations and resources?",
      "How do I find autism-friendly activities and events?",
      "What support is available for single parents of autistic children?",
      "How can I take care of my own mental health as an autism parent?",
      "Where can I find autism specialists and therapists?",
      "What are the best online communities for autism families?"
    ]
  }
};

/**
 * Get FAQ questions for a specific topic
 */
function getFAQsByTopic(topicId) {
  return topicFAQs[topicId] || null;
}

/**
 * Get all available FAQ topics
 */
function getAllFAQTopics() {
  return Object.keys(topicFAQs).map(key => ({
    id: key,
    title: topicFAQs[key].title,
    description: topicFAQs[key].description,
    questionCount: topicFAQs[key].questions.length
  }));
}

module.exports = {
  topicFAQs,
  getFAQsByTopic,
  getAllFAQTopics
};
