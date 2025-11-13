import { Parami } from '../types';

export const PARAMIS: Parami[] = [
  {
    id: 1,
    name: 'Dāna',
    englishName: 'Generosity',
    shortDescription: 'The practice of giving freely without expectation of return.',
    fullDescription:
      'Dana is the first Parami, representing the practice of generosity and selfless giving. It involves sharing our time, resources, knowledge, and compassion with others without attachment to outcomes or expectation of reward. Dana purifies the heart from greed and teaches us the joy of letting go. Through generosity, we develop abundance mentality and recognize our interconnectedness with all beings.',
    story:
      'A wealthy merchant once approached the Buddha, boasting of his charitable donations. "I give gold to temples and feed the poor," he said proudly. The Buddha then pointed to an old woman nearby, who was placing a single grain of rice in the offering bowl. "Her gift is greater than yours," he said. The merchant was confused. The Buddha explained: "You give from your abundance without sacrifice. She gives her only grain, holding nothing back for herself. True generosity is measured not by the amount given, but by what remains in the giver\'s hand." The merchant realized that giving while still clinging creates no freedom. That day, he learned that Dana begins when we release our grip on what we thought we needed.',
    quote: {
      id: 'dana-1',
      text: 'If you knew what I know about the power of giving, you would not let a single meal pass without sharing it in some way.',
      author: 'Buddha',
      source: 'Itivuttaka 26',
    },
    practices: [
      {
        id: 'dana-p1',
        title: 'Share knowledge freely',
        description: 'Teach someone a skill or share information that could help them today.',
        difficulty: 'easy',
        context: 'work',
      },
      {
        id: 'dana-p2',
        title: 'Give your full attention',
        description: 'Offer someone your complete, undistracted presence for 15 minutes.',
        difficulty: 'easy',
        context: 'relationships',
      },
      {
        id: 'dana-p3',
        title: 'Practice anonymous giving',
        description: 'Do something kind for someone without them knowing it was you.',
        difficulty: 'medium',
        context: 'any',
      },
    ],
  },
  {
    id: 2,
    name: 'Sīla',
    englishName: 'Morality',
    shortDescription: 'Moral conduct and ethical behavior that creates harmony.',
    fullDescription:
      'Sila represents ethical conduct and moral integrity. It is the foundation of Buddhist practice, expressed through mindful speech, action, and livelihood. Sila involves living in alignment with the precepts: not harming, not taking what is not given, wise speech, mindful consumption, and clarity of mind. When we practice Sila, we create conditions for peace and trust in our relationships and communities.',
    story:
      'A young monk found a purse filled with gold coins on the forest path. His first thought was of his poor family who could use the wealth. But he remembered his precepts and waited by the path. Hours later, a distraught merchant appeared, searching frantically. The monk returned the purse. Grateful, the merchant offered him half the gold as reward. The monk declined: "If I take payment for doing what is right, then righteousness becomes a transaction. Sila is not practiced for reward—it is the reward itself." The merchant was moved by these words and later became a great supporter of the monastery, but the monk never knew this. He had already received what he sought: the peace of a clear conscience.',
    quote: {
      id: 'sila-1',
      text: 'In all that should be done and left undone, let the wise discern, for they who understand the Dhamma know how to conduct themselves.',
      author: 'Buddha',
      source: 'Dhammapada 310',
    },
    practices: [
      {
        id: 'sila-p1',
        title: 'Speak only truth',
        description: 'Today, commit to speaking only what is true, necessary, and kind.',
        difficulty: 'medium',
        context: 'any',
      },
      {
        id: 'sila-p2',
        title: 'Honor your commitments',
        description: 'Follow through on a promise you made, no matter how small.',
        difficulty: 'easy',
        context: 'any',
      },
      {
        id: 'sila-p3',
        title: 'Ethical consumption',
        description: 'Make one purchasing decision based on ethical considerations rather than convenience.',
        difficulty: 'medium',
        context: 'personal',
      },
    ],
  },
  {
    id: 3,
    name: 'Nekkhamma',
    englishName: 'Renunciation',
    shortDescription: 'Letting go of attachments that bind us to suffering.',
    fullDescription:
      'Nekkhamma is the practice of renunciation and non-attachment. It does not mean rejecting the world, but rather releasing our clinging to experiences, possessions, and outcomes. Nekkhamma brings freedom from the endless cycle of wanting and aversion. By simplifying our lives and releasing what we do not need, we discover contentment and peace. This practice teaches us that true happiness comes not from accumulation but from letting go.',
    story:
      'A successful executive left her career to study meditation at a monastery. Her friends thought she was crazy to abandon everything she had worked for. In the monastery, she lived with one robe, one bowl, and a sleeping mat. One night, thieves broke in and stole her bowl—her only possession. She laughed when she discovered the theft. "Poor thieves," she thought. "They came all this way for a clay bowl I would have gladly given them." In that moment, she understood: she had spent decades accumulating things she feared to lose, and the fear had imprisoned her. Now, with nothing left to protect, she was finally free. True wealth, she realized, isn\'t what we can hold—it\'s the lightness of having nothing to defend.',
    quote: {
      id: 'nekkhamma-1',
      text: 'Let go of the past, let go of the future, let go of the present. Crossing to the farther shore of existence, with mind released from everything, do not again undergo birth and decay.',
      author: 'Buddha',
      source: 'Dhammapada 348',
    },
    practices: [
      {
        id: 'nekkhamma-p1',
        title: 'Digital simplification',
        description: 'Delete one app or unsubscribe from one service you no longer truly need.',
        difficulty: 'easy',
        context: 'personal',
      },
      {
        id: 'nekkhamma-p2',
        title: 'Release a grudge',
        description: 'Let go of resentment toward someone, even if just in your own heart.',
        difficulty: 'challenging',
        context: 'relationships',
      },
      {
        id: 'nekkhamma-p3',
        title: 'Practice non-attachment to outcomes',
        description: 'Do your best on a task, then consciously release attachment to how it turns out.',
        difficulty: 'medium',
        context: 'work',
      },
    ],
  },
  {
    id: 4,
    name: 'Paññā',
    englishName: 'Wisdom',
    shortDescription: 'Clear seeing and discernment of the true nature of reality.',
    fullDescription:
      'Panna is transcendent wisdom that sees beyond surface appearances to understand the true nature of existence. It encompasses understanding the Four Noble Truths, recognizing impermanence, seeing the interconnectedness of all things, and discerning wholesome from unwholesome actions. Panna develops through study, reflection, and meditative insight. With wisdom, we make skillful choices and respond to life with clarity rather than reactivity.',
    story:
      'Two travelers came upon a village where everyone was arguing about whether the wind or the flag was moving. One group insisted the wind moved, causing the flag to flutter. The other group said the flag moved on its own, disturbing the air. The debate grew heated. An elder monk passed by and listened quietly. When asked his opinion, he said simply: "Neither the wind nor the flag is moving. Your minds are moving." The travelers were struck silent. They realized they had been so focused on being right that they missed the deeper truth: all movement arises from perception, and perception arises from mind. That day, they learned that Panna is not about winning arguments—it\'s about seeing clearly beyond our need to be right.',
    quote: {
      id: 'panna-1',
      text: 'As a solid rock is not shaken by the wind, even so the wise are not ruffled by praise or blame.',
      author: 'Buddha',
      source: 'Dhammapada 81',
    },
    practices: [
      {
        id: 'panna-p1',
        title: 'Question your assumptions',
        description: 'Identify one strongly-held belief and examine it from multiple perspectives.',
        difficulty: 'medium',
        context: 'personal',
      },
      {
        id: 'panna-p2',
        title: 'Observe impermanence',
        description: 'Notice three things today that have changed since yesterday.',
        difficulty: 'easy',
        context: 'any',
      },
      {
        id: 'panna-p3',
        title: 'Learn from difficulty',
        description: 'When facing a challenge, ask "What is this teaching me?" instead of "Why me?"',
        difficulty: 'medium',
        context: 'any',
      },
    ],
  },
  {
    id: 5,
    name: 'Viriya',
    englishName: 'Energy',
    shortDescription: 'Sustained effort and diligent persistence on the spiritual path.',
    fullDescription:
      'Viriya represents enthusiastic perseverance and right effort. It is the energy required to cultivate wholesome states and abandon unwholesome ones. Viriya is not harsh striving, but balanced, joyful effort sustained over time. Like a warrior who never gives up, we apply persistent energy to our practice, continually returning to mindfulness, compassion, and wisdom even when difficult. This steady dedication transforms our lives.',
    story:
      'A student came to her meditation teacher, frustrated. "I\'ve been practicing for months, but I still get distracted constantly. I\'m ready to quit." The teacher smiled and took her to the garden, where water dripped slowly onto a stone. "See this groove?" she said, pointing to a small indentation. "This stone has sat here for 20 years. The water doesn\'t force its way through—it just keeps showing up, one drop at a time. Your practice is the same. You don\'t fail when your mind wanders; you succeed each time you gently return." The student looked at the stone, understanding dawning. Transformation isn\'t about dramatic breakthroughs—it\'s about showing up with gentle persistence, day after day, breath after breath.',
    quote: {
      id: 'viriya-1',
      text: 'There is no fire like passion, no crime like hatred, no sorrow like separation, no sickness like hunger of heart, and no joy like the joy of freedom. Health, contentment and trust are your greatest possessions, and freedom your greatest joy.',
      author: 'Buddha',
      source: 'Dhammapada 202-204',
    },
    practices: [
      {
        id: 'viriya-p1',
        title: 'Consistent meditation',
        description: 'Sit in meditation for at least 5 minutes, even if you don\'t feel like it.',
        difficulty: 'easy',
        context: 'personal',
      },
      {
        id: 'viriya-p2',
        title: 'Complete an unfinished task',
        description: 'Finish one small task you\'ve been procrastinating on.',
        difficulty: 'medium',
        context: 'any',
      },
      {
        id: 'viriya-p3',
        title: 'Maintain a healthy habit',
        description: 'Even when tired, follow through on one health-supporting practice (exercise, healthy eating, sleep).',
        difficulty: 'medium',
        context: 'personal',
      },
    ],
  },
  {
    id: 6,
    name: 'Khanti',
    englishName: 'Patience',
    shortDescription: 'Enduring difficulty with grace and equanimity.',
    fullDescription:
      'Khanti is patience and forbearance in the face of difficulty, insult, or hardship. It means bearing discomfort without becoming reactive or losing our inner peace. Khanti is not passive resignation but an active choice to meet challenges with acceptance and grace. By developing patience, we cultivate emotional resilience and the ability to remain centered when life does not go according to our wishes.',
    story:
      'A master calligrapher was creating a piece for the emperor when her young apprentice accidentally knocked over an ink bottle, ruining weeks of work. The room fell silent, everyone waiting for her anger. Instead, she studied the black stain spreading across the silk. Then she smiled, picked up her brush, and began incorporating the spill into the design. What emerged was even more beautiful than the original—a landscape where the accidental ink became a dramatic night sky. Later, her apprentice asked how she remained calm. She replied: "Anger would not un-spill the ink. Patience allowed me to see what the moment offered instead of mourning what it took. Every setback is an invitation to create something new from what remains."',
    quote: {
      id: 'khanti-1',
      text: 'Patience is the highest austerity. Forbearance is the supreme practice.',
      author: 'Buddha',
      source: 'Dhammapada 184',
    },
    practices: [
      {
        id: 'khanti-p1',
        title: 'Wait without irritation',
        description: 'When delayed (in traffic, in line, waiting for response), practice staying calm and present.',
        difficulty: 'easy',
        context: 'any',
      },
      {
        id: 'khanti-p2',
        title: 'Respond instead of react',
        description: 'When someone frustrates you, pause for three breaths before responding.',
        difficulty: 'medium',
        context: 'relationships',
      },
      {
        id: 'khanti-p3',
        title: 'Accept discomfort',
        description: 'When experiencing physical or emotional discomfort, practice being with it rather than immediately trying to fix it.',
        difficulty: 'challenging',
        context: 'personal',
      },
    ],
  },
  {
    id: 7,
    name: 'Sacca',
    englishName: 'Truthfulness',
    shortDescription: 'Commitment to truth in speech and authentic being.',
    fullDescription:
      'Sacca represents truthfulness and integrity in both speech and action. It means being honest with ourselves and others, keeping our word, and living authentically. Sacca involves speaking truth that is both honest and beneficial, avoiding lies, exaggerations, and deceptions. When we practice Sacca, we become trustworthy and reliable, and we develop inner confidence that comes from alignment between our values and our actions.',
    story:
      'A court advisor was known for always speaking truth, even when difficult. One day, the king asked him: "Do you think I am wise?" The court grew tense—saying "no" could mean death, but lying would violate his principles. The advisor paused, then said: "Your Majesty, wisdom is not something we possess but something we practice in each moment. I have seen you make wise choices and unwise ones, as we all do. What makes you truly wise is not perfection, but your willingness to ask the question." The king sat quietly, then smiled. "Your truth serves me better than flattery ever could. It gives me the chance to become the king I wish to be." The advisor learned that Sacca is not about harsh judgments—it\'s about offering truth wrapped in compassion.',
    quote: {
      id: 'sacca-1',
      text: 'Better than a thousand hollow words is one word that brings peace.',
      author: 'Buddha',
      source: 'Dhammapada 100',
    },
    practices: [
      {
        id: 'sacca-p1',
        title: 'Honest self-reflection',
        description: 'Acknowledge one truth about yourself that you usually avoid or deny.',
        difficulty: 'medium',
        context: 'personal',
      },
      {
        id: 'sacca-p2',
        title: 'Keep a small promise',
        description: 'Make a commitment to yourself or another, and follow through completely.',
        difficulty: 'easy',
        context: 'any',
      },
      {
        id: 'sacca-p3',
        title: 'Speak your authentic truth',
        description: 'Share your genuine feelings or opinion in a situation where you might usually stay silent.',
        difficulty: 'challenging',
        context: 'relationships',
      },
    ],
  },
  {
    id: 8,
    name: 'Adhiṭṭhāna',
    englishName: 'Determination',
    shortDescription: 'Unwavering resolve and firm commitment to our path.',
    fullDescription:
      'Adhitthana is the quality of determination and strong resolution. It represents the unshakeable commitment to follow through on our intentions and vows, regardless of obstacles. Adhitthana is the inner strength that keeps us on our path when enthusiasm wanes or difficulties arise. By cultivating determination, we develop the fortitude to maintain our practice through all circumstances and honor the commitments we make to ourselves and others.',
    story:
      'A young athlete trained for years to make the national team, sacrificing comforts and social life. The day before the final trial, she injured her knee severely. Doctors said she needed surgery and months of recovery. She could have accepted defeat, but she remembered her teacher\'s words: "Adhitthana is tested not when the path is clear, but when every reason to quit seems reasonable." Despite the pain, she completed the trial, not placing first, but honoring her commitment to herself. Years later, she became a coach. Her most important lesson was not about winning, but about the strength found in keeping promises to ourselves when no one is watching—because that\'s when determination matters most.',
    quote: {
      id: 'adhitthana-1',
      text: 'An idea that is developed and put into action is more important than an idea that exists only as an idea.',
      author: 'Buddha',
    },
    practices: [
      {
        id: 'adhitthana-p1',
        title: 'Set a clear intention',
        description: 'Choose one specific intention for today and write it down.',
        difficulty: 'easy',
        context: 'personal',
      },
      {
        id: 'adhitthana-p2',
        title: 'Honor your word',
        description: 'When you say you will do something today, ensure you follow through no matter what.',
        difficulty: 'medium',
        context: 'any',
      },
      {
        id: 'adhitthana-p3',
        title: 'Continue when discouraged',
        description: 'Identify one goal you\'ve been losing motivation for, and take one action toward it anyway.',
        difficulty: 'challenging',
        context: 'any',
      },
    ],
  },
  {
    id: 9,
    name: 'Mettā',
    englishName: 'Loving-kindness',
    shortDescription: 'Universal goodwill and compassion toward all beings.',
    fullDescription:
      'Metta is loving-kindness, the wish for the happiness and wellbeing of all beings without exception. It is an active love that seeks the welfare of others and responds to all situations with benevolence and compassion. Metta begins with kindness toward ourselves and extends outward to loved ones, neutral people, difficult people, and ultimately all living beings. This boundless love transforms our relationships and dissolves the barriers between ourselves and others.',
    story:
      'A village healer was renowned for treating everyone with equal kindness—the wealthy merchant and the beggar, the kind neighbor and the thief who once robbed her. When asked how she could treat her robber with such care, she explained: "I see each person as a child who has forgotten their true nature. Some remember it more easily than others, but all suffer when they forget. My kindness is not a reward for good behavior—it\'s a reminder of who they really are beneath their confusion." Years later, that thief became her most dedicated student, but not because she demanded change. Her unconditional metta was the mirror that showed him what he could become.',
    quote: {
      id: 'metta-1',
      text: 'Hatred does not cease by hatred, but only by love; this is the eternal rule.',
      author: 'Buddha',
      source: 'Dhammapada 5',
    },
    practices: [
      {
        id: 'metta-p1',
        title: 'Metta meditation',
        description: 'Spend 5 minutes sending loving wishes: "May I/you be happy, may I/you be healthy, may I/you be safe, may I/you live with ease."',
        difficulty: 'easy',
        context: 'personal',
      },
      {
        id: 'metta-p2',
        title: 'Act of kindness',
        description: 'Do something kind for someone, expecting nothing in return.',
        difficulty: 'easy',
        context: 'any',
      },
      {
        id: 'metta-p3',
        title: 'Loving-kindness for the difficult',
        description: 'Send genuine wishes of wellbeing to someone you find challenging.',
        difficulty: 'challenging',
        context: 'relationships',
      },
    ],
  },
  {
    id: 10,
    name: 'Upekkhā',
    englishName: 'Equanimity',
    shortDescription: 'Mental balance and even-mindedness in all circumstances.',
    fullDescription:
      'Upekkha is equanimity, the quality of mental balance and imperturbability. It is the ability to maintain inner peace and clear observation regardless of whether experiences are pleasant or unpleasant. Upekkha is not indifference or detachment from caring, but rather a balanced perspective that sees the bigger picture. With equanimity, we remain steady through life\'s ups and downs, responding with wisdom rather than being swept away by circumstances.',
    story:
      'A farmer\'s horse ran away. His neighbors said, "What terrible luck!" He replied, "Maybe." The next day, the horse returned with three wild horses. "What wonderful luck!" they exclaimed. He said, "Maybe." His son tried to tame one horse and broke his leg. "How awful!" they cried. "Maybe," he said. Then war came, and all young men were drafted—except his son, whose broken leg made him ineligible. "Such fortune!" they celebrated. Again, he simply said, "Maybe." His neighbors finally asked, "How can you be so unmoved by everything?" He smiled: "Life will rise and fall like waves. I cannot control the ocean, but I can learn to sail without capsizing at every change of wind. This is Upekkha—not caring less, but understanding more."',
    quote: {
      id: 'upekkha-1',
      text: 'In the confrontation between the stream and the rock, the stream always wins, not through strength but by perseverance.',
      author: 'Buddha',
    },
    practices: [
      {
        id: 'upekkha-p1',
        title: 'Observe without judgment',
        description: 'Notice your experiences today as simply "pleasant," "unpleasant," or "neutral" without adding stories.',
        difficulty: 'medium',
        context: 'personal',
      },
      {
        id: 'upekkha-p2',
        title: 'Accept what you cannot change',
        description: 'Identify one situation beyond your control and practice acceptance of it.',
        difficulty: 'medium',
        context: 'any',
      },
      {
        id: 'upekkha-p3',
        title: 'Balanced response to news',
        description: 'Whether you receive good or bad news today, notice your reaction and return to inner balance.',
        difficulty: 'challenging',
        context: 'any',
      },
    ],
  },
];

// Helper function to get Parami by ID
export const getParamiById = (id: number): Parami | undefined => {
  return PARAMIS.find((parami) => parami.id === id);
};
