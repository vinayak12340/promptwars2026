// logic.js

// --- Pure functions (easy to test) ---
function validateAgeInput(age) {
  if (age === "" || age === null || age === undefined) return { ok: false, msg: "Age is required" };
  const n = Number(age);
  if (Number.isNaN(n)) return { ok: false, msg: "Age must be a number" };
  if (n < 18) return { ok: false, msg: "You must be 18+ to vote" };
  if (n > 120) return { ok: false, msg: "Enter a valid age" };
  return { ok: true, msg: "Valid" };
}

function normalizeQuery(q) {
  return (q || "").trim().toLowerCase();
}

function getQuickSummary() {
  return [
    "Check voter registration",
    "Carry valid ID",
    "Reach polling booth",
    "Use EVM correctly",
    "Verify VVPAT slip"
  ];
}

// export to window for browser tests
window.AppLogic = { validateAgeInput, normalizeQuery, getQuickSummary };
