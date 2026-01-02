
import { RoadmapContext, WeeklyTarget } from './types';

export const GIDEON_ROADMAP: RoadmapContext = {
  name: "Gideon Adeoye",
  theme: "Focus Deeply. Build Intentionally. Ship Consistently.",
  vision: [
    "Work generates steady, recurring income",
    "Known as a builder and problem-solver, not just a freelancer",
    "Clarity, calm, and control over time"
  ],
  focusAreas: [
    { id: 1, title: "Main Product", description: "One main product or business focus" },
    { id: 2, title: "Execution", description: "Consistent daily execution" },
    { id: 3, title: "Stability", description: "Financial stability and growth" },
    { id: 4, title: "Mastery", description: "Skill mastery (AI / automation / systems)" },
    { id: 5, title: "Health", description: "Health and mental clarity" }
  ],
  dailyOS: [
    "2–3 hours of deep, focused work",
    "30–60 minutes of learning",
    "Minimal distractions (no scrolling)"
  ],
  weeklyOS: [
    "Sunday progress review",
    "Share one public update",
    "Adjust plans, not goals"
  ],
  businessGoals: [
    { id: "bg1", goal: "Build one strong product with recurring income" },
    { id: "bg2", goal: "Ship MVPs fast — no perfectionism" },
    { id: "bg3", goal: "Launch quarterly meaningful updates" },
    { id: "bg4", goal: "Productize at least one core service" }
  ].map(g => g.goal),
  learningPlan: [
    "Master one high-leverage skill deeply",
    "Read 12 books (1 per month)",
    "Apply one idea from each book immediately"
  ],
  financialDiscipline: [
    "Save/Invest 10–20% of income",
    "Separate personal and business finances",
    "Build 3–6 months emergency buffer"
  ],
  healthRules: [
    "Exercise/Walk 3 times per week",
    "Sleep before midnight",
    "Say NO to unpaid/misaligned work",
    "Say NO to energy-draining people"
  ],
  spiritualRules: [
    "Morning First-Fruits: 15 mins of prayer and scripture",
    "Daily Devotional: Reflect on the Word for strategy and calm",
    "Bible Reading Plan: Systematic study of wisdom literature",
    "Sabbath Rest: One day of complete digital fast and worship"
  ]
};

export const INITIAL_WEEKLY_TARGETS: WeeklyTarget[] = [
  { id: 'wt1', task: "Finalize MVP V1 Spec: Cut 50% of planned features to ship faster", category: "MVP Focus", isCompleted: false },
  { id: 'wt2', task: "Deploy Stripe-integrated landing page for 'Early Founder' subscription", category: "Recurring Income", isCompleted: false },
  { id: 'wt3', task: "Run 5/5 Deep Work blocks (3 hours each) on the core build", category: "Execution", isCompleted: false },
  { id: 'wt4', task: "Implement Gemini API for core product logic automation", category: "Skill Mastery", isCompleted: false }
];

export const SYSTEM_INSTRUCTION = `
You are the "2026 High-Alert Focus & Spiritual Partner," a strategic accountability AI for Gideon Adeoye. 
Your personality is: Commanding, urgent, high-energy, but also spiritually grounded and wise.

Gideon's 2026 Theme: "${GIDEON_ROADMAP.theme}"

Your CRITICAL mission:
1. SPIRITUAL MENTORSHIP: Provide daily devotionals and Bible reading plans. When Gideon asks for his "Daily Devotional" or "Bible Plan," provide a short, high-impact scripture reflection (wisdom-focused like Proverbs or focus-focused like Nehemiah) and a 3-chapter reading plan for the day.
2. BREAK DOWN goals into WEEKLY TARGETS. Focus heavily on MVP Shipping and Recurring Income.
3. ALERT MODE: Gideon wants a "loud alert voice." Speak with authority. If he is slipping, use strong language: "GIDEON! FOCUS! THE MVP MUST SHIP! BUT DO NOT NEGLECT YOUR SPIRITUAL FOUNDATION!"
4. REMIND him of the "Ship MVPs fast" rule. Perfectionism is sin—it is pride. Slash it down and ship.
5. Use his Roadmap Context for every response. 

Tone: High-performance coach meets spiritual mentor. Intense, punchy, and purpose-driven.
`;
