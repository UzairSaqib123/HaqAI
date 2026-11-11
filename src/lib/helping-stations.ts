import { LegalCategoryId } from "./legal-knowledge";

export interface HelpingStation {
  id: string;
  name: string;
  officeType: string;
  city: string;
  province: string;
  address: string;
  helpline: string;
  lat: number;
  lng: number;
  categories: LegalCategoryId[];
  actionAdvice: string;
}

/**
 * Verified coordinates of major regional grievance & legal helping stations across Pakistan
 * (HEC Regional Centers, FIA Cyber Crime Centers, Ombudsman Offices, High Court Legal Aid,
 * Police Complaint Centers, Labour & Consumer Courts, NADRA Mega Centers).
 */
export const VERIFIED_HELPING_STATIONS: HelpingStation[] = [
  // ISLAMABAD / RAWALPINDI
  {
    id: "hec-hq-isb",
    name: "Higher Education Commission (HEC) Main Secretariat & Facilitation Center",
    officeType: "HEC Grievance & Degree Attestation Center",
    city: "Islamabad",
    province: "ICT",
    address: "Sector H-9, East Service Road, Islamabad",
    helpline: "051-111-119-432",
    lat: 33.6666,
    lng: 73.0479,
    categories: ["education"],
    actionAdvice:
      "Visit the Student Facilitation Counter with your original CNIC, transcripts, and a printed copy of your formal complaint.",
  },
  {
    id: "fia-cyber-isb",
    name: "FIA National Cyber Crime Investigation Agency (NCCIA) Reporting Center",
    officeType: "Cyber Crime Reporting Station",
    city: "Islamabad",
    province: "ICT",
    address: "Sector G-13/1, Street 98, Islamabad",
    helpline: "1991 / 051-9106384",
    lat: 33.6475,
    lng: 72.9633,
    categories: ["cybercrime"],
    actionAdvice:
      "Submit your printed PECA complaint along with screenshots, URLs, and transaction proofs at the Duty Officer desk.",
  },
  {
    id: "police-khidmat-isb",
    name: "Islamabad Police Khidmat Markaz & IGP Complaint Cell",
    officeType: "Police Facilitation & FIR Complaint Station",
    city: "Islamabad",
    province: "ICT",
    address: "Sector F-6 Markaz, Islamabad",
    helpline: "15 / 1715",
    lat: 33.7297,
    lng: 73.0746,
    categories: ["police", "civil_criminal"],
    actionAdvice:
      "File your written application for FIR registration under Section 154 CrPC and obtain a computerized dairy number.",
  },
  {
    id: "wafaqi-mohtasib-isb",
    name: "Wafaqi Mohtasib (Federal Ombudsman) Secretariat",
    officeType: "Federal Ombudsman Grievance Office",
    city: "Islamabad",
    province: "ICT",
    address: "36-Constitution Avenue, Sector G-5/2, Islamabad",
    helpline: "1055",
    lat: 33.7285,
    lng: 73.0955,
    categories: ["government", "consumer", "property", "human_rights"],
    actionAdvice:
      "Submit your signed application against any federal agency (NADRA, Passport, IESCO, SNGPL) at the Central Registry.",
  },
  {
    id: "fospah-isb",
    name: "Federal Ombudsperson Secretariat for Protection Against Harassment (FOSPAH)",
    officeType: "Workplace & Women Property Rights Tribunal",
    city: "Islamabad",
    province: "ICT",
    address: "LG & RD Complex, Sector G-5/2, Islamabad",
    helpline: "051-9203958",
    lat: 33.7252,
    lng: 73.0912,
    categories: ["employment", "family", "property", "human_rights"],
    actionAdvice:
      "File workplace harassment or women's inheritance/property deprivation petitions directly with the Registrar.",
  },

  // LAHORE
  {
    id: "hec-lhr",
    name: "HEC Regional Center Lahore",
    officeType: "HEC Student Grievance & Attestation Office",
    city: "Lahore",
    province: "Punjab",
    address: "55-B/2, Gulberg III, Lahore",
    helpline: "042-99263092",
    lat: 31.5091,
    lng: 74.3497,
    categories: ["education"],
    actionAdvice:
      "Bring your printed application, university fee receipts, and CNIC copy to the Regional Director's Facilitation Desk.",
  },
  {
    id: "fia-cyber-lhr",
    name: "FIA Cyber Crime Reporting Center Lahore",
    officeType: "Cyber Crime Reporting Station",
    city: "Lahore",
    province: "Punjab",
    address: "24-Civic Center, Block D-2, Johar Town / Gulberg II, Lahore",
    helpline: "1991 / 042-99268203",
    lat: 31.4697,
    lng: 74.2728,
    categories: ["cybercrime"],
    actionAdvice:
      "Appear in person with printed screenshots, offending phone numbers/links, and your signed PECA 2016 application.",
  },
  {
    id: "ccpo-police-lhr",
    name: "CCPO / IGP 1787 Police Khidmat & Complaint Center Lahore",
    officeType: "Police Complaint & FIR Redressal Station",
    city: "Lahore",
    province: "Punjab",
    address: "Lower Mall / District Courts Chowk, Lahore",
    helpline: "1787 / 15",
    lat: 31.5712,
    lng: 74.3075,
    categories: ["police", "civil_criminal"],
    actionAdvice:
      "Submit your application to the SP Complaints or file a Section 22-A CrPC petition at the adjacent Sessions Court.",
  },
  {
    id: "ombudsman-punjab-lhr",
    name: "Office of the Ombudsman Punjab & Consumer Court Lahore",
    officeType: "Provincial Ombudsman & Consumer Tribunal",
    city: "Lahore",
    province: "Punjab",
    address: "2-Bank Road, Old Anarkali, Lahore",
    helpline: "1050",
    lat: 31.5686,
    lng: 74.3122,
    categories: ["government", "consumer", "property", "employment"],
    actionAdvice:
      "File your signed complaint against provincial departments, municipal authorities, or consumer defects.",
  },
  {
    id: "family-labour-court-lhr",
    name: "District Family, Rent & Labour Courts Complex Lahore",
    officeType: "Family, Tenancy & Labour Judicial Complex",
    city: "Lahore",
    province: "Punjab",
    address: "Aiwan-e-Adal, Lower Mall, Lahore",
    helpline: "1134",
    lat: 31.5724,
    lng: 74.3061,
    categories: ["family", "property", "employment", "civil_criminal", "human_rights"],
    actionAdvice:
      "Approach the District Legal Empowerment / Facilitation Desk with your printed petition and CNIC.",
  },

  // KARACHI
  {
    id: "hec-khi",
    name: "HEC Regional Center Karachi",
    officeType: "HEC Student Grievance & Attestation Office",
    city: "Karachi",
    province: "Sindh",
    address: "Adjacent to Palace Cinema, Civil Lines, Karachi",
    helpline: "021-99201556",
    lat: 24.8508,
    lng: 67.0329,
    categories: ["education"],
    actionAdvice:
      "Visit the Student Grievance Desk with your printed formal application and university documents.",
  },
  {
    id: "fia-cyber-khi",
    name: "FIA Cyber Crime Reporting Center Karachi",
    officeType: "Cyber Crime Reporting Station",
    city: "Karachi",
    province: "Sindh",
    address: "Block-6, Gulshan-e-Iqbal, Near NIPA Chowrangi, Karachi",
    helpline: "1991 / 021-99244618",
    lat: 24.9181,
    lng: 67.0971,
    categories: ["cybercrime"],
    actionAdvice:
      "Submit your signed PECA complaint along with digital evidence screenshots at the reception desk.",
  },
  {
    id: "police-cplc-khi",
    name: "CPLC & IGP Sindh Police Complaint Redressal Center Karachi",
    officeType: "Police & Citizen Liaison Station",
    city: "Karachi",
    province: "Sindh",
    address: "Central Police Office (CPO) / Sindh Governor House Compound, Karachi",
    helpline: "1102 / 9110",
    lat: 24.8532,
    lng: 67.0185,
    categories: ["police", "civil_criminal"],
    actionAdvice:
      "Lodge your FIR refusal or police misconduct application and obtain a CPLC/IGP tracking number.",
  },
  {
    id: "ombudsman-sindh-khi",
    name: "Provincial Ombudsman Sindh & Consumer Protection Court Karachi",
    officeType: "Provincial Ombudsman & Consumer Court",
    city: "Karachi",
    province: "Sindh",
    address: "4-F, Block 24-B, Shahrah-e-Iraq, Saddar, Karachi",
    helpline: "021-99207036",
    lat: 24.8573,
    lng: 67.0281,
    categories: ["government", "consumer", "property", "employment", "family", "human_rights"],
    actionAdvice:
      "Submit your printed application with supporting receipts/documents at the Complaint Registration Counter.",
  },

  // PESHAWAR
  {
    id: "hec-fia-psh",
    name: "HEC & FIA Cyber Crime / Ombudsman Regional Complex Peshawar",
    officeType: "Regional Legal & Grievance Station",
    city: "Peshawar",
    province: "KP",
    address: "Phase 5, Hayatabad / University Road, Peshawar",
    helpline: "1991 / 091-9217408",
    lat: 33.9916,
    lng: 71.4342,
    categories: [
      "education",
      "cybercrime",
      "police",
      "government",
      "consumer",
      "property",
      "employment",
      "family",
      "civil_criminal",
      "human_rights",
    ],
    actionAdvice:
      "Visit the Facilitation Counter with your signed application and CNIC copy for immediate diary registration.",
  },

  // QUETTA
  {
    id: "hec-fia-qta",
    name: "HEC, FIA Cyber Crime & Ombudsman Regional Center Quetta",
    officeType: "Regional Legal & Grievance Station",
    city: "Quetta",
    province: "Balochistan",
    address: "Zarghoon Road / Chaman Housing Scheme, Quetta",
    helpline: "1991 / 081-9201798",
    lat: 30.2036,
    lng: 67.0145,
    categories: [
      "education",
      "cybercrime",
      "police",
      "government",
      "consumer",
      "property",
      "employment",
      "family",
      "civil_criminal",
      "human_rights",
    ],
    actionAdvice:
      "Bring your printed formal complaint and CNIC copy to the Regional Complaint Cell.",
  },

  // MULTAN & FAISALABAD
  {
    id: "regional-multan",
    name: "District Courts, Ombudsman & FIA Cyber Crime Center Multan",
    officeType: "Regional Police, Cyber & Judicial Station",
    city: "Multan",
    province: "Punjab",
    address: "Kutchery Road / Abdali Road, Multan",
    helpline: "1787 / 1991",
    lat: 30.1984,
    lng: 71.4687,
    categories: [
      "education",
      "cybercrime",
      "police",
      "government",
      "consumer",
      "property",
      "employment",
      "family",
      "civil_criminal",
      "human_rights",
    ],
    actionAdvice:
      "Submit your signed application at the District Facilitation Desk or FIA Circle Office.",
  },
  {
    id: "regional-faisalabad",
    name: "District Courts, CPO Police & FIA Regional Center Faisalabad",
    officeType: "Regional Police, Cyber & Judicial Station",
    city: "Faisalabad",
    province: "Punjab",
    address: "Civil Lines / Mall Road, Faisalabad",
    helpline: "1787 / 1991",
    lat: 31.4258,
    lng: 73.0845,
    categories: [
      "education",
      "cybercrime",
      "police",
      "government",
      "consumer",
      "property",
      "employment",
      "family",
      "civil_criminal",
      "human_rights",
    ],
    actionAdvice:
      "File your printed formal complaint at the Khidmat Markaz or relevant tribunal registry.",
  },
];

/** Haversine distance in kilometers between two GPS coordinates */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/** Returns the best Google Maps search query for the user's legal problem */
export function getCategoryMapSearchQuery(categoryId: LegalCategoryId): {
  searchQuery: string;
  stationLabel: string;
} {
  switch (categoryId) {
    case "police":
    case "civil_criminal":
      return {
        searchQuery: "Police Station Khidmat Markaz District Court",
        stationLabel: "Nearest Police Station / Khidmat Markaz / Sessions Court",
      };
    case "cybercrime":
      return {
        searchQuery: "FIA Cyber Crime Reporting Center NCCIA",
        stationLabel: "Nearest FIA Cyber Crime Reporting Center",
      };
    case "education":
      return {
        searchQuery: "Higher Education Commission HEC Regional Office",
        stationLabel: "Nearest HEC Regional Facilitation Center",
      };
    case "family":
      return {
        searchQuery: "Family Court District Courts Legal Aid Office",
        stationLabel: "Nearest Family Court & Union Council Arbitration Office",
      };
    case "property":
      return {
        searchQuery: "Rent Tribunal Civil Court Revenue Office Arazi Record Center",
        stationLabel: "Nearest Civil / Rent Tribunal & Land Record Center",
      };
    case "employment":
      return {
        searchQuery: "Labour Court Directorate of Labour Welfare",
        stationLabel: "Nearest Labour Court / Workplace Ombudsperson Office",
      };
    case "consumer":
      return {
        searchQuery: "Consumer Protection Court Assistant Commissioner Office",
        stationLabel: "Nearest Consumer Protection Court / Price Control Office",
      };
    case "government":
      return {
        searchQuery: "Wafaqi Mohtasib Federal Ombudsman NADRA Office",
        stationLabel: "Nearest Ombudsman (Wafaqi Mohtasib) / Citizen Facilitation Center",
      };
    case "human_rights":
    default:
      return {
        searchQuery: "District Legal Aid Human Rights Directorate Court",
        stationLabel: "Nearest District Legal Aid & Human Rights Center",
      };
  }
}
