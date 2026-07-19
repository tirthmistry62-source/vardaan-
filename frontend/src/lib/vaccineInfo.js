// Accurate India UIP vaccine information. Keyed by the base vaccine name
// (matches the `name` field in vaccineSchedule.js).
// Sources: WHO immunization info, MoHFW India UIP guidelines, IAP handbook.

export const VACCINE_INFO = {
  "BCG": {
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
  },
  "OPV": {
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
  },
  "Pentavalent": {
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
  },
  "Rotavirus": {
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
  },
  "IPV": {
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
  },
  "PCV": {
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
  },
  "JE": {
    fullForm: "Japanese Encephalitis vaccine",
    protectsAgainst: "Japanese Encephalitis — a mosquito-borne viral brain infection",
    purpose:
      "Prevents Japanese Encephalitis, which can cause seizures, lifelong brain damage or death, especially in children in endemic districts.",
    whyNeeded:
      "JE is endemic in many eastern and southern Indian districts. Vaccination is the only reliable way to prevent it in children living in those areas.",
    keyFacts: [
      "Given only in JE-endemic districts under UIP.",
      "Two doses: at 9–12 months and 16–24 months.",
      "Very safe; occasional mild fever and soreness may occur.",
    ],
  },
  "DPT": {
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
  },
  "Td": {
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
  },
};

export function getVaccineInfo(vaccineName) {
  return VACCINE_INFO[vaccineName] || null;
}
