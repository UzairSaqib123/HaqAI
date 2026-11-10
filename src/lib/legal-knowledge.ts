export type SupportedLanguage = "en" | "roman_ur" | "ur" | "pa";

export type LegalCategoryId =
  | "education"
  | "police"
  | "family"
  | "civil_criminal"
  | "property"
  | "employment"
  | "cybercrime"
  | "government"
  | "consumer"
  | "human_rights";

export interface AuthorityInfo {
  id: string;
  name: string;
  shortName: string;
  role: string;
  portalUrl: string;
  email: string;
  helpline: string;
  address: string;
  turnaroundTime: string;
  instructions: {
    en: string;
    roman_ur: string;
    ur: string;
    pa: string;
  };
}

export interface LegalKnowledgeEntry {
  id: LegalCategoryId;
  title: {
    en: string;
    roman_ur: string;
    ur: string;
    pa: string;
  };
  iconName: string;
  keywords: string[];
  constitutionalRights: {
    article: string;
    title: string;
    summary: {
      en: string;
      roman_ur: string;
      ur: string;
      pa: string;
    };
  }[];
  statutoryLaws: {
    law: string;
    section: string;
    explanation: {
      en: string;
      roman_ur: string;
      ur: string;
      pa: string;
    };
  }[];
  administrativeProcedures: {
    en: string[];
    roman_ur: string[];
    ur: string[];
    pa: string[];
  };
  followUpQuestions: {
    en: string[];
    roman_ur: string[];
    ur: string[];
    pa: string[];
  };
  authorities: AuthorityInfo[];
  complaintTemplate: {
    subjectPrefix: string;
    defaultRecipientTitle: string;
    legalCitationParagraph: string;
    requestedReliefParagraph: string;
  };
}

export const LEGAL_KNOWLEDGE_BASE: Record<LegalCategoryId, LegalKnowledgeEntry> = {
  education: {
    id: "education",
    title: {
      en: "Education, University Degrees, Certificates & Fee Disputes",
      roman_ur: "Taleem, University Degree, Asnaad aur Fees ke Masail",
      ur: "تعلیم، یونیورسٹی ڈگری، اصل اسناد اور فیس کے مسائل",
      pa: "تعلیم تے یونیورسٹی دے مسئلے (ڈگری تے کاغذات)",
    },
    iconName: "GraduationCap",
    keywords: [
      "university",
      "degree",
      "transcript",
      "document",
      "documents",
      "original",
      "hec",
      "college",
      "school",
      "admission",
      "fee",
      "fees",
      "refund",
      "certificate",
      "matric",
      "fsc",
      "inter",
      "result",
      "asnaad",
      "sanad",
      "kaghaz",
      "kaghzat",
      "roll number",
      "exam",
      "migration",
      "noc",
      "attestation",
      "equivalence",
      "clearance",
      "student",
      "talib",
      "taleem",
      "یونیورسٹی",
      "ڈگری",
      "اسناد",
      "سند",
      "کالج",
      "اسکول",
      "سکول",
      "تعلیم",
      "تعلیمی",
      "طالب علم",
      "فیس",
      "داخلہ",
      "امتحان",
      "رزلٹ",
      "نتیجہ",
      "ٹرانسکرپٹ",
      "کلیئرنس",
      "کاغذات",
      "سرٹیفکیٹ",
      "ایچ ای سی",
    ],
    constitutionalRights: [
      {
        article: "Article 25A – Constitution of Pakistan 1973",
        title: "Right to Education (تعلیم کا بنیادی حق)",
        summary: {
          en: "Guarantees the fundamental right to education and protects students from unlawful academic barriers.",
          roman_ur: "Har shehri ko taleem hasil karne aur apni taleemi asnaad (documents) par qanooni haq deta hai.",
          ur: "آئین پاکستان کا آرٹیکل 25A تعلیم کے بنیادی حق کی ضمانت دیتا ہے اور طلباء کو غیر قانونی رکاوٹوں سے تحفظ فراہم کرتا ہے۔",
          pa: "آئین پاکستان دا آرٹیکل 25A ہر شہری نوں تعلیم دے بنیادی حق دی ضمانت دیندا اے۔",
        },
      },
      {
        article: "Article 4 & Article 18 – Constitution of Pakistan 1973",
        title: "Protection of Law & Right to Profession",
        summary: {
          en: "No university or board can withhold your lawful documents without statutory authority (Art. 4) or block your career progression (Art. 18).",
          roman_ur: "Koi bhi university qanooni jawaz ke baghair aap ke original documents ya degree nahi rok sakti.",
          ur: "آرٹیکل 4 اور 18 کے تحت کوئی بھی تعلیمی ادارہ بلا جواز آپ کی اصل اسناد یا ڈگری روک کر آپ کے مستقبل کو نقصان نہیں پہنچا سکتا۔",
          pa: "آرٹیکل 4 دے تحت کوئی وی ادارہ قانون توں بغیر تہاڈے اصل کاغذات یا ڈگری نہیں روک سکدا۔",
        },
      },
    ],
    statutoryLaws: [
      {
        law: "Higher Education Commission (HEC) Ordinance, 2002",
        section: "Section 10 & HEC Student Grievance Directives",
        explanation: {
          en: "HEC strictly prohibits universities from retaining students' original Matric/FSc certificates or withholding degrees/transcripts after clearance.",
          roman_ur: "HEC Ordinance 2002 ke mutabiq koi bhi university student ke original documents apne paas nahi rakh sakti aur clearance ke baad degree rokna qanoonan mana hai.",
          ur: "ایچ ای سی آرڈیننس 2002 اور ہدایات کے تحت یونیورسٹیوں کو طلباء کی اصل اسناد رکھنے یا کلیئرنس کے بعد ڈگری اور ٹرانسکرپٹ روکنے کی سختی سے ممانعت ہے۔",
          pa: "ایچ ای سی قنون 2002 دے مطابق کوئی وی یونیورسٹی طالب علم دے اصل سرٹیفکیٹ یا کلیئرنس توں بعد ڈگری نہیں روک سکدی۔",
        },
      },
      {
        law: "Wafaqi Mohtasib (Ombudsman) Order, 1983",
        section: "Article 9 (Maladministration)",
        explanation: {
          en: "Unjustified delay or refusal by a university or education board to issue degrees/certificates is actionable maladministration.",
          roman_ur: "University ya Board ki taraf se degree ya documents dene mein takheer par Wafaqi Mohtasib 60 din mein faisla karta hai.",
          ur: "یونیورسٹی یا تعلیمی بورڈ کی جانب سے ڈگری یا اسناد کی واپسی میں بلا جواز تاخیر بدانتظامی ہے جس پر وفاقی محتسب مفت کارروائی کرتا ہے۔",
          pa: "یونیورسٹی ولوں ڈگری یا کاغذات نہ دینا بدانتظامی اے جیدے تے وفاقی محتسب ایکشن لیندا اے۔",
        },
      },
    ],
    administrativeProcedures: {
      en: [
        "Submit a written application to the University Registrar / Controller of Examinations and keep a receiving copy.",
        "Lodge an online complaint on the HEC Online Help Portal (onlinehelp.hec.gov.pk) with your CNIC and Roll Number.",
        "File a free complaint with the Wafaqi Mohtasib (mohtasib.gov.pk) or use HaqAI's 1-Click Complaint Forwarder.",
      ],
      roman_ur: [
        "University ke Registrar ya Controller Examinations ko tahreeri darkhwast dein aur receiving copy mehfooz rakhein.",
        "HEC Online Help Portal (onlinehelp.hec.gov.pk) par 'Student Grievance' mein shikayat darj karein.",
        "HaqAI ke '1-Click Complaint' button se apni tayyar darkhwast foran HEC aur Wafaqi Mohtasib ko bhejein.",
      ],
      ur: [
        "سب سے پہلے یونیورسٹی کے رجسٹرار یا کنٹرولر امتحانات کو تحریری درخواست دیں اور رسید محفوظ رکھیں۔",
        "ایچ ای سی آن لائن ہیلپ پورٹل (onlinehelp.hec.gov.pk) پر اپنی شکایت درج کریں۔",
        "حق اے آئی کے 1-کلک شکایت بٹن سے اپنی تیار شدہ درخواست فوری طور پر ایچ ای سی اور وفاقی محتسب کو بھیجیں۔",
      ],
      pa: [
        "یونیورسٹی دے رجسٹرار نوں تحریری درخواست دیو تے ایچ ای سی پورٹل (onlinehelp.hec.gov.pk) اتے شکایت درج کرو۔",
      ],
    },
    followUpQuestions: {
      en: [
        "What is the name of the university/college and city?",
        "Have you completed your clearance form?",
      ],
      roman_ur: [
        "Aap ki university ya college ka naam aur shehar kya hai?",
        "Kya aap ki fees aur clearance mukammal hai?",
      ],
      ur: [
        "آپ کی یونیورسٹی یا کالج کا نام اور شہر کیا ہے؟",
        "کیا آپ نے اپنی تمام فیس اور کلیئرنس مکمل کر لی ہے؟",
      ],
      pa: ["تہاڈی یونیورسٹی دا ناں کی اے؟"],
    },
    authorities: [
      {
        id: "hec",
        name: "Higher Education Commission (HEC) – Student Grievance Portal",
        shortName: "HEC Pakistan",
        role: "Regulator of all public and private universities in Pakistan",
        portalUrl: "https://onlinehelp.hec.gov.pk",
        email: "complaints@hec.gov.pk",
        helpline: "051-111-119-432",
        address: "Sector H-9, Islamabad",
        turnaroundTime: "7–15 Working Days",
        instructions: {
          en: "Submit your ticket on onlinehelp.hec.gov.pk.",
          roman_ur: "onlinehelp.hec.gov.pk par ticket submit karein.",
          ur: "ایچ ای سی کے پورٹل پر شکایت درج کریں۔",
          pa: "ایچ ای سی پورٹل اتے شکایت بھیجو۔",
        },
      },
      {
        id: "mohtasib",
        name: "Wafaqi Mohtasib (Federal Ombudsman) of Pakistan",
        shortName: "Wafaqi Mohtasib",
        role: "Redresses maladministration against universities and boards",
        portalUrl: "https://www.mohtasib.gov.pk",
        email: "info@mohtasib.gov.pk",
        helpline: "1055",
        address: "Constitution Avenue, G-5/2, Islamabad",
        turnaroundTime: "30–60 Days",
        instructions: {
          en: "File free online complaint at mohtasib.gov.pk.",
          roman_ur: "mohtasib.gov.pk par muft online complaint karein.",
          ur: "وفاقی محتسب کی ویب سائٹ پر مفت شکایت درج کریں۔",
          pa: "وفاقی محتسب دی ویب سائٹ اتے مفت شکایت درج کرو۔",
        },
      },
    ],
    complaintTemplate: {
      subjectPrefix:
        "Formal Complaint Against Unlawful Withholding of Original Educational Documents / Degree",
      defaultRecipientTitle:
        "The Chairman / Grievance Redressal Cell, Higher Education Commission (HEC) & Wafaqi Mohtasib Secretariat, Islamabad",
      legalCitationParagraph:
        "Under Articles 4, 18, and 25A of the Constitution of Pakistan 1973, read with Section 10 of the Higher Education Commission Ordinance 2002 and HEC Regulatory Directives, no university is legally permitted to retain a student's original educational certificates or withhold degrees/transcripts after academic and financial clearance.",
      requestedReliefParagraph:
        "It is respectfully requested that immediate directions be issued to the concerned institution to release and hand over my original educational documents / degree without delay.",
    },
  },

  police: {
    id: "police",
    title: {
      en: "Police Complaints, FIR Registration, Theft & Unlawful Detention",
      roman_ur: "Police Shikayat, FIR ka Indiraj, Chori aur Giraftari se Tahaffuz",
      ur: "پولیس شکایات، ایف آئی آر کا اندراج، چوری اور غیر قانونی حراست سے تحفظ",
      pa: "پولیس دیاں شکایتاں تے ایف آئی آر دا اندراج",
    },
    iconName: "ShieldAlert",
    keywords: [
      "police",
      "fir",
      "thana",
      "sho",
      "arrest",
      "detention",
      "harass",
      "bribe",
      "rishwat",
      "theft",
      "chori",
      "dakaiti",
      "robbery",
      "1787",
      "igp",
      "dpo",
      "crime",
      "assault",
      "larai",
      "jhagra",
      "tashaddud",
      "bail",
      "zamanat",
      "hirasat",
      "giraftar",
      "wardat",
      "dhamki",
      "qatal",
      "mar peet",
      "پولیس",
      "تھانہ",
      "تھانے",
      "ایس ایچ او",
      "ایف آئی آر",
      "پرچہ",
      "چوری",
      "ڈکیتی",
      "راہزنی",
      "واردات",
      "گرفتار",
      "گرفتاری",
      "حراست",
      "رشوت",
      "تشدد",
      "مار پیٹ",
      "جھگڑا",
      "لڑائی",
      "دھمکی",
      "ضمانت",
      "قتل",
      "اغوا",
      "مقدمہ",
    ],
    constitutionalRights: [
      {
        article: "Article 9 & Article 10 – Constitution of Pakistan 1973",
        title: "Security of Person & Arrest Safeguards (جان و آزادی کا تحفظ)",
        summary: {
          en: "No person can be arrested without lawful grounds, must be allowed a lawyer, and must be produced before a Magistrate within 24 hours.",
          roman_ur: "Kisi bhi shehri ko qanoon ke baghair giraftar nahi kiya ja sakta aur 24 ghantay ke andar Magistrate ke samne pesh karna lazmi hai.",
          ur: "آرٹیکل 9 اور 10 کے تحت کسی شخص کو غیر قانونی طور پر حراست میں نہیں رکھا جا سکتا، گرفتاری کی وجہ بتانا اور 24 گھنٹے کے اندر مجسٹریٹ کے سامنے پیش کرنا لازم ہے۔",
          pa: "آرٹیکل 9 تے 10 دے تحت کسے وی بندے نوں غیر قانونی حراست وچ نہیں رکھیا جا سکدا۔",
        },
      },
      {
        article: "Article 14 – Constitution of Pakistan 1973",
        title: "Inviolability of Dignity & Prohibition of Torture (عزتِ نفس اور چادر و چار دیواری)",
        summary: {
          en: "Human dignity and privacy of home are inviolable. Police torture or entering a home without warrant is strictly unconstitutional.",
          roman_ur: "Har insaan ki izzat-e-nafs aur chadar aur char-diwari ka tahaffuz aaeeni haq hai. Police tashaddud bilkul ghair-qanooni hai.",
          ur: "آرٹیکل 14 کے تحت انسان کی عزتِ نفس اور چادر و چار دیواری کا تحفظ یقینی بنایا گیا ہے اور پولیس تشدد کی مکمل ممانعت ہے۔",
          pa: "آرٹیکل 14 دے تحت ہر انسان دی عزت تے گھر دی چار دیواری محفوظ اے۔",
        },
      },
    ],
    statutoryLaws: [
      {
        law: "Code of Criminal Procedure (CrPC), 1898",
        section: "Section 154 (FIR Registration), Section 22-A/22-B (Justice of Peace) & Section 491 (Habeas Corpus)",
        explanation: {
          en: "Under Sec. 154 CrPC, the SHO is legally bound to register an FIR for any cognizable crime. Upon refusal, complain to IGP 1787 / DPO or file a Sec. 22-A petition before the Sessions Judge.",
          roman_ur: "CrPC Section 154 ke tehat SHO par FIR darj karna farz hai. Inkar ki soorat mein IGP 1787 ya Section 22-A ke tehat Sessions Judge ko darkhwast dein.",
          ur: "ضابطہ فوجداری کی دفعہ 154 کے تحت ایس ایچ او پر ایف آئی آر درج کرنا فرض ہے۔ انکار کی صورت میں آئی جی کمپلینٹ سیل (1787) یا دفعہ 22-A کے تحت سیشن جج کو درخواست دیں، اور غیر قانونی حراست پر دفعہ 491 کی پٹیشن دائر کریں۔",
          pa: "ضابطہ فوجداری دی دفعہ 154 دے تحت ایس ایچ او نوں ایف آئی آر درج کرنا لازمی اے۔",
        },
      },
    ],
    administrativeProcedures: {
      en: [
        "Submit a written application at the Police Station Front Desk and take the computerized e-Tag receipt.",
        "Call or submit an online complaint to the IGP Police Complaint Cell (1787) or District Police Officer (DPO).",
        "If FIR is still not registered, file a petition under Section 22-A CrPC in the Sessions Court.",
      ],
      roman_ur: [
        "Police Station ke Front Desk par tahreeri darkhwast dein aur computerized e-Tag raseed hasil karein.",
        "SHO ke inkar par foran IGP Complaint Cell (1787) ya DPO Office mein shikayat darj karwayein.",
        "Sessions Judge (Justice of Peace) ko Section 22-A CrPC ki darkhwast dein.",
      ],
      ur: [
        "تھانے کے فرنٹ ڈیسک پر تحریری درخواست جمع کروائیں اور کمپیوٹرائزڈ رسید (e-Tag) حاصل کریں۔",
        "ایس ایچ او کے انکار پر فوری طور پر آئی جی کمپلینٹ سیل (1787) یا ڈی پی او آفس میں آن لائن شکایت بھیجیں۔",
        "سیشن کورٹ (جسٹس آف پیس) میں دفعہ 22-A کے تحت ایف آئی آر درج کروانے کے حکم کے لیے درخواست دیں۔",
      ],
      pa: ["تھانے دے فرنٹ ڈیسک اتے درخواست دیو تے نہ سنن تے 1787 آئی جی کمپلینٹ سیل نوں شکایت کرو۔"],
    },
    followUpQuestions: {
      en: ["Which Police Station (Thana) and city does this involve?"],
      roman_ur: ["Yeh waqia kis shehar aur kis Thana mein pesh aaya?"],
      ur: ["یہ واقعہ کس شہر اور کس تھانے کی حدود میں پیش آیا ہے؟"],
      pa: ["ایہہ واقعہ کیہڑے تھانے وچ ہویا اے؟"],
    },
    authorities: [
      {
        id: "igp_punjab",
        name: "IGP Police Complaint Center (1787) / Provincial Police",
        shortName: "Police Complaint Cell (1787)",
        role: "Enforces FIR registration and investigates police misconduct",
        portalUrl: "https://punjabpolice.gov.pk",
        email: "igpcomplaintcenter@punjabpolice.gov.pk",
        helpline: "1787",
        address: "Central Police Office (CPO) / DPO Office",
        turnaroundTime: "24–72 Hours",
        instructions: {
          en: "Call 1787 or submit online at punjabpolice.gov.pk.",
          roman_ur: "1787 par call karein ya police portal par shikayat bhejein.",
          ur: "1787 پر کال کریں یا پولیس پورٹل پر شکایت درج کریں۔",
          pa: "1787 اتے کال کرو۔",
        },
      },
    ],
    complaintTemplate: {
      subjectPrefix:
        "Urgent Complaint Regarding Non-Registration of FIR / Police Action under Section 154 CrPC",
      defaultRecipientTitle:
        "The Inspector General of Police (IGP) Complaint Cell (1787) & District Police Officer (DPO)",
      legalCitationParagraph:
        "Under Articles 4, 9, 10, and 14 of the Constitution of Pakistan 1973, read with Section 154 of the Code of Criminal Procedure (CrPC) 1898 and the Police Order 2002, registration of an FIR upon disclosure of a cognizable offense is a mandatory statutory duty.",
      requestedReliefParagraph:
        "It is respectfully prayed that immediate orders be issued to the concerned SHO to register the FIR under Section 154 CrPC, conduct an impartial investigation, and provide lawful protection.",
    },
  },

  family: {
    id: "family",
    title: {
      en: "Family Law: Haq Mehr, Wife & Child Maintenance (Kharcha), Khula & Custody",
      roman_ur: "Family Law: Haq Mehr, Biwi Bachon ka Kharcha, Khula, Talaq aur Jahez",
      ur: "فیملی قوانین: حق مہر، بیوی اور بچوں کا نان نفقہ (خرچہ)، خلع، طلاق اور حضانت",
      pa: "فیملی قنون: حق مہر، بیوی بچیاں دا خرچہ، خلع تے طلاق",
    },
    iconName: "HeartHandshake",
    keywords: [
      "shohar",
      "husband",
      "biwi",
      "wife",
      "nikah",
      "marriage",
      "shaadi",
      "shadi",
      "talaq",
      "divorce",
      "khula",
      "haq mehr",
      "mehr",
      "dower",
      "kharcha",
      "maintenance",
      "nan nafqa",
      "nafaqah",
      "jahez",
      "dowry",
      "custody",
      "hizanat",
      "bachon",
      "bachay",
      "children",
      "family court",
      "second marriage",
      "doosri shadi",
      "شوہر",
      "خاوند",
      "بیوی",
      "نکاح",
      "شادی",
      "طلاق",
      "خلع",
      "حق مہر",
      "مہر",
      "خرچہ",
      "نان نفقہ",
      "نفقہ",
      "جہیز",
      "بچوں",
      "بچے",
      "حضانت",
      "فیملی کورٹ",
      "گھر سے نکال",
      "دوسری شادی",
      "سسرال",
    ],
    constitutionalRights: [
      {
        article: "Article 35 & Article 25 – Constitution of Pakistan 1973",
        title: "Protection of Family, Mother and Child & Equality Before Law",
        summary: {
          en: "The State shall protect the marriage, the family, the mother and the child (Art. 35), and empower women and children with special legal protections (Art. 25(3)).",
          roman_ur: "Aaeen-e-Pakistan ka Article 35 aur 25 ma'an, bachon aur khandan ke qanooni haqooq aur tahaffuz ki zamanat deta hai.",
          ur: "آئینِ پاکستان کا آرٹیکل 35 اور 25(3) ماں، بچوں اور خاندان کے مکمل قانونی تحفظ اور مساوی حقوق کی ضمانت دیتا ہے۔",
          pa: "آئین دا آرٹیکل 35 تے 25 ماں تے بچیاں دے پورے تحفظ دی ضمانت دیندا اے۔",
        },
      },
    ],
    statutoryLaws: [
      {
        law: "Muslim Family Laws Ordinance, 1961 & Family Courts Act, 1964",
        section: "Section 9 (Maintenance / Nan-Nafqa), Section 6 (Polygamy), Section 7 (Talaq) & Dissolution of Muslim Marriages Act 1939",
        explanation: {
          en: "Entitles a wife and children to monthly maintenance (Kharcha), prompt recovery of Haq Mehr and dowry articles (Jahez), right to Khula, and child custody (Guardians & Wards Act 1890) through a single composite suit in the Family Court.",
          roman_ur: "Muslim Family Laws Ordinance 1961 aur Family Courts Act 1964 ke tehat biwi aur bachon ka mahana kharcha (maintenance), Haq Mehr, Jahez ke saman ki wapsi aur Khula ka faisla Family Court tezi se karti hai.",
          ur: "مسلم فیملی لاز آرڈیننس 1961 اور فیملی کورٹس ایکٹ 1964 کے تحت بیوی اور بچوں کا ماہانہ خرچہ (نان نفقہ)، حق مہر کی فوری ادائیگی، جہیز کے سامان کی واپسی، خلع اور بچوں کی حوالگی (حضانت) کا فیصلہ فیملی کورٹ کے ذریعے کیا جاتا ہے۔",
          pa: "فیملی کورٹس ایکٹ 1964 دے تحت حق مہر، بیوی بچیاں دا خرچہ، جہیز دی واپسی تے خلع دا فیصلہ فیملی کورٹ کردی اے۔",
        },
      },
    ],
    administrativeProcedures: {
      en: [
        "Keep a copy of your Nikahnama, CNIC, children's B-Form/birth certificates, and list of dowry articles.",
        "Apply to the Union Council Arbitration Council under Section 9 of Muslim Family Laws Ordinance 1961 for maintenance, or file a composite suit in the District Family Court.",
        "Call Ministry of Human Rights Helpline 1099 for free legal aid and Family Court lawyer assistance.",
      ],
      roman_ur: [
        "Apna Nikahnama, CNIC aur bachon ka B-Form mehfooz rakhein.",
        "Union Council Chairman ya seedha Family Court mein Haq Mehr, Maintenance (Kharcha) aur Jahez ki wapsi ka dawa dayer karein.",
        "Muft qanooni madad aur wakeel ke liye Ministry of Human Rights Helpline 1099 par rabta karein.",
      ],
      ur: [
        "اپنا نکاح نامہ، شناختی کارڈ اور بچوں کا ب فارم محفوظ رکھیں۔",
        "یونین کونسل یا براہِ راست فیملی کورٹ میں حق مہر، ماہانہ خرچہ (نان نفقہ) اور جہیز کی واپسی کا دعویٰ دائر کریں۔",
        "مفت قانونی مدد اور وکیل کے لیے وزارتِ انسانی حقوق کی ہیلپ لائن 1099 یا قانونی امداد سیل کو درخواست بھیجیں۔",
      ],
      pa: ["نکاح نامہ تے شناختی کارڈ نال فیملی کورٹ یا یونین کونسل وچ خرچے تے حق مہر دی درخواست دیو۔"],
    },
    followUpQuestions: {
      en: ["In which city do you currently reside, and do you have a copy of your Nikahnama?"],
      roman_ur: ["Aap is waqt kis shehar mein reh rahi hain aur kya aap ke paas Nikahnama maujood hai?"],
      ur: ["آپ اس وقت کس شہر میں مقیم ہیں اور کیا آپ کے پاس نکاح نامہ موجود ہے؟"],
      pa: ["تسی کیہڑے شہر وچ رہندے او؟"],
    },
    authorities: [
      {
        id: "mohr_family_1099",
        name: "Ministry of Human Rights (Free Family Legal Aid Helpline 1099) & District Family Court",
        shortName: "Family Legal Aid (1099)",
        role: "Provides free family legal aid, shelter referral, and Family Court petition support",
        portalUrl: "https://mohr.gov.pk",
        email: "helpline1099@mohr.gov.pk",
        helpline: "1099",
        address: "Ministry of Human Rights / District Legal Empowerment Committee",
        turnaroundTime: "Immediate Legal Referral / 30–90 Days Family Court",
        instructions: {
          en: "Call 1099 toll-free or submit your application via mohr.gov.pk.",
          roman_ur: "1099 par muft call karein ya HaqAI se apni darkhwast forward karein.",
          ur: "ہیلپ لائن 1099 پر مفت کال کریں یا اپنی درخواست فارورڈ کریں۔",
          pa: "1099 اتے مفت کال کرو۔",
        },
      },
    ],
    complaintTemplate: {
      subjectPrefix:
        "Application for Recovery of Maintenance (Nan-Nafqa), Haq Mehr & Family Protection under Muslim Family Laws Ordinance 1961",
      defaultRecipientTitle:
        "The Chairman Arbitration Council / Judge Family Court & Directorate of Legal Aid (Helpline 1099)",
      legalCitationParagraph:
        "Under Articles 4, 25, and 35 of the Constitution of Pakistan 1973, read with Section 9 of the Muslim Family Laws Ordinance 1961 and the Family Courts Act 1964, a husband/father is legally bound to pay prompt dower (Haq Mehr) and provide monthly maintenance (Nan-Nafqa) for his wife and children.",
      requestedReliefParagraph:
        "It is respectfully prayed that immediate legal proceedings be initiated for recovery of monthly maintenance, unpaid Haq Mehr, and lawful family protection.",
    },
  },

  civil_criminal: {
    id: "civil_criminal",
    title: {
      en: "Cheque Dishonour (489-F PPC), Financial Fraud (420 PPC) & Money Recovery",
      roman_ur: "Cheque Bounce (489-F), Fraud (420), Udhar / Qarz ki Wapsi aur Lain Dain",
      ur: "چیک باؤنس (دفعہ 489-F)، مالی دھوکہ دہی (دفعہ 420) اور رقم / قرض کی واپسی",
      pa: "چیک باؤنس، دھوکہ دہی تے پیسیاں دی واپسی",
    },
    iconName: "Scale",
    keywords: [
      "cheque",
      "check",
      "bounce",
      "dishonour",
      "489f",
      "489-f",
      "420",
      "406",
      "udhar",
      "qarz",
      "qarza",
      "loan",
      "money",
      "paise",
      "raqam",
      "agreement",
      "contract",
      "muahida",
      "dhoka",
      "amanat",
      "khayanat",
      "partner",
      "karobar",
      "committee",
      "چیک",
      "باؤنس",
      "ڈس آنر",
      "ادھار",
      "قرض",
      "قرضہ",
      "رقم",
      "پیسے",
      "دھوکہ",
      "فراڈ",
      "امانت",
      "خیانت",
      "معاہدہ",
      "اقرار نامہ",
      "کاروبار",
      "کمیٹی",
    ],
    constitutionalRights: [
      {
        article: "Article 4, Article 18 & Article 24 – Constitution of Pakistan 1973",
        title: "Protection of Law, Lawful Business & Financial Property Rights",
        summary: {
          en: "Protects every citizen against financial fraud, breach of trust, and unlawful deprivation of their hard-earned money and property.",
          roman_ur: "Aaeen ka Article 4 aur 24 har shehri ki raqam aur mal-o-jaidad ko dhoka-dahi se qanooni tahaffuz deta hai.",
          ur: "آئینِ پاکستان کا آرٹیکل 4 اور 24 ہر شہری کی حلال کمائی، رقم اور جائیداد کو دھوکہ دہی سے مکمل قانونی تحفظ فراہم کرتا ہے۔",
          pa: "آئین دا آرٹیکل 4 تے 24 ہر شہری دے پیسے تے مال دی حفاظت کردا اے۔",
        },
      },
    ],
    statutoryLaws: [
      {
        law: "Pakistan Penal Code (PPC), 1860",
        section: "Section 489-F (Dishonouring of Cheque), Section 420 (Cheating & Fraud) & Section 406 (Criminal Breach of Trust)",
        explanation: {
          en: "Issuing a cheque that bounces dishonestly is a criminal offense punishable with up to 3 years imprisonment under Sec. 489-F PPC. Cheating/fraud is punishable up to 7 years under Sec. 420 PPC, and breach of trust under Sec. 406 PPC.",
          roman_ur: "Section 489-F PPC ke tehat cheque bounce hona qabil-e-giraftari jurm hai (3 saal tak qaid). Dhoka-dahi par Section 420 aur amanat mein khayanat par Section 406 PPC ki FIR darj hoti hai.",
          ur: "تعزیراتِ پاکستان کی دفعہ 489-F کے تحت چیک باؤنس ہونا قابلِ دست اندازی جرم ہے جس کی سزا 3 سال تک قید ہے۔ دھوکہ دہی پر دفعہ 420 اور امانت میں خیانت پر دفعہ 406 کے تحت فوجداری مقدمہ درج ہوتا ہے، جبکہ رقم کی فوری واپسی کے لیے آرڈر 37 ضابطہ دیوانی (Order 37 CPC) کا دعویٰ دائر ہوتا ہے۔",
          pa: "دفعہ 489-F دے تحت چیک باؤنس ہونا فوجداری جرم اے جیدے تے ایف آئی آر درج ہوندی اے۔",
        },
      },
    ],
    administrativeProcedures: {
      en: [
        "Obtain the official Return Memo from the bank when a cheque bounces, or keep all bank transfer/stamp paper proofs.",
        "Submit an application to the DPO / SHO for registration of FIR under Section 489-F / 420 / 406 PPC.",
        "Simultaneously file a Summary Recovery Suit under Order 37 CPC in the Sessions Court to recover your money.",
      ],
      roman_ur: [
        "Bank se Cheque Return Memo hasil karein ya iqrar-nama/bank transfer ka saboot mehfooz rakhein.",
        "Police Station / DPO ko Section 489-F / 420 / 406 PPC ke tehat FIR ke liye darkhwast dein.",
        "Raqam ki wapsi ke liye Order 37 CPC ke tehat adalat mein recovery suit dayer karein.",
      ],
      ur: [
        "چیک باؤنس ہونے کی صورت میں بینک سے اصل چیک اور بینک ریٹرن میمو (Return Memo) حاصل کریں۔",
        "متعلقہ تھانے یا ڈی پی او آفس میں دفعہ 489-F، دفعہ 420 یا دفعہ 406 کے تحت ایف آئی آر درج کروانے کی درخواست دیں۔",
        "اپنی رقم کی فوری وصولی کے لیے سیشن کورٹ میں آرڈر 37 (Order 37 CPC) کے تحت دعویٰ دائر کریں۔",
      ],
      pa: ["بینک توں چیک ریٹرن میمو لو تے دفعہ 489-F یا 420 دی ایف آئی آر لئی پولیس نوں درخواست دیو۔"],
    },
    followUpQuestions: {
      en: ["What is the amount involved and do you have a bank cheque, return memo, or written agreement?"],
      roman_ur: ["Kitni raqam ka masla hai aur kya aap ke paas bank cheque ya تحریری saboot hai?"],
      ur: ["کتنی رقم کا معاملہ ہے اور کیا آپ کے پاس بینک چیک، ریٹرن میمو یا تحریری ثبوت موجود ہے؟"],
      pa: ["کنے پیسیاں دا معاملہ اے تے کیہ تہاڈے کول چیک یا ثبوت ہے؟"],
    },
    authorities: [
      {
        id: "police_489f",
        name: "District Police Officer (DPO) / IGP Complaint Cell (1787)",
        shortName: "Police / DPO Cell (1787)",
        role: "Registers criminal FIR under Section 489-F, 420 & 406 PPC",
        portalUrl: "https://punjabpolice.gov.pk",
        email: "igpcomplaintcenter@punjabpolice.gov.pk",
        helpline: "1787",
        address: "District Police Headquarters / CPO",
        turnaroundTime: "3–7 Days Inquiry & FIR",
        instructions: {
          en: "Submit your application with copies of the dishonoured cheque and bank return memo.",
          roman_ur: "Cheque aur Return Memo ki copy ke sath darkhwast jama karwayein.",
          ur: "چیک اور بینک میمو کی کاپی کے ساتھ اپنی درخواست جمع کروائیں۔",
          pa: "چیک تے میمو دی کاپی نال درخواست جمع کراؤ۔",
        },
      },
    ],
    complaintTemplate: {
      subjectPrefix:
        "Application for Registration of FIR under Section 489-F / 420 / 406 PPC for Financial Fraud & Dishonour of Cheque",
      defaultRecipientTitle:
        "The District Police Officer (DPO) / IGP Complaint Center (1787) & Station House Officer (SHO)",
      legalCitationParagraph:
        "Under Section 489-F, Section 420, and Section 406 of the Pakistan Penal Code (PPC) 1860, read with Section 154 of the Code of Criminal Procedure (CrPC) 1898, dishonestly issuing a cheque that is dishonoured by the bank or committing financial cheating and criminal breach of trust are cognizable offenses.",
      requestedReliefParagraph:
        "It is respectfully prayed that an immediate FIR be registered against the accused under Sections 489-F / 420 / 406 PPC and lawful action be taken for recovery of my defrauded amount.",
    },
  },

  property: {
    id: "property",
    title: {
      en: "Property, Women's Inheritance (Wirasat), Land Grabbing (Qabza) & Rent Disputes",
      roman_ur: "Jaidad, Khawateen ki Wirasat, Najayaz Qabza aur Makan / Kirayedar ke Masail",
      ur: "جائیداد، خواتین کی وراثت، ناجائز قبضہ اور مکان مالک و کرایہ دار کے مسائل",
      pa: "زمین جائیداد، ناجائز قبضہ، کرایہ داری تے عورتاں دا وراثتی حصہ",
    },
    iconName: "Home",
    keywords: [
      "property",
      "inheritance",
      "wirasat",
      "warasat",
      "land",
      "qabza",
      "house",
      "makan",
      "plot",
      "fard",
      "intiqal",
      "mutation",
      "patwari",
      "sister",
      "behan",
      "walida",
      "widow",
      "bewa",
      "share",
      "hissa",
      "zameen",
      "rent",
      "kiraya",
      "kirayedar",
      "tenant",
      "landlord",
      "makan malik",
      "eviction",
      "registry",
      "جائیداد",
      "وراثت",
      "قبضہ",
      "ناجائز قبضہ",
      "زمین",
      "مکان",
      "پلاٹ",
      "فرد",
      "انتقال",
      "پٹواری",
      "رجسٹری",
      "حصہ",
      "بہن",
      "بیوہ",
      "کرایہ",
      "کرایہ دار",
      "مکان مالک",
      "خالی",
    ],
    constitutionalRights: [
      {
        article: "Article 23, Article 24 & Article 25 – Constitution of Pakistan 1973",
        title: "Protection of Property & Inheritance Rights (جائیداد اور وراثت کا آئینی تحفظ)",
        summary: {
          en: "Every citizen (man or woman) has the constitutional right to acquire, hold, and inherit property, and no person can be unlawfully deprived of their property.",
          roman_ur: "Har shehri ko apni jaidad, makan aur wirasati hissay ke tahaffuz ka mukammal aaeeni haq hasil hai.",
          ur: "آرٹیکل 23، 24 اور 25 کے تحت ہر شہری (مرد اور عورت) کو اپنی جائیداد اور وراثتی حصے کے تحفظ کا مکمل آئینی حق حاصل ہے۔",
          pa: "آرٹیکل 23 تے 24 دے تحت ہر شہری نوں اپنی زمین تے وراثت دے تحفظ دا پورا حق حاصل اے۔",
        },
      },
    ],
    statutoryLaws: [
      {
        law: "Enforcement of Women's Property Rights Act, 2020 & Illegal Dispossession Act, 2005",
        section: "Sections 4 & 5 (Ombudsman 60-Day Restoration); Section 3 (Illegal Dispossession / Qabza); Provincial Rented Premises Acts",
        explanation: {
          en: "The Ombudsman (FOSPAH) restores women's inheritance or property within 60 days through DC & Police. Land grabbers (Qabza) face 10 years prison under the Illegal Dispossession Act 2005, and Rent Tribunals resolve landlord-tenant disputes.",
          roman_ur: "Khawateen ki wirasat 60 din mein FOSPAH ke zariye wapas milti hai, najayaz qabzay par 10 saal qaid hai, aur kirayedar/makan malik ke masail Rent Controller hal karta hai.",
          ur: "خواتین کے حقوقِ جائیداد ایکٹ 2020 کے تحت محتسب 60 دن میں ڈپٹی کمشنر اور پولیس کے ذریعے خواتین کو ان کا وراثتی حصہ دلواتا ہے۔ ناجائز قبضہ کرنے والوں کو اللیگل ڈسپوزیشن ایکٹ 2005 کے تحت 10 سال قید کی سزا ہے، اور کرایہ داری کے مسائل رینٹ ٹربیونل حل کرتا ہے۔",
          pa: "عورتاں دے جائیداد دے قنون 2020 دے تحت محتسب 60 دناں وچ وراثت دا حصہ واپس دلواندا اے۔",
        },
      },
    ],
    administrativeProcedures: {
      en: [
        "Obtain NADRA Family Registration Certificate (FRC) and Fard / ownership record from the Arazi Record Center (PLRA).",
        "File an online petition with FOSPAH (fospah.gov.pk) for inheritance/women's property or approach the Deputy Commissioner / Sessions Court against illegal Qabza.",
      ],
      roman_ur: [
        "NADRA se FRC aur Arazi Record Center se Fard hasil karein.",
        "Wirasat ke liye FOSPAH (fospah.gov.pk) aur najayaz qabzay ya kirayedar ke maslay par DC Office / Adalat mein darkhwast dein.",
      ],
      ur: [
        "نادرا سے ایف آر سی (FRC) اور اراضی ریکارڈ سینٹر سے زمین کی فرد حاصل کریں۔",
        "خواتین کی وراثت کے لیے فوسپاہ (fospah.gov.pk) اور ناجائز قبضے یا کرایہ داری کے لیے ڈی سی آفس یا عدالت میں درخواست دیں۔",
      ],
      pa: ["نادرا توں ایف آر سی تے اراضی سینٹر توں فرد لو تے فوسپاہ وچ شکایت درج کرو۔"],
    },
    followUpQuestions: {
      en: ["Is this about inheritance (Wirasat), illegal Qabza, or a rent dispute?"],
      roman_ur: ["Kya yeh wirasat ka masla hai, najayaz qabzay ka, ya makan kiraye ka?"],
      ur: ["کیا یہ وراثت کے حصے کا مسئلہ ہے، ناجائز قبضے کا، یا مکان کرایہ داری کا؟"],
      pa: ["کیہ ایہہ وراثت دا مسئلہ اے یا قبضے دا؟"],
    },
    authorities: [
      {
        id: "fospah_property",
        name: "Ombudsman for Enforcement of Women's Property Rights (FOSPAH) & Land Revenue Authority",
        shortName: "FOSPAH Property Cell",
        role: "Restores inheritance and property possession within 60 days",
        portalUrl: "https://fospah.gov.pk",
        email: "complaints@fospah.gov.pk",
        helpline: "051-9264446",
        address: "Sector G-5/2, Islamabad / Provincial Offices",
        turnaroundTime: "60 Days Statutory Limit",
        instructions: {
          en: "File your petition at fospah.gov.pk.",
          roman_ur: "fospah.gov.pk par darkhwast dein.",
          ur: "fospah.gov.pk پر آن لائن درخواست جمع کروائیں۔",
          pa: "fospah.gov.pk اتے درخواست دیو۔",
        },
      },
    ],
    complaintTemplate: {
      subjectPrefix:
        "Petition for Restoration of Lawful Property / Inheritance Share under Women's Property Rights Act 2020 & Illegal Dispossession Act 2005",
      defaultRecipientTitle:
        "The Honourable Ombudsman (FOSPAH) / Deputy Commissioner & Land Revenue Authority",
      legalCitationParagraph:
        "Under Articles 23, 24, and 25 of the Constitution of Pakistan 1973, read with Sections 4 and 5 of the Enforcement of Women's Property Rights Act 2020 and the Illegal Dispossession Act 2005, depriving any lawful heir or owner of their property or inheritance share is unlawful.",
      requestedReliefParagraph:
        "It is respectfully prayed that an immediate inquiry be conducted through the Deputy Commissioner and Revenue authorities to restore my lawful property/inheritance share and mutate the revenue record accordingly.",
    },
  },

  employment: {
    id: "employment",
    title: {
      en: "Employment, Unpaid Salary / Wages, Job Termination & Workplace Harassment",
      roman_ur: "Mulazmat, Roki Gayi Tankhwah (Salary), Termination aur Workplace Harassment",
      ur: "ملازمت، روکی گئی تنخواہ، غیر قانونی برطرفی اور کام کی جگہ پر ہراسانی",
      pa: "نوکری، تنخواہ نہ ملنا تے دفتر وچ ہراسانی",
    },
    iconName: "Briefcase",
    keywords: [
      "salary",
      "wages",
      "tankhwah",
      "paghar",
      "ujrat",
      "employer",
      "job",
      "nokri",
      "mulazmat",
      "terminated",
      "termination",
      "fired",
      "nikal diya",
      "workplace",
      "harassment",
      "boss",
      "company",
      "factory",
      "eobi",
      "pension",
      "labour",
      "mazdoor",
      "leave",
      "overtime",
      "تنخواہ",
      "اجرت",
      "ملازمت",
      "نوکری",
      "ہراسانی",
      "کمپنی",
      "فیکٹری",
      "مزدور",
      "مالک",
      "برطرف",
      "نکال دیا",
      "پینشن",
      "پنشن",
      "ای او بی آئی",
    ],
    constitutionalRights: [
      {
        article: "Article 11, Article 18 & Article 37(e) – Constitution of Pakistan 1973",
        title: "Right to Lawful Livelihood, Humane Work Conditions & Prohibition of Unpaid Labour",
        summary: {
          en: "Prohibits unpaid/forced labour (Art. 11), protects lawful livelihood (Art. 18), and guarantees humane working conditions (Art. 37e).",
          roman_ur: "Bina tankhwah kaam karwana aur ghair-qanooni tor par nokri se nikalna Aaeen ke khilaf hai.",
          ur: "آرٹیکل 11، 18 اور 37(e) کے تحت ہر ملازم اور مزدور کو وقت پر پوری تنخواہ اور باعزت ماحول میں کام کرنے کا آئینی حق حاصل ہے۔",
          pa: "آرٹیکل 11 تے 18 دے تحت ہر مزدور تے ملازم نوں اپنی پوری تنخواہ لین دا حق اے۔",
        },
      },
    ],
    statutoryLaws: [
      {
        law: "Payment of Wages Act, 1936, Standing Orders Ordinance, 1968 & Workplace Harassment Act, 2010",
        section: "Section 15 (Recovery of Unpaid Wages) & Section 8 (FOSPAH Harassment Redressal)",
        explanation: {
          en: "Mandates immediate payment of withheld salaries with compensation through the Labour Authority / NIRC, and protects employees against workplace harassment via FOSPAH.",
          roman_ur: "Payment of Wages Act Section 15 ke tehat Labour Authority roki gayi tankhwah wapas dilati hai, aur workplace harassment par FOSPAH karrawai karta hai.",
          ur: "پیمنٹ آف ویجز ایکٹ 1936 کی دفعہ 15 کے تحت لیبر اتھارٹی اور این آئی آر سی روکی گئی تنخواہ اور واجبات فوری دلوانے کا حکم دیتی ہے، اور ہراسانی کے خلاف فوسپاہ کارروائی کرتا ہے۔",
          pa: "روکی ہوئی تنخواہ واپس لین لئی لیبر اتھارٹی تے این آئی آر سی کول درخواست دتی جا سکدی اے۔",
        },
      },
    ],
    administrativeProcedures: {
      en: [
        "Save your appointment letter, salary bank statements, and WhatsApp/email messages.",
        "File a wage recovery petition with the Labour Department / NIRC (nirc.gov.pk) or a harassment complaint with FOSPAH (fospah.gov.pk).",
      ],
      roman_ur: [
        "Apna job letter, bank salary record aur messages ka saboot mehfooz rakhein.",
        "Tankhwah ke liye NIRC / Labour Officer aur harassment ke liye FOSPAH ko 1-Click Complaint bhejein.",
      ],
      ur: [
        "اپنی ملازمت کا ریکارڈ، بینک اسٹیٹمنٹ اور میسجز محفوظ رکھیں۔",
        "تنخواہ کی وصولی کے لیے لیبر آفیسر / این آئی آر سی (nirc.gov.pk) اور ہراسانی کے لیے فوسپاہ (fospah.gov.pk) کو شکایت بھیجیں۔",
      ],
      pa: ["اپنی نوکری دے کاغذ سنبھال کے رکھو تے لیبر محکمے نوں شکایت بھیجو۔"],
    },
    followUpQuestions: {
      en: ["What is the name of the company/employer and how many months' salary is unpaid?"],
      roman_ur: ["Company ka naam kya hai aur kitne mahinay ki tankhwah baqi hai?"],
      ur: ["کمپنی یا ادارے کا نام کیا ہے اور کتنے مہینے کی تنخواہ واجب الادا ہے؟"],
      pa: ["کمپنی دا ناں کی اے؟"],
    },
    authorities: [
      {
        id: "nirc_labour",
        name: "National Industrial Relations Commission (NIRC) & Labour Directorate / FOSPAH",
        shortName: "NIRC / Labour Authority",
        role: "Recovers unpaid wages and redresses unlawful termination & harassment",
        portalUrl: "https://nirc.gov.pk",
        email: "info@nirc.gov.pk",
        helpline: "051-9203896",
        address: "Sector G-5/2, Islamabad / Provincial Labour Courts",
        turnaroundTime: "15–45 Days",
        instructions: {
          en: "Submit your wage claim at nirc.gov.pk or fospah.gov.pk.",
          roman_ur: "nirc.gov.pk ya fospah.gov.pk par darkhwast bhejein.",
          ur: "این آئی آر سی یا لیبر اتھارٹی کو درخواست بھیجیں۔",
          pa: "لیبر اتھارٹی نوں درخواست دیو۔",
        },
      },
    ],
    complaintTemplate: {
      subjectPrefix:
        "Formal Claim for Recovery of Unpaid Wages / Salary & Unlawful Employment Action",
      defaultRecipientTitle:
        "The Presiding Officer, Labour Authority / National Industrial Relations Commission (NIRC) & FOSPAH",
      legalCitationParagraph:
        "Under Articles 4, 11, 18, and 37(e) of the Constitution of Pakistan 1973, read with Section 15 of the Payment of Wages Act 1936 and the Industrial and Commercial Employment (Standing Orders) Ordinance 1968, withholding earned salary or terminating an employee without statutory notice and dues is illegal.",
      requestedReliefParagraph:
        "It is respectfully prayed that the employer be directed to immediately release my withheld salary and lawful dues along with statutory compensation.",
    },
  },

  cybercrime: {
    id: "cybercrime",
    title: {
      en: "Cybercrime, Online Fraud, Blackmailing & Banking / EasyPaisa / JazzCash Disputes",
      roman_ur: "Cybercrime, Online Fraud, Blackmailing, Hacking aur Bank / EasyPaisa Katoti",
      ur: "سائبر کرائم، آن لائن فراڈ، بلیک میلنگ، ہیکنگ اور بینک و ایزی پیسہ شکایات",
      pa: "سائبر کرائم، آن لائن دھوکہ تے بینکنگ دیاں شکایتاں",
    },
    iconName: "ShieldCheck",
    keywords: [
      "cyber",
      "cybercrime",
      "fia",
      "hack",
      "hacked",
      "whatsapp",
      "facebook",
      "instagram",
      "tiktok",
      "blackmail",
      "blackmailing",
      "tasweer",
      "video",
      "scam",
      "online fraud",
      "bank",
      "easypaisa",
      "jazzcash",
      "sadapay",
      "nayapay",
      "atm",
      "account",
      "otp",
      "loan app",
      "1991",
      "nr3c",
      "سائبر",
      "بلیک میل",
      "بلیک میلنگ",
      "ہیک",
      "واٹس ایپ",
      "فیس بک",
      "تصویر",
      "ویڈیو",
      "آن لائن فراڈ",
      "بینک",
      "اکاؤنٹ",
      "ایزی پیسہ",
      "جاز کیش",
      "اے ٹی ایم",
      "ایف آئی اے",
    ],
    constitutionalRights: [
      {
        article: "Article 14 & Article 4 – Constitution of Pakistan 1973",
        title: "Inviolability of Dignity, Privacy & Financial Protection",
        summary: {
          en: "Protects every citizen's personal privacy, dignity, photos/data, and bank accounts against digital extortion and fraud.",
          roman_ur: "Aap ki digital privacy, izzat-e-nafs aur bank account ke tahaffuz ki zamanat Aaeen ka Article 14 aur 4 deta hai.",
          ur: "آئینِ پاکستان کا آرٹیکل 14 اور 4 ہر شہری کی نجی معلومات، عزتِ نفس اور بینک اکاؤنٹ کے تحفظ کی ضمانت دیتا ہے۔",
          pa: "آرٹیکل 14 تے 4 ہر شہری دی پرائیویسی تے پیسے دے تحفظ دی ضمانت دیندے نیں۔",
        },
      },
    ],
    statutoryLaws: [
      {
        law: "Prevention of Electronic Crimes Act (PECA), 2016 & Banking Companies Ordinance, 1962",
        section: "Sections 14 (Electronic Fraud), 20 (Dignity), 21 (Modesty/Blackmail) & 24 (Cyberstalking) PECA; Sec. 82A Banking Ordinance",
        explanation: {
          en: "Criminalizes online blackmail, photo/video misuse, hacking, and financial fraud (up to 7 years prison) via FIA Cybercrime (1991), and recovers unauthorized bank deductions via Banking Mohtasib.",
          roman_ur: "PECA 2016 ke tehat online blackmailing, hacking aur fraud par FIA Cybercrime (1991) karrawai karta hai aur Banking Mohtasib bank se kati raqam wapas dilata hai.",
          ur: "پیکا ایکٹ 2016 کے تحت آن لائن بلیک میلنگ، ہیکنگ، جعلی اکاؤنٹس اور آن لائن فراڈ پر ایف آئی اے سائبر کرائم ونگ (ہیلپ لائن 1991) فوری کارروائی کرتا ہے اور بینکنگ محتسب بینک سے کٹی ہوئی رقم واپس دلواتا ہے۔",
          pa: "پیکا ایکٹ 2016 دے تحت آن لائن فراڈ تے بلیک میلنگ تے ایف آئی اے 1991 کارروائی کردا اے۔",
        },
      },
    ],
    administrativeProcedures: {
      en: [
        "Do not delete messages—take screenshots of the phone number, profile link, and transaction ID.",
        "Call FIA Cybercrime Helpline 1991 or submit your complaint at nr3c.gov.pk / bankingmohtasib.gov.pk.",
      ],
      roman_ur: [
        "Screenshots, transaction ID aur phone numbers mehfooz rakhein.",
        "FIA Cybercrime Helpline 1991 ya Banking Mohtasib ko 1-Click Complaint bhejein.",
      ],
      ur: [
        "تمام اسکرین شاٹس، فون نمبرز اور ٹرانزیکشن آئی ڈی محفوظ رکھیں۔",
        "ایف آئی اے سائبر کرائم ہیلپ لائن 1991 یا بینکنگ محتسب کو فوری آن لائن شکایت بھیجیں۔",
      ],
      pa: ["سکرین شاٹ سنبھال کے رکھو تے ایف آئی اے 1991 نوں شکایت کرو۔"],
    },
    followUpQuestions: {
      en: ["Is this about online harassment/blackmailing or bank/EasyPaisa financial fraud?"],
      roman_ur: ["Kya yeh online blackmailing ka masla hai ya bank/EasyPaisa fraud ka?"],
      ur: ["کیا یہ آن لائن بلیک میلنگ کا مسئلہ ہے یا بینک/ایزی پیسہ مالی فراڈ کا؟"],
      pa: ["کیہ ایہہ بلیک میلنگ دا مسئلہ اے یا پیسیاں دے فراڈ دا؟"],
    },
    authorities: [
      {
        id: "fia_nr3c",
        name: "FIA Cybercrime Wing (NR3C / NCCIA) & Banking Mohtasib Pakistan",
        shortName: "FIA Cybercrime (1991)",
        role: "Investigates PECA 2016 cybercrimes and digital financial fraud",
        portalUrl: "https://nr3c.gov.pk",
        email: "helpdesk@nr3c.gov.pk",
        helpline: "1991",
        address: "Sector G-10/4, Islamabad / Regional FIA Centers",
        turnaroundTime: "24–72 Hours Emergency Action",
        instructions: {
          en: "Call 1991 or file online at nr3c.gov.pk.",
          roman_ur: "1991 par call karein ya nr3c.gov.pk par report karein.",
          ur: "ہیلپ لائن 1991 پر کال کریں یا nr3c.gov.pk پر شکایت درج کریں۔",
          pa: "1991 اتے کال کرو۔",
        },
      },
    ],
    complaintTemplate: {
      subjectPrefix:
        "Urgent Complaint Under PECA 2016 / Banking Ordinance Regarding Cybercrime & Digital Fraud",
      defaultRecipientTitle:
        "The Director, FIA Cybercrime Wing (NR3C) & Banking Mohtasib Pakistan",
      legalCitationParagraph:
        "Under Articles 4 and 14 of the Constitution of Pakistan 1973, read with Sections 14, 20, 21, and 24 of the Prevention of Electronic Crimes Act (PECA) 2016 and the Banking Companies Ordinance 1962, unauthorized digital access, online blackmail/harassment, and electronic financial fraud are serious offenses.",
      requestedReliefParagraph:
        "It is respectfully requested that an immediate technical inquiry be initiated, the offending numbers/accounts be blocked, my defrauded funds be recovered, and strict legal action be taken under PECA 2016.",
    },
  },

  government: {
    id: "government",
    title: {
      en: "Government Services, NADRA CNIC, Passports, Electricity & Sui Gas Bills, Tax/FBR",
      roman_ur: "Sarkari Idaray, NADRA, Passport, Bijli / Sui Gas ke Bills aur FBR Tax",
      ur: "سرکاری ادارے، نادرا شناختی کارڈ، پاسپورٹ، بجلی و گیس کے بل اور ٹیکس شکایات",
      pa: "سرکاری محکمے، نادرا، پاسپورٹ تے بجلی گیس دے بل",
    },
    iconName: "Landmark",
    keywords: [
      "nadra",
      "cnic",
      "b-form",
      "id card",
      "shanakhti card",
      "passport",
      "wapda",
      "lesco",
      "iesco",
      "mepco",
      "kelectric",
      "bijli",
      "electricity",
      "sui gas",
      "gas",
      "sngpl",
      "bill",
      "overbilling",
      "meter",
      "fbr",
      "tax",
      "cda",
      "railway",
      "post office",
      "sarkari",
      "mohtasib",
      "نادرا",
      "شناختی کارڈ",
      "ب فارم",
      "پاسپورٹ",
      "بجلی",
      "واپڈا",
      "گیس",
      "سوئی گیس",
      "بل",
      "میٹر",
      "ٹیکس",
      "ایف بی آر",
      "سرکاری",
      "محتسب",
    ],
    constitutionalRights: [
      {
        article: "Article 4, Article 19A & Article 25 – Constitution of Pakistan 1973",
        title: "Lawful Public Service, Right to Information & Equal Treatment",
        summary: {
          en: "Every citizen has the right to timely government services, accurate utility billing, and access to public records without bribery or delay.",
          roman_ur: "Har shehri ka haq hai ke sarkari idaray waqt par kaam karein aur ghalat bijli/gas bill na bhejein.",
          ur: "آرٹیکل 4، 19A اور 25 کے تحت ہر شہری کو سرکاری اداروں سے بروقت سروس، درست بلنگ اور معلومات حاصل کرنے کا آئینی حق حاصل ہے۔",
          pa: "آرٹیکل 4 تے 25 دے تحت ہر شہری نوں سرکاری محکمیاں توں وقت سر کم کران دا حق اے۔",
        },
      },
    ],
    statutoryLaws: [
      {
        law: "Wafaqi Mohtasib Order, 1983, NEPRA Act, 1997 & NADRA Ordinance, 2000",
        section: "Article 9 (Maladministration & Overbilling Redressal)",
        explanation: {
          en: "Provides free redressal within 60 days against NADRA CNIC blocking, Passport delays, and wrong Electricity/Gas billing.",
          roman_ur: "NADRA, Passport aur Bijli/Gas companies ki ghalat billing ya takheer ke khilaf Wafaqi Mohtasib (1055) muft faisla karta hai.",
          ur: "وفاقی محتسب آرڈر 1983 اور نیپرا قوانین کے تحت نادرا شناختی کارڈ، پاسپورٹ کی تاخیر اور بجلی و گیس کے غلط بلوں کے خلاف مفت کارروائی کی جاتی ہے۔",
          pa: "نادرا، پاسپورٹ تے بجلی گیس دے غلط بلاں خلاف وفاقی محتسب مفت فیصلہ کردا اے۔",
        },
      },
    ],
    administrativeProcedures: {
      en: [
        "Note your tracking ID or bill reference number.",
        "Submit a free online complaint to Wafaqi Mohtasib (mohtasib.gov.pk) or Pakistan Citizen Portal (citizenportal.gov.pk).",
      ],
      roman_ur: [
        "Apna tracking number ya bill reference number note karein.",
        "Wafaqi Mohtasib (mohtasib.gov.pk) ko 1-Click Complaint forward karein.",
      ],
      ur: [
        "اپنا ٹریکنگ نمبر یا بل ریفرنس نمبر نوٹ کریں۔",
        "وفاقی محتسب (mohtasib.gov.pk) یا پاکستان سٹیزن پورٹل پر ایک کلک سے شکایت بھیجیں۔",
      ],
      pa: ["وفاقی محتسب (1055) نوں آن لائن شکایت درج کرو۔"],
    },
    followUpQuestions: {
      en: ["Which government department or utility (NADRA, Passport, Electricity, Gas) is this against?"],
      roman_ur: ["Yeh shikayat kis idaray (NADRA, Passport, Bijli, Gas) ke khilaf hai?"],
      ur: ["یہ شکایت کس سرکاری ادارے (نادرا، پاسپورٹ، بجلی یا گیس) کے خلاف ہے؟"],
      pa: ["تہاڈی شکایت کیہڑے سرکاری محکمے خلاف اے؟"],
    },
    authorities: [
      {
        id: "mohtasib_gov",
        name: "Wafaqi Mohtasib (Federal Ombudsman) Secretariat & Pakistan Citizen Portal",
        shortName: "Wafaqi Mohtasib (1055)",
        role: "Resolves maladministration in NADRA, Passports, Electricity, Gas & Federal Agencies",
        portalUrl: "https://www.mohtasib.gov.pk",
        email: "info@mohtasib.gov.pk",
        helpline: "1055",
        address: "36-Constitution Avenue, G-5/2, Islamabad",
        turnaroundTime: "30–60 Days",
        instructions: {
          en: "Submit online at mohtasib.gov.pk or call 1055.",
          roman_ur: "mohtasib.gov.pk par complaint bhejein ya 1055 par call karein.",
          ur: "وفاقی محتسب کی ویب سائٹ پر شکایت درج کریں یا 1055 پر کال کریں۔",
          pa: "1055 ہیلپ لائن تے رابطہ کرو۔",
        },
      },
    ],
    complaintTemplate: {
      subjectPrefix:
        "Formal Complaint Against Maladministration / Unjustified Delay / Wrong Utility Billing",
      defaultRecipientTitle:
        "The Honourable Wafaqi Mohtasib (Federal Ombudsman), Islamabad",
      legalCitationParagraph:
        "Under Articles 4, 19A, and 25 of the Constitution of Pakistan 1973, read with Article 9 of the Establishment of the Office of Wafaqi Mohtasib (Ombudsman) Order 1983, arbitrary delay, overbilling, and refusal to provide lawful public service constitute actionable maladministration.",
      requestedReliefParagraph:
        "It is respectfully requested that the concerned department be directed to resolve my pending grievance immediately in accordance with law.",
    },
  },

  consumer: {
    id: "consumer",
    title: {
      en: "Consumer Rights, Defective Products, Shopkeeper Fraud & PTA Telecom Issues",
      roman_ur: "Consumer Rights, Dukandar ka Dhoka, Naqis Saman aur PTA Shikayat",
      ur: "صارفین کے حقوق، دکاندار کی دھوکہ دہی، ناقص سامان اور پی ٹی اے شکایات",
      pa: "گاہکاں دے حقوق، خراب سامان تے ودھ پیسے لین دی شکایت",
    },
    iconName: "ShoppingBag",
    keywords: [
      "consumer",
      "shop",
      "dukandar",
      "dukan",
      "defective",
      "kharab",
      "naqis",
      "warranty",
      "fake",
      "nakli",
      "overcharging",
      "mehnga",
      "price",
      "pta",
      "sim",
      "mobile",
      "product",
      "saman",
      "online shopping",
      "daraz",
      "صارف",
      "خریدار",
      "دکاندار",
      "دکان",
      "ناقص",
      "خراب",
      "وارنٹی",
      "نقلی",
      "مہنگا",
      "سامان",
      "موبائل",
      "سم",
      "پی ٹی اے",
    ],
    constitutionalRights: [
      {
        article: "Article 4 & Article 18 – Constitution of Pakistan 1973",
        title: "Protection Against Unfair Trade & Consumer Fraud",
        summary: {
          en: "Protects citizens against commercial fraud, defective goods, and unfair trade practices.",
          roman_ur: "Karobar mein dhoka-dahi aur naqis saman bechna qanoonan jurm hai.",
          ur: "آرٹیکل 4 اور 18 کے تحت شہریوں کو کاروباری دھوکہ دہی اور ناقص اشیاء کی فروخت سے قانونی تحفظ حاصل ہے۔",
          pa: "کاروبار وچ دھوکہ دہی خلاف گاہک نوں قانونی تحفظ حاصل اے۔",
        },
      },
    ],
    statutoryLaws: [
      {
        law: "Provincial Consumer Protection Acts (Punjab 2005, Sindh 2014, KP 1997, ICT 1995)",
        section: "Zero-Fee Consumer Court Claim after 15-Day Legal Notice",
        explanation: {
          en: "Entitles consumers to full refund, replacement, and damages in the Consumer Court with ZERO court fee after sending a 15-day written notice.",
          roman_ur: "15 din ka notice dene ke baad Consumer Court mein baghair kisi fee ke refund aur harjanay ka faisla hota hai.",
          ur: "کنزیومر پروٹیکشن ایکٹ کے تحت 15 دن کا تحریری نوٹس دینے کے بعد صارف بغیر کسی کورٹ فیس کے کنزیومر کورٹ سے اپنی رقم کی واپسی اور ہرجانہ حاصل کر سکتا ہے۔",
          pa: "کنزیومر ایکٹ دے تحت بغیر فیس توں کنزیومر کورٹ وچ کیس کر سکدے او۔",
        },
      },
    ],
    administrativeProcedures: {
      en: [
        "Keep the purchase receipt, warranty card, or order screenshot.",
        "Send a 15-Day Written Legal Notice and file a free claim with the Consumer Protection Council / Court.",
      ],
      roman_ur: [
        "Kharidari ki raseed ya order screenshot mehfooz rakhein.",
        "Consumer Protection Council / Consumer Court mein muft shikayat darj karein.",
      ],
      ur: [
        "خریداری کی رسید یا آن لائن آرڈر کا ریکارڈ محفوظ رکھیں۔",
        "کنزیومر پروٹیکشن کونسل یا کنزیومر کورٹ میں مفت شکایت بھیجیں۔",
      ],
      pa: ["خریداری دی پرچی نال کنزیومر کورٹ وچ مفت شکایت کرو۔"],
    },
    followUpQuestions: {
      en: ["What is the name of the shop/company and how much did you pay?"],
      roman_ur: ["Dukandar ya company ka naam kya hai aur aap ne kitni raqam ada ki?"],
      ur: ["دکاندار یا کمپنی کا نام کیا ہے اور آپ نے کتنی رقم ادا کی؟"],
      pa: ["دکاندار دا ناں کی اے؟"],
    },
    authorities: [
      {
        id: "consumer_council",
        name: "Provincial Consumer Protection Council & Consumer Courts",
        shortName: "Consumer Court",
        role: "Orders refunds, replacements, and compensation with zero court fee",
        portalUrl: "https://pcpc.punjab.gov.pk",
        email: "info@pcpc.punjab.gov.pk",
        helpline: "042-99205127",
        address: "District Consumer Protection Council & Court",
        turnaroundTime: "15–30 Days",
        instructions: {
          en: "Submit your complaint at pcpc.punjab.gov.pk.",
          roman_ur: "pcpc.punjab.gov.pk par shikayat bhejein.",
          ur: "کنزیومر پروٹیکشن کونسل کو اپنی شکایت بھیجیں۔",
          pa: "کنزیومر کورٹ وچ شکایت جمع کراؤ۔",
        },
      },
    ],
    complaintTemplate: {
      subjectPrefix:
        "Formal Consumer Grievance & 15-Day Statutory Notice Against Defective Product / Unfair Trade",
      defaultRecipientTitle:
        "The Director, Consumer Protection Council / Presiding Judge, District Consumer Court",
      legalCitationParagraph:
        "Under the applicable Consumer Protection Act read with Articles 4 and 18 of the Constitution of Pakistan 1973, providing defective goods or faulty services entitles the consumer to full refund, replacement, and damages.",
      requestedReliefParagraph:
        "It is requested that the respondent be directed to immediately refund the paid amount / replace the defective item and compensate for the loss caused.",
    },
  },

  human_rights: {
    id: "human_rights",
    title: {
      en: "Human Rights, Domestic Violence, Child Protection & Anti-Discrimination",
      roman_ur: "Insani Haqooq, Ghareelu Tashaddud, Bachon aur Aqliyaton ka Tahaffuz",
      ur: "انسانی حقوق، گھریلو تشدد سے تحفظ، بچوں اور اقلیتوں کے حقوق",
      pa: "انسانی حقوق تے برابری دا تحفظ",
    },
    iconName: "HeartHandshake",
    keywords: [
      "human rights",
      "discrimination",
      "minority",
      "aqliyat",
      "domestic violence",
      "ghareelu tashaddud",
      "abuse",
      "child",
      "forced marriage",
      "zabardasti shadi",
      "1099",
      "mohr",
      "nchr",
      "insani haqooq",
      "zulm",
      "na insafi",
      "انسانی حقوق",
      "گھریلو تشدد",
      "تشدد",
      "ظلم",
      "ناانصافی",
      "اقلیت",
      "زبردستی شادی",
    ],
    constitutionalRights: [
      {
        article: "Article 9, Article 14, Article 20 & Article 25 – Constitution of Pakistan 1973",
        title: "Right to Life, Human Dignity & Equality of All Citizens",
        summary: {
          en: "All citizens are equal before law and protected against violence, discrimination, and abuse.",
          roman_ur: "Tamam shehri qanoon ki nazar mein barabar hain aur har qisam ke zulm aur tashaddud se mehfooz hain.",
          ur: "آرٹیکل 9، 14، 20 اور 25 کے تحت تمام شہری قانون کی نظر میں برابر ہیں اور ہر قسم کے ظلم، تشدد اور ناانصافی سے محفوظ ہیں۔",
          pa: "سارے شہری قانون اگے برابر نیں۔",
        },
      },
    ],
    statutoryLaws: [
      {
        law: "National Commission for Human Rights (NCHR) Act, 2012 & Domestic Violence Protection Acts",
        section: "Section 9 NCHR Act & Protection Orders",
        explanation: {
          en: "Provides immediate protection orders and inquiries into human rights violations through NCHR and Helpline 1099.",
          roman_ur: "NCHR Act 2012 aur Helpline 1099 ke tehat insani haqooq ki khilaf warzi par fori tahaffuz aur qanooni madad di jati hai.",
          ur: "قومی کمیشن برائے انسانی حقوق ایکٹ 2012 اور ہیلپ لائن 1099 کے تحت مظلوم شہریوں کو فوری تحفظ اور مفت قانونی مدد فراہم کی جاتی ہے۔",
          pa: "ہیلپ لائن 1099 راہیں فوری قانونی مدد ملدی اے۔",
        },
      },
    ],
    administrativeProcedures: {
      en: [
        "Call Ministry of Human Rights Toll-Free Helpline 1099 immediately.",
        "Forward your formal petition to NCHR (nchr.gov.pk) and MoHR (mohr.gov.pk).",
      ],
      roman_ur: [
        "Fori madad ke liye Helpline 1099 par call karein.",
        "NCHR aur Ministry of Human Rights ko 1-Click Complaint bhejein.",
      ],
      ur: [
        "فوری قانونی مدد اور تحفظ کے لیے ہیلپ لائن 1099 پر مفت کال کریں۔",
        "قومی کمیشن برائے انسانی حقوق (nchr.gov.pk) اور وزارتِ انسانی حقوق کو ایک کلک پر درخواست بھیجیں۔",
      ],
      pa: ["فوری مدد لئی 1099 اتے کال کرو۔"],
    },
    followUpQuestions: {
      en: ["In which city did this happen and is anyone in immediate danger?"],
      roman_ur: ["Yeh waqia kis shehar mein pesh aaya?"],
      ur: ["یہ واقعہ کس شہر میں پیش آیا ہے؟"],
      pa: ["ایہہ واقعہ کیہڑے شہر وچ ہویا اے؟"],
    },
    authorities: [
      {
        id: "mohr_1099",
        name: "Ministry of Human Rights (Helpline 1099) & NCHR Pakistan",
        shortName: "MoHR Helpline 1099",
        role: "Emergency Human Rights Protection & Free Legal Aid",
        portalUrl: "https://mohr.gov.pk",
        email: "helpline1099@mohr.gov.pk",
        helpline: "1099",
        address: "Kohsar Block, Pak Secretariat, Islamabad",
        turnaroundTime: "24–48 Hours Emergency Action",
        instructions: {
          en: "Dial 1099 (free) or submit via mohr.gov.pk.",
          roman_ur: "1099 par muft call karein.",
          ur: "ہیلپ لائن 1099 پر کال کریں یا آن لائن شکایت بھیجیں۔",
          pa: "1099 اتے مفت کال کرو۔",
        },
      },
    ],
    complaintTemplate: {
      subjectPrefix:
        "Urgent Petition Regarding Violation of Fundamental Human Rights & Request for Legal Protection",
      defaultRecipientTitle:
        "The Chairperson, National Commission for Human Rights (NCHR) & Ministry of Human Rights (1099)",
      legalCitationParagraph:
        "Under Articles 4, 9, 14, and 25 of the Constitution of Pakistan 1973, read with Section 9 of the National Commission for Human Rights Act 2012, every citizen is guaranteed inviolable human dignity, security of person, and equal protection of law.",
      requestedReliefParagraph:
        "It is respectfully requested that an immediate inquiry be initiated, protection be provided to the aggrieved citizen, and legal proceedings be taken against the responsible parties.",
    },
  },
};

export const ALL_LEGAL_CATEGORIES: LegalKnowledgeEntry[] = Object.values(
  LEGAL_KNOWLEDGE_BASE
);

export function classifyLegalIssue(text: string): LegalKnowledgeEntry {
  const normalized = text.toLowerCase();

  let bestCategory: LegalCategoryId = "government";
  let bestScore = 0;

  for (const entry of ALL_LEGAL_CATEGORIES) {
    let score = 0;
    for (const kw of entry.keywords) {
      const kwLower = kw.toLowerCase();
      if (normalized.includes(kwLower)) {
        score += kwLower.length > 4 ? 4 : 2;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = entry.id;
    }
  }

  return LEGAL_KNOWLEDGE_BASE[bestCategory];
}

export function detectLanguageFromInput(
  text: string,
  preferred?: SupportedLanguage
): SupportedLanguage {
  if (/[\u0600-\u06FF]/.test(text)) {
    if (
      text.includes("تہاڈا") ||
      text.includes("کیہ") ||
      text.includes("نوں") ||
      text.includes("وچ")
    ) {
      return "pa";
    }
    return "ur";
  }
  if (preferred) return preferred;
  const lower = text.toLowerCase();
  const romanUrduMarkers = [
    "meri",
    "mera",
    "mere",
    "nahi",
    "nhi",
    "kar",
    "rahi",
    "raha",
    "kya",
    "hoon",
    "hai",
    "hain",
    "aur",
    "wapas",
    "shikayat",
    "qanoon",
    "mujhe",
    "mujy",
  ];
  const matchCount = romanUrduMarkers.filter((w) => lower.includes(w)).length;
  if (matchCount >= 1) {
    return "roman_ur";
  }
  return "en";
}
