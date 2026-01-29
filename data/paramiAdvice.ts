/**
 * Parami descriptions and advice for improvement
 * Used in the quiz results detail modal
 */

export interface ParamiAdviceContent {
  paramiId: number;
  description: string;
  adviceForImprovement: string;
}

export const PARAMI_ADVICE: ParamiAdviceContent[] = [
  {
    paramiId: 1,
    description: "This perfection is a willingness to open and give without religious or pious motives. It is not merely a callous act of helping those \"lower\" than you, but a form of communication that transcends self-defensiveness. True generosity is learning to trust in your fundamental richness so that you can afford to give up your psychological \"demand\" for a return.",
    adviceForImprovement: "Practice \"flower watering\" by verbally recognizing and praising the wholesome qualities in others. Offer your true presence to those you love by practicing mindful breathing to bring your body and mind into the here and now.",
  },
  {
    paramiId: 2,
    description: "Virtue is not a matter of binding oneself to rigid laws, but acting according to openness. It is the indispensable foundation for all higher spiritual attainments, promoting a harmonious life for both the individual and society.",
    adviceForImprovement: "Use the Five Mindfulness Trainings as a concrete compass to protect life and prevent exploitation. When you feel a negative habit taking over, simply say, \"Hello, habit energy,\" to recognize it without judgment and stop the \"horse\" of forgetfulness from carrying you away.",
  },
  {
    paramiId: 3,
    description: "Renunciation is the act of stepping out of the \"bureaucracy of ego\" and its constant desire for more \"spiritual\" or \"transcendental\" versions of comfort. It is often compared to emptying your boat so that it can travel faster toward the other shore of liberation.",
    adviceForImprovement: "Identify your \"cows\"—those possessions or ideas you think you must have to be happy—and practice the joy of releasing them. Avoid the trap of \"spiritual materialism\" by focusing on \"tasting and chewing\" one piece of wisdom rather than collecting many different paths like antiques in a junk shop.",
  },
  {
    paramiId: 4,
    description: "Wisdom is the supreme light that illuminates the true nature of things and dispels the darkness of ignorance. It is not just an intellectual achievement but a penetration into the \"isness\" of things without the labels or categories we usually impose on them.",
    adviceForImprovement: "Challenge your perceptions daily by asking, \"Are you sure?\" to avoid reacting to illusory \"marks\" or signs. Practice seeing the \"non-self elements\" in things, such as seeing the cloud and sunshine in a piece of paper, to realize the interbeing of all life.",
  },
  {
    paramiId: 5,
    description: "This is joyous energy that allows us to live life thoroughly and fully because we are intensely interested in its creative patterns. It is the constant endeavor to train oneself in thought, word, and deed.",
    adviceForImprovement: "Tune your effort like a vina player: if your strings are too tight, they snap; if too loose, they make no music. Practice \"selective watering\" by consciously choosing to nourish wholesome seeds of joy and letting unwholesome seeds lie dormant.",
  },
  {
    paramiId: 6,
    description: "Inclusiveness is the capacity to receive, embrace, and transform pain without being disturbed. It is like a large river that can receive a handful of salt without the water becoming undrinkable.",
    adviceForImprovement: "When you feel physical or emotional pain, avoid the \"second arrow\"—do not add mental resentment or anxiety to the initial pain, which only makes it 100 times worse. Learn to embrace your anger with the energy of mindfulness, like a mother holding a crying baby.",
  },
  {
    paramiId: 7,
    description: "Truthfulness means being loyal to reality and avoiding the \"closed-fist of the teacher\" or hidden agendas. It is built on honesty and integrity (Ajjava) in both internal reflection and external speech.",
    adviceForImprovement: "Practice \"preserving truth\" by stating your beliefs as \"this is my faith,\" while avoiding the dogmatic conclusion that \"this alone is truth and everything else is false\". Be straightforward with your \"spiritual friend\" or mentor, exposing the raw and rugged qualities of your ego instead of wearing a mask.",
  },
  {
    paramiId: 8,
    description: "This is the unflinching determination to follow the path regardless of external prodding. It is the \"mental volition\" or will to be that creates the root of our spiritual existence.",
    adviceForImprovement: "Practice \"just sitting\"—sitting for its own sake without the ambition to attain a \"higher\" state or a miraculous result. Focus on \"nowness\" and the relationship between yourself and the present moment, as this is the only effective way to step out of ego.",
  },
  {
    paramiId: 9,
    description: "Maitri is the intention and capacity to offer joy and happiness. It is a \"fearless openness\" without territorial limitations, modeled after a mother who would protect her only child even at the risk of her own life.",
    adviceForImprovement: "Cultivate \"compassionate listening\" where your only purpose is to help the other person suffer less, even if they say things that are incorrect. Use the mantra \"Darling, I know you suffer, that is why I am here for you\" to relieve the pain of those around you.",
  },
  {
    paramiId: 10,
    description: "Equanimity is the \"wisdom of equality,\" the ability to see everyone as equal and remove the boundaries between self and others. It allows one to remain unshaken by the \"eight worldly conditions\" such as praise and blame or gain and loss.",
    adviceForImprovement: "Practice \"letting be\" by allowing thoughts and emotions to occur spontaneously without the ambition to suppress or stir them up. Look at situations from an \"aerial point of view,\" realizing that the drama of the ego is ultimately insignificant in the vast open ground of reality.",
  },
];

/**
 * Get advice content for a specific parami
 */
export function getParamiAdvice(paramiId: number): ParamiAdviceContent | undefined {
  return PARAMI_ADVICE.find((advice) => advice.paramiId === paramiId);
}
