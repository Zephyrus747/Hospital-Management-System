export const fmt = {
  currency: (v) =>
    v == null
      ? "—"
      : new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(v),
  dt: (v) => (v ? String(v).replace("T", " ").slice(0, 16) : "—"),
  date: (v) => (v ? String(v).slice(0, 10) : "—"),
  ssnMask: (v) => (v ? String(v).slice(-4).padStart(9, "•") : "—"),
  initials: (name) =>
    name
      ? name
          .split(" ")
          .map((w) => w[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "?",
};

export const POSITIONS = [
  "Staff Internist",
  "Attending Physician",
  "Senior Attending Physician",
  "Surgical Attending Physician",
  "Head Chief of Medicine",
  "MD Resident",
  "Attending Psychiatrist",
];

export function isBlank(v) {
  return v === undefined || v === null || String(v).trim() === "";
}
export function toNum(v) {
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}
