export interface ConstitutionalArticle {
  article: string;
  part: string;
  title: string;
  textSummary: string;
  urduSummary: string;
  romanUrduSummary: string;
  applicableAuthorities: string[];
}

export interface PakistanStatute {
  id: string;
  lawName: string;
  year: string;
  domain: string;
  keySections: string;
  description: string;
  urduDescription: string;
  romanUrduDescription: string;
  authorityName: string;
  authorityShortName: string;
  portalUrl: string;
  email: string;
  helpline: string;
}

export const CONSTITUTION_OF_PAKISTAN_1973: ConstitutionalArticle[] = [
  {
    article: "Article 1, Article 2 & Article 2A",
    part: "Part I – Introductory",
    title: "The Republic, State Religion & The Objectives Resolution",
    textSummary:
      "Pakistan shall be a Federal Republic known as the Islamic Republic of Pakistan comprising Balochistan, Khyber Pakhtunkhwa, Punjab, Sindh, and Islamabad Capital Territory (Art. 1). Islam is the State religion (Art. 2). The Objectives Resolution (democracy, freedom, equality, tolerance, social justice, and independence of the judiciary) is a substantive part of the Constitution (Art. 2A).",
    urduSummary:
      "پاکستان ایک وفاقی اسلامی جمہوریہ ہے اور قراردادِ مقاصد (جمہوریت، مساوات، سماجی انصاف اور عدلیہ کی آزادی) آئین کا باقاعدہ اور قابلِ نفاذ حصہ ہے۔",
    romanUrduSummary:
      "Pakistan ek wifaqi Islami jamhooriya hai aur Objectives Resolution (insaf, barabari aur adliya ki azadi) Aaeen ka hissa hai.",
    applicableAuthorities: ["Supreme Court of Pakistan", "High Courts", "All State Organs"],
  },
  {
    article: "Article 3",
    part: "Part I – Introductory",
    title: "Elimination of Exploitation",
    textSummary:
      "The State shall ensure the elimination of all forms of exploitation and the gradual fulfillment of the fundamental principle, from each according to his ability to each according to his work.",
    urduSummary:
      "ریاست ہر قسم کے استحصال کے خاتمے کو یقینی بنائے گی اور ہر شخص کو اس کی محنت اور اہلیت کے مطابق معاوضہ ملنے کے اصول کو نافذ کرے گی۔",
    romanUrduSummary:
      "Riyasat har qisam ke istehsal (exploitation) ka khatma karegi aur har shaks ko uski mehnat ka poora haq dilwayegi.",
    applicableAuthorities: ["Labour Courts", "NIRC", "Minimum Wages Boards", "High Courts"],
  },
  {
    article: "Article 4",
    part: "Part I – Introductory (Rule of Law)",
    title: "Right of Individuals to be Dealt with in Accordance with Law",
    textSummary:
      "(1) To enjoy the protection of law and to be treated in accordance with law is the inalienable right of every citizen. (2)(a) No action detrimental to the life, liberty, body, reputation or property of any person shall be taken except in accordance with law. (b) No person shall be prevented from or be hindered in doing that which is not prohibited by law. (c) No person shall be compelled to do that which the law does not require him to do.",
    urduSummary:
      "قانون کا تحفظ اور قانون کے مطابق سلوک ہر شہری کا ناقابلِ تنسیخ حق ہے۔ کسی شخص کی جان، آزادی، شہرت یا جائیداد کے خلاف قانون کے سوا کوئی اقدام نہیں کیا جا سکتا اور نہ ہی کسی کو ایسا کام کرنے پر مجبور کیا جا سکتا ہے جو قانون میں لازم نہ ہو۔",
    romanUrduSummary:
      "Qanoon ka tahaffuz har shehri ka bunyadi haq hai. Kisi shaks ki jaan, azadi, izzat ya jaidad ke khilaf ghalat karrawai nahi ho sakti.",
    applicableAuthorities: ["High Court (Art. 199)", "Wafaqi Mohtasib", "All Public Authorities"],
  },
  {
    article: "Article 5 & Article 6",
    part: "Part I – Introductory",
    title: "Loyalty to State, Obedience to Constitution and Law & High Treason",
    textSummary:
      "Loyalty to the State is the basic duty of every citizen, and obedience to the Constitution and law is the inviolable obligation of every citizen and every public official (Art. 5). Subverting or abrogating the Constitution is high treason (Art. 6).",
    urduSummary:
      "ریاست سے وفاداری اور آئین و قانون کی اطاعت ہر شہری اور ہر سرکاری افسر کا ناقابلِ تغیر فرض ہے۔",
    romanUrduSummary:
      "Aaeen aur qanoon ki pabandi har shehri aur har sarkari afsar par farz hai.",
    applicableAuthorities: ["All Courts & Public Authorities"],
  },
  {
    article: "Article 8",
    part: "Part II, Chapter 1 – Fundamental Rights",
    title: "Laws Inconsistent with or in Derogation of Fundamental Rights to be Void",
    textSummary:
      "Any law, custom, usage, notification, university policy, or administrative order having the force of law, insofar as it is inconsistent with Fundamental Rights (Articles 9 to 28), shall be void.",
    urduSummary:
      "بنیادی حقوق سے متصادم کوئی بھی قانون، رسم و رواج، نوٹیفکیشن یا سرکاری حکم باطل تصور ہو گا۔",
    romanUrduSummary:
      "Bunyadi haqooq ke khilaf koi bhi qanoon, policy ya sarkari hukam qanoonan kal-adam (void) hoga.",
    applicableAuthorities: ["Supreme Court of Pakistan", "High Courts"],
  },
  {
    article: "Article 9 & Article 9A",
    part: "Part II, Chapter 1 – Fundamental Rights",
    title: "Security of Person (Right to Life & Liberty) & Clean Environment",
    textSummary:
      "No person shall be deprived of life or liberty save in accordance with law (Art. 9). Supreme Court jurisprudence holds that 'life' includes livelihood, healthcare, clean water, and human dignity. Under Article 9A (26th Amendment, 2024), every person is entitled to a clean, healthy, and sustainable environment.",
    urduSummary:
      "کسی شخص کو قانون کے مطابق کارروائی کے بغیر زندگی یا آزادی سے محروم نہیں کیا جائے گا (آرٹیکل 9)، اور ہر شخص کو صاف اور صحت مند ماحول کا حق حاصل ہے (آرٹیکل 9A)۔",
    romanUrduSummary:
      "Kisi bhi shaks ko qanoon ke baghair zindagi ya azadi se mehroom nahi kiya ja sakta (Art. 9) aur saaf mahol har shehri ka haq hai (Art. 9A).",
    applicableAuthorities: ["Police Complaint Cell (1787)", "Sessions Court (Sec. 491 CrPC)", "High Court", "EPA"],
  },
  {
    article: "Article 10",
    part: "Part II, Chapter 1 – Fundamental Rights",
    title: "Safeguards as to Arrest and Detention",
    textSummary:
      "(1) No person who is arrested shall be detained in custody without being informed, as soon as may be, of the grounds for such arrest, nor shall he be denied the right to consult and be defended by a legal practitioner of his choice. (2) Every person who is arrested and detained in custody shall be produced before a Magistrate within a period of twenty-four hours of such arrest.",
    urduSummary:
      "ہر گرفتار شخص کو فوری طور پر گرفتاری کی وجہ بتانا، اپنی پسند کے وکیل سے مشورہ کرنے دینا اور 24 گھنٹے کے اندر علاقہ مجسٹریٹ کے سامنے پیش کرنا لازم ہے۔",
    romanUrduSummary:
      "Giraftar shuda shaks ko giraftari ki wajah batana, wakeel se milne dena aur 24 ghantay ke andar Magistrate ke samne pesh karna lazmi hai.",
    applicableAuthorities: ["Area Magistrate", "Sessions Judge (Sec. 491 CrPC)", "IGP Police Complaint Cell", "High Court"],
  },
  {
    article: "Article 10A",
    part: "Part II, Chapter 1 – Fundamental Rights",
    title: "Right to Fair Trial and Due Process",
    textSummary:
      "For the determination of his civil rights and obligations or in any criminal charge against him, a person shall be entitled to a fair trial and due process (including prior show-cause notice, right to present evidence, right to cross-examine, and an impartial decision-maker).",
    urduSummary:
      "شہری حقوق و فرائض کے تعین یا کسی فوجداری الزام میں ہر شخص کو منصفانہ ٹرائل اور قانونی تقاضے پورے کیے جانے (اپنا مؤقف پیش کرنے اور شوکاز نوٹس) کا حق حاصل ہے۔",
    romanUrduSummary:
      "Har muqadmay ya departmental karrawai mein show-cause notice aur munsifana sunwai (Fair Trial & Due Process) har shehri ka aaeeni haq hai.",
    applicableAuthorities: ["All Courts", "Wafaqi Mohtasib", "Service Tribunals", "HEC"],
  },
  {
    article: "Article 11",
    part: "Part II, Chapter 1 – Fundamental Rights",
    title: "Slavery, Forced Labour & Child Labour Prohibited",
    textSummary:
      "Slavery is non-existent and forbidden. All forms of forced labour, bonded labour (Peshgi), and human trafficking are prohibited. No child below the age of 14 years shall be engaged in any factory, mine, or other hazardous employment.",
    urduSummary:
      "غلامی، جبری مشقت، بغیر تنخواہ کام کروانا، انسانی اسمگلنگ اور 14 سال سے کم عمر بچوں سے کارخانوں یا خطرناک جگہوں پر مشقت کروانے کی مکمل ممانعت ہے۔",
    romanUrduSummary:
      "Jabri mushaqqat (forced/bonded labour) aur 14 saal se kam umar bachon se karkhanon mein mazdoori karwana qanoonan jurm hai.",
    applicableAuthorities: ["Labour Department", "District Vigilance Committee", "NCHR", "Ministry of Human Rights (1099)"],
  },
  {
    article: "Article 12 & Article 13",
    part: "Part II, Chapter 1 – Fundamental Rights",
    title: "Protection Against Retrospective Punishment, Double Jeopardy & Self-Incrimination",
    textSummary:
      "No law shall authorize punishment for an act that was not punishable when committed (Art. 12). No person shall be prosecuted or punished for the same offence more than once (Double Jeopardy), nor shall any person, when accused of an offence, be compelled to be a witness against himself (Art. 13).",
    urduSummary:
      "کسی شخص کو ماضی کے کسی ایسے عمل پر سزا نہیں دی جا سکتی جو اس وقت جرم نہ تھا (آرٹیکل 12)، نہ ایک ہی جرم کی دو بار سزا ہو سکتی ہے اور نہ ہی اپنے خلاف زبردستی گواہی یا اعتراف پر مجبور کیا جا سکتا ہے (آرٹیکل 13)۔",
    romanUrduSummary:
      "Ek hi jurm ki do baar saza nahi ho sakti aur na hi police kisi ko apne khilaf zabardasti bayan ya gawahi dene par majboor kar sakti hai.",
    applicableAuthorities: ["Criminal Courts", "Sessions Courts", "High Courts"],
  },
  {
    article: "Article 14",
    part: "Part II, Chapter 1 – Fundamental Rights",
    title: "Inviolability of Dignity of Man, Privacy of Home & Prohibition of Torture",
    textSummary:
      "(1) The dignity of man and, subject to law, the privacy of home (Chadar aur Char Diwari), shall be inviolable. (2) No person shall be subjected to torture for the purpose of extracting evidence. Entering a house without a warrant or search compliance under Sec. 103 CrPC violates Article 14.",
    urduSummary:
      "انسان کا شرف و وقار اور گھر کی چادر و چار دیواری کا تقدس ناقابلِ پامالی ہے۔ ثبوت یا بیان حاصل کرنے کے لیے کسی شخص پر تشدد کرنا قطعی طور پر غیر آئینی اور جرم ہے۔",
    romanUrduSummary:
      "Har insaan ki izzat-e-nafs aur ghar ki chadar aur char diwari muqaddas hai. Saboot ke liye police tashaddud (torture) aur warrant ke baghair ghar mein ghusna ghair-qanooni hai.",
    applicableAuthorities: ["FIA Cybercrime (1991)", "IGP Police (1787)", "NCHR", "MoHR (1099)", "Sessions Court"],
  },
  {
    article: "Article 15, Article 16 & Article 17",
    part: "Part II, Chapter 1 – Fundamental Rights",
    title: "Freedom of Movement, Peaceful Assembly & Association",
    textSummary:
      "Every citizen has the right to remain in, enter, and move freely throughout Pakistan and to hold a passport (Art. 15), assemble peacefully without arms (Art. 16), and form associations, unions, or political parties (Art. 17).",
    urduSummary:
      "ہر شہری کو پاکستان میں آزادانہ نقل و حرکت اور پاسپورٹ کے حصول (آرٹیکل 15)، پرامن اجتماع (آرٹیکل 16) اور انجمن یا ٹریڈ یونین بنانے (آرٹیکل 17) کا حق حاصل ہے۔",
    romanUrduSummary:
      "Pakistan mein azadana aamad-o-raft, passport hasil karne, pur-aman ijtima aur union/association banane ka aaeeni haq hasil hai.",
    applicableAuthorities: ["Directorate of Passports", "NIRC", "Wafaqi Mohtasib", "High Courts"],
  },
  {
    article: "Article 18",
    part: "Part II, Chapter 1 – Fundamental Rights",
    title: "Freedom of Trade, Business or Profession",
    textSummary:
      "Every citizen shall have the right to enter upon any lawful profession or occupation, and to conduct any lawful trade or business, subject only to lawful licensing and regulation.",
    urduSummary:
      "ہر شہری کو کوئی بھی جائز پیشہ، ملازمت یا کاروبار اختیار کرنے کا آئینی حق حاصل ہے۔",
    romanUrduSummary:
      "Har shehri ko halal rozgar, pasha aur karobar karne ka aaeeni haq hasil hai.",
    applicableAuthorities: ["HEC", "SECP", "Consumer Courts", "Labour Courts", "High Courts"],
  },
  {
    article: "Article 19 & Article 19A",
    part: "Part II, Chapter 1 – Fundamental Rights",
    title: "Freedom of Speech & Right to Information",
    textSummary:
      "Every citizen shall have the right to freedom of speech and expression (Art. 19) and the right to have access to information in all matters of public importance held by public bodies (Art. 19A), enforced through the Right of Access to Information Act 2017 and Provincial RTI Acts.",
    urduSummary:
      "ہر شہری کو اظہارِ رائے کی آزادی (آرٹیکل 19) اور عوامی اہمیت کے تمام معاملات میں سرکاری اداروں سے معلومات اور ریکارڈ حاصل کرنے کا حق (آرٹیکل 19A) حاصل ہے۔",
    romanUrduSummary:
      "Izhar-e-raye ki azadi aur sarkari idaron se record/maloomat hasil karne ka haq (Right to Information Art. 19A) har shehri ko hasil hai.",
    applicableAuthorities: ["Pakistan Information Commission", "Provincial Information Commissions", "Wafaqi Mohtasib"],
  },
  {
    article: "Article 20, Article 21 & Article 22",
    part: "Part II, Chapter 1 – Fundamental Rights",
    title: "Freedom to Profess Religion and Safeguards in Educational Institutions",
    textSummary:
      "Every citizen shall have the right to profess, practice and propagate his religion (Art. 20), protection against discriminatory religious taxation (Art. 21), and no person attending any educational institution shall be required to receive religious instruction or attend ceremonies of a religion other than his own (Art. 22).",
    urduSummary:
      "ہر شہری کو اپنے مذہب پر عمل کرنے کی مکمل آزادی ہے اور تعلیمی اداروں میں کسی طالب علم کو اس کے مذہب کے خلاف تعلیم یا رسومات پر مجبور نہیں کیا جا سکتا۔",
    romanUrduSummary:
      "Har shehri aur aqliyat (minority) ko apne mazhab par amal karne ki mukammal aaeeni azadi hasil hai.",
    applicableAuthorities: ["Ministry of Human Rights (1099)", "NCHR", "National Commission for Minorities"],
  },
  {
    article: "Article 23 & Article 24",
    part: "Part II, Chapter 1 – Fundamental Rights",
    title: "Right to Acquire, Hold and Dispose of Property & Protection of Property Rights",
    textSummary:
      "Every citizen (male or female) shall have the right to acquire, hold and dispose of property in any part of Pakistan (Art. 23). No person shall be compulsorily deprived of his property save in accordance with law and with lawful compensation under the Land Acquisition Act 1894 (Art. 24).",
    urduSummary:
      "ہر شہری (مرد و عورت) کو پاکستان کے کسی بھی حصے میں جائیداد خریدنے، وراثت پانے، رکھنے اور فروخت کرنے کا حق ہے اور کسی کو غیر قانونی طور پر جائیداد سے محروم نہیں کیا جا سکتا۔",
    romanUrduSummary:
      "Har shehri (mard aur aurat) ko jaidad aur wirasat rakhne ka haq hai aur kisi ko qanoon aur muawzay ke baghair uski zameen ya makan se mehroom nahi kiya ja sakta.",
    applicableAuthorities: ["FOSPAH (Women's Property Cell)", "PLRA / Revenue Authorities", "Sessions & Civil Courts"],
  },
  {
    article: "Article 25",
    part: "Part II, Chapter 1 – Fundamental Rights",
    title: "Equality of Citizens & Special Protection for Women and Children",
    textSummary:
      "(1) All citizens are equal before law and are entitled to equal protection of law. (2) There shall be no discrimination on the basis of sex. (3) Nothing in this Article shall prevent the State from making any special provision for the protection of women and children.",
    urduSummary:
      "تمام شہری قانون کی نظر میں برابر ہیں اور قانونی تحفظ کے مساوی حقدار ہیں۔ جنس کی بنیاد پر کوئی تفریق نہیں کی جائے گی اور ریاست خواتین اور بچوں کے تحفظ کے لیے خصوصی اقدامات کر سکتی ہے۔",
    romanUrduSummary:
      "Tamam shehri qanoon ki nazar mein barabar hain aur khawateen aur bachon ke tahaffuz ke liye khasoosi qawaneen banaye gaye hain.",
    applicableAuthorities: ["NCHR", "FOSPAH", "NCSW", "All Courts & Ombudsmen"],
  },
  {
    article: "Article 25A",
    part: "Part II, Chapter 1 – Fundamental Rights",
    title: "Right to Education",
    textSummary:
      "The State shall provide free and compulsory education to all children of the age of five to sixteen years in such manner as may be determined by law, and protect students' constitutional access to education.",
    urduSummary:
      "ریاست 5 سے 16 سال کی عمر کے تمام بچوں کو مفت اور لازمی تعلیم فراہم کرے گی اور طلباء کے تعلیمی حقوق کا تحفظ کرے گی۔",
    romanUrduSummary:
      "Taleem har shehri ka bunyadi aaeeni haq hai.",
    applicableAuthorities: ["HEC", "Provincial Education Departments", "Wafaqi Mohtasib"],
  },
  {
    article: "Article 26, Article 27 & Article 28",
    part: "Part II, Chapter 1 – Fundamental Rights",
    title: "Non-Discrimination in Public Places, Services & Preservation of Language and Script",
    textSummary:
      "Prohibits discrimination in access to public places (Art. 26) and appointments in the service of Pakistan (Art. 27). Guarantees every section of citizens having a distinct language, script, or culture the right to preserve and promote the same (Art. 28).",
    urduSummary:
      "عوامی مقامات اور سرکاری ملازمتوں میں تفریق کی ممانعت ہے اور ہر طبقے کو اپنی زبان، رسم الخط اور ثقافت کے تحفظ کا حق حاصل ہے۔",
    romanUrduSummary:
      "Aam muqamat aur sarkari nokriyon mein tafreeq mana hai aur apni zaban o saqafat ke tahaffuz ka haq hasil hai.",
    applicableAuthorities: ["Federal/Provincial Service Tribunals", "NCHR", "Wafaqi Mohtasib"],
  },
  {
    article: "Article 34, Article 35, Article 36, Article 37 & Article 38",
    part: "Part II, Chapter 2 – Principles of Policy",
    title: "Protection of Family, Minorities, Inexpensive Justice & Social-Economic Well-Being",
    textSummary:
      "Mandates the State to protect marriage, family, mother and child (Art. 35), safeguard minorities (Art. 36), ensure inexpensive and expeditious justice (Art. 37d), secure just and humane conditions of work and maternity benefits (Art. 37e), and provide social security, housing, livelihood, and EOBI old-age benefits (Art. 38).",
    urduSummary:
      "خاندان، ماں اور بچے کا تحفظ (آرٹیکل 35)، اقلیتوں کے حقوق (آرٹیکل 36)، سستا اور فوری انصاف (آرٹیکل 37d)، کام کے منصفانہ حالات اور شہریوں کی معاشی و سماجی فلاح و بہبود (آرٹیکل 38) ریاست کی آئینی ذمہ داری ہے۔",
    romanUrduSummary:
      "Khandan ka tahaffuz, sasta aur fori insaf (Art. 37d), munasib rozgar aur social security (Art. 38) riyasat ki aaeeni ذمہ داری hai.",
    applicableAuthorities: ["Family Courts", "Wafaqi Mohtasib", "EOBI", "Labour Courts"],
  },
  {
    article: "Article 140A",
    part: "Part V – Relations Between Federation and Provinces",
    title: "Local Governments & Municipal Devolution",
    textSummary:
      "Each Province shall, by law, establish a local government system and devolve political, administrative and financial responsibility and authority to the elected representatives of the local governments (governing birth/death/marriage registration, sanitation, water, streets, and building control).",
    urduSummary:
      "ہر صوبہ مقامی حکومتوں کا نظام قائم کرے گا جس کے تحت یونین کونسل، بلدیاتی خدمات، نکاح/پیدائش/وفات کا اندراج اور صفائی کے اختیارات مقامی سطح پر منتقل ہوں گے۔",
    romanUrduSummary:
      "Union Council, nikah/birth certificate registration aur municipal/baldiyati masail Article 140A aur Local Government Acts ke tehat aate hain.",
    applicableAuthorities: ["Union Council", "Metropolitan / Municipal Corporation", "Provincial Ombudsman"],
  },
  {
    article: "Article 184(3), Article 199 & Article 212",
    part: "Part VII – The Judicature (Writ Jurisdiction & Service Tribunals)",
    title: "Constitutional Writ Jurisdiction of High Courts, Supreme Court & Administrative Tribunals",
    textSummary:
      "Under Article 199, a High Court may issue writs of Mandamus (directing a public body to perform its legal duty), Prohibition, Certiorari (declaring unlawful acts void), Habeas Corpus (producing unlawfully detained persons), and Quo Warranto, and enforce Fundamental Rights. Article 184(3)/191A empowers the Supreme Court on matters of public importance touching Fundamental Rights. Article 212 establishes Service Tribunals with exclusive jurisdiction over terms and conditions of civil servants.",
    urduSummary:
      "آرٹیکل 199 کے تحت ہائی کورٹ رٹ پٹیشن کے ذریعے کسی بھی سرکاری ادارے کے غیر قانونی اقدام کو کالعدم قرار دے سکتی ہے، غیر قانونی حراست ختم کروا سکتی ہے اور بنیادی حقوق نافذ کر سکتی ہے۔ آرٹیکل 212 سرکاری ملازمین کے سروس ٹربیونلز سے متعلق ہے۔",
    romanUrduSummary:
      "Article 199 ke tehat High Court Writ Petition ke zariye kisi bhi sarkari idaray ke ghair-qanooni faislay ko khatam kar sakti hai, aur Article 212 sarkari mulazmeen ke Service Tribunals ke liye hai.",
    applicableAuthorities: [
      "Lahore High Court",
      "Sindh High Court",
      "Peshawar High Court",
      "Islamabad High Court",
      "Balochistan High Court",
      "Federal/Provincial Service Tribunals",
    ],
  },
];

export const PAKISTAN_LAWS_CORPUS: PakistanStatute[] = [
  {
    id: "hec_education",
    lawName: "Higher Education Commission (HEC) Ordinance, 2002 & University Directives",
    year: "2002",
    domain: "Education, Universities, Degrees, Transcripts, Fee Refunds & Admissions",
    keySections: "Section 10 (Regulatory Powers), HEC National Fee Refund Policy & Student Grievance Directives",
    description:
      "Prohibits universities from retaining students' original Matric/FSc/BSc certificates or withholding degrees/transcripts after academic and financial clearance; entitles students to 100% tuition fee refund within the 1st week of classes and 50% within the 2nd week under HEC National Fee Refund Policy.",
    urduDescription:
      "ایچ ای سی آرڈیننس 2002 کے تحت یونیورسٹیوں کو طلباء کی اصل اسناد روکنے یا کلیئرنس کے بعد ڈگری نہ دینے کی سختی سے ممانعت ہے، اور داخلہ منسوخ کروانے پر ایچ ای سی فیس ریفنڈ پالیسی لاگو ہوتی ہے۔",
    romanUrduDescription:
      "HEC Ordinance 2002 ke tehat koi bhi university student ke original certificates ya clearance ke baad degree nahi rok sakti.",
    authorityName: "Higher Education Commission (HEC) – Grievance Portal",
    authorityShortName: "HEC Pakistan",
    portalUrl: "https://onlinehelp.hec.gov.pk",
    email: "complaints@hec.gov.pk",
    helpline: "051-111-119-432",
  },
  {
    id: "crpc_police",
    lawName: "Code of Criminal Procedure (CrPC), 1898 & Police Order, 2002",
    year: "1898 / 2002",
    domain: "Police, FIR Registration, Justice of Peace, Bail, Harassment & Unlawful Detention",
    keySections:
      "Sec. 154 (Mandatory FIR for cognizable offence), Sec. 155 (Non-cognizable report), Sec. 22-A/22-B (Sessions Judge as Ex-Officio Justice of Peace), Sec. 200 (Private Criminal Complaint / Istighasa), Sec. 491 (Habeas Corpus recovery), Sec. 497 (Post-arrest bail), Sec. 498 (Pre-arrest bail), Art. 155 Police Order 2002 (Penalty for police misconduct)",
    description:
      "Mandates immediate registration of FIR for cognizable offences (Sec. 154 CrPC). If SHO refuses, the citizen first files a complaint to SP Complaints / DPO / IGP 1787, and then files an application under Sec. 22-A(6) CrPC before the Sessions Judge (Ex-Officio Justice of Peace) who can order FIR registration. For illegal detention, Sec. 491 CrPC authorizes the Sessions Judge/High Court to appoint a bailiff to raid the police station and recover the detainee.",
    urduDescription:
      "ضابطہ فوجداری کی دفعہ 154 کے تحت قابلِ دست اندازی جرم پر ایف آئی آر درج کرنا ایس ایچ او پر فرض ہے۔ انکار پر 1787 یا دفعہ 22-A کے تحت سیشن جج (جسٹس آف پیس) سے ایف آئی آر کا حکم لیا جا سکتا ہے اور غیر قانونی حراست پر دفعہ 491 کے تحت بازیابی ہوتی ہے۔",
    romanUrduDescription:
      "CrPC Sec. 154 ke tehat FIR darj karna SHO par farz hai. Inkar par IGP 1787 ya Sessions Judge (Sec. 22-A) ko darkhwast di ja sakti hai.",
    authorityName: "IGP Police Complaint Center (1787) / Ex-Officio Justice of Peace (Sessions Court)",
    authorityShortName: "Police Complaint Cell (1787)",
    portalUrl: "https://punjabpolice.gov.pk",
    email: "igpcomplaintcenter@punjabpolice.gov.pk",
    helpline: "1787",
  },
  {
    id: "ppc_criminal",
    lawName: "Pakistan Penal Code (PPC), 1860",
    year: "1860",
    domain: "Criminal Offences: Bounced Cheque, Fraud, Breach of Trust, Theft, Extortion, Assault, Defamation & Threats",
    keySections:
      "Sec. 302 (Murder), Sec. 324 (Attempt to murder), Sec. 337 (Hurt/Assault), Sec. 354 & 509 (Harassment/Assault on women), Sec. 379–382 (Theft), Sec. 383–384 (Extortion/Bhatta), Sec. 392 (Robbery), Sec. 406 (Criminal Breach of Trust), Sec. 420 (Cheating/Fraud), Sec. 441/447/448 (Criminal/House Trespass), Sec. 468/471 (Forgery), Sec. 489-F (Dishonoured/Bounced Cheque – up to 3 years prison), Sec. 499–500 (Defamation), Sec. 506 (Criminal Intimidation/Threats)",
    description:
      "Substantive criminal code of Pakistan. Note: Dishonour of cheque in Pakistan is an offence under Section 489-F PPC (cognizable, non-bailable, punishable up to 3 years) alongside a civil summary recovery suit under Order 37 CPC. Financial fraud is Sec. 420 PPC, breach of trust is Sec. 406 PPC, and life threats are Sec. 506(ii) PPC.",
    urduDescription:
      "تعزیراتِ پاکستان (PPC) میں چیک باؤنس ہونے پر دفعہ 489-F، مالی دھوکہ دہی پر دفعہ 420، امانت میں خیانت پر دفعہ 406، سنگین دھمکیوں پر دفعہ 506، چوری پر دفعہ 379 اور جعلی کاغذات پر دفعہ 468/471 کے تحت سزائیں مقرر ہیں۔",
    romanUrduDescription:
      "Pakistan Penal Code (PPC) mein bounced cheque (Sec. 489-F), fraud/dhoka (Sec. 420), amanat mein khayanat (Sec. 406), dhamkiyan (Sec. 506) aur chori (Sec. 379) ke qawaneen shamil hain.",
    authorityName: "District Police Officer (DPO) / Area Magistrate & Sessions Court",
    authorityShortName: "Police / Magistrate",
    portalUrl: "https://punjabpolice.gov.pk",
    email: "igpcomplaintcenter@punjabpolice.gov.pk",
    helpline: "15 / 1787",
  },
  {
    id: "cpc_civil_contracts",
    lawName: "Code of Civil Procedure (CPC), 1908, Specific Relief Act, 1877 & Contract Act, 1872",
    year: "1872 / 1877 / 1908",
    domain: "Civil Suits, Money Recovery, Bounced Cheque Recovery, Stay Orders, Bayana / Agreement to Sell",
    keySections:
      "Order 37 CPC (Summary Suit on Cheque/Promissory Note before District Judge), Order 39 Rules 1 & 2 CPC (Temporary Injunction / Stay Order), Sec. 12 Specific Relief Act 1877 (Specific Performance of Agreement to Sell / Bayana), Sec. 42 Specific Relief Act (Declaration of Title), Sec. 54 Specific Relief Act (Permanent Injunction)",
    description:
      "Governs civil remedies in Pakistan: Summary money recovery on bounced cheques or pronotes directly before the District & Sessions Judge under Order 37 CPC; enforcing property sale agreements (Iqrar-nama / Bayana) under Sec. 12 Specific Relief Act 1877; obtaining immediate Stay Orders under Order 39 Rules 1 & 2 CPC.",
    urduDescription:
      "دیوانی مقدمات، چیک یا پرنوٹ کی رقم کی فوری واپسی کے لیے آرڈر 37 ضابطہ دیوانی (CPC)، پراپرٹی کے اقرار نامے (بیعانہ) کی تکمیل کے لیے دفعہ 12 سپیسیفک ریلیف ایکٹ اور سٹے آرڈر کے لیے آرڈر 39 قاعدہ 1 و 2 لاگو ہوتے ہیں۔",
    romanUrduDescription:
      "Order 37 CPC ke tehat cheque/qarz ki raqam ki fori wapsi, Sec. 12 Specific Relief Act ke tehat bayana/iqrar-nama ki takmeel aur Order 39 ke tehat Stay Order milta hai.",
    authorityName: "District & Sessions Court / Senior Civil Judge",
    authorityShortName: "Civil / District Court",
    portalUrl: "https://citizenportal.gov.pk",
    email: "support@pmdu.gov.pk",
    helpline: "051-9000111",
  },
  {
    id: "family_laws",
    lawName: "Muslim Family Laws Ordinance 1961, Family Courts Act 1964, Dissolution of Muslim Marriages Act 1939 & Guardians and Wards Act 1890",
    year: "1890 / 1939 / 1961 / 1964",
    domain: "Family Law: Nikah, Haq Mehr, Maintenance (Nafqa/Kharcha), Khula, Talaq, Jahez Recovery & Child Custody (Hizanat)",
    keySections:
      "Sec. 5 MFLO (Nikah registration), Sec. 6 MFLO (Polygamy without permission punishable + immediate full dower), Sec. 7 MFLO (Talaq notice to Union Council & 90-day reconciliation), Sec. 9 MFLO (Maintenance), Sec. 10(4) Family Courts Act (Khula decision timeline), Sec. 12 & 25 Guardians and Wards Act 1890 (Child Custody & Visitation)",
    description:
      "Governs all family disputes in Pakistan. Family Courts have exclusive fast-track jurisdiction over Khula/dissolution of marriage, recovery of dower (Haq Mehr), dowry articles (Jahez) and personal belongings, past and future maintenance (Kharcha) for wife and children, and guardianship/custody (Hizanat) where the welfare of the minor is paramount.",
    urduDescription:
      "مسلم فیملی لاز آرڈیننس 1961 اور فیملی کورٹس ایکٹ 1964 کے تحت حق مہر، بیوی اور بچوں کا نان نفقہ (خرچہ)، جہیز کے سامان کی واپسی، خلع، طلاق نوٹس اور بچوں کی حضانت و ملاقات کے مقدمات کا فوری فیصلہ کیا جاتا ہے۔",
    romanUrduDescription:
      "Family Laws 1961 aur Family Courts Act 1964 ke tehat Haq Mehr, biwi aur bachon ka kharcha (maintenance), jahez ki wapsi, khula aur child custody ke masail hal kiye jate hain.",
    authorityName: "Family Court / Union Council Arbitration Council & Ministry of Human Rights Legal Aid (1099)",
    authorityShortName: "Family Court / 1099",
    portalUrl: "https://mohr.gov.pk",
    email: "helpline1099@mohr.gov.pk",
    helpline: "1099",
  },
  {
    id: "property_inheritance_rent",
    lawName: "Enforcement of Women's Property Rights Act 2020, Illegal Dispossession Act 2005, Transfer of Property Act 1882 & Provincial Rented Premises Acts",
    year: "1882 / 2005 / 2009 / 2020",
    domain: "Property, Women's Inheritance (Wirasat), Land Grabbing (Qabza), Mutation (Intiqal/Fard), Succession Certificates & Rent/Tenancy Disputes",
    keySections:
      "Sec. 4, 5 & 7 Women's Property Rights Act 2020 (60-day restoration via Ombudsman/DC); Sec. 3, 7 & 8 Illegal Dispossession Act 2005 (up to 10 years prison for Qabza + interim possession); Sec. 54 Transfer of Property Act 1882 & Sec. 17 Registration Act 1908; Punjab Rented Premises Act 2009 (Sec. 15 Eviction) / Sindh Rented Premises Ordinance 1979",
    description:
      "Protects women deprived of inheritance (Wirasat) or property with summary restoration within 60 days through FOSPAH/Ombudsperson without lengthy civil litigation; punishes land grabbers (Qabza Mafia) with up to 10 years imprisonment under the Illegal Dispossession Act 2005 before the Sessions Court; resolves landlord-tenant eviction and rent disputes before the Special Judge (Rent) / Rent Controller.",
    urduDescription:
      "خواتین کو وراثت اور جائیداد کا حصہ دلوانے کے لیے محتسب (FOSPAH) 60 دن میں فیصلہ کرتا ہے، ناجائز قبضہ مافیا کے خلاف اللیگل ڈسپوزیشن ایکٹ 2005 کے تحت سیشن کورٹ میں 10 سال قید کی سزا ہے، اور مکان مالک و کرایہ دار کے تنازعات رینٹ ٹربیونل حل کرتا ہے۔",
    romanUrduDescription:
      "Khawateen ki wirasat (60 din mein faisla), najayaz qabza (Illegal Dispossession Act 2005), Fard/Intiqal aur makan malik/kirayedar (Rent laws) ke qawaneen.",
    authorityName: "FOSPAH Property Cell, Sessions Court & Provincial Land Records Authority (PLRA)",
    authorityShortName: "FOSPAH / Land Authority",
    portalUrl: "https://fospah.gov.pk",
    email: "complaints@fospah.gov.pk",
    helpline: "051-9264446",
  },
  {
    id: "peca_cybercrime",
    lawName: "Prevention of Electronic Crimes Act (PECA), 2016",
    year: "2016",
    domain: "Cybercrime, Online Harassment, Blackmailing, Non-Consensual Photos/Videos, Hacking, Fake Profiles & Digital Fraud",
    keySections:
      "Sec. 3 (Unauthorized Access), Sec. 14 (Electronic Fraud), Sec. 16 (Identity Theft / Fake Account), Sec. 20 (Offences Against Dignity), Sec. 21 (Offences Against Modesty / Morphing / Blackmailing – up to 5–7 years prison & Rs. 5 million fine), Sec. 24 (Cyberstalking)",
    description:
      "Criminalizes WhatsApp/Facebook/Instagram/TikTok hacking, morphing or sharing private photos/videos without consent, blackmail, online financial scams, fake profiles, and cyberstalking, investigated by the National Cyber Crime Investigation Agency (NCCIA / FIA NR3C).",
    urduDescription:
      "پیکا ایکٹ 2016 کے تحت آن لائن بلیک میلنگ، نجی تصاویر یا ویڈیوز کی تذلیل (دفعہ 21)، ہیکنگ، جعلی اکاؤنٹس (دفعہ 16)، سائبر سٹاکنگ (دفعہ 24) اور آن لائن مالی فراڈ (دفعہ 14) پر ایف آئی اے سائبر کرائم کارروائی کرتا ہے۔",
    romanUrduDescription:
      "PECA 2016 ke tehat online blackmailing, hacking, fake social media account aur digital fraud par FIA Cybercrime (1991) karrawai karta hai.",
    authorityName: "FIA National Response Centre for Cyber Crime (NR3C / NCCIA)",
    authorityShortName: "FIA Cybercrime (1991)",
    portalUrl: "https://nr3c.gov.pk",
    email: "helpdesk@nr3c.gov.pk",
    helpline: "1991",
  },
  {
    id: "employment_labour",
    lawName: "Payment of Wages Act 1936, Protection Against Harassment of Women at the Workplace Act 2010, Standing Orders Ordinance 1968 & Industrial Relations Act 2012",
    year: "1936 / 1968 / 2010 / 2012",
    domain: "Employment, Unpaid Salary, Unlawful Termination, Workplace Harassment, EOBI Pension & Service Tribunals",
    keySections:
      "Sec. 15 Payment of Wages Act 1936 (Recovery of withheld wages + up to 10x compensation); Sec. 4 & 8 Workplace Harassment Act 2010 (amended 2022); Standing Order 12 (Mandatory 1-month termination notice or pay + written reasons); Sec. 33 Industrial Relations Act (Labour Court grievance petition); EOBI Act 1976",
    description:
      "Provides fast recovery of withheld salaries/dues before the Authority under Payment of Wages Act, remedies against illegal termination without notice or show-cause before the Labour Court / NIRC, workplace harassment redressal through FOSPAH, and old-age pension rights under EOBI.",
    urduDescription:
      "پیمنٹ آف ویجز ایکٹ 1936 کی دفعہ 15 کے تحت روکی گئی تنخواہ کی وصولی، غیر قانونی برطرفی کے خلاف لیبر کورٹ یا این آئی آر سی میں اپیل، کام کی جگہ پر ہراسانی کے خلاف محتسب (FOSPAH) اور ای او بی آئی پنشن کے قوانین۔",
    romanUrduDescription:
      "Roki gayi tankhwah (Sec. 15 Payment of Wages Act), ghair-qanooni termination (Labour Court/NIRC), workplace harassment (FOSPAH) aur EOBI pension ke qawaneen.",
    authorityName: "FOSPAH / National Industrial Relations Commission (NIRC) & Labour Department",
    authorityShortName: "FOSPAH / NIRC",
    portalUrl: "https://fospah.gov.pk",
    email: "info@fospah.gov.pk",
    helpline: "051-9264446",
  },
  {
    id: "omdudsman_utilities_gov",
    lawName: "Wafaqi Mohtasib Order 1983, NEPRA Act 1997, OGRA Ordinance 2002, NADRA Ordinance 2000 & Right of Access to Information Act 2017",
    year: "1983 / 1997 / 2000 / 2017",
    domain: "Government Services, NADRA CNIC Blocking, Passports, Electricity (LESCO/IESCO/K-Electric) & Sui Gas Overbilling",
    keySections:
      "Art. 9 Wafaqi Mohtasib Order 1983; Sec. 18 NADRA Ordinance 2000 (Mandatory show-cause notice & hearing before blocking CNIC); Sec. 39 NEPRA Act 1997 (Electricity billing disputes); Right of Access to Information Act 2017",
    description:
      "Free redressal against maladministration, unjust delays, or wrong billing by NADRA (Note: Lahore High Court & Sindh High Court have ruled that NADRA cannot block a citizen's CNIC without a formal notice and hearing under Sec. 18 NADRA Ordinance), Passport Office, Electricity DISCOs, Sui Gas, Railways, CDA, and all Federal/Provincial agencies.",
    urduDescription:
      "نادرا آرڈیننس 2000 کی دفعہ 18 کے تحت بغیر شوکاز نوٹس شناختی کارڈ بلاک کرنا غیر قانونی ہے؛ پاسپورٹ تاخیر، بجلی (نیپرا دفعہ 39) اور گیس کے زائد بلوں اور سرکاری بدانتظامی کے خلاف وفاقی محتسب مفت انصاف فراہم کرتا ہے۔",
    romanUrduDescription:
      "NADRA CNIC blocking (Sec. 18 NADRA Ordinance), Passport delay, Bijli (NEPRA Sec. 39) aur Sui Gas ke ghalat bills ke khilaf Wafaqi Mohtasib muft faisla karta hai.",
    authorityName: "Wafaqi Mohtasib (Federal Ombudsman) & NEPRA / OGRA",
    authorityShortName: "Wafaqi Mohtasib",
    portalUrl: "https://www.mohtasib.gov.pk",
    email: "info@mohtasib.gov.pk",
    helpline: "1055",
  },
  {
    id: "consumer_pta",
    lawName: "Provincial Consumer Protection Acts (Punjab 2005, Sindh 2014, KP 1997, ICT 1995) & PTA Telecom Re-organization Act 1996",
    year: "1996 / 2005 / 2014",
    domain: "Consumer Rights, Defective Products, Overcharging, Online Shopping Scams, Medical Negligence & PTA Telecom/SIM Issues",
    keySections:
      "Sec. 25 & 28 Punjab Consumer Protection Act 2005 (15-Day Legal Notice & Zero-Fee Consumer Court Claim within 30 days); PTA Consumer Protection Regulations; PMDC/Healthcare Commission Acts",
    description:
      "Entitles buyers of defective goods or faulty services to full refund, replacement, and damages in the District Consumer Court with ZERO court fee after serving a 15-day written legal notice; resolves unauthorized mobile balance deductions, SIM blocking, and internet issues via PTA CMS.",
    urduDescription:
      "کنزیومر پروٹیکشن ایکٹ کے تحت 15 دن کا تحریری نوٹس دینے کے بعد بغیر کسی کورٹ فیس کے کنزیومر کورٹ سے رقم کی واپسی اور ہرجانہ ملتا ہے، اور سم یا موبائل بیلنس کی شکایات پی ٹی اے حل کرتا ہے۔",
    romanUrduDescription:
      "Kharab saman, warranty se inkar, online shopping scam aur PTA mobile/internet ki shikayat ke qawaneen.",
    authorityName: "Consumer Protection Council / Court & PTA Complaint System",
    authorityShortName: "Consumer Court / PTA",
    portalUrl: "https://pcpc.punjab.gov.pk",
    email: "info@pcpc.punjab.gov.pk",
    helpline: "0800-55055",
  },
  {
    id: "banking_tax_fbr",
    lawName: "Banking Companies Ordinance 1962, Payment Systems & Electronic Fund Transfers Act 2007, Federal Tax Ombudsman Ordinance 2000 & SECP Act 1997",
    year: "1962 / 2000 / 2007",
    domain: "Banking Fraud, ATM/IBFT/EasyPaisa/JazzCash Disputes, Tax/FBR Harassment, Insurance & Illegal Loan Apps",
    keySections:
      "Sec. 82A Banking Companies Ordinance 1962 (Banking Mohtasib); Electronic Fund Transfers Act 2007; Sec. 9 Federal Tax Ombudsman Ordinance 2000; SECP Non-Banking Finance Companies Regulations (Digital Lending Apps)",
    description:
      "Resolves unauthorized bank/ATM/IBFT/EasyPaisa/JazzCash deductions via Banking Mohtasib Pakistan and State Bank of Pakistan (SBP Sunwai), FBR tax refunds/maladministration via Federal Tax Ombudsman (FTO), and illegal loan app blackmail via SECP & FIA Cybercrime.",
    urduDescription:
      "بینک اکاؤنٹ، اے ٹی ایم، ایزی پیسہ/جاز کیش فراڈ پر بینکنگ محتسب پاکستان اور اسٹیٹ بینک، ایف بی آر ٹیکس شکایات پر وفاقی ٹیکس محتسب اور غیر قانونی لون ایپس کے خلاف ایس ای سی پی اور ایف آئی اے کارروائی کرتے ہیں۔",
    romanUrduDescription:
      "Bank fraud, ATM/EasyPaisa/JazzCash katoti, FBR tax masail aur illegal loan apps ke khilaf Banking Mohtasib, FTO aur SECP ke qawaneen.",
    authorityName: "Banking Mohtasib Pakistan & Federal Tax Ombudsman (FTO)",
    authorityShortName: "Banking Mohtasib / FTO",
    portalUrl: "https://www.bankingmohtasib.gov.pk",
    email: "info@bankingmohtasib.gov.pk",
    helpline: "021-99217334",
  },
  {
    id: "human_rights_protection",
    lawName: "National Commission for Human Rights Act 2012, Domestic Violence (Prevention and Protection) Acts & Zainab Alert Act 2020",
    year: "2012 / 2020",
    domain: "Human Rights, Domestic Violence, Child Protection, Forced Marriage, Minorities & Senior Citizens",
    keySections:
      "Sec. 9 NCHR Act 2012; Domestic Violence Protection Orders & Residence Orders; Sec. 498-B PPC (Prohibition of forced marriage – up to 7 years prison); Sec. 498-A PPC (Depriving woman of inheritance by deceit/force – up to 10 years prison)",
    description:
      "Provides emergency protection orders against domestic violence, criminalizes forced marriage (Sec. 498-B PPC) and depriving women of inheritance (Sec. 498-A PPC), enforces minority rights, and provides free legal aid referrals via Helpline 1099.",
    urduDescription:
      "انسانی حقوق، گھریلو تشدد سے تحفظ، زبردستی شادی کی ممانعت (دفعہ 498-B PPC)، خواتین کو وراثت سے محروم کرنے پر قید کی سزا (دفعہ 498-A PPC) اور مفت قانونی مدد کے لیے ہیلپ لائن 1099 اور این سی ایچ آر۔",
    romanUrduDescription:
      "Insani haqooq, domestic violence, zabardasti shadi (Sec. 498-B PPC) aur wirasat se mehroomi (Sec. 498-A PPC) ke khilaf MoHR Helpline 1099 aur NCHR.",
    authorityName: "Ministry of Human Rights (Helpline 1099) & NCHR Pakistan",
    authorityShortName: "MoHR (1099) / NCHR",
    portalUrl: "https://mohr.gov.pk",
    email: "helpline1099@mohr.gov.pk",
    helpline: "1099",
  },
];
