# Content Generation Guide

This guide will help you generate expanded practices, quotes, and stories using Claude.ai for your Parami app.

## Overview

You'll use your personal Claude.ai subscription to generate batches of content, then paste them into the appropriate TypeScript files. This approach:
- Costs $0 (uses your existing subscription)
- Takes 30-60 minutes for initial generation
- Takes 30 minutes/month for refreshes
- Gives you full quality control

---

## Part 1: Generating Expanded Practices

### Goal
Create **20 practices per Parami** (200 total across 10 Paramis)

### Structure
Each practice needs:
- `id`: Unique identifier (e.g., "dana-exp1")
- `title`: 3-5 words
- `description`: 1-2 clear, actionable sentences
- `difficulty`: 'easy' | 'medium' | 'challenging'
- `context`: 'work' | 'home' | 'relationships' | 'personal' | 'any'

### Quality Guidelines

**Good practices are:**
- ✅ Specific and actionable ("Buy a stranger coffee")
- ✅ Varied in difficulty and context
- ✅ Authentic to Buddhist teachings
- ✅ Practical for modern life
- ✅ Clear and concise

**Avoid:**
- ❌ Vague suggestions ("Be more generous")
- ❌ Too complex or multi-step
- ❌ Requires special circumstances
- ❌ Judgmental language

### Claude.ai Prompts

Use these prompts with Claude.ai to generate content:

---

#### Prompt Template (Use for Each Parami)

```
Generate 20 unique practice suggestions for [PARAMI NAME] ([ENGLISH NAME]) from the Buddhist tradition.

Context: [PARAMI NAME] is about [SHORT DESCRIPTION - copy from paramis.ts]

For each practice, provide:
1. A unique ID in format: "[parami]-exp[number]" (e.g., "dana-exp1")
2. A title (3-5 words, action-oriented)
3. A description (1-2 sentences, specific and actionable)
4. Difficulty: easy, medium, or challenging
5. Context: work, home, relationships, personal, or any

Requirements:
- Mix of difficulty levels (30% easy, 50% medium, 20% challenging)
- Diverse contexts across all practices
- Each practice should be distinct and specific
- Authentic to Buddhist teachings but practical for modern life
- No vague or abstract suggestions

Format as TypeScript array:
[
  {
    id: 'dana-exp1',
    title: 'Buy a stranger coffee',
    description: 'Pay for the order of the person behind you in line without drawing attention to yourself.',
    difficulty: 'easy',
    context: 'any',
  },
  // ... more practices
]
```

---

### Example Completed Prompts

**For Dana (Generosity):**
```
Generate 20 unique practice suggestions for Dāna (Generosity) from the Buddhist tradition.

Context: Dana is about the practice of giving freely without expectation of return. It involves sharing our time, resources, knowledge, and compassion with others without attachment to outcomes.

[Include all requirements from template above]
```

**For Sila (Morality):**
```
Generate 20 unique practice suggestions for Sīla (Morality) from the Buddhist tradition.

Context: Sila is about ethical conduct and moral integrity, including mindful speech, action, and livelihood. It involves living in alignment with precepts and creating conditions for peace and trust.

[Include all requirements from template above]
```

---

### How to Use the Output

1. **Run the prompt** in Claude.ai for one Parami
2. **Review the output** - edit any practices that don't feel right
3. **Copy the array** Claude generates
4. **Paste into** `data/expandedPractices.ts` in the appropriate Parami section
5. **Repeat** for all 10 Paramis

Example of what to paste:
```typescript
  // Dana - Generosity (Parami ID: 1)
  1: [
    // PASTE CLAUDE'S OUTPUT HERE
    {
      id: 'dana-exp1',
      title: 'Buy a stranger coffee',
      description: 'Pay for the order...',
      difficulty: 'easy',
      context: 'any',
    },
    // ... more practices
  ],
```

---

## Part 2: Alternative Quotes (Optional Enhancement)

### Goal
Create **5 alternative quotes per Parami** for variety

### Claude.ai Prompt

```
Provide 5 Buddhist quotes about [PARAMI NAME] ([ENGLISH NAME]).

Include:
- Quotes from different sources (suttas, teachers, texts)
- Mix of traditional and contemporary teachers
- Each with proper attribution and source

Format as:
{
  id: '[parami]-quote[number]',
  text: 'The quote text',
  author: 'Author name',
  source: 'Book/Sutra name',
}
```

---

## Part 3: Alternative Stories (Optional Enhancement)

### Goal
Create **3 alternative teaching stories per Parami**

### Claude.ai Prompt

```
Write 3 teaching stories illustrating [PARAMI NAME] ([ENGLISH NAME]).

Requirements:
- Each story should be 150-250 words
- Include different styles: traditional Buddhist tale, modern parable, personal reflection
- Stories should illuminate the practice in different ways
- Appropriate for all audiences

Format as plain text strings.
```

---

## Difficulty Distribution Guide

Aim for this mix across your 20 practices:

**Easy (6 practices - 30%):**
- Can be done immediately
- Low time commitment (5-15 minutes)
- No special preparation needed
- Examples: "Hold the door for 3 people", "Send a thank you text"

**Medium (10 practices - 50%):**
- Requires some planning or discomfort
- Moderate time (15-60 minutes)
- May need stepping outside comfort zone
- Examples: "Volunteer for 2 hours", "Have a difficult conversation"

**Challenging (4 practices - 20%):**
- Significant commitment or difficulty
- Requires courage or sacrifice
- May take hours or ongoing effort
- Examples: "Forgive someone who hurt you", "Donate 10% of income"

---

## Context Distribution Guide

**Work:** Professional/career settings (4-5 practices)
**Home:** Domestic/family life (4-5 practices)
**Relationships:** Interpersonal connections (4-5 practices)
**Personal:** Individual growth/habits (4-5 practices)
**Any:** Applicable anywhere (2-3 practices)

---

## Quick Reference: All 10 Paramis

Use these as your prompts:

1. **Dāna** - Generosity: Giving freely without expectation
2. **Sīla** - Morality: Ethical conduct and integrity
3. **Nekkhamma** - Renunciation: Letting go of attachments
4. **Paññā** - Wisdom: Seeing things as they truly are
5. **Viriya** - Energy: Persistent effort and diligence
6. **Khanti** - Patience: Endurance without aversion
7. **Sacca** - Truthfulness: Honesty and authenticity
8. **Adhiṭṭhāna** - Determination: Resolve and commitment
9. **Mettā** - Loving-kindness: Unconditional goodwill
10. **Upekkhā** - Equanimity: Balance and non-reactivity

---

## Estimated Time

**Initial generation (all 10 Paramis):**
- 5-10 minutes per Parami × 10 = 50-100 minutes
- Add 30 minutes for review/editing
- **Total: 90-130 minutes**

**Monthly refresh (3 Paramis):**
- 5-10 minutes per Parami × 3 = 15-30 minutes
- **Total: 15-30 minutes/month**

---

## Tips for Best Results

1. **Generate one Parami at a time** - easier to maintain quality
2. **Review and edit** - Claude's output is good but not perfect
3. **Test as you go** - add a few practices and test in the app
4. **Keep notes** - track which prompts worked best
5. **Iterate** - regenerate if output doesn't match your vision

---

## Need Help?

If Claude's output isn't quite right, try:
- Adding more specific examples to your prompt
- Being more explicit about tone and style
- Providing a "good vs bad" example
- Breaking the task into smaller chunks (10 at a time)

---

## Next Steps

1. Start with one Parami (recommend Dāna since examples are provided)
2. Generate 20 practices using Claude.ai
3. Paste into `data/expandedPractices.ts`
4. Test in the app by swiping through practices
5. Repeat for remaining Paramis
6. (Optional) Generate alternative quotes and stories

**Happy generating!** 🙏
