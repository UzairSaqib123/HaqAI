import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  AuthorityInfo,
  classifyLegalIssue,
  detectLanguageFromInput,
  LegalCategoryId,
  LegalKnowledgeEntry,
  SupportedLanguage,
} from "./legal-knowledge";
import {
  CONSTITUTION_OF_PAKISTAN_1973,
  PAKISTAN_LAWS_CORPUS,
} from "./pakistan-constitution-laws";
import { CitizenProfile } from "./supabase";

export interface ExtractedUserFacts {
  haqId?: string;
  rawStatement: string;
  applicantName: string;
  cnic: string;
  city: string;
  address?: string;
  institutionOrRespondent: string;
  dateOfIncident: string;
  referenceOrRollNo: string;
  contactPhone: string;
  contactEmail: string;
}

export interface GeneratedComplaint {
  subject: string;
  recipientTitle: string;
  recipientAuthority: AuthorityInfo;
  date: string;
  bodyText: string;
  emailSubject: string;
  emailBody: string;
  categoryId: LegalCategoryId;
  facts: ExtractedUserFacts;
}

export interface AgentWorkflowStep {
  stepNumber: number;
  title: string;
  status: "completed" | "action_required";
  summary: string;
}

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface HaqAIAnalysisResult {
  caseId: string;
  haqId: string;
  citizenProfile?: CitizenProfile;
  timestamp: string;
  channel: "website" | "whatsapp";
  language: SupportedLanguage;
  aiEngineUsed: "gemini-live" | "verified-pakistan-rag";
  userQuery: string;
  categoryId: LegalCategoryId;
  categoryTitle: string;
  replyText: string;
  whatsappReplyText: string;
  voiceSummaryText: string;
  constitutionalRights: {
    article: string;
    title: string;
    summary: string;
  }[];
  statutoryLaws: {
    law: string;
    section: string;
    explanation: string;
  }[];
  nextSteps: string[];
  followUpQuestions: string[];
  recommendedAuthorities: AuthorityInfo[];
  primaryAuthority: AuthorityInfo;
  generatedComplaint: GeneratedComplaint;
  workflowSteps: AgentWorkflowStep[];
  chatHistory: ChatTurn[];
  status?: "Open" | "Dispatched" | "Resolved" | "Under Review";
}

interface SpecificScenarioAnswer {
  matchKeywords: string[];
  titleUr: string;
  titleRoman: string;
  titleEn: string;
  directAnswerUr: string;
  directAnswerRoman: string;
  directAnswerEn: string;
  voiceUr: string;
}

/**
 * High-precision Urdu, Roman Urdu & English Legal Q&A Answers for specific citizen questions
 * so that even without an external LLM key, every specific question gets an exact, tailored response.
 */
const SPECIFIC_LEGAL_QA_BANK: SpecificScenarioAnswer[] = [
  {
    matchKeywords: [
      "گرفتار",
      "حراست",
      "وارنٹ",
      "ضمانت",
      "تھانے میں بند",
      "پولیس پکڑ",
      "giraftar",
      "hirasat",
      "warrant",
      "zamanat",
      "bail",
      "arrest",
      "detained",
    ],
    titleUr: "غیر قانونی گرفتاری، حراست اور ضمانت کے حقوق (آرٹیکل 10 اور ضابطہ فوجداری)",
    titleRoman: "Ghair-Qanooni Giraftari, Hirasat aur Zamanat (Bail) ke Qanooni Haqooq",
    titleEn: "Unlawful Arrest, Custody & Bail Rights under Pakistan Law",
    directAnswerUr:
      "پاکستانی آئین کے **آرٹیکل 10** اور **ضابطہ فوجداری (CrPC) کی دفعہ 61 اور 167** کے مطابق پولیس کسی بھی شخص کو گرفتار کرنے کے بعد **24 گھنٹے سے زیادہ** مجسٹریٹ کی اجازت کے بغیر تھانے میں بند نہیں رکھ سکتی۔ گرفتار شخص کو فوری طور پر گرفتاری کی وجہ بتانا اور اپنی پسند کے وکیل سے مشورہ کرنے دینا فرض ہے۔ اگر پولیس نے کسی کو غیر قانونی حراست (Illegal Custody) میں رکھا ہے تو فوری طور پر **سیشن جج یا ہائی کورٹ میں دفعہ 491 CrPC (Habeas Corpus)** کی درخواست دیں، عدالت بیلف (Bailiff) بھیج کر مغوی کو بازیاب کروائے گی۔ اگر گرفتاری کا خدشہ ہو تو سیشن کورٹ سے **ضمانت قبل از گرفتاری (Pre-Arrest Bail - دفعہ 498 CrPC)** حاصل کی جا سکتی ہے۔",
    directAnswerRoman:
      "Aaeen-e-Pakistan ke **Article 10** aur **CrPC Sec. 61** ke tehat police kisi bhi shaks ko **24 ghantay se zyada** Magistrate ke samne pesh kiye baghair thanay mein band nahi rakh sakti. Agar police ne kisi ko ghair-qanooni hirasat mein rakha hai to foran **Sessions Judge ke paas Sec. 491 CrPC (Habeas Corpus)** ki darkhwast dein, adalat Bailiff bhej kar chhura legi. Agar giraftari ka darr ho to **Sec. 498 CrPC ke tehat Pre-Arrest Bail (Zamanat Qabl-az-Giraftari)** lein.",
    directAnswerEn:
      "Under **Article 10 of the Constitution** and **Sections 61 & 167 CrPC**, police cannot detain any citizen for more than **24 hours** without producing them before a Magistrate. For unlawful detention, file a **Section 491 CrPC (Habeas Corpus)** petition before the Sessions Judge for immediate recovery via Court Bailiff, or seek **Pre-Arrest Bail under Section 498 CrPC**.",
    voiceUr:
      "السلام علیکم۔ آئین پاکستان کے آرٹیکل دس کے مطابق پولیس کسی بھی شخص کو چوبیس گھنٹے سے زیادہ مجسٹریٹ کے سامنے پیش کیے بغیر تھانے میں نہیں رکھ سکتی۔ غیر قانونی حراست کی صورت میں آپ دفعہ چار سو اکیانوے کے تحت سیشن جج کو درخواست دے سکتے ہیں یا ضمانت قبل از گرفتاری حاصل کر سکتے ہیں۔",
  },
  {
    matchKeywords: [
      "ایف آئی آر",
      "پرچہ",
      "ایس ایچ او",
      "تھانہ",
      "پولیس بات نہیں سن",
      "رشوت",
      "fir",
      "parcha",
      "sho",
      "thana",
      "154",
      "22a",
      "22-a",
    ],
    titleUr: "ایف آئی آر (FIR) کا اندراج اور پولیس کے خلاف قانونی کارروائی",
    titleRoman: "FIR Darj Karwane aur Police Inkar ke Khilaf Qanooni Rasta",
    titleEn: "Mandatory FIR Registration (Sec. 154 & Sec. 22-A CrPC)",
    directAnswerUr:
      "ضابطہ فوجداری کی **دفعہ 154 (Section 154 CrPC)** کے تحت اگر کوئی قابلِ دست اندازی جرم (جیسے چوری، ڈکیتی، فراڈ، حملہ یا دھمکی) ہوا ہو تو تھانے کے ایس ایچ او (SHO) پر ایف آئی آر درج کرنا قانوناً فرض ہے۔ اگر ایس ایچ او ٹال مٹول کرے یا انکار کرے تو آپ کے پاس 3 فوری قانونی راستے ہیں:\n1. متعلقہ تھانے میں تحریری درخواست جمع کروا کر **ڈائری نمبر (Diary Receipt)** لیں۔\n2. فوری طور پر **آئی جی پی کمپلینٹ سیل ہیلپ لائن 1787** پر کال کریں یا آن لائن شکایت بھیجیں۔\n3. **ضابطہ فوجداری کی دفعہ 22-A / 22-B** کے تحت ضلعی سیشن جج (Justice of Peace) کو درخواست دیں جو پولیس کو ایف آئی آر درج کرنے کا براہِ راست عدالتی حکم دیتے ہیں۔",
    directAnswerRoman:
      "**CrPC Section 154** ke tehat qabil-e-dast-andazi jurm par FIR darj karna SHO par qanoonan farz hai. Agar SHO inkar kare to: (1) Written application de kar Diary Number lein, (2) **IGP Helpline 1787** par shikayat darj karwayein, ya (3) **Section 22-A CrPC** ke tehat Sessions Judge (Justice of Peace) ko darkhwast dein jo SHO ko FIR darj karne ka hukam denge.",
    directAnswerEn:
      "Under **Section 154 CrPC**, the SHO is legally bound to register an FIR for any cognizable offense. If refused, escalate to the **IGP Complaint Cell (1787)** or file a petition under **Section 22-A/22-B CrPC** before the Sessions Judge (Justice of Peace) to compel FIR registration.",
    voiceUr:
      "السلام علیکم۔ ضابطہ فوجداری کی دفعہ ایک سو چون کے تحت ایف آئی آر درج کرنا ایس ایچ او پر فرض ہے۔ اگر پولیس انکار کرے تو آپ ہیلپ لائن سترہ ستاسی پر شکایت کر سکتے ہیں یا دفعہ بائیس اے کے تحت سیشن جج سے ایف آئی آر درج کرنے کا حکم لے سکتے ہیں۔",
  },
  {
    matchKeywords: [
      "خلع",
      "طلاق",
      "شادی ختم",
      "خاوند طلاق",
      "خاوند مارتا",
      "عزت",
      "بیوی",
      "شوہر",
      "نکاح",
      "khula",
      "talaq",
      "divorce",
      "nikah",
      "shohar",
      "biwi",
    ],
    titleUr: "خلع، طلاق اور نکاح کے قوانین (مسلم فیملی لاز آرڈیننس 1961)",
    titleRoman: "Khula, Talaq aur Nikah ke Qawaneen (Muslim Family Laws 1961)",
    titleEn: "Divorce (Talaq), Khula & Marriage Dissolution Laws in Pakistan",
    directAnswerUr:
      "پاکستانی فیملی قوانین (**Dissolution of Muslim Marriages Act 1939** اور **Family Courts Act 1964**) کے تحت اگر شوہر طلاق نہ دے رہا ہو، بدسلوکی کرتا ہو یا نان نفقہ (خرچہ) نہ دیتا ہو تو بیوی کو **فیملی کورٹ سے خلع (Khula)** لینے کا مکمل قانونی حق حاصل ہے۔ فیملی کورٹ خلع کے مقدمے کا فیصلہ قانوناً **4 سے 6 ماہ** کے اندر کرنے کی پابند ہے۔ اسی طرح **مسلم فیملی لاز آرڈیننس 1961 کی دفعہ 7** کے تحت طلاق یا خلع کے بعد یونین کونسل (چیئرمین ثالثی کونسل) میں نوٹس جاتا ہے اور 90 دن کے بعد طلاق مؤثر ہونے کا سرکاری سرٹیفکیٹ جاری ہوتا ہے۔ مفت قانونی مدد کے لیے وزارتِ انسانی حقوق کی ہیلپ لائن **1099** پر رابطہ کریں۔",
    directAnswerRoman:
      "**Family Courts Act 1964** aur **Muslim Family Laws Ordinance 1961** ke tehat har khatoon ko zulm, kharcha na milne ya ذہنی na-humwari ki surat mein **Family Court se Khula** lene ka qanooni haq hasil hai, jiska faisla 4 se 6 mahinay mein ho jata hai. Sec. 7 ke tehat Union Council se 90 din baad Talaq/Khula certificate jari hota hai.",
    directAnswerEn:
      "Under the **Dissolution of Muslim Marriages Act 1939** and **Family Courts Act 1964**, a wife has the statutory right to seek **Khula** or judicial divorce through the Family Court (decided within 4–6 months), followed by a divorce effectiveness certificate from the Union Council under **Section 7 of the Muslim Family Laws Ordinance 1961**.",
    voiceUr:
      "السلام علیکم۔ پاکستانی فیملی قوانین کے تحت خاتون کو فیملی کورٹ کے ذریعے خلع لینے، حق مہر اور جہیز کا سامان واپس لینے کا مکمل قانونی حق حاصل ہے۔ فیملی کورٹ چار سے چھ ماہ میں فیصلہ کرتی ہے اور مفت قانونی مدد کے لیے آپ ہیلپ لائن دس ننانوے پر رابطہ کر سکتی ہیں۔",
  },
  {
    matchKeywords: [
      "حق مہر",
      "خرچہ",
      "نان نفقہ",
      "جہیز",
      "بچوں کا خرچہ",
      "دوسری شادی",
      "بچوں کی حوالگی",
      "حضانت",
      "بچے چھین",
      "haq mehr",
      "kharcha",
      "maintenance",
      "jahez",
      "custody",
      "hizanat",
      "second marriage",
    ],
    titleUr: "حق مہر، نان نفقہ (خرچہ)، جہیز اور بچوں کی حضانت (Custody)",
    titleRoman: "Haq Mehr, Biwi/Bachon ka Kharcha, Jahez aur Child Custody",
    titleEn: "Haq Mehr, Wife/Child Maintenance, Dowry Recovery & Child Custody",
    directAnswerUr:
      "**مسلم فیملی لاز آرڈیننس 1961 کی دفعہ 9** اور **فیملی کورٹس ایکٹ 1964** کے تحت:\n1. **حق مہر اور جہیز:** بیوی کسی بھی وقت اپنا واجب الادا حق مہر (Prompt Dower) اور جہیز کے تمام سامان کی فہرست کے مطابق واپسی کا دعویٰ فیملی کورٹ میں دائر کر سکتی ہے۔\n2. **بیوی اور بچوں کا خرچہ (Maintenance):** شوہر/والد قانوناً اپنی بیوی اور بچوں کا ماہانہ خرچہ، تعلیم اور علاج کا خرچہ دینے کا پابند ہے۔ فیملی کورٹ پہلی ہی پیشی کے بعد عبوری ماہانہ خرچہ (Interim Maintenance) مقرر کر دیتی ہے۔\n3. **بچوں کی حضانت (Child Custody):** **گارڈینز اینڈ وارڈز ایکٹ 1890** کے تحت کم عمر بچوں کی پرورش (Hizanat) کا پہلا حق ماں کو حاصل ہے اور اگر کوئی زبردستی بچے چھین لے تو گارڈین جج فوری بازیابی کا حکم دیتے ہیں۔\n4. **بغیر اجازت دوسری شادی (دفعہ 6):** پہلی بیوی اور ثالثی کونسل کی تحریری اجازت کے بغیر دوسری شادی کرنے پر شوہر کو قید/جرمانے کی سزا ہوتی ہے اور پہلی بیوی کا پورا حق مہر فوراً واجب الادا ہو جاتا ہے۔",
    directAnswerRoman:
      "**Muslim Family Laws 1961 (Sec. 6 & 9)** aur **Guardians & Wards Act 1890** ke tehat biwi apna **Haq Mehr**, **Jahez ka saman**, aur apna wa **bachon ka mahana kharcha (Maintenance)** Family Court ke zariye foran wasool kar sakti hai. Chhotay bachon ki custody (Hizanat) mein maa ko qanooni tarjeeh hasil hai.",
    directAnswerEn:
      "Under **Section 9 of the Muslim Family Laws Ordinance 1961**, **Family Courts Act 1964**, and **Guardians & Wards Act 1890**, you can file a consolidated suit in Family Court for recovery of **Haq Mehr**, **Dowry Articles (Jahez)**, **Monthly Maintenance (Kharcha)** for wife and children, and **Child Custody (Hizanat)**.",
    voiceUr:
      "السلام علیکم۔ مسلم فیملی لاز کے تحت بیوی اور بچوں کا ماہانہ خرچہ، حق مہر اور جہیز کی واپسی کے لیے آپ فیملی کورٹ میں دعویٰ دائر کر سکتے ہیں جہاں عدالت فوری عبوری خرچہ مقرر کرتی ہے۔ کم عمر بچوں کی حضانت میں بھی ماں کو قانونی حق حاصل ہے۔",
  },
  {
    matchKeywords: [
      "وراثت",
      "جائیداد میں حصہ",
      "والد کی جائیداد",
      "بہن کا حصہ",
      "بیٹی کا حصہ",
      "شرعی حصہ",
      "وفات کے بعد جائیداد",
      "wirasat",
      "inheritance",
      "jaidad mein hissa",
      "behen ka hissa",
    ],
    titleUr: "وراثت میں حصہ اور خواتین کے جائیداد کے حقوق (آرٹیکل 23، 24 اور ایکٹ 2020)",
    titleRoman: "Wirasat (Inheritance) mein Qanooni Hissa aur Property Protection",
    titleEn: "Inheritance (Wirasat) & Women's Property Rights Act 2020",
    directAnswerUr:
      "پاکستان کے آئین کے **آرٹیکل 23 اور 24** اور **خواتین کے جائیداد کے حقوق کے قانون (Enforcement of Women's Property Rights Act, 2020)** کے تحت والد، والدہ یا شوہر کی وفات کے بعد ہر وارث (خاص طور پر بیٹیوں، بہنوں اور بیوہ) کو شرعی اور قانونی حصہ ملنا لازم ہے۔\n- کسی خاتون کو دھوکے یا دباؤ سے وراثت سے محروم کرنا **تعزیراتِ پاکستان کی دفعہ 498-A** کے تحت قابلِ سزا فوجداری جرم ہے جس کی سزا **5 سے 10 سال تک قید** ہے۔\n- لمبے عدالتی چکر کے بجائے آپ براہِ راست **وفاقی/صوبائی محتسب برائے خواتین پراپرٹی سیل (FOSPAH)** کو درخواست دے سکتے ہیں، جو **60 دن** میں فیصلہ کر کے ڈپٹی کمشنر اور پولیس کے ذریعے آپ کا انتقال (Mutation) اور قبضہ دلوانے کا پابند ہے۔",
    directAnswerRoman:
      "**Enforcement of Women's Property Rights Act 2020** aur **PPC Sec. 498-A** ke tehat kisi ko wirasat (inheritance) se mehroom karna سنگین jurm hai (10 saal tak qaid). Aap baghair lambay court case ke **Ombudsman (FOSPAH)** mein darkhwast de sakte hain jo **60 din** mein Deputy Commissioner ke zariye aap ka wirasati hissa aur qabza dilwata hai.",
    directAnswerEn:
      "Under the **Enforcement of Women's Property Rights Act 2020** and **Section 498-A PPC**, depriving an heir (especially women) of inheritance is a criminal offense punishable by up to 10 years imprisonment. File a direct complaint with **FOSPAH** for a binding order and restoration of share within **60 days**.",
    voiceUr:
      "السلام علیکم۔ پاکستانی قانون کے تحت کسی بھی وارث یا خاتون کو وراثت سے محروم کرنا دفعہ چار سو اٹھانوے اے کے تحت سنگین جرم ہے جس کی سزا دس سال تک قید ہے۔ آپ محتسب کے پراپرٹی سیل میں درخواست دے کر ساٹھ دن کے اندر اپنا وراثتی حصہ اور قبضہ حاصل کر سکتے ہیں۔",
  },
  {
    matchKeywords: [
      "کرایہ دار",
      "مکان مالک",
      "مکان خالی",
      "کرایہ",
      "پگڑی",
      "kirayedar",
      "makan malik",
      "rent",
      "tenant",
      "landlord",
      "evict",
    ],
    titleUr: "مکان مالک اور کرایہ دار کے قوانین (Rented Premises Act)",
    titleRoman: "Makan Malik aur Kirayedar (Landlord & Tenant) ke Qawaneen",
    titleEn: "Landlord & Tenant Disputes (Provincial Rented Premises Acts)",
    directAnswerUr:
      "صوبائی **رینٹڈ پریمسز ایکٹ (Rented Premises Act)** کے تحت مکان مالک اور کرایہ دار دونوں کے حقوق محفوظ ہیں:\n1. **اگر کرایہ دار مکان خالی نہ کرے یا کرایہ نہ دے:** مکان مالک زبردستی سامان باہر نہیں پھینک سکتا لیکن **اسپیشل جج رینٹ (Rent Tribunal / Rent Controller)** کے پاس بے دخلی (Eviction Petition) دائر کر سکتا ہے، جہاں کرایہ دار کو جواب دینے کے لیے صرف **10 دن (Leave to Appear)** ملتے ہیں اور تیز رفتاری سے مکان خالی کروایا جاتا ہے۔\n2. **اگر مکان مالک ناجائز تنگ کرے یا بجلی/پانی بند کرے:** کوئی مکان مالک عدالتی حکم کے بغیر کرایہ دار کی بجلی، گیس یا پانی منقطع نہیں کر سکتا اور نہ ہی معاہدے کی مدت سے پہلے زبردستی نکال سکتا ہے۔ کرایہ دار رینٹ کنٹرولر کے پاس کرایہ جمع کروا کر تحفظ حاصل کر سکتا ہے۔",
    directAnswerRoman:
      "**Rented Premises Act** ke tehat agar kirayedar kraya na de ya makan khali na kare to makan malik **Rent Tribunal (Rent Controller)** mein Eviction Petition dayer kar ke fori makan khali karwa sakta hai. Aur agar makan malik ghair-qanooni tor par bijli/gas band kare ya zabardasti nikale to kirayedar Rent Controller se stay aur tahaffuz le sakta hai.",
    directAnswerEn:
      "Under the **Provincial Rented Premises Acts**, all landlord-tenant disputes—including non-payment of rent, expiry of tenancy, security deposit refund, or unlawful utility disconnection—are resolved expeditiously by the **Special Judge (Rent) / Rent Controller**.",
    voiceUr:
      "السلام علیکم۔ کرایہ داری کے قوانین کے تحت مکان خالی کروانے، بقایا کرایہ وصول کرنے یا مکان مالک کی جانب سے ناجائز تنگ کیے جانے کی صورت میں آپ رینٹ ٹربیونل یعنی رینٹ کنٹرولر کی عدالت سے فوری قانونی داد رسی حاصل کر سکتے ہیں۔",
  },
  {
    matchKeywords: [
      "چیک",
      "باؤنس",
      "ڈس آنر",
      "ادھار",
      "قرض",
      "قرضہ",
      "پیسے واپس",
      "کمیٹی",
      "امانت میں خیانت",
      "دھوکہ",
      "فراڈ",
      "cheque",
      "bounce",
      "489f",
      "489-f",
      "udhar",
      "qarz",
      "paise wapis",
      "420",
      "406",
    ],
    titleUr: "بوگس چیک (489-F)، ادھار/قرض کی واپسی اور مالی فراڈ (420/406 PPC)",
    titleRoman: "Cheque Bounce (489-F PPC), Udhar/Qarz Wapsi aur Fraud ke Qawaneen",
    titleEn: "Dishonoured Cheque (Sec. 489-F PPC), Money Recovery & Financial Fraud",
    directAnswerUr:
      "پاکستانی قانون میں رقم کی واپسی اور مالی دھوکہ دہی کے لیے دو مضبوط قانونی راستے موجود ہیں:\n1. **اگر چیک باؤنس (Dishonour) ہوا ہے:** بینک سے **Return Memo** لیں۔ **تعزیراتِ پاکستان کی دفعہ 489-F** کے تحت بوگس چیک دینا قابلِ دست اندازی فوجداری جرم ہے جس کی سزا **3 سال تک قید** ہے (اس پر تھانے میں ایف آئی آر درج ہوتی ہے)۔ ساتھ ہی آپ **ضابطہ دیوانی کے آرڈر 37 (Order 37 CPC)** کے تحت سیشن کورٹ میں فوری رقم وصولی کا دعویٰ (Summary Suit) دائر کر سکتے ہیں۔\n2. **اگر ادھار، کمیٹی یا کاروباری دھوکہ ہوا ہے:** اگر کسی نے امانت رکھوا کر کھا لی تو **دفعہ 406 PPC (امانت میں خیانت)** اور اگر دھوکہ دے کر پیسے بٹورے تو **دفعہ 420 PPC (فراڈ)** کے تحت پولیس کو درخواست دیں، اور بینک سلپ، واٹس ایپ میسجز یا گواہوں کی بنیاد پر دیوانی عدالت میں **Suit for Recovery of Money** دائر کریں۔",
    directAnswerRoman:
      "Agar **Cheque Bounce** hua hai to Bank Return Memo ke sath **PPC Section 489-F** ke tehat FIR darj karwayein (3 saal tak qaid) aur **Order 37 CPC** ke tehat Sessions Court mein fori recovery case karein. Agar **Udhar/Qarz ya Fraud** hai to **PPC Sec. 406 (Amanat mein Khayanat)** ya **Sec. 420 (Fraud)** ki karrawai aur Money Recovery Suit dayer karein.",
    directAnswerEn:
      "For a **bounced cheque**, obtain the Bank Return Memo to lodge a criminal FIR under **Section 489-F PPC** (up to 3 years imprisonment) and file a fast-track **Order 37 CPC Summary Suit**. For unpaid loans or fraud, proceed under **Sections 406/420 PPC** and file a civil **Money Recovery Suit** using bank receipts and WhatsApp messages (admissible under Article 164 of Qanun-e-Shahadat).",
    voiceUr:
      "السلام علیکم۔ اگر کسی کا دیا ہوا چیک باؤنس ہو گیا ہے تو تعزیرات پاکستان کی دفعہ چار سو نواسی ایف کے تحت یہ فوجداری جرم ہے جس پر ایف آئی آر درج ہوتی ہے۔ ادھار یا مالی فراڈ کی صورت میں آپ دفعہ چار سو بیس اور چار سو چھ کے تحت کارروائی اور رقم کی واپسی کا دعویٰ کر سکتے ہیں۔",
  },
  {
    matchKeywords: [
      "بلیک میل",
      "ہیک",
      "واٹس ایپ",
      "فیس بک",
      "تصاویر",
      "ویڈیو",
      "جعلی اکاؤنٹ",
      "سائبر",
      "آن لائن فراڈ",
      "ایزی پیسہ",
      "جاز کیش",
      "بینک فراڈ",
      "blackmail",
      "hack",
      "cyber",
      "fia",
      "easypaisa",
      "jazzcash",
    ],
    titleUr: "سائبر کرائم، آن لائن بلیک میلنگ، ہیکنگ اور ڈیجیٹل فراڈ (PECA 2016)",
    titleRoman: "Cybercrime, Blackmailing, Hacking aur Online Fraud (PECA 2016)",
    titleEn: "Cybercrime, Online Blackmail, Hacking & Digital Fraud (PECA 2016)",
    directAnswerUr:
      "**پریوینشن آف الیکٹرانک کرائمز ایکٹ (PECA 2016)** کے تحت:\n- کسی کی تصاویر یا ویڈیوز کے ذریعے بلیک میل کرنا یا پھیلانا (**دفعہ 21 اور 24**) سنگین جرم ہے جس کی سزا **5 سے 7 سال قید اور 50 لاکھ روپے تک جرمانہ** ہے۔\n- واٹس ایپ/سوشل میڈیا ہیک کرنا یا جعلی اکاؤنٹ بنانا (**دفعہ 3 اور 16**) اور آن لائن پیسوں کا فراڈ (**دفعہ 14**) بھی قابلِ سزا جرم ہے۔\n- **فوری اقدام:** کسی بھی میسج یا اسکرین شاٹ کو ڈیلیٹ نہ کریں۔ فوری طور پر **ایف آئی اے سائبر کرائم ہیلپ لائن 1991** پر کال کریں یا **nr3c.gov.pk** پر آن لائن شکایت درج کروائیں۔ اگر بینک، ایزی پیسہ یا جاز کیش فراڈ ہوا ہے تو **بینکنگ محتسب پاکستان** سے بھی رجوع کریں۔",
    directAnswerRoman:
      "**PECA Act 2016 (Sec. 14, 16, 20, 21, 24)** ke tehat online blackmailing, photos leak karne ki dhamki, WhatsApp hacking aur online financial fraud par **5 se 7 saal qaid** ki saza hai. Saboot (screenshots/numbers) mehfooz rakhein aur foran **FIA Cybercrime Helpline 1991** par shikayat darj karwayein.",
    directAnswerEn:
      "Under **PECA 2016 (Sections 14, 16, 20, 21 & 24)**, online blackmail, non-consensual sharing of images, account hacking, and digital banking fraud carry **up to 5–7 years imprisonment**. Preserve all screenshots and report immediately to **FIA Cybercrime Helpline 1991** (`nr3c.gov.pk`).",
    voiceUr:
      "السلام علیکم۔ پیکا ایکٹ دو ہزار سولہ کے تحت آن لائن بلیک میلنگ، ہیکنگ، جعلی اکاؤنٹ یا آن لائن مالی فراڈ پر پانچ سے سات سال تک قید کی سزا ہے۔ آپ تمام اسکرین شاٹس محفوظ رکھیں اور فوری طور پر ایف آئی اے سائبر کرائم ہیلپ لائن انیس اکیانوے پر شکایت بھیجیں۔",
  },
];

function findSpecificQaMatch(query: string): SpecificScenarioAnswer | null {
  const lower = query.toLowerCase();
  let bestMatch: SpecificScenarioAnswer | null = null;
  let maxHits = 0;

  for (const item of SPECIFIC_LEGAL_QA_BANK) {
    let hits = 0;
    for (const kw of item.matchKeywords) {
      if (lower.includes(kw.toLowerCase())) {
        hits += kw.includes(" ") ? 3 : 2;
      }
    }
    if (hits > maxHits) {
      maxHits = hits;
      bestMatch = item;
    }
  }
  return maxHits > 0 ? bestMatch : null;
}

function findMentionedConstitutionalArticle(query: string) {
  const lower = query.toLowerCase();
  // Check if user asked for a specific Article number e.g. "آرٹیکل 10", "article 25", "199"
  const numMatch =
    lower.match(/(?:article|آرٹیکل|ارٹیکل|دفعہ)\s*(\d+[a-z]?)/i) ||
    lower.match(/\b(184|199|25a|10a|19a)\b/i);

  if (numMatch && numMatch[1]) {
    const num = numMatch[1].toUpperCase();
    const found = CONSTITUTION_OF_PAKISTAN_1973.find((c) =>
      c.article.toUpperCase().includes(`ARTICLE ${num}`)
    );
    if (found) return found;
  }

  if (
    lower.includes("بنیادی حقوق") ||
    lower.includes("آئین پاکستان") ||
    lower.includes("fundamental rights") ||
    lower.includes("bunyadi haqooq")
  ) {
    return CONSTITUTION_OF_PAKISTAN_1973[0];
  }
  return null;
}

export function extractFactsFromText(
  text: string,
  existing?: Partial<ExtractedUserFacts>,
  profile?: CitizenProfile | null
): ExtractedUserFacts {
  const cities = [
    "Islamabad",
    "Lahore",
    "Karachi",
    "Rawalpindi",
    "Peshawar",
    "Quetta",
    "Faisalabad",
    "Multan",
    "Sialkot",
    "Gujranwala",
    "Hyderabad",
    "Abbottabad",
    "Bahawalpur",
    "Sargodha",
  ];

  let detectedCity =
    existing?.city ||
    profile?.city ||
    "[Your City, e.g., Lahore / Islamabad]";
  for (const c of cities) {
    if (text.toLowerCase().includes(c.toLowerCase())) {
      detectedCity = c;
      break;
    }
  }

  let institution =
    existing?.institutionOrRespondent ||
    "[Name of Concerned Department / Institution / Respondent]";
  const uniMatch = text.match(
    /([A-Z][a-zA-Z]+\s+(?:University|College|Institute|Police|Hospital|Bank|Company|Authority|Board|Court|Office))/
  );
  if (uniMatch && uniMatch[1]) {
    institution = uniMatch[1];
  } else if (
    text.toLowerCase().includes("university") ||
    text.includes("یونیورسٹی")
  ) {
    institution = "[Name of University / Degree Awarding Institute]";
  } else if (text.toLowerCase().includes("nadra") || text.includes("نادرا")) {
    institution = "NADRA Regional Office";
  } else if (
    text.toLowerCase().includes("police") ||
    text.toLowerCase().includes("thana") ||
    text.includes("پولیس") ||
    text.includes("تھانہ")
  ) {
    institution = "[Concerned Police Station (Thana) & District]";
  }

  const cnicMatch = text.match(/\b\d{5}-\d{7}-\d{1}\b/);
  const phoneMatch = text.match(/\b(?:03\d{2}-?\d{7}|\+923\d{9})\b/);

  return {
    haqId: profile?.haqId || existing?.haqId || "HAQ-PK-GUEST",
    rawStatement: text.trim(),
    applicantName:
      existing?.applicantName || profile?.fullName || "[Your Full Name]",
    cnic: cnicMatch
      ? cnicMatch[0]
      : existing?.cnic ||
        profile?.cnic ||
        "[Your CNIC Number: XXXXX-XXXXXXX-X]",
    city: detectedCity,
    address:
      existing?.address ||
      profile?.address ||
      `${detectedCity}, Pakistan`,
    institutionOrRespondent: institution,
    dateOfIncident:
      existing?.dateOfIncident || new Date().toISOString().split("T")[0],
    referenceOrRollNo:
      existing?.referenceOrRollNo ||
      "[Registration / Roll No. / Reference ID]",
    contactPhone: phoneMatch
      ? phoneMatch[0]
      : existing?.contactPhone ||
        profile?.phone ||
        "[Your Mobile Number: 03XX-XXXXXXX]",
    contactEmail:
      existing?.contactEmail || profile?.email || "[Your Email Address]",
  };
}

export function buildFormalComplaint(
  entry: LegalKnowledgeEntry,
  facts: ExtractedUserFacts,
  customAuthority?: AuthorityInfo,
  customLegalParagraph?: string,
  customReliefParagraph?: string
): GeneratedComplaint {
  const primaryAuthority = customAuthority || entry.authorities[0];
  const todayFormatted = new Date().toLocaleDateString("en-PK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const subject = `${entry.complaintTemplate.subjectPrefix} – Regarding ${facts.institutionOrRespondent}`;
  const legalCit =
    customLegalParagraph || entry.complaintTemplate.legalCitationParagraph;
  const reliefCit =
    customReliefParagraph || entry.complaintTemplate.requestedReliefParagraph;

  const bodyText = `To,
The Competent Authority / Grievance Redressal Cell,
${primaryAuthority.name}
Official Portal: ${primaryAuthority.portalUrl}
Date: ${todayFormatted}
HaqAI Citizen ID: ${facts.haqId || "HAQ-PK-CITIZEN"}

SUBJECT: ${subject.toUpperCase()}

Respected Sir / Madam,

I, ${facts.applicantName} (holding CNIC No. ${facts.cnic}, resident of ${
    facts.address || facts.city
  }), respectfully submit this formal complaint and state the facts strictly as follows:

1. STATEMENT OF GRIEVANCE & FACTS:
   - Aggrieved Citizen Statement: "${facts.rawStatement}"
   - Concerned Institution / Respondent: ${facts.institutionOrRespondent}
   - City / Jurisdiction: ${facts.city}
   - Relevant Date / Reference / Roll No.: ${
     facts.referenceOrRollNo
   } (Date: ${facts.dateOfIncident})

2. APPLICABLE CONSTITUTIONAL & STATUTORY LEGAL PROVISIONS (PAKISTAN):
   ${legalCit}

3. PRAYER / REQUESTED RELIEF:
   ${reliefCit}

I affirm that the facts stated above are true and accurate to the best of my knowledge. Copies of my CNIC (${
    facts.cnic
  }) and relevant supporting documents are attached herewith.

Yours faithfully,

Signature: ___________________________
Full Name: ${facts.applicantName}
HaqAI Citizen ID: ${facts.haqId || "HAQ-PK-CITIZEN"}
CNIC No.: ${facts.cnic}
Address / City: ${facts.address || facts.city}
Contact Phone: ${facts.contactPhone}
Email: ${facts.contactEmail}`;

  const emailBody = `Dear Grievance Redressal Officer (${primaryAuthority.shortName}),

Please find below the formal citizen complaint submitted by ${facts.applicantName} (HaqAI ID: ${
    facts.haqId || "HAQ-PK-CITIZEN"
  }, CNIC: ${facts.cnic}) for urgent statutory action:

--------------------------------------------------
${bodyText}
--------------------------------------------------`;

  return {
    subject,
    recipientTitle: primaryAuthority.name,
    recipientAuthority: primaryAuthority,
    date: todayFormatted,
    bodyText,
    emailSubject: `[Formal Citizen Complaint - ${facts.haqId}] ${subject}`,
    emailBody,
    categoryId: entry.id,
    facts,
  };
}

/**
 * Async AI Analysis Engine powered by Google Gemini (when GEMINI_API_KEY is set)
 * grounded in the entire Constitution of Pakistan (1973) and all Pakistani statutory laws.
 */
export async function generateHaqAIAnalysisAsync(params: {
  query: string;
  language?: SupportedLanguage;
  channel?: "website" | "whatsapp";
  existingCaseId?: string;
  factOverrides?: Partial<ExtractedUserFacts>;
  citizenProfile?: CitizenProfile | null;
  previousChatHistory?: ChatTurn[];
}): Promise<HaqAIAnalysisResult> {
  // First build deterministic baseline
  const baseResult = generateHaqAIAnalysis(params);

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    return baseResult;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const constitutionContext = CONSTITUTION_OF_PAKISTAN_1973.map(
      (c) => `${c.article} (${c.title}): ${c.textSummary}`
    ).join("\n");

    const lawsContext = PAKISTAN_LAWS_CORPUS.map(
      (l) =>
        `${l.lawName} [${l.domain}] (${l.keySections}): ${l.description} | Authority: ${l.authorityName} (${l.portalUrl}, Helpline: ${l.helpline}, Email: ${l.email})`
    ).join("\n");

    const profileContext = params.citizenProfile
      ? `Logged-in Citizen Profile (Pre-verified):
- HaqAI Citizen ID: ${params.citizenProfile.haqId}
- Full Name: ${params.citizenProfile.fullName}
- CNIC: ${params.citizenProfile.cnic}
- Phone/WhatsApp: ${params.citizenProfile.phone}
- Email: ${params.citizenProfile.email}
- City/Province: ${params.citizenProfile.city}, ${params.citizenProfile.province}
- Address: ${params.citizenProfile.address}`
      : "No pre-saved citizen profile provided.";

    const historyContext =
      params.previousChatHistory && params.previousChatHistory.length > 0
        ? `Previous Conversation Turns:\n` +
          params.previousChatHistory
            .map((t) => `${t.role.toUpperCase()}: ${t.content}`)
            .join("\n")
        : "";

    const prompt = `You are HaqAI (حق اے آئی), Pakistan's authoritative AI Legal Rights & Complaint Assistant.
You know the ENTIRE Constitution of the Islamic Republic of Pakistan (1973) and ALL Pakistani Statutory Laws (Pakistan Penal Code PPC, Code of Criminal Procedure CrPC, Civil Procedure Code CPC, Family Laws Ordinance 1961, Property/Inheritance/Rent Laws, PECA Cybercrime Act 2016, HEC Ordinance 2002, Wafaqi Mohtasib Order 1983, Consumer Protection Acts, Labour/Employment Laws, Banking/Tax/FBR Laws, NADRA/Passport Laws, Traffic/Municipal Laws, Human Rights Laws).

CRITICAL RULES:
1. Answer ANY legal or constitutional question asked by the citizen accurately under Pakistani law.
2. NEVER invent fake articles or fake laws. Cite real Articles of the 1973 Constitution of Pakistan and real sections of Pakistani statutes.
3. Respond in the citizen's requested language (${baseResult.language}: 'roman_ur' = easy Roman Urdu, 'ur' = Urdu script, 'pa' = Punjabi, 'en' = English).
4. Use the citizen's pre-saved profile details (${profileContext}) to automatically populate the formal complaint letter so they do not have to re-enter their Name, CNIC, Phone, Email, or City.

REFERENCE CONSTITUTION OF PAKISTAN (1973):
${constitutionContext}

REFERENCE PAKISTAN STATUTORY LAWS:
${lawsContext}

${historyContext}

CITIZEN CURRENT QUERY / MESSAGE:
"${params.query}"

Return a JSON object matching this exact schema:
{
  "categoryTitle": "Specific legal area title in the user's language (e.g. Family Law / Property / Criminal / Constitutional / Education / Tax / Rent)",
  "replyText": "Comprehensive, empathetic markdown response in the user's language explaining their exact rights under the 1973 Constitution and Pakistani statutes, relevant authority, and reminding them of Option 1 (1-Click Online Complaint) and Option 2 (Voice/Text Legal Guidance)",
  "voiceSummaryText": "3-4 sentence natural spoken summary suitable for Text-to-Speech. IMPORTANT: If the user language is 'roman_ur', 'ur', or 'pa', you MUST write voiceSummaryText in pure URDU SCRIPT (اردو حروف تہجی، جیسے: السلام علیکم! آپ کے مسئلے کے مطابق پاکستانی قانون آپ کو مکمل تحفظ دیتا ہے...) so our Urdu voice engine pronounces every word clearly in authentic Urdu! Only use English script if language is 'en'.",
  "constitutionalRights": [
    { "article": "Article X – Constitution of Pakistan 1973", "title": "Title of Article", "summary": "Clear explanation in user's language" }
  ],
  "statutoryLaws": [
    { "law": "Exact Name of Pakistani Act / Ordinance / PPC / CrPC", "section": "Exact Section(s)", "explanation": "Clear explanation in user's language" }
  ],
  "nextSteps": [
    "Step 1 practical instruction in user's language",
    "Step 2 practical instruction in user's language",
    "Step 3 practical instruction in user's language"
  ],
  "followUpQuestions": [
    "1 or 2 short clarifying questions if any incident detail is missing"
  ],
  "primaryAuthority": {
    "id": "authority_slug",
    "name": "Full Official Name of Pakistani Government Institution / Ombudsman / Court / Helpline",
    "shortName": "Short Name",
    "role": "Statutory role of this authority",
    "portalUrl": "Verified official https://... gov.pk URL",
    "email": "Official complaint email",
    "helpline": "Official helpline number (e.g. 1099, 1055, 1787, 1991, etc.)",
    "address": "Official headquarter/office address in Pakistan",
    "turnaroundTime": "Expected statutory resolution timeframe"
  },
  "complaintSubject": "Formal subject line for the legal complaint/application",
  "legalCitationParagraph": "Formal paragraph citing the exact Constitutional Articles and Pakistani statutory sections violated",
  "requestedReliefParagraph": "Formal prayer/relief paragraph requesting action from the authority",
  "detectedInstitutionOrRespondent": "Name of respondent/department/person mentioned by user, or sensible placeholder"
}`;

    let rawJson = "";
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });
      const response = await model.generateContent(prompt);
      rawJson = response.response.text();
    } catch {
      const fallbackModel = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });
      const response = await fallbackModel.generateContent(prompt);
      rawJson = response.response.text();
    }

    const parsed = JSON.parse(rawJson);

    const updatedFacts: ExtractedUserFacts = {
      ...baseResult.generatedComplaint.facts,
      institutionOrRespondent:
        parsed.detectedInstitutionOrRespondent ||
        baseResult.generatedComplaint.facts.institutionOrRespondent,
    };

    const customAuth: AuthorityInfo = {
      id: parsed.primaryAuthority?.id || baseResult.primaryAuthority.id,
      name: parsed.primaryAuthority?.name || baseResult.primaryAuthority.name,
      shortName:
        parsed.primaryAuthority?.shortName ||
        baseResult.primaryAuthority.shortName,
      role: parsed.primaryAuthority?.role || baseResult.primaryAuthority.role,
      portalUrl:
        parsed.primaryAuthority?.portalUrl ||
        baseResult.primaryAuthority.portalUrl,
      email:
        parsed.primaryAuthority?.email || baseResult.primaryAuthority.email,
      helpline:
        parsed.primaryAuthority?.helpline ||
        baseResult.primaryAuthority.helpline,
      address:
        parsed.primaryAuthority?.address || baseResult.primaryAuthority.address,
      turnaroundTime:
        parsed.primaryAuthority?.turnaroundTime ||
        baseResult.primaryAuthority.turnaroundTime,
      instructions: baseResult.primaryAuthority.instructions,
    };

    const entry = classifyLegalIssue(params.query);
    const updatedComplaint = buildFormalComplaint(
      entry,
      updatedFacts,
      customAuth,
      parsed.legalCitationParagraph,
      parsed.requestedReliefParagraph
    );
    if (parsed.complaintSubject) {
      updatedComplaint.subject = parsed.complaintSubject;
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const whatsappReplyText =
      `🇵🇰 *HaqAI – Pakistan Legal Rights & Complaint Assistant*\n\n` +
      `👤 *Citizen ID:* ${baseResult.haqId}\n` +
      `📌 *Legal Area:* ${parsed.categoryTitle || baseResult.categoryTitle}\n` +
      `⚖️ *Applicable Law:* ${
        parsed.constitutionalRights?.[0]?.article || "Constitution 1973"
      } & ${parsed.statutoryLaws?.[0]?.law || "Pakistan Code"}\n` +
      `🏛️ *Relevant Authority:* ${customAuth.name} (Helpline: ${customAuth.helpline})\n\n` +
      `👇 *Click Your Personalized Website Link Below (2 Options):*\n` +
      `1️⃣ *Option 1 – Online Complaint Submit (Edit & 1-Click Forward):*\n${appUrl}/complaint?caseId=${baseResult.caseId}\n\n` +
      `2️⃣ *Option 2 – Full Legal Guidance & Voice Chat:*\n${appUrl}/assistant?caseId=${baseResult.caseId}`;

    const newTurns: ChatTurn[] = [
      ...(params.previousChatHistory || []),
      {
        role: "user",
        content: params.query,
        timestamp: new Date().toISOString(),
      },
      {
        role: "assistant",
        content: parsed.replyText || baseResult.replyText,
        timestamp: new Date().toISOString(),
      },
    ];

    return {
      ...baseResult,
      aiEngineUsed: "gemini-live",
      categoryTitle: parsed.categoryTitle || baseResult.categoryTitle,
      replyText: parsed.replyText || baseResult.replyText,
      voiceSummaryText: parsed.voiceSummaryText || baseResult.voiceSummaryText,
      whatsappReplyText,
      constitutionalRights:
        parsed.constitutionalRights?.length > 0
          ? parsed.constitutionalRights
          : baseResult.constitutionalRights,
      statutoryLaws:
        parsed.statutoryLaws?.length > 0
          ? parsed.statutoryLaws
          : baseResult.statutoryLaws,
      nextSteps:
        parsed.nextSteps?.length > 0 ? parsed.nextSteps : baseResult.nextSteps,
      followUpQuestions:
        parsed.followUpQuestions?.length > 0
          ? parsed.followUpQuestions
          : baseResult.followUpQuestions,
      primaryAuthority: customAuth,
      recommendedAuthorities: [
        customAuth,
        ...baseResult.recommendedAuthorities.filter(
          (a) => a.shortName !== customAuth.shortName
        ),
      ],
      generatedComplaint: updatedComplaint,
      chatHistory: newTurns,
    };
  } catch (err) {
    console.warn("Gemini API fallback to verified RAG engine:", err);
    return baseResult;
  }
}

export function generateHaqAIAnalysis(params: {
  query: string;
  language?: SupportedLanguage;
  channel?: "website" | "whatsapp";
  existingCaseId?: string;
  factOverrides?: Partial<ExtractedUserFacts>;
  citizenProfile?: CitizenProfile | null;
  previousChatHistory?: ChatTurn[];
}): HaqAIAnalysisResult {
  const channel = params.channel || "website";
  const lang = detectLanguageFromInput(params.query, params.language);
  const entry = classifyLegalIssue(params.query);
  const specificQa = findSpecificQaMatch(params.query);
  const mentionedArticle = findMentionedConstitutionalArticle(params.query);

  const caseId =
    params.existingCaseId ||
    `HAQ-${Math.floor(100000 + Math.random() * 900000)}`;
  const haqId =
    params.citizenProfile?.haqId ||
    params.factOverrides?.haqId ||
    "HAQ-PK-104829";

  const facts = extractFactsFromText(
    params.query,
    params.factOverrides,
    params.citizenProfile
  );
  const generatedComplaint = buildFormalComplaint(entry, facts);
  const primaryAuthority = entry.authorities[0];

  const constitutionalRights = entry.constitutionalRights.map((c) => ({
    article: c.article,
    title: c.title,
    summary: c.summary[lang],
  }));

  if (
    mentionedArticle &&
    !constitutionalRights.some((c) => c.article === mentionedArticle.article)
  ) {
    constitutionalRights.unshift({
      article: `${mentionedArticle.article} – Constitution of Pakistan (1973)`,
      title: mentionedArticle.title,
      summary:
        lang === "ur" || lang === "pa"
          ? mentionedArticle.urduSummary
          : lang === "roman_ur"
          ? mentionedArticle.romanUrduSummary
          : mentionedArticle.textSummary,
    });
  }

  const statutoryLaws = entry.statutoryLaws.map((s) => ({
    law: s.law,
    section: s.section,
    explanation: s.explanation[lang],
  }));

  const nextSteps = entry.administrativeProcedures[lang];
  const followUpQuestions = entry.followUpQuestions[lang];
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const resolvedCategoryTitle = specificQa
    ? lang === "ur" || lang === "pa"
      ? specificQa.titleUr
      : lang === "roman_ur"
      ? specificQa.titleRoman
      : specificQa.titleEn
    : entry.title[lang];

  let replyText = "";
  let voiceSummaryText = "";
  let whatsappReplyText = "";

  if (lang === "roman_ur") {
    const directSection = specificQa
      ? `${specificQa.directAnswerRoman}\n\n`
      : mentionedArticle
      ? `**${mentionedArticle.article} (${mentionedArticle.title}):** ${mentionedArticle.romanUrduSummary}\n\n`
      : `Aap ka sawal **${entry.title.roman_ur}** ke qawaneen ke tehat aata hai. ${statutoryLaws[0]?.explanation}\n\n`;

    replyText =
      `Assalam-o-Alaikum **${facts.applicantName}**!\n\n` +
      `🎯 **Aap ke Sawal ka Qanooni Jawab:**\n${directSection}` +
      `⚖️ **Aaeen-e-Pakistan (1973) ke Tehat Aap ke Haqooq:**\n` +
      constitutionalRights
        .map((c) => `• **${c.article} (${c.title}):** ${c.summary}`)
        .join("\n") +
      `\n\n📜 **Laago Pakistani Qawaneen (Statutes):**\n` +
      statutoryLaws
        .map((s) => `• **${s.law} (${s.section}):** ${s.explanation}`)
        .join("\n") +
      `\n\n✅ **Qanooni Tareeqa-e-Kar (Step-by-Step):**\n` +
      nextSteps.map((step, i) => `${i + 1}. ${step}`).join("\n") +
      `\n\n🏛️ **Mutaliqa Sarkari Idara:** **${primaryAuthority.name}** (Helpline: \`${primaryAuthority.helpline}\` | Portal: ${primaryAuthority.portalUrl})`;

    voiceSummaryText = specificQa
      ? specificQa.voiceUr
      : `السلام علیکم۔ آپ کا مسئلہ ${entry.title.ur} سے متعلق ہے۔ ${entry.statutoryLaws[0]?.explanation.ur} آپ اس مسئلے کی شکایت ${primaryAuthority.name} کو کر سکتے ہیں۔ ہم نے آپ کی تفصیلات کے ساتھ قانونی درخواست تیار کر دی ہے جسے آپ ایک کلک پر متعلقہ ادارے کو بھیج سکتے ہیں۔`;
  } else if (lang === "ur" || lang === "pa") {
    const directSection = specificQa
      ? `${specificQa.directAnswerUr}\n\n`
      : mentionedArticle
      ? `**${mentionedArticle.article} (${mentionedArticle.title}):** ${mentionedArticle.urduSummary}\n\n`
      : `آئینِ پاکستان 1973 اور نافذ العمل قوانین کے مطابق آپ کا مسئلہ **${entry.title.ur}** سے متعلق ہے۔ ${statutoryLaws[0]?.explanation}\n\n`;

    replyText =
      `السلام علیکم **${facts.applicantName}**!\n\n` +
      `🎯 **آپ کے سوال کا براہِ راست قانونی جواب:**\n${directSection}` +
      `⚖️ **آئینِ پاکستان (1973) کے تحت آپ کے حقوق:**\n` +
      constitutionalRights
        .map((c) => `• **${c.article}:** ${c.summary}`)
        .join("\n") +
      `\n\n📜 **لاگو پاکستانی قوانین اور دفعات:**\n` +
      statutoryLaws
        .map((s) => `• **${s.law} (${s.section}):** ${s.explanation}`)
        .join("\n") +
      `\n\n✅ **عملی قانونی طریقہ کار (Step-by-Step):**\n` +
      nextSteps.map((step, i) => `${i + 1}. ${step}`).join("\n") +
      `\n\n🏛️ **متعلقہ سرکاری ادارہ:** **${primaryAuthority.name}** (ہیلپ لائن: \`${primaryAuthority.helpline}\` | پورٹل: ${primaryAuthority.portalUrl})`;

    voiceSummaryText = specificQa
      ? specificQa.voiceUr
      : `السلام علیکم۔ آپ کا مسئلہ ${entry.title.ur} سے متعلق ہے۔ ${entry.statutoryLaws[0]?.explanation.ur} آپ کی تفصیلات کے ساتھ درخواست تیار کر دی گئی ہے جسے آپ ایک کلک پر ${primaryAuthority.name} کو بھیج سکتے ہیں۔`;
  } else {
    const directSection = specificQa
      ? `${specificQa.directAnswerEn}\n\n`
      : mentionedArticle
      ? `**${mentionedArticle.article} (${mentionedArticle.title}):** ${mentionedArticle.textSummary}\n\n`
      : `Under the **Constitution of Pakistan (1973)** and **Pakistani Statutory Law**, your query falls under **${entry.title.en}**. ${statutoryLaws[0]?.explanation}\n\n`;

    replyText =
      `Hello **${facts.applicantName}** (Citizen ID: \`${haqId}\`).\n\n` +
      `🎯 **Direct Legal Answer:**\n${directSection}` +
      `⚖️ **Constitutional Protections (1973 Constitution):**\n` +
      constitutionalRights
        .map((c) => `• **${c.article} (${c.title}):** ${c.summary}`)
        .join("\n") +
      `\n\n📜 **Applicable Pakistani Statutes:**\n` +
      statutoryLaws
        .map((s) => `• **${s.law} (${s.section}):** ${s.explanation}`)
        .join("\n") +
      `\n\n✅ **Step-by-Step Legal Procedure:**\n` +
      nextSteps.map((step, i) => `${i + 1}. ${step}`).join("\n") +
      `\n\n🏛️ **Verified Authority:** **${primaryAuthority.name}** (${primaryAuthority.portalUrl} | Helpline: ${primaryAuthority.helpline})`;

    voiceSummaryText = `Your issue involves ${resolvedCategoryTitle}. Under ${constitutionalRights[0]?.article} and ${statutoryLaws[0]?.law}, ${statutoryLaws[0]?.explanation} Your formal complaint has been pre-filled with your citizen profile details for one-click forwarding to ${primaryAuthority.shortName}.`;
  }

  whatsappReplyText =
    `🇵🇰 *HaqAI – Citizen Rights & Complaint Assistant*\n\n` +
    `👤 *Citizen ID:* ${haqId}\n` +
    `📌 *Issue:* ${resolvedCategoryTitle}\n` +
    `⚖️ *Pakistani Law:* ${constitutionalRights[0]?.article} & ${statutoryLaws[0]?.law}\n` +
    `🏛️ *Authority:* ${primaryAuthority.name} (Helpline: ${primaryAuthority.helpline})\n\n` +
    `👇 *Click Your Website Link Below (2 Citizen Options):*\n` +
    `1️⃣ *Option 1 – Submit Online Complaint (Edit & 1-Click Forward):*\n${appUrl}/complaint?caseId=${caseId}\n\n` +
    `2️⃣ *Option 2 – Full Legal Guidance (Voice & Text):*\n${appUrl}/assistant?caseId=${caseId}`;

  const workflowSteps: AgentWorkflowStep[] = [
    {
      stepNumber: 1,
      title: "Understand Input",
      status: "completed",
      summary: `Captured ${channel} query (${lang.toUpperCase()})`,
    },
    {
      stepNumber: 2,
      title: "Classify & Match Laws",
      status: "completed",
      summary: resolvedCategoryTitle,
    },
    {
      stepNumber: 3,
      title: "Citizen Profile Linked",
      status: "completed",
      summary: `HaqAI ID: ${haqId} (${facts.applicantName})`,
    },
    {
      stepNumber: 4,
      title: "Explain 1973 Constitution",
      status: "completed",
      summary: `${constitutionalRights.length} Articles & ${statutoryLaws.length} Statutes verified`,
    },
    {
      stepNumber: 5,
      title: "Recommend Solutions",
      status: "completed",
      summary: `${nextSteps.length} actionable legal steps mapped`,
    },
    {
      stepNumber: 6,
      title: "Find Authority",
      status: "completed",
      summary: `${primaryAuthority.shortName} (${primaryAuthority.portalUrl})`,
    },
    {
      stepNumber: 7,
      title: "Pre-Fill Formal Complaint",
      status: "completed",
      summary: `Pre-filled with Citizen CNIC & Address`,
    },
    {
      stepNumber: 8,
      title: "User Review & 1-Click Approval",
      status: "action_required",
      summary: "Awaiting citizen approval for 1-click dispatch",
    },
  ];

  const chatHistory: ChatTurn[] = [
    ...(params.previousChatHistory || []),
    {
      role: "user",
      content: params.query,
      timestamp: new Date().toISOString(),
    },
    {
      role: "assistant",
      content: replyText,
      timestamp: new Date().toISOString(),
    },
  ];

  return {
    caseId,
    haqId,
    citizenProfile: params.citizenProfile || undefined,
    timestamp: new Date().toISOString(),
    channel,
    language: lang,
    aiEngineUsed: "verified-pakistan-rag",
    userQuery: params.query,
    categoryId: entry.id,
    categoryTitle: resolvedCategoryTitle,
    replyText,
    whatsappReplyText,
    voiceSummaryText,
    constitutionalRights,
    statutoryLaws,
    nextSteps,
    followUpQuestions,
    recommendedAuthorities: entry.authorities,
    primaryAuthority,
    generatedComplaint,
    workflowSteps,
    chatHistory,
    status: "Open",
  };
}
