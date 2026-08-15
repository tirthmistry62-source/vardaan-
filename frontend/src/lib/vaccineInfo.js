// Accurate India UIP vaccine information.
// English content is stored here; translated content is selected by language.
// Keyed by the base vaccine name (matches the `name` field in vaccineSchedule.js).
// Sources: WHO immunization info, MoHFW India UIP guidelines, IAP handbook.

export const VACCINE_INFO = {
  BCG: {
    fullForm: "Bacillus Calmette–Guérin",
    protectsAgainst: "Tuberculosis (TB)",
    purpose:
      "Protects newborns from severe forms of tuberculosis, especially TB meningitis and miliary TB — both of which can be life-threatening in infants.",
    whyNeeded:
      "India carries one of the world's highest TB burdens. Because babies have immature immune systems, BCG given at birth builds early protection against dangerous, disseminated TB.",
    keyFacts: [
      "Given as a single intradermal injection on the left upper arm.",
      "A small scar or nodule at the injection site is normal and expected.",
      "Ideally given within the first few days after birth.",
    ],
    translations: {
      hi: {
        fullForm: "बैसिलस कैलमेट-गुएरिन",
        protectsAgainst: "तपेदिक (टीबी)",
        purpose:
          "नवजात शिशुओं को तपेदिक के गंभीर रूपों, विशेष रूप से टीबी मेनिन्जाइटिस और मिलियरी टीबी से बचाता है — ये दोनों शिशुओं के लिए जानलेवा हो सकते हैं।",
        whyNeeded:
          "भारत में टीबी का बोझ दुनिया में सबसे अधिक है। शिशुओं की प्रतिरक्षा प्रणाली अभी पूरी तरह विकसित नहीं होती, इसलिए जन्म के समय दिया गया BCG गंभीर और पूरे शरीर में फैलने वाली टीबी से शुरुआती सुरक्षा प्रदान करता है।",
        keyFacts: [
          "बाएं ऊपरी बांह में त्वचा के अंदर एक इंजेक्शन दिया जाता है।",
          "इंजेक्शन वाली जगह पर छोटा निशान या गांठ होना सामान्य है।",
          "इसे आदर्श रूप से जन्म के पहले कुछ दिनों में दिया जाता है।",
        ],
      },
      mr: {
        fullForm: "बॅसिलस कॅलमेट-ग्युरिन",
        protectsAgainst: "क्षयरोग (टीबी)",
        purpose:
          "नवजात बाळांना क्षयरोगाच्या गंभीर प्रकारांपासून, विशेषतः टीबी मेंदुज्वर आणि मिलियरी टीबीपासून संरक्षण देते — हे दोन्ही आजार लहान बाळांसाठी जीवघेणे ठरू शकतात.",
        whyNeeded:
          "भारतात टीबीचा मोठा प्रादुर्भाव आहे. बाळांची रोगप्रतिकारक शक्ती अद्याप पूर्ण विकसित झालेली नसल्यामुळे जन्माच्या वेळी दिली जाणारी BCG लस गंभीर आणि शरीरभर पसरणाऱ्या टीबीपासून सुरुवातीचे संरक्षण देते.",
        keyFacts: [
          "डाव्या वरच्या दंडावर त्वचेच्या आत एक इंजेक्शन दिले जाते.",
          "इंजेक्शनच्या ठिकाणी लहान व्रण किंवा गाठ होणे सामान्य आहे.",
          "आदर्शतः जन्मानंतरच्या पहिल्या काही दिवसांत दिली जाते.",
        ],
      },
      gu: {
        fullForm: "બેસિલસ કેલમેટ–ગ્યુરિન",
        protectsAgainst: "ક્ષયરોગ (ટીબી)",
        purpose:
          "નવજાત શિશુઓને ક્ષયરોગના ગંભીર સ્વરૂપોથી, ખાસ કરીને ટીબી મેનિન્જાઇટિસ અને મિલિયરી ટીબીથી રક્ષણ આપે છે — બંને શિશુઓ માટે જીવલેણ બની શકે છે.",
        whyNeeded:
          "ભારતમાં ટીબીનું પ્રમાણ વિશ્વમાં સૌથી વધુ છે. શિશુઓની રોગપ્રતિકારક શક્તિ હજી સંપૂર્ણ વિકસેલી હોતી નથી, તેથી જન્મ સમયે આપવામાં આવતી BCG રસી ગંભીર અને શરીરમાં ફેલાતા ટીબી સામે શરૂઆતનું રક્ષણ આપે છે.",
        keyFacts: [
          "ડાબા ઉપરના હાથમાં ચામડીની અંદર એક ઇન્જેક્શન આપવામાં આવે છે.",
          "ઇન્જેક્શનની જગ્યાએ નાનો ડાઘ અથવા ગાંઠ થવી સામાન્ય છે.",
          "આદર્શ રીતે જન્મ પછીના પ્રથમ થોડા દિવસોમાં આપવામાં આવે છે.",
        ],
      },
    },
  },

  OPV: {
    fullForm: "Oral Polio Vaccine",
    protectsAgainst: "Poliomyelitis (polio)",
    purpose:
      "Prevents polio — a viral infection that can cause irreversible paralysis, breathing difficulty, and death.",
    whyNeeded:
      "Although India was certified polio-free in 2014, wild poliovirus still circulates in nearby regions. Repeated OPV doses keep community immunity high and prevent re-introduction.",
    keyFacts: [
      "Two drops given orally.",
      "Multiple doses (at birth, 6, 10, 14 weeks + booster) build strong intestinal immunity.",
      "Very safe; mild fever may occasionally occur.",
    ],
    translations: {
      hi: {
        fullForm: "ओरल पोलियो वैक्सीन",
        protectsAgainst: "पोलियोमाइलाइटिस (पोलियो)",
        purpose:
          "पोलियो से बचाता है — यह एक वायरल संक्रमण है जो स्थायी लकवा, सांस लेने में कठिनाई और मृत्यु का कारण बन सकता है।",
        whyNeeded:
          "भारत को 2014 में पोलियो-मुक्त प्रमाणित किया गया था, लेकिन जंगली पोलियो वायरस अभी भी आसपास के कुछ क्षेत्रों में फैलता है। OPV की बार-बार दी जाने वाली खुराक सामुदायिक प्रतिरक्षा को मजबूत रखती है और वायरस के दोबारा आने से बचाती है।",
        keyFacts: [
          "मुंह से दो बूंदें दी जाती हैं।",
          "कई खुराकें (जन्म के समय, 6, 10, 14 सप्ताह और बूस्टर) आंतों में मजबूत प्रतिरक्षा बनाती हैं।",
          "यह बहुत सुरक्षित है; कभी-कभी हल्का बुखार हो सकता है।",
        ],
      },
      mr: {
        fullForm: "तोंडावाटे देण्याची पोलिओ लस",
        protectsAgainst: "पोलिओमायलिटिस (पोलिओ)",
        purpose:
          "पोलिओपासून संरक्षण करते — हा विषाणूजन्य संसर्ग कायमचा पक्षाघात, श्वास घेण्यास त्रास आणि मृत्यू घडवू शकतो.",
        whyNeeded:
          "भारताला 2014 मध्ये पोलिओमुक्त घोषित करण्यात आले, परंतु जंगली पोलिओ विषाणू अजूनही आसपासच्या काही भागांत आढळतो. OPVच्या वारंवार दिल्या जाणाऱ्या मात्रा समुदायातील प्रतिकारशक्ती मजबूत ठेवतात आणि विषाणू पुन्हा येण्यापासून संरक्षण करतात.",
        keyFacts: [
          "तोंडावाटे दोन थेंब दिले जातात.",
          "अनेक मात्रा (जन्माच्या वेळी, 6, 10, 14 आठवडे आणि बूस्टर) आतड्यांमध्ये मजबूत प्रतिकारशक्ती निर्माण करतात.",
          "ही अतिशय सुरक्षित लस आहे; कधीकधी सौम्य ताप येऊ शकतो.",
        ],
      },
      gu: {
        fullForm: "ઓરલ પોલિયો વેક્સિન",
        protectsAgainst: "પોલિયોમાયેલાઇટિસ (પોલિયો)",
        purpose:
          "પોલિયોથી રક્ષણ આપે છે — આ એક વાયરલ ચેપ છે જે કાયમી લકવો, શ્વાસ લેવામાં તકલીફ અને મૃત્યુનું કારણ બની શકે છે.",
        whyNeeded:
          "ભારતને 2014માં પોલિયો મુક્ત જાહેર કરવામાં આવ્યું હતું, પરંતુ જંગલી પોલિયો વાયરસ હજુ પણ નજીકના કેટલાક વિસ્તારોમાં ફેલાય છે. OPVની વારંવાર આપવામાં આવતી માત્રાઓ સમુદાયની રોગપ્રતિકારક શક્તિ મજબૂત રાખે છે અને વાયરસના પુનઃપ્રવેશને અટકાવે છે.",
        keyFacts: [
          "મોં દ્વારા બે ટીપાં આપવામાં આવે છે.",
          "અનેક માત્રાઓ (જન્મ સમયે, 6, 10, 14 અઠવાડિયે અને બૂસ્ટર) આંતરડામાં મજબૂત રોગપ્રતિકારક શક્તિ બનાવે છે.",
          "આ ખૂબ જ સુરક્ષિત રસી છે; ક્યારેક હળવો તાવ આવી શકે છે.",
        ],
      },
    },
  },

  "Hepatitis B": {
    fullForm: "Hepatitis B vaccine",
    protectsAgainst: "Hepatitis B virus (HBV) infection",
    purpose:
      "Prevents hepatitis B — a chronic liver infection that can lead to cirrhosis and liver cancer later in life.",
    whyNeeded:
      "Babies infected at birth have a ~90% chance of developing lifelong chronic hepatitis B. The birth dose blocks mother-to-child transmission and is a cornerstone of prevention.",
    keyFacts: [
      "First (birth) dose ideally given within 24 hours of birth.",
      "Additional doses are included in the Pentavalent vaccine at 6, 10 and 14 weeks.",
      "One of the safest vaccines with decades of proven use.",
    ],
    translations: {
      hi: {
        fullForm: "हेपेटाइटिस बी वैक्सीन",
        protectsAgainst: "हेपेटाइटिस बी वायरस (HBV) संक्रमण",
        purpose:
          "हेपेटाइटिस बी से बचाता है — यह एक दीर्घकालिक यकृत संक्रमण है जो आगे चलकर सिरोसिस और लिवर कैंसर का कारण बन सकता है।",
        whyNeeded:
          "जन्म के समय संक्रमित होने वाले लगभग 90% शिशुओं में जीवनभर रहने वाला क्रॉनिक हेपेटाइटिस बी विकसित हो सकता है। जन्म की खुराक मां से बच्चे में संक्रमण को रोकती है और बचाव का एक महत्वपूर्ण हिस्सा है।",
        keyFacts: [
          "पहली (जन्म की) खुराक आदर्श रूप से जन्म के 24 घंटे के भीतर दी जाती है।",
          "अतिरिक्त खुराकें 6, 10 और 14 सप्ताह में पेंटावैलेंट वैक्सीन में शामिल होती हैं।",
          "दशकों से प्रमाणित उपयोग वाली सबसे सुरक्षित वैक्सीनों में से एक है।",
        ],
      },
      mr: {
        fullForm: "हेपेटायटिस बी लस",
        protectsAgainst: "हेपेटायटिस बी विषाणू (HBV) संसर्ग",
        purpose:
          "हेपेटायटिस बीपासून संरक्षण करते — हा दीर्घकालीन यकृताचा संसर्ग असून पुढे सिरोसिस आणि यकृताचा कर्करोग होऊ शकतो.",
        whyNeeded:
          "जन्माच्या वेळी संक्रमित झालेल्या सुमारे 90% बाळांना आयुष्यभर राहणारा क्रॉनिक हेपेटायटिस बी होऊ शकतो. जन्माच्या वेळी दिलेली मात्रा आईकडून बाळाकडे होणारा संसर्ग रोखते आणि प्रतिबंधाचा महत्त्वाचा भाग आहे.",
        keyFacts: [
          "पहिली (जन्माची) मात्रा आदर्शतः जन्मानंतर 24 तासांच्या आत दिली जाते.",
          "अतिरिक्त मात्रा 6, 10 आणि 14 आठवड्यांना पेंटाव्हॅलेंट लसीमध्ये समाविष्ट असतात.",
          "अनेक दशकांच्या सिद्ध वापरासह ही सर्वात सुरक्षित लसींपैकी एक आहे.",
        ],
      },
      gu: {
        fullForm: "હેપેટાઇટિસ બી રસી",
        protectsAgainst: "હેપેટાઇટિસ બી વાયરસ (HBV) ચેપ",
        purpose:
          "હેપેટાઇટિસ બીથી રક્ષણ આપે છે — આ લાંબા સમય સુધી રહેતો યકૃતનો ચેપ છે જે આગળ જતાં સિરોસિસ અને લિવર કેન્સરનું કારણ બની શકે છે.",
        whyNeeded:
          "જન્મ સમયે ચેપ લાગેલા લગભગ 90% શિશુઓમાં જીવનભર રહેતો ક્રોનિક હેપેટાઇટિસ બી વિકસી શકે છે. જન્મ સમયે આપવામાં આવતી માત્રા માતાથી બાળકમાં થતા ચેપને રોકે છે અને બચાવનો મહત્વપૂર્ણ ભાગ છે.",
        keyFacts: [
          "પ્રથમ (જન્મની) માત્રા આદર્શ રીતે જન્મના 24 કલાકની અંદર આપવામાં આવે છે.",
          "વધારાની માત્રાઓ 6, 10 અને 14 અઠવાડિયે પેન્ટાવેલેન્ટ રસીમાં સામેલ હોય છે.",
          "દાયકાઓથી સાબિત થયેલા ઉપયોગ સાથે આ સૌથી સુરક્ષિત રસીઓમાંની એક છે.",
        ],
      },
    },
  },

  Pentavalent: {
    fullForm: "Pentavalent vaccine (DPT + HepB + Hib)",
    protectsAgainst:
      "Diphtheria, Pertussis (whooping cough), Tetanus, Hepatitis B, and Haemophilus influenzae type b",
    purpose:
      "A single injection that protects against five serious childhood infections in one shot — reducing the total number of injections a baby receives.",
    whyNeeded:
      "Each of these diseases can be fatal in infants: diphtheria can block the airway, pertussis causes severe coughing spells, tetanus causes lockjaw, hepatitis B damages the liver, and Hib can cause meningitis.",
    keyFacts: [
      "Injected in the outer thigh at 6, 10 and 14 weeks.",
      "Mild fever and soreness at the injection site are common for 1–2 days.",
      "Replaces the older DPT-only shot for better protection with fewer visits.",
    ],
    translations: {
      hi: {
        fullForm: "पेंटावैलेंट वैक्सीन (DPT + HepB + Hib)",
        protectsAgainst:
          "डिप्थीरिया, पर्टुसिस (काली खांसी), टेटनस, हेपेटाइटिस बी और हीमोफिलस इन्फ्लुएंजा टाइप बी",
        purpose:
          "एक ही इंजेक्शन पांच गंभीर बचपन के संक्रमणों से सुरक्षा देता है — इससे बच्चे को लगने वाले कुल इंजेक्शनों की संख्या कम होती है।",
        whyNeeded:
          "इनमें से प्रत्येक बीमारी शिशुओं के लिए जानलेवा हो सकती है: डिप्थीरिया सांस की नली को अवरुद्ध कर सकता है, पर्टुसिस में तेज खांसी होती है, टेटनस में जबड़ा जकड़ सकता है, हेपेटाइटिस बी लिवर को नुकसान पहुंचाता है और Hib मेनिन्जाइटिस का कारण बन सकता है।",
        keyFacts: [
          "6, 10 और 14 सप्ताह में जांघ के बाहरी हिस्से में इंजेक्शन दिया जाता है।",
          "1–2 दिनों तक हल्का बुखार और इंजेक्शन वाली जगह पर दर्द सामान्य है।",
          "कम बार अस्पताल जाने के साथ बेहतर सुरक्षा के लिए पुराने केवल-DPT इंजेक्शन की जगह इसका उपयोग किया जाता है।",
        ],
      },
      mr: {
        fullForm: "पेंटाव्हॅलेंट लस (DPT + HepB + Hib)",
        protectsAgainst:
          "डिप्थीरिया, पर्ट्युसिस (डांग्या खोकला), टिटॅनस, हेपेटायटिस बी आणि हिमोफिलस इन्फ्लुएंझा प्रकार बी",
        purpose:
          "एकाच इंजेक्शनद्वारे बालपणातील पाच गंभीर संसर्गांपासून संरक्षण मिळते — त्यामुळे बाळाला द्याव्या लागणाऱ्या एकूण इंजेक्शनची संख्या कमी होते.",
        whyNeeded:
          "यातील प्रत्येक आजार बाळांसाठी जीवघेणा ठरू शकतो: डिप्थीरियामुळे श्वसनमार्ग बंद होऊ शकतो, पर्ट्युसिसमुळे तीव्र खोकला होतो, टिटॅनसमुळे जबडा आखडतो, हेपेटायटिस बी यकृताला नुकसान पोहोचवतो आणि Hib मुळे मेंदुज्वर होऊ शकतो.",
        keyFacts: [
          "6, 10 आणि 14 आठवड्यांना मांडीच्या बाहेरील भागात इंजेक्शन दिले जाते.",
          "1–2 दिवस सौम्य ताप आणि इंजेक्शनच्या ठिकाणी दुखणे सामान्य आहे.",
          "कमी भेटींमध्ये चांगले संरक्षण मिळावे म्हणून जुन्या फक्त-DPT इंजेक्शनची जागा घेते.",
        ],
      },
      gu: {
        fullForm: "પેન્ટાવેલેન્ટ રસી (DPT + HepB + Hib)",
        protectsAgainst:
          "ડિફ્થેરિયા, પર્ટ્યુસિસ (ઉધરસ), ટિટનસ, હેપેટાઇટિસ બી અને હીમોફિલસ ઇન્ફ્લુએન્ઝા પ્રકાર બી",
        purpose:
          "એક જ ઇન્જેક્શનથી બાળપણના પાંચ ગંભીર ચેપ સામે રક્ષણ આપે છે — તેથી બાળકને આપવામાં આવતા કુલ ઇન્જેક્શનની સંખ્યા ઘટે છે.",
        whyNeeded:
          "આ દરેક રોગ શિશુઓ માટે જીવલેણ બની શકે છે: ડિફ્થેરિયા શ્વાસની નળી બંધ કરી શકે છે, પર્ટ્યુસિસમાં ગંભીર ઉધરસ થાય છે, ટિટનસમાં જડબું જકડાઈ શકે છે, હેપેટાઇટિસ બી લિવરને નુકસાન પહોંચાડે છે અને Hib મેનિન્જાઇટિસનું કારણ બની શકે છે.",
        keyFacts: [
          "6, 10 અને 14 અઠવાડિયે જાંઘના બહારના ભાગમાં ઇન્જેક્શન આપવામાં આવે છે.",
          "1–2 દિવસ સુધી હળવો તાવ અને ઇન્જેક્શનની જગ્યાએ દુખાવો સામાન્ય છે.",
          "ઓછી મુલાકાતોમાં વધુ સારું રક્ષણ આપવા માટે જૂના માત્ર-DPT ઇન્જેક્શનની જગ્યાએ તેનો ઉપયોગ થાય છે.",
        ],
      },
    },
  },

  Rotavirus: {
    fullForm: "Rotavirus vaccine (Rotavac / RotaSIIL)",
    protectsAgainst: "Severe rotavirus diarrhea and dehydration",
    purpose:
      "Prevents the most common cause of severe, dehydrating diarrhea in infants under 2 years of age.",
    whyNeeded:
      "Rotavirus diarrhea causes tens of thousands of infant hospitalisations in India each year. The vaccine dramatically reduces severe episodes and diarrhea-related deaths.",
    keyFacts: [
      "Given as oral drops — no injection needed.",
      "Three doses at 6, 10 and 14 weeks.",
      "The first dose must be given before 15 weeks of age.",
    ],
    translations: {
      hi: {
        fullForm: "रोटावायरस वैक्सीन (Rotavac / RotaSIIL)",
        protectsAgainst: "गंभीर रोटावायरस दस्त और निर्जलीकरण",
        purpose:
          "2 वर्ष से कम उम्र के शिशुओं में गंभीर और निर्जलीकरण वाले दस्त के सबसे सामान्य कारण से बचाता है।",
        whyNeeded:
          "रोटावायरस के कारण भारत में हर वर्ष हजारों शिशुओं को अस्पताल में भर्ती होना पड़ता है। यह वैक्सीन गंभीर संक्रमण और दस्त से होने वाली मौतों को काफी कम करती है।",
        keyFacts: [
          "मुंह से बूंदों के रूप में दी जाती है — इंजेक्शन की आवश्यकता नहीं होती।",
          "6, 10 और 14 सप्ताह में तीन खुराकें दी जाती हैं।",
          "पहली खुराक 15 सप्ताह की उम्र से पहले दी जानी चाहिए।",
        ],
      },
      mr: {
        fullForm: "रोटाव्हायरस लस (Rotavac / RotaSIIL)",
        protectsAgainst: "गंभीर रोटाव्हायरस अतिसार आणि निर्जलीकरण",
        purpose:
          "2 वर्षांखालील बाळांमध्ये गंभीर आणि निर्जलीकरण करणाऱ्या अतिसाराच्या सर्वात सामान्य कारणापासून संरक्षण करते.",
        whyNeeded:
          "रोटाव्हायरसमुळे भारतात दरवर्षी हजारो बाळांना रुग्णालयात दाखल करावे लागते. ही लस गंभीर आजाराचे प्रसंग आणि अतिसारामुळे होणारे मृत्यू मोठ्या प्रमाणात कमी करते.",
        keyFacts: [
          "तोंडावाटे थेंब दिले जातात — इंजेक्शनची गरज नाही.",
          "6, 10 आणि 14 आठवड्यांना तीन मात्रा दिल्या जातात.",
          "पहिली मात्रा 15 आठवड्यांच्या वयापूर्वी दिली पाहिजे.",
        ],
      },
      gu: {
        fullForm: "રોટાવાયરસ રસી (Rotavac / RotaSIIL)",
        protectsAgainst: "ગંભીર રોટાવાયરસ ઝાડા અને ડિહાઇડ્રેશન",
        purpose:
          "2 વર્ષથી ઓછી ઉંમરના શિશુઓમાં ગંભીર અને ડિહાઇડ્રેશન કરનારા ઝાડાના સૌથી સામાન્ય કારણથી રક્ષણ આપે છે.",
        whyNeeded:
          "રોટાવાયરસને કારણે ભારતમાં દર વર્ષે હજારો શિશુઓને હોસ્પિટલમાં દાખલ કરવા પડે છે. આ રસી ગંભીર બીમારીના કિસ્સાઓ અને ઝાડાને કારણે થતા મૃત્યુમાં નોંધપાત્ર ઘટાડો કરે છે.",
        keyFacts: [
          "મોં દ્વારા ટીપાં તરીકે આપવામાં આવે છે — ઇન્જેક્શનની જરૂર નથી.",
          "6, 10 અને 14 અઠવાડિયે ત્રણ માત્રાઓ આપવામાં આવે છે.",
          "પ્રથમ માત્રા 15 અઠવાડિયાની ઉંમર પહેલાં આપવી જરૂરી છે.",
        ],
      },
    },
  },

  IPV: {
    fullForm: "Inactivated Polio Vaccine",
    protectsAgainst: "All three types of poliovirus",
    purpose:
      "Adds a second, injectable layer of polio protection alongside OPV — especially against type 2 poliovirus.",
    whyNeeded:
      "IPV produces strong blood immunity that OPV alone cannot, closing the last remaining protection gaps as the world moves towards polio eradication.",
    keyFacts: [
      "Given as a small intradermal injection in the upper arm.",
      "Two fractional doses at 6 and 14 weeks under UIP.",
      "Safe to give alongside all other routine vaccines.",
    ],
    translations: {
      hi: {
        fullForm: "निष्क्रिय पोलियो वैक्सीन",
        protectsAgainst: "पोलियो वायरस के तीनों प्रकार",
        purpose:
          "OPV के साथ पोलियो से सुरक्षा की दूसरी, इंजेक्शन वाली परत जोड़ता है — विशेष रूप से टाइप 2 पोलियो वायरस के खिलाफ।",
        whyNeeded:
          "IPV रक्त में मजबूत प्रतिरक्षा बनाता है जो केवल OPV से नहीं बनती, जिससे पोलियो उन्मूलन की दिशा में सुरक्षा की शेष कमियां कम होती हैं।",
        keyFacts: [
          "ऊपरी बांह में त्वचा के अंदर छोटा इंजेक्शन दिया जाता है।",
          "UIP के तहत 6 और 14 सप्ताह में दो फ्रैक्शनल खुराकें दी जाती हैं।",
          "अन्य सभी नियमित टीकों के साथ देना सुरक्षित है।",
        ],
      },
      mr: {
        fullForm: "निष्क्रिय पोलिओ लस",
        protectsAgainst: "पोलिओ विषाणूचे तिन्ही प्रकार",
        purpose:
          "OPVसोबत पोलिओपासून संरक्षणाचा दुसरा, इंजेक्शनद्वारे दिला जाणारा स्तर जोडते — विशेषतः प्रकार 2 पोलिओ विषाणूपासून.",
        whyNeeded:
          "IPV रक्तामध्ये मजबूत प्रतिकारशक्ती निर्माण करते जी केवळ OPVमुळे मिळत नाही. त्यामुळे पोलिओ निर्मूलनाच्या दिशेने उरलेल्या संरक्षणातील त्रुटी कमी होतात.",
        keyFacts: [
          "वरच्या दंडावर त्वचेच्या आत छोटा इंजेक्शन दिला जातो.",
          "UIP अंतर्गत 6 आणि 14 आठवड्यांना दोन फ्रॅक्शनल मात्रा दिल्या जातात.",
          "इतर सर्व नियमित लसींसोबत देणे सुरक्षित आहे.",
        ],
      },
      gu: {
        fullForm: "નિષ્ક્રિય પોલિયો રસી",
        protectsAgainst: "પોલિયો વાયરસના ત્રણેય પ્રકાર",
        purpose:
          "OPV સાથે પોલિયોથી રક્ષણનું બીજું, ઇન્જેક્શન દ્વારા આપવામાં આવતું સ્તર ઉમેરે છે — ખાસ કરીને પ્રકાર 2 પોલિયો વાયરસ સામે.",
        whyNeeded:
          "IPV લોહીમાં મજબૂત રોગપ્રતિકારક શક્તિ બનાવે છે જે માત્ર OPVથી મેળવી શકાતી નથી. તે પોલિયો નાબૂદી તરફ આગળ વધતી વખતે બાકી રહેલી રક્ષણની ખામીઓ ઘટાડે છે.",
        keyFacts: [
          "ઉપરના હાથમાં ચામડીની અંદર નાનું ઇન્જેક્શન આપવામાં આવે છે.",
          "UIP હેઠળ 6 અને 14 અઠવાડિયે બે ફ્રેક્શનલ માત્રાઓ આપવામાં આવે છે.",
          "અન્ય તમામ નિયમિત રસીઓ સાથે આપવી સુરક્ષિત છે.",
        ],
      },
    },
  },

  PCV: {
    fullForm: "Pneumococcal Conjugate Vaccine",
    protectsAgainst:
      "Pneumococcal disease — pneumonia, meningitis, sepsis and severe ear infections",
    purpose:
      "Prevents infections caused by Streptococcus pneumoniae, a leading cause of childhood pneumonia and meningitis deaths in India.",
    whyNeeded:
      "Pneumonia is the single largest infectious killer of children under five worldwide. PCV substantially reduces severe pneumonia and its complications.",
    keyFacts: [
      "Primary doses at 6 and 14 weeks; booster at 9 months.",
      "Injected into the outer thigh.",
      "May cause mild fever and reduced appetite for a day.",
    ],
    translations: {
      hi: {
        fullForm: "न्यूमोकोकल कॉन्जुगेट वैक्सीन",
        protectsAgainst:
          "न्यूमोकोकल रोग — निमोनिया, मेनिन्जाइटिस, सेप्सिस और गंभीर कान के संक्रमण",
        purpose:
          "Streptococcus pneumoniae से होने वाले संक्रमणों से बचाता है, जो भारत में बच्चों में निमोनिया और मेनिन्जाइटिस से होने वाली मौतों के प्रमुख कारणों में से एक है।",
        whyNeeded:
          "दुनिया भर में पांच वर्ष से कम उम्र के बच्चों में निमोनिया संक्रामक बीमारी से होने वाली मौतों का सबसे बड़ा कारण है। PCV गंभीर निमोनिया और उसकी जटिलताओं को काफी कम करता है।",
        keyFacts: [
          "मुख्य खुराकें 6 और 14 सप्ताह में तथा बूस्टर 9 महीने में दिया जाता है।",
          "जांघ के बाहरी हिस्से में इंजेक्शन दिया जाता है।",
          "एक दिन तक हल्का बुखार और भूख कम लगना हो सकता है।",
        ],
      },
      mr: {
        fullForm: "न्यूमोकोकल कॉन्जुगेट लस",
        protectsAgainst:
          "न्यूमोकोकल रोग — न्यूमोनिया, मेंदुज्वर, सेप्सिस आणि गंभीर कानाचे संसर्ग",
        purpose:
          "Streptococcus pneumoniae मुळे होणाऱ्या संसर्गांपासून संरक्षण करते. हा भारतातील मुलांमधील न्यूमोनिया आणि मेंदुज्वरामुळे होणाऱ्या मृत्यूंच्या प्रमुख कारणांपैकी एक आहे.",
        whyNeeded:
          "जगभरात पाच वर्षांखालील मुलांमध्ये न्यूमोनिया हा संसर्गजन्य आजारामुळे होणाऱ्या मृत्यूंचे सर्वात मोठे कारण आहे. PCV गंभीर न्यूमोनिया आणि त्याच्या गुंतागुंती मोठ्या प्रमाणात कमी करते.",
        keyFacts: [
          "मुख्य मात्रा 6 आणि 14 आठवड्यांना आणि बूस्टर 9 महिन्यांना दिला जातो.",
          "मांडीच्या बाहेरील भागात इंजेक्शन दिले जाते.",
          "एका दिवसासाठी सौम्य ताप आणि भूक कमी होऊ शकते.",
        ],
      },
      gu: {
        fullForm: "ન્યુમોકોકલ કન્જુગેટ રસી",
        protectsAgainst:
          "ન્યુમોકોકલ રોગ — ન્યુમોનિયા, મેનિન્જાઇટિસ, સેપ્સિસ અને ગંભીર કાનના ચેપ",
        purpose:
          "Streptococcus pneumoniaeથી થતા ચેપથી રક્ષણ આપે છે, જે ભારતમાં બાળકોમાં ન્યુમોનિયા અને મેનિન્જાઇટિસથી થતા મૃત્યુનું એક મુખ્ય કારણ છે.",
        whyNeeded:
          "વિશ્વભરમાં પાંચ વર્ષથી ઓછી ઉંમરના બાળકોમાં ન્યુમોનિયા ચેપી રોગથી થતા મૃત્યુનું સૌથી મોટું કારણ છે. PCV ગંભીર ન્યુમોનિયા અને તેની જટિલતાઓને નોંધપાત્ર રીતે ઘટાડે છે.",
        keyFacts: [
          "મુખ્ય માત્રાઓ 6 અને 14 અઠવાડિયે અને બૂસ્ટર 9 મહિનાએ આપવામાં આવે છે.",
          "જાંઘના બહારના ભાગમાં ઇન્જેક્શન આપવામાં આવે છે.",
          "એક દિવસ માટે હળવો તાવ અને ભૂખમાં ઘટાડો થઈ શકે છે.",
        ],
      },
    },
  },

  "Measles-Rubella": {
    fullForm: "Measles + Rubella vaccine (MR)",
    protectsAgainst: "Measles and Rubella (German measles)",
    purpose:
      "Prevents measles — a highly contagious virus that can cause pneumonia, encephalitis and death — and rubella, which can cause severe birth defects if a pregnant woman is infected.",
    whyNeeded:
      "India is committed to eliminating measles and rubella. Two doses provide near-lifelong immunity for the child and, over time, protect future mothers from passing rubella-related birth defects.",
    keyFacts: [
      "Two doses: at 9–12 months and again at 16–24 months.",
      "Given as a subcutaneous injection on the upper arm.",
      "Mild rash or low-grade fever a week later is normal.",
    ],
    translations: {
      hi: {
        fullForm: "खसरा + रूबेला वैक्सीन (MR)",
        protectsAgainst: "खसरा और रूबेला (जर्मन खसरा)",
        purpose:
          "खसरे से बचाता है — यह अत्यधिक संक्रामक वायरस है जो निमोनिया, एन्सेफलाइटिस और मृत्यु का कारण बन सकता है — तथा रूबेला से भी बचाता है, जो गर्भवती महिला को संक्रमण होने पर गंभीर जन्म दोष पैदा कर सकता है।",
        whyNeeded:
          "भारत खसरा और रूबेला को समाप्त करने के लिए प्रतिबद्ध है। दो खुराकें बच्चे को लगभग जीवनभर की प्रतिरक्षा देती हैं और समय के साथ भविष्य की माताओं को रूबेला से संबंधित जन्म दोषों से बचाने में मदद करती हैं।",
        keyFacts: [
          "दो खुराकें: 9–12 महीने और फिर 16–24 महीने में।",
          "ऊपरी बांह में त्वचा के नीचे इंजेक्शन दिया जाता है।",
          "एक सप्ताह बाद हल्के दाने या हल्का बुखार होना सामान्य है।",
        ],
      },
      mr: {
        fullForm: "गोवर + रुबेला लस (MR)",
        protectsAgainst: "गोवर आणि रुबेला (जर्मन गोवर)",
        purpose:
          "गोवरपासून संरक्षण करते — हा अत्यंत संसर्गजन्य विषाणू असून न्यूमोनिया, मेंदूज्वर आणि मृत्यू घडवू शकतो — तसेच रुबेलापासून संरक्षण करते, ज्यामुळे गर्भवती महिलेला संसर्ग झाल्यास गंभीर जन्मदोष होऊ शकतात.",
        whyNeeded:
          "भारत गोवर आणि रुबेला निर्मूलनासाठी वचनबद्ध आहे. दोन मात्रा मुलाला जवळजवळ आयुष्यभराची प्रतिकारशक्ती देतात आणि पुढे भविष्यातील मातांना रुबेलाशी संबंधित जन्मदोषांपासून संरक्षण करण्यास मदत करतात.",
        keyFacts: [
          "दोन मात्रा: 9–12 महिन्यांना आणि पुन्हा 16–24 महिन्यांना.",
          "वरच्या दंडावर त्वचेखाली इंजेक्शन दिले जाते.",
          "एका आठवड्यानंतर सौम्य पुरळ किंवा हलका ताप येणे सामान्य आहे.",
        ],
      },
      gu: {
        fullForm: "ઓરી + રૂબેલા રસી (MR)",
        protectsAgainst: "ઓરી અને રૂબેલા (જર્મન ઓરી)",
        purpose:
          "ઓરીથી રક્ષણ આપે છે — આ અત્યંત ચેપી વાયરસ છે જે ન્યુમોનિયા, એન્સેફેલાઇટિસ અને મૃત્યુનું કારણ બની શકે છે — અને રૂબેલાથી પણ રક્ષણ આપે છે, જે ગર્ભવતી મહિલાને ચેપ લાગવાથી ગંભીર જન્મજાત ખામીઓનું કારણ બની શકે છે.",
        whyNeeded:
          "ભારત ઓરી અને રૂબેલા નાબૂદ કરવા માટે પ્રતિબદ્ધ છે. બે માત્રાઓ બાળકને લગભગ જીવનભરનું રક્ષણ આપે છે અને સમય જતાં ભવિષ્યની માતાઓને રૂબેલા સંબંધિત જન્મજાત ખામીઓથી બચાવવામાં મદદ કરે છે.",
        keyFacts: [
          "બે માત્રાઓ: 9–12 મહિનાએ અને ફરી 16–24 મહિનાએ.",
          "ઉપરના હાથમાં ચામડીની નીચે ઇન્જેક્શન આપવામાં આવે છે.",
          "એક અઠવાડિયા પછી હળવા ચકામા અથવા હળવો તાવ આવવો સામાન્ય છે.",
        ],
      },
    },
  },

  "Vitamin A": {
    fullForm: "Vitamin A supplementation",
    protectsAgainst: "Vitamin A deficiency, night blindness, and severe infections",
    purpose:
      "Boosts immunity, supports vision and growth, and reduces the severity of measles, diarrhea, and respiratory infections.",
    whyNeeded:
      "Vitamin A deficiency remains a public-health concern in parts of India. Regular supplementation from 9 months to 5 years significantly reduces childhood mortality.",
    keyFacts: [
      "Given as an oral syrup — not an injection.",
      "First dose at 9 months, then every 6 months up to 5 years (up to 9 doses total).",
      "Very safe; a slight loose motion may occur once.",
    ],
    translations: {
      hi: {
        fullForm: "विटामिन A अनुपूरण",
        protectsAgainst:
          "विटामिन A की कमी, रतौंधी और गंभीर संक्रमण",
        purpose:
          "प्रतिरक्षा को मजबूत करता है, दृष्टि और विकास में सहायता करता है तथा खसरा, दस्त और श्वसन संक्रमण की गंभीरता को कम करता है।",
        whyNeeded:
          "भारत के कुछ हिस्सों में विटामिन A की कमी अभी भी सार्वजनिक स्वास्थ्य की चिंता है। 9 महीने से 5 वर्ष की उम्र तक नियमित अनुपूरण से बचपन में होने वाली मृत्यु को काफी कम किया जा सकता है।",
        keyFacts: [
          "मुंह से सिरप के रूप में दिया जाता है — इंजेक्शन नहीं।",
          "पहली खुराक 9 महीने में, फिर 5 वर्ष तक हर 6 महीने में (कुल 9 खुराक तक)।",
          "बहुत सुरक्षित है; कभी-कभी हल्का दस्त हो सकता है।",
        ],
      },
      mr: {
        fullForm: "व्हिटॅमिन A पूरक आहार",
        protectsAgainst:
          "व्हिटॅमिन Aची कमतरता, रातांधळेपणा आणि गंभीर संसर्ग",
        purpose:
          "प्रतिकारशक्ती वाढवते, दृष्टी आणि वाढीस मदत करते तसेच गोवर, अतिसार आणि श्वसनाच्या संसर्गांची तीव्रता कमी करते.",
        whyNeeded:
          "भारताच्या काही भागांत व्हिटॅमिन Aची कमतरता अजूनही सार्वजनिक आरोग्याची समस्या आहे. 9 महिन्यांपासून 5 वर्षांपर्यंत नियमित पूरक मात्रा दिल्याने बालमृत्यू मोठ्या प्रमाणात कमी होऊ शकतो.",
        keyFacts: [
          "तोंडावाटे सिरपच्या स्वरूपात दिले जाते — इंजेक्शन नाही.",
          "पहिली मात्रा 9 महिन्यांना, त्यानंतर 5 वर्षांपर्यंत दर 6 महिन्यांनी (एकूण 9 मात्रांपर्यंत).",
          "अतिशय सुरक्षित आहे; कधीकधी थोडा जुलाब होऊ शकतो.",
        ],
      },
      gu: {
        fullForm: "વિટામિન A પૂરક",
        protectsAgainst:
          "વિટામિન Aની ઉણપ, રતાંધળાપણું અને ગંભીર ચેપ",
        purpose:
          "રોગપ્રતિકારક શક્તિ વધારે છે, દ્રષ્ટિ અને વિકાસમાં મદદ કરે છે અને ઓરી, ઝાડા તથા શ્વસન ચેપની ગંભીરતા ઘટાડે છે.",
        whyNeeded:
          "ભારતના કેટલાક વિસ્તારોમાં વિટામિન Aની ઉણપ હજુ પણ જાહેર આરોગ્યની ચિંતા છે. 9 મહિનાથી 5 વર્ષ સુધી નિયમિત પૂરક આપવાથી બાળમૃત્યુમાં નોંધપાત્ર ઘટાડો થઈ શકે છે.",
        keyFacts: [
          "મોં દ્વારા સિરપ તરીકે આપવામાં આવે છે — ઇન્જેક્શન નથી.",
          "પ્રથમ માત્રા 9 મહિનાએ, ત્યારબાદ 5 વર્ષ સુધી દર 6 મહિને (કુલ 9 માત્રા સુધી).",
          "ખૂબ સુરક્ષિત છે; ક્યારેક થોડો ઝાડો થઈ શકે છે.",
        ],
      },
    },
  },

  JE: {
    fullForm: "Japanese Encephalitis vaccine",
    protectsAgainst:
      "Japanese Encephalitis — a mosquito-borne viral brain infection",
    purpose:
      "Prevents Japanese Encephalitis, which can cause seizures, lifelong brain damage or death, especially in children in endemic districts.",
    whyNeeded:
      "JE is endemic in many eastern and southern Indian districts. Vaccination is the only reliable way to prevent it in children living in those areas.",
    keyFacts: [
      "Given only in JE-endemic districts under UIP.",
      "Two doses: at 9–12 months and 16–24 months.",
      "Very safe; occasional mild fever and soreness may occur.",
    ],
    translations: {
      hi: {
        fullForm: "जापानी एन्सेफलाइटिस वैक्सीन",
        protectsAgainst:
          "जापानी एन्सेफलाइटिस — मच्छरों से फैलने वाला वायरल मस्तिष्क संक्रमण",
        purpose:
          "जापानी एन्सेफलाइटिस से बचाता है, जो विशेष रूप से स्थानिक जिलों में बच्चों में दौरे, जीवनभर मस्तिष्क क्षति या मृत्यु का कारण बन सकता है।",
        whyNeeded:
          "भारत के कई पूर्वी और दक्षिणी जिलों में JE स्थानिक है। इन क्षेत्रों में रहने वाले बच्चों को इससे बचाने का टीकाकरण ही सबसे विश्वसनीय तरीका है।",
        keyFacts: [
          "UIP के तहत केवल JE-स्थानिक जिलों में दिया जाता है।",
          "दो खुराकें: 9–12 महीने और 16–24 महीने में।",
          "बहुत सुरक्षित है; कभी-कभी हल्का बुखार और दर्द हो सकता है।",
        ],
      },
      mr: {
        fullForm: "जपानी एन्सेफलायटिस लस",
        protectsAgainst:
          "जपानी एन्सेफलायटिस — डासांद्वारे पसरणारा विषाणूजन्य मेंदूचा संसर्ग",
        purpose:
          "जपानी एन्सेफलायटिसपासून संरक्षण करते. हा आजार विशेषतः स्थानिक जिल्यांमधील मुलांमध्ये झटके, आयुष्यभर मेंदूचे नुकसान किंवा मृत्यू घडवू शकतो.",
        whyNeeded:
          "भारताच्या अनेक पूर्व आणि दक्षिणेकडील जिल्यांमध्ये JE स्थानिक आहे. त्या भागात राहणाऱ्या मुलांना यापासून वाचवण्याचा लसीकरण हा सर्वात विश्वासार्ह मार्ग आहे.",
        keyFacts: [
          "UIP अंतर्गत फक्त JE-स्थानिक जिल्यांमध्ये दिली जाते.",
          "दोन मात्रा: 9–12 महिने आणि 16–24 महिन्यांना.",
          "अतिशय सुरक्षित आहे; कधीकधी सौम्य ताप आणि दुखणे होऊ शकते.",
        ],
      },
      gu: {
        fullForm: "જાપાનીઝ એન્સેફેલાઇટિસ રસી",
        protectsAgainst:
          "જાપાનીઝ એન્સેફેલાઇટિસ — મચ્છર દ્વારા ફેલાતો વાયરલ મગજનો ચેપ",
        purpose:
          "જાપાનીઝ એન્સેફેલાઇટિસથી રક્ષણ આપે છે, જે ખાસ કરીને રોગપ્રચલિત જિલ્લાઓમાં બાળકોમાં આંચકા, જીવનભર મગજને નુકસાન અથવા મૃત્યુનું કારણ બની શકે છે.",
        whyNeeded:
          "ભારતના ઘણા પૂર્વ અને દક્ષિણ જિલ્લાઓમાં JE સામાન્ય છે. આ વિસ્તારોમાં રહેતા બાળકોને તેનાથી બચાવવાનો સૌથી વિશ્વસનીય રસ્તો રસીકરણ છે.",
        keyFacts: [
          "UIP હેઠળ માત્ર JE-રોગપ્રચલિત જિલ્લાઓમાં આપવામાં આવે છે.",
          "બે માત્રાઓ: 9–12 મહિને અને 16–24 મહિને.",
          "ખૂબ સુરક્ષિત છે; ક્યારેક હળવો તાવ અને દુખાવો થઈ શકે છે.",
        ],
      },
    },
  },

  DPT: {
    fullForm: "Diphtheria, Pertussis, Tetanus booster",
    protectsAgainst: "Diphtheria, Pertussis (whooping cough), and Tetanus",
    purpose:
      "Reinforces immunity built by the earlier Pentavalent doses so protection against these three diseases lasts through the school years.",
    whyNeeded:
      "Immunity from infant doses fades over time. Boosters at 16–24 months and 5–6 years maintain strong protection during peak exposure years at school.",
    keyFacts: [
      "First booster at 16–24 months, second at 5–6 years.",
      "Injected in the upper arm.",
      "Injection-site tenderness for 1–2 days is common.",
    ],
    translations: {
      hi: {
        fullForm: "डिप्थीरिया, पर्टुसिस, टेटनस बूस्टर",
        protectsAgainst: "डिप्थीरिया, पर्टुसिस (काली खांसी) और टेटनस",
        purpose:
          "पहले दी गई पेंटावैलेंट खुराकों से बनी प्रतिरक्षा को मजबूत करता है ताकि इन तीनों बीमारियों से सुरक्षा स्कूल के वर्षों तक बनी रहे।",
        whyNeeded:
          "शिशु अवस्था में दी गई खुराकों से बनी प्रतिरक्षा समय के साथ कम हो सकती है। 16–24 महीने और 5–6 वर्ष में बूस्टर स्कूल के वर्षों में मजबूत सुरक्षा बनाए रखते हैं।",
        keyFacts: [
          "पहला बूस्टर 16–24 महीने में और दूसरा 5–6 वर्ष में।",
          "ऊपरी बांह में इंजेक्शन दिया जाता है।",
          "1–2 दिनों तक इंजेक्शन वाली जगह पर दर्द होना सामान्य है।",
        ],
      },
      mr: {
        fullForm: "डिप्थीरिया, पर्ट्युसिस, टिटॅनस बूस्टर",
        protectsAgainst: "डिप्थीरिया, पर्ट्युसिस (डांग्या खोकला) आणि टिटॅनस",
        purpose:
          "पूर्वी दिलेल्या पेंटाव्हॅलेंट मात्रांमुळे तयार झालेली प्रतिकारशक्ती मजबूत करते, ज्यामुळे या तीन आजारांपासून संरक्षण शालेय वर्षांपर्यंत टिकते.",
        whyNeeded:
          "लहानपणी दिलेल्या मात्रांमुळे मिळालेली प्रतिकारशक्ती कालांतराने कमी होऊ शकते. 16–24 महिने आणि 5–6 वर्षांतील बूस्टर शाळेच्या काळात मजबूत संरक्षण टिकवून ठेवतात.",
        keyFacts: [
          "पहिला बूस्टर 16–24 महिन्यांना आणि दुसरा 5–6 वर्षांना.",
          "वरच्या दंडावर इंजेक्शन दिले जाते.",
          "1–2 दिवस इंजेक्शनच्या ठिकाणी दुखणे सामान्य आहे.",
        ],
      },
      gu: {
        fullForm: "ડિફ્થેરિયા, પર્ટ્યુસિસ, ટિટનસ બૂસ્ટર",
        protectsAgainst: "ડિફ્થેરિયા, પર્ટ્યુસિસ (ઉધરસ) અને ટિટનસ",
        purpose:
          "અગાઉ આપવામાં આવેલી પેન્ટાવેલેન્ટ માત્રાઓથી બનેલી રોગપ્રતિકારક શક્તિને મજબૂત કરે છે જેથી આ ત્રણ રોગો સામેનું રક્ષણ શાળાના વર્ષો સુધી રહે.",
        whyNeeded:
          "શિશુ અવસ્થામાં આપવામાં આવેલી માત્રાઓથી મળતી રોગપ્રતિકારક શક્તિ સમય જતાં ઘટી શકે છે. 16–24 મહિના અને 5–6 વર્ષની ઉંમરે બૂસ્ટર શાળાના વર્ષોમાં મજબૂત રક્ષણ જાળવી રાખે છે.",
        keyFacts: [
          "પ્રથમ બૂસ્ટર 16–24 મહિને અને બીજું 5–6 વર્ષે.",
          "ઉપરના હાથમાં ઇન્જેક્શન આપવામાં આવે છે.",
          "1–2 દિવસ સુધી ઇન્જેક્શનની જગ્યાએ દુખાવો સામાન્ય છે.",
        ],
      },
    },
  },

  Td: {
    fullForm: "Tetanus and reduced-dose Diphtheria vaccine",
    protectsAgainst: "Tetanus and Diphtheria",
    purpose:
      "Keeps immunity strong through adolescence and adulthood, protecting against tetanus from wounds and preventing diphtheria outbreaks.",
    whyNeeded:
      "Tetanus spores are everywhere in soil; any cut can cause fatal infection without immunity. Td replaces the old TT (tetanus-only) vaccine because it also prevents diphtheria's resurgence.",
    keyFacts: [
      "Given at 10 years and again at 16 years.",
      "One small injection in the upper arm.",
      "Especially important before pregnancy to protect future newborns.",
    ],
    translations: {
      hi: {
        fullForm: "टेटनस और कम मात्रा वाली डिप्थीरिया वैक्सीन",
        protectsAgainst: "टेटनस और डिप्थीरिया",
        purpose:
          "किशोरावस्था और वयस्क जीवन में प्रतिरक्षा को मजबूत रखता है, घावों से होने वाले टेटनस से बचाता है और डिप्थीरिया के प्रकोप को रोकने में मदद करता है।",
        whyNeeded:
          "टेटनस के बीजाणु मिट्टी में हर जगह पाए जाते हैं; प्रतिरक्षा न होने पर कोई भी कट जानलेवा संक्रमण का कारण बन सकता है। Td पुराने TT (केवल टेटनस) वैक्सीन की जगह लेता है क्योंकि यह डिप्थीरिया की वापसी को भी रोकता है।",
        keyFacts: [
          "10 वर्ष की उम्र में और फिर 16 वर्ष की उम्र में दिया जाता है।",
          "ऊपरी बांह में एक छोटा इंजेक्शन दिया जाता है।",
          "भविष्य के नवजात शिशुओं की सुरक्षा के लिए गर्भावस्था से पहले विशेष रूप से महत्वपूर्ण है।",
        ],
      },
      mr: {
        fullForm: "टिटॅनस आणि कमी मात्रेची डिप्थीरिया लस",
        protectsAgainst: "टिटॅनस आणि डिप्थीरिया",
        purpose:
          "किशोरावस्था आणि प्रौढत्वात प्रतिकारशक्ती मजबूत ठेवते, जखमांमधून होणाऱ्या टिटॅनसपासून संरक्षण करते आणि डिप्थीरियाचा प्रादुर्भाव रोखण्यास मदत करते.",
        whyNeeded:
          "टिटॅनसचे बीजाणू मातीत सर्वत्र आढळतात; प्रतिकारशक्ती नसल्यास कोणतीही जखम जीवघेण्या संसर्गाचे कारण बनू शकते. Td जुन्या TT (फक्त टिटॅनस) लसीची जागा घेते कारण ती डिप्थीरियाचा पुन्हा होणारा प्रसारही रोखते.",
        keyFacts: [
          "10 वर्षांच्या वयात आणि पुन्हा 16 वर्षांच्या वयात दिली जाते.",
          "वरच्या दंडावर एक छोटा इंजेक्शन दिला जातो.",
          "भविष्यातील नवजात बाळांचे संरक्षण करण्यासाठी गर्भधारणेपूर्वी विशेषतः महत्त्वाची आहे.",
        ],
      },
      gu: {
        fullForm: "ટિટનસ અને ઓછી માત્રાવાળી ડિફ્થેરિયા રસી",
        protectsAgainst: "ટિટનસ અને ડિફ્થેરિયા",
        purpose:
          "કિશોરાવસ્થા અને પુખ્તાવસ્થામાં રોગપ્રતિકારક શક્તિ મજબૂત રાખે છે, ઘાવથી થતા ટિટનસથી રક્ષણ આપે છે અને ડિફ્થેરિયાના ફેલાવાને રોકવામાં મદદ કરે છે.",
        whyNeeded:
          "ટિટનસના બીજાણુઓ જમીનમાં દરેક જગ્યાએ હોય છે; રોગપ્રતિકારક શક્તિ ન હોય તો કોઈપણ કાપ જીવલેણ ચેપનું કારણ બની શકે છે. Td જૂની TT (માત્ર ટિટનસ) રસીની જગ્યાએ છે કારણ કે તે ડિફ્થેરિયાના ફરી ફેલાવાને પણ રોકે છે.",
        keyFacts: [
          "10 વર્ષની ઉંમરે અને ફરી 16 વર્ષની ઉંમરે આપવામાં આવે છે.",
          "ઉપરના હાથમાં એક નાનું ઇન્જેક્શન આપવામાં આવે છે.",
          "ભવિષ્યના નવજાત શિશુઓના રક્ષણ માટે ગર્ભાવસ્થા પહેલાં ખાસ મહત્વપૂર્ણ છે.",
        ],
      },
    },
  },
};

export function getVaccineInfo(vaccineName, language = "en") {
  const vaccine = VACCINE_INFO[vaccineName];

  if (!vaccine) return null;

  if (language === "en") {
    return vaccine;
  }

  return vaccine.translations?.[language] || vaccine;
}