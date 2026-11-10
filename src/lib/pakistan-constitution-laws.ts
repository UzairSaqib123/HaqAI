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
    article: "Article 4",
    part: "Introductory (Rule of Law)",
    title: "Right of Individuals to be Dealt with in Accordance with Law",
    textSummary:
      "To enjoy the protection of law and to be treated in accordance with law is the inalienable right of every citizen. No action detrimental to the life, liberty, body, reputation or property of any person shall be taken except in accordance with law, and no person shall be compelled to do that which the law does not require him to do.",
    urduSummary:
      "قانون کا تحفظ اور قانون کے مطابق سلوک ہر شہری کا ناقابلِ تنسیخ حق ہے۔ کسی شخص کی جان، آزادی، شہرت یا جائیداد کے خلاف قانون کے سوا کوئی اقدام نہیں کیا جا سکتا۔",
    romanUrduSummary:
      "Qanoon ka tahaffuz har shehri ka bunyadi haq hai. Kisi shaks ko wo kaam karne par majboor nahi kiya ja sakta jo qanoon mein lazim nahi hai.",
    applicableAuthorities: ["High Court (Art. 199)", "Wafaqi Mohtasib", "All Public Authorities"],
  },
  {
    article: "Article 8",
    part: "Part II – Fundamental Rights",
    title: "Laws Inconsistent with or in Derogation of Fundamental Rights to be Void",
    textSummary:
      "Any law, custom, usage, notification, or administrative order having the force of law, insofar as it is inconsistent with Fundamental Rights, shall be void.",
    urduSummary:
      "بنیادی حقوق سے متصادم کوئی بھی قانون، رسم و رواج یا سرکاری حکم باطل تصور ہو گا۔",
    romanUrduSummary:
      "Bunyadi haqooq ke khilaf koi bhi qanoon ya sarkari hukam qanoonan kal-adam (void) hoga.",
    applicableAuthorities: ["Supreme Court of Pakistan", "High Courts"],
  },
  {
    article: "Article 9",
    part: "Part II – Fundamental Rights",
    title: "Security of Person (Right to Life and Liberty)",
    textSummary:
      "No person shall be deprived of life or liberty save in accordance with law. The Supreme Court has interpreted 'life' to include a clean environment, healthcare, livelihood, and basic human necessities.",
    urduSummary:
      "کسی شخص کو قانون کے مطابق کارروائی کے بغیر زندگی یا آزادی سے محروم نہیں کیا جائے گا۔",
    romanUrduSummary:
      "Kisi bhi shaks ko qanoon ke baghair zindagi ya azadi se mehroom nahi kiya ja sakta.",
    applicableAuthorities: ["Police Complaint Cell (1787)", "Sessions Court (Sec. 491 CrPC)", "High Court"],
  },
  {
    article: "Article 10",
    part: "Part II – Fundamental Rights",
    title: "Safeguards as to Arrest and Detention",
    textSummary:
      "No person who is arrested shall be detained in custody without being informed of the grounds for such arrest, nor denied the right to consult and be defended by a legal practitioner of their choice. Every arrested person must be produced before a Magistrate within 24 hours.",
    urduSummary:
      "ہر گرفتار شخص کو گرفتاری کی وجہ بتانا، اپنی پسند کے وکیل سے مشورہ کرنے دینا اور 24 گھنٹے کے اندر مجسٹریٹ کے سامنے پیش کرنا لازم ہے۔",
    romanUrduSummary:
      "Giraftar shuda shaks ko वजह batana, wakeel se milne dena aur 24 ghantay mein Magistrate ke samne pesh karna lazmi hai.",
    applicableAuthorities: ["Magistrate / Sessions Judge", "IGP Police Complaint Cell", "High Court"],
  },
  {
    article: "Article 10A",
    part: "Part II – Fundamental Rights",
    title: "Right to Fair Trial and Due Process",
    textSummary:
      "For the determination of his civil rights and obligations or in any criminal charge against him, a person shall be entitled to a fair trial and due process (including right to notice and right to be heard before any adverse order).",
    urduSummary:
      "شہری حقوق و فرائض کے تعین یا کسی فوجداری الزام میں ہر شخص کو منصفانہ ٹرائل اور قانونی تقاضے پورے کیے جانے کا حق حاصل ہے۔",
    romanUrduSummary:
      "Har muqadmay ya departmental karrawai mein munsifana sunwai (Fair Trial & Due Process) har shehri ka aaeeni haq hai.",
    applicableAuthorities: ["Courts", "Wafaqi Mohtasib", "Service Tribunals", "HEC"],
  },
  {
    article: "Article 11",
    part: "Part II – Fundamental Rights",
    title: "Slavery, Forced Labour, etc. Prohibited",
    textSummary:
      "Slavery is non-existent and forbidden. All forms of forced labour and traffic in human beings are prohibited. No child below the age of 14 years shall be engaged in any factory, mine, or other hazardous employment.",
    urduSummary:
      "غلامی، جبری مشقت، انسانی اسمگلنگ اور 14 سال سے کم عمر بچوں سے خطرناک کام کروانے کی مکمل ممانعت ہے۔",
    romanUrduSummary:
      "Jabri mushaqqat (forced/unpaid labour) aur 14 saal se kam umar bachon se karkhanon mein mazdoori karwana mana hai.",
    applicableAuthorities: ["Labour Department", "NCHR", "Ministry of Human Rights (1099)"],
  },
  {
    article: "Article 12 & Article 13",
    part: "Part II – Fundamental Rights",
    title: "Protection Against Retrospective Punishment, Double Jeopardy & Self-Incrimination",
    textSummary:
      "No law shall authorize punishment for an act that was not punishable when committed (Art. 12). No person shall be prosecuted or punished for the same offense more than once, nor compelled to be a witness against himself (Art. 13).",
    urduSummary:
      "کسی شخص کو ایک ہی جرم کی دو بار سزا نہیں دی جا سکتی اور نہ ہی اپنے خلاف گواہی دینے پر مجبور کیا جا سکتا ہے۔",
    romanUrduSummary:
      "Ek hi jurm ki do baar saza nahi ho sakti aur na hi kisi ko apne khilaf gawahi dene par majboor kiya ja sakta hai.",
    applicableAuthorities: ["Criminal Courts", "High Courts"],
  },
  {
    article: "Article 14",
    part: "Part II – Fundamental Rights",
    title: "Inviolability of Dignity of Man, Privacy of Home & Prohibition of Torture",
    textSummary:
      "The dignity of man and, subject to law, the privacy of home, shall be inviolable. No person shall be subjected to torture for the purpose of extracting evidence.",
    urduSummary:
      "انسان کا شرف و وقار اور چادر و چار دیواری کا تقدس ناقابلِ پامالی ہے۔ ثبوت حاصل کرنے کے لیے کسی شخص پر تشدد نہیں کیا جائے گا۔",
    romanUrduSummary:
      "Har insaan ki izzat-e-nafs aur ghar ki privacy muqaddas hai. Saboot ke liye police ya kisi idaray ka tashaddud (torture) bilkul haram aur ghair-qanooni hai.",
    applicableAuthorities: ["FIA Cybercrime (1991)", "IGP Police (1787)", "NCHR", "MoHR (1099)"],
  },
  {
    article: "Article 15, Article 16 & Article 17",
    part: "Part II – Fundamental Rights",
    title: "Freedom of Movement, Assembly & Association",
    textSummary:
      "Every citizen has the right to remain in, enter, and move freely throughout Pakistan and reside in any part thereof (Art. 15), assemble peacefully without arms (Art. 16), and form associations or unions (Art. 17).",
    urduSummary:
      "ہر شہری کو پاکستان میں آزادانہ نقل و حرکت، پرامن اجتماع اور انجمن سازی یا یونین بنانے کا حق حاصل ہے۔",
    romanUrduSummary:
      "Pakistan mein azadana aamad-o-raft (Passport/Movement), pur-aman ijtima aur union/association banane ka haq hasil hai.",
    applicableAuthorities: ["Directorate of Passports", "NIRC", "Ministry of Interior", "High Courts"],
  },
  {
    article: "Article 18",
    part: "Part II – Fundamental Rights",
    title: "Freedom of Trade, Business or Profession",
    textSummary:
      "Every citizen shall have the right to enter upon any lawful profession or occupation, and to conduct any lawful trade or business.",
    urduSummary:
      "ہر شہری کو کوئی بھی جائز پیشہ، ملازمت یا کاروبار اختیار کرنے کا آئینی حق حاصل ہے۔",
    romanUrduSummary:
      "Har shehri ko halal rozgar, pasha aur karobar karne ka aaeeni haq hasil hai.",
    applicableAuthorities: ["HEC", "SECP", "Consumer Courts", "Labour Courts"],
  },
  {
    article: "Article 19 & Article 19A",
    part: "Part II – Fundamental Rights",
    title: "Freedom of Speech & Right to Information",
    textSummary:
      "Every citizen shall have the right to freedom of speech and expression (Art. 19) and the right to have access to information in all matters of public importance (Art. 19A).",
    urduSummary:
      "ہر شہری کو اظہارِ رائے کی آزادی (آرٹیکل 19) اور عوامی اہمیت کے تمام معاملات میں معلومات تک رسائی کا حق (آرٹیکل 19A) حاصل ہے۔",
    romanUrduSummary:
      "Izhar-e-raye ki azadi aur sarkari idaron se maloomat hasil karne ka haq (Right to Information Art. 19A) har shehri ko hasil hai.",
    applicableAuthorities: ["Pakistan Information Commission", "Wafaqi Mohtasib"],
  },
  {
    article: "Article 20, Article 21 & Article 22",
    part: "Part II – Fundamental Rights",
    title: "Freedom to Profess Religion and Manage Religious Institutions",
    textSummary:
      "Every citizen shall have the right to profess, practice and propagate his religion, and every religious denomination shall have the right to establish, maintain and manage its religious institutions.",
    urduSummary:
      "ہر شہری کو اپنے مذہب پر عمل کرنے اور اپنی عبادت گاہوں و مذہبی اداروں کا انتظام چلانے کی مکمل آزادی ہے۔",
    romanUrduSummary:
      "Har shehri aur aqliyat (minority) ko apne mazhab par amal karne ki mukammal aaeeni azadi hasil hai.",
    applicableAuthorities: ["Ministry of Human Rights (1099)", "NCHR", "National Commission for Minorities"],
  },
  {
    article: "Article 23 & Article 24",
    part: "Part II – Fundamental Rights",
    title: "Right to Acquire, Hold and Dispose of Property & Protection of Property Rights",
    textSummary:
      "Every citizen shall have the right to acquire, hold and dispose of property in any part of Pakistan (Art. 23). No person shall be compulsorily deprived of his property save in accordance with law and with lawful compensation (Art. 24).",
    urduSummary:
      "ہر شہری (مرد و عورت) کو پاکستان کے کسی بھی حصے میں جائیداد خریدنے، رکھنے اور فروخت کرنے کا حق ہے اور کسی کو غیر قانونی طور پر جائیداد یا وراثت سے محروم نہیں کیا جا سکتا۔",
    romanUrduSummary:
      "Har shehri ko jaidad aur wirasat rakhne ka haq hai aur kisi ko qanoon ke baghair uski zameen ya makan se mehroom nahi kiya ja sakta.",
    applicableAuthorities: ["FOSPAH (Women's Property Cell)", "PLRA / Revenue Authorities", "Sessions & Civil Courts"],
  },
  {
    article: "Article 25",
    part: "Part II – Fundamental Rights",
    title: "Equality of Citizens",
    textSummary:
      "(1) All citizens are equal before law and are entitled to equal protection of law. (2) There shall be no discrimination on the basis of sex. (3) Nothing in this Article shall prevent the State from making any special provision for the protection of women and children.",
    urduSummary:
      "تمام شہری قانون کی نظر میں برابر ہیں اور قانونی تحفظ کے مساوی حقدار ہیں۔ جنس کی بنیاد پر کوئی تفریق نہیں کی جائے گی۔",
    romanUrduSummary:
      "Tamam shehri qanoon ki nazar mein barabar hain aur jins (gender) ki bunyad par koi imtiazi sulook nahi ho sakta.",
    applicableAuthorities: ["NCHR", "FOSPAH", "NCSW", "All Courts & Ombudsmen"],
  },
  {
    article: "Article 25A",
    part: "Part II – Fundamental Rights",
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
    article: "Article 26 & Article 27",
    part: "Part II – Fundamental Rights",
    title: "Non-Discrimination in Access to Public Places & Services",
    textSummary:
      "There shall be no discrimination against any citizen on grounds only of race, religion, caste, sex, residence or place of birth regarding access to places of public entertainment/resort or appointment in the service of Pakistan.",
    urduSummary:
      "عوامی مقامات تک رسائی اور سرکاری ملازمتوں میں ذات، مذہب، جنس یا جائے پیدائش کی بنیاد پر کسی شہری کے ساتھ تفریق نہیں کی جائے گی۔",
    romanUrduSummary:
      "Aam muqamat aur sarkari nokriyon mein mazhab, zaat ya jins ki bunyad par tafreeq mana hai.",
    applicableAuthorities: ["Federal/Provincial Service Tribunals", "NCHR", "Wafaqi Mohtasib"],
  },
  {
    article: "Article 37 & Article 38",
    part: "Part II, Chapter 2 – Principles of Policy",
    title: "Promotion of Social Justice, Inexpensive Justice & Social-Economic Well-Being",
    textSummary:
      "Mandates the State to ensure inexpensive and expeditious justice (Art. 37d), just and humane conditions of work (Art. 37e), and food, clothing, housing, education, and medical relief for citizens (Art. 38).",
    urduSummary:
      "سستے اور فوری انصاف کی فراہمی، کام کے باعزت حالات اور شہریوں کی معاشی و سماجی فلاح ریاست کی ذمہ داری ہے۔",
    romanUrduSummary:
      "Sasta aur fori insaf, munasib rozgar aur social security riyasat ki aaeeni ذمہ داری hai.",
    applicableAuthorities: ["Wafaqi Mohtasib", "EOBI", "Bait-ul-Maal", "Labour Courts"],
  },
  {
    article: "Article 184(3) & Article 199",
    part: "Part VII – The Judicature (Writ Jurisdiction)",
    title: "Constitutional Writ Jurisdiction of High Courts & Supreme Court",
    textSummary:
      "Under Article 199, a High Court may issue writs of Mandamus (directing a public body to perform its legal duty), Prohibition, Certiorari (declaring unlawful acts void), Habeas Corpus (producing unlawfully detained persons), and Quo Warranto, and enforce Fundamental Rights.",
    urduSummary:
      "آرٹیکل 199 کے تحت ہائی کورٹ کسی بھی سرکاری ادارے کے غیر قانونی اقدام کو کالعدم قرار دے سکتی ہے، غیر قانونی حراست ختم کروا سکتی ہے اور بنیادی حقوق نافذ کر سکتی ہے۔",
    romanUrduSummary:
      "Article 199 ke tehat High Court kisi bhi sarkari idaray ko qanooni kaam karne ka hukam (Writ Petition) de sakti hai.",
    applicableAuthorities: ["Lahore High Court", "Sindh High Court", "Peshawar High Court", "Islamabad High Court", "Balochistan High Court"],
  },
];

export const PAKISTAN_LAWS_CORPUS: PakistanStatute[] = [
  {
    id: "hec_education",
    lawName: "Higher Education Commission (HEC) Ordinance, 2002 & University Directives",
    year: "2002",
    domain: "Education, Universities, Degrees & Admissions",
    keySections: "Section 10 (Regulatory Powers), Student Grievance Redressal Directives",
    description:
      "Prohibits universities from retaining students' original Matric/FSc/BSc certificates or withholding degrees/transcripts after academic and financial clearance; regulates degree attestation, equivalence, and fee refund policies.",
    urduDescription:
      "ایچ ای سی آرڈیننس 2002 کے تحت یونیورسٹیوں کو طلباء کی اصل اسناد روکنے یا کلیئرنس کے بعد ڈگری نہ دینے کی سختی سے ممانعت ہے۔",
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
    domain: "Police, FIR Registration, Bail, Harassment & Unlawful Detention",
    keySections: "Sec. 154 (FIR), Sec. 22-A/22-B (Justice of Peace), Sec. 491 (Habeas Corpus), Sec. 497/498 (Bail)",
    description:
      "Mandates immediate registration of FIR for cognizable offenses (Sec. 154). If SHO refuses, citizens can approach IGP Complaint Cell (1787) or file a petition before the Sessions Judge (Justice of Peace) under Sec. 22-A CrPC.",
    urduDescription:
      "ضابطہ فوجداری کی دفعہ 154 کے تحت قابلِ دست اندازی جرم پر ایف آئی آر درج کرنا ایس ایچ او پر فرض ہے۔ انکار پر 1787 یا دفعہ 22-A کے تحت سیشن جج سے رجوع کیا جا سکتا ہے۔",
    romanUrduDescription:
      "CrPC Sec. 154 ke tehat FIR darj karna SHO par farz hai. Inkar par IGP 1787 ya Sessions Judge (Sec. 22-A) ko darkhwast di ja sakti hai.",
    authorityName: "IGP Police Complaint Center (1787) / Provincial Police",
    authorityShortName: "Police Complaint Cell (1787)",
    portalUrl: "https://punjabpolice.gov.pk",
    email: "igpcomplaintcenter@punjabpolice.gov.pk",
    helpline: "1787",
  },
  {
    id: "ppc_criminal",
    lawName: "Pakistan Penal Code (PPC), 1860",
    year: "1860",
    domain: "Criminal Offenses: Fraud, Theft, Assault, Extortion, Defamation & Trespass",
    keySections: "Sec. 379 (Theft), Sec. 383 (Extortion), Sec. 406 (Breach of Trust), Sec. 420 (Cheating/Fraud), Sec. 441 (Criminal Trespass), Sec. 499 (Defamation), Sec. 506 (Criminal Intimidation/Threats)",
    description:
      "Defines substantive criminal offenses and punishments across Pakistan including financial cheating (Sec. 420), criminal breach of trust (Sec. 406), life threats (Sec. 506), assault, and property trespass.",
    urduDescription:
      "تعزیراتِ پاکستان (PPC) میں دھوکہ دہی (دفعہ 420)، امانت میں خیانت (دفعہ 406)، سنگین دھمکیاں (دفعہ 506)، چوری اور حملے کی سزائیں مقرر ہیں۔",
    romanUrduDescription:
      "Pakistan Penal Code (PPC) mein fraud/dhoka (Sec. 420), amanat mein khayanat (Sec. 406), dhamkiyan (Sec. 506) aur chori ke qawaneen shamil hain.",
    authorityName: "District Police Officer (DPO) / IGP Complaint Cell",
    authorityShortName: "Police / Magistrate",
    portalUrl: "https://punjabpolice.gov.pk",
    email: "igpcomplaintcenter@punjabpolice.gov.pk",
    helpline: "15 / 1787",
  },
  {
    id: "family_laws",
    lawName: "Muslim Family Laws Ordinance, 1961 & Family Courts Act, 1964",
    year: "1961 / 1964",
    domain: "Family Law: Nikah, Haq Mehr, Maintenance (Kharcha), Khula, Divorce & Child Custody",
    keySections: "Sec. 6 (Polygamy permission), Sec. 7 (Talaq notice), Sec. 9 (Maintenance of Wife & Children), Guardians & Wards Act 1890",
    description:
      "Governs marriage registration, recovery of dower (Haq Mehr), dowry articles (Jahez), monthly maintenance for wife and children, Khula/dissolution of marriage, and child custody (Hizanat) through fast-track Family Courts.",
    urduDescription:
      "مسلم فیملی لاز آرڈیننس 1961 اور فیملی کورٹس ایکٹ 1964 کے تحت حق مہر، نان نفقہ (خرچہ)، جہیز کے سامان کی واپسی، خلع اور بچوں کی حضانت کے مقدمات کا فوری فیصلہ کیا جاتا ہے۔",
    romanUrduDescription:
      "Family Laws 1961 ke tehat Haq Mehr, biwi aur bachon ka kharcha (maintenance), jahez ki wapsi, khula aur child custody ke masail hal kiye jate hain.",
    authorityName: "Ministry of Human Rights Legal Aid (1099) & Union Council / Family Courts",
    authorityShortName: "Family Legal Aid (1099)",
    portalUrl: "https://mohr.gov.pk",
    email: "helpline1099@mohr.gov.pk",
    helpline: "1099",
  },
  {
    id: "property_inheritance_rent",
    lawName: "Enforcement of Women's Property Rights Act, 2020, Illegal Dispossession Act, 2005 & Rent Laws",
    year: "2005 / 2020",
    domain: "Property, Women's Inheritance (Wirasat), Land Grabbing (Qabza), Mutation (Intiqal) & Landlord-Tenant Rent Disputes",
    keySections: "Sec. 4 & 5 Women's Property Act 2020; Sec. 3 Illegal Dispossession Act 2005; Transfer of Property Act 1882; Provincial Rented Premises Acts",
    description:
      "Restores women's inheritance (Wirasat) and property within 60 days via Ombudsman; punishes land grabbers (Qabza Mafia) with up to 10 years prison; regulates Fard/Intiqal land records and Rent Controller petitions between landlords and tenants.",
    urduDescription:
      "خواتین کو وراثت دلوانے کے لیے محتسب 60 دن میں کارروائی کرتا ہے، ناجائز قبضہ مافیا کو 10 سال قید کی سزا ہے اور کرایہ داری کے تنازعات رینٹ ٹربیونل حل کرتا ہے۔",
    romanUrduDescription:
      "Khawateen ki wirasat (60 din mein faisla), najayaz qabza (Illegal Dispossession Act), Fard/Intiqal aur makan malik/kirayedar (Rent laws) ke qawaneen.",
    authorityName: "FOSPAH Property Cell & Provincial Land Records Authority (PLRA)",
    authorityShortName: "FOSPAH / Land Authority",
    portalUrl: "https://fospah.gov.pk",
    email: "complaints@fospah.gov.pk",
    helpline: "051-9264446",
  },
  {
    id: "peca_cybercrime",
    lawName: "Prevention of Electronic Crimes Act (PECA), 2016",
    year: "2016",
    domain: "Cybercrime, Online Harassment, Blackmailing, Hacking, Fake Profiles & Digital Fraud",
    keySections: "Sec. 3 (Unauthorized Access), Sec. 14 (Electronic Fraud), Sec. 16 (Identity Theft), Sec. 20 (Dignity/Defamation), Sec. 21 (Offenses Against Modesty), Sec. 24 (Cyberstalking)",
    description:
      "Criminalizes WhatsApp/social media hacking, morphing photos, blackmail, online financial scams, fake profiles, and cyberstalking, investigated by FIA Cybercrime Wing (NR3C / NCCIA).",
    urduDescription:
      "پیکا ایکٹ 2016 کے تحت آن لائن بلیک میلنگ، ہیکنگ، جعلی اکاؤنٹس اور آن لائن مالی فراڈ پر ایف آئی اے سائبر کرائم کارروائی کرتا ہے۔",
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
    lawName: "Payment of Wages Act 1936, Workplace Harassment Act 2010 & Standing Orders Ordinance 1968",
    year: "1936 / 1968 / 2010",
    domain: "Employment, Unpaid Salary, Unlawful Termination, Workplace Harassment, EOBI & Civil Servants",
    keySections: "Sec. 15 Payment of Wages Act; Sec. 8 Workplace Harassment Act 2010; Industrial Relations Act 2012; EOBI Act 1976",
    description:
      "Provides fast recovery of withheld salaries/dues, remedies against illegal termination without notice, workplace harassment redressal through FOSPAH, and old-age pension rights under EOBI.",
    urduDescription:
      "روکی گئی تنخواہ کی وصولی، غیر قانونی برطرفی، کام کی جگہ پر ہراسانی اور ای او بی آئی پنشن کے قوانین۔",
    romanUrduDescription:
      "Roki gayi tankhwah (salary), ghair-qanooni termination, workplace harassment (FOSPAH) aur EOBI pension ke qawaneen.",
    authorityName: "FOSPAH / National Industrial Relations Commission (NIRC) & Labour Department",
    authorityShortName: "FOSPAH / NIRC",
    portalUrl: "https://fospah.gov.pk",
    email: "info@fospah.gov.pk",
    helpline: "051-9264446",
  },
  {
    id: "omdudsman_utilities_gov",
    lawName: "Wafaqi Mohtasib Order 1983, NEPRA Act 1997, OGRA Ordinance 2002 & NADRA Ordinance 2000",
    year: "1983 / 1997 / 2000",
    domain: "Government Services, NADRA CNIC, Passports, Electricity (LESCO/K-Electric) & Sui Gas Overbilling",
    keySections: "Art. 9 Wafaqi Mohtasib Order; Right of Access to Information Act 2017",
    description:
      "Free redressal against maladministration, unjust delays, or wrong billing by NADRA, Passport Office, Electricity DISCOs (LESCO, IESCO, MEPCO, K-Electric), Sui Gas (SNGPL/SSGC), Railways, CDA, and all Federal agencies.",
    urduDescription:
      "نادرا، پاسپورٹ، بجلی اور گیس کے زائد بلوں اور سرکاری اداروں کی بدانتظامی کے خلاف وفاقی محتسب مفت انصاف فراہم کرتا ہے۔",
    romanUrduDescription:
      "NADRA CNIC blocking, Passport delay, Bijli (LESCO/K-Electric) aur Sui Gas ke ghalat bills ke khilaf Wafaqi Mohtasib muft faisla karta hai.",
    authorityName: "Wafaqi Mohtasib (Federal Ombudsman) & Pakistan Citizen Portal",
    authorityShortName: "Wafaqi Mohtasib",
    portalUrl: "https://www.mohtasib.gov.pk",
    email: "info@mohtasib.gov.pk",
    helpline: "1055",
  },
  {
    id: "consumer_pta",
    lawName: "Provincial Consumer Protection Acts (2005/2014) & PTA Telecom Re-organization Act 1996",
    year: "1996 / 2005 / 2014",
    domain: "Consumer Rights, Defective Products, Overcharging, Online Shopping Scams & PTA Telecom/SIM Issues",
    keySections: "15-Day Legal Notice & Zero-Fee Consumer Court Claim; PTA Consumer Protection Regulations",
    description:
      "Entitles buyers to full refund, replacement, and damages in the District Consumer Court with zero court fee after a 15-day notice; resolves unauthorized mobile balance deductions, SIM blocking, and internet issues via PTA.",
    urduDescription:
      "ناقص اشیاء، آن لائن شاپنگ دھوکہ دہی اور ٹیلی کام شکایات پر کنزیومر کورٹ اور پی ٹی اے کے ذریعے فوری داد رسی۔",
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
    lawName: "Banking Companies Ordinance 1962, Federal Tax Ombudsman Ordinance 2000 & SECP Act 1997",
    year: "1962 / 2000",
    domain: "Banking Fraud, EasyPaisa/JazzCash Disputes, Tax/FBR Harassment, Insurance & Illegal Loan Apps",
    keySections: "Sec. 82A Banking Companies Ordinance; Sec. 9 Federal Tax Ombudsman Ordinance",
    description:
      "Resolves unauthorized bank/ATM/EasyPaisa/JazzCash deductions via Banking Mohtasib, FBR tax refunds/maladministration via Federal Tax Ombudsman (FTO), and illegal loan app blackmail via SECP & FIA.",
    urduDescription:
      "بینک اکاؤنٹ، اے ٹی ایم، ایزی پیسہ/جاز کیش فراڈ پر بینکنگ محتسب اور ایف بی آر ٹیکس شکایات پر وفاقی ٹیکس محتسب کارروائی کرتا ہے۔",
    romanUrduDescription:
      "Bank fraud, ATM/EasyPaisa/JazzCash katoti, FBR tax masail aur illegal loan apps ke khilaf Banking Mohtasib, FTO aur SECP ke qawaneen.",
    authorityName: "Banking Mohtasib Pakistan & Federal Tax Ombudsman (FTO)",
    authorityShortName: "Banking Mohtasib / FTO",
    portalUrl: "https://www.bankingmohtasib.gov.pk",
    email: "info@bankingmohtasib.gov.pk",
    helpline: "021-99217334",
  },
  {
    id: "traffic_municipal_civil",
    lawName: "Motor Vehicles Ordinance 1965, Specific Relief Act 1877 & Local Government Acts",
    year: "1877 / 1965",
    domain: "Traffic Challans, Excise/Vehicle Registration, Municipal Issues, Civil Contracts & Money Recovery",
    keySections: "Order 37 CPC (Summary Suit on Promissory Note/Cheque Dishonour Sec. 489-F PPC); Motor Vehicles Ordinance",
    description:
      "Covers bounced cheques (Sec. 489-F PPC & Order 37 CPC), breach of contract, unlawful traffic challans, vehicle transfer disputes, and municipal sanitation/encroachment complaints.",
    urduDescription:
      "چیک ڈس آنر (دفعہ 489-F)، معاہدے کی خلاف ورزی، ٹریفک چالان اور بلدیاتی مسائل کے قوانین۔",
    romanUrduDescription:
      "Bounced cheque (Sec. 489-F PPC), udhar/qarz ki wapsi, contract breach, traffic challan aur municipal shikayat ke qawaneen.",
    authorityName: "Pakistan Citizen Portal / Provincial Ombudsman & Civil/Magistrate Courts",
    authorityShortName: "Provincial Ombudsman / Citizen Portal",
    portalUrl: "https://citizenportal.gov.pk",
    email: "support@pmdu.gov.pk",
    helpline: "051-9000111",
  },
  {
    id: "human_rights_protection",
    lawName: "National Commission for Human Rights Act 2012, Domestic Violence Acts & Zainab Alert Act 2020",
    year: "2012 / 2020",
    domain: "Human Rights, Domestic Violence, Child Protection, Minorities & Senior Citizens",
    keySections: "Sec. 9 NCHR Act 2012; Domestic Violence Protection Orders",
    description:
      "Provides emergency protection orders against domestic violence, child abuse alerts, minority rights enforcement, and free legal aid referrals via Helpline 1099.",
    urduDescription:
      "انسانی حقوق، گھریلو تشدد سے تحفظ، بچوں اور اقلیتوں کے حقوق کے لیے ہیلپ لائن 1099 اور این سی ایچ آر۔",
    romanUrduDescription:
      "Insani haqooq, domestic violence, bachon aur buzurgon ke tahaffuz ke liye MoHR Helpline 1099 aur NCHR.",
    authorityName: "Ministry of Human Rights (Helpline 1099) & NCHR Pakistan",
    authorityShortName: "MoHR (1099) / NCHR",
    portalUrl: "https://mohr.gov.pk",
    email: "helpline1099@mohr.gov.pk",
    helpline: "1099",
  },
];
