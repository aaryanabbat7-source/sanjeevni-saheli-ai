export type Lang = "en" | "hi" | "bn" | "or" | "pa" | "gu" | "mr" | "ta" | "te";

export const LANGUAGES: { code: Lang; native: string; english: string; flag: string }[] = [
  { code: "en", native: "English", english: "English", flag: "🇬🇧" },
  { code: "hi", native: "हिन्दी", english: "Hindi", flag: "🇮🇳" },
  { code: "bn", native: "বাংলা", english: "Bengali", flag: "🇧🇩" },
  { code: "or", native: "ଓଡ଼ିଆ", english: "Odia", flag: "🇮🇳" },
  { code: "pa", native: "ਪੰਜਾਬੀ", english: "Punjabi", flag: "🇮🇳" },
  { code: "gu", native: "ગુજરાતી", english: "Gujarati", flag: "🇮🇳" },
  { code: "mr", native: "मराठी", english: "Marathi", flag: "🇮🇳" },
  { code: "ta", native: "தமிழ்", english: "Tamil", flag: "🇮🇳" },
  { code: "te", native: "తెలుగు", english: "Telugu", flag: "🇮🇳" },
];

export const LANG_NAME: Record<Lang, string> = {
  en: "English", hi: "Hindi", bn: "Bengali", or: "Odia",
  pa: "Punjabi", gu: "Gujarati", mr: "Marathi", ta: "Tamil", te: "Telugu",
};

export function bcp47(lang: Lang): string {
  const map: Record<Lang, string> = {
    en: "en-IN", hi: "hi-IN", bn: "bn-IN", or: "or-IN",
    pa: "pa-IN", gu: "gu-IN", mr: "mr-IN", ta: "ta-IN", te: "te-IN",
  };
  return map[lang];
}

export type TopicKey = "menstrual" | "nutrition" | "pregnancy" | "vaccine" | "emergency" | "schemes";

export interface SubTopic { title: string; preview: string; detail: string; }

interface Dict {
  appName: string;
  tagline: string;
  chooseLang: string;
  chooseLangSub: string;
  changeLanguage: string;
  continue: string;
  back: string;
  login: string;
  register: string;
  logout: string;
  openApp: string;
  settings: string;
  switchProfile: string;
  addAnotherProfile: string;
  noProfilesYet: string;
  loginPickProfile: string;
  loginEnterMobile: string;
  loginNoMatch: string;
  loginMobileFull: string;
  mobileQ: string;
  mobileP: string;
  mobilePlaceholder: string;
  mobileInvalid: string;
  mobileExistingCount: (n: number) => string;
  nameQ: string;
  nameP: string;
  namePlaceholder: string;
  nameError: string;
  dobQ: string;
  dobP: string;
  dobLocked: string;
  dobInvalid: string;
  genderQ: string;
  genderP: string;
  genderLocked: string;
  female: string;
  male: string;
  other: string;
  welcomeTitle: (name: string) => string;
  welcomeSub: string;
  start: string;
  dashboardTitle: string;
  dashboardSub: string;
  chatWithAI: string;
  askAnything: string;
  emergencyHelp: string;
  callAmbulance: string;
  callHealth: string;
  callWomen: string;
  chatPlaceholder: string;
  listening: string;
  disclaimer: string;
  explore: string;
  exploreCta: string;
  backToTopics: string;
  searchTopics: string;
  noResults: string;
  askSanjeevniAbout: string;
  copy: string;
  copied: string;
  listen: string;
  stop: string;
  greeting: string;
  topics: Record<TopicKey, { title: string; desc: string }>;
  subtopics: Record<TopicKey, SubTopic[]>;
  registeredOn: string;
  profileDetails: string;
  mobile: string;
  dob: string;
  gender: string;
  language: string;
  cannotEdit: string;
  removeProfile: string;
  removeConfirm: string;
  myChats: string;
  newChat: string;
  noChatsYet: string;
  viewAllChats: string;
  deleteChat: string;
}

const en: Dict = {
  appName: "Sanjeevni Saheli AI",
  tagline: "Your Trusted Health Companion",
  chooseLang: "Choose your language",
  chooseLangSub: "Select the language you're most comfortable with",
  changeLanguage: "Change language",
  continue: "Continue",
  back: "Back",
  login: "Log in",
  register: "Register",
  logout: "Log out",
  openApp: "Open App",
  settings: "Settings",
  switchProfile: "Switch profile",
  addAnotherProfile: "Add another profile",
  noProfilesYet: "No profiles on this device yet.",
  loginPickProfile: "Pick your profile",
  loginEnterMobile: "Enter your mobile number to find your profiles",
  loginNoMatch: "No profile found for this number on this device.",
  loginMobileFull: "This number has 3 profiles already. Please pick one.",
  mobileQ: "Your mobile number",
  mobileP: "Up to 3 profiles can share one mobile number",
  mobilePlaceholder: "10-digit mobile number",
  mobileInvalid: "Please enter a valid 10-digit Indian mobile number.",
  mobileExistingCount: (n) => `${n} profile${n > 1 ? "s" : ""} already use this number on this device.`,
  nameQ: "What is your name?",
  nameP: "Tell us how we should address you",
  namePlaceholder: "Enter your full name",
  nameError: "Please enter at least 3 letters.",
  dobQ: "Your date of birth",
  dobP: "We'll use this to personalize your guidance. This can't be changed later.",
  dobLocked: "Date of birth is set once and cannot be changed.",
  dobInvalid: "Please choose a valid date of birth.",
  genderQ: "How do you identify?",
  genderP: "This is set once and cannot be changed later.",
  genderLocked: "Gender is set once and cannot be changed.",
  female: "Female",
  male: "Male",
  other: "Other / Prefer not to say",
  welcomeTitle: (name) => `Welcome, ${name}!`,
  welcomeSub: "I'm Sanjeevni, your personal health companion. I'm here to guide you with safe, evidence-based health information.",
  start: "Start My Health Journey",
  dashboardTitle: "How can I help you today?",
  dashboardSub: "Choose a topic or chat with Sanjeevni directly",
  chatWithAI: "Chat with Sanjeevni",
  askAnything: "Ask me anything about your health",
  emergencyHelp: "Emergency",
  callAmbulance: "Call 108",
  callHealth: "104 Health",
  callWomen: "181 Women",
  chatPlaceholder: "Type your question…",
  listening: "Listening…",
  disclaimer: "This app provides general health information and does not replace professional medical advice.",
  explore: "Explore topics",
  exploreCta: "Explore",
  backToTopics: "Back to topics",
  searchTopics: "Search topics…",
  noResults: "No results.",
  askSanjeevniAbout: "Ask Sanjeevni about this",
  copy: "Copy",
  copied: "Copied",
  listen: "Listen",
  stop: "Stop",
  greeting: "Namaste,",
  topics: {
    menstrual: { title: "Menstrual Health", desc: "Cycles, hygiene, cramps & care" },
    nutrition: { title: "Nutrition & Wellness", desc: "Iron, protein, balanced eating" },
    pregnancy: { title: "Pregnancy & Maternal Care", desc: "From early signs to delivery" },
    vaccine: { title: "Child Vaccination", desc: "Schedules, myths & safety" },
    emergency: { title: "Emergency Help", desc: "Helplines and first response" },
    schemes: { title: "Govt. Schemes", desc: "Central, state & local health schemes" },
  },
  subtopics: {
    menstrual: [
      { title: "Normal Menstrual Cycle", preview: "What's typical, what's not", detail: "A healthy cycle ranges from 21 to 35 days, with bleeding for 2–7 days. Tracking your cycle helps you recognise changes early." },
      { title: "Managing Period Cramps", preview: "Safe relief at home", detail: "Warm compress, gentle stretching, hydration, and iron-rich foods help. Avoid skipping meals. See a doctor if pain disrupts daily life." },
      { title: "Heavy Bleeding Warning", preview: "When to seek help", detail: "If you soak through a pad every hour for several hours, see a doctor. Heavy bleeding can cause anaemia and needs evaluation." },
      { title: "Menstrual Hygiene", preview: "Stay safe and confident", detail: "Change pads every 4–6 hours. Wash hands before and after. Dispose of products safely. Reusable cloth pads must be washed and sun-dried." },
      { title: "Irregular Periods", preview: "Possible causes", detail: "Stress, weight changes, thyroid issues, or PCOS can cause irregularity. Persistent changes deserve a check-up." },
      { title: "When to Visit a Doctor", preview: "Red flags", detail: "Severe pain, very heavy bleeding, missed periods (when not pregnant), bleeding between periods — all warrant a visit." },
    ],
    nutrition: [
      { title: "Iron Deficiency", preview: "Most common in Indian women", detail: "Include jaggery, dates, green leafy vegetables, ragi, and lentils. Combine with vitamin C (lemon, amla) for better absorption." },
      { title: "Protein Importance", preview: "Build & repair", detail: "Dal, eggs, paneer, sprouts, peanuts, and milk are affordable protein sources. Aim for protein in every meal." },
      { title: "Balanced Diet", preview: "Easy plate rule", detail: "Half plate vegetables, a quarter grains (roti/rice), a quarter protein (dal/egg/fish). Add fruit and a glass of water." },
      { title: "Affordable Healthy Foods", preview: "Budget-friendly choices", detail: "Seasonal vegetables, eggs, dal, peanuts, bananas, curd, ragi, and millets give excellent nutrition at low cost." },
      { title: "Hydration", preview: "Water is medicine", detail: "Drink 8–10 glasses daily. In summer, add ORS or nimbu-paani. Dark yellow urine means you need more water." },
    ],
    pregnancy: [
      { title: "Early Signs", preview: "How to confirm", detail: "Missed period, nausea, tender breasts, fatigue. Confirm with a home test 7 days after a missed period or visit an ANM." },
      { title: "Nutrition During Pregnancy", preview: "Eating for two — gently", detail: "Iron, folic acid, calcium, and protein are essential. Take government-provided IFA tablets. Avoid raw papaya, excess caffeine, and street food." },
      { title: "Danger Symptoms", preview: "Call a doctor immediately", detail: "Severe headache, blurred vision, swelling of face/hands, heavy bleeding, severe pain, baby not moving — these are emergencies." },
      { title: "Prenatal Check-ups", preview: "Minimum visits", detail: "At least 4 ANC visits — first trimester, around 26 weeks, 32 weeks, and 36 weeks. Carry your Mother & Child Protection card." },
      { title: "Delivery Preparation", preview: "Plan ahead", detail: "Identify the nearest health centre, save 108 in your phone, keep documents ready, prepare a bag with clothes for mother and baby." },
      { title: "Post-pregnancy Care", preview: "Recovery & baby", detail: "Rest, eat warm nutritious food, breastfeed within an hour, ensure baby's first vaccines, watch for postpartum sadness." },
    ],
    vaccine: [
      { title: "Importance", preview: "Why vaccines save lives", detail: "Vaccines protect children from polio, measles, diphtheria, hepatitis and more. They are safe, free at government centres, and proven over decades." },
      { title: "Schedule", preview: "Birth to 16 years", detail: "Birth: BCG, OPV, Hep B. 6 weeks onward: Pentavalent, Rotavirus, PCV. 9 months: MR. Follow your Mother & Child card." },
      { title: "Missed Vaccines", preview: "It's not too late", detail: "Visit the nearest ANM or health centre. Catch-up schedules exist for almost every vaccine. Don't skip out of fear." },
      { title: "Side Effects", preview: "What's normal", detail: "Mild fever, soreness, or fussiness for 1–2 days is normal. Give paracetamol if advised. Seek care for high fever or severe reactions." },
      { title: "Vaccine Myths", preview: "Truth over rumour", detail: "Vaccines do not cause infertility or autism. They are tested rigorously and have saved millions of children globally." },
    ],
    emergency: [
      { title: "Ambulance 108", preview: "Free national ambulance", detail: "Dial 108 for free emergency transport anywhere in India. Stay calm, share location landmarks, and keep the patient comfortable." },
      { title: "Health Helpline 104", preview: "Free medical advice", detail: "Dial 104 for free health information, doctor consultation by phone, and guidance on the nearest health facility." },
      { title: "Fainting", preview: "First response", detail: "Lay the person flat, raise legs, loosen tight clothing, ensure airflow. If unconscious for more than a minute, call 108." },
      { title: "Bleeding Emergency", preview: "Stop the bleed", detail: "Apply firm pressure with a clean cloth. Raise the injured part above the heart. Do not remove embedded objects. Call 108." },
      { title: "Severe Pain Emergency", preview: "Chest, abdomen, head", detail: "Sudden severe chest pain, severe abdominal pain, or worst-ever headache need immediate evaluation. Do not drive yourself — call 108." },
    ],
    schemes: [
      { title: "PM Matru Vandana Yojana (PMMVY)", preview: "Maternity cash benefit", detail: "Conditional DBT of ₹5,000 for the first live birth (in 2 installments) and ₹6,000 for a second girl child. Apply via your ANM/ASHA or the PMMVY portal." },
      { title: "Janani Suraksha Yojana (JSY)", preview: "Cash for institutional delivery", detail: "Cash incentive for delivering at a government hospital. Low-Performing States: ₹1,400 rural / ₹1,000 urban. High-Performing States: ₹700 rural / ₹600 urban." },
      { title: "Janani Shishu Suraksha Karyakram (JSSK)", preview: "Zero-cost maternity care", detail: "Free drugs, diagnostics, blood, food and transport for every pregnant woman and sick infant (up to 1 year) in public health facilities." },
      { title: "PM Surakshit Matritva Abhiyan (PMSMA)", preview: "Free check-ups on the 9th", detail: "Free specialist antenatal check-ups for 2nd/3rd trimester pregnancies on the 9th of every month. High-risk cases are tagged with red stickers and tracked." },
      { title: "SUMAN — Surakshit Matritva Aashwasan", preview: "Right to zero-cost care", detail: "Legally backed promise of 100% zero out-of-pocket spending and zero-tolerance for service denial for mothers and newborns at public facilities." },
      { title: "Universal Immunization Programme (UIP)", preview: "Free vaccines for 12 diseases", detail: "Free national immunization schedule covering 12 vaccine-preventable diseases. Track every dose digitally on the U-WIN portal." },
      { title: "Mission Indradhanush (IMI)", preview: "Catch-up for missed doses", detail: "Special drives to vaccinate zero-dose children and pregnant women who missed routine immunisation, especially in hard-to-reach districts." },
      { title: "Menstrual Hygiene Scheme (MHS)", preview: "₹6 per pack via ASHA", detail: "Under RKSK: Freedays sanitary napkins distributed to rural adolescent girls by ASHA workers at ₹6 for a pack of 6." },
      { title: "PM Bhartiya Janaushadhi (PMBJP)", preview: "Suvidha pads at ₹1", detail: "Suvidha oxy-biodegradable sanitary pads at ₹1 per pad at Jan Aushadhi Kendras. Generic medicines also available at low cost." },
      { title: "Saksham Anganwadi & POSHAN 2.0", preview: "Nutrition for mother & child", detail: "Umbrella scheme: hot meals + Take-Home Rations through Anganwadis, Poshan Abhiyaan against stunting, Scheme for Adolescent Girls (11–14), and Anemia Mukt Bharat IFA tablets." },
      { title: "PM POSHAN (Mid-Day Meal)", preview: "Daily school meal", detail: "Free hot nutritionally balanced meal every school day for children in classes 1 to 8 in government and aided schools." },
      { title: "Ayushman Bharat (PM-JAY)", preview: "₹5 lakh health cover", detail: "Free secondary and tertiary hospital care up to ₹5 lakh per family per year at empanelled hospitals. Check eligibility on the PM-JAY portal or via your nearest CSC." },
      { title: "Emergency Numbers", preview: "112 / 108 / 102 / 104 / 181", detail: "112 — all-in-one emergency. 108 — free ambulance. 102 — free transport for pregnant women & newborns (JSSK). 104 — health helpline. 181 — women's helpline." },
    ],
  },
  registeredOn: "Registered on",
  profileDetails: "Profile details",
  mobile: "Mobile",
  dob: "Date of birth",
  gender: "Gender",
  language: "Language",
  cannotEdit: "Cannot be edited",
  removeProfile: "Remove this profile",
  removeConfirm: "Remove this profile from this device? This cannot be undone.",
  myChats: "My Chats",
  newChat: "New chat",
  noChatsYet: "No chats yet. Start a new conversation with Sanjeevni.",
  viewAllChats: "View all chats",
  deleteChat: "Delete chat",
};

const hi: Dict = {
  appName: "संजीवनी सहेली AI",
  tagline: "आपकी विश्वसनीय स्वास्थ्य साथी",
  chooseLang: "अपनी भाषा चुनें",
  chooseLangSub: "वह भाषा चुनें जिसमें आप सहज हैं",
  changeLanguage: "भाषा बदलें",
  continue: "आगे बढ़ें",
  back: "वापस",
  login: "लॉग इन",
  register: "रजिस्टर",
  logout: "लॉग आउट",
  openApp: "ऐप खोलें",
  settings: "सेटिंग्स",
  switchProfile: "प्रोफ़ाइल बदलें",
  addAnotherProfile: "नई प्रोफ़ाइल जोड़ें",
  noProfilesYet: "इस डिवाइस पर अभी कोई प्रोफ़ाइल नहीं है।",
  loginPickProfile: "अपनी प्रोफ़ाइल चुनें",
  loginEnterMobile: "अपनी प्रोफ़ाइल देखने के लिए मोबाइल नंबर दर्ज करें",
  loginNoMatch: "इस नंबर के लिए कोई प्रोफ़ाइल नहीं मिली।",
  loginMobileFull: "इस नंबर पर पहले से 3 प्रोफ़ाइल हैं। कृपया एक चुनें।",
  mobileQ: "आपका मोबाइल नंबर",
  mobileP: "एक मोबाइल नंबर पर अधिकतम 3 प्रोफ़ाइल बन सकती हैं",
  mobilePlaceholder: "10 अंकों का मोबाइल नंबर",
  mobileInvalid: "कृपया 10 अंकों का सही भारतीय मोबाइल नंबर दर्ज करें।",
  mobileExistingCount: (n) => `इस नंबर पर इस डिवाइस पर पहले से ${n} प्रोफ़ाइल है${n > 1 ? "ं" : ""}।`,
  nameQ: "आपका नाम क्या है?",
  nameP: "हमें बताइए हम आपको कैसे संबोधित करें",
  namePlaceholder: "अपना पूरा नाम लिखें",
  nameError: "कृपया कम से कम 3 अक्षर लिखें।",
  dobQ: "आपकी जन्म तिथि",
  dobP: "इससे हम आपके लिए सही जानकारी दे सकेंगे। यह बाद में बदली नहीं जा सकती।",
  dobLocked: "जन्म तिथि एक बार ही दर्ज होती है और बदली नहीं जा सकती।",
  dobInvalid: "कृपया एक सही जन्म तिथि चुनें।",
  genderQ: "आप अपनी पहचान कैसे करती हैं?",
  genderP: "यह एक बार दर्ज होता है और बाद में बदला नहीं जा सकता।",
  genderLocked: "लिंग एक बार दर्ज होता है और बदला नहीं जा सकता।",
  female: "महिला",
  male: "पुरुष",
  other: "अन्य / बताना नहीं चाहती",
  welcomeTitle: (name) => `नमस्ते, ${name}!`,
  welcomeSub: "मैं संजीवनी हूँ, आपकी निजी स्वास्थ्य सहेली। मैं आपको सुरक्षित और भरोसेमंद स्वास्थ्य जानकारी दूँगी।",
  start: "अपनी स्वास्थ्य यात्रा शुरू करें",
  dashboardTitle: "मैं आज आपकी कैसे मदद कर सकती हूँ?",
  dashboardSub: "एक विषय चुनें या संजीवनी से सीधे बात करें",
  chatWithAI: "संजीवनी से बात करें",
  askAnything: "स्वास्थ्य से जुड़ा कोई भी सवाल पूछें",
  emergencyHelp: "आपातकाल",
  callAmbulance: "108 कॉल करें",
  callHealth: "104 स्वास्थ्य",
  callWomen: "181 महिला",
  chatPlaceholder: "अपना सवाल लिखें…",
  listening: "सुन रही हूँ…",
  disclaimer: "यह ऐप सामान्य स्वास्थ्य जानकारी देती है, यह डॉक्टर की सलाह का विकल्प नहीं है।",
  explore: "विषय देखें",
  exploreCta: "देखें",
  backToTopics: "विषयों पर लौटें",
  searchTopics: "विषय खोजें…",
  noResults: "कोई परिणाम नहीं।",
  askSanjeevniAbout: "इसके बारे में संजीवनी से पूछें",
  copy: "कॉपी",
  copied: "कॉपी हो गया",
  listen: "सुनें",
  stop: "रोकें",
  greeting: "नमस्ते,",
  topics: {
    menstrual: { title: "मासिक धर्म स्वास्थ्य", desc: "चक्र, स्वच्छता, ऐंठन और देखभाल" },
    nutrition: { title: "पोषण और स्वास्थ्य", desc: "आयरन, प्रोटीन, संतुलित आहार" },
    pregnancy: { title: "गर्भावस्था देखभाल", desc: "शुरुआती लक्षण से प्रसव तक" },
    vaccine: { title: "बच्चों का टीकाकरण", desc: "अनुसूची, मिथक और सुरक्षा" },
    emergency: { title: "आपातकालीन सहायता", desc: "हेल्पलाइन और प्राथमिक मदद" },
  },
  subtopics: {
    menstrual: [
      { title: "सामान्य मासिक चक्र", preview: "क्या सामान्य है, क्या नहीं", detail: "स्वस्थ चक्र 21 से 35 दिन का होता है, और रक्तस्राव 2–7 दिन रहता है। अपने चक्र को नोट करने से बदलाव जल्दी पहचान सकते हैं।" },
      { title: "मासिक धर्म में ऐंठन", preview: "घर पर सुरक्षित राहत", detail: "गर्म पट्टी, हल्की स्ट्रेचिंग, खूब पानी और आयरन वाले भोजन से आराम मिलता है। भोजन न छोड़ें। यदि दर्द काम-काज में बाधा डाले तो डॉक्टर को दिखाएँ।" },
      { title: "अधिक रक्तस्राव की चेतावनी", preview: "कब मदद लें", detail: "यदि कई घंटों तक हर घंटे पैड भीग रहा है, तो डॉक्टर को दिखाएँ। अधिक रक्तस्राव से खून की कमी हो सकती है।" },
      { title: "मासिक स्वच्छता", preview: "सुरक्षित और आत्मविश्वासी रहें", detail: "हर 4–6 घंटे में पैड बदलें। पहले और बाद में हाथ धोएँ। पैड सुरक्षित ढंग से फेंकें। कपड़े के पैड को धोकर धूप में सुखाएँ।" },
      { title: "अनियमित मासिक", preview: "संभावित कारण", detail: "तनाव, वज़न में बदलाव, थायरॉइड या PCOS से अनियमितता हो सकती है। लगातार बदलाव हो तो जाँच कराएँ।" },
      { title: "डॉक्टर के पास कब जाएँ", preview: "खतरे के संकेत", detail: "तेज़ दर्द, बहुत अधिक रक्तस्राव, बिना गर्भ के मासिक न आना, मासिक के बीच रक्तस्राव — डॉक्टर को दिखाएँ।" },
    ],
    nutrition: [
      { title: "आयरन की कमी", preview: "भारतीय महिलाओं में सबसे आम", detail: "गुड़, खजूर, हरी सब्जियाँ, रागी और दालें खाएँ। बेहतर अवशोषण के लिए नींबू/आँवला (विटामिन C) के साथ लें।" },
      { title: "प्रोटीन का महत्व", preview: "शरीर बनाने के लिए", detail: "दाल, अंडे, पनीर, अंकुरित अनाज, मूँगफली और दूध सस्ते प्रोटीन हैं। हर भोजन में प्रोटीन लें।" },
      { title: "संतुलित आहार", preview: "आसान थाली का नियम", detail: "आधी थाली सब्ज़ी, चौथाई अनाज (रोटी/चावल), चौथाई प्रोटीन (दाल/अंडा/मछली)। फल और पानी अवश्य लें।" },
      { title: "सस्ता पौष्टिक भोजन", preview: "बजट में स्वास्थ्य", detail: "मौसमी सब्ज़ियाँ, अंडे, दाल, मूँगफली, केला, दही, रागी और बाजरा कम कीमत में बढ़िया पोषण देते हैं।" },
      { title: "पानी पीना", preview: "पानी ही औषधि है", detail: "रोज़ 8–10 गिलास पानी पिएँ। गर्मी में ORS या नींबू-पानी लें। पेशाब गहरा पीला हो तो पानी कम है।" },
    ],
    pregnancy: [
      { title: "शुरुआती लक्षण", preview: "कैसे पुष्टि करें", detail: "मासिक न आना, उल्टी, स्तनों में दर्द, थकान। मासिक न आने के 7 दिन बाद घर पर टेस्ट करें या ANM से मिलें।" },
      { title: "गर्भावस्था में पोषण", preview: "दो के लिए — सावधानी से", detail: "आयरन, फोलिक एसिड, कैल्शियम और प्रोटीन ज़रूरी हैं। सरकारी IFA गोलियाँ लें। कच्चा पपीता, ज़्यादा चाय/कॉफी और बाहर का भोजन न लें।" },
      { title: "खतरे के लक्षण", preview: "तुरंत डॉक्टर से मिलें", detail: "तेज़ सिरदर्द, धुंधला दिखना, चेहरे/हाथों में सूजन, अधिक रक्तस्राव, तेज़ दर्द, बच्चे का हिलना बंद — ये आपातकाल हैं।" },
      { title: "प्रसवपूर्व जाँच", preview: "ज़रूरी विज़िट्स", detail: "कम से कम 4 ANC जाँच — पहली तिमाही, 26 हफ्ते, 32 हफ्ते और 36 हफ्ते। मातृ-शिशु सुरक्षा कार्ड साथ रखें।" },
      { title: "प्रसव की तैयारी", preview: "पहले से योजना", detail: "नज़दीकी स्वास्थ्य केंद्र पहचानें, फोन में 108 सेव करें, कागज़ात तैयार रखें, माँ-बच्चे के कपड़ों का बैग तैयार रखें।" },
      { title: "प्रसव के बाद देखभाल", preview: "रिकवरी और शिशु", detail: "आराम करें, गर्म पौष्टिक भोजन लें, एक घंटे के भीतर स्तनपान कराएँ, शिशु के पहले टीके लगवाएँ, मन की उदासी पर ध्यान दें।" },
    ],
    vaccine: [
      { title: "महत्व", preview: "टीके जीवन बचाते हैं", detail: "टीके बच्चों को पोलियो, खसरा, डिप्थीरिया, हेपेटाइटिस आदि से बचाते हैं। सरकारी केंद्रों पर मुफ़्त और सुरक्षित हैं।" },
      { title: "अनुसूची", preview: "जन्म से 16 साल तक", detail: "जन्म पर: BCG, OPV, Hep B। 6 हफ्ते से: पेंटा, रोटा, PCV। 9 महीने: MR। मातृ-शिशु कार्ड का पालन करें।" },
      { title: "छूटे हुए टीके", preview: "अब भी समय है", detail: "नज़दीकी ANM या स्वास्थ्य केंद्र जाएँ। लगभग हर टीके के लिए कैच-अप उपलब्ध है। डर से न छोड़ें।" },
      { title: "साइड इफेक्ट", preview: "क्या सामान्य है", detail: "हल्का बुखार, सूजन या चिड़चिड़ापन 1–2 दिन सामान्य है। सलाह पर पैरासिटामोल दें। तेज़ बुखार पर डॉक्टर को दिखाएँ।" },
      { title: "टीकों के मिथक", preview: "अफ़वाह से सच", detail: "टीकों से बाँझपन या ऑटिज़्म नहीं होता। ये पूरी जाँच के बाद आते हैं और लाखों बच्चों की जान बचाते हैं।" },
    ],
    emergency: [
      { title: "एम्बुलेंस 108", preview: "मुफ़्त राष्ट्रीय एम्बुलेंस", detail: "किसी भी आपातकाल में 108 डायल करें। शांत रहें, स्थान बताएँ, मरीज़ को आराम दें।" },
      { title: "स्वास्थ्य हेल्पलाइन 104", preview: "मुफ़्त चिकित्सा सलाह", detail: "104 डायल कर मुफ़्त स्वास्थ्य जानकारी, फोन पर डॉक्टर सलाह और नज़दीकी केंद्र की जानकारी पाएँ।" },
      { title: "बेहोशी", preview: "पहली मदद", detail: "व्यक्ति को सीधा लिटाएँ, पैर ऊपर उठाएँ, कपड़े ढीले करें, हवा आने दें। एक मिनट से ज़्यादा बेहोश रहे तो 108 बुलाएँ।" },
      { title: "खून बहना", preview: "रक्तस्राव रोकें", detail: "साफ़ कपड़े से दबाव डालें। चोट वाले हिस्से को ऊँचा रखें। फँसी चीज़ न निकालें। 108 बुलाएँ।" },
      { title: "तेज़ दर्द आपातकाल", preview: "सीना, पेट, सिर", detail: "अचानक तेज़ सीने का दर्द, तेज़ पेट दर्द या सबसे तेज़ सिरदर्द — तुरंत 108 बुलाएँ। खुद गाड़ी न चलाएँ।" },
    ],
  },
  registeredOn: "पंजीकरण की तिथि",
  profileDetails: "प्रोफ़ाइल विवरण",
  mobile: "मोबाइल",
  dob: "जन्म तिथि",
  gender: "लिंग",
  language: "भाषा",
  cannotEdit: "बदला नहीं जा सकता",
  removeProfile: "यह प्रोफ़ाइल हटाएँ",
  removeConfirm: "इस डिवाइस से यह प्रोफ़ाइल हटाएँ? यह वापस नहीं होगा।",
  myChats: "मेरी बातचीत",
  newChat: "नई बातचीत",
  noChatsYet: "अभी कोई बातचीत नहीं। संजीवनी से नई बात शुरू करें।",
  viewAllChats: "सभी बातचीत देखें",
  deleteChat: "बातचीत हटाएँ",
};

const bn: Dict = {
  appName: "সঞ্জীবনী সহেলী AI",
  tagline: "আপনার বিশ্বস্ত স্বাস্থ্য সঙ্গী",
  chooseLang: "আপনার ভাষা নির্বাচন করুন",
  chooseLangSub: "যে ভাষায় স্বচ্ছন্দ সেটি বেছে নিন",
  changeLanguage: "ভাষা পরিবর্তন",
  continue: "এগিয়ে যান",
  back: "পেছনে",
  login: "লগ ইন",
  register: "রেজিস্টার",
  logout: "লগ আউট",
  openApp: "অ্যাপ খুলুন",
  settings: "সেটিংস",
  switchProfile: "প্রোফাইল পরিবর্তন",
  addAnotherProfile: "নতুন প্রোফাইল যোগ করুন",
  noProfilesYet: "এই ডিভাইসে এখনও কোনও প্রোফাইল নেই।",
  loginPickProfile: "আপনার প্রোফাইল বেছে নিন",
  loginEnterMobile: "প্রোফাইল দেখতে মোবাইল নম্বর দিন",
  loginNoMatch: "এই নম্বরের জন্য কোনও প্রোফাইল পাওয়া যায়নি।",
  loginMobileFull: "এই নম্বরে ইতিমধ্যে ৩টি প্রোফাইল আছে। দয়া করে একটি বেছে নিন।",
  mobileQ: "আপনার মোবাইল নম্বর",
  mobileP: "একটি মোবাইল নম্বরে সর্বোচ্চ ৩টি প্রোফাইল হতে পারে",
  mobilePlaceholder: "১০ সংখ্যার মোবাইল নম্বর",
  mobileInvalid: "দয়া করে সঠিক ১০ সংখ্যার ভারতীয় মোবাইল নম্বর দিন।",
  mobileExistingCount: (n) => `এই ডিভাইসে এই নম্বরে ইতিমধ্যে ${n}টি প্রোফাইল আছে।`,
  nameQ: "আপনার নাম কী?",
  nameP: "আমরা কীভাবে আপনাকে সম্বোধন করব",
  namePlaceholder: "আপনার পুরো নাম লিখুন",
  nameError: "অনুগ্রহ করে কমপক্ষে ৩টি অক্ষর লিখুন।",
  dobQ: "আপনার জন্ম তারিখ",
  dobP: "এটি দিয়ে আমরা আপনার পরামর্শ সাজাব। পরে এটি বদলানো যাবে না।",
  dobLocked: "জন্ম তারিখ একবার দেওয়া হয় এবং বদলানো যায় না।",
  dobInvalid: "দয়া করে একটি সঠিক জন্ম তারিখ বেছে নিন।",
  genderQ: "আপনি কীভাবে নিজেকে চিহ্নিত করেন?",
  genderP: "এটি একবার দেওয়া হয় এবং পরে বদলানো যায় না।",
  genderLocked: "লিঙ্গ একবার দেওয়া হয় এবং বদলানো যায় না।",
  female: "মহিলা",
  male: "পুরুষ",
  other: "অন্য / বলতে চাই না",
  welcomeTitle: (name) => `স্বাগতম, ${name}!`,
  welcomeSub: "আমি সঞ্জীবনী, আপনার ব্যক্তিগত স্বাস্থ্য সঙ্গী। আমি আপনাকে নিরাপদ ও বিশ্বাসযোগ্য স্বাস্থ্য তথ্য দেব।",
  start: "আমার স্বাস্থ্য যাত্রা শুরু করুন",
  dashboardTitle: "আজ আমি কীভাবে সাহায্য করতে পারি?",
  dashboardSub: "একটি বিষয় বেছে নিন বা সঞ্জীবনীর সাথে কথা বলুন",
  chatWithAI: "সঞ্জীবনীর সাথে চ্যাট",
  askAnything: "স্বাস্থ্য সম্পর্কে যেকোনো প্রশ্ন করুন",
  emergencyHelp: "জরুরি",
  callAmbulance: "108 কল",
  callHealth: "104 স্বাস্থ্য",
  callWomen: "181 মহিলা",
  chatPlaceholder: "আপনার প্রশ্ন লিখুন…",
  listening: "শুনছি…",
  disclaimer: "এই অ্যাপটি সাধারণ স্বাস্থ্য তথ্য দেয়, এটি ডাক্তারের পরামর্শের বিকল্প নয়।",
  explore: "বিষয় দেখুন",
  exploreCta: "দেখুন",
  backToTopics: "বিষয়ে ফিরে যান",
  searchTopics: "বিষয় অনুসন্ধান…",
  noResults: "কোনও ফলাফল নেই।",
  askSanjeevniAbout: "এই সম্পর্কে সঞ্জীবনীকে জিজ্ঞাসা করুন",
  copy: "কপি",
  copied: "কপি হয়েছে",
  listen: "শুনুন",
  stop: "থামান",
  greeting: "নমস্কার,",
  topics: {
    menstrual: { title: "মাসিক স্বাস্থ্য", desc: "চক্র, পরিচ্ছন্নতা, ব্যথা ও যত্ন" },
    nutrition: { title: "পুষ্টি ও সুস্থতা", desc: "আয়রন, প্রোটিন, সুষম খাদ্য" },
    pregnancy: { title: "গর্ভাবস্থা ও মাতৃযত্ন", desc: "প্রথম লক্ষণ থেকে প্রসব" },
    vaccine: { title: "শিশু টিকাদান", desc: "সূচি, ভুল ধারণা ও নিরাপত্তা" },
    emergency: { title: "জরুরি সহায়তা", desc: "হেল্পলাইন ও প্রাথমিক সাহায্য" },
  },
  subtopics: {
    menstrual: [
      { title: "সাধারণ মাসিক চক্র", preview: "কী স্বাভাবিক, কী নয়", detail: "সুস্থ চক্র ২১ থেকে ৩৫ দিন, রক্তপাত ২–৭ দিন। চক্র লক্ষ্য রাখলে পরিবর্তন দ্রুত বোঝা যায়।" },
      { title: "মাসিকের ব্যথা সামলানো", preview: "বাড়িতে নিরাপদ আরাম", detail: "গরম সেঁক, হালকা স্ট্রেচিং, প্রচুর জল ও আয়রন-যুক্ত খাবার আরাম দেয়। খাবার বাদ দেবেন না। ব্যথা দৈনন্দিন কাজে বাধা দিলে ডাক্তার দেখান।" },
      { title: "অতিরিক্ত রক্তপাত সতর্কতা", preview: "কখন সাহায্য নেবেন", detail: "যদি কয়েক ঘন্টা ধরে প্রতি ঘন্টায় প্যাড ভিজে যায়, ডাক্তার দেখান। বেশি রক্তপাতে রক্তাল্পতা হতে পারে।" },
      { title: "মাসিক পরিচ্ছন্নতা", preview: "নিরাপদ ও আত্মবিশ্বাসী থাকুন", detail: "প্রতি ৪–৬ ঘন্টায় প্যাড পরিবর্তন করুন। আগে ও পরে হাত ধুয়ে নিন। নিরাপদে ফেলুন। কাপড়ের প্যাড ধুয়ে রোদে শুকান।" },
      { title: "অনিয়মিত মাসিক", preview: "সম্ভাব্য কারণ", detail: "চাপ, ওজনের পরিবর্তন, থাইরয়েড বা PCOS অনিয়মিততা ঘটাতে পারে। ক্রমাগত পরিবর্তন হলে পরীক্ষা করান।" },
      { title: "কখন ডাক্তার দেখাবেন", preview: "বিপদ চিহ্ন", detail: "তীব্র ব্যথা, অতি রক্তপাত, গর্ভ ছাড়া মাসিক বন্ধ, মাসিকের মাঝে রক্তপাত — ডাক্তার দেখান।" },
    ],
    nutrition: [
      { title: "আয়রনের অভাব", preview: "ভারতীয় মহিলাদের মধ্যে সবচেয়ে সাধারণ", detail: "গুড়, খেজুর, সবুজ শাক, রাগি ও ডাল খান। ভালো শোষণের জন্য লেবু/আমলকীর (ভিটামিন C) সাথে নিন।" },
      { title: "প্রোটিনের গুরুত্ব", preview: "শরীর গড়তে", detail: "ডাল, ডিম, পনির, অঙ্কুরিত শস্য, চিনাবাদাম ও দুধ সস্তা প্রোটিন। প্রতিটি খাবারে প্রোটিন রাখুন।" },
      { title: "সুষম খাবার", preview: "সহজ থালা নিয়ম", detail: "অর্ধেক থালা সবজি, এক চতুর্থাংশ শস্য (রুটি/ভাত), এক চতুর্থাংশ প্রোটিন (ডাল/ডিম/মাছ)। ফল ও জল যোগ করুন।" },
      { title: "সস্তা পুষ্টিকর খাবার", preview: "বাজেটে স্বাস্থ্য", detail: "মরশুমি সবজি, ডিম, ডাল, চিনাবাদাম, কলা, দই, রাগি ও বাজরা কম খরচে চমৎকার পুষ্টি দেয়।" },
      { title: "জল পান", preview: "জলই ওষুধ", detail: "প্রতিদিন ৮–১০ গ্লাস জল পান করুন। গরমে ORS বা লেবু-জল নিন। গাঢ় হলুদ মূত্র মানে জল কম।" },
    ],
    pregnancy: [
      { title: "প্রাথমিক লক্ষণ", preview: "কীভাবে নিশ্চিত হবেন", detail: "মাসিক বন্ধ, বমিভাব, স্তনে ব্যথা, ক্লান্তি। মাসিক বন্ধের ৭ দিন পরে বাড়িতে পরীক্ষা করুন বা ANM-এর সাথে দেখা করুন।" },
      { title: "গর্ভাবস্থায় পুষ্টি", preview: "দুজনের জন্য — যত্নে", detail: "আয়রন, ফলিক অ্যাসিড, ক্যালসিয়াম ও প্রোটিন জরুরি। সরকারি IFA ট্যাবলেট নিন। কাঁচা পেঁপে, বেশি চা/কফি ও রাস্তার খাবার এড়ান।" },
      { title: "বিপদ লক্ষণ", preview: "অবিলম্বে ডাক্তার", detail: "তীব্র মাথাব্যথা, ঝাপসা দেখা, মুখ/হাত ফুলে যাওয়া, অতি রক্তপাত, তীব্র ব্যথা, শিশু নড়াচড়া বন্ধ — এগুলি জরুরি।" },
      { title: "প্রসবপূর্ব পরীক্ষা", preview: "ন্যূনতম দেখা", detail: "অন্তত ৪টি ANC দেখা — প্রথম ত্রৈমাসিক, ২৬ সপ্তাহ, ৩২ সপ্তাহ ও ৩৬ সপ্তাহ। মা-শিশু সুরক্ষা কার্ড সঙ্গে রাখুন।" },
      { title: "প্রসবের প্রস্তুতি", preview: "আগে থেকে পরিকল্পনা", detail: "নিকটতম স্বাস্থ্য কেন্দ্র চিহ্নিত করুন, ফোনে 108 সেভ করুন, কাগজপত্র প্রস্তুত রাখুন, মা ও শিশুর কাপড়ের ব্যাগ তৈরি রাখুন।" },
      { title: "প্রসব পরবর্তী যত্ন", preview: "সুস্থতা ও শিশু", detail: "বিশ্রাম নিন, গরম পুষ্টিকর খাবার খান, এক ঘন্টার মধ্যে স্তন্যপান করান, শিশুর প্রথম টিকা নিশ্চিত করুন, মানসিক বিষণ্ণতার দিকে নজর রাখুন।" },
    ],
    vaccine: [
      { title: "গুরুত্ব", preview: "টিকা জীবন বাঁচায়", detail: "টিকা শিশুদের পোলিও, হাম, ডিপথেরিয়া, হেপাটাইটিস ইত্যাদি থেকে রক্ষা করে। সরকারি কেন্দ্রে বিনামূল্যে ও নিরাপদ।" },
      { title: "সূচি", preview: "জন্ম থেকে ১৬ বছর", detail: "জন্মে: BCG, OPV, Hep B। ৬ সপ্তাহ থেকে: পেন্টা, রোটা, PCV। ৯ মাসে: MR। মা-শিশু কার্ড অনুসরণ করুন।" },
      { title: "মিস্ড টিকা", preview: "এখনও সময় আছে", detail: "নিকটতম ANM বা স্বাস্থ্য কেন্দ্রে যান। প্রায় সব টিকার জন্য ক্যাচ-আপ রয়েছে। ভয়ে এড়িয়ে যাবেন না।" },
      { title: "পার্শ্ব প্রতিক্রিয়া", preview: "কী স্বাভাবিক", detail: "১–২ দিন হালকা জ্বর, ফোলা বা খিটখিটে স্বাভাবিক। পরামর্শে প্যারাসিটামল দিন। তীব্র জ্বরে ডাক্তার দেখান।" },
      { title: "টিকার ভুল ধারণা", preview: "গুজবের বদলে সত্য", detail: "টিকা বন্ধ্যাত্ব বা অটিজম ঘটায় না। কঠোর পরীক্ষার পরই আসে এবং লক্ষ লক্ষ শিশুর জীবন বাঁচায়।" },
    ],
    emergency: [
      { title: "অ্যাম্বুলেন্স 108", preview: "বিনামূল্যে জাতীয় অ্যাম্বুলেন্স", detail: "যেকোনো জরুরিতে 108 ডায়াল করুন। শান্ত থাকুন, অবস্থান বলুন, রোগীকে আরামে রাখুন।" },
      { title: "স্বাস্থ্য হেল্পলাইন 104", preview: "বিনামূল্যে চিকিৎসা পরামর্শ", detail: "104 ডায়াল করে বিনামূল্যে স্বাস্থ্য তথ্য, ফোনে ডাক্তার পরামর্শ ও নিকটতম কেন্দ্রের তথ্য পান।" },
      { title: "মূর্ছা", preview: "প্রথম সাড়া", detail: "ব্যক্তিকে সমতলে শোয়ান, পা উঁচু করুন, পোশাক ঢিলা করুন, বাতাস দিন। এক মিনিটের বেশি অজ্ঞান থাকলে 108 ডাকুন।" },
      { title: "রক্তপাত জরুরি", preview: "রক্ত থামান", detail: "পরিষ্কার কাপড় দিয়ে চাপ দিন। আহত অংশ উঁচু রাখুন। আটকে থাকা বস্তু সরাবেন না। 108 ডাকুন।" },
      { title: "তীব্র ব্যথা জরুরি", preview: "বুক, পেট, মাথা", detail: "হঠাৎ তীব্র বুকে ব্যথা, পেটে ব্যথা বা সবচেয়ে তীব্র মাথাব্যথা — অবিলম্বে 108 ডাকুন। নিজে গাড়ি চালাবেন না।" },
    ],
  },
  registeredOn: "নিবন্ধনের তারিখ",
  profileDetails: "প্রোফাইল বিবরণ",
  mobile: "মোবাইল",
  dob: "জন্ম তারিখ",
  gender: "লিঙ্গ",
  language: "ভাষা",
  cannotEdit: "সম্পাদনা করা যাবে না",
  removeProfile: "এই প্রোফাইল মুছুন",
  removeConfirm: "এই ডিভাইস থেকে এই প্রোফাইল মুছবেন? এটি পূর্বাবস্থায় ফেরানো যাবে না।",
  myChats: "আমার চ্যাট",
  newChat: "নতুন চ্যাট",
  noChatsYet: "এখনও কোনও চ্যাট নেই। সঞ্জীবনীর সাথে নতুন আলাপ শুরু করুন।",
  viewAllChats: "সব চ্যাট দেখুন",
  deleteChat: "চ্যাট মুছুন",
};

const or: Dict = {
  ...en,
  appName: "ସଞ୍ଜୀବନୀ ସହେଲୀ AI",
  tagline: "ଆପଣଙ୍କ ବିଶ୍ୱାସର ସ୍ୱାସ୍ଥ୍ୟ ସାଥୀ",
  chooseLang: "ଆପଣଙ୍କ ଭାଷା ବାଛନ୍ତୁ",
  chooseLangSub: "ଯେଉଁ ଭାଷାରେ ସହଜ ଲାଗେ ସେଇଟି ବାଛନ୍ତୁ",
  changeLanguage: "ଭାଷା ବଦଳାନ୍ତୁ",
  continue: "ଆଗକୁ ବଢ଼ନ୍ତୁ",
  back: "ପଛକୁ",
  login: "ଲଗ୍ ଇନ୍",
  register: "ପଞ୍ଜିକରଣ",
  logout: "ଲଗ୍ ଆଉଟ୍",
  openApp: "ଆପ୍ ଖୋଲନ୍ତୁ",
  settings: "ସେଟିଂସ୍",
  switchProfile: "ପ୍ରୋଫାଇଲ୍ ବଦଳାନ୍ତୁ",
  addAnotherProfile: "ନୂଆ ପ୍ରୋଫାଇଲ୍ ଯୋଗ କରନ୍ତୁ",
  noProfilesYet: "ଏହି ଡିଭାଇସରେ ଏବେ କୌଣସି ପ୍ରୋଫାଇଲ୍ ନାହିଁ।",
  loginPickProfile: "ଆପଣଙ୍କ ପ୍ରୋଫାଇଲ୍ ବାଛନ୍ତୁ",
  loginEnterMobile: "ପ୍ରୋଫାଇଲ୍ ଦେଖିବାକୁ ମୋବାଇଲ୍ ନମ୍ବର ଦିଅନ୍ତୁ",
  loginNoMatch: "ଏହି ନମ୍ବର ପାଇଁ କୌଣସି ପ୍ରୋଫାଇଲ୍ ମିଳିଲା ନାହିଁ।",
  loginMobileFull: "ଏହି ନମ୍ବରରେ ପୂର୍ବରୁ ୩ଟି ପ୍ରୋଫାଇଲ୍ ଅଛି। ଗୋଟିଏ ବାଛନ୍ତୁ।",
  mobileQ: "ଆପଣଙ୍କ ମୋବାଇଲ୍ ନମ୍ବର",
  mobileP: "ଗୋଟିଏ ମୋବାଇଲ୍ ନମ୍ବରରେ ସର୍ବାଧିକ ୩ଟି ପ୍ରୋଫାଇଲ୍",
  mobilePlaceholder: "୧୦ ଅଙ୍କର ମୋବାଇଲ୍ ନମ୍ବର",
  mobileInvalid: "ଦୟାକରି ସଠିକ୍ ୧୦ ଅଙ୍କର ମୋବାଇଲ୍ ନମ୍ବର ଦିଅନ୍ତୁ।",
  mobileExistingCount: (n) => `ଏହି ନମ୍ବରରେ ପୂର୍ବରୁ ${n}ଟି ପ୍ରୋଫାଇଲ୍ ଅଛି।`,
  nameQ: "ଆପଣଙ୍କ ନାମ କଣ?",
  nameP: "ଆମେ ଆପଣଙ୍କୁ କିପରି ସମ୍ବୋଧନ କରିବୁ",
  namePlaceholder: "ଆପଣଙ୍କ ସମ୍ପୂର୍ଣ୍ଣ ନାମ ଲେଖନ୍ତୁ",
  nameError: "ଦୟାକରି ଅତି କମ୍ ୩ଟି ଅକ୍ଷର ଲେଖନ୍ତୁ।",
  dobQ: "ଆପଣଙ୍କ ଜନ୍ମ ତାରିଖ",
  dobP: "ଏହାକୁ ଆଧାର କରି ଆମେ ଆପଣଙ୍କ ସ୍ୱାସ୍ଥ୍ୟ ସୂଚନା ସଜାଇବୁ। ପରେ ବଦଳାଯିବ ନାହିଁ।",
  dobLocked: "ଜନ୍ମ ତାରିଖ ଥରେ ଦିଆଯାଏ, ବଦଳାଯିବ ନାହିଁ।",
  dobInvalid: "ଦୟାକରି ଏକ ସଠିକ୍ ଜନ୍ମ ତାରିଖ ବାଛନ୍ତୁ।",
  genderQ: "ଆପଣ ନିଜକୁ କିପରି ଚିହ୍ନଟ କରନ୍ତି?",
  genderP: "ଏହା ଥରେ ଦିଆଯାଏ, ପରେ ବଦଳାଯିବ ନାହିଁ।",
  genderLocked: "ଲିଙ୍ଗ ଥରେ ଦିଆଯାଏ, ବଦଳାଯିବ ନାହିଁ।",
  female: "ମହିଳା",
  male: "ପୁରୁଷ",
  other: "ଅନ୍ୟ / କହିବାକୁ ଚାହୁଁ ନାହିଁ",
  welcomeTitle: (name) => `ସ୍ୱାଗତ, ${name}!`,
  welcomeSub: "ମୁଁ ସଞ୍ଜୀବନୀ, ଆପଣଙ୍କ ବ୍ୟକ୍ତିଗତ ସ୍ୱାସ୍ଥ୍ୟ ସାଥୀ।",
  start: "ମୋ ସ୍ୱାସ୍ଥ୍ୟ ଯାତ୍ରା ଆରମ୍ଭ କରନ୍ତୁ",
  dashboardTitle: "ଆଜି ମୁଁ କିପରି ସାହାଯ୍ୟ କରିପାରେ?",
  dashboardSub: "ଏକ ବିଷୟ ବାଛନ୍ତୁ କିମ୍ବା ସଞ୍ଜୀବନୀଙ୍କ ସହ କଥା ହୁଅନ୍ତୁ",
  chatWithAI: "ସଞ୍ଜୀବନୀଙ୍କ ସହ କଥା",
  askAnything: "ସ୍ୱାସ୍ଥ୍ୟ ବିଷୟରେ କିଛି ବି ପଚାରନ୍ତୁ",
  emergencyHelp: "ଜରୁରୀକାଳୀନ",
  callAmbulance: "108 କଲ୍",
  callHealth: "104 ସ୍ୱାସ୍ଥ୍ୟ",
  callWomen: "181 ମହିଳା",
  chatPlaceholder: "ଆପଣଙ୍କ ପ୍ରଶ୍ନ ଲେଖନ୍ତୁ…",
  listening: "ଶୁଣୁଛି…",
  disclaimer: "ଏହି ଆପ୍ ସାଧାରଣ ସ୍ୱାସ୍ଥ୍ୟ ସୂଚନା ଦିଏ, ଡାକ୍ତରଙ୍କ ପରାମର୍ଶର ବିକଳ୍ପ ନୁହେଁ।",
  explore: "ବିଷୟ ଦେଖନ୍ତୁ",
  exploreCta: "ଦେଖନ୍ତୁ",
  backToTopics: "ବିଷୟକୁ ଫେରନ୍ତୁ",
  searchTopics: "ବିଷୟ ଖୋଜନ୍ତୁ…",
  noResults: "କିଛି ମିଳିଲା ନାହିଁ।",
  askSanjeevniAbout: "ଏ ବିଷୟରେ ସଞ୍ଜୀବନୀଙ୍କୁ ପଚାରନ୍ତୁ",
  copy: "କପି",
  copied: "କପି ହେଲା",
  listen: "ଶୁଣନ୍ତୁ",
  stop: "ବନ୍ଦ କରନ୍ତୁ",
  greeting: "ନମସ୍କାର,",
  registeredOn: "ପଞ୍ଜିକରଣ ତାରିଖ",
  profileDetails: "ପ୍ରୋଫାଇଲ୍ ବିବରଣୀ",
  mobile: "ମୋବାଇଲ୍",
  dob: "ଜନ୍ମ ତାରିଖ",
  gender: "ଲିଙ୍ଗ",
  language: "ଭାଷା",
  cannotEdit: "ବଦଳାଯିବ ନାହିଁ",
  removeProfile: "ଏହି ପ୍ରୋଫାଇଲ୍ ହଟାନ୍ତୁ",
  removeConfirm: "ଏହି ଡିଭାଇସରୁ ଏହି ପ୍ରୋଫାଇଲ୍ ହଟାଇବେ?",
  myChats: "ମୋର ବାର୍ତ୍ତାଳାପ",
  newChat: "ନୂଆ ବାର୍ତ୍ତାଳାପ",
  noChatsYet: "ଏବେ କୌଣସି ବାର୍ତ୍ତାଳାପ ନାହିଁ।",
  viewAllChats: "ସବୁ ବାର୍ତ୍ତାଳାପ ଦେଖନ୍ତୁ",
  deleteChat: "ବାର୍ତ୍ତାଳାପ ହଟାନ୍ତୁ",
};

export const t: Record<Lang, Dict> = { en, hi, bn, or, pa: en, gu: en, mr: en, ta: en, te: en };
export type { Dict };

