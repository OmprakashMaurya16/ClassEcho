export const assessmentQuestions = {
  "Machine Learning": [
    {
      id: 1,
      question:
        "What is the primary difference between supervised and unsupervised learning?",
      options: [
        "Supervised learning uses labeled data, unsupervised learning uses unlabeled data",
        "Supervised learning is faster than unsupervised learning",
        "Unsupervised learning requires more computational power",
        "There is no significant difference",
      ],
      correctAnswer: 0,
      difficulty: "easy",
      topic: "ML Fundamentals",
    },
    {
      id: 2,
      question: "Which algorithm is commonly used for classification problems?",
      options: [
        "K-means clustering",
        "Linear Regression",
        "Decision Trees",
        "PCA",
      ],
      correctAnswer: 2,
      difficulty: "medium",
      topic: "Classification Algorithms",
    },
    {
      id: 3,
      question: "What does overfitting mean in machine learning?",
      options: [
        "The model performs poorly on training data",
        "The model memorizes training data and performs poorly on new data",
        "The model is too simple",
        "The model has too few parameters",
      ],
      correctAnswer: 1,
      difficulty: "medium",
      topic: "Model Evaluation",
    },
    {
      id: 4,
      question: "What is the purpose of cross-validation?",
      options: [
        "To speed up training",
        "To assess model performance and prevent overfitting",
        "To reduce dataset size",
        "To eliminate outliers",
      ],
      correctAnswer: 1,
      difficulty: "medium",
      topic: "Model Validation",
    },
    {
      id: 5,
      question: "Which metric is best for imbalanced classification problems?",
      options: ["Accuracy", "F1-Score", "Mean Squared Error", "R-squared"],
      correctAnswer: 1,
      difficulty: "hard",
      topic: "Evaluation Metrics",
    },
    {
      id: 6,
      question: "What is gradient descent used for?",
      options: [
        "Data preprocessing",
        "Optimizing model parameters",
        "Feature selection",
        "Data visualization",
      ],
      correctAnswer: 1,
      difficulty: "medium",
      topic: "Optimization",
    },
    {
      id: 7,
      question: "What is the purpose of regularization in machine learning?",
      options: [
        "To increase model complexity",
        "To prevent overfitting by adding penalty terms",
        "To speed up training",
        "To handle missing data",
      ],
      correctAnswer: 1,
      difficulty: "hard",
      topic: "Regularization",
    },
    {
      id: 8,
      question:
        "Which of the following is an example of dimensionality reduction?",
      options: ["K-means", "SVM", "PCA", "Random Forest"],
      correctAnswer: 2,
      difficulty: "medium",
      topic: "Dimensionality Reduction",
    },
    {
      id: 9,
      question: "What is the main advantage of ensemble methods?",
      options: [
        "Faster training time",
        "Combining multiple models improves prediction accuracy",
        "Requires less data",
        "Easier to interpret",
      ],
      correctAnswer: 1,
      difficulty: "medium",
      topic: "Ensemble Learning",
    },
    {
      id: 10,
      question: "What does a confusion matrix help evaluate?",
      options: [
        "Model training speed",
        "Classification model performance",
        "Feature importance",
        "Data distribution",
      ],
      correctAnswer: 1,
      difficulty: "easy",
      topic: "Model Evaluation",
    },
  ],
  "Data Science": [
    {
      id: 1,
      question: "What is the first step in the data science pipeline?",
      options: [
        "Model building",
        "Data collection and understanding",
        "Deployment",
        "Visualization",
      ],
      correctAnswer: 1,
      difficulty: "easy",
      topic: "Data Science Workflow",
    },
    {
      id: 2,
      question: "Which Python library is primarily used for data manipulation?",
      options: ["NumPy", "Pandas", "Matplotlib", "Scikit-learn"],
      correctAnswer: 1,
      difficulty: "easy",
      topic: "Python Libraries",
    },
    {
      id: 3,
      question: "What is exploratory data analysis (EDA)?",
      options: [
        "Final model testing",
        "Initial investigation to discover patterns and anomalies",
        "Data deployment",
        "Model optimization",
      ],
      correctAnswer: 1,
      difficulty: "medium",
      topic: "EDA",
    },
    {
      id: 4,
      question: "How do you handle missing values in a dataset?",
      options: [
        "Always delete the rows",
        "Imputation, deletion, or prediction based on context",
        "Replace with zeros",
        "Ignore them",
      ],
      correctAnswer: 1,
      difficulty: "medium",
      topic: "Data Preprocessing",
    },
    {
      id: 5,
      question: "What is the purpose of feature scaling?",
      options: [
        "To improve model interpretability",
        "To normalize features to similar ranges",
        "To reduce dataset size",
        "To eliminate outliers",
      ],
      correctAnswer: 1,
      difficulty: "medium",
      topic: "Feature Engineering",
    },
    {
      id: 6,
      question: "What does correlation between two variables indicate?",
      options: [
        "Causation",
        "Statistical relationship",
        "Independence",
        "Prediction accuracy",
      ],
      correctAnswer: 1,
      difficulty: "medium",
      topic: "Statistical Analysis",
    },
    {
      id: 7,
      question:
        "Which visualization is best for showing distribution of a single variable?",
      options: ["Scatter plot", "Histogram", "Line chart", "Heatmap"],
      correctAnswer: 1,
      difficulty: "easy",
      topic: "Data Visualization",
    },
    {
      id: 8,
      question: "What is A/B testing used for?",
      options: [
        "Data cleaning",
        "Comparing two versions to determine which performs better",
        "Feature selection",
        "Model training",
      ],
      correctAnswer: 1,
      difficulty: "medium",
      topic: "Experimentation",
    },
    {
      id: 9,
      question: "What is the purpose of a train-test split?",
      options: [
        "To save memory",
        "To evaluate model performance on unseen data",
        "To speed up training",
        "To reduce overfitting",
      ],
      correctAnswer: 1,
      difficulty: "medium",
      topic: "Model Validation",
    },
    {
      id: 10,
      question: "What is big data characterized by?",
      options: [
        "Only volume",
        "Volume, velocity, and variety (3 Vs)",
        "Only velocity",
        "Small datasets",
      ],
      correctAnswer: 1,
      difficulty: "easy",
      topic: "Big Data",
    },
  ],
  Default: [
    {
      id: 1,
      question: "What is the primary goal of effective teaching?",
      options: [
        "Completing the syllabus",
        "Facilitating student understanding and learning",
        "Lecturing for the entire class",
        "Maintaining discipline",
      ],
      correctAnswer: 1,
      difficulty: "easy",
      topic: "Teaching Fundamentals",
    },
    {
      id: 2,
      question:
        "Which teaching method encourages active student participation?",
      options: [
        "Pure lecture",
        "Interactive discussions and problem-solving",
        "Reading from textbook",
        "Silent study",
      ],
      correctAnswer: 1,
      difficulty: "easy",
      topic: "Teaching Methods",
    },
    {
      id: 3,
      question: "How should complex concepts be taught?",
      options: [
        "All at once without breaks",
        "Breaking down into smaller, manageable parts with examples",
        "Only through theory",
        "Without examples",
      ],
      correctAnswer: 1,
      difficulty: "medium",
      topic: "Concept Clarity",
    },
    {
      id: 4,
      question: "What is the importance of assessment in teaching?",
      options: [
        "To punish students",
        "To measure learning and provide feedback for improvement",
        "To make students competitive",
        "To reduce class size",
      ],
      correctAnswer: 1,
      difficulty: "medium",
      topic: "Assessment",
    },
    {
      id: 5,
      question: "How can you ensure student engagement in class?",
      options: [
        "Strict rules only",
        "Interactive activities, questions, and real-world examples",
        "Longer lectures",
        "More homework",
      ],
      correctAnswer: 1,
      difficulty: "medium",
      topic: "Student Engagement",
    },
    {
      id: 6,
      question: "What is the role of feedback in teaching?",
      options: [
        "To criticize students",
        "To guide improvement and reinforce learning",
        "To reduce workload",
        "To maintain authority",
      ],
      correctAnswer: 1,
      difficulty: "medium",
      topic: "Feedback",
    },
    {
      id: 7,
      question: "How should you handle diverse learning paces in a classroom?",
      options: [
        "Focus only on fast learners",
        "Provide differentiated instruction and support",
        "Ignore struggling students",
        "Same pace for everyone",
      ],
      correctAnswer: 1,
      difficulty: "hard",
      topic: "Inclusive Teaching",
    },
    {
      id: 8,
      question: "What makes a good learning environment?",
      options: [
        "Strict silence",
        "Safe, supportive, and encouraging atmosphere",
        "Competitive pressure",
        "Isolation",
      ],
      correctAnswer: 1,
      difficulty: "easy",
      topic: "Learning Environment",
    },
    {
      id: 9,
      question:
        "How important is relating course content to real-world applications?",
      options: [
        "Not important",
        "Very important - helps students see relevance and increases motivation",
        "Only for advanced courses",
        "Wastes time",
      ],
      correctAnswer: 1,
      difficulty: "medium",
      topic: "Practical Application",
    },
    {
      id: 10,
      question: "What is continuous professional development for teachers?",
      options: [
        "Unnecessary after initial training",
        "Ongoing learning to improve teaching skills and knowledge",
        "Only for new teachers",
        "Waste of time",
      ],
      correctAnswer: 1,
      difficulty: "medium",
      topic: "Professional Development",
    },
  ],
};

export const improvementSuggestions = {
  "ML Fundamentals": {
    tips: [
      "Start with clear definitions and visual diagrams showing the differences between learning types",
      "Use real-world examples like spam detection (supervised) vs customer segmentation (unsupervised)",
      "Provide hands-on coding exercises to reinforce concepts",
    ],
    resources: [
      "Andrew Ng's Machine Learning course on Coursera",
      "Interactive ML visualizations at https://seeing-theory.brown.edu/",
    ],
  },
  "Classification Algorithms": {
    tips: [
      "Use decision tree visualizations to show how algorithms make decisions",
      "Compare multiple algorithms side-by-side with the same dataset",
      "Include practical case studies from industry applications",
    ],
    resources: [
      "Scikit-learn documentation with examples",
      "Kaggle competitions for practical experience",
    ],
  },
  "Model Evaluation": {
    tips: [
      "Use confusion matrices and ROC curves to visualize performance",
      "Teach the trade-offs between different metrics",
      "Provide examples of when each metric is most appropriate",
    ],
    resources: [
      "Google's ML Crash Course on model evaluation",
      "Interactive metric calculators and visualizations",
    ],
  },
  "Model Validation": {
    tips: [
      "Demonstrate k-fold cross-validation with visual diagrams",
      "Show examples of overfitting vs proper validation",
      "Include coding labs with validation techniques",
    ],
    resources: [
      "Cross-validation tutorials on DataCamp",
      "Scikit-learn cross-validation guide",
    ],
  },
  "Evaluation Metrics": {
    tips: [
      "Explain when to use accuracy vs precision/recall/F1",
      "Use confusion matrix examples with imbalanced datasets",
      "Show real business impact of choosing wrong metrics",
    ],
    resources: [
      "Towards Data Science articles on metrics",
      "Interactive metric comparison tools",
    ],
  },
  Optimization: {
    tips: [
      "Use 3D surface plots to visualize gradient descent",
      "Animate the optimization process step-by-step",
      "Compare different optimization algorithms practically",
    ],
    resources: [
      "3Blue1Brown neural network series",
      "TensorFlow optimization tutorials",
    ],
  },
  Regularization: {
    tips: [
      "Show visual comparisons of models with/without regularization",
      "Explain L1 vs L2 regularization with practical examples",
      "Demonstrate impact on model complexity",
    ],
    resources: [
      "Regularization techniques on Fast.ai",
      "Scikit-learn regularization examples",
    ],
  },
  "Teaching Methods": {
    tips: [
      "Incorporate more interactive activities like think-pair-share",
      "Use problem-based learning scenarios",
      "Encourage peer teaching and group discussions",
    ],
    resources: [
      "Pedagogy books on active learning strategies",
      "Workshop on interactive teaching methods",
    ],
  },
  "Concept Clarity": {
    tips: [
      "Use analogies and metaphors to explain complex ideas",
      "Break topics into smaller chunks with checkpoints",
      "Provide multiple examples from different contexts",
    ],
    resources: [
      "Bloom's Taxonomy for structured learning",
      "Cognitive load theory for better explanation",
    ],
  },
  "Student Engagement": {
    tips: [
      "Start classes with thought-provoking questions",
      "Use multimedia and interactive tools",
      "Relate content to current events and student interests",
    ],
    resources: [
      "Edutopia engagement strategies",
      "Technology tools like Kahoot, Mentimeter",
    ],
  },
};
