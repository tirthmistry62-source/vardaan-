import jsPDF from "jspdf";
import { computeVaccineStatuses } from "./vaccineStatus";

// ─── Colours ──────────────────────────────────────────────────────────────────
const NAVY        = [10,  20,  50];
const NAVY_MID    = [30,  58, 100];
const TEAL        = [13, 148, 136];
const TEAL_BG     = [236, 253, 250];
const TEAL_BORDER = [94, 210, 196];
const AMBER       = [161, 98,   7];
const AMBER_BG    = [255, 251, 235];
const AMBER_BORD  = [245, 185,  45];
const RED         = [185,  28,  28];
const RED_BG      = [254, 242, 242];
const RED_BORD    = [252, 165, 165];
const GREY        = [100, 116, 139];
const GREY_L      = [148, 163, 184];
const WHITE       = [255, 255, 255];
const OFF_WHITE   = [248, 250, 252];
const DIVIDER     = [220, 230, 242];

// ─── Page geometry ────────────────────────────────────────────────────────────
const pageW  = 210;
const pageH  = 297;
const mL     = 11;
const mR     = 11;
const usable = pageW - mL - mR;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
};

const fmtAge = (dob) => {
  const d   = new Date(dob);
  const now = new Date();
  const mo  = (now.getFullYear() - d.getFullYear()) * 12 + now.getMonth() - d.getMonth();
  if (mo < 1)  return `${Math.floor((now - d) / 86400000)} days old`;
  if (mo < 24) return `${mo} months old`;
  const yr = Math.floor(mo / 12);
  const rm = mo % 12;
  return rm ? `${yr} yr ${rm} mo` : `${yr} years old`;
};

// ─── Header — spacious 28 mm ───────────────────────────────────────────────────
const HEADER_H = 28;

function drawHeader(doc, child) {
  doc.setFillColor(...WHITE);
  doc.rect(0, 0, pageW, HEADER_H, "F");

  // Left teal accent (4 mm)
  doc.setFillColor(...TEAL);
  doc.rect(0, 0, 4, HEADER_H, "F");

  // "Vardaan+" — big, navy
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...NAVY);
  doc.text("Vardaan+", mL + 5, 13);

  // "Digital Vaccination Record" — small, grey
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...GREY);
  doc.text("Digital Vaccination Record", mL + 5, 19);

  // Thin teal rule under tagline
  doc.setDrawColor(...TEAL_BORDER);
  doc.setLineWidth(0.35);
  doc.line(mL + 5, 20.8, mL + 58, 20.8);

  // Right — child name + meta (all on two lines)
  const rx = pageW - mR;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...NAVY);
  doc.text(child.name, rx, 12.5, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...GREY);
  const meta = [
    `DOB: ${fmt(child.dob)}`,
    child.gender,
    child.weight_kg ? `${child.weight_kg} kg` : null,
    fmtAge(child.dob),
  ].filter(Boolean).join("  •  ");
  doc.text(meta, rx, 18.5, { align: "right" });

  // Bottom border
  doc.setDrawColor(...DIVIDER);
  doc.setLineWidth(0.4);
  doc.line(0, HEADER_H, pageW, HEADER_H);
}

// ─── Footer — 8 mm ───────────────────────────────────────────────────────────
const FOOTER_H = 8;

function drawFooter(doc, pageNum, totalPages, genDate) {
  const fy = pageH - 3;
  doc.setFillColor(...OFF_WHITE);
  doc.rect(0, pageH - FOOTER_H, pageW, FOOTER_H, "F");
  doc.setDrawColor(...DIVIDER);
  doc.setLineWidth(0.25);
  doc.line(0, pageH - FOOTER_H, pageW, pageH - FOOTER_H);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(...GREY_L);
  doc.text("Generated using Vardaan+  •  Digital health record", mL, fy);
  doc.text(`${genDate}`, pageW / 2, fy, { align: "center" });
  doc.text(`Page ${pageNum} / ${totalPages}`, pageW - mR, fy, { align: "right" });
}

// ─── Section heading — inline ─────────────────────────────────────────────────
function sectionHeading(doc, title, note, y) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(...NAVY_MID);
  doc.text(title.toUpperCase(), mL, y);

  // Teal underline
  doc.setFillColor(...TEAL);
  doc.rect(mL, y + 1.2, 18, 0.8, "F");

  if (note) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...GREY);
    doc.text(note, pageW - mR, y, { align: "right" });
  }
  return y + 4.5;
}

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS = {
  completed: { label: "DONE",     dotC: TEAL,  bgC: TEAL_BG,  borderC: TEAL_BORDER },
  due:       { label: "DUE",      dotC: RED,   bgC: RED_BG,   borderC: RED_BORD    },
  overdue:   { label: "OVERDUE",  dotC: RED,   bgC: RED_BG,   borderC: RED_BORD    },
  upcoming:  { label: "UPCOMING", dotC: AMBER, bgC: AMBER_BG, borderC: AMBER_BORD  },
};

// ─── Vaccine row heights ──────────────────────────────────────────────────────
// completed: needs detail line below → 19 mm
// not completed: name + due inline → 12.5 mm
const ROW_H_DONE  = 19;
const ROW_H_OTHER = 12.5;
const ROW_GAP     = 2;

function drawVaccineRow(doc, item, y, idx) {
  const st     = STATUS[item.status] || STATUS.upcoming;
  const isComp = item.status === "completed";
  const rowH   = isComp ? ROW_H_DONE : ROW_H_OTHER;

  // Card
  doc.setFillColor(...st.bgC);
  doc.setDrawColor(...st.borderC);
  doc.setLineWidth(0.3);
  doc.roundedRect(mL, y, usable, rowH, 2, 2, "FD");

  // Left colour strip (2.5 mm)
  doc.setFillColor(...st.dotC);
  doc.roundedRect(mL, y, 2.5, rowH, 2, 2, "F");
  doc.rect(mL + 1, y, 1.5, rowH, "F");

  // Index
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...GREY_L);
  doc.text(String(idx + 1).padStart(2, "0"), mL + 5, y + rowH / 2 + 1.5, { align: "center" });

  const cx = mL + 9;

  // Vaccine name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...NAVY);
  doc.text(item.name, cx, y + 6);
  
  const nameW = doc.getTextWidth(item.name);

  // Dose inline beside name
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(...GREY);
  doc.text(`—  ${item.dose}`, cx + nameW + 3, y + 6);

  // Right side badges — milestone top, status below
  const rx = pageW - mR;

  // Milestone badge
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  const msText = item.milestone;
  const msW    = doc.getTextWidth(msText) + 4;
  doc.setFillColor(225, 238, 255);
  doc.setDrawColor(170, 200, 245);
  doc.setLineWidth(0.2);
  doc.roundedRect(rx - msW, y + 1.5, msW, 4, 1, 1, "FD");
  doc.setTextColor(55, 95, 165);
  doc.text(msText, rx - msW / 2, y + 4.5, { align: "center" });

  // Status badge
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  const stText = st.label;
  const stW    = doc.getTextWidth(stText) + 5;
  doc.setFillColor(...st.bgC);
  doc.setDrawColor(...st.borderC);
  doc.setLineWidth(0.3);
  doc.roundedRect(rx - stW, y + 6.5, stW, 4.5, 1, 1, "FD");
  doc.setTextColor(...st.dotC);
  doc.text(stText, rx - stW / 2, y + 9.8, { align: "center" });

  if (isComp && item.record) {
    const r = item.record;

    // Thin rule - stretch across the full available width to the right margin
    doc.setDrawColor(...DIVIDER);
    doc.setLineWidth(0.15);
    doc.line(cx, y + 12, rx, y + 12);

    // Three detail columns: DATE | DOCTOR | WEIGHT
    // Use the entire available width instead of stopping before the status badge
    const colW = (rx - cx) / 3;

    const details = [
      { label: "DATE GIVEN",    value: fmt(r.date_given) },
      { label: "DOCTOR",        value: `Dr. ${r.doctor_name || "—"}` },
      { label: "WEIGHT",        value: r.weight_kg ? `${r.weight_kg} kg` : "—" },
    ];

    details.forEach(({ label, value }, i) => {
      const dx = cx + colW * i;
      // Label
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(...GREY);
      doc.text(label, dx, y + 14.5);
      // Value
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...NAVY);
      const val = doc.splitTextToSize(value, colW - 2)[0];
      doc.text(val, dx, y + 17.5);
    });
  } else {
    // Not completed: show due date below
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(...GREY);
    doc.text(`Due: ${fmt(item.dueDate)}`, cx, y + 10.5);
  }
}

// ─── Main export ─────────────────────────────────────────────────────────────
export async function generateVaccinationPDF({ child, parents }) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

  const genDate = new Date().toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  // All vaccines sorted by due date ascending
  const allVaccines = computeVaccineStatuses(child.dob, child.vaccinations || [])
    .sort((a, b) => a.dueDate - b.dueDate);

  const completedCount = allVaccines.filter(v => v.status === "completed").length;
  const dueCount       = allVaccines.filter(v => v.status === "due" || v.status === "overdue").length;
  const upcomingCount  = allVaccines.filter(v => v.status === "upcoming").length;

  // Available content area per page (between header bottom and footer top)
  const contentTop = HEADER_H + 3;
  const contentBot = pageH - FOOTER_H - 2;

  drawHeader(doc, child);
  let curY = contentTop + 3;

  // ── Parents (16 mm for 1, 16 mm for 2 side-by-side) ───────────────────────
  curY = sectionHeading(doc, "Linked Parents / Guardians", null, curY);

  const PAR_H = 16;
  doc.setFillColor(...OFF_WHITE);
  doc.setDrawColor(...DIVIDER);
  doc.setLineWidth(0.25);
  doc.roundedRect(mL, curY, usable, PAR_H, 2, 2, "FD");

  if (parents.length === 0) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(...GREY);
    doc.text("No parent information available.", pageW / 2, curY + 9, { align: "center" });
  } else {
    const half = usable / (parents.length === 2 ? 2 : 1);
    parents.forEach((p, i) => {
      const px = mL + half * i;
      // Avatar circle
      doc.setFillColor(...TEAL);
      doc.circle(px + 6, curY + 8, 3.5, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...WHITE);
      doc.text(p.relation[0], px + 6, curY + 9.3, { align: "center" });
      // Name
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(...NAVY);
      doc.text(p.full_name, px + 12, curY + 7.5);
      // Relation + phone
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(...GREY);
      doc.text(`${p.relation}  •  ${p.phone}`, px + 12, curY + 12.5);
      // Divider between two
      if (i === 0 && parents.length === 2) {
        doc.setDrawColor(...DIVIDER);
        doc.setLineWidth(0.2);
        doc.line(mL + half, curY + 3, mL + half, curY + PAR_H - 3);
      }
    });
  }
  curY += PAR_H + 6;

  // ── Summary strip (14 mm) ──────────────────────────────────────────────────
  const STRIP_H = 14;
  doc.setFillColor(242, 247, 255);
  doc.setDrawColor(...DIVIDER);
  doc.setLineWidth(0.25);
  doc.roundedRect(mL, curY, usable, STRIP_H, 2, 2, "FD");

  const thirds = usable / 3;
  [
    { label: "Completed",     val: completedCount, c: TEAL  },
    { label: "Due / Overdue", val: dueCount,       c: RED   },
    { label: "Upcoming",      val: upcomingCount,  c: AMBER },
  ].forEach(({ label, val, c }, i) => {
    const sx = mL + thirds * i + thirds / 2;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(...c);
    doc.text(String(val), sx, curY + 8, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...GREY);
    doc.text(label, sx, curY + 12, { align: "center" });
    if (i < 2) {
      doc.setDrawColor(...DIVIDER);
      doc.setLineWidth(0.15);
      doc.line(mL + thirds * (i + 1), curY + 2.5, mL + thirds * (i + 1), curY + STRIP_H - 2.5);
    }
  });
  curY += STRIP_H + 6;

  // ── Vaccine schedule — heading + inline legend ─────────────────────────────
  // Section heading left, legend right
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(...NAVY_MID);
  doc.text("VACCINATION SCHEDULE", mL, curY);
  doc.setFillColor(...TEAL);
  doc.rect(mL, curY + 1.2, 22, 0.8, "F");

  // Inline legend (right side of same line)
  const legendItems = [
    { label: "Done",     c: TEAL  },
    { label: "Due",      c: RED   },
    { label: "Upcoming", c: AMBER },
  ];
  let lx = pageW - mR;
  [...legendItems].reverse().forEach(({ label, c }) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...GREY);
    const lw = doc.getTextWidth(label);
    doc.text(label, lx, curY, { align: "right" });
    lx -= lw + 6;
    doc.setFillColor(...c);
    doc.circle(lx + 2, curY - 1.5, 2, "F");
    lx -= 5;
  });

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...GREY);
  doc.text(
    `${allVaccines.length} vaccines  •  sorted by age, earliest first`,
    mL, curY + 5,
  );
  curY += 7.5;

  // ── Vaccine rows ────────────────────────────────────────────────────────────
  allVaccines.forEach((item, idx) => {
    const rowH = item.status === "completed" ? ROW_H_DONE : ROW_H_OTHER;
    if (curY + rowH > contentBot) {
      doc.addPage();
      drawHeader(doc, child);
      curY = contentTop + 3;
    }
    drawVaccineRow(doc, item, curY, idx);
    curY += rowH + ROW_GAP;
  });

  // ── Footers ──────────────────────────────────────────────────────────────
  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    drawFooter(doc, p, total, genDate);
  }

  return doc;
}
