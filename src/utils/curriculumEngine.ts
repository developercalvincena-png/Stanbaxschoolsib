export interface LocalAssessmentRequest {
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

export interface LocalAssessmentResponse {
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

export function generateLocalCurriculumAssessment(req: LocalAssessmentRequest): LocalAssessmentResponse {
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

  const objectives: LocalAssessmentResponse['objectives'] = [];
  const theory: LocalAssessmentResponse['theory'] = [];
  let readingPassage: LocalAssessmentResponse['readingPassage'] | undefined = undefined;

  const subjectLower = req.subject.toLowerCase();
  const isEnglish = subjectLower.includes('eng') || subjectLower.includes('lit') || subjectLower.includes('use of english');

  if (isEarlyYears) {
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

      // 2. QUESTIONS 1 TO 5: STRICTLY COMPREHENSION BASED ON THE PASSAGE
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
      // NON-ENGLISH SUBJECTS
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
          } else if (subjectLower.includes("bio") || subjectLower.includes("sci") || subjectLower.includes("agric")) {
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
        } else if (subjectLower.includes("bio") || subjectLower.includes("sci") || subjectLower.includes("agric")) {
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
    markingGuide,
    difficulty: req.difficulty || 'Standard (WAEC / BECE Standard)'
  };
}
