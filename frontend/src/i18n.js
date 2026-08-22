import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
  .use(initReactI18next)
  .init({
    lng: "en",
    fallbackLng: "en",
    interpolation: {
  escapeValue: false,
},

    resources: {
      en: {
        translation: {
          language: "Language",
          english: "English",
          hindi: "Hindi",
          marathi: "Marathi",
          gujarati: "Gujarati",

          back: "Back",
          settings: "Settings",
          notifications: "Notifications",
          logout: "Logout",

          profileSettings: "Profile & Settings",
          accountDetails: "Account details",
          fullName: "Full name",
          phoneNumber: "Phone number",
          aadhaarUsername: "Aadhaar (username)",
          aadhaarDescription:
            "Aadhaar cannot be changed. It is your permanent identifier.",
          saveChanges: "Save changes",
          session: "Session",
          signOutDescription:
            "Sign out of your Vardaan+ account on this device.",
          dangerZone: "Danger zone",
          deleteAccount: "Delete my account",
          accessCode: "Access code",
          deleteAccountDescription:
            "Delete your account permanently. If a child is linked to you and another parent, that child will remain accessible to the other parent.",

          doctorDashboard: {
            signedInAs: "Signed in as",
            searchByAadhaar: "Search a child or parent by Aadhaar",
            aadhaarPlaceholder: "Enter 12-digit Aadhaar number",
            search: "Search",
            autoDetectInfo:
              "Auto-detects parent or child. In this build, access is granted immediately after search.",
            linkedChildren: "Linked children",
            noChildren: "No children linked to this parent yet.",
            child: "Child",
            invalidAadhaar: "Enter a 12-digit Aadhaar",
            noRecordFound: "No record found",
            parent: "Parent",
          },

          gender: {
            male: "Male",
            female: "Female",
            other: "Other",
          },

          doctorSettings: {
            invalidPhone: "Invalid phone number",
            nothingToUpdate: "Nothing to update",
            profileUpdated: "Profile updated",
            updateFailed: "Update failed",
            accountDeleted: "Account deleted",
            deleteFailed: "Delete failed",
            typeExactly: "Type exactly: {{phrase}}",
            loading: "Loading…",
            doctorName: "Doctor name",
            doctorNamePlaceholder: "e.g. Anjali Verma",
            doctorNameDescription:
              'Just your name — the "Dr." title is shown automatically.',
            clinicName: "Clinic / hospital name",
            clinicAddress: "Clinic address",
            dangerDescription:
              "Delete your doctor account permanently. Vaccination records you have already recorded will remain in the children's medical history — this preserves lifelong records for their families.",
            deleteAccountQuestion: "Delete your account?",
            deleteAccountWarning:
              "This will permanently remove your Vardaan+ doctor account. You will no longer be able to search patients or record vaccinations.",
            vaccinationsRemain:
              "Any vaccinations you have already recorded remain in each child's medical history so their family keeps a complete record.",
            cannotUndo: "This action cannot be undone.",
            cancel: "Cancel",
            understandContinue: "I understand, continue",
            finalConfirmation: "Final confirmation",
            typePhraseExactly: "To confirm, type this phrase exactly:",
            phrasePlaceholder: "Type the phrase above",
            deletePermanently: "Delete permanently",
          },

          parentNotifications: {
  title: "Notifications",
  description: "Vaccination updates for your children.",
  noNotifications: "No notifications yet.",
},

          editChild: {
  title: "Edit child",
  description: "Update {{name}}'s details.",
  childName: "Child's name",
  dateOfBirth: "Date of birth",
  gender: "Gender",
  currentWeight: "Current weight (kg)",
  weightPlaceholder: "e.g. 3.2",
  saveChanges: "Save changes",

  deleteChild: "Delete child",
  deleteDescription:
    "Permanently remove {{name}}'s profile and all related child data.",
  deleteButton: "Delete {{name}}",
  deleteQuestion: "Delete {{name}}?",
  deleteWarning:
    "This will permanently delete {{name}}'s profile, vaccination records, and notifications. This cannot be undone, and all child data will be lost.",
  cancel: "Cancel",
  confirmDelete: "Confirm delete",

  childNotFound: "Child not found.",
  validationName: "Name cannot be empty",
  validationDob: "Date of birth required",
  validationGender: "Gender required",
  validationWeight: "Enter a valid weight in kg",
  childUpdated: "Child updated",
  updateFailed: "Update failed",
  childDeleted: "{{name}} deleted",
  deleteFailed: "Delete failed",
},

          parentRegister: {
  title: "Create Parent Account",
  description:
    "Your Aadhaar acts as your username. Only you and your co-parent will see your children's records.",
  backToLogin: "Back to login",
  fullName: "Full name",
  fullNamePlaceholder: "e.g. Priya Sharma",
  aadhaar: "Aadhaar (12 digits)",
  aadhaarPlaceholder: "XXXX XXXX XXXX",
  phone: "Phone",
  phonePlaceholder: "10-digit phone",
  password: "Password",
  passwordPlaceholder: "Min 6 chars",
  confirmPassword: "Confirm",
  confirmPlaceholder: "Repeat",
  createAccount: "Create account",
  alreadyHaveAccount: "Already have an account?",
  signIn: "Sign in",
  validationName: "Enter your full name",
  validationAadhaar: "Aadhaar must be 12 digits",
  validationPhone: "Enter a valid phone number",
  validationPassword:
    "Password must be at least 6 characters",
  validationConfirm: "Passwords do not match",
  accountCreated:
    "Account created. Share this access code with doctors: {{code}}",
  registrationFailed: "Registration failed",
},

          childProfile: {
  childNotFound: "Child not found.",
  pdfGenerationFailed: "Failed to generate PDF. Please try again.",
  generating: "Generating...",
  exportPdf: "Export PDF",
  editChild: "Edit child",
  born: "Born",
  complete: "complete",
  vaccinationTimeline: "Vaccination timeline",
  timelineDescription:
    "Every dose your child needs, from birth to 16 years.",
  recordSaved: "Record saved",
  addVaccinationRecord: "Add Vaccination Record",
  dateTaken: "Date taken",
  doctorName: "Doctor name",
  doctorNamePlaceholder: "Enter doctor's name",
  weightAtThatTime: "Weight at that time",
  optional: "optional",
  weightPlaceholder: "Weight in kg",
  vaccinationDocument: "Vaccination document",
  dateAndDoctorRequired:
    "Please enter the date taken and doctor's name.",
  addVaccination: "Add Vaccination",
  givenOn: "Given on {{date}}",
  dueOn: "Due {{date}}",
  doctorPrefix: "Dr.",
  maxDocumentsAlert:
    "You can upload maximum {{count}} documents per vaccine",
  deleteDocumentConfirm:
    "Are you sure you want to delete this document?",
  deleteDocumentFailed:
    "Failed to delete document. Please try again.",
  addVaccineAria: "Add {{name}} vaccination record",
  uploadDocumentTitle:
    "Upload document ({{count}}/{{max}})",
  viewDocumentsTitle:
    "View documents ({{count}}/{{max}})",
  maximumDocumentsReached:
    "Maximum {{count}} documents reached",
  uploadVaccineDocument: "Upload vaccine document",
  uipSource: "Source: India's Universal Immunization Programme (UIP)",
official: "Official",
uipSchedule: "UIP Schedule · Govt. of India",
  viewVaccinationDocuments:
    "View vaccination documents",
  documentsLimitReached:
    "Maximum documents limit reached",
    timelineDisclaimer:
  "This vaccination timeline follows the national schedule set by India's Ministry of Health & Family Welfare — the same schedule used in government hospitals and primary health centres across the country.",

  status: {
    completed: "Completed",
    due: "Due",
    overdue: "Overdue",
    upcoming: "Upcoming",
  },
},

          addChild: {
  title: "Add Child",
  description:
    "This child will be linked to both parents automatically using Aadhaar.",
  childName: "Child's name",
  childNamePlaceholder: "Full name",
  dateOfBirth: "Date of birth",
  gender: "Gender",
  select: "Select",
  currentWeight: "Current weight (kg)",
  weightPlaceholder: "e.g. 3.2",
  youAreThe: "You are the",
  mother: "Mother",
  father: "Father",
  otherParentAadhaar: "Other parent's Aadhaar (optional)",
  otherParentAadhaarPlaceholder:
    "12 digits — auto-links this child to them",
  childAadhaar: "Child Aadhaar (optional)",
  childAadhaarPlaceholder:
    "12 digits — for lifelong lookup",
  submit: "Add child",
  validationName: "Enter child's name",
  validationDob: "Select date of birth",
  validationGender: "Select gender",
  validationWeight: "Enter a valid weight in kg",
  validationOtherParentAadhaar:
    "Other parent's Aadhaar must be 12 digits",
  validationChildAadhaar:
    "Child Aadhaar must be 12 digits",
  childAdded: "{{name}} added",
  couldNotAdd: "Could not add child",
},

          parentLogin: {
  title: "Parent Login",
  description:
    "Sign in with your Aadhaar to access your children's records.",
  backToRoleSelection: "Back to role selection",
  aadhaarNumber: "Aadhaar number",
  aadhaarPlaceholder: "12-digit Aadhaar",
  password: "Password",
  passwordPlaceholder: "Enter your password",
  signIn: "Sign in",
  createAccount: "Create parent account",
  aadhaarValidation: "Aadhaar must be 12 digits",
  welcome: "Welcome, {{name}}",
  loginFailed: "Login failed",
  panelTitle:
    "A lifelong vaccination record — always in your pocket.",
  panelDescription:
    "Your child's history, from BCG at birth to boosters at 16 — kept safe, searchable, and shareable with any doctor.",
  childIllustrationAlt: "Child with teddy",
},

          selectRole: {
  securityMessage: "Secured with password-based auth",
  title: "Who are you signing in as?",
  description:
    "Choose your role to continue. Parents manage children and view vaccination history. Doctors update records after searching an Aadhaar.",
  parentTitle: "Continue as Parent",
  parentDescription:
    "Register your children, follow the UIP schedule, and access a lifelong vaccination record.",
  doctorTitle: "Continue as Doctor",
  doctorDescription:
    "Search a child by Aadhaar, view due vaccines, and record vaccinations in seconds.",
  getStarted: "Get started",
  internetRequired: "Medical records require an internet connection.",
},

          doctorLogin: {
  title: "Doctor Login",
  description: "Sign in to access patient records.",
  desktopDescription:
    "Sign in with your credentials to access patient vaccination records.",
  phoneNumber: "Phone number",
  phonePlaceholder: "Registered phone",
  password: "Password",
  passwordPlaceholder: "Enter your password",
  signIn: "Sign in",
  createAccount: "Create doctor account",
  backToRoleSelection: "Back to role selection",
  welcome: "Welcome, Dr. {{name}}",
  loginFailed: "Login failed",
  panelTitle: "A lifelong vaccination record — always in your pocket.",
  panelDescription:
  "Search by Aadhaar. See what's due. Tap to record. Every parent gets an instant notification.",
  doctorIllustrationAlt: "Doctor illustration",
},

          vaccineInfo: {
  givenOn: "Given on {{date}}",
  dueOn: "Due on {{date}}",
  fullForm: "Full form",
  protectsAgainst: "Protects against",
  whatItDoes: "What it does",
  whyChildNeedsIt: "Why your child needs it",
  goodToKnow: "Good to know",
  informationUnavailable: "Detailed information for this vaccine is not available yet.",
  recordedBy: "Recorded by",
  weightAtVisit: "Weight at visit",
  source: "Source",
  medicalAdvice:
    "India's Universal Immunization Programme (UIP) — Ministry of Health & Family Welfare, Government of India. Always consult your paediatrician for medical advice.",
},

doctorRegister: {
  title: "Create Doctor Account",
  description: "Self-registration. No approval needed.",
  backToLogin: "Back to login",
  doctorName: "Doctor name",
  doctorNamePlaceholder: "e.g. Anjali Verma",
  doctorNameDescription:
    'Just your name — the "Dr." title is added automatically.',
  phone: "Phone",
  password: "Password",
  clinicName: "Clinic / hospital name",
  clinicNamePlaceholder: "e.g. Sunrise Children's Clinic",
  clinicAddress: "Clinic address",
  clinicAddressPlaceholder: "Street, city, state",
  createAccount: "Create account",
  alreadyRegistered: "Already registered?",
  signIn: "Sign in",
  enterName: "Enter your name",
  validPhone: "Enter a valid phone",
  passwordLength: "Password must be at least 6 characters",
  clinicRequired: "Clinic info required",
  accountCreated: "Account created",
  registrationFailed: "Registration failed",
  doctorIllustrationAlt: "Doctor illustration",
},

parentDashboard: {
  welcomeBack: "Welcome back",
  aadhaar: "Aadhaar",
  addChild: "Add Child",
  yourAccessCode: "Your access code",
  accessCodeDescription:
    "Share this six-digit code with doctors when they need to update your child’s vaccine record.",
  myChildren: "My Children",
  addYourFirstChild: "Add your first child",
  firstChildDescription:
    "Start their vaccination record. We'll auto-generate India's UIP schedule based on their date of birth.",
  vaccinationProgress: "Vaccination progress",
  born: "Born",
  hi: "Hi, {{name}}",
  languageDescription: "Choose your preferred language",
},

          doctorChildRecord: {
  mother: "mother",
  father: "father",
  motherOrFather: "mother or father",
  linked: "the linked",
  enterSixDigitCode: "Enter the 6-digit parent access code",
  accessVerified: "Access code verified",
  invalidAccessCode: "Invalid access code",
  verifyAccessFirst: "Verify the parent access code first",
  selectOneVaccine: "Select at least one vaccine",
  enterCurrentWeight: "Enter the child's current weight in kg",
  couldNotSave: "Could not save",
  childNotFound: "Child not found.",
  backToSearch: "Back to search",
  parentAccessRequired: "Parent access required",
  enterCodeSharedBy: "Enter the six-digit code shared by {{person}} before you can record vaccinations for {{child}}.",
  sixDigitCodePlaceholder: "Enter 6-digit code",
  verifying: "Verifying…",
  verifyAccess: "Verify access",
  dob: "DOB",
  complete: "complete",
  completed: "Completed",
  dueOverdue: "Due / Overdue",
  upcoming: "Upcoming",
  dueOverdueTab: "Due & Overdue",
  historyTab: "History",
  allTab: "All",
  dueDescription: "Select the vaccines you're administering today. Parents will be notified instantly. Tap the info icon on any card to see vaccine details.",
  noDueVaccines: "No due or overdue vaccines. Great work!",
  historyDescription: "Past vaccinations already recorded for {{child}}.",
  noVaccinations: "No vaccinations recorded yet.",
  allDescription: "Complete UIP schedule — completed, due, overdue, and upcoming.",
  noSchedule: "No schedule.",
  vaccinesSelected_one: "{{count}} vaccine selected",
  vaccinesSelected_other: "{{count}} vaccines selected",
  parentsNotified: "Parents will be notified instantly.",
  weightNow: "Weight now",
  weightPlaceholder: "e.g. 4.5",
  recording: "Recording…",
  record: "Record",
  recorded: "Recorded",
  vaccinesSaved_one: "{{count}} vaccine saved to {{child}}'s record.",
  vaccinesSaved_other: "{{count}} vaccines saved to {{child}}'s record.",
  done: "Done",
  givenDate: "Given {{date}}",
  dueDate: "Due {{date}}",
  documentsUploaded: "{{count}} document(s) uploaded",
  viewDocuments: "View {{count}} vaccination document(s)",
  viewVaccineInfo: "View info about {{name}}",

  status: {
    completed: "Completed",
    due: "Due",
    overdue: "Overdue",
    upcoming: "Upcoming",
  },
},
        },
      },

      hi: {
        translation: {
          language: "भाषा",
          english: "अंग्रेज़ी",
          hindi: "हिन्दी",
          marathi: "मराठी",
          gujarati: "गुजराती",

          back: "वापस",
          settings: "सेटिंग्स",
          notifications: "सूचनाएं",
          logout: "लॉग आउट",

          profileSettings: "प्रोफ़ाइल और सेटिंग्स",
          accountDetails: "खाता विवरण",
          fullName: "पूरा नाम",
          phoneNumber: "फ़ोन नंबर",
          aadhaarUsername: "आधार (उपयोगकर्ता नाम)",
          aadhaarDescription:
            "आधार बदला नहीं जा सकता। यह आपकी स्थायी पहचान है।",
          saveChanges: "परिवर्तन सहेजें",
          session: "सत्र",
          signOutDescription:
            "इस डिवाइस पर अपने Vardaan+ खाते से साइन आउट करें।",
          dangerZone: "खतरनाक क्षेत्र",
          deleteAccount: "मेरा खाता हटाएं",
          accessCode: "एक्सेस कोड",
          deleteAccountDescription:
            "अपना खाता स्थायी रूप से हटाएं। यदि कोई बच्चा दूसरे माता-पिता से जुड़ा है, तो वह उस माता-पिता के खाते से उपलब्ध रहेगा।",

          doctorDashboard: {
            signedInAs: "इस रूप में साइन इन हैं",
            searchByAadhaar: "आधार से बच्चे या माता-पिता को खोजें",
            aadhaarPlaceholder: "12 अंकों का आधार नंबर दर्ज करें",
            search: "खोजें",
            autoDetectInfo:
              "माता-पिता या बच्चे का स्वतः पता लगाया जाता है। इस संस्करण में खोज के तुरंत बाद पहुंच प्रदान की जाती है।",
            linkedChildren: "जुड़े हुए बच्चे",
            noChildren: "इस माता-पिता से अभी तक कोई बच्चा जुड़ा नहीं है।",
            child: "बच्चा",
            invalidAadhaar: "12 अंकों का आधार दर्ज करें",
            noRecordFound: "कोई रिकॉर्ड नहीं मिला",
            parent: "माता-पिता",
          },

          parentNotifications: {
  title: "सूचनाएं",
  description: "आपके बच्चों के टीकाकरण से संबंधित अपडेट।",
  noNotifications: "अभी तक कोई सूचना नहीं है।",
},

          editChild: {
  title: "बच्चे की जानकारी संपादित करें",
  description: "{{name}} की जानकारी अपडेट करें।",
  childName: "बच्चे का नाम",
  dateOfBirth: "जन्म तिथि",
  gender: "लिंग",
  currentWeight: "वर्तमान वजन (किग्रा)",
  weightPlaceholder: "जैसे 3.2",
  saveChanges: "परिवर्तन सहेजें",

  deleteChild: "बच्चे को हटाएं",
  deleteDescription:
    "{{name}} की प्रोफ़ाइल और बच्चे से संबंधित सभी डेटा स्थायी रूप से हटाएं।",
  deleteButton: "{{name}} को हटाएं",
  deleteQuestion: "{{name}} को हटाएं?",
  deleteWarning:
    "इससे {{name}} की प्रोफ़ाइल, टीकाकरण रिकॉर्ड और सूचनाएं स्थायी रूप से हटा दी जाएंगी। इसे पूर्ववत नहीं किया जा सकता और बच्चे का सारा डेटा खो जाएगा।",
  cancel: "रद्द करें",
  confirmDelete: "हटाने की पुष्टि करें",

  childNotFound: "बच्चा नहीं मिला।",
  validationName: "नाम खाली नहीं हो सकता",
  validationDob: "जन्म तिथि आवश्यक है",
  validationGender: "लिंग आवश्यक है",
  validationWeight: "किलोग्राम में मान्य वजन दर्ज करें",
  childUpdated: "बच्चे की जानकारी अपडेट हो गई",
  updateFailed: "अपडेट विफल हुआ",
  childDeleted: "{{name}} हटा दिया गया",
  deleteFailed: "हटाना विफल हुआ",
},

          parentRegister: {
  title: "माता-पिता का खाता बनाएं",
  description:
    "आपका आधार आपके उपयोगकर्ता नाम के रूप में काम करेगा। केवल आप और आपके सह-माता-पिता आपके बच्चों के रिकॉर्ड देख पाएंगे।",
  backToLogin: "लॉगिन पर वापस जाएं",
  fullName: "पूरा नाम",
  fullNamePlaceholder: "जैसे, प्रिया शर्मा",
  aadhaar: "आधार (12 अंक)",
  aadhaarPlaceholder: "XXXX XXXX XXXX",
  phone: "फ़ोन",
  phonePlaceholder: "10 अंकों का फ़ोन",
  password: "पासवर्ड",
  passwordPlaceholder: "कम से कम 6 अक्षर",
  confirmPassword: "पुष्टि करें",
  confirmPlaceholder: "दोबारा दर्ज करें",
  createAccount: "खाता बनाएं",
  alreadyHaveAccount: "क्या आपके पास पहले से खाता है?",
  signIn: "साइन इन करें",
  validationName: "अपना पूरा नाम दर्ज करें",
  validationAadhaar: "आधार 12 अंकों का होना चाहिए",
  validationPhone: "मान्य फ़ोन नंबर दर्ज करें",
  validationPassword:
    "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए",
  validationConfirm: "पासवर्ड मेल नहीं खाते",
  accountCreated:
    "खाता बन गया। यह एक्सेस कोड डॉक्टरों के साथ साझा करें: {{code}}",
  registrationFailed: "पंजीकरण विफल हुआ",
},

          childProfile: {
  childNotFound: "बच्चा नहीं मिला।",
  pdfGenerationFailed: "PDF बनाने में विफल। कृपया फिर से प्रयास करें।",
  generating: "बनाया जा रहा है...",
  exportPdf: "PDF निर्यात करें",
  editChild: "बच्चे की जानकारी संपादित करें",
  born: "जन्म",
  complete: "पूर्ण",
  vaccinationTimeline: "टीकाकरण समयरेखा",
  timelineDescription:
    "जन्म से 16 वर्ष की आयु तक आपके बच्चे को आवश्यक हर टीका।",
  recordSaved: "रिकॉर्ड सहेजा गया",
  addVaccinationRecord: "टीकाकरण रिकॉर्ड जोड़ें",
  dateTaken: "टीका लगाए जाने की तारीख",
  doctorName: "डॉक्टर का नाम",
  doctorNamePlaceholder: "डॉक्टर का नाम दर्ज करें",
  weightAtThatTime: "उस समय का वजन",
  optional: "वैकल्पिक",
  weightPlaceholder: "किलोग्राम में वजन",
  vaccinationDocument: "टीकाकरण दस्तावेज़",
  dateAndDoctorRequired:
    "कृपया टीका लगाए जाने की तारीख और डॉक्टर का नाम दर्ज करें।",
  addVaccination: "टीकाकरण जोड़ें",
  givenOn: "{{date}} को दिया गया",
  dueOn: "{{date}} को देय",
  doctorPrefix: "डॉ.",
  maxDocumentsAlert:
    "आप प्रति टीके अधिकतम {{count}} दस्तावेज़ अपलोड कर सकते हैं",
  deleteDocumentConfirm:
    "क्या आप वाकई इस दस्तावेज़ को हटाना चाहते हैं?",
  deleteDocumentFailed:
    "दस्तावेज़ हटाने में विफल। कृपया फिर से प्रयास करें।",
  addVaccineAria: "{{name}} का टीकाकरण रिकॉर्ड जोड़ें",
  uploadDocumentTitle:
    "दस्तावेज़ अपलोड करें ({{count}}/{{max}})",
  viewDocumentsTitle:
    "दस्तावेज़ देखें ({{count}}/{{max}})",
  maximumDocumentsReached:
    "अधिकतम {{count}} दस्तावेज़ की सीमा पूरी हो गई",
  uploadVaccineDocument: "टीका दस्तावेज़ अपलोड करें",
  uipSource: "स्रोत: भारत का सार्वभौमिक टीकाकरण कार्यक्रम (UIP)",
official: "आधिकारिक",
uipSchedule: "UIP शेड्यूल · भारत सरकार",
  viewVaccinationDocuments:
    "टीकाकरण दस्तावेज़ देखें",
  documentsLimitReached:
    "दस्तावेज़ों की अधिकतम सीमा पूरी हो गई",
    timelineDisclaimer:
  "यह टीकाकरण समयरेखा भारत के स्वास्थ्य एवं परिवार कल्याण मंत्रालय द्वारा निर्धारित राष्ट्रीय टीकाकरण कार्यक्रम का पालन करती है — यही कार्यक्रम देश भर के सरकारी अस्पतालों और प्राथमिक स्वास्थ्य केंद्रों में उपयोग किया जाता है।",

  status: {
    completed: "पूर्ण",
    due: "देय",
    overdue: "अतिदेय",
    upcoming: "आगामी",
  },
},

          parentLogin: {
  title: "माता-पिता लॉगिन",
  description:
    "अपने बच्चों के रिकॉर्ड देखने के लिए आधार से साइन इन करें।",
  backToRoleSelection: "भूमिका चयन पर वापस जाएं",
  aadhaarNumber: "आधार नंबर",
  aadhaarPlaceholder: "12 अंकों का आधार",
  password: "पासवर्ड",
  passwordPlaceholder: "अपना पासवर्ड दर्ज करें",
  signIn: "साइन इन करें",
  createAccount: "माता-पिता का खाता बनाएं",
  aadhaarValidation: "आधार 12 अंकों का होना चाहिए",
  welcome: "स्वागत है, {{name}}",
  loginFailed: "लॉगिन विफल हुआ",
  panelTitle:
    "आजीवन टीकाकरण रिकॉर्ड — हमेशा आपकी जेब में।",
  panelDescription:
    "आपके बच्चे का इतिहास, जन्म के समय BCG से लेकर 16 साल की उम्र के बूस्टर तक — सुरक्षित, खोजने योग्य और किसी भी डॉक्टर के साथ साझा करने योग्य।",
  childIllustrationAlt: "टेडी के साथ बच्चा",
},

addChild: {
  title: "बच्चा जोड़ें",
  description:
    "यह बच्चा आधार के माध्यम से अपने आप दोनों माता-पिता से जुड़ जाएगा।",
  childName: "बच्चे का नाम",
  childNamePlaceholder: "पूरा नाम",
  dateOfBirth: "जन्म तिथि",
  gender: "लिंग",
  select: "चुनें",
  currentWeight: "वर्तमान वजन (किग्रा)",
  weightPlaceholder: "जैसे 3.2",
  youAreThe: "आप हैं",
  mother: "माता",
  father: "पिता",
  otherParentAadhaar: "दूसरे माता-पिता का आधार (वैकल्पिक)",
  otherParentAadhaarPlaceholder:
    "12 अंक — बच्चे को उनसे अपने आप लिंक करेगा",
  childAadhaar: "बच्चे का आधार (वैकल्पिक)",
  childAadhaarPlaceholder:
    "12 अंक — आजीवन खोज के लिए",
  submit: "बच्चा जोड़ें",
  validationName: "बच्चे का नाम दर्ज करें",
  validationDob: "जन्म तिथि चुनें",
  validationGender: "लिंग चुनें",
  validationWeight: "किलोग्राम में मान्य वजन दर्ज करें",
  validationOtherParentAadhaar:
    "दूसरे माता-पिता का आधार 12 अंकों का होना चाहिए",
  validationChildAadhaar:
    "बच्चे का आधार 12 अंकों का होना चाहिए",
  childAdded: "{{name}} जोड़ा गया",
  couldNotAdd: "बच्चे को जोड़ा नहीं जा सका",
},

parentDashboard: {
  welcomeBack: "वापसी पर स्वागत है",
  aadhaar: "आधार",
  addChild: "बच्चा जोड़ें",
  yourAccessCode: "आपका एक्सेस कोड",
  accessCodeDescription:
    "जब डॉक्टर को आपके बच्चे का टीकाकरण रिकॉर्ड अपडेट करना हो, तो यह छह अंकों का कोड उनके साथ साझा करें।",
  myChildren: "मेरे बच्चे",
  addYourFirstChild: "अपना पहला बच्चा जोड़ें",
  firstChildDescription:
    "उनका टीकाकरण रिकॉर्ड शुरू करें। हम उनकी जन्म तिथि के आधार पर भारत का UIP शेड्यूल अपने आप तैयार करेंगे।",
  vaccinationProgress: "टीकाकरण की प्रगति",
  born: "जन्म",
  hi: "नमस्ते, {{name}}",
  languageDescription: "अपनी पसंदीदा भाषा चुनें",
},

          vaccineInfo: {
  givenOn: "{{date}} को दिया गया",
  dueOn: "{{date}} को देय",
  fullForm: "पूरा नाम",
  protectsAgainst: "इनसे सुरक्षा",
  whatItDoes: "यह क्या करता है",
  whyChildNeedsIt: "आपके बच्चे को इसकी आवश्यकता क्यों है",
  goodToKnow: "जानने योग्य बातें",
  informationUnavailable: "इस टीके की विस्तृत जानकारी अभी उपलब्ध नहीं है।",
  recordedBy: "दर्ज करने वाले",
  weightAtVisit: "भेंट के समय वजन",
  source: "स्रोत",
  medicalAdvice:
    "भारत का सार्वभौमिक टीकाकरण कार्यक्रम (UIP) — स्वास्थ्य एवं परिवार कल्याण मंत्रालय, भारत सरकार। चिकित्सकीय सलाह के लिए हमेशा अपने बाल रोग विशेषज्ञ से परामर्श करें।",
},

selectRole: {
  securityMessage: "पासवर्ड-आधारित प्रमाणीकरण से सुरक्षित",
  title: "आप किस रूप में साइन इन कर रहे हैं?",
  description:
    "जारी रखने के लिए अपनी भूमिका चुनें। माता-पिता बच्चों का प्रबंधन और टीकाकरण इतिहास देखते हैं। डॉक्टर आधार खोजने के बाद रिकॉर्ड अपडेट करते हैं।",
  parentTitle: "माता-पिता के रूप में जारी रखें",
  parentDescription:
    "अपने बच्चों को पंजीकृत करें, UIP शेड्यूल का पालन करें और आजीवन टीकाकरण रिकॉर्ड देखें।",
  doctorTitle: "डॉक्टर के रूप में जारी रखें",
  doctorDescription:
    "आधार से बच्चे को खोजें, देय टीके देखें और कुछ ही सेकंड में टीकाकरण दर्ज करें।",
  getStarted: "शुरू करें",
  internetRequired: "मेडिकल रिकॉर्ड के लिए इंटरनेट कनेक्शन आवश्यक है।",
},

          gender: {
            male: "पुरुष",
            female: "महिला",
            other: "अन्य",
          },

          doctorSettings: {
            invalidPhone: "अमान्य फ़ोन नंबर",
            nothingToUpdate: "अपडेट करने के लिए कुछ नहीं है",
            profileUpdated: "प्रोफ़ाइल अपडेट हो गई",
            updateFailed: "अपडेट विफल हुआ",
            accountDeleted: "खाता हटा दिया गया",
            deleteFailed: "खाता हटाना विफल हुआ",
            typeExactly: "ठीक यही लिखें: {{phrase}}",
            loading: "लोड हो रहा है…",
            doctorName: "डॉक्टर का नाम",
            doctorNamePlaceholder: "जैसे, अंजलि वर्मा",
            doctorNameDescription:
              'केवल अपना नाम लिखें — "Dr." उपाधि अपने आप दिखाई जाएगी।',
            clinicName: "क्लिनिक / अस्पताल का नाम",
            clinicAddress: "क्लिनिक का पता",
            dangerDescription:
              "अपने डॉक्टर खाते को स्थायी रूप से हटाएं। आपके द्वारा पहले दर्ज किए गए टीकाकरण रिकॉर्ड बच्चों के मेडिकल इतिहास में बने रहेंगे — इससे उनके परिवारों के लिए आजीवन रिकॉर्ड सुरक्षित रहता है।",
            deleteAccountQuestion: "क्या आप अपना खाता हटाना चाहते हैं?",
            deleteAccountWarning:
              "इससे आपका Vardaan+ डॉक्टर खाता स्थायी रूप से हटा दिया जाएगा। आप मरीजों को खोज या टीकाकरण रिकॉर्ड नहीं कर पाएंगे।",
            vaccinationsRemain:
              "आपके द्वारा पहले दर्ज किए गए सभी टीकाकरण प्रत्येक बच्चे के मेडिकल इतिहास में बने रहेंगे ताकि उनके परिवार के पास पूरा रिकॉर्ड रहे।",
            cannotUndo: "यह कार्रवाई पूर्ववत नहीं की जा सकती।",
            cancel: "रद्द करें",
            understandContinue: "मैं समझता/समझती हूँ, जारी रखें",
            finalConfirmation: "अंतिम पुष्टि",
            typePhraseExactly: "पुष्टि करने के लिए यह वाक्य ठीक इसी तरह लिखें:",
            phrasePlaceholder: "ऊपर दिया गया वाक्य लिखें",
            deletePermanently: "स्थायी रूप से हटाएं",
          },

          doctorRegister: {
  title: "डॉक्टर खाता बनाएं",
  description: "स्व-पंजीकरण। किसी अनुमोदन की आवश्यकता नहीं है।",
  backToLogin: "लॉगिन पर वापस जाएं",
  doctorName: "डॉक्टर का नाम",
  doctorNamePlaceholder: "जैसे, अंजलि वर्मा",
  doctorNameDescription:
    'केवल अपना नाम लिखें — "Dr." उपाधि अपने आप जोड़ी जाएगी।',
  phone: "फ़ोन",
  password: "पासवर्ड",
  clinicName: "क्लिनिक / अस्पताल का नाम",
  clinicNamePlaceholder: "जैसे, सनराइज़ चिल्ड्रन्स क्लिनिक",
  clinicAddress: "क्लिनिक का पता",
  clinicAddressPlaceholder: "गली, शहर, राज्य",
  createAccount: "खाता बनाएं",
  alreadyRegistered: "पहले से पंजीकृत हैं?",
  signIn: "साइन इन करें",
  enterName: "अपना नाम दर्ज करें",
  validPhone: "मान्य फ़ोन नंबर दर्ज करें",
  passwordLength: "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए",
  clinicRequired: "क्लिनिक की जानकारी आवश्यक है",
  accountCreated: "खाता बन गया",
  registrationFailed: "पंजीकरण विफल हुआ",
  doctorIllustrationAlt: "डॉक्टर का चित्र",
},

          doctorLogin: {
  title: "डॉक्टर लॉगिन",
  description: "मरीजों के रिकॉर्ड देखने के लिए साइन इन करें।",
  desktopDescription:
    "मरीजों के टीकाकरण रिकॉर्ड देखने के लिए अपने क्रेडेंशियल से साइन इन करें।",
  phoneNumber: "फ़ोन नंबर",
  phonePlaceholder: "पंजीकृत फ़ोन नंबर",
  password: "पासवर्ड",
  passwordPlaceholder: "अपना पासवर्ड दर्ज करें",
  signIn: "साइन इन करें",
  createAccount: "डॉक्टर खाता बनाएं",
  backToRoleSelection: "भूमिका चयन पर वापस जाएं",
  welcome: "स्वागत है, डॉ. {{name}}",
  loginFailed: "लॉगिन विफल हुआ",
  panelTitle: "आजीवन टीकाकरण रिकॉर्ड — हमेशा आपकी जेब में।",
  panelDescription:
  "आधार से खोजें। देखें कि कौन सा टीका देय है। रिकॉर्ड करने के लिए टैप करें। हर माता-पिता को तुरंत सूचना मिलती है।",
  doctorIllustrationAlt: "डॉक्टर का चित्र",
},

          doctorChildRecord: {
  mother: "माता",
  father: "पिता",
  motherOrFather: "माता या पिता",
  linked: "जुड़े हुए",
  enterSixDigitCode: "6 अंकों का अभिभावक एक्सेस कोड दर्ज करें",
  accessVerified: "एक्सेस कोड सत्यापित हो गया",
  invalidAccessCode: "अमान्य एक्सेस कोड",
  verifyAccessFirst: "पहले अभिभावक एक्सेस कोड सत्यापित करें",
  selectOneVaccine: "कम से कम एक टीका चुनें",
  enterCurrentWeight: "बच्चे का वर्तमान वजन किलोग्राम में दर्ज करें",
  couldNotSave: "सहेजा नहीं जा सका",
  childNotFound: "बच्चा नहीं मिला।",
  backToSearch: "खोज पर वापस जाएं",
  parentAccessRequired: "अभिभावक की अनुमति आवश्यक है",
  enterCodeSharedBy:
    "{{person}} द्वारा साझा किया गया छह अंकों का कोड दर्ज करें। इसके बाद ही आप {{child}} के लिए टीकाकरण दर्ज कर सकते हैं।",
  sixDigitCodePlaceholder: "6 अंकों का कोड दर्ज करें",
  verifying: "सत्यापित किया जा रहा है…",
  verifyAccess: "एक्सेस सत्यापित करें",
  dob: "जन्म तिथि",
  complete: "पूर्ण",
  completed: "पूर्ण",
  dueOverdue: "देय / अतिदेय",
  upcoming: "आगामी",
  dueOverdueTab: "देय और अतिदेय",
  historyTab: "इतिहास",
  allTab: "सभी",
  dueDescription:
    "आज दिए जा रहे टीकों का चयन करें। माता-पिता को तुरंत सूचित किया जाएगा। टीके की जानकारी देखने के लिए किसी भी कार्ड पर जानकारी आइकन दबाएं।",
  noDueVaccines: "कोई देय या अतिदेय टीका नहीं है। बहुत अच्छा!",
  historyDescription:
    "{{child}} के लिए पहले से दर्ज किए गए टीकाकरण।",
  noVaccinations: "अभी तक कोई टीकाकरण दर्ज नहीं किया गया है।",
  allDescription:
    "पूरा UIP शेड्यूल — पूर्ण, देय, अतिदेय और आगामी।",
  noSchedule: "कोई शेड्यूल नहीं है।",
  vaccinesSelected_one: "{{count}} टीका चुना गया",
  vaccinesSelected_other: "{{count}} टीके चुने गए",
  parentsNotified: "माता-पिता को तुरंत सूचित किया जाएगा।",
  weightNow: "वर्तमान वजन",
  weightPlaceholder: "जैसे 4.5",
  recording: "दर्ज किया जा रहा है…",
  record: "दर्ज करें",
  recorded: "दर्ज किया गया",
  vaccinesSaved_one: "{{child}} के रिकॉर्ड में {{count}} टीका सहेजा गया।",
  vaccinesSaved_other: "{{child}} के रिकॉर्ड में {{count}} टीके सहेजे गए।",
  done: "हो गया",
  givenDate: "दिया गया {{date}}",
  dueDate: "देय {{date}}",
  documentsUploaded: "{{count}} दस्तावेज़ अपलोड किए गए",
  viewDocuments: "{{count}} टीकाकरण दस्तावेज़ देखें",
  viewVaccineInfo: "{{name}} की जानकारी देखें",

  status: {
    completed: "पूर्ण",
    due: "देय",
    overdue: "अतिदेय",
    upcoming: "आगामी",
  },
},
        },
      },

      mr: {
        translation: {
          language: "भाषा",
          english: "इंग्रजी",
          hindi: "हिंदी",
          marathi: "मराठी",
          gujarati: "गुजराती",

          back: "मागे",
          settings: "सेटिंग्ज",
          notifications: "सूचना",
          logout: "लॉग आउट",

          profileSettings: "प्रोफाइल आणि सेटिंग्ज",
          accountDetails: "खाते तपशील",
          fullName: "पूर्ण नाव",
          phoneNumber: "फोन नंबर",
          aadhaarUsername: "आधार (वापरकर्तानाव)",
          aadhaarDescription:
            "आधार बदलता येत नाही. हा तुमचा कायमस्वरूपी ओळख क्रमांक आहे.",
          saveChanges: "बदल जतन करा",
          session: "सत्र",
          signOutDescription:
            "या डिव्हाइसवरील आपल्या Vardaan+ खात्यातून साइन आउट करा.",
          dangerZone: "धोकादायक विभाग",
          deleteAccount: "माझे खाते हटवा",
          accessCode: "प्रवेश कोड",
          deleteAccountDescription:
            "आपले खाते कायमचे हटवा. एखादे मूल दुसऱ्या पालकाशी जोडलेले असल्यास, ते त्या पालकाच्या खात्यात उपलब्ध राहील.",

          doctorDashboard: {
            signedInAs: "साइन इन केले आहे",
            searchByAadhaar: "आधारद्वारे मूल किंवा पालक शोधा",
            aadhaarPlaceholder: "12 अंकी आधार क्रमांक प्रविष्ट करा",
            search: "शोधा",
            autoDetectInfo:
              "पालक किंवा मुलाचा स्वयंचलितपणे शोध घेतला जातो. या आवृत्तीत शोधानंतर लगेच प्रवेश दिला जातो.",
            linkedChildren: "जोडलेली मुले",
            noChildren: "या पालकाशी अद्याप कोणतेही मूल जोडलेले नाही.",
            child: "मूल",
            invalidAadhaar: "12 अंकी आधार प्रविष्ट करा",
            noRecordFound: "कोणताही रेकॉर्ड सापडला नाही",
            parent: "पालक",
            hi: "नमस्कार, {{name}}",
          },

          parentNotifications: {
  title: "सूचना",
  description: "तुमच्या मुलांच्या लसीकरणासंबंधी अपडेट.",
  noNotifications: "अद्याप कोणतीही सूचना नाही.",
},

          editChild: {
  title: "मुलाची माहिती संपादित करा",
  description: "{{name}} ची माहिती अपडेट करा.",
  childName: "मुलाचे नाव",
  dateOfBirth: "जन्मतारीख",
  gender: "लिंग",
  currentWeight: "सध्याचे वजन (किलो)",
  weightPlaceholder: "उदा. 3.2",
  saveChanges: "बदल जतन करा",

  deleteChild: "मूल हटवा",
  deleteDescription:
    "{{name}} ची प्रोफाइल आणि मुलाशी संबंधित सर्व डेटा कायमचा हटवा.",
  deleteButton: "{{name}} हटवा",
  deleteQuestion: "{{name}} हटवायचे?",
  deleteWarning:
    "{{name}} ची प्रोफाइल, लसीकरणाची नोंद आणि सूचना कायमच्या हटवल्या जातील. ही कृती पूर्ववत करता येणार नाही आणि मुलाचा सर्व डेटा गमावला जाईल.",
  cancel: "रद्द करा",
  confirmDelete: "हटवण्याची पुष्टी करा",

  childNotFound: "मूल सापडले नाही.",
  validationName: "नाव रिकामे असू शकत नाही",
  validationDob: "जन्मतारीख आवश्यक आहे",
  validationGender: "लिंग आवश्यक आहे",
  validationWeight: "किलोमध्ये वैध वजन प्रविष्ट करा",
  childUpdated: "मुलाची माहिती अपडेट झाली",
  updateFailed: "अपडेट अयशस्वी झाले",
  childDeleted: "{{name}} हटवले गेले",
  deleteFailed: "हटवणे अयशस्वी झाले",
},

          childProfile: {
  childNotFound: "मूल सापडले नाही.",
  pdfGenerationFailed: "PDF तयार करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
  generating: "तयार करत आहे...",
  exportPdf: "PDF निर्यात करा",
  editChild: "मुलाची माहिती संपादित करा",
  born: "जन्म",
  complete: "पूर्ण",
  vaccinationTimeline: "लसीकरणाची वेळरेषा",
  timelineDescription:
    "जन्मापासून 16 वर्षांपर्यंत तुमच्या मुलाला आवश्यक असलेली प्रत्येक लस.",
  recordSaved: "रेकॉर्ड जतन केले",
  addVaccinationRecord: "लसीकरणाचा रेकॉर्ड जोडा",
  dateTaken: "लस दिल्याची तारीख",
  doctorName: "डॉक्टरचे नाव",
  doctorNamePlaceholder: "डॉक्टरचे नाव प्रविष्ट करा",
  weightAtThatTime: "त्या वेळचे वजन",
  optional: "ऐच्छिक",
  weightPlaceholder: "किलोमध्ये वजन",
  vaccinationDocument: "लसीकरणाचे कागदपत्र",
  dateAndDoctorRequired:
    "कृपया लस दिल्याची तारीख आणि डॉक्टरचे नाव प्रविष्ट करा.",
  addVaccination: "लसीकरण जोडा",
  givenOn: "{{date}} रोजी दिले",
  dueOn: "{{date}} रोजी देय",
  doctorPrefix: "डॉ.",
  maxDocumentsAlert:
    "तुम्ही प्रत्येक लसीसाठी जास्तीत जास्त {{count}} कागदपत्रे अपलोड करू शकता",
  deleteDocumentConfirm:
    "तुम्हाला हे कागदपत्र नक्की हटवायचे आहे का?",
  deleteDocumentFailed:
    "कागदपत्र हटवण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.",
  addVaccineAria: "{{name}} चे लसीकरण रेकॉर्ड जोडा",
  uploadDocumentTitle:
    "कागदपत्र अपलोड करा ({{count}}/{{max}})",
  viewDocumentsTitle:
    "कागदपत्रे पहा ({{count}}/{{max}})",
  maximumDocumentsReached:
    "कमाल {{count}} कागदपत्रांची मर्यादा पूर्ण झाली",
  uploadVaccineDocument: "लसीचे कागदपत्र अपलोड करा",
  uipSource: "स्रोत: भारताचा सार्वत्रिक लसीकरण कार्यक्रम (UIP)",
official: "अधिकृत",
uipSchedule: "UIP वेळापत्रक · भारत सरकार",
  viewVaccinationDocuments:
    "लसीकरणाची कागदपत्रे पहा",
  documentsLimitReached:
    "कागदपत्रांची कमाल मर्यादा पूर्ण झाली",
    timelineDisclaimer:
  "ही लसीकरण वेळरेषा भारताच्या आरोग्य आणि कुटुंब कल्याण मंत्रालयाने निश्चित केलेल्या राष्ट्रीय वेळापत्रकाचे पालन करते — हेच वेळापत्रक देशभरातील सरकारी रुग्णालये आणि प्राथमिक आरोग्य केंद्रांमध्ये वापरले जाते.",

  status: {
    completed: "पूर्ण",
    due: "देय",
    overdue: "अतिदेय",
    upcoming: "आगामी",
  },
},

          addChild: {
  title: "मूल जोडा",
  description:
    "हे मूल आधारच्या माध्यमातून आपोआप दोन्ही पालकांशी जोडले जाईल.",
  childName: "मुलाचे नाव",
  childNamePlaceholder: "पूर्ण नाव",
  dateOfBirth: "जन्मतारीख",
  gender: "लिंग",
  select: "निवडा",
  currentWeight: "सध्याचे वजन (किलो)",
  weightPlaceholder: "उदा. 3.2",
  youAreThe: "तुम्ही आहात",
  mother: "आई",
  father: "वडील",
  otherParentAadhaar: "दुसऱ्या पालकांचा आधार (ऐच्छिक)",
  otherParentAadhaarPlaceholder:
    "12 अंक — हे मूल त्यांच्याशी आपोआप जोडले जाईल",
  childAadhaar: "मुलाचा आधार (ऐच्छिक)",
  childAadhaarPlaceholder:
    "12 अंक — आजीवन शोधासाठी",
  submit: "मूल जोडा",
  validationName: "मुलाचे नाव प्रविष्ट करा",
  validationDob: "जन्मतारीख निवडा",
  validationGender: "लिंग निवडा",
  validationWeight: "किलोमध्ये वैध वजन प्रविष्ट करा",
  validationOtherParentAadhaar:
    "दुसऱ्या पालकांचा आधार 12 अंकी असावा",
  validationChildAadhaar:
    "मुलाचा आधार 12 अंकी असावा",
  childAdded: "{{name}} जोडले गेले",
  couldNotAdd: "मूल जोडता आले नाही",
},

parentRegister: {
  title: "पालक खाते तयार करा",
  description:
    "तुमचा आधार तुमचे वापरकर्तानाव म्हणून वापरला जाईल. फक्त तुम्ही आणि तुमचे सह-पालक तुमच्या मुलांच्या नोंदी पाहू शकतील.",
  backToLogin: "लॉगिनकडे परत जा",
  fullName: "पूर्ण नाव",
  fullNamePlaceholder: "उदा. प्रिया शर्मा",
  aadhaar: "आधार (12 अंक)",
  aadhaarPlaceholder: "XXXX XXXX XXXX",
  phone: "फोन",
  phonePlaceholder: "10 अंकी फोन",
  password: "पासवर्ड",
  passwordPlaceholder: "किमान 6 अक्षरे",
  confirmPassword: "पुष्टी करा",
  confirmPlaceholder: "पुन्हा प्रविष्ट करा",
  createAccount: "खाते तयार करा",
  alreadyHaveAccount: "आधीच खाते आहे का?",
  signIn: "साइन इन करा",
  validationName: "आपले पूर्ण नाव प्रविष्ट करा",
  validationAadhaar: "आधार 12 अंकी असावा",
  validationPhone: "वैध फोन नंबर प्रविष्ट करा",
  validationPassword:
    "पासवर्ड किमान 6 अक्षरांचा असावा",
  validationConfirm: "पासवर्ड जुळत नाहीत",
  accountCreated:
    "खाते तयार झाले. हा प्रवेश कोड डॉक्टरांसोबत शेअर करा: {{code}}",
  registrationFailed: "नोंदणी अयशस्वी झाली",
},

          doctorLogin: {
  title: "डॉक्टर लॉगिन",
  description: "रुग्णांच्या नोंदी पाहण्यासाठी साइन इन करा.",
  desktopDescription:
    "रुग्णांच्या लसीकरणाच्या नोंदी पाहण्यासाठी आपल्या क्रेडेन्शियल्सने साइन इन करा.",
  phoneNumber: "फोन नंबर",
  phonePlaceholder: "नोंदणीकृत फोन नंबर",
  password: "पासवर्ड",
  passwordPlaceholder: "आपला पासवर्ड प्रविष्ट करा",
  signIn: "साइन इन करा",
  createAccount: "डॉक्टर खाते तयार करा",
  backToRoleSelection: "भूमिका निवडीवर परत जा",
  welcome: "स्वागत आहे, डॉ. {{name}}",
  loginFailed: "लॉगिन अयशस्वी झाले",
  panelTitle: "आजीवन लसीकरण रेकॉर्ड — नेहमी तुमच्या खिशात.",
  panelDescription:
  "आधारद्वारे शोधा. कोणती लस देय आहे ते पहा. नोंद करण्यासाठी टॅप करा. प्रत्येक पालकाला त्वरित सूचना मिळते.",
  doctorIllustrationAlt: "डॉक्टरचे चित्र",
},

parentLogin: {
  title: "पालक लॉगिन",
  description:
    "आपल्या मुलांच्या नोंदी पाहण्यासाठी आधारद्वारे साइन इन करा.",
  backToRoleSelection: "भूमिका निवडीवर परत जा",
  aadhaarNumber: "आधार क्रमांक",
  aadhaarPlaceholder: "12 अंकी आधार",
  password: "पासवर्ड",
  passwordPlaceholder: "आपला पासवर्ड प्रविष्ट करा",
  signIn: "साइन इन करा",
  createAccount: "पालक खाते तयार करा",
  aadhaarValidation: "आधार 12 अंकी असावा",
  welcome: "स्वागत आहे, {{name}}",
  loginFailed: "लॉगिन अयशस्वी झाले",
  panelTitle:
    "आजीवन लसीकरण रेकॉर्ड — नेहमी तुमच्या खिशात.",
  panelDescription:
    "तुमच्या मुलाचा इतिहास, जन्मावेळी BCG पासून वयाच्या 16 व्या वर्षीच्या बूस्टरपर्यंत — सुरक्षित, शोधण्यायोग्य आणि कोणत्याही डॉक्टरसोबत शेअर करता येण्यासारखा.",
  childIllustrationAlt: "टेडीसह मूल",
},

parentDashboard: {
  welcomeBack: "पुन्हा स्वागत आहे",
  aadhaar: "आधार",
  addChild: "मूल जोडा",
  yourAccessCode: "तुमचा प्रवेश कोड",
  accessCodeDescription:
    "डॉक्टरांना तुमच्या मुलाच्या लसीकरणाची नोंद अपडेट करायची असल्यास हा सहा अंकी कोड त्यांच्यासोबत शेअर करा.",
  myChildren: "माझी मुले",
  addFirstChild: "तुमचे पहिले मूल जोडा",
  firstChildDescription:
    "त्यांची लसीकरण नोंद सुरू करा. त्यांच्या जन्मतारखेवर आधारित भारताचे UIP वेळापत्रक आम्ही आपोआप तयार करू.",
  vaccinationProgress: "लसीकरणाची प्रगती",
  born: "जन्म",
hi: "नमस्कार, {{name}}",
  
  languageDescription: "तुमची पसंतीची भाषा निवडा",
},

selectRole: {
  securityMessage: "पासवर्ड-आधारित प्रमाणीकरणाने सुरक्षित",
  title: "तुम्ही कोणाच्या रूपात साइन इन करत आहात?",
  description:
    "पुढे जाण्यासाठी आपली भूमिका निवडा. पालक मुलांचे व्यवस्थापन आणि लसीकरणाचा इतिहास पाहतात. डॉक्टर आधार शोधल्यानंतर नोंदी अपडेट करतात.",
  parentTitle: "पालक म्हणून पुढे चला",
  parentDescription:
    "आपल्या मुलांची नोंदणी करा, UIP वेळापत्रकाचे पालन करा आणि आजीवन लसीकरणाचा रेकॉर्ड पाहा.",
  doctorTitle: "डॉक्टर म्हणून पुढे चला",
  doctorDescription:
    "आधारद्वारे मूल शोधा, देय लसी पहा आणि काही सेकंदांत लसीकरणाची नोंद करा.",
  getStarted: "सुरू करा",
  internetRequired: "वैद्यकीय नोंदींसाठी इंटरनेट कनेक्शन आवश्यक आहे.",
},

doctorRegister: {
  title: "डॉक्टर खाते तयार करा",
  description: "स्व-पंजीकरण. कोणत्याही मंजुरीची आवश्यकता नाही.",
  backToLogin: "लॉगिनकडे परत जा",
  doctorName: "डॉक्टरचे नाव",
  doctorNamePlaceholder: "उदा. अंजली वर्मा",
  doctorNameDescription:
    'फक्त आपले नाव लिहा — "Dr." ही उपाधी आपोआप जोडली जाईल.',
  phone: "फोन",
  password: "पासवर्ड",
  clinicName: "क्लिनिक / रुग्णालयाचे नाव",
  clinicNamePlaceholder: "उदा. सनराइज चिल्ड्रन्स क्लिनिक",
  clinicAddress: "क्लिनिकचा पत्ता",
  clinicAddressPlaceholder: "रस्ता, शहर, राज्य",
  createAccount: "खाते तयार करा",
  alreadyRegistered: "आधीच नोंदणी केली आहे?",
  signIn: "साइन इन करा",
  enterName: "आपले नाव प्रविष्ट करा",
  validPhone: "वैध फोन नंबर प्रविष्ट करा",
  passwordLength: "पासवर्ड किमान 6 अक्षरांचा असावा",
  clinicRequired: "क्लिनिकची माहिती आवश्यक आहे",
  accountCreated: "खाते तयार झाले",
  registrationFailed: "नोंदणी अयशस्वी झाली",
  doctorIllustrationAlt: "डॉक्टरचे चित्र",
},

          vaccineInfo: {
  givenOn: "{{date}} रोजी दिले",
  dueOn: "{{date}} रोजी देय",
  fullForm: "पूर्ण नाव",
  protectsAgainst: "यापासून संरक्षण",
  whatItDoes: "हे काय करते",
  whyChildNeedsIt: "तुमच्या मुलाला याची गरज का आहे",
  goodToKnow: "माहित असणे आवश्यक",
  informationUnavailable: "या लसीची सविस्तर माहिती अद्याप उपलब्ध नाही.",
  recordedBy: "नोंद करणारे",
  weightAtVisit: "भेटीच्या वेळी वजन",
  source: "स्रोत",
  medicalAdvice:
    "भारताचा सार्वत्रिक लसीकरण कार्यक्रम (UIP) — आरोग्य आणि कुटुंब कल्याण मंत्रालय, भारत सरकार. वैद्यकीय सल्ल्यासाठी नेहमी आपल्या बालरोगतज्ज्ञांचा सल्ला घ्या.",
},

          gender: {
            male: "पुरुष",
            female: "महिला",
            other: "इतर",
          },

          doctorSettings: {
            invalidPhone: "अवैध फोन नंबर",
            nothingToUpdate: "अपडेट करण्यासाठी काहीही नाही",
            profileUpdated: "प्रोफाइल अपडेट झाले",
            updateFailed: "अपडेट अयशस्वी झाले",
            accountDeleted: "खाते हटवले गेले",
            deleteFailed: "खाते हटवणे अयशस्वी झाले",
            typeExactly: "अगदी हेच लिहा: {{phrase}}",
            loading: "लोड होत आहे…",
            doctorName: "डॉक्टरचे नाव",
            doctorNamePlaceholder: "उदा. अंजली वर्मा",
            doctorNameDescription:
              'फक्त आपले नाव लिहा — "Dr." ही उपाधी आपोआप दाखवली जाईल.',
            clinicName: "क्लिनिक / रुग्णालयाचे नाव",
            clinicAddress: "क्लिनिकचा पत्ता",
            dangerDescription:
              "आपले डॉक्टर खाते कायमचे हटवा. आपण आधी नोंदवलेले लसीकरणाचे रेकॉर्ड मुलांच्या वैद्यकीय इतिहासात कायम राहतील — यामुळे त्यांच्या कुटुंबांसाठी आजीवन रेकॉर्ड सुरक्षित राहतो.",
            deleteAccountQuestion: "आपले खाते हटवायचे आहे का?",
            deleteAccountWarning:
              "यामुळे आपले Vardaan+ डॉक्टर खाते कायमचे हटवले जाईल. आपण रुग्ण शोधू किंवा लसीकरणाची नोंद करू शकणार नाही.",
            vaccinationsRemain:
              "आपण आधी नोंदवलेली सर्व लसीकरणे प्रत्येक मुलाच्या वैद्यकीय इतिहासात कायम राहतील, त्यामुळे त्यांच्या कुटुंबाकडे संपूर्ण रेकॉर्ड राहील.",
            cannotUndo: "ही कृती पूर्ववत करता येणार नाही.",
            cancel: "रद्द करा",
            understandContinue: "मला समजले, पुढे चला",
            finalConfirmation: "अंतिम पुष्टी",
            typePhraseExactly:
              "पुष्टी करण्यासाठी हे वाक्य अगदी तसेच टाइप करा:",
            phrasePlaceholder: "वरील वाक्य टाइप करा",
            deletePermanently: "कायमचे हटवा",
          },

          doctorChildRecord: {
  mother: "आई",
  father: "वडील",
  motherOrFather: "आई किंवा वडील",
  linked: "जोडलेले",
  enterSixDigitCode: "6 अंकी पालक प्रवेश कोड प्रविष्ट करा",
  accessVerified: "प्रवेश कोड सत्यापित झाला",
  invalidAccessCode: "अवैध प्रवेश कोड",
  verifyAccessFirst: "प्रथम पालक प्रवेश कोड सत्यापित करा",
  selectOneVaccine: "किमान एक लस निवडा",
  enterCurrentWeight: "मुलाचे सध्याचे वजन किलोग्रॅममध्ये प्रविष्ट करा",
  couldNotSave: "जतन करता आले नाही",
  childNotFound: "मूल सापडले नाही.",
  backToSearch: "शोधाकडे परत जा",
  parentAccessRequired: "पालकांची परवानगी आवश्यक आहे",
  enterCodeSharedBy:
    "{{person}} यांनी दिलेला सहा अंकी कोड प्रविष्ट करा. त्यानंतरच तुम्ही {{child}} साठी लसीकरण नोंदवू शकता.",
  sixDigitCodePlaceholder: "6 अंकी कोड प्रविष्ट करा",
  verifying: "सत्यापित करत आहे…",
  verifyAccess: "प्रवेश सत्यापित करा",
  dob: "जन्मतारीख",
  complete: "पूर्ण",
  completed: "पूर्ण",
  dueOverdue: "देय / अतिदेय",
  upcoming: "आगामी",
  dueOverdueTab: "देय आणि अतिदेय",
  historyTab: "इतिहास",
  allTab: "सर्व",
  dueDescription:
    "आज दिल्या जाणाऱ्या लसी निवडा. पालकांना त्वरित सूचना दिली जाईल. लसीची माहिती पाहण्यासाठी कोणत्याही कार्डवरील माहिती चिन्हावर टॅप करा.",
  noDueVaccines: "कोणतीही देय किंवा अतिदेय लस नाही. उत्तम!",
  historyDescription:
    "{{child}} साठी यापूर्वी नोंदवलेली लसीकरणे.",
  noVaccinations: "अद्याप कोणतेही लसीकरण नोंदवलेले नाही.",
  allDescription:
    "संपूर्ण UIP वेळापत्रक — पूर्ण, देय, अतिदेय आणि आगामी.",
  noSchedule: "कोणतेही वेळापत्रक नाही.",
  vaccinesSelected_one: "{{count}} लस निवडली",
  vaccinesSelected_other: "{{count}} लसी निवडल्या",
  parentsNotified: "पालकांना त्वरित सूचना दिली जाईल.",
  weightNow: "सध्याचे वजन",
  weightPlaceholder: "उदा. 4.5",
  recording: "नोंद करत आहे…",
  record: "नोंद करा",
  recorded: "नोंदवले",
  vaccinesSaved_one: "{{child}} च्या नोंदीमध्ये {{count}} लस जतन केली.",
  vaccinesSaved_other: "{{child}} च्या नोंदीमध्ये {{count}} लसी जतन केल्या.",
  done: "पूर्ण",
  givenDate: "दिलेली {{date}}",
  dueDate: "देय {{date}}",
  documentsUploaded: "{{count}} कागदपत्रे अपलोड केली",
  viewDocuments: "{{count}} लसीकरण कागदपत्रे पहा",
  viewVaccineInfo: "{{name}} ची माहिती पहा",

  status: {
    completed: "पूर्ण",
    due: "देय",
    overdue: "अतिदेय",
    upcoming: "आगामी",
  },
},
        },
      },

      gu: {
        translation: {
          language: "ભાષા",
          english: "અંગ્રેજી",
          hindi: "હિન્દી",
          marathi: "મરાઠી",
          gujarati: "ગુજરાતી",

          back: "પાછળ",
          settings: "સેટિંગ્સ",
          notifications: "સૂચનાઓ",
          logout: "લૉગ આઉટ",

          profileSettings: "પ્રોફાઇલ અને સેટિંગ્સ",
          accountDetails: "ખાતાની વિગતો",
          fullName: "પૂરું નામ",
          phoneNumber: "ફોન નંબર",
          aadhaarUsername: "આધાર (વપરાશકર્તા નામ)",
          aadhaarDescription:
            "આધાર બદલી શકાતો નથી. તે તમારી કાયમી ઓળખ છે.",
          saveChanges: "ફેરફારો સાચવો",
          session: "સત્ર",
          signOutDescription:
            "આ ડિવાઇસ પર તમારા Vardaan+ એકાઉન્ટમાંથી સાઇન આઉટ કરો.",
          dangerZone: "જોખમી વિસ્તાર",
          deleteAccount: "મારું એકાઉન્ટ કાઢી નાખો",
          accessCode: "ઍક્સેસ કોડ",
          deleteAccountDescription:
            "તમારું એકાઉન્ટ કાયમ માટે કાઢી નાખો. જો બાળક બીજા માતા-પિતા સાથે જોડાયેલું હોય, તો તે બીજા માતા-પિતાના એકાઉન્ટમાંથી ઉપલબ્ધ રહેશે.",

          doctorDashboard: {
            signedInAs: "આ તરીકે સાઇન ઇન કર્યું છે",
            searchByAadhaar: "આધાર દ્વારા બાળક અથવા માતા-પિતાને શોધો",
            aadhaarPlaceholder: "12 અંકનો આધાર નંબર દાખલ કરો",
            search: "શોધો",
            autoDetectInfo:
              "માતા-પિતા અથવા બાળકને આપમેળે શોધવામાં આવે છે. આ સંસ્કરણમાં શોધ પછી તરત જ ઍક્સેસ આપવામાં આવે છે.",
            linkedChildren: "જોડાયેલા બાળકો",
            noChildren: "આ માતા-પિતા સાથે હજી સુધી કોઈ બાળક જોડાયેલું નથી.",
            child: "બાળક",
            invalidAadhaar: "12 અંકનો આધાર દાખલ કરો",
            noRecordFound: "કોઈ રેકોર્ડ મળ્યો નથી",
            parent: "માતા-પિતા",
            hi: "નમસ્તે, {{name}}",
          },

          parentNotifications: {
  title: "સૂચનાઓ",
  description: "તમારા બાળકોના રસીકરણ સંબંધિત અપડેટ્સ.",
  noNotifications: "હજુ સુધી કોઈ સૂચના નથી.",
},

          editChild: {
  title: "બાળકની માહિતી સંપાદિત કરો",
  description: "{{name}} ની માહિતી અપડેટ કરો.",
  childName: "બાળકનું નામ",
  dateOfBirth: "જન્મ તારીખ",
  gender: "લિંગ",
  currentWeight: "વર્તમાન વજન (કિગ્રા)",
  weightPlaceholder: "દા.ત. 3.2",
  saveChanges: "ફેરફારો સાચવો",

  deleteChild: "બાળક કાઢી નાખો",
  deleteDescription:
    "{{name}} ની પ્રોફાઇલ અને બાળક સાથે સંબંધિત તમામ ડેટા કાયમ માટે કાઢી નાખો.",
  deleteButton: "{{name}} કાઢી નાખો",
  deleteQuestion: "{{name}} ને કાઢી નાખવો છે?",
  deleteWarning:
    "{{name}} ની પ્રોફાઇલ, રસીકરણના રેકોર્ડ અને સૂચનાઓ કાયમ માટે કાઢી નાખવામાં આવશે. આ ક્રિયા પૂર્વવત્ કરી શકાશે નહીં અને બાળકનો તમામ ડેટા ખોવાઈ જશે.",
  cancel: "રદ કરો",
  confirmDelete: "કાઢી નાખવાની પુષ્ટિ કરો",

  childNotFound: "બાળક મળ્યું નથી.",
  validationName: "નામ ખાલી ન હોઈ શકે",
  validationDob: "જન્મ તારીખ જરૂરી છે",
  validationGender: "લિંગ જરૂરી છે",
  validationWeight: "કિલોગ્રામમાં માન્ય વજન દાખલ કરો",
  childUpdated: "બાળકની માહિતી અપડેટ થઈ ગઈ",
  updateFailed: "અપડેટ નિષ્ફળ થયું",
  childDeleted: "{{name}} કાઢી નાખવામાં આવ્યું",
  deleteFailed: "કાઢી નાખવું નિષ્ફળ ગયું",
},

          addChild: {
  title: "બાળક ઉમેરો",
  description:
    "આ બાળક આધાર દ્વારા આપમેળે બંને માતા-પિતા સાથે જોડાઈ જશે.",
  childName: "બાળકનું નામ",
  childNamePlaceholder: "પૂરું નામ",
  dateOfBirth: "જન્મ તારીખ",
  gender: "લિંગ",
  select: "પસંદ કરો",
  currentWeight: "વર્તમાન વજન (કિગ્રા)",
  weightPlaceholder: "દા.ત. 3.2",
  youAreThe: "તમે છો",
  mother: "માતા",
  father: "પિતા",
  otherParentAadhaar: "બીજા માતા-પિતાનો આધાર (વૈકલ્પિક)",
  otherParentAadhaarPlaceholder:
    "12 અંક — આ બાળકને તેમની સાથે આપમેળે લિંક કરશે",
  childAadhaar: "બાળકનો આધાર (વૈકલ્પિક)",
  childAadhaarPlaceholder:
    "12 અંક — આજીવન શોધ માટે",
  submit: "બાળક ઉમેરો",
  validationName: "બાળકનું નામ દાખલ કરો",
  validationDob: "જન્મ તારીખ પસંદ કરો",
  validationGender: "લિંગ પસંદ કરો",
  validationWeight: "કિલોગ્રામમાં માન્ય વજન દાખલ કરો",
  validationOtherParentAadhaar:
    "બીજા માતા-પિતાનો આધાર 12 અંકનો હોવો જોઈએ",
  validationChildAadhaar:
    "બાળકનો આધાર 12 અંકનો હોવો જોઈએ",
  childAdded: "{{name}} ઉમેરાયું",
  couldNotAdd: "બાળક ઉમેરી શકાયું નથી",
},

parentRegister: {
  title: "માતા-પિતા એકાઉન્ટ બનાવો",
  description:
    "તમારો આધાર તમારા યુઝરનેમ તરીકે કામ કરશે. માત્ર તમે અને તમારા સહ-માતા-પિતા તમારા બાળકોના રેકોર્ડ જોઈ શકશો.",
  backToLogin: "લૉગિન પર પાછા જાઓ",
  fullName: "પૂરું નામ",
  fullNamePlaceholder: "દા.ત. પ્રિયા શર્મા",
  aadhaar: "આધાર (12 અંક)",
  aadhaarPlaceholder: "XXXX XXXX XXXX",
  phone: "ફોન",
  phonePlaceholder: "10 અંકનો ફોન",
  password: "પાસવર્ડ",
  passwordPlaceholder: "ઓછામાં ઓછા 6 અક્ષરો",
  confirmPassword: "પુષ્ટિ કરો",
  confirmPlaceholder: "ફરીથી દાખલ કરો",
  createAccount: "એકાઉન્ટ બનાવો",
  alreadyHaveAccount: "પહેલેથી એકાઉન્ટ છે?",
  signIn: "સાઇન ઇન કરો",
  validationName: "તમારું પૂરું નામ દાખલ કરો",
  validationAadhaar: "આધાર 12 અંકનો હોવો જોઈએ",
  validationPhone: "માન્ય ફોન નંબર દાખલ કરો",
  validationPassword:
    "પાસવર્ડ ઓછામાં ઓછો 6 અક્ષરનો હોવો જોઈએ",
  validationConfirm: "પાસવર્ડ મેળ ખાતા નથી",
  accountCreated:
    "એકાઉન્ટ બનાવવામાં આવ્યું. આ ઍક્સેસ કોડ ડૉક્ટરો સાથે શેર કરો: {{code}}",
  registrationFailed: "નોંધણી નિષ્ફળ ગઈ",
},

childProfile: {
  childNotFound: "બાળક મળ્યું નથી.",
  pdfGenerationFailed: "PDF બનાવવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.",
  generating: "બનાવવામાં આવી રહ્યું છે...",
  exportPdf: "PDF નિકાસ કરો",
  editChild: "બાળકની માહિતી સંપાદિત કરો",
  born: "જન્મ",
  complete: "પૂર્ણ",
  vaccinationTimeline: "રસીકરણ સમયરેખા",
  timelineDescription:
    "જન્મથી 16 વર્ષની ઉંમર સુધી તમારા બાળકને જરૂરી દરેક રસી.",
  recordSaved: "રેકોર્ડ સાચવવામાં આવ્યો",
  addVaccinationRecord: "રસીકરણ રેકોર્ડ ઉમેરો",
  dateTaken: "રસી આપવાની તારીખ",
  doctorName: "ડૉક્ટરનું નામ",
  doctorNamePlaceholder: "ડૉક્ટરનું નામ દાખલ કરો",
  weightAtThatTime: "તે સમયે વજન",
  optional: "વૈકલ્પિક",
  weightPlaceholder: "કિલોગ્રામમાં વજન",
  vaccinationDocument: "રસીકરણ દસ્તાવેજ",
  dateAndDoctorRequired:
    "કૃપા કરીને રસી આપવાની તારીખ અને ડૉક્ટરનું નામ દાખલ કરો.",
  addVaccination: "રસીકરણ ઉમેરો",
  givenOn: "{{date}} ના રોજ આપવામાં આવી",
  dueOn: "{{date}} ના રોજ બાકી",
  doctorPrefix: "ડૉ.",
  maxDocumentsAlert:
    "તમે દરેક રસી માટે મહત્તમ {{count}} દસ્તાવેજો અપલોડ કરી શકો છો",
  deleteDocumentConfirm:
    "શું તમે ખરેખર આ દસ્તાવેજ કાઢી નાખવા માંગો છો?",
  deleteDocumentFailed:
    "દસ્તાવેજ કાઢી નાખવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.",
  addVaccineAria: "{{name}} રસીકરણ રેકોર્ડ ઉમેરો",
  uploadDocumentTitle:
    "દસ્તાવેજ અપલોડ કરો ({{count}}/{{max}})",
  viewDocumentsTitle:
    "દસ્તાવેજો જુઓ ({{count}}/{{max}})",
  maximumDocumentsReached:
    "મહત્તમ {{count}} દસ્તાવેજોની મર્યાદા પૂર્ણ થઈ ગઈ છે",
  uploadVaccineDocument: "રસીનો દસ્તાવેજ અપલોડ કરો",
  uipSource: "સ્રોત: ભારતનો સાર્વત્રિક રસીકરણ કાર્યક્રમ (UIP)",
official: "સત્તાવાર",
uipSchedule: "UIP શેડ્યૂલ · ભારત સરકાર",
  viewVaccinationDocuments:
    "રસીકરણના દસ્તાવેજો જુઓ",
  documentsLimitReached:
    "દસ્તાવેજોની મહત્તમ મર્યાદા પૂર્ણ થઈ ગઈ છે",
    timelineDisclaimer:
  "આ રસીકરણ સમયરેખા ભારતના આરોગ્ય અને પરિવાર કલ્યાણ મંત્રાલય દ્વારા નક્કી કરાયેલા રાષ્ટ્રીય રસીકરણ કાર્યક્રમને અનુસરે છે — આ જ કાર્યક્રમ દેશભરની સરકારી હોસ્પિટલો અને પ્રાથમિક આરોગ્ય કેન્દ્રોમાં ઉપયોગમાં લેવાય છે.",

  status: {
    completed: "પૂર્ણ",
    due: "બાકી",
    overdue: "મુદત વીતી ગઈ",
    upcoming: "આગામી",
  },
},

          doctorLogin: {
  title: "ડૉક્ટર લૉગિન",
  description: "દર્દીના રેકોર્ડ જોવા માટે સાઇન ઇન કરો.",
  desktopDescription:
    "દર્દીના રસીકરણના રેકોર્ડ જોવા માટે તમારા ક્રેડેન્શિયલ્સ સાથે સાઇન ઇન કરો.",
  phoneNumber: "ફોન નંબર",
  phonePlaceholder: "નોંધાયેલ ફોન નંબર",
  password: "પાસવર્ડ",
  passwordPlaceholder: "તમારો પાસવર્ડ દાખલ કરો",
  signIn: "સાઇન ઇન કરો",
  createAccount: "ડૉક્ટર એકાઉન્ટ બનાવો",
  backToRoleSelection: "ભૂમિકા પસંદગી પર પાછા જાઓ",
  welcome: "સ્વાગત છે, ડૉ. {{name}}",
  loginFailed: "લૉગિન નિષ્ફળ થયું",
  panelTitle: "આજીવન રસીકરણ રેકોર્ડ — હંમેશા તમારા ખિસ્સામાં.",
  panelDescription:
  "આધાર દ્વારા શોધો. કઈ રસી બાકી છે તે જુઓ. નોંધ કરવા માટે ટૅપ કરો. દરેક માતા-પિતાને તરત સૂચના મળે છે.",
  doctorIllustrationAlt: "ડૉક્ટરનું ચિત્ર",
},

parentLogin: {
  title: "માતા-પિતા લૉગિન",
  description:
    "તમારા બાળકોના રેકોર્ડ જોવા માટે આધાર દ્વારા સાઇન ઇન કરો.",
  backToRoleSelection: "ભૂમિકા પસંદગી પર પાછા જાઓ",
  aadhaarNumber: "આધાર નંબર",
  aadhaarPlaceholder: "12 અંકનો આધાર",
  password: "પાસવર્ડ",
  passwordPlaceholder: "તમારો પાસવર્ડ દાખલ કરો",
  signIn: "સાઇન ઇન કરો",
  createAccount: "માતા-પિતા એકાઉન્ટ બનાવો",
  aadhaarValidation: "આધાર 12 અંકનો હોવો જોઈએ",
  welcome: "સ્વાગત છે, {{name}}",
  loginFailed: "લૉગિન નિષ્ફળ થયું",
  panelTitle:
    "આજીવન રસીકરણ રેકોર્ડ — હંમેશા તમારા ખિસ્સામાં.",
  panelDescription:
    "તમારા બાળકનો ઇતિહાસ, જન્મ સમયે BCGથી લઈને 16 વર્ષની ઉંમરના બૂસ્ટર સુધી — સુરક્ષિત, શોધી શકાય એવો અને કોઈપણ ડૉક્ટર સાથે શેર કરી શકાય એવો.",
  childIllustrationAlt: "ટેડી સાથેનું બાળક",
},

parentDashboard: {
  welcomeBack: "ફરી સ્વાગત છે",
  aadhaar: "આધાર",
  addChild: "બાળક ઉમેરો",
  yourAccessCode: "તમારો ઍક્સેસ કોડ",
  accessCodeDescription:
    "જ્યારે ડૉક્ટરને તમારા બાળકના રસીકરણના રેકોર્ડને અપડેટ કરવાની જરૂર હોય ત્યારે આ છ અંકનો કોડ તેમની સાથે શેર કરો.",
  myChildren: "મારા બાળકો",
  addYourFirstChild: "તમારું પહેલું બાળક ઉમેરો",
  firstChildDescription:
    "તેમનો રસીકરણ રેકોર્ડ શરૂ કરો. અમે તેમના જન્મની તારીખના આધારે ભારતનું UIP શેડ્યૂલ આપમેળે બનાવશું.",
  vaccinationProgress: "રસીકરણની પ્રગતિ",
  born: "જન્મ",
  hi: "નમસ્તે, {{name}}",
  languageDescription: "તમારી પસંદગીની ભાષા પસંદ કરો",
},

selectRole: {
  securityMessage: "પાસવર્ડ આધારિત પ્રમાણીકરણથી સુરક્ષિત",
  title: "તમે કયા રૂપે સાઇન ઇન કરી રહ્યા છો?",
  description:
    "આગળ વધવા માટે તમારી ભૂમિકા પસંદ કરો. માતા-પિતા બાળકોનું સંચાલન કરે છે અને રસીકરણનો ઇતિહાસ જુએ છે. ડૉક્ટરો આધાર શોધ્યા પછી રેકોર્ડ અપડેટ કરે છે.",
  parentTitle: "માતા-પિતા તરીકે ચાલુ રાખો",
  parentDescription:
    "તમારા બાળકોની નોંધણી કરો, UIP શેડ્યૂલને અનુસરો અને આજીવન રસીકરણ રેકોર્ડ મેળવો.",
  doctorTitle: "ડૉક્ટર તરીકે ચાલુ રાખો",
  doctorDescription:
    "આધાર દ્વારા બાળકને શોધો, બાકી રસીઓ જુઓ અને થોડી જ સેકન્ડમાં રસીકરણની નોંધ કરો.",
  getStarted: "શરૂ કરો",
  internetRequired: "મેડિકલ રેકોર્ડ માટે ઇન્ટરનેટ કનેક્શન જરૂરી છે.",
},

doctorRegister: {
  title: "ડૉક્ટર એકાઉન્ટ બનાવો",
  description: "સ્વ-નોંધણી. કોઈ મંજૂરીની જરૂર નથી.",
  backToLogin: "લૉગિન પર પાછા જાઓ",
  doctorName: "ડૉક્ટરનું નામ",
  doctorNamePlaceholder: "દા.ત. અંજલી વર્મા",
  doctorNameDescription:
    'ફક્ત તમારું નામ લખો — "Dr." ઉપાધિ આપમેળે ઉમેરવામાં આવશે.',
  phone: "ફોન",
  password: "પાસવર્ડ",
  clinicName: "ક્લિનિક / હોસ્પિટલનું નામ",
  clinicNamePlaceholder: "દા.ત. સનરાઇઝ ચિલ્ડ્રન્સ ક્લિનિક",
  clinicAddress: "ક્લિનિકનું સરનામું",
  clinicAddressPlaceholder: "શેરી, શહેર, રાજ્ય",
  createAccount: "એકાઉન્ટ બનાવો",
  alreadyRegistered: "પહેલેથી નોંધણી કરાવી છે?",
  signIn: "સાઇન ઇન કરો",
  enterName: "તમારું નામ દાખલ કરો",
  validPhone: "માન્ય ફોન નંબર દાખલ કરો",
  passwordLength: "પાસવર્ડ ઓછામાં ઓછો 6 અક્ષરનો હોવો જોઈએ",
  clinicRequired: "ક્લિનિકની માહિતી જરૂરી છે",
  accountCreated: "એકાઉન્ટ બનાવવામાં આવ્યું",
  registrationFailed: "નોંધણી નિષ્ફળ ગઈ",
  doctorIllustrationAlt: "ડૉક્ટરનું ચિત્ર",
},

          vaccineInfo: {
  givenOn: "{{date}} ના રોજ આપવામાં આવી",
  dueOn: "{{date}} ના રોજ બાકી",
  fullForm: "પૂર્ણ નામ",
  protectsAgainst: "આનાથી રક્ષણ",
  whatItDoes: "તે શું કરે છે",
  whyChildNeedsIt: "તમારા બાળકને તેની જરૂર શા માટે છે",
  goodToKnow: "જાણવા જેવી બાબતો",
  informationUnavailable: "આ રસીની વિગતવાર માહિતી હજી ઉપલબ્ધ નથી.",
  recordedBy: "નોંધ કરનાર",
  weightAtVisit: "મુલાકાત સમયે વજન",
  source: "સ્રોત",
  medicalAdvice:
    "ભારતનો સાર્વત્રિક રસીકરણ કાર્યક્રમ (UIP) — આરોગ્ય અને પરિવાર કલ્યાણ મંત્રાલય, ભારત સરકાર. તબીબી સલાહ માટે હંમેશા તમારા બાળરોગ નિષ્ણાતની સલાહ લો.",
},

          gender: {
            male: "પુરુષ",
            female: "સ્ત્રી",
            other: "અન્ય",
          },

          doctorSettings: {
            invalidPhone: "અમાન્ય ફોન નંબર",
            nothingToUpdate: "અપડેટ કરવા માટે કંઈ નથી",
            profileUpdated: "પ્રોફાઇલ અપડેટ થઈ ગઈ",
            updateFailed: "અપડેટ નિષ્ફળ થયું",
            accountDeleted: "એકાઉન્ટ કાઢી નાખવામાં આવ્યું",
            deleteFailed: "એકાઉન્ટ કાઢી નાખવું નિષ્ફળ ગયું",
            typeExactly: "ચોક્કસ આ લખો: {{phrase}}",
            loading: "લોડ થઈ રહ્યું છે…",
            doctorName: "ડૉક્ટરનું નામ",
            doctorNamePlaceholder: "દા.ત. અંજલી વર્મા",
            doctorNameDescription:
              '"Dr." ઉપાધિ આપમેળે બતાવવામાં આવશે — ફક્ત તમારું નામ લખો.',
            clinicName: "ક્લિનિક / હોસ્પિટલનું નામ",
            clinicAddress: "ક્લિનિકનું સરનામું",
            dangerDescription:
              "તમારું ડૉક્ટર એકાઉન્ટ કાયમ માટે કાઢી નાખો. તમે અગાઉ નોંધેલા રસીકરણના રેકોર્ડ બાળકોના તબીબી ઇતિહાસમાં રહેશે — આ તેમના પરિવારો માટે આજીવન રેકોર્ડ જાળવે છે.",
            deleteAccountQuestion: "શું તમે તમારું એકાઉન્ટ કાઢી નાખવા માંગો છો?",
            deleteAccountWarning:
              "આનાથી તમારું Vardaan+ ડૉક્ટર એકાઉન્ટ કાયમ માટે દૂર થઈ જશે. તમે દર્દીઓને શોધી અથવા રસીકરણની નોંધ કરી શકશો નહીં.",
            vaccinationsRemain:
              "તમે અગાઉ નોંધેલા તમામ રસીકરણ દરેક બાળકના તબીબી ઇતિહાસમાં રહેશે જેથી તેમના પરિવાર પાસે સંપૂર્ણ રેકોર્ડ રહે.",
            cannotUndo: "આ ક્રિયા પૂર્વવત્ કરી શકાશે નહીં.",
            cancel: "રદ કરો",
            understandContinue: "હું સમજું છું, ચાલુ રાખો",
            finalConfirmation: "અંતિમ પુષ્ટિ",
            typePhraseExactly:
              "પુષ્ટિ કરવા માટે આ વાક્ય બરાબર આ રીતે લખો:",
            phrasePlaceholder: "ઉપરનું વાક્ય લખો",
            deletePermanently: "કાયમ માટે કાઢી નાખો",
          },
          doctorChildRecord: {
  mother: "માતા",
  father: "પિતા",
  motherOrFather: "માતા અથવા પિતા",
  linked: "જોડાયેલ",
  enterSixDigitCode: "6 અંકનો માતા-પિતા ઍક્સેસ કોડ દાખલ કરો",
  accessVerified: "ઍક્સેસ કોડ ચકાસવામાં આવ્યો",
  invalidAccessCode: "અમાન્ય ઍક્સેસ કોડ",
  verifyAccessFirst: "પહેલા માતા-પિતાનો ઍક્સેસ કોડ ચકાસો",
  selectOneVaccine: "ઓછામાં ઓછી એક રસી પસંદ કરો",
  enterCurrentWeight: "બાળકનું વર્તમાન વજન કિલોગ્રામમાં દાખલ કરો",
  couldNotSave: "સાચવી શકાયું નથી",
  childNotFound: "બાળક મળ્યું નથી.",
  backToSearch: "શોધ પર પાછા જાઓ",
  parentAccessRequired: "માતા-પિતાની પરવાનગી જરૂરી છે",
  enterCodeSharedBy:
    "{{person}} દ્વારા શેર કરવામાં આવેલ છ અંકનો કોડ દાખલ કરો. તે પછી જ તમે {{child}} માટે રસીકરણ નોંધાવી શકશો.",
  sixDigitCodePlaceholder: "6 અંકનો કોડ દાખલ કરો",
  verifying: "ચકાસી રહ્યા છીએ…",
  verifyAccess: "ઍક્સેસ ચકાસો",
  dob: "જન્મ તારીખ",
  complete: "પૂર્ણ",
  completed: "પૂર્ણ",
  dueOverdue: "બાકી / મુદત વીતી ગઈ",
  upcoming: "આગામી",
  dueOverdueTab: "બાકી અને મુદત વીતી ગઈ",
  historyTab: "ઇતિહાસ",
  allTab: "બધા",
  dueDescription:
    "આજે આપવામાં આવતી રસીઓ પસંદ કરો. માતા-પિતાને તરત સૂચના મોકલવામાં આવશે. રસીની માહિતી જોવા માટે કોઈપણ કાર્ડ પરના માહિતી ચિહ્નને ટૅપ કરો.",
  noDueVaccines: "કોઈ બાકી અથવા મુદત વીતી ગયેલી રસી નથી. ખૂબ સારું!",
  historyDescription:
    "{{child}} માટે અગાઉ નોંધાયેલા રસીકરણો.",
  noVaccinations: "હજુ સુધી કોઈ રસીકરણ નોંધાયેલ નથી.",
  allDescription:
    "સંપૂર્ણ UIP શેડ્યૂલ — પૂર્ણ, બાકી, મુદત વીતી ગયેલી અને આગામી.",
  noSchedule: "કોઈ શેડ્યૂલ નથી.",
  vaccinesSelected_one: "{{count}} રસી પસંદ કરી",
  vaccinesSelected_other: "{{count}} રસીઓ પસંદ કરી",
  parentsNotified: "માતા-પિતાને તરત સૂચના મોકલવામાં આવશે.",
  weightNow: "હાલનું વજન",
  weightPlaceholder: "દા.ત. 4.5",
  recording: "નોંધ કરી રહ્યા છીએ…",
  record: "નોંધ કરો",
  recorded: "નોંધાયેલ",
  vaccinesSaved_one: "{{child}} ના રેકોર્ડમાં {{count}} રસી સાચવવામાં આવી.",
  vaccinesSaved_other: "{{child}} ના રેકોર્ડમાં {{count}} રસીઓ સાચવવામાં આવી.",
  done: "થઈ ગયું",
  givenDate: "આપવામાં આવી {{date}}",
  dueDate: "બાકી {{date}}",
  documentsUploaded: "{{count}} દસ્તાવેજો અપલોડ કરવામાં આવ્યા",
  viewDocuments: "{{count}} રસીકરણ દસ્તાવેજો જુઓ",
  viewVaccineInfo: "{{name}} વિશેની માહિતી જુઓ",

  status: {
    completed: "પૂર્ણ",
    due: "બાકી",
    overdue: "મુદત વીતી ગઈ",
    upcoming: "આગામી",
  },
},
        },
      },
    },
  });

export default i18n;