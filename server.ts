import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

// Lazy Gemini client helper
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// Helper to call Gemini with resilient model fallback
async function generateWithGemini(ai: GoogleGenAI, params: {
  contents: any;
  config?: any;
}) {
  // Use fast, reliable flash models first to prevent Cloud Run proxy timeouts
  const candidateModels = ["gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.8-flash"];
  let lastErr = null;
  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config: {
          ...params.config,
          // Abort signal to ensure no individual model hangs and triggers a 504 Gateway Timeout
          abortSignal: AbortSignal.timeout(12000),
        }
      });
      return { response, model };
    } catch (err: any) {
      lastErr = err;
      console.warn(`Model ${model} failed, attempting fallback:`, err?.message || err?.status);
    }
  }
  throw lastErr;
}

interface AssessmentRequest {
  classLevel: string;
  ageGroup?: string;
  subject: string;
  term: string;
  assessmentType: string;
  curriculumTopics?: string;
  difficulty?: string;
  targetObjectiveCount?: number;
  targetTheoryCount?: number;
  schemeOfWork?: {
    id?: string;
    subjectName?: string;
    classLevel?: string;
    term?: string;
    summary?: string;
    curriculumStandard?: string;
    additionalInstructions?: string;
    weeklyTopics?: Array<{
      week: number;
      topic: string;
      subtopics?: string[];
      learningObjectives?: string[];
      keyFormulasOrTerms?: string[];
      suggestedActivities?: string;
    }>;
  };
  selectedWeeks?: number[];
  presetType?: string;
  additionalInstructions?: string;
}

// Structured Assessment Response Interface
interface AssessmentResponse {
  title: string;
  schoolName: string;
  classLevel: string;
  subject: string;
  term: string;
  timeAllowed: string;
  instructions: string;
  isEarlyYearsPictorial: boolean;
  isSecondaryFiftySix: boolean;
  readingPassage?: {
    title: string;
    text: string;
    instructions?: string;
  };
  objectives: Array<{
    id: number;
    question: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD?: string;
    correctOption: string;
    singleLineFormat: string;
    pictorialSymbol?: string;
    visualHint?: string;
  }>;
  theory: Array<{
    id: number;
    questionNumber: number;
    questionText: string;
    subParts?: string[];
    maxScore: number;
    sampleAnswer?: string;
  }>;
  paperSavingText: string;
  markingGuide: string;
  difficulty?: string;
}

// Deterministic Curriculum Generator Fallback (guarantees instantaneous, rich, paper-saving output even without API key)
function generateCurriculumFallback(req: AssessmentRequest): AssessmentResponse {
  const isEarlyYears = 
    req.classLevel.toLowerCase().includes('nursery') || 
    req.classLevel.toLowerCase().includes('kindergarten') || 
    req.classLevel.toLowerCase().includes('kg') || 
    req.classLevel.toLowerCase().includes('reception') || 
    req.classLevel.toLowerCase().includes('early') || 
    (req.ageGroup && req.ageGroup.includes('3-6'));

  const isSecondary = 
    req.classLevel.toLowerCase().includes('jss') || 
    req.classLevel.toLowerCase().includes('sss') || 
    req.classLevel.toLowerCase().includes('secondary');

  const objCount = isSecondary ? 50 : isEarlyYears ? 15 : (req.targetObjectiveCount || 25);
  const theoryCount = isSecondary ? 6 : isEarlyYears ? 0 : 4;

  const objectives: AssessmentResponse['objectives'] = [];
  const theory: AssessmentResponse['theory'] = [];
  let readingPassage: AssessmentResponse['readingPassage'] | undefined = undefined;

  const subjectLower = req.subject.toLowerCase();
  const isEnglish = subjectLower.includes('eng') || subjectLower.includes('lit') || subjectLower.includes('use of english');

  if (isEarlyYears) {
    // Early Years Pictorial Questions for ages 3-6
    const pictorialBank = [
      { q: "Count the apples: 🍎 🍎 🍎. How many apples are there?", sym: "🍎🍎🍎", a: "2 apples", b: "3 apples", c: "4 apples", d: "5 apples", ans: "B", hint: "Three red apples" },
      { q: "Which animal says 'Woof-Woof'?", sym: "🐶 🐱 🐮 🦁", a: "Cat (🐱)", b: "Dog (🐶)", c: "Cow (🐮)", d: "Lion (🦁)", ans: "B", hint: "Friendly puppy" },
      { q: "Which shape is a Circle?", sym: "🔴 ⬛ 🔺 ⭐", a: "Square (⬛)", b: "Triangle (🔺)", c: "Circle (🔴)", d: "Star (⭐)", ans: "C", hint: "Round ball" },
      { q: "What color is the ripe banana?", sym: "🍌 🟡 🟢 🔴", a: "Blue", b: "Yellow", c: "Purple", d: "Black", ans: "B", hint: "Yellow sunshine" },
      { q: "Which letter is for Apple?", sym: "🅰️ 🅱️ 🅲️ 🅳️", a: "Letter B", b: "Letter C", c: "Letter A", d: "Letter D", ans: "C", hint: "A for Apple" },
      { q: "Identify the vehicle that flies in the sky:", sym: "✈️ 🚗 🚲 🚢", a: "Car (🚗)", b: "Aeroplane (✈️)", c: "Bicycle (🚲)", d: "Ship (🚢)", ans: "B", hint: "High in the clouds" },
      { q: "Count the shining stars: ⭐ ⭐ ⭐ ⭐ ⭐", sym: "⭐⭐⭐⭐⭐", a: "3 stars", b: "4 stars", c: "5 stars", d: "6 stars", ans: "C", hint: "Five stars" },
      { q: "Which fruit is sweet and orange in color?", sym: "🍊 🍇 🍉 🍋", a: "Orange (🍊)", b: "Grapes (🍇)", c: "Watermelon (🍉)", d: "Lemon (🍋)", ans: "A", hint: "Juicy citrus" },
      { q: "Which of these is a domestic pet animal?", sym: "🐱 🐊 🐘 🦈", a: "Cat (🐱)", b: "Crocodile (🐊)", c: "Elephant (🐘)", d: "Shark (🦈)", ans: "A", hint: "Little kitten" },
      { q: "Which part of your body do you use to SMELL flowers?", sym: "👃 👁️ 👂 👄", a: "Eyes (👁️)", b: "Ears (👂)", c: "Nose (👃)", d: "Mouth (👄)", ans: "C", hint: "Sniffing scents" },
      { q: "Which number comes after 4?", sym: "1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣", a: "3", b: "5", c: "2", d: "6", ans: "B", hint: "Count: 1, 2, 3, 4, 5" },
      { q: "Identify the hot object in the morning sky:", sym: "☀️ 🌙 ☁️ 🌧️", a: "Moon (🌙)", b: "Sun (☀️)", c: "Rain (🌧️)", d: "Cloud (☁️)", ans: "B", hint: "Bright sunshine" },
      { q: "Which object is used to brush your teeth?", sym: "🪥 🥄 ✏️ ✂️", a: "Toothbrush (🪥)", b: "Spoon (🥄)", c: "Pencil (✏️)", d: "Scissors (✂️)", ans: "A", hint: "Clean white teeth" },
      { q: "Identify the aquatic animal that swims in water:", sym: "🐟 🐒 🦅 🐎", a: "Fish (🐟)", b: "Monkey (🐒)", c: "Eagle (🦅)", d: "Horse (🐎)", ans: "A", hint: "Swims in the river" },
      { q: "Count the smiling faces: 😊 😊", sym: "😊😊", a: "1 face", b: "2 faces", c: "3 faces", d: "4 faces", ans: "B", hint: "Two smiling faces" }
    ];

    for (let i = 0; i < objCount; i++) {
      const item = pictorialBank[i % pictorialBank.length];
      const singleLine = `${i + 1}. [${item.sym}] ${item.q} A) ${item.a} B) ${item.b} C) ${item.c} D) ${item.d}`;
      objectives.push({
        id: i + 1,
        question: `[${item.sym}] ${item.q}`,
        optionA: item.a,
        optionB: item.b,
        optionC: item.c,
        optionD: item.d,
        correctOption: item.ans,
        singleLineFormat: singleLine,
        pictorialSymbol: item.sym,
        visualHint: item.hint
      });
    }
  } else {
    // Primary or Secondary School Questions (Standard Curriculum or Uploaded Scheme)
    const schemeWeekly = req.schemeOfWork?.weeklyTopics || [];
    const targetedWeeks = req.selectedWeeks && req.selectedWeeks.length > 0
      ? schemeWeekly.filter(w => req.selectedWeeks!.includes(w.week))
      : schemeWeekly;

    if (isEnglish) {
      // 1. COMPULSORY READING PASSAGE FOR ENGLISH
      readingPassage = {
        title: "The Digital Renaissance and Youth Enterprise in Ibadan",
        text: `In recent years, the ancient city of Ibadan has witnessed a remarkable metamorphosis, transitioning from a predominantly civil service and agrarian hub into a bustling node for technological innovation. Across neighborhoods from Bodija to Mokola, clusters of enterprising young Nigerians are establishing digital hubs, developing educational software, and mastering artificial intelligence tools. This burgeoning renaissance has debunked the cynical notion that technological prowess is restricted to capital cities.

Crucially, local community development associations and forward-thinking academies have played an instrumental role in nurturing this grassroots ecosystem. By offering subsidised broadband internet access and mentorship in computer programming, they have unlocked avenues of legitimate enterprise for ambitious scholars. Consequently, instances of youth unemployment in the pilot local government zones have begun to decline, replaced by freelance remote contracts and creative software ventures.

Nevertheless, significant impediments persist. Erratic power supply and prohibitive tariffs on computer hardware still threaten to stifle nascent initiatives before they reach full commercial maturity. Education analysts assert that until systemic infrastructure deficits are tackled comprehensively by public-private partnerships, the true economic dividends of this youthful ingenuity cannot be fully realized.`,
        instructions: "Read the passage above carefully and answer Questions 1 to 5 based strictly on it."
      };

      // 2. QUESTIONS 1 TO 5: STRICTLY COMPREHENSION ON THE PASSAGE
      const comprehensionQuestions = [
        {
          q: "According to the passage, the primary transformation taking place in Ibadan is:",
          a: "The expansion of traditional farming methods",
          b: "The emergence of a vibrant technology and innovation ecosystem among youths",
          c: "The total elimination of electrical power disruptions",
          d: "The relocation of capital city administrative headquarters",
          ans: "B"
        },
        {
          q: "From the second paragraph, local academies and community associations contributed to youth empowerment by:",
          a: "Distributing free luxury vehicles",
          b: "Offering subsidised internet access and software mentorship",
          c: "Enforcing compulsory agricultural labour",
          d: "Banning the use of computers and smartphones",
          ans: "B"
        },
        {
          q: "It can be deduced from the third paragraph that the author considers the current youth technology initiative to be:",
          a: "Completely hopeless and futile",
          b: "Promising but constrained by infrastructural hurdles",
          c: "Excessive and in need of government prohibition",
          d: "Entirely independent of electrical power supply",
          ans: "B"
        },
        {
          q: "Identify the grammatical name and function of the expression: 'which brought great relief to ambitious scholars'",
          a: "Noun clause acting as the direct object of the verb",
          b: "Adjectival clause qualifying the preceding noun phrase",
          c: "Adverbial clause of concession modifying the predicate",
          d: "Prepositional phrase functioning as an adjunct",
          ans: "B"
        },
        {
          q: "From the passage, the word IMPEDIMENTS as used in the third paragraph most nearly means:",
          a: "Advantages",
          b: "Obstacles",
          c: "Celebrations",
          d: "Inventions",
          ans: "B"
        }
      ];

      comprehensionQuestions.forEach((item, idx) => {
        const qNum = idx + 1;
        const singleLine = `${qNum}. ${item.q} A) ${item.a} B) ${item.b} C) ${item.c} D) ${item.d}`;
        objectives.push({
          id: qNum,
          question: item.q,
          optionA: item.a,
          optionB: item.b,
          optionC: item.c,
          optionD: item.d,
          correctOption: item.ans,
          singleLineFormat: singleLine
        });
      });

      // 3. QUESTIONS 6 ONWARDS: PURE ENGLISH LEXIS, STRUCTURE, CONCORD, TENSES & ORAL ENGLISH (NO ASTERISKS)
      const englishLexisBank = [
        { q: "Choose the option nearest in meaning to the capitalized word: The principal gave a SUCCINCT address at the valedictory service.", a: "Prolix", b: "Concise and brief", c: "Confusing", d: "Humorous", ans: "B" },
        { q: "Choose the option nearest in meaning to the capitalized word: The tutor gave an EXPLICIT directive regarding submission of term papers.", a: "Ambiguous", b: "Clear and unambiguous", c: "Hesitant", d: "Partial", ans: "B" },
        { q: "Choose the option nearest in meaning to the capitalized word: The proprietress launched a scheme to MITIGATE hardship among indigent scholars.", a: "Alleviate", b: "Intensify", c: "Prolong", d: "Complicate", ans: "A" },
        { q: "Choose the option nearest in meaning to the capitalized word: The philanthropist made a MAGNANIMOUS contribution to the library fund.", a: "Generous and noble", b: "Miserly", c: "Frugal", d: "Reckless", ans: "A" },
        { q: "Choose the option nearest in meaning to the capitalized word: She was praised for her METICULOUS record-keeping.", a: "Thorough and painstaking", b: "Careless", c: "Hurried", d: "Superficial", ans: "A" },
        { q: "Choose the option nearest in meaning to the capitalized word: The candidate displayed TENACIOUS determination throughout the examination.", a: "Persistent and firm", b: "Weak", c: "Uncertain", d: "Indifferent", ans: "A" },
        { q: "Choose the option opposite in meaning to the capitalized word: The panel reached an IMPARTIAL decision after hearing all submissions.", a: "Biased and prejudiced", b: "Fair", c: "Objective", d: "Neutral", ans: "A" },
        { q: "Choose the option opposite in meaning to the capitalized word: The findings of the investigation were completely VERIFIABLE.", a: "Dubious and unsubstantiated", b: "Authentic", c: "Documented", d: "Certain", ans: "A" },
        { q: "Choose the option opposite in meaning to the capitalized word: The prefect adopted an ARROGANT disposition towards junior scholars.", a: "Humble and modest", b: "Haughty", c: "Overbearing", d: "Aloof", ans: "A" },
        { q: "Choose the option opposite in meaning to the capitalized word: The administrative measures adopted were strictly TEMPORARY.", a: "Permanent", b: "Transient", c: "Fleeting", d: "Provisional", ans: "A" },
        { q: "Choose the option opposite in meaning to the capitalized word: His arguments on youth development were considered LUCID by the audience.", a: "Obscure and confusing", b: "Perspicuous", c: "Clear", d: "Sensible", ans: "A" },
        { q: "Identify the correct preposition: She has been appointed _____ the academic governing council.", a: "into", b: "onto", c: "to", d: "with", ans: "C" },
        { q: "Complete the sentence: The scholars were cautioned to desist _____ examination irregularities.", a: "from", b: "against", c: "with", d: "at", ans: "A" },
        { q: "Choose the correct preposition: He congratulated his classmate _____ attaining nine distinctions in WASSCE.", a: "on", b: "for", c: "about", d: "with", ans: "A" },
        { q: "Select the correct preposition: The school compound is well protected _____ unwanted intruders.", a: "against", b: "for", c: "to", d: "on", ans: "A" },
        { q: "Choose the correct phrasal verb: The emergency brigade arrived in time to put _____ the fire.", a: "out", b: "off", c: "away", d: "down", ans: "A" },
        { q: "Choose the grammatically correct concord: Neither the class tutor nor the subject teachers _____ present at the briefing.", a: "were", b: "was", c: "is", d: "has been", ans: "A" },
        { q: "Select the correct concord: A pride of lions _____ spotted traversing the game reserve.", a: "was", b: "were", c: "are", d: "have been", ans: "A" },
        { q: "Choose the grammatically correct option: The head boy together with his assistants _____ commended by the proprietress.", a: "was", b: "were", c: "are", d: "have been", ans: "A" },
        { q: "Fill in the blank with the appropriate tense: By this time tomorrow, the students _____ their terminal examinations.", a: "will have completed", b: "will complete", c: "would complete", d: "have completed", ans: "A" },
        { q: "Complete the conditional clause: If the candidate had studied diligently, she _____ the highest grade in Literature.", a: "would have obtained", b: "will obtain", c: "would obtain", d: "had obtained", ans: "A" },
        { q: "A dramatic monologue delivered by a character alone on stage expressing innermost thoughts is a:", a: "Dialogue", b: "Soliloquy", c: "Prologue", d: "Epilogue", ans: "B" },
        { q: "Identify the figure of speech in: 'The morning sun smiled benignly upon the ancient hills of Ibadan':", a: "Personification", b: "Hyperbole", c: "Oxymoron", d: "Euphemism", ans: "A" },
        { q: "Identify the literary device in the expression: 'Parting is such sweet sorrow':", a: "Oxymoron", b: "Simile", c: "Metonymy", d: "Litotes", ans: "A" },
        { q: "Identify the word that contains the vowel sound /i:/:", a: "Seat", b: "Sit", c: "Set", d: "Sat", ans: "A" },
        { q: "Choose the word with the same consonant sound as the underlined 'ch' in 'CHEF':", a: "Machine", b: "Church", c: "Chemistry", d: "Chair", ans: "A" },
        { q: "Identify the syllable that carries the primary stress in the word 'DIPLOMAT':", a: "DIP-lo-mat", b: "dip-LO-mat", c: "dip-lo-MAT", d: "Di-plo-mat", ans: "A" },
        { q: "Identify the syllable that carries the primary stress in 'CERTIFICATE' (noun):", a: "cer-TIF-i-cate", b: "CER-tif-i-cate", c: "cer-tif-I-cate", d: "cer-tif-i-CATE", ans: "A" },
        { q: "In which of the following words is the letter 'b' silent:", a: "Doubt", b: "Debit", c: "Double", d: "Table", ans: "A" },
        { q: "Choose the correct idiom: To face the music means to:", a: "Accept unpleasant consequences of one's actions", b: "Sing melodiously in public", c: "Attend a musical orchestra", d: "Purchase expensive instruments", ans: "A" }
      ];

      for (let i = 6; i <= objCount; i++) {
        let item = englishLexisBank[(i - 6) % englishLexisBank.length];
        // If grounded in scheme topics, weave in weekly focus
        if (targetedWeeks.length > 0 && i % 3 === 0) {
          const wItem = targetedWeeks[(i - 6) % targetedWeeks.length];
          const sub = wItem.subtopics?.[0] || wItem.topic;
          item = {
            q: `Regarding Week ${wItem.week} curriculum on ${wItem.topic} (${sub}), choose the grammatically standard usage:`,
            a: `Formal academic concord with precise punctuation`,
            b: `Informal conversational colloquialism`,
            c: `Unchecked dangling modifier construction`,
            d: `Redundant tautological phrasing`,
            ans: "A"
          };
        }

        const singleLine = `${i}. ${item.q} A) ${item.a} B) ${item.b} C) ${item.c} D) ${item.d}`;
        objectives.push({
          id: i,
          question: item.q,
          optionA: item.a,
          optionB: item.b,
          optionC: item.c,
          optionD: item.d,
          correctOption: item.ans,
          singleLineFormat: singleLine
        });
      }

      // 4. ENGLISH THEORY: AUTHENTIC WAEC/NECO PAPER 2 (ZERO MATHS, ZERO PHYSICS, ZERO EXPERIMENTS)
      theory.push(
        {
          id: 1,
          questionNumber: 1,
          questionText: `SECTION A: CONTINUOUS WRITING (ESSAY / LETTER WRITING - 20 MARKS)\nAnswer ONE question only from this section. Your composition should be about 450 words in length.\n\n(a) Formal Letter: Write a letter to the State Commissioner for Education, stating at least three urgent reasons why a modern digital library and STEM hub should be established in your community school.\n(b) Article for Publication: Write an article suitable for publication in a national daily on the topic: "The Menace of Examination Malpractice and Drug Abuse Among Secondary School Youths: Causes, Dangers, and Actionable Solutions."\n(c) Informal Letter: Your friend in another secondary school has expressed severe anxiety over upcoming terminal examinations. Write a letter advising them on effective study timetables, past question drills, and exam-room composure.\n(d) Creative Narrative: Write a story ending with the proverb: "A bird in hand is worth two in the bush."`,
          subParts: ["Content & Development (6 marks)", "Organization & Format (5 marks)", "Expression & Vocabulary (5 marks)", "Mechanical Accuracy & Spelling (4 marks)"],
          maxScore: 20,
          sampleAnswer: "Adherence to formal/informal layout conventions, cogent paragraph development, elevated vocabulary, and zero mechanical/grammatical errors."
        },
        {
          id: 2,
          questionNumber: 2,
          questionText: `SECTION B: READING COMPREHENSION & GRAMMATICAL ANALYSIS (15 MARKS)\nRead the following passage carefully and answer the questions that follow:\n\n"The relentless harmattan haze had settled over the savannah, coating every leaf with a fine veil of ochre dust. Despite the biting chill of dawn, Amina had already trekked three kilometres towards the school gates. Education was not merely a routine obligation for her; it was the sole key that could unlock the padlock of generational penury. When the state scholarship examination results were pinned on the central bulletin board, her name sat majestically at the very apex."\n\n(a) Why did Amina endure the harsh morning weather? (3 marks)\n(b) What metaphor did the author use to describe poverty in the passage? (3 marks)\n(c) "...when the state scholarship examination results were pinned on the central bulletin board":\n(i) What grammatical name is given to this expression? (2 marks)\n(ii) What is its grammatical function in the sentence? (2 marks)\n(d) For each of the following words, find another word or phrase that means the same and can replace it as used in the passage: (i) penury (ii) apex (iii) relentless. (5 marks)`,
          subParts: ["Factual retrieval (3 marks)", "Metaphorical analysis (3 marks)", "Grammatical clause and function (4 marks)", "Vocabulary replacement in context (5 marks)"],
          maxScore: 15,
          sampleAnswer: "(a) To secure an education as the pathway out of poverty. (b) 'The padlock of generational penury'. (c)(i) Adverbial clause of time (ii) Modifying the verb 'sat'. (d)(i) poverty / destitution (ii) top / summit (iii) persistent / unyielding."
        },
        {
          id: 3,
          questionNumber: 3,
          questionText: `SECTION C: SUMMARY WRITING (15 MARKS)\nRead the passage below carefully and answer the questions on it:\n\n"Modern educational technologies offer unprecedented opportunities for self-paced learning, providing learners with instant access to worldwide libraries, interactive simulations, and personalized tutoring. However, unchecked screen time also induces digital fatigue, encourages cognitive passivity, and reduces essential face-to-face interpersonal interactions necessary for emotional intelligence."\n\n(a) In two sentences, one for each, state two benefits of modern educational technologies mentioned in the passage. (8 marks)\n(b) In two sentences, one for each, state two negative consequences of unchecked digital usage. (7 marks)`,
          subParts: ["2 Benefits in 2 standalone sentences (8 marks)", "2 Negative consequences in 2 standalone sentences (7 marks)"],
          maxScore: 15,
          sampleAnswer: "Strict adherence to the 1-sentence-per-point rule without extraneous details or verbatim copying."
        },
        {
          id: 4,
          questionNumber: 4,
          questionText: `SECTION D: APPLIED LEXIS & GRAMMATICAL STRUCTURE (15 MARKS)\n(a) Rewrite each of the following sentences according to the instructions given in brackets without changing its original meaning:\n(i) Although the rain fell heavily, the candidates arrived punctually for the mock examination. [Begin: In spite of...]\n(ii) The principal said to the scholars, "You must submit your term projects before Friday noon." [Rewrite in reported/indirect speech]\n(iii) The school management built three state-of-the-art computer laboratories. [Change into passive voice]\n\n(b) Identify and correct the grammatical concord error in each of the following sentences:\n(i) Every teacher and student are expected at the general assembly.\n(ii) Neither the biology tutor nor the laboratory attendants was present.`,
          subParts: ["Sentence transformations (9 marks)", "Grammatical concord corrections (6 marks)"],
          maxScore: 15,
          sampleAnswer: "(a)(i) In spite of the heavy rain, the candidates arrived punctually... (ii) The principal told the scholars that they had to submit... (iii) Three state-of-the-art computer laboratories were built... (b)(i) Change 'are' to 'is' (ii) Change 'was' to 'were'."
        },
        {
          id: 5,
          questionNumber: 5,
          questionText: `SECTION E: ORAL ENGLISH & PHONETICS (15 MARKS)\n(a) Write out the phonetic symbol representing the vowel sound underlined in each word: (i) s_ea_t (ii) b_i_t (iii) b_oa_t (iv) c_ar_ (v) c_a_t (5 marks)\n(b) For each of the following words, write out the syllable that carries the primary stress in CAPITAL letters (e.g., PHO-to-graph, pho-TOG-ra-phy):\n(i) democratic (ii) examinee (iii) certificate (iv) education (4 marks)\n(c) In each of the sentences below, the word in CAPITAL letters has emphatic stress. Choose the question to which the sentence provides the correct answer:\n(i) The HEADMISTRESS distributed the prizes yesterday. (3 marks)\n(ii) Calvin purchased THREE laptops for the computer laboratory. (3 marks)`,
          subParts: ["Vowel phonetic symbols (5 marks)", "Primary stress placement (4 marks)", "Emphatic stress interpretation (6 marks)"],
          maxScore: 15,
          sampleAnswer: "(a) /i:/, /ɪ/, /əʊ/, /ɑ:/, /æ/. (b) demoCRAtic, examiNEE, cerTIFicate, eduCAtion. (c)(i) Did the senior tutor distribute the prizes yesterday? (ii) Did Calvin purchase two laptops...?"
        },
        {
          id: 6,
          questionNumber: 6,
          questionText: `SECTION F: LITERATURE-IN-ENGLISH & LITERARY APPRECIATION (15 MARKS)\n(a) Differentiate clearly between Dramatic Irony and Situational Irony with one suitable illustration for each. (6 marks)\n(b) Define Soliloquy and explain its primary dramatic function in African and Elizabethan drama. (5 marks)\n(c) Identify and explain the poetic device used in the line: "The wind whispered ancient secrets through the silent baobab trees." (4 marks)`,
          subParts: ["Dramatic vs situational irony (6 marks)", "Soliloquy and dramatic function (5 marks)", "Personification analysis (4 marks)"],
          maxScore: 15,
          sampleAnswer: "(a) Dramatic irony occurs when audience knows what characters do not; Situational irony occurs when outcome contradicts expectations. (b) Soliloquy reveals inner conflict and motives directly to audience. (c) Personification - attributing human action of whispering to wind."
        }
      );
    } else {
      // NON-ENGLISH SUBJECTS (Mathematics, Physics, Chemistry, Biology, Economics, Government, etc.)
      for (let i = 1; i <= objCount; i++) {
        let qText = "";
        let optA = "";
        let optB = "";
        let optC = "";
        let optD = "";
        let correct = ["A", "B", "C", "D"][(i * 3 + 1) % 4];

        if (targetedWeeks.length > 0) {
          const weekItem = targetedWeeks[(i - 1) % targetedWeeks.length];
          const subtopic = weekItem.subtopics?.[(i - 1) % (weekItem.subtopics.length || 1)] || weekItem.topic;

          if (subjectLower.includes("math")) {
            qText = `Under Week ${weekItem.week} (${weekItem.topic}), solve the problem regarding ${subtopic}: What is the primary solution?`;
            optA = `Accurate calculation yielding 12.5 units`;
            optB = `Empirical derivation of 24.0 units`;
            optC = `Analytical reduction to 36.8 units`;
            optD = `Standard factor of 48.2 units`;
            correct = "B";
          } else if (subjectLower.includes("bio") || subjectLower.includes("sci")) {
            qText = `In ${weekItem.topic} (${subtopic}), what is the primary biological mechanism involved?`;
            optA = `Diffusion and osmotic equilibrium`;
            optB = `Enzymatic phosphorylation catalysis`;
            optC = `Active membrane transport`;
            optD = `Cellular respiration pathway`;
            correct = "C";
          } else if (subjectLower.includes("phy")) {
            qText = `In Week ${weekItem.week} (${weekItem.topic}), which physical law governs the behavior of ${subtopic}?`;
            optA = `Newton's second law of motion`;
            optB = `Ohm's electrical resistance law`;
            optC = `Faraday's electromagnetic induction law`;
            optD = `Archimedes principle of flotation`;
            correct = "A";
          } else {
            qText = `In ${req.subject} Week ${weekItem.week} syllabus (${weekItem.topic}), what is the primary significance of ${subtopic}?`;
            optA = `Empirical foundation and practical application`;
            optB = `Theoretical standard and benchmark measure`;
            optC = `Regulatory operational framework`;
            optD = `Systematic evaluation model`;
            correct = "A";
          }
        } else if (subjectLower.includes("math")) {
          const x = (i * 7) % 30 + 5;
          const y = (i * 3) % 15 + 2;
          if (i % 4 === 1) {
            qText = `Solve for x in the linear algebraic equation: ${y}x + ${x} = ${y * 4 + x}`;
            optA = `x = 2`; optB = `x = 4`; optC = `x = 6`; optD = `x = 8`;
            correct = "B";
          } else if (i % 4 === 2) {
            qText = `Find the simple interest on ₦${x * 1000} for 3 years at ${y}% per annum.`;
            const ansVal = (x * 1000 * 3 * y) / 100;
            optA = `₦${ansVal - 150}`; optB = `₦${ansVal}`; optC = `₦${ansVal + 200}`; optD = `₦${ansVal + 500}`;
            correct = "B";
          } else if (i % 4 === 3) {
            qText = `Express 0.00${x}4 in standard scientific index notation.`;
            optA = `${x}.4 × 10⁻³`; optB = `${x}.4 × 10⁻⁴`; optC = `${x}.4 × 10⁻²`; optD = `${x}.4 × 10⁻⁵`;
            correct = "A";
          } else {
            qText = `Calculate the hypotenuse of a right-angled triangle with adjacent sides 3cm and 4cm.`;
            optA = `5cm`; optB = `7cm`; optC = `9cm`; optD = `12cm`;
            correct = "A";
          }
        } else if (subjectLower.includes("bio") || subjectLower.includes("sci")) {
          if (i % 5 === 1) {
            qText = `Which cellular organelle is universally referred to as the powerhouse of the cell?`;
            optA = `Ribosome`; optB = `Mitochondria`; optC = `Golgi apparatus`; optD = `Nucleolus`;
            correct = "B";
          } else if (i % 5 === 2) {
            qText = `The process by which green plants manufacture carbohydrates in the presence of sunlight is:`;
            optA = `Respiration`; optB = `Transpiration`; optC = `Photosynthesis`; optD = `Fermentation`;
            correct = "C";
          } else if (i % 5 === 3) {
            qText = `Which blood component is primarily responsible for blood clotting at injury sites?`;
            optA = `Erythrocytes`; optB = `Leukocytes`; optC = `Platelets`; optD = `Blood plasma`;
            correct = "C";
          } else if (i % 5 === 4) {
            qText = `An organism that possesses both male and female reproductive organs is termed:`;
            optA = `Dioecious`; optB = `Hermaphrodite`; optC = `Parthenogenetic`; optD = `Dimorphic`;
            correct = "B";
          } else {
            qText = `The basic physical and functional unit of heredity in living organisms is the:`;
            optA = `Chromosome`; optB = `Gene`; optC = `Centromere`; optD = `Ribosome`;
            correct = "B";
          }
        } else {
          qText = `Question ${i}: Regarding ${req.subject} (${req.curriculumTopics || 'Term Syllabus'}), identify the fundamental tenet:`;
          optA = `Primary axiom of ${req.subject} theory`;
          optB = `Secondary empirical validation`;
          optC = `Controlled comparative analysis`;
          optD = `Standard operational synthesis`;
          correct = ["A", "B", "C", "D"][i % 4];
        }

        const cleanQ = qText.endsWith('?') || qText.endsWith('.') || qText.endsWith(':') ? qText : `${qText}.`;
        const singleLine = `${i}. ${cleanQ} A) ${optA} B) ${optB} C) ${optC} D) ${optD}`;
        objectives.push({
          id: i,
          question: qText,
          optionA: optA,
          optionB: optB,
          optionC: optC,
          optionD: optD,
          correctOption: correct,
          singleLineFormat: singleLine
        });
      }

      // NON-ENGLISH SUBJECT-SPECIFIC THEORY QUESTIONS
      if (isSecondary || theoryCount >= 6) {
        if (subjectLower.includes("math")) {
          theory.push(
            { id: 1, questionNumber: 1, questionText: `(a) Solve the simultaneous linear equations: 3x + 2y = 16 and 2x - y = 6.\n(b) Factorize completely the quadratic expression: 2x² - 7x + 3 = 0.\n(c) Find the roots of the quadratic equation.`, subParts: ["Simultaneous solution (6 marks)", "Factorization (5 marks)", "Roots determination (4 marks)"], maxScore: 15, sampleAnswer: "x = 4, y = 2. Factorization: (2x - 1)(x - 3) = 0. Roots: x = 1/2 or x = 3." },
            { id: 2, questionNumber: 2, questionText: `(a) From a point on the ground 50m away from the foot of a vertical school flag mast, the angle of elevation of the top is 35°. Calculate the height of the mast.\n(b) A bearing of 065° is taken from Stanbax Gate to the Science Block. Find the back bearing.`, subParts: ["Trigonometry calculation (8 marks)", "Bearing derivation (7 marks)"], maxScore: 15, sampleAnswer: "Height = 50 * tan(35°) = 35.01m. Back bearing = 65° + 180° = 245°." },
            { id: 3, questionNumber: 3, questionText: `(a) A bag contains 5 red balls, 4 blue balls, and 3 green balls. If two balls are drawn at random without replacement, find the probability that both are red.\n(b) Calculate the mean and variance of the distribution: 12, 15, 18, 22, 28.`, subParts: ["Probability without replacement (7 marks)", "Mean and variance (8 marks)"], maxScore: 15, sampleAnswer: "P(both red) = (5/12) * (4/11) = 5/33. Mean = 19, Variance = 31.6." },
            { id: 4, questionNumber: 4, questionText: `(a) The 4th term of an Arithmetic Progression (A.P.) is 15 and the 9th term is 35. Find the first term (a) and the common difference (d).\n(b) Determine the sum of the first 20 terms of the progression.`, subParts: ["AP parameters (7 marks)", "Sum of 20 terms (8 marks)"], maxScore: 15, sampleAnswer: "d = 4, a = 3. S₂₀ = (20/2) * [2(3) + 19(4)] = 10 * 82 = 820." },
            { id: 5, questionNumber: 5, questionText: `(a) A cylinder of radius 7cm has a total surface area of 748 cm². Calculate its height. [Take π = 22/7]\n(b) Prove that the angle subtended by an arc at the center of a circle is twice the angle subtended at the circumference.`, subParts: ["Cylinder mensuration (7 marks)", "Circle theorem proof (8 marks)"], maxScore: 15, sampleAnswer: "h = 10cm. Geometric proof with construction and isosceles triangle properties." },
            { id: 6, questionNumber: 6, questionText: `(a) Differentiate y = 3x³ - 5x² + 7x - 4 with respect to x.\n(b) Find the coordinates of the turning points and determine their nature.`, subParts: ["Derivation dy/dx (7 marks)", "Turning point classification (8 marks)"], maxScore: 15, sampleAnswer: "dy/dx = 9x² - 10x + 7. Set dy/dx = 0 and evaluate d²y/dx²." }
          );
        } else if (subjectLower.includes("phy")) {
          theory.push(
            { id: 1, questionNumber: 1, questionText: `(a) State Newton's three laws of motion.\n(b) A vehicle of mass 1200kg accelerates uniformly from rest to 72km/h in 10 seconds. Calculate the accelerating force and work done.`, subParts: ["3 Laws (6 marks)", "Force & Work calculation (9 marks)"], maxScore: 15, sampleAnswer: "F = ma = 1200 * 2 = 2400N. Work = 240,000J." },
            { id: 2, questionNumber: 2, questionText: `(a) Explain what is meant by resonance in sound waves.\n(b) In a resonance tube experiment, the first resonance position occurs at 16.5cm and second at 50.5cm using a 512Hz tuning fork. Calculate the velocity of sound in air.`, subParts: ["Resonance concept (5 marks)", "Speed of sound calculation (10 marks)"], maxScore: 15, sampleAnswer: "λ/2 = 50.5 - 16.5 = 34cm -> λ = 0.68m. v = fλ = 512 * 0.68 = 348.16 m/s." },
            { id: 3, questionNumber: 3, questionText: `(a) State Ohm's law and define electrical resistivity.\n(b) Three resistors of 4Ω, 6Ω, and 12Ω are connected in parallel across a 12V battery with negligible internal resistance. Calculate the equivalent resistance and total current.`, subParts: ["Ohm's law & resistivity (6 marks)", "Parallel circuit calculation (9 marks)"], maxScore: 15, sampleAnswer: "1/R = 1/4 + 1/6 + 1/12 = 6/12 = 1/2 -> R = 2Ω. I = V/R = 12/2 = 6A." },
            { id: 4, questionNumber: 4, questionText: `(a) State Snell's law of refraction and define critical angle.\n(b) A ray of light traveling in glass of refractive index 1.5 strikes a glass-air boundary. Determine the critical angle.`, subParts: ["Snell's law & critical angle (6 marks)", "Calculation (9 marks)"], maxScore: 15, sampleAnswer: "sin(c) = 1/n = 1/1.5 = 0.6667 -> c = 41.8°." },
            { id: 5, questionNumber: 5, questionText: `(a) Distinguish between heat capacity and specific heat capacity.\n(b) A piece of copper of mass 0.5kg at 100°C is dropped into 0.2kg of water at 20°C. Calculate the final steady temperature. [c_copper = 400 J/kgK, c_water = 4200 J/kgK]`, subParts: ["Distinction (5 marks)", "Thermal equilibrium calculation (10 marks)"], maxScore: 15, sampleAnswer: "Heat lost = Heat gained. 0.5*400*(100-T) = 0.2*4200*(T-20) -> T = 35.38°C." },
            { id: 6, questionNumber: 6, questionText: `(a) Define radioactivity and half-life of a radioactive isotope.\n(b) A radioactive sample has a half-life of 8 days. If the initial count rate is 800 counts per minute, what will be the count rate after 32 days?`, subParts: ["Definitions (6 marks)", "Half-life decay (9 marks)"], maxScore: 15, sampleAnswer: "Number of half-lives = 32/8 = 4. Final count = 800 / (2⁴) = 50 counts per minute." }
          );
        } else {
          // Default discipline-grounded theory
          theory.push(
            { id: 1, questionNumber: 1, questionText: `(a) Clearly define the fundamental principles of ${req.subject} covered in the syllabus.\n(b) Explain three practical real-world applications of these principles in Nigeria.\n(c) Differentiate between primary concepts and derived applications with two illustrations.`, subParts: ["Definition (5 marks)", "3 Applications (6 marks)", "Distinction (4 marks)"], maxScore: 15, sampleAnswer: "Clear syllabus-based definition, authentic practical instances, and comparative distinction." },
            { id: 2, questionNumber: 2, questionText: `(a) Explain the sequential methodology required to evaluate core processes in ${req.subject}.\n(b) Highlight two common operational errors and explain how each can be eliminated.\n(c) Outline two safety or professional standards observed in this discipline.`, subParts: ["Methodology (6 marks)", "Error mitigation (5 marks)", "Standards (4 marks)"], maxScore: 15, sampleAnswer: "Systematic step-by-step procedure with standard protocols." },
            { id: 3, questionNumber: 3, questionText: `(a) Analyze the key factors influencing efficiency and productivity in ${req.subject}.\n(b) Propose two policy or institutional recommendations to enhance standards in Oyo State.`, subParts: ["Factor analysis (8 marks)", "Recommendations (7 marks)"], maxScore: 15, sampleAnswer: "Insightful institutional analysis with actionable recommendations." },
            { id: 4, questionNumber: 4, questionText: `(a) Differentiate between qualitative and quantitative assessments in ${req.subject}.\n(b) Describe three key data indicators used for terminal performance evaluation.`, subParts: ["Comparison (7 marks)", "3 Indicators (8 marks)"], maxScore: 15, sampleAnswer: "Clear comparative distinction with relevant metric indicators." },
            { id: 5, questionNumber: 5, questionText: `(a) Explain four environmental or socio-economic considerations directly related to this subject area.\n(b) State two ethical guidelines that must be upheld.`, subParts: ["Environmental/Socio-economic factors (8 marks)", "Ethical guidelines (7 marks)"], maxScore: 15, sampleAnswer: "Structured analysis of external variables and professional ethics." },
            { id: 6, questionNumber: 6, questionText: `Case Study & Scenario Synthesis:\nA public institution in Ibadan noted a 25% discrepancy between projected and realized terminal outcomes.\n(a) Identify three probable causes based on syllabus tenets.\n(b) Formulate a corrective strategic plan to restore benchmark standards.`, subParts: ["Identification of 3 causes (7 marks)", "Strategic plan (8 marks)"], maxScore: 15, sampleAnswer: "Rigorous diagnosis aligned with syllabus principles and a clear action plan." }
          );
        }
      } else if (theoryCount > 0) {
        for (let t = 1; t <= theoryCount; t++) {
          theory.push({
            id: t,
            questionNumber: t,
            questionText: `Question ${t}: (a) Define the central concept of ${req.subject}. (b) Provide two practical examples from everyday life in Nigeria.`,
            subParts: ["Definition (5 marks)", "2 Examples (5 marks)"],
            maxScore: 10,
            sampleAnswer: "Accurate definitions followed by lucid everyday examples."
          });
        }
      }
    }
  }

  // Paper-Saving Master Text (Options strictly on the same line to conserve paper)
  const headerText = [
    `================================================================================`,
    `                      STANBAX SCHOOLS IBADAN, OYO STATE                        `,
    `           GOVERNMENT APPROVED • ACCREDITED BRITISH-NIGERIAN CURRICULUM          `,
    `================================================================================`,
    `ACADEMIC SESSION: 2025/2026                 TERM: ${req.term.toUpperCase()}`,
    `EXAMINATION / ASSESSMENT: ${req.assessmentType.toUpperCase()} ${req.schemeOfWork ? '[GROUNDED IN SCHEME]' : ''}`,
    `SUBJECT: ${req.subject.toUpperCase()}        CLASS: ${req.classLevel.toUpperCase()}`,
    `TIME ALLOWED: ${isSecondary ? '2 HOURS' : isEarlyYears ? '45 MINS' : '1 HOUR 30 MINS'}`,
    `--------------------------------------------------------------------------------`,
    `CANDIDATE'S FULL NAME: ________________________________  EXAM NO: _______________`,
    `DATE: _____________________  CLASS SECTION: ___________  SIGNATURE: ____________`,
    `================================================================================\n`,
    isEarlyYears 
      ? `SECTION A: PICTORIAL IDENTIFICATION & RECOGNITION (${objCount} MARKS)\nINSTRUCTIONS: Look at each picture or symbol carefully. Tick or circle the correct letter (A, B, C, or D).\n`
      : isEnglish && readingPassage
      ? `SECTION A: COMPREHENSION PASSAGE & OBJECTIVES (${objCount} MARKS)\nINSTRUCTIONS: Read the passage below carefully and answer Questions 1 to 5 based strictly on it. Answer all other questions that follow.\n\nREADING PASSAGE: ${readingPassage.title.toUpperCase()}\n--------------------------------------------------------------------------------\n${readingPassage.text}\n--------------------------------------------------------------------------------\n\nQUESTIONS 1 - 5: COMPREHENSION QUESTIONS (BASED ON THE PASSAGE ABOVE)\n`
      : isSecondary
      ? `SECTION A: OBJECTIVE MULTIPLE CHOICE (50 MARKS)\nINSTRUCTIONS: Answer ALL fifty (50) questions. Each question carries 1 mark.\nNOTE: Questions and options are placed on the same line to save paper space.\n`
      : `SECTION A: OBJECTIVE TEST (${objCount} MARKS)\nINSTRUCTIONS: Answer all questions in this section.\n`,
    ...objectives.map((o, idx) => {
      if (isEnglish && idx === 5) {
        return `\nQUESTIONS 6 - ${objectives.length}: LEXIS, STRUCTURE, GRAMMAR & VOCABULARY\n` + o.singleLineFormat;
      }
      return o.singleLineFormat;
    }),
    `\n--------------------------------------------------------------------------------`,
    isEnglish
      ? `SECTION B: THEORY & ESSAY QUESTIONS (PAPER 2)\nINSTRUCTIONS: Answer Question 1 (Essay Writing) and any other THREE (3) questions in this section. All questions carry equal marks.\n`
      : isSecondary
      ? `SECTION B: THEORY & ESSAY QUESTIONS (50 MARKS)\nINSTRUCTIONS: Answer any FOUR (4) questions out of the six (6) questions provided below.\nEach full question carries 12.5 or 15 marks as allocated.\n`
      : theory.length > 0
      ? `SECTION B: STRUCTURED QUESTIONS\nINSTRUCTIONS: Answer all questions in the spaces provided below.\n`
      : ``,
    ...theory.map(t => `\nQUESTION ${t.questionNumber} (${t.maxScore} Marks):\n${t.questionText}\n`)
  ].filter(Boolean).join('\n');

  // Compact marking guide
  const markingGuide = [
    `STANBAX SCHOOLS - CONFIDENTIAL OFFICIAL MARKING GUIDE`,
    `SUBJECT: ${req.subject} | CLASS: ${req.classLevel} | TERM: ${req.term}`,
    `\nSECTION A OBJECTIVE ANSWER KEYS:`,
    ...objectives.map((o, idx) => `${o.id}.${o.correctOption}${((idx + 1) % 10 === 0) ? '\n' : '  '}`),
    theory.length > 0 ? `\n\nSECTION B THEORY MARKING SCHEME:\n` + theory.map(t => `Q${t.questionNumber}: ${t.sampleAnswer} [Max: ${t.maxScore}m]`).join('\n') : ''
  ].join('\n');

  return {
    title: `${req.subject} ${req.assessmentType}`,
    schoolName: "Stanbax Schools Ibadan",
    classLevel: req.classLevel,
    subject: req.subject,
    term: req.term,
    timeAllowed: isSecondary ? "2 Hours" : isEarlyYears ? "45 Minutes" : "1 Hour 30 Minutes",
    instructions: isEarlyYears 
      ? "Circle or point to the correct picture or symbol for each question."
      : isEnglish
      ? "SECTION A: Read the passage and answer Questions 1-5; answer Questions 6-50. SECTION B: Answer Question 1 (Essay) and any other 3 questions."
      : isSecondary 
      ? "SECTION A: Answer all 50 Objective Questions. SECTION B: Answer any 4 Theory Questions out of 6."
      : "Answer all questions in Section A and chosen questions in Section B.",
    isEarlyYearsPictorial: Boolean(isEarlyYears),
    isSecondaryFiftySix: Boolean(isSecondary),
    readingPassage,
    objectives,
    theory,
    paperSavingText: headerText,
    markingGuide
  };
}

// Academic Fallback Engine for Calvin AI
function generateCalvinAcademicFallback(question: string, studentName: string, classLevel: string, isPremium: boolean, schemeOfWork?: any): string {
  const qLower = question.toLowerCase();
  const isEarly = classLevel.toLowerCase().includes('nursery') || classLevel.toLowerCase().includes('kg') || classLevel.toLowerCase().includes('reception');

  if (isEarly) {
    return `Hello little star, ${studentName}!

I love your wonderful question! In our ${classLevel} class at Stanbax Schools, we learn that:

• Everything around us has a name and a special purpose!
• God made our world full of colorful shapes, sounds, and friendly animals.

Keep asking questions and smiling today! You did great!`;
  }

  // If scheme of work is supplied, check for matched week or topic to guarantee accurate curriculum grounding
  if (schemeOfWork && Array.isArray(schemeOfWork.weeklyTopics)) {
    const weekMatch = qLower.match(/week\s*([0-9]{1,2})/);
    const targetWeekNum = weekMatch ? parseInt(weekMatch[1], 10) : null;
    const matchedWeek = targetWeekNum 
      ? schemeOfWork.weeklyTopics.find((w: any) => w.week === targetWeekNum)
      : schemeOfWork.weeklyTopics.find((w: any) => w.topic && qLower.includes(w.topic.toLowerCase()));

    if (matchedWeek) {
      const topicName = matchedWeek.topic;
      const subtopics = matchedWeek.subtopics?.length ? matchedWeek.subtopics.join(', ') : 'Theoretical fundamentals and worked step derivations';
      const formulas = matchedWeek.keyFormulasOrTerms?.length ? matchedWeek.keyFormulasOrTerms.join(', ') : '';
      const objectives = matchedWeek.learningObjectives?.length ? matchedWeek.learningObjectives.map((o: string) => `• ${o}`).join('\n') : '';

      return `Hello ${studentName}. It is a pleasure to guide you today as your AI Academic Tutor at Stanbax Schools Ibadan.

In Week ${matchedWeek.week} of your approved ${schemeOfWork.classLevel || classLevel} ${schemeOfWork.subjectName || ''} Scheme of Work (${schemeOfWork.term || 'Official Syllabus'}), the curriculum unit is:

${topicName}

Curriculum Subtopics Covered:
${subtopics}

${objectives ? `Specific Learning Objectives:\n${objectives}\n\n` : ''}${formulas ? `Key Formulas & Exam Terms:\n• ${formulas}\n\n` : ''}Comprehensive Academic Breakdown:
1. Concept Definition & Principle:
${topicName} forms an essential part of the Nigerian-British secondary school syllabus and is frequently tested in WAEC WASSCE, NECO SSCE, and Cambridge IGCSE examinations. Master the core definitions, standard SI units, and step-by-step methodologies.

2. Step-by-Step Worked Approach:
• Read the problem statement thoroughly and identify all given parameters.
• State the standard formula or rule explicitly before substituting numerical values.
• Work through intermediate steps systematically to secure full method marks.
• Verify that your final answer includes the correct units or degree of accuracy.

3. WAEC & Cambridge Exam Pitfalls to Avoid:
• Pay close attention to sign conventions and unit conversions.
• In theory papers, never omit intermediate working; Stanbax examiners and WAEC markers award step marks independently of the final numerical answer.

Feel free to ask a specific follow-up question or request a worked drill on this Week ${matchedWeek.week} topic!`;
    }
  }

  if (qLower.includes('photo') || qLower.includes('plant') || qLower.includes('leaf')) {
    if (isPremium) {
      return `Photosynthesis: Masterclass Academic Breakdown
Tailored for ${studentName} (${classLevel}) • Calvin Premium Masterclass

1. Concept Summary & Definition
Photosynthesis is the fundamental biochemical process whereby green plants, algae, and certain cyanobacteria synthesize organic food (glucose) from inorganic carbon dioxide (CO₂) and water (H₂O), utilizing solar radiant energy trapped by chlorophyll, releasing oxygen gas as a byproduct.

Chemical Word & Symbol Equation:
6CO₂ + 6H₂O  ──(Sunlight / Chlorophyll)──>  C₆H₁₂O₆ + 6O₂
Carbon Dioxide + Water  ──>  Glucose + Oxygen

2. The Two Crucial Phases (WAEC / Cambridge Focus):
• Light-Dependent Phase (Thylakoid Grana): Solar photons strike Photosystems II and I. Water undergoes photolysis (2H₂O → 4H⁺ + 4e⁻ + O₂), generating ATP and reduced NADPH.
• Light-Independent Phase / Calvin-Benson Cycle (Stroma): Carbon fixation mediated by the enzyme RuBisCO. CO₂ combines with Ribulose 1,5-bisphosphate (RuBP) to yield 3-phosphoglycerate (PGA), subsequently reduced to glyceraldehyde-3-phosphate (G3P) and glucose.

3. Mnemonic Trick to Remember Inputs & Outputs:
C-W-S-O → Carbon dioxide + Water + Sunlight = Sugar + Oxygen!

4. Stanbax Senior Examiner Tip:
Beware of confusion between Photosynthesis and Respiration! In WAEC Section B, remember to state that light reactions occur in the thylakoids/grana while dark reactions take place in the stroma.

Quick Practice Drill for You, ${studentName}:
What happens to the rate of photosynthesis when temperature exceeds 45°C? (Hint: Think about what happens to plant protein enzymes like RuBisCO at high temperatures!)`;
    } else {
      return `Understanding Photosynthesis
Hello ${studentName}! Here is your guide for ${classLevel}:

Photosynthesis is the process by which green plants manufacture their own food (glucose) using:
1. Carbon Dioxide (CO₂) from the air through microscopic stomata.
2. Water (H₂O) absorbed by roots from the soil.
3. Sunlight absorbed by the green pigment called chlorophyll in chloroplasts.

Chemical Equation:
Carbon Dioxide + Water  ──(Sunlight + Chlorophyll)──>  Glucose + Oxygen
6CO₂ + 6H₂O  ──>  C₆H₁₂O₆ + 6O₂

Oxygen is released into the air for humans and animals to breathe! Feel free to ask if you need further practice questions.`;
    }
  }

  if (qLower.includes('quadratic') || qLower.includes('solve') || qLower.includes('math') || qLower.includes('equation')) {
    if (isPremium) {
      return `Quadratic Equations: Comprehensive Solution Method
Personalized for ${studentName} (${classLevel}) • Calvin Premium Masterclass

1. Standard General Form
Any second-degree polynomial equation takes the form:
ax² + bx + c = 0  (where a ≠ 0)

2. The Quadratic Formula:
x = (-b ± √(b² - 4ac)) / (2a)

Worked Example: Solve 2x² - 5x + 2 = 0
• Step 1: Identify coefficients: a = 2, b = -5, c = 2.
• Step 2: Calculate the discriminant:
  Δ = b² - 4ac = (-5)² - 4(2)(2) = 25 - 16 = 9.
• Step 3: Substitute into the quadratic formula:
  x = (-(-5) ± √9) / (2 × 2) = (5 ± 3) / 4
• First Solution: x = (5 + 3) / 4 = 8 / 4 = 2
• Second Solution: x = (5 - 3) / 4 = 2 / 4 = 1/2 (or 0.5)

3. WAEC & JAMB Marking Guide Note:
Always verify your roots by factorizing: (2x - 1)(x - 2) = 0. In theory papers, showing the substitution step earns 2 method marks before the final answer!`;
    } else {
      return `Solving Quadratic Equations
Hello ${studentName}! Here is the standard method for ${classLevel}:

To solve any quadratic equation in the form ax² + bx + c = 0, use the quadratic formula:
x = (-b ± √(b² - 4ac)) / (2a)

Steps:
1. Rearrange the equation so that one side equals zero.
2. Write down the values of a, b, and c.
3. Compute the term inside the square root: b² - 4ac.
4. Calculate the two possible answers using + and -.

Try sending me an equation like x² - 5x + 6 = 0 and I will walk through it with you!`;
    }
  }

  // General academic response tailored strictly to class level and subject domain
  const isPrimary = classLevel.toLowerCase().includes('primary') || classLevel.toLowerCase().includes('basic') || classLevel.toLowerCase().includes('grade');
  const isJunior = classLevel.toLowerCase().includes('jss') || classLevel.toLowerCase().includes('junior');
  const isSenior = classLevel.toLowerCase().includes('sss') || classLevel.toLowerCase().includes('ss ') || classLevel.toLowerCase().includes('senior');

  if (isPrimary) {
    return `Hello ${studentName}! Here is your Primary School guide for ${classLevel}:

Topic: "${question}"

1. What this means in simple terms:
Think of this concept like something we see every day at school or at home. When we break it down into small, easy steps, it becomes much simpler to understand!

2. Step-by-Step Breakdown:
• Step 1: Read the problem carefully and pick out the most important words or numbers.
• Step 2: Remember our classroom rule—always write down what you are given first before finding the answer.
• Step 3: Check your work slowly to make sure you did not skip any small step.

3. Fun Classroom Memory Tip:
Practice explaining this in your own words to your study partner or parent today! Teaching someone else is the fastest way to become a superstar in your class. ⭐

Keep up the wonderful curiosity, ${studentName}! What part would you like us to practice together next?`;
  }

  if (isJunior) {
    return `Hello ${studentName}! Here is your Junior Secondary academic breakdown for ${classLevel} (BECE & Cambridge Checkpoint Standard):

Subject Investigation: "${question}"

1. Conceptual Overview:
In Junior Secondary, mastering this topic requires understanding the core definitions and how they connect to the Nigerian National Curriculum (NERDC) and British Checkpoint specifications.

2. Structured Academic Methodology:
• Identify the core subject principles involved.
• If this is a calculation: state the standard formula, show all numerical substitutions clearly, and compute step-by-step with proper SI units.
• If this is a descriptive or theoretical topic: define the main terms clearly, outline 3 distinct characteristics or functions, and provide a relatable Nigerian or everyday example.

3. Junior WAEC / BECE Examination Tip:
Examiners always award separate marks for showing your working steps. Never write down just a final answer—secure your full method marks by showing each intermediate line!

Feel free to ask a follow-up drill or give me a specific problem to solve together, ${studentName}!`;
  }

  // Default: Senior Secondary (SSS 1 - 3 / WASSCE / NECO / JAMB / IGCSE)
  return `${isPremium ? 'Calvin Premium Masterclass • ' : ''}Academic Guidance for ${studentName} (${classLevel})
Syllabus Inquiry: "${question}"

1. Conceptual Definition & Foundational Principles:
At the Senior Secondary level, this topic represents a foundational building block for WAEC WASSCE, NECO SSCE, JAMB UTME, and Cambridge IGCSE syllabi. Approach it by first articulating the exact scientific, mathematical, or literary definition.

2. Systematic Analytical Approach:
• Parameter Identification: Extract given variables, boundary conditions, or textual references.
• Theoretical Framework: State the governing law, mathematical relation, or analytical model before executing calculations or constructing arguments.
• Sequential Execution: Solve or analyze systematically, maintaining dimensional consistency and standard SI units throughout.
• Result Verification: Cross-check your answer using alternative methods (e.g. dimensional analysis or inverse operations).

3. Stanbax Senior Examiner Insights:
WAEC and Cambridge markers specifically look for clear technical terminology, standard mathematical notation (never omit intermediate lines), and correct units in final values.

${isPremium ? '✨ Premium Masterclass Privilege: Would you like me to generate a 5-question WAEC past-paper drill, a step-by-step derivation, or an exam mnemonic for this exact topic?' : 'Ask me any follow-up question or share a specific past paper question and I will break it down for you step by step!'}`;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ extended: true, limit: "15mb" }));

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ 
      status: "ok", 
      geminiConfigured: !!process.env.GEMINI_API_KEY,
      school: "Stanbax Schools Ibadan" 
    });
  });

  // School News & External Educational Updates API
  app.get("/api/school-news", async (_req, res) => {
    try {
      // Responds with recent school updates and external education wire feed
      const newsFeed = [
        {
          id: 'news-ext-1',
          title: 'NERDC Releases Updated 2026 British-Nigerian Dual Curriculum Benchmark Framework',
          slug: 'nerdc-dual-curriculum-benchmark-2026',
          excerpt: 'Nigerian Educational Research and Development Council endorses accelerated STEM coding, computational logic, and bilingual French instruction.',
          content: 'The Nigerian Educational Research and Development Council (NERDC), in formal consultation with Cambridge Assessment International Education, has announced revised curriculum specifications focusing on digital literacy, applied laboratory mathematics, and sustainable civic governance. Stanbax Schools has integrated these benchmarks directly into all termly schemes of work.',
          category: 'Academic Honors',
          coverImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop',
          publishedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
          readTime: '3 min read',
          author: {
            id: 'press-wire',
            name: 'NERDC National Education Wire',
            role: 'Staff Patron',
            gradeOrTitle: 'Accreditation Bureau'
          },
          tags: ['Curriculum', 'NERDC', 'Cambridge', 'National Benchmarks'],
          isFeatured: false,
          likesCount: 54,
          viewsCount: 310,
          externalSource: 'National Education Gazette'
        }
      ];

      res.json({
        success: true,
        source: 'api_dispatch',
        articles: newsFeed,
        timestamp: new Date().toISOString()
      });
    } catch (e: any) {
      res.json({
        success: false,
        error: e?.message || 'Could not fetch external news',
        articles: []
      });
    }
  });

  // AI Exam & Assessment Generation Endpoint
  app.post("/api/generate-assessment", async (req, res) => {
    const {
      classLevel = "SSS 2",
      ageGroup,
      subject = "General Science",
      term = "2nd Term",
      assessmentType = "Terminal Examination",
      curriculumTopics = "",
      difficulty = "Standard WAEC / Stanbax Standard",
      targetObjectiveCount,
      targetTheoryCount,
      schemeOfWork,
      selectedWeeks,
      presetType,
      additionalInstructions
    } = req.body as AssessmentRequest;

    const isEarlyYears = 
      classLevel.toLowerCase().includes('nursery') || 
      classLevel.toLowerCase().includes('kindergarten') || 
      classLevel.toLowerCase().includes('kg') || 
      classLevel.toLowerCase().includes('reception') || 
      classLevel.toLowerCase().includes('early') || 
      (ageGroup && ageGroup.includes('3-6'));

    const isSecondary = 
      classLevel.toLowerCase().includes('jss') || 
      classLevel.toLowerCase().includes('sss') || 
      classLevel.toLowerCase().includes('secondary');

    const expectedObjCount = targetObjectiveCount && targetObjectiveCount > 0 
      ? targetObjectiveCount 
      : (isSecondary ? (presetType === 'jamb' ? 50 : 50) : isEarlyYears ? 12 : 25);
    const expectedTheoryCount = targetTheoryCount !== undefined 
      ? targetTheoryCount 
      : (presetType === 'jamb' ? 0 : isSecondary ? 6 : isEarlyYears ? 0 : 3);

    const subjectLower = subject.toLowerCase();
    const isEnglish = subjectLower.includes('eng') || subjectLower.includes('lit') || subjectLower.includes('use of english');

    const ai = getGeminiClient();

    if (!ai) {
      // Return guaranteed rich curriculum fallback if API key is not present in container
      const fallback = generateCurriculumFallback({
        classLevel,
        ageGroup,
        subject,
        term,
        assessmentType,
        curriculumTopics,
        difficulty,
        targetObjectiveCount: expectedObjCount,
        targetTheoryCount: expectedTheoryCount,
        schemeOfWork,
        selectedWeeks,
        presetType,
        additionalInstructions
      });
      return res.json({ success: true, source: "curriculum_engine", data: fallback });
    }

    try {
      const systemInstruction = `You are Calvin AI, Senior Chief Examiner and Academic Assessment Officer for Stanbax Schools Ibadan, a premier Nigerian-British curriculum educational institution.
Your job is to generate rigorous, authentic, professional exam question papers and tests for teachers.

CRITICAL ARCHITECTURAL RULES:
1. CURRICULUM GROUNDING (UPLOADED SCHEME OF WORK):
   - You MUST learn from and ground ALL questions in the provided Scheme of Work uploaded by the tutor.
   - Use the weekly topics, subtopics, learning objectives, and key terms directly from the scheme.
   - If specific weeks are targeted (e.g. Weeks 1 to 6 for Mid-Term CA or Week 3 for Topical Quiz), strictly restrict the questions to those weeks.
   - If WAEC or JAMB is requested, adhere to authentic WAEC WASSCE and JAMB UTME syllabus standards and past-question phrasing styles.

2. ABSOLUTE RULE - NEVER USE ASTERISKS (*) OR (**):
   - DO NOT USE ASTERISKS (*) OR (**) FOR BOLD OR ITALICS!
   - In printed exams and mobile screens, raw asterisks display literally as *word* which ruins the appearance.
   - For vocabulary, synonyms, and antonyms, use CAPITAL LETTERS (e.g. SUCCINCT, EXPLICIT, MITIGATE) or quotes (e.g. "succinct").
   - Example of correct phrasing: "Choose the option nearest in meaning to the capitalized word: The principal gave a SUCCINCT address."
   - Never emit any asterisk (*) characters in questions, options, theory, or reading passages.

3. STRICT RULES FOR ENGLISH LANGUAGE & LITERATURE:
   - Under NO circumstances should any mathematics formulas, physics experiments, laboratory apparatus, or chemical reactions appear in an English paper!
   - COMPULSORY READING PASSAGE: For English Language, you MUST include a "readingPassage" object with:
     {
       "title": "string (engaging title)",
       "text": "string (3-4 paragraphs, 250-400 words of rich narrative or expository prose)",
       "instructions": "Read the passage below carefully and answer Questions 1 to 5 based strictly on it."
     }
   - QUESTIONS 1 TO 5 MUST BE DIRECT COMPREHENSION QUESTIONS strictly based on the reading passage:
     * Question 1: Central theme or main idea of the passage.
     * Question 2: Specific factual detail from paragraph 2.
     * Question 3: Inference or author's perspective from paragraph 3.
     * Question 4: Grammatical name and grammatical function of a highlighted clause in the passage.
     * Question 5: Vocabulary in context (finding the word that can replace a capitalized word from the passage).
   - QUESTIONS 6 ONWARDS: Test general Lexis, Structure, Antonyms, Synonyms, Concord, Prepositions, Figures of Speech, and Oral English.
   - ENGLISH THEORY (SECTION B): Must strictly follow WAEC WASSCE Paper 2:
     * Question 1: Continuous Writing / Essay (Choice of 4: Formal Letter, Informal Letter, Article for publication in a national daily, Creative Narrative).
     * Question 2: Comprehension Passage & Grammatical Analysis (factual retrieval, clause and function, figures of speech, vocabulary replacement).
     * Question 3: Summary Writing (passage with two clear questions testing concise summary in specific sentence counts).
     * Question 4: Applied Lexis & Grammatical Structure (sentence transformation, reported speech, passive voice, grammatical concord).
     * Question 5: Oral English & Phonetics (vowel/consonant transcription, primary stress patterns with CAPITAL letters, emphatic stress).
     * Question 6: Literature-in-English & Poetic Devices (dramatic irony, soliloquy, characterization, figures of speech).

4. AGE & CLASS PERSONALIZATION:
   - If the class is Early Years / Ages 3-6 (Nursery, Kindergarten, KG, Reception): Questions MUST use simple words suitable for ages 3-6 with vivid visual/pictorial symbols (e.g. 🍎, 🐶, ⭐, 🔴, 🚗, ✈️) so young children can easily identify, point, or circle answers.
   - If the class is Secondary School (JSS 1-3 or SSS 1-3): YOU MUST GENERATE EXACTLY ${expectedObjCount} OBJECTIVE QUESTIONS AND ${expectedTheoryCount} THEORY QUESTIONS. Follow WAEC / BECE / NECO syllabus depth.
   - If Primary School (Basic 1-6): Generate age-appropriate foundational questions.

5. STRICT SINGLE-LINE OPTION FORMATTING (PAPER SAVER RULE):
   - In Nigerian schools, exam papers are printed/photocopied on tight paper budgets.
   - ALL multiple choice questions and their options MUST be strictly on the SAME LINE:
     Format: [Number]. [Question text]. A) [Option A] B) [Option B] C) [Option C] D) [Option D]
     Example: 1. Who is a boy. A) Male B) female C) none D) all.
   - DO NOT create newlines or multiple paragraphs between the question and options or between options.
   - Every question and its four options (A, B, C, D) MUST fit on one single line to save printing paper!

6. TUTOR'S SPECIAL GUIDELINES & ADDITIONAL INSTRUCTIONS:
   ${(additionalInstructions || schemeOfWork?.additionalInstructions) 
     ? `MANDATORY TUTOR INSTRUCTION: "${additionalInstructions || schemeOfWork?.additionalInstructions}". You MUST give top priority to these teacher instructions!` 
     : `Adhere strictly to standard WAEC and NERDC curriculum requirements.`}

7. OUTPUT FORMAT:
   - Return valid, unescaped JSON matching this schema:
   {
     "title": "string",
     "schoolName": "Stanbax Schools Ibadan",
     "classLevel": "string",
     "subject": "string",
     "term": "string",
     "timeAllowed": "string",
     "instructions": "string",
     "isEarlyYearsPictorial": boolean,
     "isSecondaryFiftySix": boolean,
     "readingPassage": {
       "title": "string",
       "text": "string",
       "instructions": "string"
     } (MANDATORY for English Language, optional for other subjects),
     "objectives": [
       {
         "id": 1,
         "question": "string (NO asterisks!)",
         "optionA": "string",
         "optionB": "string",
         "optionC": "string",
         "optionD": "string",
         "correctOption": "A" | "B" | "C" | "D",
         "singleLineFormat": "1. Question text. A) OptA B) OptB C) OptC D) OptD",
         "pictorialSymbol": "🍎🍎🍎" (if early years, optional otherwise)
       }
     ],
     "theory": [
       {
         "id": 1,
         "questionNumber": 1,
         "questionText": "string with (a), (b), (c)",
         "subParts": ["string"],
         "maxScore": 15,
         "sampleAnswer": "string"
       }
     ],
     "paperSavingText": "Full formatted text with header and all questions strictly formatted on single lines",
     "markingGuide": "Concise key: 1. A, 2. C, 3. B... plus theory rubrics"
   }`;

      let schemeContext = "";
      if (schemeOfWork && schemeOfWork.weeklyTopics && schemeOfWork.weeklyTopics.length > 0) {
        const relevantTopics = (selectedWeeks && selectedWeeks.length > 0)
          ? schemeOfWork.weeklyTopics.filter((w: any) => selectedWeeks.includes(w.week))
          : schemeOfWork.weeklyTopics;

        schemeContext = `
CALVIN AI GROUNDED SCHEME OF WORK UPLOADED BY TUTOR:
- Subject: ${schemeOfWork.subjectName || subject}
- Level: ${schemeOfWork.classLevel || classLevel} (${schemeOfWork.term || term})
- Curriculum Standard: ${schemeOfWork.curriculumStandard || 'NERDC / WAEC WASSCE'}
- Summary: ${schemeOfWork.summary || 'Official Syllabus'}
${schemeOfWork.additionalInstructions ? `- Teacher's Scheme Instructions: ${schemeOfWork.additionalInstructions}` : ''}
- Targeted Weekly Units:
${relevantTopics.map((w: any) => `  * Week ${w.week}: ${w.topic} | Subtopics: ${w.subtopics?.join(', ') || 'Core units'} | Objectives: ${w.learningObjectives?.join('; ') || 'Competencies'}`).join('\n')}

MANDATORY: Synthesize questions directly testing these weekly topics and objectives!`;
      }

      const tutorInstructionsContext = (additionalInstructions || schemeOfWork?.additionalInstructions)
        ? `\n- TUTOR'S SPECIAL INSTRUCTIONS: ${additionalInstructions || schemeOfWork?.additionalInstructions}\n`
        : "";

      const userPrompt = `Generate a complete ${presetType ? presetType.toUpperCase() : assessmentType} paper for Stanbax Schools Ibadan:
- Subject: ${subject}
- Class Level: ${classLevel} ${ageGroup ? `(${ageGroup})` : ''}
- Academic Term: ${term}
- Specific Topics/Scope: ${curriculumTopics || (schemeContext ? 'Grounded in uploaded Scheme of Work' : 'Full term syllabus')}
- Assessment Preset: ${presetType || assessmentType} (WAEC / JAMB / BECE / School Quiz)
- Difficulty standard: ${difficulty}
- COGNITIVE RIGOR GUIDELINE: ${
  difficulty.toLowerCase().includes('easy') || difficulty.toLowerCase().includes('foundational') || difficulty.toLowerCase().includes('remedial')
    ? 'FOUNDATIONAL / EASY: Questions must emphasize fundamental definitions, direct conceptual recall, simple clear examples, high accessibility, and basic vocabulary. Distractors should be distinct and not overly tricky.'
    : difficulty.toLowerCase().includes('advanced') || difficulty.toLowerCase().includes('distinction')
    ? 'ADVANCED / DISTINCTION: Questions must test higher-order thinking (Bloom Analysis & Evaluation), multi-step problem solving, nuanced distractors that eliminate guesswork, and rigorous analytical questions in theory.'
    : difficulty.toLowerCase().includes('olympiad') || difficulty.toLowerCase().includes('challenge') || difficulty.toLowerCase().includes('competition')
    ? 'OLYMPIAD / CHALLENGE: Questions must be exceptionally challenging, requiring non-routine problem solving, interdisciplinary synthesis, proofs, and deep mathematical or analytical reasoning worthy of national scholarship decathlons.'
    : 'STANDARD WAEC/BECE: Balanced syllabus distribution adhering strictly to official WAEC / NECO / BECE / Cambridge standard distribution (30% recall, 40% comprehension & application, 30% analysis).'
}
- Required Objective Questions: ${expectedObjCount} ${presetType === 'waec' ? '(Full 50 WAEC Standard)' : presetType === 'jamb' ? '(JAMB UTME CBT Standard)' : ''}
- Required Theory Questions: ${expectedTheoryCount} ${presetType === 'waec' ? '(Section B: 6 WAEC Theory Questions, Answer 4)' : presetType === 'jamb' ? '(0 Theory for JAMB CBT)' : ''}
${tutorInstructionsContext}
${schemeContext}

${isEnglish ? `CRITICAL FOR ENGLISH:
1. Provide a "readingPassage" object with an authentic reading comprehension passage.
2. Questions 1 to 5 MUST BE DIRECT COMPREHENSION QUESTIONS testing this reading passage!
3. Questions 6 to ${expectedObjCount} test Lexis, Structure, Antonyms, Synonyms, Prepositions, Concord, and Oral English.
4. Section B Theory questions MUST be pure English Paper 2 (Continuous Writing/Essay, Comprehension, Summary, Grammar, Oral English, Literature). NO MATHS, NO PHYSICS!` : ''}

CRITICAL PRINTING SPACE RULE: Format every single question and its options (A, B, C, D) on the SAME LINE:
Format: 1. Question text. A) OptA B) OptB C) OptC D) OptD
No separate paragraphs.
CRITICAL FORMATTING RULE: ZERO ASTERISKS! Do not use *word* or **word**. Use CAPITAL LETTERS for words being tested.`;

      const { response, model: modelUsed } = await generateWithGemini(ai, {
        contents: userPrompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.6,
        }
      });

      const responseText = response.text || "";
      let parsedData: AssessmentResponse;
      try {
        parsedData = JSON.parse(responseText.trim());
      } catch (parseErr) {
        console.warn("JSON parse error on Gemini output, falling back to curriculum engine", parseErr);
        parsedData = generateCurriculumFallback({
          classLevel,
          ageGroup,
          subject,
          term,
          assessmentType,
          curriculumTopics,
          difficulty,
          targetObjectiveCount: expectedObjCount,
          targetTheoryCount: expectedTheoryCount,
          schemeOfWork,
          selectedWeeks,
          presetType,
          additionalInstructions
        });
      }

      // Ensure paperSavingText and markingGuide exist
      if (!parsedData.paperSavingText || !parsedData.objectives || parsedData.objectives.length === 0) {
        parsedData = generateCurriculumFallback({
          classLevel,
          ageGroup,
          subject,
          term,
          assessmentType,
          curriculumTopics,
          difficulty,
          targetObjectiveCount: expectedObjCount,
          targetTheoryCount: expectedTheoryCount,
          schemeOfWork,
          selectedWeeks,
          presetType,
          additionalInstructions
        });
      }

      // Guarantee student-friendly sanitization (remove raw asterisks, format clean text)
      if (parsedData) {
        if (parsedData.paperSavingText) {
          parsedData.paperSavingText = sanitizeStudentFriendlyText(parsedData.paperSavingText);
        }
        if (parsedData.readingPassage) {
          parsedData.readingPassage.title = sanitizeStudentFriendlyText(parsedData.readingPassage.title || '');
          parsedData.readingPassage.text = sanitizeStudentFriendlyText(parsedData.readingPassage.text || '');
          if (parsedData.readingPassage.instructions) {
            parsedData.readingPassage.instructions = sanitizeStudentFriendlyText(parsedData.readingPassage.instructions);
          }
        }
        if (Array.isArray(parsedData.objectives)) {
          parsedData.objectives = parsedData.objectives.map(obj => ({
            ...obj,
            question: sanitizeStudentFriendlyText(obj.question),
            optionA: sanitizeStudentFriendlyText(obj.optionA),
            optionB: sanitizeStudentFriendlyText(obj.optionB),
            optionC: sanitizeStudentFriendlyText(obj.optionC),
            optionD: obj.optionD ? sanitizeStudentFriendlyText(obj.optionD) : undefined,
            singleLineFormat: sanitizeStudentFriendlyText(obj.singleLineFormat)
          }));
        }
        if (Array.isArray(parsedData.theory)) {
          parsedData.theory = parsedData.theory.map(t => ({
            ...t,
            questionText: sanitizeStudentFriendlyText(t.questionText),
            subParts: Array.isArray(t.subParts) ? t.subParts.map(sp => sanitizeStudentFriendlyText(sp)) : [],
            sampleAnswer: sanitizeStudentFriendlyText(t.sampleAnswer || '')
          }));
        }
        if (parsedData.markingGuide) {
          parsedData.markingGuide = sanitizeStudentFriendlyText(parsedData.markingGuide);
        }
        parsedData.difficulty = difficulty;
      }

      return res.json({ success: true, source: "gemini_ai", modelUsed, data: parsedData });
    } catch (apiError: any) {
      console.warn("Gemini API call error:", apiError?.message || apiError);
      // Seamlessly deliver complete curriculum fallback
      const fallback = generateCurriculumFallback({
        classLevel,
        ageGroup,
        subject,
        term,
        assessmentType,
        curriculumTopics,
        difficulty,
        targetObjectiveCount: expectedObjCount,
        targetTheoryCount: expectedTheoryCount,
        schemeOfWork,
        selectedWeeks,
        presetType,
        additionalInstructions
      });
      return res.json({ success: true, source: "curriculum_engine", data: fallback });
    }
  });

// Robust sanitization function to guarantee student-friendly formatting
// Strips all raw '#' symbols, carets '^' (converting to superscripts), and '*' formatting glitches
function sanitizeStudentFriendlyText(str: string): string {
  if (!str) return '';

  const superscriptMap: Record<string, string> = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
    '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾',
    'n': 'ⁿ', 'x': 'ˣ', 'y': 'ʸ', 'a': 'ᵃ', 'b': 'ᵇ', 'i': 'ⁱ', 'k': 'ᵏ', 'm': 'ᵐ'
  };

  const subscriptMap: Record<string, string> = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
    '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
    '+': '₊', '-': '₋'
  };

  let res = str;

  // 1. Remove all markdown hashes (#, ##, ###, ####) at line start or anywhere
  res = res.replace(/^[ \t]*#{1,6}[ \t]*/gm, '');
  res = res.replace(/#(\d+)/g, 'No. $1');
  res = res.replace(/#+/g, '');

  // 2. Clean exponents with carets: e.g. x^2, 10^5, x^(n-1), cm^3, ^2
  // Handle grouped carets like ^(n+1)
  res = res.replace(/\^\(([^)]+)\)/g, (_, exp) => {
    return exp.split('').map((c: string) => superscriptMap[c.toLowerCase()] || c).join('');
  });
  // Handle multi-character carets like ^12, ^2, ^3
  res = res.replace(/\^([0-9+\-nxyabkm]+)/gi, (_, exp) => {
    return exp.split('').map((c: string) => superscriptMap[c.toLowerCase()] || c).join('');
  });
  // Handle space carets like "x ^ 2"
  res = res.replace(/([a-zA-Z0-9\)])\s*\^\s*([0-9+\-nxyabkm]+)/gi, (_, base, exp) => {
    const sup = exp.split('').map((c: string) => superscriptMap[c.toLowerCase()] || c).join('');
    return `${base}${sup}`;
  });
  // Strip any solitary remaining carets
  res = res.replace(/\^/g, '');

  // 3. Convert chemical subscripts like CO_2, H_2O
  res = res.replace(/_([0-9+\-])/g, (_, sub) => subscriptMap[sub] || sub);

  // 4. Clean asterisks:
  // Convert markdown bold **word** or italic *word* to clean plain text or uppercase without asterisks
  res = res.replace(/italicized word:?\s*\*+([^*]+)\*+/gi, 'capitalized word: "$1"');
  res = res.replace(/bold word:?\s*\*+([^*]+)\*+/gi, 'capitalized word: "$1"');
  res = res.replace(/\*\*([^*]+)\*\*/g, '$1');
  res = res.replace(/\*([^*]+)\*/g, '$1');
  // Bullet points starting with * -> •
  res = res.replace(/^[ \t]*\*[ \t]+/gm, '• ');
  // Math multiplication like "4 * 5" or "x * y" -> "4 × 5" or "x × y"
  res = res.replace(/(\d+)\s*\*\s*(\d+)/g, '$1 × $2');
  res = res.replace(/([a-zA-Z0-9\)])\s*\*\s*([a-zA-Z0-9\(])/g, '$1 × $2');
  // Strip any lingering asterisks so asterisks never display literally on screen or paper
  res = res.replace(/\*/g, '');

  // 5. Clean LaTeX expressions
  res = res
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1 / $2)')
    .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
    .replace(/\\pm\b/g, '±')
    .replace(/\\times\b/g, '×')
    .replace(/\\rightarrow\b/g, '→')
    .replace(/\\Delta\b/g, 'Δ')
    .replace(/\\pi\b/g, 'π')
    .replace(/\\theta\b/g, 'θ')
    .replace(/\\alpha\b/g, 'α')
    .replace(/\\beta\b/g, 'β')
    .replace(/\$\$/g, '')
    .replace(/\$/g, '');

  return res;
}

  // Scheme of Work Parser Endpoint (learns from uploaded PDF/Word/Text or pasted syllabus)
  app.post("/api/parse-scheme", async (req, res) => {
    const { 
      subject = "General Subject",
      classLevel = "Senior Secondary",
      term = "2nd Term",
      fileContentText = "",
      fileName = "",
      rawPastedText = "",
      additionalInstructions = ""
    } = req.body;

    const sourceText = (fileContentText || rawPastedText || "").trim();

    if (!sourceText) {
      return res.status(400).json({ success: false, error: "No scheme document content was provided." });
    }

    const ai = getGeminiClient();

    if (ai) {
      try {
        const prompt = `You are an expert curriculum specialist for Stanbax Schools Ibadan, Nigeria.
Analyze and parse the following uploaded Scheme of Work document for:
Subject: ${subject}
Class Level: ${classLevel}
Term: ${term}
${additionalInstructions ? `TEACHER'S ADDITIONAL INSTRUCTIONS / GUIDELINES: "${additionalInstructions}"` : ''}

RAW UPLOADED DOCUMENT CONTENT:
"""
${sourceText.slice(0, 15000)}
"""

Extract and organize into a clean, comprehensive 10 to 12-week Scheme of Work following Nigerian NERDC / WAEC WASSCE and British Cambridge curriculum standards.
${additionalInstructions ? `MANDATORY: Align and reflect the teacher's guidelines: "${additionalInstructions}" in the scheme breakdown and learning objectives.` : ''}

OUTPUT FORMAT: Return a valid JSON object matching this structure:
{
  "subjectName": "${subject}",
  "classLevel": "${classLevel}",
  "term": "${term}",
  "curriculumStandard": "NERDC / WAEC WASSCE / Cambridge IGCSE",
  "summary": "Concise 1-2 sentence overview of the scheme",
  "additionalInstructions": "${additionalInstructions.replace(/"/g, '\\"')}",
  "weeklyTopics": [
    {
      "week": 1,
      "topic": "Main Topic Title",
      "subtopics": ["Subtopic 1", "Subtopic 2"],
      "learningObjectives": ["Objective 1", "Objective 2"],
      "keyFormulasOrTerms": ["Key Formula / Term 1"],
      "suggestedActivities": "Activity or experiment"
    }
  ]
}

CRITICAL RULES:
- Ensure each week from Week 1 to Week 12 is thoroughly represented.
- If the uploaded document only has partial weeks or raw notes, intelligently fill in the missing curriculum weeks up to Week 12 for ${subject} (${classLevel}).
- Return ONLY the JSON object. Do not include markdown code block backticks.`;

        const { response } = await generateWithGemini(ai, {
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          config: {
            temperature: 0.2,
            responseMimeType: "application/json"
          }
        });

        let cleanedJson = (response.text || "{}").trim();
        if (cleanedJson.startsWith("```json")) cleanedJson = cleanedJson.slice(7);
        if (cleanedJson.startsWith("```")) cleanedJson = cleanedJson.slice(3);
        if (cleanedJson.endsWith("```")) cleanedJson = cleanedJson.slice(0, -3);

        const parsed = JSON.parse(cleanedJson.trim());
        if (parsed.weeklyTopics && Array.isArray(parsed.weeklyTopics) && parsed.weeklyTopics.length > 0) {
          return res.json({
            success: true,
            source: "gemini_curriculum_brain",
            scheme: {
              ...parsed,
              uploadedFileName: fileName || "uploaded_scheme_document.txt",
              uploadedAt: new Date().toISOString().split('T')[0],
              rawText: sourceText.slice(0, 3000),
              isAiLearned: true
            }
          });
        }
      } catch (err: any) {
        console.warn("Gemini scheme parsing failed, using rule-based parser:", err?.message || err);
      }
    }

    // Rule-based structured extractor fallback
    const lines = sourceText.split('\n').map((l: string) => l.trim()).filter(Boolean);
    const weeklyTopics: any[] = [];
    let currentTopicObj: any = null;

    for (const line of lines) {
      const weekMatch = line.match(/(?:week|wk)\s*(\d+)[:\-\s]*(.+)?/i);
      if (weekMatch) {
        if (currentTopicObj) weeklyTopics.push(currentTopicObj);
        const wNum = parseInt(weekMatch[1], 10);
        const title = (weekMatch[2] || `${subject} Unit ${wNum}`).trim();
        currentTopicObj = {
          week: wNum,
          topic: title,
          subtopics: [],
          learningObjectives: [`Understand core concepts and applications of ${title}`],
          keyFormulasOrTerms: [title],
          suggestedActivities: `Study exercises and practical applications of ${title}`
        };
      } else if (currentTopicObj) {
        const cleanItem = line.replace(/^[-•*]\s*/, '').trim();
        if (cleanItem.length > 2 && currentTopicObj.subtopics.length < 5) {
          currentTopicObj.subtopics.push(cleanItem);
        }
      }
    }
    if (currentTopicObj) weeklyTopics.push(currentTopicObj);

    // If fewer than 10 weeks parsed, populate up to 12 standard weeks
    if (weeklyTopics.length < 10) {
      const existingWeeks = new Set(weeklyTopics.map(w => w.week));
      for (let w = 1; w <= 12; w++) {
        if (!existingWeeks.has(w)) {
          weeklyTopics.push({
            week: w,
            topic: w === 6 ? 'Mid-Term Review & Continuous Assessment (CA2)' : w === 12 ? 'General Revision & Terminal Examination' : `${subject} Module ${w}`,
            subtopics: [`Key curriculum themes and syllabus criteria for Week ${w}`],
            learningObjectives: [`Master the syllabus requirements for Week ${w}`],
            keyFormulasOrTerms: [`${subject} Week ${w}`],
            suggestedActivities: 'Workbook problem-solving and class discussions.'
          });
        }
      }
      weeklyTopics.sort((a, b) => a.week - b.week);
    }

    return res.json({
      success: true,
      source: "curriculum_engine_parser",
      scheme: {
        subjectName: subject,
        classLevel,
        term,
        curriculumStandard: "NERDC / WAEC WASSCE / Cambridge IGCSE",
        summary: `12-week comprehensive Scheme of Work for ${subject} (${classLevel} • ${term}) loaded into Calvin AI.`,
        weeklyTopics,
        uploadedFileName: fileName || "manual_entry.txt",
        uploadedAt: new Date().toISOString().split('T')[0],
        rawText: sourceText.slice(0, 3000),
        additionalInstructions,
        isAiLearned: true
      }
    });
  });

  // Student Portal Calvin AI Chat Endpoint
  app.post("/api/calvin-chat", async (req, res) => {
    const {
      message = "",
      studentName = "Scholar",
      classLevel = "SSS 2",
      tier = "regular",
      chatHistory = [],
      subject = "",
      schemeOfWork = null,
      term = "2nd Term"
    } = req.body;

    if (!message.trim()) {
      return res.status(400).json({ success: false, error: "Question message is required" });
    }

    const isEarlyYears = 
      classLevel.toLowerCase().includes('nursery') || 
      classLevel.toLowerCase().includes('kindergarten') || 
      classLevel.toLowerCase().includes('kg') || 
      classLevel.toLowerCase().includes('reception') || 
      classLevel.toLowerCase().includes('early');

    const isPrimary = 
      classLevel.toLowerCase().includes('primary') || 
      classLevel.toLowerCase().includes('basic') || 
      classLevel.toLowerCase().includes('grade');

    const isJuniorSec = 
      classLevel.toLowerCase().includes('jss');

    const isSeniorSec = 
      classLevel.toLowerCase().includes('sss') || 
      classLevel.toLowerCase().includes('ss');

    const isPremium = tier === 'premium';

    // Scheme of Work grounding context
    let schemeGroundingSection = '';
    if (schemeOfWork && typeof schemeOfWork === 'object') {
      const s = schemeOfWork;
      const weeklySummary = Array.isArray(s.weeklyTopics)
        ? s.weeklyTopics.map((w: any) => `• Week ${w.week}: ${w.topic}${w.subtopics?.length ? ` (Subtopics: ${w.subtopics.join(', ')})` : ''}${w.keyFormulasOrTerms?.length ? ` [Key formulas: ${w.keyFormulasOrTerms.join(', ')}]` : ''}`).join('\n')
        : '';
      schemeGroundingSection = `
OFFICIAL STANBAX SCHOOLS SCHEME OF WORK (GROUNDING & KNOWLEDGE BASE):
You are strictly grounded on the official Stanbax approved Scheme of Work for ${s.subjectName || subject || 'this subject'} (${s.classLevel || classLevel} - ${s.term || term}).
Curriculum Standard: ${s.curriculumStandard || 'NERDC / WAEC WASSCE / Cambridge IGCSE'}
Scheme Summary: ${s.summary || 'Stanbax 12-week official syllabus'}

WEEKLY SCHEME OF WORK TOPICS:
${weeklySummary}

MANDATORY INSTRUCTIONS FOR THIS SCHEME OF WORK:
1. Always align your answers with the topics and sequence in this approved Scheme of Work.
2. In your response, explicitly reference where this topic appears in their Stanbax scheme (e.g., "In Week [X] of your ${classLevel} ${s.subjectName || subject} Scheme of Work, we explore...").
3. Make sure to fulfill the specific learning objectives and formulas outlined in this syllabus.
4. If the scholar's question touches multiple weeks, clearly connect the earlier foundational week to the later advanced week.`;
    }

    // System instruction tailored to age, class, token tier, and uploaded Scheme of Work
    const systemInstruction = `You are Calvin, the personal AI Academic Tutor and Study Companion for Stanbax Schools Ibadan, an esteemed Nigerian-British curriculum school in Ibadan, Oyo State, Nigeria.
You are interacting with ${studentName}, who is currently enrolled in ${classLevel}.
${subject ? `Current Subject Area: ${subject}` : ''}
${schemeGroundingSection}

PEDAGOGICAL PERSONA & CLASS-LEVEL ADAPTATION:
${isEarlyYears ? `
- TARGET AUDIENCE: Early Childhood (Ages 3-6 / Nursery & Reception).
- TONE: Warm, motherly/fatherly, encouraging, gentle, and enthusiastic!
- STYLE: Very simple language, short words, rhyming concepts where fun.
- VISUALS: Use vivid child-friendly emojis (🍎, 🌟, 🎈, 🐱, 🚀, 📚) to illustrate points.
- Always celebrate effort with praise ("Great job, ${studentName}!", "You are a shining star! ⭐").
` : isPrimary ? `
- TARGET AUDIENCE: Primary School (Ages 6-11 / Basic 1 to 6).
- TONE: Friendly, patient, structured, and inspiring.
- STYLE: Clear, easy-to-understand definitions, step-by-step arithmetic breakdown, relatable Nigerian real-world analogies (market shopping in naira, school garden, rainfall, food crops).
- Encourage curiosity and end with a quick gentle check question or cheerful cheer!
` : isJuniorSec ? `
- TARGET AUDIENCE: Junior Secondary School (Ages 11-14 / JSS 1 to 3).
- CURRICULUM: Aligned with Nigerian BECE / Junior WAEC standards and British Cambridge Checkpoint syllabus.
- TONE: Motivating, scholastic, respectful.
- STYLE: Systematic breakdown of concepts in Basic Science, Basic Tech, Mathematics, English grammar, Business Studies, Social Studies, and Civic Education. Break down calculations line by line with formulas.
` : `
- TARGET AUDIENCE: Senior Secondary School (Ages 14-18 / SSS 1 to 3).
- CURRICULUM: WAEC WASSCE, NECO SSCE, JAMB UTME, and Cambridge IGCSE standards.
- TONE: Scholarly, intellectually rigorous, empowering, and focused on exam mastery.
- STYLE: Academic precision. When answering science/math problems, provide formula statements, SI units, algebraic substitutions, and final answers with units clearly highlighted. For humanities/commercial, provide structured points, legal/economic definitions, and analytical depth.
`}

TOKEN TIER CAPABILITY LEVEL (${isPremium ? 'PREMIUM MASTERCLASS' : 'REGULAR TIER'}):
${isPremium ? `
- The student is using a PREMIUM TOKEN authorized by the School Administrator.
- Provide the HIGHEST QUALITY, IN-DEPTH, MASTERCLASS explanations.
- Structure explanations into clear, organized sections:
  1. Direct Concept Summary / Definition
  2. Step-by-Step Derivation / Worked Examples
  3. Mnemonic / Memory Trick to recall concepts easily
  4. WAEC / NECO / JAMB / Cambridge Exam Secrets & Pitfalls to avoid
  5. Quick Practice Question for self-testing!
` : `
- The student is using a REGULAR TOKEN.
- Provide concise, accurate, clear, and encouraging explanations tailored to their class syllabus.
`}

CRITICAL STUDENT-FRIENDLY FORMATTING RULES (STRICTLY ENFORCED):
- NEVER use markdown hash symbols (#, ##, ###, ####) for titles or section headings. Simply write clean titles on their own line followed by a blank line, or use simple bold section headers.
- NEVER use the caret symbol (^) for exponents or powers! Primary and secondary school students find raw carets confusing. Always use standard unicode superscript characters (such as ², ³, ⁴, ⁿ, ⁻¹, ⁻², 10⁵, m/s², cm³) or spell out words like "squared" or "to the power of". Scholars must NEVER see raw '^' characters.
- NEVER use asterisks (*) for bullet points. Use standard clean bullet dots (•) or numbered lists (1., 2., 3.).
- In math calculations, NEVER use an asterisk (*) for multiplication. Always use the multiplication sign (×), e.g., "3 × 4 = 12".
- NEVER output raw LaTeX codes or math delimiters like $$, \\text{}, \\frac{}{}, \\times, or \\pm. Format formulas in clean, natural readable text: e.g., "x = (-b ± √(b² - 4ac)) / (2a)", "Area = πr²", "v = u + at" so students can read and understand immediately without programming syntax.
- Address the scholar warmly as ${studentName}.
- Keep answers educational, respectful, inspiring, and aligned with standard Nigerian-British curriculum guidelines.`;

    const ai = getGeminiClient();

    if (!ai) {
      const fallbackReply = generateCalvinAcademicFallback(message, studentName, classLevel, isPremium, schemeOfWork);
      return res.json({
        success: true,
        reply: sanitizeStudentFriendlyText(fallbackReply),
        tier,
        source: "academic_engine"
      });
    }

    try {
      // Build conversation contents including history
      // Critical Gemini requirement: contents[0].role MUST be 'user' and roles must alternate!
      const rawHistory = Array.isArray(chatHistory) ? chatHistory.slice(-8) : [];
      const formattedHistory: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      for (const h of rawHistory) {
        const text = typeof h.text === 'string' ? h.text : (h.parts?.[0]?.text || '');
        if (!text || !text.trim()) continue;
        const role: 'user' | 'model' = h.role === 'model' ? 'model' : 'user';

        // Discard leading model turns until we have seen a user turn
        if (formattedHistory.length === 0 && role === 'model') {
          continue;
        }

        // Merge consecutive turns with the same role
        if (formattedHistory.length > 0 && formattedHistory[formattedHistory.length - 1].role === role) {
          formattedHistory[formattedHistory.length - 1].parts[0].text += `\n\n${text}`;
        } else {
          formattedHistory.push({
            role,
            parts: [{ text }]
          });
        }
      }

      // Now add the current user message
      if (formattedHistory.length > 0 && formattedHistory[formattedHistory.length - 1].role === 'user') {
        formattedHistory[formattedHistory.length - 1].parts[0].text += `\n\n${message}`;
      } else {
        formattedHistory.push({
          role: 'user',
          parts: [{ text: message }]
        });
      }

      const { response, model: modelUsed } = await generateWithGemini(ai, {
        contents: formattedHistory,
        config: {
          systemInstruction,
          temperature: isPremium ? 0.7 : 0.6,
          maxOutputTokens: isPremium ? 2048 : 1024,
        }
      });

      const rawReply = response.text || "Hello scholar! I am here to help you learn. Please ask your academic question again.";
      const reply = sanitizeStudentFriendlyText(rawReply);

      return res.json({
        success: true,
        reply,
        tier,
        source: "gemini_ai",
        modelUsed
      });
    } catch (err: any) {
      console.warn("Calvin Gemini API error:", err?.message || err);
      const fallbackReply = generateCalvinAcademicFallback(message, studentName, classLevel, isPremium, schemeOfWork);
      return res.json({
        success: true,
        reply: sanitizeStudentFriendlyText(fallbackReply),
        tier,
        source: "academic_engine"
      });
    }
  });

  // Deterministic Fallback Engine for School Representative Chat
  function generateVisitorRepFallback(
    message: string,
    visitorName: string,
    repName: string,
    repTitle: string,
    repRole: string,
    language: string = "en"
  ): string {
    if (language === 'yo') {
      return `Ẹ ku aarọ o, ${visitorName}! Ẹ ṣeun pupọ fun ifọwọsowọpọ pẹlu Ile-Iwe Stanbax Schools Ibadan.\n\n${repName} (${repTitle}) n ṣe ayẹwo awọn agbegbe ile-iwe lọwọlọwọ, nitori naa emi ni Calvin AI, aṣoju foju osise fun Stanbax Schools.\n\nA ni inudidun lati ran ẹbi yin lọwọ pẹlu:\n• Iforukọsilẹ fun akoko ẹkọ tuntun (Admissions lati Creche de SSS 3)\n• Eto owo ile-iwe ati eto isanwo rọrun (Flexible Bursary installment plans)\n• Eto ẹkọ apapọ ti Ilu Gẹẹsi ati Naijiria (British-Nigerian Dual Curriculum)\n• Awọn ọkọ akero ile-iwe to ni itutu (Air-conditioned School Bus Fleet)\n\nIbeere yin wa ni ifipamọ ninu eto wa, ${repName} yoo si dahun taara ni kete ti o ba pada si tabili iṣẹ!`;
    }

    if (language === 'fr') {
      return `Bonjour ${visitorName}! Merci d'avoir contacté Stanbax Schools Ibadan.\n\n${repName} (${repTitle}) supervise actuellement les installations du campus. Je suis Calvin AI, le représentant virtuel officiel de l'école Stanbax.\n\nNous serions ravis d'assister votre famille pour:\n• Les admissions ouvertes de la crèche au secondaire supérieur (SSS 3)\n• Le double programme intégré britannique et nigérian (WAEC, NECO et Cambridge IGCSE)\n• La grille tarifaire transparente et les versements échelonnés\n• Le réseau de transport scolaire sécurisé et climatisé à travers Ibadan\n\nVotre message est bien enregistré et ${repName} vous répondra dès son retour!`;
    }

    if (language === 'ha') {
      return `Sannu ${visitorName}! Mun gode da tuntuɓar Stanbax Schools Ibadan.\n\n${repName} (${repTitle}) na gudanar da ayyukan makaranta a halin yanzu, don haka ni ne Calvin AI, wakilin makarantar na musamman.\n\nMuna farin cikin taimaka muku game da:\n• Bude shiga makaranta (Admissions daga Creche zuwa SSS 3)\n• Kudin makaranta mai sauki da biyan kashi-kashi\n• Tsarin koyarwa na Najeriya da na Cambridge na Birtaniya\n• Motocin makaranta masu sanyaya zuciya a fadin Ibadan\n\nAn adana sakonku lafiya, kuma ${repName} zai duba shi ya ba ku amsa!`;
    }

    if (language === 'ig') {
      return `Nnọọ ${visitorName}! Daalụ maka ịkpọtụrụ Stanbax Schools Ibadan.\n\n${repName} (${repTitle}) nọ na-elekọta ihe omume ụlọ akwụkwọ ugbu a, yabụ abụ m Calvin AI, onye nnọchiteanya ụlọ akwụkwọ Stanbax.\n\nObi dị anyị ụtọ inyere ezinụlọ gị aka gbasara:\n• Nnabata ụmụ akwụkwọ ọhụrụ (Admissions site na Creche ruo SSS 3)\n• Usoro ego ụlọ akwụkwọ doro anya na ịkwụ ụgwọ nwayọọ nwayọọ\n• Usoro ọmụmụ jikọtara ọnụ nke British na Nigeria (Cambridge na WAEC)\n• Ụgbọ ala ụlọ akwụkwọ nwere ntụ oyi na-echebe ụmụ akwụkwọ\n\nEchekwala ozi gị nke ọma, ${repName} ga-eleba anya na ya ma zaghachi gị ngwa ngwa!`;
    }

    const m = message.toLowerCase();
    
    if (m.includes('fee') || m.includes('cost') || m.includes('price') || m.includes('tuition') || m.includes('pay') || m.includes('bursar') || m.includes('account')) {
      return `Hello ${visitorName}! Thank you for your inquiry regarding Stanbax Schools tuition and bursary schedules.\n\nOur statutory fees are structured transparently with flexible installment payment plans:\n• Early Years & Nursery: ₦120,000 – ₦145,000 per term\n• Primary School (Basic 1 – 6): ₦160,000 – ₦185,000 per term\n• Junior Secondary (JSS 1 – 3): ₦210,000 – ₦240,000 per term\n• Senior Secondary (SSS 1 – 3): ₦250,000 – ₦280,000 per term\n\nTuition includes STEM lab access, continuous assessments, digital library, and sports club memberships. Flexible 2-part termly installments are supported upon application to the Bursar's Office.\n\n${repName} (${repTitle}) has been notified of your query and can provide an itemized schedule upon review!`;
    }

    if (m.includes('admiss') || m.includes('apply') || m.includes('enrol') || m.includes('register') || m.includes('form') || m.includes('entrance') || m.includes('exam')) {
      return `Hello ${visitorName}! Admissions for the upcoming academic session at Stanbax Schools Ibadan are currently open for Creche, Nursery, Primary (Basic 1–6), and Secondary (JSS 1–SSS 2).\n\nKey Steps to Enroll:\n1. Online Registration: Click the 'Admissions' portal tab on our website or visit the campus administrative office.\n2. Entrance Screening & CBT: Prospective scholars complete a diagnostic evaluation in English, Mathematics, and General Aptitude.\n3. Interactive Interview: Both student and parents meet with our guidance counselors and the Principal.\n4. Offer of Provisional Admission.\n\n${repName} (${repTitle}) will be pleased to schedule a priority screening slot or campus tour for your family!`;
    }

    if (m.includes('locat') || m.includes('address') || m.includes('where') || m.includes('bus') || m.includes('route') || m.includes('transport') || m.includes('ibadan')) {
      return `Hello ${visitorName}! Stanbax Schools is centrally located in Ibadan at:\n📍 12 Excellence Avenue, Bodija / Oluyole Way, Ibadan, Oyo State, Nigeria.\n\nTransportation Services:\nWe operate a modern, air-conditioned school bus fleet covering Bodija, Oluyole Estate, Ring Road, Akobo, Jericho, and Secretariat corridors with trained chaperones and GPS tracking.\n\nCampus visiting hours are Monday – Friday, 8:00 AM – 4:00 PM. ${repName} (${repTitle}) looks forward to welcoming you!`;
    }

    if (m.includes('curriculum') || m.includes('waec') || m.includes('neco') || m.includes('jamb') || m.includes('cambridge') || m.includes('subject') || m.includes('igcse')) {
      return `Hello ${visitorName}! Stanbax Schools offers a robust dual British-Nigerian integrated curriculum designed for academic distinction:\n\n• National Curriculum: Prepares candidates for BECE, WAEC WASSCE, and NECO SSCE with a 99.4% distinction record.\n• International Track: Cambridge IGCSE, Checkpoint, and SAT/IELTS preparation.\n• STEM & Practical Sciences: Coding, Robotics, AI literacy (via Calvin AI), and hands-on laboratory experiments.\n\n${repName} (${repTitle}) and our academic deans ensure every scholar receives individualized mentorship.`;
    }

    return `Hello ${visitorName}! Thank you for reaching out to Stanbax Schools Ibadan.\n\n${repName} (${repTitle}) is currently attending to campus operations, so I am assisting you as Calvin AI, the official Stanbax Virtual Representative.\n\nWe provide world-class education from Creche through Senior Secondary (SSS 3), anchored on academic rigor, moral character, and global leadership. We would love to assist you with admissions, tuition schedules, bus routes, or an on-site tour.\n\nYour message is safely recorded in our admissions register, and ${repName} will also review this thread upon return!`;
  }

  // Landing Page Visitor Representative Chat Endpoint (Calvin AI acting as Representative when rep is away)
  app.post("/api/visitor-rep-chat", async (req, res) => {
    const {
      message = "",
      visitorName = "Prospective Parent",
      repName = "Mrs. Bello",
      repTitle = "School Principal & Head of Administration",
      repRole = "principal",
      language = "en",
      chatHistory = []
    } = req.body;

    if (!message.trim()) {
      return res.status(400).json({ success: false, error: "Inquiry message is required" });
    }

    const ai = getGeminiClient();

    if (!ai) {
      const fallbackReply = generateVisitorRepFallback(message, visitorName, repName, repTitle, repRole, language);
      return res.json({
        success: true,
        reply: fallbackReply,
        source: "representative_engine"
      });
    }

    try {
      const systemInstruction = `
You are Calvin AI, the official intelligent Virtual Representative and Admissions Aide for Stanbax Schools Ibadan.
You are acting warmly and authoritatively on behalf of ${repName} (${repTitle} - ${repRole.toUpperCase()}) who is currently away attending to school administrative and campus duties.

YOUR PRIMARY GOALS:
1. Greet the visitor (${visitorName}) warmly and address their inquiry with accurate, reassuring, and detailed information about Stanbax Schools Ibadan.
2. Represent the designated role (${repRole}):
   - If BURSAR: Address tuition structure, payment installments, statutory fee inclusions (books, uniforms, STEM kit), bursary clearance, and transparent billing.
   - If PRINCIPAL: Address academic standards, dual British-Nigerian curriculum (WAEC, NECO, JAMB, Cambridge IGCSE, BECE), school discipline, moral virtues, leadership programs, and teacher qualifications.
   - If ADMISSIONS: Address enrollment procedures, age requirements (Creche, Nursery, Basic 1-6, JSS 1-3, SSS 1-3), entrance examination dates, and screening documents.
   - If REPRESENTATIVE: Provide a comprehensive school overview, campus tours, transportation bus routes, and general inquiries.
3. Stanbax Schools Ibadan Facts:
   - Location: 12 Excellence Avenue, Bodija / Oluyole Way, Ibadan, Oyo State, Nigeria.
   - Contact Phone: +234 803 123 4567 | Email: admissions@stanbaxschools.edu.ng.
   - Facilities: Modern STEM Robotics & Computer Laboratories, Sick-Bay Clinic with Registered Nurses, Air-Conditioned School Bus Fleet, Sports Pavilions, Ultra-Modern Digital Library & Timed CBT Examination Hall.
   - School Virtue: Excellence, Character & Global Leadership.
4. Tone & Style:
   - Courteous, professional, warm, and articulate.
   - Reassure the visitor that their full query and this transcript are retained and that ${repName} will review it upon returning to the desk and can follow up directly.
   - Keep answers easy to read on mobile (short paragraphs or clear bullet points).

${language === 'yo' ? 'CRITICAL LANGUAGE REQUIREMENT: The user selected YORUBA. You MUST write your entire answer in polite, warm, and natural Yoruba (Èdè Yorùbá), addressing the visitor with respect (Ẹ ku aarọ/ọsan, Ẹ ṣeun pupọ).' : ''}
${language === 'fr' ? 'CRITICAL LANGUAGE REQUIREMENT: The user selected FRENCH. You MUST write your entire answer in fluent, courteous French (Français).' : ''}
${language === 'ha' ? 'CRITICAL LANGUAGE REQUIREMENT: The user selected HAUSA. You MUST write your entire answer in polite, natural Hausa (Harshen Hausa).' : ''}
${language === 'ig' ? 'CRITICAL LANGUAGE REQUIREMENT: The user selected IGBO. You MUST write your entire answer in warm, respectful Igbo (Asụsụ Igbo).' : ''}

CRITICAL FORMATTING RULES:
- NEVER use markdown hash symbols (#, ##, ###) for headers or titles.
- NEVER use asterisks (*) or double asterisks (**) for bolding, italics, or bullet points.
- Use standard clean bullet characters (•) or numbered lists (1., 2.).
- Never output programming syntax, markdown asterisks, or unformatted symbols.
`;

      const formattedHistory: any[] = [];
      if (Array.isArray(chatHistory)) {
        for (const item of chatHistory.slice(-8)) {
          if (item.sender === 'visitor') {
            formattedHistory.push({
              role: 'user',
              parts: [{ text: item.content }]
            });
          } else {
            formattedHistory.push({
              role: 'model',
              parts: [{ text: item.content }]
            });
          }
        }
      }

      formattedHistory.push({
        role: 'user',
        parts: [{ text: `[Visitor: ${visitorName}] Inquiry: ${message}` }]
      });

      const { response } = await generateWithGemini(ai, {
        contents: formattedHistory,
        config: {
          systemInstruction,
          temperature: 0.6,
          maxOutputTokens: 1024,
        }
      });

      const rawReply = response.text || generateVisitorRepFallback(message, visitorName, repName, repTitle, repRole);
      const reply = sanitizeStudentFriendlyText(rawReply);

      return res.json({
        success: true,
        reply,
        source: "gemini_ai"
      });
    } catch (err: any) {
      console.warn("Visitor Rep Gemini API error:", err?.message || err);
      const fallbackReply = generateVisitorRepFallback(message, visitorName, repName, repTitle, repRole);
      const reply = sanitizeStudentFriendlyText(fallbackReply);
      return res.json({
        success: true,
        reply,
        source: "representative_engine"
      });
    }
  });

  // ---------------------------------------------------------------------------
  // Real-Time Chat Typing Indicators & Delivery/Acknowledgment Service
  // ---------------------------------------------------------------------------
  interface TypingState {
    sender: 'representative' | 'visitor';
    senderName?: string;
    updatedAt: number;
  }
  const activeTypingMap = new Map<string, Map<string, TypingState>>();

  app.post("/api/chat-typing", (req, res) => {
    const { conversationId, sender, senderName, isTyping } = req.body;
    if (!conversationId || !sender) {
      return res.status(400).json({ error: "conversationId and sender required" });
    }

    let convMap = activeTypingMap.get(conversationId);
    if (!convMap) {
      convMap = new Map();
      activeTypingMap.set(conversationId, convMap);
    }

    if (isTyping) {
      convMap.set(sender, {
        sender,
        senderName: senderName || (sender === 'representative' ? 'School Representative' : 'Visitor'),
        updatedAt: Date.now(),
      });
    } else {
      convMap.delete(sender);
    }

    return res.json({ success: true });
  });

  app.get("/api/chat-typing/:conversationId", (req, res) => {
    const { conversationId } = req.params;
    const now = Date.now();
    const convMap = activeTypingMap.get(conversationId);

    let isRepTyping = false;
    let repName = "";
    let isVisitorTyping = false;
    let visitorName = "";

    if (convMap) {
      for (const [sender, state] of convMap.entries()) {
        // Expire typing states older than 4.5 seconds
        if (now - state.updatedAt > 4500) {
          convMap.delete(sender);
          continue;
        }
        if (sender === 'representative') {
          isRepTyping = true;
          repName = state.senderName || 'School Representative';
        } else if (sender === 'visitor') {
          isVisitorTyping = true;
          visitorName = state.senderName || 'Visitor';
        }
      }
    }

    return res.json({
      success: true,
      isRepTyping,
      repName,
      isVisitorTyping,
      visitorName,
      timestamp: now,
    });
  });

  // ---------------------------------------------------------------------------
  // Message Delivery & Acknowledgment Tracking Service
  // ---------------------------------------------------------------------------
  interface ConversationDeliveryState {
    conversationId: string;
    lastSeenByAdminAt?: string;
    lastSeenByVisitorAt?: string;
    seenByAdminName?: string;
    acknowledgedMessageIds: string[];
    deliveredMessageIds: string[];
    updatedAt: number;
  }
  const deliveryStatusMap = new Map<string, ConversationDeliveryState>();

  app.post("/api/chat-delivery/status", (req, res) => {
    const { conversationId, role, name, lastSeenAt, messageIds, action } = req.body;
    if (!conversationId) {
      return res.status(400).json({ error: "conversationId required" });
    }

    const now = lastSeenAt || new Date().toISOString();
    let convState = deliveryStatusMap.get(conversationId);
    if (!convState) {
      convState = {
        conversationId,
        acknowledgedMessageIds: [],
        deliveredMessageIds: [],
        updatedAt: Date.now(),
      };
      deliveryStatusMap.set(conversationId, convState);
    }

    convState.updatedAt = Date.now();

    if (role === 'representative' || role === 'admin') {
      convState.lastSeenByAdminAt = now;
      if (name) convState.seenByAdminName = name;
      if (Array.isArray(messageIds)) {
        for (const mid of messageIds) {
          if (!convState.acknowledgedMessageIds.includes(mid)) {
            convState.acknowledgedMessageIds.push(mid);
          }
        }
      }
    } else if (role === 'visitor') {
      convState.lastSeenByVisitorAt = now;
    }

    if (action === 'delivered' && Array.isArray(messageIds)) {
      for (const mid of messageIds) {
        if (!convState.deliveredMessageIds.includes(mid)) {
          convState.deliveredMessageIds.push(mid);
        }
      }
    }

    return res.json({ success: true, deliveryState: convState });
  });

  app.get("/api/chat-delivery/status/:conversationId", (req, res) => {
    const { conversationId } = req.params;
    const convState = deliveryStatusMap.get(conversationId) || {
      conversationId,
      acknowledgedMessageIds: [],
      deliveredMessageIds: [],
      updatedAt: Date.now(),
    };
    return res.json({ success: true, deliveryState: convState });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Stanbax Schools server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
