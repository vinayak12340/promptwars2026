// tests.js

function assertEqual(actual, expected, name) {
  if (JSON.stringify(actual) === JSON.stringify(expected)) {
    console.log("✅", name);
  } else {
    console.error("❌", name, "\\nExpected:", expected, "\\nGot:", actual);
  }
}

function runUnitTests() {
  const { validateAgeInput, normalizeQuery, getQuickSummary } = window.AppLogic;

  console.log("--- RUNNING UNIT TESTS ---");
  // --- validateAgeInput tests ---
  assertEqual(validateAgeInput(""), { ok: false, msg: "Age is required" }, "Empty age");
  assertEqual(validateAgeInput("abc"), { ok: false, msg: "Age must be a number" }, "Non-number age");
  assertEqual(validateAgeInput("16"), { ok: false, msg: "You must be 18+ to vote" }, "Underage");
  assertEqual(validateAgeInput("200"), { ok: false, msg: "Enter a valid age" }, "Too large age");
  assertEqual(validateAgeInput("20"), { ok: true, msg: "Valid" }, "Valid age");

  // --- normalizeQuery tests ---
  assertEqual(normalizeQuery("  Hello "), "hello", "Normalize trims & lowers");

  // --- quick summary ---
  const summary = getQuickSummary();
  assertEqual(Array.isArray(summary), true, "Summary is array");
  assertEqual(summary.length >= 3, true, "Summary length >= 3");
  console.log("--- UNIT TESTS COMPLETE ---");
}

function runUITests() {
  console.log("--- RUNNING UI TESTS ---");
  // Our actual DOM elements from the Onboarding Modal
  const ageInput = document.getElementById("user-age");
  const errorEl = document.getElementById("onboarding-error-msg") || { innerText: "" };
  
  if(!ageInput) {
    console.error("UI Tests failed: Could not find onboarding elements.");
    return;
  }

  // We temporarily hijack the errorEl if it doesn't exist, just for the test
  let tempErrorEl = errorEl;
  if (!document.getElementById("onboarding-error-msg")) {
      tempErrorEl = document.createElement("p");
      tempErrorEl.id = "onboarding-error-msg";
      ageInput.parentElement.appendChild(tempErrorEl);
  }

  // Test: underage
  ageInput.value = "16";
  const res1 = window.AppLogic.validateAgeInput(ageInput.value);
  tempErrorEl.innerText = res1.msg;
  
  setTimeout(() => {
    assertEqual(tempErrorEl.innerText, "You must be 18+ to vote", "UI: underage message");
    
    // Test: valid
    ageInput.value = "22";
    const res2 = window.AppLogic.validateAgeInput(ageInput.value);
    tempErrorEl.innerText = res2.msg;
    
    setTimeout(() => {
      assertEqual(tempErrorEl.innerText, "Valid", "UI: valid message");
      console.log("--- UI TESTS COMPLETE ---");
    }, 100);
  }, 100);
}

window.runUnitTests = runUnitTests;
window.runUITests = runUITests;
