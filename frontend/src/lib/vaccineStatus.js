import { UIP_SCHEDULE } from "./vaccineSchedule";

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function computeVaccineStatuses(dobString, vaccinations = []) {
  const dob = new Date(dobString);
  const today = new Date();
  const givenMap = new Map();
  for (const v of vaccinations) {
    givenMap.set(v.vaccine_code, v);
  }

  return UIP_SCHEDULE.map((item) => {
    const given = givenMap.get(item.code);
    const dueDate = addDays(dob, item.dueDays);
    const overdueDate = addDays(dueDate, item.graceDays);
    let status;
    if (given) {
      status = "completed";
    } else if (today < dueDate) {
      status = "upcoming";
    } else if (today <= overdueDate) {
      status = "due";
    } else {
      status = "overdue";
    }
    return { ...item, status, dueDate, overdueDate, record: given || null };
  });
}

export function completionPercent(dobString, vaccinations = []) {
  const items = computeVaccineStatuses(dobString, vaccinations);
  const applicable = items.filter((i) => i.status !== "upcoming");
  if (applicable.length === 0) return 0;
  const done = applicable.filter((i) => i.status === "completed").length;
  return Math.round((done / applicable.length) * 100);
}

export function ageString(dobString) {
  const dob = new Date(dobString);
  const now = new Date();
  const months = (now.getFullYear() - dob.getFullYear()) * 12 + (now.getMonth() - dob.getMonth());
  if (months < 1) {
    const days = Math.max(0, Math.floor((now - dob) / (1000 * 60 * 60 * 24)));
    return `${days} day${days === 1 ? "" : "s"}`;
  }
  if (months < 24) return `${months} month${months === 1 ? "" : "s"}`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  return rem ? `${years}y ${rem}m` : `${years} year${years === 1 ? "" : "s"}`;
}

export function maskAadhaar(a) {
  if (!a) return "—";
  const s = String(a);
  if (s.length < 4) return s;
  return `XXXX XXXX ${s.slice(-4)}`;
}
