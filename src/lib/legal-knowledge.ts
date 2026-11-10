export type SupportedLanguage = "en" | "roman_ur" | "ur" | "pa";

export type LegalCategoryId =
  | "education"
  | "police"
  | "government"
  | "employment"
  | "human_rights"
  | "consumer"
  | "property"
  | "cybercrime";

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
      en: "Education & University Disputes",
      roman_ur: "Taleem aur University ke Masail (Degree / Documents)",
      ur: "تعلیم اور یونیورسٹی کے مسائل (ڈگری / اسناد)",
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
      "refund",
      "certificate",
      "matric",
      "fsc",
      "result",
      "asnaad",
      "sanad",
      "wapas",
      "یونیورسٹی",
      "ڈگری",
      "اسناد",
      "کالج",
    ],
    constitutionalRights: [
      {
        article: "Article 25A – Constitution of Pakistan 1973",
        title: "Right to Education",
        summary: {
          en: "Guarantees the fundamental right to education and protects students from arbitrary barriers to their academic progression.",
          roman_ur: "Har shehri ko taleem hasil karne aur apni taleemi asnaad (documents) par qanooni haq deta hai.",
          ur: "آئین پاکستان کا آرٹیکل 25A تعلیم کے بنیادی حق کی ضمانت دیتا ہے اور طلباء کو غیر قانونی رکاوٹوں سے تحفظ فراہم کرتا ہے۔",
          pa: "آئین پاکستان دا آرٹیکل 25A ہر شہری نوں تعلیم دے بنیادی حق دی ضمانت دیندا اے۔",
        },
      },
      {
        article: "Article 4 – Constitution of Pakistan 1973",
        title: "Right of Individuals to be Dealt with in Accordance with Law",
        summary: {
          en: "No person or institution can compel you to do what the law does not require, nor withhold your lawful property/documents without legal authority.",
          roman_ur: "Koi bhi idara ya university qanooni jawaz ke baghair aap ke original documents ya degree nahi rok sakti.",
          ur: "آرٹیکل 4 کے تحت ہر شہری کا حق ہے کہ اس کے ساتھ قانون کے مطابق سلوک کیا جائے۔ کوئی ادارہ بلا جواز آپ کی اصل اسناد نہیں روک سکتا۔",
          pa: "آرٹیکل 4 دے تحت کوئی وی ادارہ قانون توں بغیر تہاڈے اصل کاغذات یا ڈگری نہیں روک سکدا۔",
        },
      },
      {
        article: "Article 18 & Article 199 – Constitution of Pakistan 1973",
        title: "Freedom of Profession & High Court Writ Jurisdiction",
        summary: {
          en: "Withholding degrees blocks your right to lawful employment (Art. 18) and can be challenged in High Court (Art. 199).",
          roman_ur: "Degree ya original asnaad rokna aap ke rozgar ke haq (Art. 18) ki khilaf warzi hai aur High Court (Art. 199) mein challenge ho sakta hai.",
          ur: "ڈگری روکنا آپ کے روزگار کے حق (آرٹیکل 18) کی خلاف ورزی ہے اور ہائی کورٹ (آرٹیکل 199) میں چیلنج کیا جا سکتا ہے۔",
          pa: "ڈگری روکنا تہاڈے روزگار دے حق (آرٹیکل 18) دی خلاف ورزی اے۔",
        },
      },
    ],
    statutoryLaws: [
      {
        law: "Higher Education Commission (HEC) Ordinance, 2002",
        section: "Section 10 (Powers and Functions of the Commission) & HEC Student Grievance Directives",
        explanation: {
          en: "HEC strictly prohibits universities from retaining students' original Matric/FSc/BSc certificates or withholding degrees/transcripts once prescribed academic requirements and legitimate dues are cleared.",
          roman_ur: "HEC Ordinance 2002 aur HEC directives ke mutabiq koi bhi university student ke original documents (Matric/Inter certificates) apne paas nahi rakh sakti aur clearance ke baad degree ya transcript rokna qanoonan mana hai.",
          ur: "ایچ ای سی آرڈیننس 2002 اور ہدایات کے تحت یونیورسٹیوں کو طلباء کی اصل اسناد رکھنے یا کلیئرنس کے بعد ڈگری روکنے کی سختی سے ممانعت ہے۔",
          pa: "ایچ ای سی قنون 2002 دے مطابق کوئی وی یونیورسٹی طالب علم دے اصل سرٹیفکیٹ یا کلیئرنس توں بعد ڈگری نہیں روک سکدی۔",
        },
      },
      {
        law: "Establishment of the Office of Wafaqi Mohtasib (Ombudsman) Order, 1983",
        section: "Article 9 (Jurisdiction, Functions and Powers)",
        explanation: {
          en: "Unjustified delay or refusal by a public sector university or HEC-regulated body to issue a degree or return documents constitutes 'Maladministration' actionable by the Ombudsman.",
          roman_ur: "Sarkari university ya idaray ki taraf se degree ya documents dene mein bila-jawaz takheer 'Bad-Intizami' (Maladministration) hai jis par Wafaqi Mohtasib 60 din mein faisla karta hai.",
          ur: "یونیورسٹی کی جانب سے ڈگری یا اسناد کی واپسی میں بلا جواز تاخیر بدانتظامی کے زمرے میں آتی ہے جس پر وفاقی محتسب کارروائی کرتا ہے۔",
          pa: "یونیورسٹی ولوں ڈگری یا کاغذات نہ دینا بدانتظامی اے جیدے تے وفاقی محتسب ایکشن لیندا اے۔",
        },
      },
    ],
    administrativeProcedures: {
      en: [
        "Submit a formal written application to the University Registrar / Controller of Examinations and keep a receiving copy or email proof.",
        "File an online complaint on the HEC Online Help Portal (onlinehelp.hec.gov.pk) under Student Grievances / Degree Verification & Issuance.",
        "If the university is a Federal/Public sector institution or HEC delays action, file a free complaint with the Wafaqi Mohtasib (mohtasib.gov.pk) or Provincial Ombudsman.",
        "Use HaqAI's 1-Click Complaint Forwarder to generate and dispatch your formal application immediately.",
      ],
      roman_ur: [
        "Sab se pehle University ke Registrar ya Controller Examinations ko تحریری (written) darkhwast dein aur uski receiving copy ya email proof mehfooz rakhein.",
        "HEC Online Help Portal (onlinehelp.hec.gov.pk) par 'Student Grievance' ke tehat online shikayat darj karein.",
        "Agar masla hal na ho to Wafaqi Mohtasib (mohtasib.gov.pk) ya Provincial Ombudsman ko muft online complaint bhejein.",
        "HaqAI ke 'Online Complaint Submit (1-Click Forward)' button se apni tayyar darkhwast foran HEC aur mutaliqa idaray ko forward karein.",
      ],
      ur: [
        "سب سے پہلے یونیورسٹی کے رجسٹرار یا کنٹرولر امتحانات کو تحریری درخواست دیں اور رسید محفوظ رکھیں۔",
        "ایچ ای سی آن لائن ہیلپ پورٹل (onlinehelp.hec.gov.pk) پر اپنی شکایت درج کریں۔",
        "مسئلہ حل نہ ہونے کی صورت میں وفاقی محتسب (mohtasib.gov.pk) کو مفت آن لائن شکایت بھیجیں۔",
        "حق اے آئی (HaqAI) کے ون کلک بٹن سے اپنی تیار شدہ درخواست فوری طور پر متعلقہ ادارے کو بھیجیں۔",
      ],
      pa: [
        "سب توں پہلے یونیورسٹی دے رجسٹرار نوں تحریری درخواست دیو تے رسید سانبھ کے رکھو۔",
        "ایچ ای سی آن لائن پورٹل (onlinehelp.hec.gov.pk) اتے شکایت درج کرو۔",
        "وفاقی محتسب (mohtasib.gov.pk) نوں مفت آن لائن شکایت بھیجو۔",
      ],
    },
    followUpQuestions: {
      en: [
        "What is the name of the university and which city is it located in?",
        "Is it a public (government) or private university?",
        "Have you cleared your university dues/clearance form, and when did you first request your documents?",
      ],
      roman_ur: [
        "Aap ki university ka naam kya hai aur yeh kis shehar mein hai?",
        "Kya aap ne apni fees aur clearance mukammal kar li hai, aur kab se documents wapas maang rahe hain?",
      ],
      ur: [
        "آپ کی یونیورسٹی کا نام کیا ہے اور یہ کس شہر میں واقع ہے؟",
        "کیا آپ نے اپنی تمام فیس اور کلیئرنس مکمل کر لی ہے، اور آپ کب سے اسناد مانگ رہے ہیں؟",
      ],
      pa: [
        "تہاڈی یونیورسٹی دا ناں کی اے تے ایہہ کیہڑے شہر وچ اے؟",
        "کیہ تسی اپنی فیس تے کلیئرنس پوری کر لئی اے؟",
      ],
    },
    authorities: [
      {
        id: "hec",
        name: "Higher Education Commission (HEC) – Student Grievance Portal",
        shortName: "HEC Pakistan",
        role: "Regulator of all recognized public and private universities in Pakistan",
        portalUrl: "https://onlinehelp.hec.gov.pk",
        email: "complaints@hec.gov.pk",
        helpline: "051-111-119-432",
        address: "Sector H-9, East Service Road, Islamabad, Pakistan",
        turnaroundTime: "7–15 Working Days",
        instructions: {
          en: "Submit your ticket on onlinehelp.hec.gov.pk with your CNIC, Roll Number, and university clearance proof.",
          roman_ur: "onlinehelp.hec.gov.pk par apna CNIC, Roll Number aur university details ke sath ticket submit karein.",
          ur: "ایچ ای سی کے پورٹل پر اپنا شناختی کارڈ نمبر، رول نمبر اور تفصیلات کے ساتھ شکایت درج کریں۔",
          pa: "ایچ ای سی پورٹل اتے اپنا شناختی کارڈ تے رول نمبر لکھ کے شکایت بھیجو۔",
        },
      },
      {
        id: "mohtasib",
        name: "Wafaqi Mohtasib (Federal Ombudsman) of Pakistan",
        shortName: "Wafaqi Mohtasib",
        role: "Redresses maladministration against Federal/Public universities and HEC",
        portalUrl: "https://www.mohtasib.gov.pk",
        email: "info@mohtasib.gov.pk",
        helpline: "1055",
        address: "Wafaqi Mohtasib Secretariat, 36-Constitution Avenue, G-5/2, Islamabad",
        turnaroundTime: "30–60 Days (Free of Cost)",
        instructions: {
          en: "File an online complaint against maladministration at mohtasib.gov.pk with zero fee.",
          roman_ur: "mohtasib.gov.pk par baghair kisi fee ya wakeel ke online complaint darj karein.",
          ur: "وفاقی محتسب کی ویب سائٹ پر بغیر کسی فیس یا وکیل کے آن لائن شکایت درج کریں۔",
          pa: "وفاقی محتسب دی ویب سائٹ اتے بغیر فیس توں آن لائن شکایت درج کرو۔",
        },
      },
    ],
    complaintTemplate: {
      subjectPrefix: "Formal Complaint Against Unlawful Withholding of Original Educational Documents / Degree",
      defaultRecipientTitle: "The Chairman / Grievance Redressal Cell, Higher Education Commission (HEC) & Wafaqi Mohtasib Secretariat, Islamabad",
      legalCitationParagraph:
        "Under Article 4, Article 18, and Article 25A of the Constitution of the Islamic Republic of Pakistan 1973, read with Section 10 of the Higher Education Commission Ordinance 2002 and HEC Regulatory Directives, no university is legally permitted to retain a student's original educational certificates or withhold degrees/transcripts after completion of academic and financial clearance.",
      requestedReliefParagraph:
        "It is respectfully requested that immediate directions be issued to the concerned university administration to release and hand over my original educational documents / degree without any further delay, and appropriate regulatory action be taken against the responsible officials for maladministration.",
    },
  },

  police: {
    id: "police",
    title: {
      en: "Police Complaints & FIR Registration",
      roman_ur: "Police Shikayat, FIR ka Indiraj aur Tahaffuz",
      ur: "پولیس شکایات، ایف آئی آر کا اندراج اور تحفظ",
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
      "theft",
      "robbery",
      "1787",
      "igp",
      "dpo",
      "crime",
      "assault",
      "پولیس",
      "تھانہ",
      "ایف آئی آر",
    ],
    constitutionalRights: [
      {
        article: "Article 9 & Article 10 – Constitution of Pakistan 1973",
        title: "Security of Person & Safeguards as to Arrest and Detention",
        summary: {
          en: "No person shall be deprived of life or liberty save in accordance with law. Any arrested person must be informed of the grounds of arrest, allowed to consult a lawyer, and produced before a Magistrate within 24 hours.",
          roman_ur: "Kisi bhi shehri ko qanoon ke baghair giraftar nahi kiya ja sakta. Giraftari ki soorat mein वजह batana, wakeel se milne dena aur 24 ghantay ke andar Magistrate ke samne pesh karna lazmi hai.",
          ur: "آرٹیکل 9 اور 10 کے تحت کسی شخص کو غیر قانونی طور پر حراست میں نہیں رکھا جا سکتا اور 24 گھنٹے کے اندر مجسٹریٹ کے سامنے پیش کرنا لازم ہے۔",
          pa: "آرٹیکل 9 تے 10 دے تحت کسے وی بندے نوں غیر قانونی حراست وچ نہیں رکھیا جا سکدا تے 24 گھنٹیاں اندر مجسٹریٹ اگے پیش کرنا لازمی اے۔",
        },
      },
      {
        article: "Article 14 – Constitution of Pakistan 1973",
        title: "Inviolability of Dignity of Man",
        summary: {
          en: "The dignity of man and the privacy of home shall be inviolable. No person shall be subjected to torture for the purpose of extracting evidence.",
          roman_ur: "Har insaan ki izzat-e-nafs aur chadar aur char-diwari ka tahaffuz aaeeni haq hai. Saboot ke liye tashaddud (torture) bilkul ghair-qanooni hai.",
          ur: "آرٹیکل 14 کے تحت انسان کی عزتِ نفس اور چادر و چار دیواری کا تحفظ یقینی بنایا گیا ہے اور تشدد کی مکمل ممانعت ہے۔",
          pa: "آرٹیکل 14 دے تحت ہر انسان دی عزت تے گھر دی چار دیواری محفوظ اے۔",
        },
      },
    ],
    statutoryLaws: [
      {
        law: "Code of Criminal Procedure (CrPC), 1898",
        section: "Section 154 (Mandatory FIR Registration) & Section 22-A / 22-B (Justice of Peace)",
        explanation: {
          en: "Under Section 154 CrPC, the Station House Officer (SHO) is legally bound to register an FIR if information discloses a cognizable offense. If the SHO refuses, you can complain to the DPO/IGP (1787) or file a petition before the Sessions Judge (Ex-Officio Justice of Peace) under Section 22-A CrPC.",
          roman_ur: "CrPC Section 154 ke tehat qabil-e-dastandazi jurm par SHO par FIR kaatna farz hai. Inkar ki soorat mein DPO/IGP (1787) ko shikayat karein ya Section 22-A ke tehat Sessions Judge ko darkhwast dein.",
          ur: "ضابطہ فوجداری کی دفعہ 154 کے تحت ایس ایچ او پر ایف آئی آر درج کرنا فرض ہے۔ انکار کی صورت میں آئی جی کمپلینٹ سیل (1787) یا دفعہ 22-A کے تحت سیشن جج سے رجوع کیا جا سکتا ہے۔",
          pa: "ضابطہ فوجداری دی دفعہ 154 دے تحت ایس ایچ او نوں ایف آئی آر درج کرنا لازمی اے۔ نہ کرن تے 1787 اتے یا سیشن جج کول دفعہ 22-A دی درخواست دتی جا سکدی اے۔",
        },
      },
    ],
    administrativeProcedures: {
      en: [
        "Submit a written application at the Police Station Front Desk and obtain a computerized e-Tag / diary number.",
        "If the SHO refuses to register an FIR or delays action, escalate immediately to the IGP Complaint Center (1787 in Punjab) or the District Police Officer (DPO) Complaint Cell.",
        "File an application under Section 22-A / 22-B CrPC before the Justice of Peace (Sessions Court) for a judicial order directing police to register the FIR.",
      ],
      roman_ur: [
        "Police Station ke Front Desk par tahreeri darkhwast dein aur computerized e-Tag / diary receipt hasil karein.",
        "Agar SHO FIR darj na kare to foran IGP Complaint Cell (1787) ya DPO Office mein shikayat darj karwayein.",
        "Sessions Court (Justice of Peace) mein Section 22-A CrPC ki darkhwast de kar adالتی hukam hasil karein.",
      ],
      ur: [
        "پولیس اسٹیشن کے فرنٹ ڈیسک پر تحریری درخواست جمع کروائیں اور کمپیوٹرائزڈ رسید حاصل کریں۔",
        "ایس ایچ او کے انکار پر آئی جی کمپلینٹ سیل (1787) یا ڈی پی او آفس میں شکایت درج کروائیں۔",
        "سیشن کورٹ میں دفعہ 22-A کے تحت ایف آئی آر کے اندراج کے لیے درخواست دیں۔",
      ],
      pa: [
        "تھانے دے فرنٹ ڈیسک اتے درخواست دیو تے کمپیوٹر والی پرچی لو۔",
        "ایس ایچ او نہ سنے تے 1787 آئی جی کمپلینٹ سیل یا ڈی پی او نوں شکایت کرو۔",
      ],
    },
    followUpQuestions: {
      en: [
        "Which city and police station (Thana) does this incident relate to?",
        "Did you submit a written application at the police station front desk, and when did the incident happen?",
      ],
      roman_ur: [
        "Yeh waqia kis shehar aur kis Police Station (Thana) ki hadood mein pesh aaya?",
        "Kya aap ne Thana Front Desk par tahreeri darkhwast di hai?",
      ],
      ur: [
        "یہ واقعہ کس شہر اور کس تھانے کی حدود میں پیش آیا؟",
        "کیا آپ نے تھانے کے فرنٹ ڈیسک پر تحریری درخواست جمع کروائی ہے؟",
      ],
      pa: [
        "ایہہ واقعہ کیہڑے شہر تے کیہڑے تھانے وچ ہویا اے؟",
        "کیہ تسی تھانے وچ تحریری درخواست دتی اے؟",
      ],
    },
    authorities: [
      {
        id: "igp_punjab",
        name: "IGP Police Complaint Center (1787) / Provincial Police Portal",
        shortName: "Police Complaint Cell (1787)",
        role: "Oversight over SHO refusal to register FIR, non-investigation, and police misconduct",
        portalUrl: "https://punjabpolice.gov.pk",
        email: "igpcomplaintcenter@punjabpolice.gov.pk",
        helpline: "1787",
        address: "Central Police Office (CPO), Lahore / Provincial Police HQs",
        turnaroundTime: "24–72 Hours Initial Action",
        instructions: {
          en: "Call 1787 or submit online at punjabpolice.gov.pk / sindhpolice.gov.pk / kppolice.gov.pk / islamabadpolice.gov.pk.",
          roman_ur: "1787 par call karein ya police portal par online shikayat bhejein.",
          ur: "1787 پر کال کریں یا متعلقہ صوبائی پولیس کی ویب سائٹ پر آن لائن شکایت درج کریں۔",
          pa: "1787 اتے کال کرو یا پولیس دی ویب سائٹ تے آن لائن شکایت بھیجو۔",
        },
      },
    ],
    complaintTemplate: {
      subjectPrefix: "Urgent Complaint Regarding Refusal to Register FIR / Police Inaction under Section 154 CrPC",
      defaultRecipientTitle: "The Inspector General of Police (IGP) Complaint Cell / District Police Officer (DPO)",
      legalCitationParagraph:
        "Under Article 4, Article 9, and Article 14 of the Constitution of Pakistan 1973, read with Section 154 of the Code of Criminal Procedure (CrPC) 1898 and the Police Order 2002, registration of an FIR upon disclosure of a cognizable offense is a mandatory statutory duty of the Station House Officer (SHO).",
      requestedReliefParagraph:
        "It is respectfully prayed that immediate orders be issued to the concerned SHO to register the FIR in accordance with Section 154 CrPC, ensure impartial investigation, and provide lawful protection.",
    },
  },

  government: {
    id: "government",
    title: {
      en: "Government Services & Public Utilities",
      roman_ur: "Sarkari Idaray, NADRA, Passport aur Bills ki Shikayat",
      ur: "سرکاری ادارے، نادرا، پاسپورٹ اور بلوں کی شکایات",
      pa: "سرکاری محکمے، نادرا، پاسپورٹ تے بجلی گیس دے بل",
    },
    iconName: "Landmark",
    keywords: [
      "nadra",
      "passport",
      "wapda",
      "lesco",
      "kelectric",
      "sui gas",
      "bill",
      "overbilling",
      "pension",
      "government",
      "cda",
      "railway",
      "post office",
      "delay",
      "cnic",
      "sarkari",
      "نادرا",
      "پاسپورٹ",
      "بل",
      "سرکاری",
    ],
    constitutionalRights: [
      {
        article: "Article 4 & Article 25 – Constitution of Pakistan 1973",
        title: "Lawful Treatment & Equality of Citizens",
        summary: {
          en: "Every citizen is entitled to equal treatment by public officials and timely delivery of statutory government services without discrimination or arbitrary delay.",
          roman_ur: "Har shehri ka haq hai ke sarkari idaray qanoon ke mutabiq waqt par aur baghair kisi rishwat ya ta'assub ke kaam karein.",
          ur: "آرٹیکل 4 اور 25 کے تحت ہر شہری کو سرکاری اداروں سے قانونی اور مساوی سلوک کا پورا حق حاصل ہے۔",
          pa: "آرٹیکل 4 تے 25 دے تحت ہر شہری نوں سرکاری محکمیاں توں وقت سر تے انصاف نال کم کران دا حق حاصل اے۔",
        },
      },
      {
        article: "Article 19A – Constitution of Pakistan 1973",
        title: "Right to Information",
        summary: {
          en: "Every citizen shall have the right to have access to information in all matters of public importance subject to regulation and reasonable restrictions imposed by law.",
          roman_ur: "Aap ko haq hasil hai ke aap apni darkhwast ya file ki status aur sarkari faislon ki maloomat hasil karein.",
          ur: "آرٹیکل 19A کے تحت ہر شہری کو عوامی اہمیت کے معاملات اور اپنی درخواست کے بارے میں معلومات حاصل کرنے کا حق ہے۔",
          pa: "آرٹیکل 19A دے تحت تہانوں اپنی سرکاری فائل تے کارروائی دی معلومات لین دا حق اے۔",
        },
      },
    ],
    statutoryLaws: [
      {
        law: "Establishment of the Office of Wafaqi Mohtasib (Ombudsman) Order, 1983",
        section: "Article 9 (Maladministration by Federal Agencies)",
        explanation: {
          en: "Covers unjust delay, neglect, inattention, incompetence, or arbitrary billing by NADRA, Passport Office, Electricity DISCOs (LESCO/IESCO/K-Electric), Sui Gas, Railways, and other Federal agencies.",
          roman_ur: "NADRA, Passport, Bijli/Gas companies aur tamam wafaqi idaron ki sust-rawi, ghalat billing ya na-insafi ke khilaf Wafaqi Mohtasib muft sunwai karta hai.",
          ur: "نادرا، پاسپورٹ، بجلی و گیس کمپنیوں اور دیگر وفاقی اداروں کی بدانتظامی یا غلط بلنگ کے خلاف وفاقی محتسب مفت کارروائی کرتا ہے۔",
          pa: "نادرا، پاسپورٹ، بجلی گیس کمپنیاں دی بدانتظامی خلاف وفاقی محتسب مفت فیصلہ کردا اے۔",
        },
      },
    ],
    administrativeProcedures: {
      en: [
        "Lodge an initial complaint with the department's internal helpline/counter and note the tracking/token number.",
        "File an online complaint with the Wafaqi Mohtasib (mohtasib.gov.pk) or via the Pakistan Citizen Portal (citizenportal.gov.pk).",
        "Attach copies of your CNIC, utility reference number or tracking receipt, and submit via HaqAI's 1-Click Dispatch.",
      ],
      roman_ur: [
        "Mutaliqa idaray mein shikayat kar ke token ya tracking number نوٹ karein.",
        "Wafaqi Mohtasib (mohtasib.gov.pk) ya Pakistan Citizen Portal (citizenportal.gov.pk) par apni complaint bhejein.",
        "Apنے CNIC aur bill/receipt number ke sath HaqAI se 1-Click Complaint forward karein.",
      ],
      ur: [
        "متعلقہ محکمے میں شکایت کر کے ٹریکنگ یا ٹوکن نمبر حاصل کریں۔",
        "وفاقی محتسب (mohtasib.gov.pk) یا پاکستان سٹیزن پورٹل پر آن لائن شکایت بھیجیں۔",
      ],
      pa: [
        "محکمے توں شکایت دا ٹوکن نمبر لو تے وفاقی محتسب یا سٹیزن پورٹل اتے شکایت درج کرو۔",
      ],
    },
    followUpQuestions: {
      en: [
        "Which government department or utility agency is your complaint against (e.g., NADRA, Passport, LESCO, Sui Gas)?",
        "Do you have a tracking number, consumer reference number, or date when the issue started?",
      ],
      roman_ur: [
        "Aap ki shikayat kis sarkari idaray ke khilaf hai (maslan NADRA, Passport, Bijli/Gas)?",
        "Kya aap ke paas tracking ID ya bill reference number maujood hai?",
      ],
      ur: [
        "آپ کی شکایت کس سرکاری ادارے کے خلاف ہے (مثلاً نادرا، پاسپورٹ، بجلی یا گیس)؟",
        "کیا آپ کے پاس ٹریکنگ نمبر یا بل ریفرنس نمبر موجود ہے؟",
      ],
      pa: [
        "تہاڈی شکایت کیہڑے سرکاری محکمے خلاف اے؟",
      ],
    },
    authorities: [
      {
        id: "mohtasib_gov",
        name: "Wafaqi Mohtasib (Federal Ombudsman) Secretariat",
        shortName: "Wafaqi Mohtasib",
        role: "Investigates maladministration in NADRA, Passports, Electricity, Gas, and Federal Ministries",
        portalUrl: "https://www.mohtasib.gov.pk",
        email: "info@mohtasib.gov.pk",
        helpline: "1055",
        address: "36-Constitution Avenue, G-5/2, Islamabad",
        turnaroundTime: "30–60 Days",
        instructions: {
          en: "Submit your complaint online at mohtasib.gov.pk or call helpline 1055.",
          roman_ur: "mohtasib.gov.pk par online complaint bhejein ya 1055 par rabta karein.",
          ur: "وفاقی محتسب کی ویب سائٹ پر شکایت درج کریں یا ہیلپ لائن 1055 پر کال کریں۔",
          pa: "وفاقی محتسب دی ویب سائٹ یا 1055 ہیلپ لائن تے رابطہ کرو۔",
        },
      },
      {
        id: "citizen_portal",
        name: "Prime Minister's Performance Delivery Unit – Pakistan Citizen Portal",
        shortName: "Pakistan Citizen Portal",
        role: "Unified Federal & Provincial citizen grievance redressal system",
        portalUrl: "https://citizenportal.gov.pk",
        email: "support@pmdu.gov.pk",
        helpline: "051-9000111",
        address: "PM Office, Constitution Avenue, Islamabad",
        turnaroundTime: "14–21 Days",
        instructions: {
          en: "Lodge your complaint through citizenportal.gov.pk for direct routing to the Secretary/Head of Department.",
          roman_ur: "citizenportal.gov.pk ke zariye apni shikayat seedha mutaliqa idaray ke sarbarah tak pohanchayein.",
          ur: "پاکستان سٹیزن پورٹل کے ذریعے اپنی شکایت براہِ راست متعلقہ محکمے تک پہنچائیں۔",
          pa: "سٹیزن پورٹل راہیں اپنی شکایت سدھی متعلقہ محکمے نوں بھیجو۔",
        },
      },
    ],
    complaintTemplate: {
      subjectPrefix: "Complaint Against Maladministration and Unjustified Delay in Public Service Delivery",
      defaultRecipientTitle: "The Honourable Wafaqi Mohtasib (Federal Ombudsman), Islamabad",
      legalCitationParagraph:
        "Under Article 4, Article 19A, and Article 25 of the Constitution of Pakistan 1973, read with Article 9 of the Establishment of the Office of Wafaqi Mohtasib (Ombudsman) Order 1983, arbitrary delay, neglect, and refusal to provide lawful public services constitute actionable maladministration.",
      requestedReliefParagraph:
        "It is respectfully requested that the concerned department be directed to resolve my pending grievance immediately in accordance with law and provide written compliance.",
    },
  },

  employment: {
    id: "employment",
    title: {
      en: "Employment, Unpaid Wages & Workplace Harassment",
      roman_ur: "Mulazmat, Tankhwah (Salary) aur Workplace Harassment",
      ur: "ملازمت، تنخواہ کی عدم ادائیگی اور کام کی جگہ پر ہراسانی",
      pa: "نوکری، تنخواہ نہ ملنا تے دفتر وچ ہراسانی",
    },
    iconName: "Briefcase",
    keywords: [
      "salary",
      "wages",
      "employer",
      "job",
      "terminated",
      "fired",
      "workplace",
      "harassment",
      "boss",
      "company",
      "factory",
      "eobi",
      "labour",
      "tankhwah",
      "nokri",
      "تنخواہ",
      "ملازمت",
      "ہراسانی",
    ],
    constitutionalRights: [
      {
        article: "Article 11, Article 18 & Article 37(e) – Constitution of Pakistan 1973",
        title: "Dignified Work Conditions, Lawful Profession & Prohibition of Forced Labour",
        summary: {
          en: "Prohibits forced or unpaid labour (Art. 11), protects the right to earn a livelihood (Art. 18), and mandates just and humane conditions of work (Art. 37e).",
          roman_ur: "Bina tankhwah kaam karwana (Art. 11) aur ghair-insani mahol dena Aaeen-e-Pakistan ke khilaf hai.",
          ur: "آرٹیکل 11، 18 اور 37(e) کے تحت ہر ملازم کو منصفانہ اجرت اور باعزت ماحول میں کام کرنے کا آئینی حق حاصل ہے۔",
          pa: "آرٹیکل 11 تے 18 دے تحت ہر مزدور تے ملازم نوں اپنی پوری تنخواہ تے عزت نال کم کرن دا حق اے۔",
        },
      },
    ],
    statutoryLaws: [
      {
        law: "Protection Against Harassment of Women at the Workplace Act, 2010 (Amended 2022)",
        section: "Section 8 (Ombudsman Complaint)",
        explanation: {
          en: "Protects employees against workplace harassment and hostile work environments, allowing direct complaints to the Federal/Provincial Ombudsman (FOSPAH).",
          roman_ur: "Daftar ya kaam ki jagah par harasani ke khilaf FOSPAH (Ombudsman) ko seedhi shikayat ki ja sakti hai.",
          ur: "کام کی جگہ پر ہراسانی کے خلاف وفاقی و صوبائی محتسب (FOSPAH) کو براہ راست شکایت کی جا سکتی ہے۔",
          pa: "کم دی جگہ اتے ہراسانی خلاف محتسب (FOSPAH) نوں سدھی شکایت کیتی جا سکدی اے۔",
        },
      },
      {
        law: "Payment of Wages Act, 1936 & Standing Orders Ordinance, 1968",
        section: "Section 15 (Claims for Unpaid or Delayed Wages)",
        explanation: {
          en: "Mandates timely payment of wages and provides summary recovery of withheld salaries and termination dues through the Authority under the Payment of Wages Act / Labour Court.",
          roman_ur: "Roki gayi tankhwah (salary) aur wajibaat ki wasooli ke liye Payment of Wages Act Section 15 ke tehat Labour Authority hukam jari karti hai.",
          ur: "روکی گئی تنخواہ اور واجبات کی وصولی کے لیے پیمنٹ آف ویجز ایکٹ کی دفعہ 15 کے تحت لیبر اتھارٹی سے رجوع کیا جا سکتا ہے۔",
          pa: "روکی ہوئی تنخواہ واپس لین لئی لیبر اتھارٹی کول درخواست دتی جا سکدی اے۔",
        },
      },
    ],
    administrativeProcedures: {
      en: [
        "Keep copies of your appointment letter, salary slips/bank transfers, WhatsApp/email communications, or termination notice.",
        "For workplace harassment, file an online complaint directly with FOSPAH (fospah.gov.pk).",
        "For unpaid wages or unlawful termination, submit a claim to the Directorate of Labour Welfare / NIRC (nirc.gov.pk).",
      ],
      roman_ur: [
        "Apna job letter, bank salary record aur messages ka saboot mehfooz rakhein.",
        "Workplace harassment ke liye FOSPAH (fospah.gov.pk) par online complaint karein.",
        "Tankhwah na milne par Labour Department ya NIRC (nirc.gov.pk) ko darkhwast bhejein.",
      ],
      ur: [
        "اپنا تقرری نامہ، بینک اسٹیٹمنٹ اور پیغامات کا ریکارڈ محفوظ رکھیں۔",
        "ہراسانی کی صورت میں فوسپاہ (fospah.gov.pk) اور تنخواہ روکنے پر لیبر ڈیپارٹمنٹ یا این آئی آر سی سے رجوع کریں۔",
      ],
      pa: [
        "اپنی نوکری دے کاغذ تے بینک ریکارڈ سنبھال کے رکھو تے لیبر محکمے یا فوسپاہ نوں شکایت بھیجو۔",
      ],
    },
    followUpQuestions: {
      en: [
        "Is your issue about unpaid salary/termination or workplace harassment?",
        "What is the name of the employer/organization and which city do you work in?",
      ],
      roman_ur: [
        "Kya aap ka masla tankhwah (salary) rokne ka hai ya workplace harassment ka?",
        "Company ya idaray ka naam aur shehar kya hai?",
      ],
      ur: [
        "کیا آپ کا مسئلہ تنخواہ کی عدم ادائیگی کا ہے یا کام کی جگہ پر ہراسانی کا؟",
        "ادارے کا نام اور شہر کیا ہے؟",
      ],
      pa: [
        "کیہ تہاڈا مسئلہ تنخواہ نہ ملن دا اے یا ہراسانی دا؟",
      ],
    },
    authorities: [
      {
        id: "fospah",
        name: "Federal Ombudsman Secretariat for Protection Against Harassment (FOSPAH)",
        shortName: "FOSPAH",
        role: "Adjudicates workplace harassment complaints across Pakistan",
        portalUrl: "https://fospah.gov.pk",
        email: "info@fospah.gov.pk",
        helpline: "051-9264446",
        address: "LG&RD Complex, Sector G-5/2, Islamabad",
        turnaroundTime: "30–60 Days",
        instructions: {
          en: "File your complaint online at fospah.gov.pk.",
          roman_ur: "fospah.gov.pk par online darkhwast darj karein.",
          ur: "فوسپاہ کی ویب سائٹ fospah.gov.pk پر آن لائن شکایت درج کریں۔",
          pa: "fospah.gov.pk اتے آن لائن شکایت درج کرو۔",
        },
      },
      {
        id: "nirc",
        name: "National Industrial Relations Commission (NIRC) / Labour Department",
        shortName: "NIRC / Labour Authority",
        role: "Handles unfair labour practices, unpaid wages, and unlawful termination",
        portalUrl: "https://nirc.gov.pk",
        email: "info@nirc.gov.pk",
        helpline: "051-9203896",
        address: "Sector G-5/2, Islamabad",
        turnaroundTime: "15–45 Days",
        instructions: {
          en: "Submit your wage recovery or grievance petition to NIRC or the District Labour Officer.",
          roman_ur: "Apni tankhwah aur haqooq ke liye NIRC ya District Labour Officer ko darkhwast bhejein.",
          ur: "واجب الادا تنخواہ کی وصولی کے لیے این آئی آر سی یا لیبر آفیسر کو درخواست دیں۔",
          pa: "تنخواہ لین لئی لیبر آفیسر یا این آئی آر سی نوں درخواست دیو۔",
        },
      },
    ],
    complaintTemplate: {
      subjectPrefix: "Formal Grievance Against Unlawful Withholding of Wages / Workplace Rights Violation",
      defaultRecipientTitle: "The Honourable Ombudsman (FOSPAH) / Presiding Officer, Labour Authority & NIRC",
      legalCitationParagraph:
        "Under Articles 4, 11, 18, and 37(e) of the Constitution of Pakistan 1973, read with the Payment of Wages Act 1936, Industrial and Commercial Employment (Standing Orders) Ordinance 1968, and the Protection Against Harassment at the Workplace Act 2010, withholding earned wages or subjecting an employee to unlawful treatment is strictly prohibited by law.",
      requestedReliefParagraph:
        "It is respectfully requested that notice be issued to the employer for immediate release of my lawful dues/salary and strict statutory action be taken in accordance with law.",
    },
  },

  human_rights: {
    id: "human_rights",
    title: {
      en: "Human Rights & Protection Against Discrimination",
      roman_ur: "Insani Haqooq, Khawateen aur Aqliyaton ka Tahaffuz",
      ur: "انسانی حقوق، خواتین اور اقلیتوں کا تحفظ",
      pa: "انسانی حقوق تے برابری دا تحفظ",
    },
    iconName: "HeartHandshake",
    keywords: [
      "human rights",
      "discrimination",
      "minority",
      "women",
      "domestic violence",
      "abuse",
      "child",
      "forced marriage",
      "1099",
      "mohr",
      "nchr",
      "equality",
      "insani haqooq",
      "انسانی حقوق",
      "تشدد",
      "امتیاز",
    ],
    constitutionalRights: [
      {
        article: "Article 9, Article 14 & Article 25 – Constitution of Pakistan 1973",
        title: "Right to Life, Human Dignity & Equality of Citizens",
        summary: {
          en: "All citizens are equal before law and are entitled to equal protection of law. There shall be no discrimination on the basis of sex, religion, caste, or place of birth.",
          roman_ur: "Qanoon ki nazar mein tamam shehri barabar hain. Jins (gender), mazhab ya zaat ki bunyad par kisi ke sath imtiazi sulook nahi ho sakta.",
          ur: "آرٹیکل 9، 14 اور 25 کے تحت تمام شہری قانون کی نظر میں برابر ہیں اور کسی کے ساتھ صنف، مذہب یا ذات کی بنیاد پر امتیازی سلوک نہیں کیا جا سکتا۔",
          pa: "آرٹیکل 9، 14 تے 25 دے تحت سارے شہری قانون اگے برابر نیں۔",
        },
      },
      {
        article: "Article 20, Article 26 & Article 27 – Constitution of Pakistan 1973",
        title: "Freedom of Religion & Non-Discrimination in Public Access and Services",
        summary: {
          en: "Protects religious freedom and prohibits discrimination in access to public places or appointment in public services.",
          roman_ur: "Mazhabi azadi aur aam jagahon ya sarkari mulazmat mein har shehri ko barabari ka tahaffuz hasil hai.",
          ur: "آرٹیکل 20، 26 اور 27 مذہبی آزادی اور عوامی مقامات و ملازمتوں میں عدم امتیاز کی ضمانت دیتے ہیں۔",
          pa: "آرٹیکل 20، 26 تے 27 مذہبی آزادی تے برابری دی ضمانت دیندے نیں۔",
        },
      },
    ],
    statutoryLaws: [
      {
        law: "National Commission for Human Rights (NCHR) Act, 2012",
        section: "Section 9 (Functions and Powers to Inquire into Human Rights Violations)",
        explanation: {
          en: "Empowers NCHR to inquire into violations of human rights or negligence in the prevention of such violations by a public servant, either on a petition or suo motu.",
          roman_ur: "NCHR Act 2012 ke tehat Commission insani haqooq ki khilaf warzi par tahqeeqat aur qanooni karrawai ka ikhtiyar rakhta hai.",
          ur: "قومی کمیشن برائے انسانی حقوق ایکٹ 2012 کے تحت کمیشن انسانی حقوق کی خلاف ورزیوں کی تحقیقات کرنے کا مکمل اختیار رکھتا ہے۔",
          pa: "قومی کمیشن برائے انسانی حقوق ایکٹ 2012 دے تحت کمیشن انسانی حقوق دی خلاف ورزی تے کارروائی کردا اے۔",
        },
      },
    ],
    administrativeProcedures: {
      en: [
        "Call the Ministry of Human Rights Toll-Free Helpline 1099 for immediate free legal advice and emergency referral.",
        "Submit a formal petition to the National Commission for Human Rights (nchr.gov.pk) or Ministry of Human Rights (mohr.gov.pk).",
        "Use HaqAI to generate and forward a formal Human Rights Protection Petition in 1 click.",
      ],
      roman_ur: [
        "Fori qanooni madad ke liye Ministry of Human Rights ki Toll-Free Helpline 1099 par call karein.",
        "National Commission for Human Rights (nchr.gov.pk) ya Ministry of Human Rights (mohr.gov.pk) ko darkhwast bhejein.",
      ],
      ur: [
        "فوری قانونی مدد کے لیے وزارتِ انسانی حقوق کی ہیلپ لائن 1099 پر رابطہ کریں۔",
        "قومی کمیشن برائے انسانی حقوق (nchr.gov.pk) کو باضابطہ شکایت بھیجیں۔",
      ],
      pa: [
        "فوری قانونی مدد لئی ہیلپ لائن 1099 اتے کال کرو یا انسانی حقوق کمیشن نوں درخواست بھیجو۔",
      ],
    },
    followUpQuestions: {
      en: [
        "Could you briefly describe who committed the violation and in which city?",
        "Is anyone in immediate physical danger right now?",
      ],
      roman_ur: [
        "Yeh waqia kis shehar mein pesh aaya aur kis idaray ya shaks ke khilaf shikayat hai?",
        "Kya is waqt kisi ko fori khatra lahaq hai?",
      ],
      ur: [
        "یہ واقعہ کس شہر میں پیش آیا اور کس کے خلاف شکایت ہے؟",
        "کیا اس وقت کسی کو فوری خطرہ لاحق ہے؟",
      ],
      pa: [
        "ایہہ واقعہ کیہڑے شہر وچ ہویا اے؟",
      ],
    },
    authorities: [
      {
        id: "mohr_1099",
        name: "Ministry of Human Rights (MoHR) – Helpline 1099",
        shortName: "MoHR Helpline 1099",
        role: "Federal Human Rights Grievance Cell & Free Legal Aid Referral",
        portalUrl: "https://mohr.gov.pk",
        email: "helpline1099@mohr.gov.pk",
        helpline: "1099",
        address: "9th Floor, New Pak Secretariat (Kohsar Block), Sector F-5, Islamabad",
        turnaroundTime: "24–48 Hours Emergency Response",
        instructions: {
          en: "Dial 1099 (free) or submit your complaint via mohr.gov.pk.",
          roman_ur: "1099 par muft call karein ya mohr.gov.pk par shikayat bhejein.",
          ur: "ہیلپ لائن 1099 پر کال کریں یا وزارتِ انسانی حقوق کی ویب سائٹ پر شکایت درج کریں۔",
          pa: "1099 اتے مفت کال کرو یا ویب سائٹ راہیں شکایت بھیجو۔",
        },
      },
      {
        id: "nchr",
        name: "National Commission for Human Rights (NCHR) Pakistan",
        shortName: "NCHR Pakistan",
        role: "Independent statutory body investigating human rights violations",
        portalUrl: "https://nchr.gov.pk",
        email: "complaints@nchr.gov.pk",
        helpline: "051-9216771",
        address: "5th Floor, Evacuee Trust Complex, Agha Khan Road, F-5/1, Islamabad",
        turnaroundTime: "7–21 Days",
        instructions: {
          en: "Lodge an online complaint at nchr.gov.pk.",
          roman_ur: "nchr.gov.pk par online darkhwast darj karein.",
          ur: "nchr.gov.pk پر آن لائن شکایت درج کریں۔",
          pa: "nchr.gov.pk اتے آن لائن شکایت درج کرو۔",
        },
      },
    ],
    complaintTemplate: {
      subjectPrefix: "Urgent Petition Regarding Violation of Fundamental Human Rights",
      defaultRecipientTitle: "The Chairperson, National Commission for Human Rights (NCHR) & Directorate of Human Rights (1099), Islamabad",
      legalCitationParagraph:
        "Under Articles 4, 9, 14, 25, and 26 of the Constitution of the Islamic Republic of Pakistan 1973, read with Section 9 of the National Commission for Human Rights Act 2012, every citizen is guaranteed inviolable human dignity, security of person, and equal protection of law.",
      requestedReliefParagraph:
        "It is respectfully requested that an immediate inquiry be initiated into this violation of fundamental rights, protection be provided to the aggrieved citizen, and legal proceedings be recommended against the responsible parties.",
    },
  },

  consumer: {
    id: "consumer",
    title: {
      en: "Consumer Protection, Defective Goods & Telecom Fraud",
      roman_ur: "Consumer Rights, Naqis Ashya, Overcharging aur PTA Shikayat",
      ur: "صارفین کے حقوق، ناقص اشیاء، اوور چارجنگ اور پی ٹی اے شکایات",
      pa: "گاہکاں دے حقوق، خراب سامان تے ودھ پیسے لین دی شکایت",
    },
    iconName: "ShoppingBag",
    keywords: [
      "consumer",
      "shop",
      "defective",
      "refund",
      "warranty",
      "fake",
      "overcharging",
      "price",
      "pta",
      "sim",
      "mobile",
      "internet",
      "product",
      "store",
      "online shopping",
      "صارف",
      "خریدار",
      "ناقص",
    ],
    constitutionalRights: [
      {
        article: "Article 4 & Article 18 – Constitution of Pakistan 1973",
        title: "Protection of Law & Regulation of Lawful Trade",
        summary: {
          en: "Trade and commerce are subject to lawful regulation to protect citizens against fraud, misrepresentation, and defective products.",
          roman_ur: "Karobar mein dhoka-dahi, naqis saman bechna aur receipt na dena qanoonan jurm hai.",
          ur: "آرٹیکل 4 اور 18 کے تحت شہریوں کو کاروباری دھوکہ دہی اور ناقص اشیاء سے قانونی تحفظ حاصل ہے۔",
          pa: "آرٹیکل 4 تے 18 دے تحت کاروبار وچ دھوکہ دہی خلاف گاہک نوں قانونی تحفظ حاصل اے۔",
        },
      },
    ],
    statutoryLaws: [
      {
        law: "Provincial Consumer Protection Acts (Punjab 2005, Sindh 2014, KP 1997, ICT 1995)",
        section: "Liability for Defective Products, Faulty Services & Mandatory Receipt",
        explanation: {
          en: "Gives consumers the right to replacement, refund, and damages in the District Consumer Court with ZERO court fee, after serving a mandatory 15-day written legal notice to the seller/service provider.",
          roman_ur: "Dukandar ya company ko 15 din ka tahreeri notice dene ke baad aap Consumer Court mein baghair kisi court fee ke refund aur harjanay ka dawa kar sakte hain.",
          ur: "کنزیومر پروٹیکشن ایکٹ کے تحت 15 دن کا تحریری نوٹس دینے کے بعد صارف بغیر کسی کورٹ فیس کے کنزیومر کورٹ میں دعویٰ دائر کر سکتا ہے۔",
          pa: "کنزیومر ایکٹ دے تحت 15 دناں دا نوٹس دے کے تسی بغیر فیس توں کنزیومر کورٹ وچ کیس کر سکدے او۔",
        },
      },
    ],
    administrativeProcedures: {
      en: [
        "Keep the purchase invoice/receipt, warranty card, or online order screenshot.",
        "Serve a 15-Day Written Legal Notice to the seller/company demanding replacement or refund (HaqAI generates this notice automatically).",
        "If unresolved within 15 days, file the complaint with the Consumer Protection Council / District Consumer Court (zero court fee).",
      ],
      roman_ur: [
        "Kharidari ki raseed (receipt), warranty card ya online order ka screenshot mehfooz rakhein.",
        "Dukandar ya company ko 15-din ka Written Notice bhejein (HaqAI yeh tayyar kar deta hai).",
        "Hal na hone par Consumer Protection Council / Consumer Court mein muft shikayat darj karein.",
      ],
      ur: [
        "خریداری کی رسید یا آن لائن آرڈر کا ریکارڈ محفوظ رکھیں۔",
        "دکاندار یا کمپنی کو 15 دن کا تحریری نوٹس بھیجیں اور حل نہ ہونے پر کنزیومر کورٹ میں مفت شکایت درج کریں۔",
      ],
      pa: [
        "خریداری دی پرچی سنبھال کے رکھو تے کنزیومر کورٹ یا کونسل وچ مفت شکایت کرو۔",
      ],
    },
    followUpQuestions: {
      en: [
        "What is the name of the seller/company and what product or service did you pay for?",
        "Do you have a receipt or payment proof, and when did the transaction take place?",
      ],
      roman_ur: [
        "Dukandar ya company ka naam kya hai aur aap ne kitنی raqam ada ki?",
        "Kya aap ke paas raseed ya payment proof maujood hai?",
      ],
      ur: [
        "دکاندار یا کمپنی کا نام کیا ہے اور آپ نے کتنی رقم ادا کی؟",
        "کیا آپ کے پاس رسید یا ادائیگی کا ثبوت موجود ہے؟",
      ],
      pa: [
        "دکاندار یا کمپنی دا ناں کی اے تے تہاڈے کول پرچی ہے؟",
      ],
    },
    authorities: [
      {
        id: "consumer_council",
        name: "Provincial Consumer Protection Council & Consumer Courts",
        shortName: "Consumer Protection Council",
        role: "Enforces consumer refunds, replacements, and penalties against unfair trade",
        portalUrl: "https://pcpc.punjab.gov.pk",
        email: "info@pcpc.punjab.gov.pk",
        helpline: "042-99205127",
        address: " Directorate of Consumer Protection Council, Provincial Headquarters",
        turnaroundTime: "15–30 Days",
        instructions: {
          en: "Submit your complaint and 15-day notice copy at pcpc.punjab.gov.pk or your District Authority.",
          roman_ur: "pcpc.punjab.gov.pk ya apne District Consumer Protection office mein shikayat bhejein.",
          ur: "کنزیومر پروٹیکشن کونسل کی ویب سائٹ یا ضلعی دفتر میں اپنی شکایت جمع کروائیں۔",
          pa: "کنزیومر پروٹیکشن دی ویب سائٹ اتے اپنی شکایت جمع کراؤ۔",
        },
      },
      {
        id: "pta_cms",
        name: "Pakistan Telecommunication Authority (PTA) – Consumer Protection",
        shortName: "PTA Complaint System",
        role: "Resolves telecom billing, SIM, internet, and DIRBS issues",
        portalUrl: "https://complaint.pta.gov.pk",
        email: "complaint@pta.gov.pk",
        helpline: "0800-55055",
        address: "PTA Headquarters, Sector F-5/1, Islamabad",
        turnaroundTime: "7 Working Days",
        instructions: {
          en: "Lodge telecom/internet complaints at complaint.pta.gov.pk.",
          roman_ur: "Telecom ya internet ki shikayat complaint.pta.gov.pk par darj karein.",
          ur: "ٹیلی کام یا انٹرنیٹ کی شکایات complaint.pta.gov.pk پر درج کریں۔",
          pa: "فون یا انٹرنیٹ دی شکایت complaint.pta.gov.pk اتے درج کرو۔",
        },
      },
    ],
    complaintTemplate: {
      subjectPrefix: "Formal Consumer Grievance & Statutory Notice Against Defective Product / Unfair Trade Practice",
      defaultRecipientTitle: "The Director, Consumer Protection Council / Authority & Concerned Service Provider",
      legalCitationParagraph:
        "Under the applicable Provincial/ICT Consumer Protection Act read with Articles 4 and 18 of the Constitution of Pakistan 1973, providing defective goods, faulty services, or misrepresenting product quality constitutes an actionable violation entitling the consumer to full refund/replacement and damages.",
      requestedReliefParagraph:
        "It is requested that the respondent be directed to immediately refund the paid amount / replace the defective item and compensate for the loss caused.",
    },
  },

  property: {
    id: "property",
    title: {
      en: "Property, Land Grabbing (Qabza) & Women's Inheritance",
      roman_ur: "Jaidad, Qabza Mafia aur Khawateen ka Wirasat mein Hissa",
      ur: "جائیداد کے حقوق، ناجائز قبضہ اور خواتین کی وراثت",
      pa: "زمین جائیداد، ناجائز قبضہ تے عورتاں دا وراثتی حصہ",
    },
    iconName: "Home",
    keywords: [
      "property",
      "inheritance",
      "wirasat",
      "land",
      "qabza",
      "house",
      "plot",
      "fard",
      "intiqal",
      "mutation",
      "patwari",
      "sister",
      "widow",
      "share",
      "zameen",
      "جائیداد",
      "وراثت",
      "قبضہ",
      "زمین",
    ],
    constitutionalRights: [
      {
        article: "Article 23 & Article 24 – Constitution of Pakistan 1973",
        title: "Right to Acquire, Hold and Dispose of Property & Protection of Property Rights",
        summary: {
          en: "Every citizen shall have the right to acquire, hold, and dispose of property, and no person shall be compulsorily deprived of their property save in accordance with law.",
          roman_ur: "Har shehri (mard aur aurat) ko apni jaidad aur wirasat rakhne ka mukammal aaeeni haq hasil hai aur koi kisi ko uski jaidad se mehroom nahi kar sakta.",
          ur: "آرٹیکل 23 اور 24 کے تحت ہر شہری کو اپنی جائیداد اور وراثتی حصے کے تحفظ کا مکمل آئینی حق حاصل ہے۔",
          pa: "آرٹیکل 23 تے 24 دے تحت ہر شہری نوں اپنی زمین تے وراثت دے تحفظ دا پورا حق حاصل اے۔",
        },
      },
    ],
    statutoryLaws: [
      {
        law: "Enforcement of Women's Property Rights Act, 2020",
        section: "Section 4 & 5 (Summary Inquiry & Restoration of Possession by Ombudsman)",
        explanation: {
          en: "Empowers the Ombudsman (FOSPAH) to conduct a fast-track inquiry within 60 days and direct the Deputy Commissioner and Police to restore a woman's inheritance share or property possession without lengthy civil litigation.",
          roman_ur: "Khawateen ko wirasat ya jaidad se mehroom karne par Ombudsman (FOSPAH) 60 din mein faisla suna kar DC aur Police ke zariye qabza aur hissa wapas dilata hai.",
          ur: "خواتین کے حقوقِ جائیداد ایکٹ 2020 کے تحت محتسب 60 دن کے اندر ڈپٹی کمشنر اور پولیس کے ذریعے خواتین کو ان کا وراثتی حصہ دلواتا ہے۔",
          pa: "عورتاں دے جائیداد دے قنون 2020 دے تحت محتسب 60 دناں وچ ڈی سی تے پولیس راہیں وراثت دا حصہ واپس دلواندا اے۔",
        },
      },
      {
        law: "Illegal Dispossession Act, 2005",
        section: "Section 3 & 7 (Prevention of Illegal Dispossession & Interim Restoration)",
        explanation: {
          en: "Criminalizes unlawful land grabbing (Qabza) with up to 10 years imprisonment and empowers the Sessions Court to restore possession to the lawful owner.",
          roman_ur: "Najayaz qabza karne walon ke khilaf Illegal Dispossession Act 2005 ke tehat 10 saal tak qaid aur qabza fori wapas dilane ka qanoon maujood hai.",
          ur: "اللیگل ڈسپوزیشن ایکٹ 2005 کے تحت ناجائز قبضہ کرنے والوں کو 10 سال تک قید اور اصل مالک کو فوری قبضہ واپس دلانے کی سزا مقرر ہے۔",
          pa: "ناجائز قبضہ کرن والیاں نوں 10 سال قید تے اصل مالک نوں قبضہ واپس ملن دا قنون موجود اے۔",
        },
      },
    ],
    administrativeProcedures: {
      en: [
        "Obtain the Family Registration Certificate (FRC) from NADRA and Fard / ownership record from the Arazi Record Center (PLRA).",
        "If a woman is denied inheritance or property, file a direct complaint with FOSPAH (fospah.gov.pk) under the Women's Property Rights Act 2020.",
        "For illegal dispossession (Qabza), file a complaint with the Deputy Commissioner / Sessions Court under the Illegal Dispossession Act 2005.",
      ],
      roman_ur: [
        "NADRA se FRC aur Arazi Record Center se Fard / Intiqal ka record hasil karein.",
        "Khawateen ki wirasat ke liye FOSPAH (fospah.gov.pk) mein seedhi darkhwast dein.",
        "Najayaz qabzay ke khilaf DC Office ya Sessions Court mein Illegal Dispossession Act 2005 ki karrawai karein.",
      ],
      ur: [
        "نادرا سے ایف آر سی (FRC) اور اراضی ریکارڈ سینٹر سے فرد حاصل کریں۔",
        "خواتین کی وراثت کے لیے فوسپاہ (fospah.gov.pk) اور ناجائز قبضے کے خلاف سیشن کورٹ یا ڈی سی آفس سے رجوع کریں۔",
      ],
      pa: [
        "نادرا توں ایف آر سی تے پٹوار خانے/اراضی سینٹر توں فرد لو تے فوسپاہ یا عدالت وچ شکایت درج کرو۔",
      ],
    },
    followUpQuestions: {
      en: [
        "Is this issue about denial of inheritance share (Wirasat) or illegal occupation (Qabza) of property?",
        "In which district/city is the property located?",
      ],
      roman_ur: [
        "Kya yeh masla wirasat mein hissa na dene ka hai ya jaidad par najayaz qabzay ka?",
        "Jaidad kis zila (district) ya shehar mein waqia hai?",
      ],
      ur: [
        "کیا یہ مسئلہ وراثت میں حصہ نہ ملنے کا ہے یا جائیداد پر ناجائز قبضے کا؟",
        "جائیداد کس ضلع یا شہر میں واقع ہے؟",
      ],
      pa: [
        "کیہ ایہہ مسئلہ وراثت دے حصے دا اے یا ناجائز قبضے دا؟",
      ],
    },
    authorities: [
      {
        id: "fospah_property",
        name: "Ombudsman for Enforcement of Women's Property Rights (FOSPAH)",
        shortName: "FOSPAH Property Cell",
        role: "Restores women's inheritance and property rights within 60 days",
        portalUrl: "https://fospah.gov.pk",
        email: "complaints@fospah.gov.pk",
        helpline: "051-9264446",
        address: "LG&RD Complex, Sector G-5/2, Islamabad",
        turnaroundTime: "60 Days Statutory Limit",
        instructions: {
          en: "File your property/inheritance petition at fospah.gov.pk with your CNIC and FRC.",
          roman_ur: "fospah.gov.pk par CNIC aur NADRA FRC ke sath darkhwast dein.",
          ur: "اپنے شناختی کارڈ اور ایف آر سی کے ساتھ fospah.gov.pk پر درخواست جمع کروائیں۔",
          pa: "اپنے شناختی کارڈ تے ایف آر سی نال fospah.gov.pk اتے درخواست دیو۔",
        },
      },
      {
        id: "plra",
        name: "Provincial Land Records Authority (PLRA / Arazi Center)",
        shortName: "Land Records Authority",
        role: "Handles Fard, Intiqal (Mutation), and inheritance record corrections",
        portalUrl: "https://zameen.punjab.gov.pk",
        email: "info@punjab-zameen.gov.pk",
        helpline: "042-111-222-277",
        address: "PLRA Headquarters, Lahore / District Arazi Record Centers",
        turnaroundTime: "7–15 Days",
        instructions: {
          en: "Apply for inheritance mutation or record correction at zameen.punjab.gov.pk.",
          roman_ur: "Wirasati intiqal ya record ki durustgi ke liye zameen.punjab.gov.pk par rabta karein.",
          ur: "وراثتی انتقال یا ریکارڈ کی درستگی کے لیے اراضی ریکارڈ سینٹر سے رجوع کریں۔",
          pa: "وراثتی انتقال لئی اراضی ریکارڈ سینٹر نال رابطہ کرو۔",
        },
      },
    ],
    complaintTemplate: {
      subjectPrefix: "Complaint for Restoration of Lawful Property / Inheritance Rights under Women's Property Rights Act 2020",
      defaultRecipientTitle: "The Honourable Ombudsman (FOSPAH) / Deputy Commissioner & Land Revenue Authority",
      legalCitationParagraph:
        "Under Articles 23, 24, and 25 of the Constitution of Pakistan 1973, read with Section 4 and Section 5 of the Enforcement of Women's Property Rights Act 2020 and the Illegal Dispossession Act 2005, depriving any lawful heir or owner of their property or inheritance share is unlawful and subject to summary restoration.",
      requestedReliefParagraph:
        "It is respectfully prayed that an immediate inquiry be conducted through the Deputy Commissioner and Revenue authorities to restore my lawful property/inheritance share and mutate the revenue record accordingly.",
    },
  },

  cybercrime: {
    id: "cybercrime",
    title: {
      en: "Cybercrime, Online Fraud & Banking Complaints",
      roman_ur: "Cybercrime, Online Fraud, Blackmailing aur Banking Shikayat",
      ur: "سائبر کرائم، آن لائن فراڈ، بلیک میلنگ اور بینکنگ شکایات",
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
      "blackmail",
      "scam",
      "fraud",
      "bank",
      "easypaisa",
      "jazzcash",
      "sadapay",
      "nayapay",
      "atm",
      "1991",
      "nr3c",
      "سائبر",
      "فراڈ",
      "بینک",
    ],
    constitutionalRights: [
      {
        article: "Article 14 & Article 4 – Constitution of Pakistan 1973",
        title: "Inviolability of Dignity, Privacy & Protection of Law",
        summary: {
          en: "Protects citizens' personal privacy, dignity, and financial assets against digital extortion, unauthorized access, and fraud.",
          roman_ur: "Aap ki digital privacy, izzat-e-nafs aur bank/mobile account ke tahaffuz ki zamanat Aaeen ka Article 14 aur 4 deta hai.",
          ur: "آرٹیکل 14 اور 4 ہر شہری کی نجی معلومات، عزتِ نفس اور مالی اثاثوں کے تحفظ کی ضمانت دیتے ہیں۔",
          pa: "آرٹیکل 14 تے 4 ہر شہری دی پرائیویسی تے پیسے دے تحفظ دی ضمانت دیندے نیں۔",
        },
      },
    ],
    statutoryLaws: [
      {
        law: "Prevention of Electronic Crimes Act (PECA), 2016",
        section: "Sections 14 (Electronic Fraud), 20 (Offenses Against Dignity), 21 (Modesty & Cyberstalking) & 24",
        explanation: {
          en: "Criminalizes unauthorized access, online financial fraud, identity theft, defamation, and cyber harassment/blackmail with strict imprisonment and fines enforced by FIA Cybercrime (NR3C).",
          roman_ur: "PECA 2016 ke tehat online fraud, fake account, blackmailing aur hacking qabil-e-saza jurm hain jin par FIA Cybercrime Wing karrawai karta hai.",
          ur: "پیکا ایکٹ 2016 کے تحت آن لائن فراڈ، ہیکنگ اور بلیک میلنگ سنگین جرائم ہیں جن پر ایف آئی اے سائبر کرائم ونگ کارروائی کرتا ہے۔",
          pa: "پیکا ایکٹ 2016 دے تحت آن لائن فراڈ تے بلیک میلنگ تے ایف آئی اے سائبر کرائم کارروائی کردا اے۔",
        },
      },
      {
        law: "Banking Companies Ordinance, 1962",
        section: "Section 82A (Banking Mohtasib Jurisdiction)",
        explanation: {
          en: "Empowers the Banking Mohtasib Pakistan to investigate unauthorized deductions, ATM/digital banking fraud, and banking maladministration free of cost.",
          roman_ur: "Bank, ATM ya digital wallet se ghalat katoti ya fraud par Banking Mohtasib muft sunwai aur raqam ki wapsi ka hukam deta hai.",
          ur: "بینک یا اے ٹی ایم فراڈ کی صورت میں بینکنگ محتسب پاکستان مفت سماعت کر کے رقم کی واپسی کا حکم دیتا ہے۔",
          pa: "بینک یا اے ٹی ایم فراڈ تے بینکنگ محتسب مفت کارروائی کردا اے۔",
        },
      },
    ],
    administrativeProcedures: {
      en: [
        "Preserve all screenshots, transaction IDs, phone numbers, URLs, and bank statements without deleting messages.",
        "For online harassment, hacking, or scam, report immediately to FIA Cybercrime Helpline 1991 or nr3c.gov.pk.",
        "For unauthorized bank/wallet transactions, immediately call your bank helpline to block the account/beneficiary and file a complaint with Banking Mohtasib (bankingmohtasib.gov.pk).",
      ],
      roman_ur: [
        "Tamam screenshots, transaction IDs, phone numbers aur messages mehfooz rakhein (delete na karein).",
        "Online blackmailing, hacking ya scam par foran FIA Cybercrime Helpline 1991 ya nr3c.gov.pk par report karein.",
        "Bank fraud ki soorat mein Banking Mohtasib (bankingmohtasib.gov.pk) ko complaint forward karein.",
      ],
      ur: [
        "تمام اسکرین شاٹس، ٹرانزیکشن آئی ڈیز اور نمبرز محفوظ رکھیں۔",
        "ایف آئی اے سائبر کرائم ہیلپ لائن 1991 یا بینکنگ محتسب کو فوری شکایت بھیجیں۔",
      ],
      pa: [
        "سارے سکرین شاٹ تے ٹرانزیکشن نمبر سنبھال کے رکھو تے ایف آئی اے 1991 یا بینکنگ محتسب نوں شکایت کرو۔",
      ],
    },
    followUpQuestions: {
      en: [
        "Is this a case of online harassment/hacking or financial/banking fraud?",
        "When did the incident occur, and do you have the phone number, account number, or screenshots?",
      ],
      roman_ur: [
        "Kya yeh online harassment/blackmailing ka masla hai ya bank/online paise ke fraud ka?",
        "Yeh waqia kab hua aur kya aap ke paas transaction ID ya screenshots hain?",
      ],
      ur: [
        "کیا یہ آن لائن ہراسانی کا معاملہ ہے یا مالیاتی/بینکنگ فراڈ کا؟",
        "یہ واقعہ کب پیش آیا اور کیا آپ کے پاس اسکرین شاٹس یا ٹرانزیکشن ریکارڈ ہے؟",
      ],
      pa: [
        "کیہ ایہہ آن لائن بلیک میلنگ دا مسئلہ اے یا پیسیاں دے فراڈ دا؟",
      ],
    },
    authorities: [
      {
        id: "fia_nr3c",
        name: "FIA National Response Centre for Cyber Crime (NR3C) / NCCIA",
        shortName: "FIA Cybercrime (1991)",
        role: "Investigates PECA 2016 cybercrimes, online harassment, and digital scams",
        portalUrl: "https://nr3c.gov.pk",
        email: "helpdesk@nr3c.gov.pk",
        helpline: "1991",
        address: "National Police Foundation Building, Mauve Area, Sector G-10/4, Islamabad",
        turnaroundTime: "24–72 Hours Emergency / 15 Days Inquiry",
        instructions: {
          en: "Call 1991 or submit your complaint with screenshots at nr3c.gov.pk.",
          roman_ur: "1991 par call karein ya nr3c.gov.pk par screenshots ke sath report karein.",
          ur: "ہیلپ لائن 1991 پر کال کریں یا nr3c.gov.pk پر شکایت درج کریں۔",
          pa: "1991 اتے کال کرو یا nr3c.gov.pk اتے شکایت درج کرو۔",
        },
      },
      {
        id: "banking_mohtasib",
        name: "Banking Mohtasib Pakistan",
        shortName: "Banking Mohtasib",
        role: "Resolves disputes against scheduled banks and unauthorized digital transactions",
        portalUrl: "https://www.bankingmohtasib.gov.pk",
        email: "info@bankingmohtasib.gov.pk",
        helpline: "021-99217334",
        address: "Shaheen Complex, M.R. Kiyani Road, Karachi / Regional Offices",
        turnaroundTime: "30–45 Days",
        instructions: {
          en: "Lodge your banking dispute online at bankingmohtasib.gov.pk.",
          roman_ur: "bankingmohtasib.gov.pk par apni banking shikayat darj karein.",
          ur: "بینکنگ محتسب کی ویب سائٹ bankingmohtasib.gov.pk پر شکایت درج کریں۔",
          pa: "bankingmohtasib.gov.pk اتے اپنی بینک دی شکایت درج کرو۔",
        },
      },
    ],
    complaintTemplate: {
      subjectPrefix: "Urgent Complaint Under PECA 2016 / Banking Ordinance Regarding Cybercrime & Digital Fraud",
      defaultRecipientTitle: "The Director, FIA Cybercrime Wing (NR3C) / Banking Mohtasib Pakistan",
      legalCitationParagraph:
        "Under Article 4 and Article 14 of the Constitution of Pakistan 1973, read with Sections 14, 20, 21, and 24 of the Prevention of Electronic Crimes Act (PECA) 2016 and the Banking Companies Ordinance 1962, unauthorized digital access, online extortion/harassment, and electronic financial fraud are cognizable offenses.",
      requestedReliefParagraph:
        "It is respectfully requested that an immediate technical inquiry be initiated, the offending accounts/numbers be traced and blocked, my defrauded funds be frozen/recovered, and legal action be taken under PECA 2016.",
    },
  },
};

export const ALL_LEGAL_CATEGORIES: LegalKnowledgeEntry[] = Object.values(LEGAL_KNOWLEDGE_BASE);

export function classifyLegalIssue(text: string): LegalKnowledgeEntry {
  const normalized = text.toLowerCase();

  let bestCategory: LegalCategoryId = "education";
  let bestScore = -1;

  for (const entry of ALL_LEGAL_CATEGORIES) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (normalized.includes(kw.toLowerCase())) {
        score += kw.length > 5 ? 3 : 2;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = entry.id;
    }
  }

  // If no specific keyword matched, check general government/human rights cues or default to government/education
  if (bestScore === 0) {
    if (normalized.includes("uni") || normalized.includes("deg")) return LEGAL_KNOWLEDGE_BASE.education;
    return LEGAL_KNOWLEDGE_BASE.government;
  }

  return LEGAL_KNOWLEDGE_BASE[bestCategory];
}

export function detectLanguageFromInput(text: string, preferred?: SupportedLanguage): SupportedLanguage {
  if (preferred) return preferred;
  // Check for Arabic/Urdu script characters
  if (/[\u0600-\u06FF]/.test(text)) {
    if (text.includes("تہاڈا") || text.includes("کیہ") || text.includes("نوں") || text.includes("وچ")) {
      return "pa";
    }
    return "ur";
  }
  const lower = text.toLowerCase();
  const romanUrduMarkers = ["meri", "mera", "nahi", "kar", "rahi", "kya", "hoon", "hai", "aur", "مجھے", "wapas", "shikayat", "qanoon"];
  const matchCount = romanUrduMarkers.filter((w) => lower.includes(w)).length;
  if (matchCount >= 2) {
    return "roman_ur";
  }
  return "en";
}
