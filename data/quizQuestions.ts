import { QuizQuestion } from '../types';

/**
 * The Crossing Over Diagnostic - The Ten Perfections (Paramis)
 *
 * Each question contains:
 * - Strength statement: Describes mastery of the parami
 * - Weakness statement: Describes lack of development in the parami
 *
 * Users rate both statements on a 1-5 scale to assess their current practice.
 */
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    paramiName: "Dāna",
    englishName: "Generosity",
    strengthStatement: "I find joy in giving without expecting anything in return, and I prioritize others' needs alongside my own.",
    weaknessStatement: "I often hesitate to share my resources or time, preferring to keep things for myself."
  },
  {
    id: 2,
    paramiName: "Sīla",
    englishName: "Ethical Conduct",
    strengthStatement: "I act with integrity even when no one is watching, and my words and actions align with my values.",
    weaknessStatement: "I sometimes compromise my principles for convenience or personal gain, rationalizing small ethical lapses."
  },
  {
    id: 3,
    paramiName: "Nekkhamma",
    englishName: "Renunciation",
    strengthStatement: "I can let go of attachments and find contentment without clinging to material things or outcomes.",
    weaknessStatement: "I crave comfort, status, or possessions, and I struggle to release what no longer serves me."
  },
  {
    id: 4,
    paramiName: "Paññā",
    englishName: "Wisdom",
    strengthStatement: "I see things clearly as they are, discern skillful from unskillful actions, and learn from my experiences.",
    weaknessStatement: "I react impulsively without reflection, struggle to see the bigger picture, or cling to views that cause suffering."
  },
  {
    id: 5,
    paramiName: "Viriya",
    englishName: "Energy",
    strengthStatement: "I bring consistent effort to my commitments and maintain enthusiasm for what truly matters.",
    weaknessStatement: "I procrastinate, avoid difficult tasks, or give up easily when faced with challenges or discomfort."
  },
  {
    id: 6,
    paramiName: "Khanti",
    englishName: "Patience",
    strengthStatement: "I remain calm and steady in the face of difficulties, accepting what I cannot change with grace.",
    weaknessStatement: "I become irritated or frustrated easily, especially when things don't go my way or take longer than expected."
  },
  {
    id: 7,
    paramiName: "Sacca",
    englishName: "Truthfulness",
    strengthStatement: "I speak honestly and keep my promises, even when the truth is uncomfortable or inconvenient.",
    weaknessStatement: "I bend the truth, make commitments I don't keep, or say what others want to hear rather than what's true."
  },
  {
    id: 8,
    paramiName: "Adhiṭṭhāna",
    englishName: "Determination",
    strengthStatement: "I follow through on my intentions with resolve, staying committed to my path despite obstacles.",
    weaknessStatement: "I abandon goals when they become difficult, or I lack the determination to see things through to completion."
  },
  {
    id: 9,
    paramiName: "Mettā",
    englishName: "Loving-Kindness",
    strengthStatement: "I extend genuine warmth and goodwill to all beings, including myself, even those I find difficult.",
    weaknessStatement: "I harbor resentment or ill-will, struggle with self-compassion, or withhold kindness from those who've hurt me."
  },
  {
    id: 10,
    paramiName: "Upekkhā",
    englishName: "Equanimity",
    strengthStatement: "I remain balanced and non-reactive amid life's ups and downs, accepting both praise and blame with peace.",
    weaknessStatement: "I'm easily swayed by others' opinions, overly affected by circumstances, or struggle to stay centered in chaos."
  },
];
