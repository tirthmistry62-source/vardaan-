// India Universal Immunization Programme (UIP) schedule.
// Each entry: code (unique), name, dose, dueOffsetDays from DOB, overdueBufferDays.

export const UIP_SCHEDULE = [
  // At Birth
  { code: "BCG",         name: "BCG",               dose: "Single",  milestone: "At Birth",   dueDays: 0,   graceDays: 30 },
  { code: "OPV-0",       name: "OPV",               dose: "Dose 0",  milestone: "At Birth",   dueDays: 0,   graceDays: 15 },
  { code: "HepB-Birth",  name: "Hepatitis B",       dose: "Birth",   milestone: "At Birth",   dueDays: 0,   graceDays: 15 },
  // 6 weeks
  { code: "OPV-1",       name: "OPV",               dose: "Dose 1",  milestone: "6 weeks",    dueDays: 42,  graceDays: 14 },
  { code: "Penta-1",     name: "Pentavalent",       dose: "Dose 1",  milestone: "6 weeks",    dueDays: 42,  graceDays: 14 },
  { code: "Rota-1",      name: "Rotavirus",         dose: "Dose 1",  milestone: "6 weeks",    dueDays: 42,  graceDays: 14 },
  { code: "IPV-1",       name: "IPV",               dose: "Dose 1",  milestone: "6 weeks",    dueDays: 42,  graceDays: 14 },
  { code: "PCV-1",       name: "PCV",               dose: "Dose 1",  milestone: "6 weeks",    dueDays: 42,  graceDays: 14 },
  // 10 weeks
  { code: "OPV-2",       name: "OPV",               dose: "Dose 2",  milestone: "10 weeks",   dueDays: 70,  graceDays: 14 },
  { code: "Penta-2",     name: "Pentavalent",       dose: "Dose 2",  milestone: "10 weeks",   dueDays: 70,  graceDays: 14 },
  { code: "Rota-2",      name: "Rotavirus",         dose: "Dose 2",  milestone: "10 weeks",   dueDays: 70,  graceDays: 14 },
  // 14 weeks
  { code: "OPV-3",       name: "OPV",               dose: "Dose 3",  milestone: "14 weeks",   dueDays: 98,  graceDays: 14 },
  { code: "Penta-3",     name: "Pentavalent",       dose: "Dose 3",  milestone: "14 weeks",   dueDays: 98,  graceDays: 14 },
  { code: "Rota-3",      name: "Rotavirus",         dose: "Dose 3",  milestone: "14 weeks",   dueDays: 98,  graceDays: 14 },
  { code: "IPV-2",       name: "IPV",               dose: "Dose 2",  milestone: "14 weeks",   dueDays: 98,  graceDays: 14 },
  { code: "PCV-2",       name: "PCV",               dose: "Dose 2",  milestone: "14 weeks",   dueDays: 98,  graceDays: 14 },
  // 9-12 months
  { code: "MR-1",        name: "Measles-Rubella",   dose: "Dose 1",  milestone: "9–12 months", dueDays: 270, graceDays: 90 },
  { code: "PCV-B",       name: "PCV",               dose: "Booster", milestone: "9–12 months", dueDays: 270, graceDays: 90 },
  { code: "VitA-1",      name: "Vitamin A",         dose: "Dose 1",  milestone: "9–12 months", dueDays: 270, graceDays: 90 },
  { code: "JE-1",        name: "JE",                dose: "Dose 1",  milestone: "9–12 months", dueDays: 270, graceDays: 90 },
  // 16-24 months
  { code: "DPT-B1",      name: "DPT",               dose: "Booster 1", milestone: "16–24 months", dueDays: 480, graceDays: 240 },
  { code: "OPV-B",       name: "OPV",               dose: "Booster",   milestone: "16–24 months", dueDays: 480, graceDays: 240 },
  { code: "MR-2",        name: "Measles-Rubella",   dose: "Dose 2",    milestone: "16–24 months", dueDays: 480, graceDays: 240 },
  { code: "VitA-2",      name: "Vitamin A",         dose: "Dose 2",    milestone: "16–24 months", dueDays: 480, graceDays: 240 },
  { code: "JE-2",        name: "JE",                dose: "Dose 2",    milestone: "16–24 months", dueDays: 480, graceDays: 240 },
  // 5-6 years
  { code: "DPT-B2",      name: "DPT",               dose: "Booster 2", milestone: "5–6 years",    dueDays: 1825, graceDays: 365 },
  // 10 years
  { code: "Td-10",       name: "Td",                dose: "10 years",  milestone: "10 years",     dueDays: 3650, graceDays: 365 },
  // 16 years
  { code: "Td-16",       name: "Td",                dose: "16 years",  milestone: "16 years",     dueDays: 5840, graceDays: 365 },
];

export const MILESTONES = [
  "At Birth", "6 weeks", "10 weeks", "14 weeks",
  "9–12 months", "16–24 months", "5–6 years", "10 years", "16 years"
];
