// ==========================================
// JANADESH - CORE LOGIC
// ==========================================

// Global State
let userXP = 0;
let unlockedBadges = [];
let currentLang = 'en';
let isNarrationEnabled = false;

// 1. Navigation & UI State
function navigate(viewId) {
  document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
  
  const section = document.getElementById(`view-${viewId}`);
  if(section) {
    section.classList.remove('hidden');
    section.classList.add('active');
  }
  
  const navBtn = document.querySelector(`.nav-link[onclick="navigate('${viewId}')"]`);
  if(navBtn) navBtn.classList.add('active');

  // Trigger re-renders
  if(viewId === 'map') renderDashboard();
  if(viewId === 'learn') loadQuiz();
}

lucide.createIcons();

// 2. Onboarding & Personalization
document.addEventListener('DOMContentLoaded', () => {
  const hasOnboarded = localStorage.getItem('janadesh_onboarded');
  if(!hasOnboarded) {
    document.getElementById('onboarding-modal').classList.remove('hidden');
  } else {
    loadUserProfile();
    generateJourney();
  }
  translatePage();
});

function completeOnboarding() {
  const role = document.getElementById('user-role').value;
  const state = document.getElementById('user-state-select').value;
  
  localStorage.setItem('janadesh_onboarded', 'true');
  localStorage.setItem('user_role', role);
  localStorage.setItem('user_state', state);
  localStorage.setItem('user_xp', '0');
  
  document.getElementById('onboarding-modal').classList.add('hidden');
  loadUserProfile();
  generateJourney();
}

function loadUserProfile() {
  document.getElementById('user-profile').classList.remove('hidden');
  userXP = parseInt(localStorage.getItem('user_xp')) || 0;
  updateXPDisplay();
}

function updateXPDisplay() {
  document.getElementById('user-xp').innerText = userXP;
  localStorage.setItem('user_xp', userXP);
  checkBadges();
}

function generateJourney() {
  const role = localStorage.getItem('user_role');
  const tracker = document.getElementById('journey-tracker');
  const mapContainer = document.getElementById('journey-map-container');
  
  if(!tracker) return;
  tracker.classList.remove('hidden');
  mapContainer.innerHTML = '';

  let milestones = [];
  if(role === 'first-time') {
    milestones = [
      { id: 'reg', title: "Registration", desc: "Register via Form 6.", icon: "user-plus", explainer: "As a first-time voter, you must get your name onto the electoral roll.", actions: "Fill out Form 6 online via the Voter Service Portal.", mistakes: "Using a nickname or unofficial address.", deadline: "T-Minus 15 Days to Election Notification", link: "https://voters.eci.gov.in/", reward: "Novice Badge" },
      { id: 'camp', title: "Campaigns", desc: "Learn about your candidates.", icon: "megaphone", explainer: "Candidates will share their manifestos. This is your time to research.", actions: "Review candidate affidavits on the KYC app.", mistakes: "Believing unverified WhatsApp forwards.", deadline: "T-Minus 2 Days (Campaign Silence Period)", link: "https://affidavit.eci.gov.in/", reward: "Informed Badge" },
      { id: 'vote', title: "Voting Day", desc: "Cast your vote securely.", icon: "box", explainer: "Head to your designated polling booth to cast your first vote!", actions: "Bring your EPIC card or an approved photo ID.", mistakes: "Taking your mobile phone inside the voting compartment.", deadline: "Polling Day (7 AM - 6 PM)", link: "https://electoralsearch.eci.gov.in/", reward: "Expert Badge" },
      { id: 'count', title: "Results", desc: "Watch the vote counting.", icon: "bar-chart-2", explainer: "Votes are counted under strict supervision by ECI officials.", actions: "Watch live results on official channels.", mistakes: "Spreading unverified early exit poll rumors.", deadline: "Counting Day", link: "https://results.eci.gov.in/" }
    ];
  } else if (role === 'overseas') {
    milestones = [
      { id: 'reg_nri', title: "NRI Registration", desc: "Fill Form 6A to register.", icon: "globe", explainer: "Non-Resident Indians holding an Indian passport can vote.", actions: "Submit Form 6A online with passport details.", mistakes: "Submitting without a valid Indian passport.", deadline: "T-Minus 15 Days to Notification", link: "https://voters.eci.gov.in/", reward: "Global Voter" },
      { id: 'travel', title: "Plan Travel", desc: "Plan your trip to your constituency.", icon: "plane", explainer: "Currently, e-voting is not available for NRIs. You must vote in person.", actions: "Book travel to be in your home constituency on polling day.", mistakes: "Assuming you can vote at the local embassy.", deadline: "Before Polling Day", link: "https://eci.gov.in/" },
      { id: 'vote', title: "Voting Day", desc: "Cast your vote securely.", icon: "box", explainer: "Head to your polling booth.", actions: "Bring your original Indian passport as identification.", mistakes: "Bringing a copy instead of the original passport.", deadline: "Polling Day (7 AM - 6 PM)", link: "https://electoralsearch.eci.gov.in/", reward: "Expert Badge" },
      { id: 'count', title: "Results", desc: "Watch the vote counting.", icon: "bar-chart-2", explainer: "Votes are counted under strict supervision by ECI officials.", actions: "Watch live results online.", mistakes: "None.", deadline: "Counting Day", link: "https://results.eci.gov.in/" }
    ];
  } else if (role === 'missed') {
    milestones = [
      { id: 'missed_reg', title: "Continuous Updation", desc: "Register for the next cycle.", icon: "calendar", explainer: "You missed the deadline for the current election, but you can still register for the next one.", actions: "Submit Form 6 anytime during continuous updation.", mistakes: "Waiting until the next election is announced.", deadline: "Continuous (No strict deadline)", link: "https://voters.eci.gov.in/", reward: "Proactive Citizen" },
      { id: 'prep', title: "Prepare Docs", desc: "Gather required documents.", icon: "file-text", explainer: "Ensure you have standard age and address proofs ready.", actions: "Keep Aadhar, PAN, or Passport handy.", mistakes: "Using expired documents.", deadline: "Before Next Draft Roll", link: "https://eci.gov.in/" }
    ];
  } else if (role === 'family') {
    milestones = [
      { id: 'assist_reg', title: "Assist Registration", desc: "Help them fill Form 6/8.", icon: "users", explainer: "You are acting as a guide. Ensure their details match their official IDs.", actions: "Help them navigate the Voter Service Portal.", mistakes: "Entering your own phone number instead of theirs.", deadline: "T-Minus 15 Days to Notification", link: "https://voters.eci.gov.in/", reward: "Civic Helper" },
      { id: 'pwd', title: "Special Provisions", desc: "Check for PwD/Senior citizen facilities.", icon: "heart", explainer: "Senior citizens (85+) and PwD voters have special home voting or transport facilities.", actions: "Fill Form 12D for home voting if eligible.", mistakes: "Missing the 5-day window after election notification for Form 12D.", deadline: "Within 5 days of Notification", link: "https://eci.gov.in/pwd" },
      { id: 'vote', title: "Voting Day Assistance", desc: "Help them reach the booth.", icon: "box", explainer: "Accompany them to the booth. Wheelchairs are available.", actions: "Request volunteer assistance at the booth.", mistakes: "Trying to enter the voting compartment with them unless permitted as a companion.", deadline: "Polling Day", link: "https://eci.gov.in/", reward: "Expert Badge" }
    ];
  } else {
    // Regular
    milestones = [
      { id: 'check', title: "Verify Roll", desc: "Check your name in the voter list.", icon: "search", explainer: "Ensure your name wasn't accidentally removed during roll purification.", actions: "Search your name on electoralsearch.eci.gov.in.", mistakes: "Assuming having an EPIC card means you are definitely on the roll.", deadline: "T-Minus 15 Days", link: "https://electoralsearch.eci.gov.in/", reward: "Informed Badge" },
      { id: 'camp', title: "Campaigns", desc: "Learn about your candidates.", icon: "megaphone", explainer: "Review candidate affidavits on the official portal to make an informed choice.", actions: "Check the KYC App.", mistakes: "Voting based purely on rumors.", deadline: "T-Minus 2 Days", link: "https://affidavit.eci.gov.in/" },
      { id: 'vote', title: "Voting Day", desc: "Cast your vote securely.", icon: "box", explainer: "Find your polling booth. Remember to bring your EPIC (Voter ID) card.", actions: "Press the blue button and verify the VVPAT slip.", mistakes: "Taking selfies inside the voting booth.", deadline: "Polling Day (7 AM - 6 PM)", link: "https://eci.gov.in/", reward: "Expert Badge" },
      { id: 'count', title: "Results", desc: "Watch the vote counting.", icon: "bar-chart-2", explainer: "Votes are counted under strict supervision by ECI officials.", actions: "Check official results.", mistakes: "Trusting unofficial sources.", deadline: "Counting Day", link: "https://results.eci.gov.in/" }
    ];
  }

  // Retrieve current progress
  const currentStageIdx = parseInt(localStorage.getItem('journey_stage')) || 0;

  milestones.forEach((m, idx) => {
    let stateClass = '';
    let statusText = '';
    
    if(idx < currentStageIdx) {
      stateClass = 'completed';
      statusText = 'Completed';
    } else if (idx === currentStageIdx) {
      stateClass = 'active';
      statusText = 'Current Step';
    } else {
      stateClass = 'locked';
      statusText = 'Locked';
    }

    const node = document.createElement('div');
    node.className = `journey-node ${stateClass}`;
    node.onclick = () => {
      if(stateClass !== 'locked') showJourneyModal(m, idx, currentStageIdx);
    };

    let rewardHTML = m.reward ? `<div class="node-badge-reward"><i data-lucide="award" style="width:12px;"></i> ${m.reward}</div>` : '';

    node.innerHTML = `
      <div class="node-content">
        <div class="node-icon"><i data-lucide="${m.icon}"></i></div>
        <div class="node-text">
          <h4>${m.title} <span style="font-size: 0.7rem; color: var(--accent-cyan); font-weight: normal; margin-left: 5px;">${statusText}</span></h4>
          <p>${m.desc}</p>
        </div>
      </div>
      ${rewardHTML}
    `;
    mapContainer.appendChild(node);
  });
  
  lucide.createIcons();
}

function showJourneyModal(milestone, idx, currentStageIdx) {
  const modal = document.getElementById('journey-modal');
  document.getElementById('journey-modal-icon').innerHTML = `<i data-lucide="${milestone.icon}" style="width:48px;height:48px;color:var(--accent-cyan);"></i>`;
  document.getElementById('journey-modal-title').innerText = milestone.title;
  
  // 5-Part Expansion
  document.getElementById('journey-modal-desc').innerText = milestone.explainer || "Details coming soon.";
  document.getElementById('journey-modal-actions').innerText = milestone.actions || "No specific actions right now.";
  document.getElementById('journey-modal-mistakes').innerText = milestone.mistakes || "None identified.";
  document.getElementById('journey-modal-deadline').innerText = milestone.deadline || "Varies by constituency";
  
  const linkEl = document.getElementById('journey-modal-link');
  if(milestone.link) {
    linkEl.href = milestone.link;
    linkEl.innerText = `Visit ${milestone.link}`;
    linkEl.style.display = 'inline-block';
  } else {
    linkEl.style.display = 'none';
  }
  
  const actionContainer = document.getElementById('journey-modal-action');
  actionContainer.innerHTML = '';
  
  if (idx === currentStageIdx) {
    const btn = document.createElement('button');
    btn.className = 'btn green';
    btn.innerHTML = 'Complete Step <i data-lucide="check"></i>';
    btn.onclick = () => {
      completeJourneyStep(idx);
      closeJourneyModal();
    };
    actionContainer.appendChild(btn);
  } else if (idx < currentStageIdx) {
    actionContainer.innerHTML = '<p style="color:var(--accent-green);font-weight:bold;">Step Completed</p>';
  }

  modal.classList.remove('hidden');
  lucide.createIcons();
}

function closeJourneyModal() {
  document.getElementById('journey-modal').classList.add('hidden');
}

function completeJourneyStep(idx) {
  const nextStage = idx + 1;
  localStorage.setItem('journey_stage', nextStage);
  addXP(200);
  generateJourney(); // Re-render
}

function addXP(amount) {
  userXP += amount;
  updateXPDisplay();
}

// 3. Multi-Language Support & Narration
const dictionary = {
  en: {
    nav_map: "Dashboard", nav_simulator: "Simulator", nav_learn: "Learn", nav_builder: "Builder",
    hero_title: "Empowering Every Vote",
    hero_subtitle: "Discover interactive election insights, timelines, and smart civic education.",
    btn_sim: "View Process Timeline", btn_dash: "Voter Dashboard",
    dash_title: "Voter Data Dashboard", dash_desc: "Explore state-wise demographics.",
    sim_title: "Interactive Process Simulator", sim_desc: "Follow the timeline of an Indian election.",
    build_title: "Democracy Builder", build_desc: "Create a mock constituency and simulate outcomes.",
    quest_title: "Vote Quest", quest_desc: "Test your knowledge and earn passport stamps.",
    step_1: "ECI Announcement", step_2: "Nominations", step_3: "Campaigns", step_4: "EVM Polling", step_5: "Results",
    evm_title: "EVM Mockup (AR Preview)", evm_drag: "Drag a candidate here to cast mock vote",
    th_state: "State", th_total: "Total Voters (Cr)", th_male: "Male %", th_female: "Female %", th_new: "New Voters (L)", th_date: "Polling Date",
    badges_title: "Digital Passport", badge_1: "Novice", badge_2: "Informed", badge_3: "Expert",
    onboard_title: "Welcome to Janadesh", onboard_desc: "Personalize your journey. Tell us about yourself.",
    onboard_role: "I am a:", onboard_state: "My State:", onboard_btn: "Start Journey"
  },
  hi: {
    nav_map: "डैशबोर्ड", nav_simulator: "सिम्युलेटर", nav_learn: "सीखें", nav_builder: "निर्माता",
    hero_title: "हर वोट को सशक्त बनाना",
    hero_subtitle: "एक मजबूत लोकतंत्र के लिए इंटरैक्टिव चुनाव अंतर्दृष्टि और स्मार्ट नागरिक शिक्षा की खोज करें।",
    btn_sim: "प्रक्रिया टाइमलाइन देखें", btn_dash: "वोटर डैशबोर्ड",
    dash_title: "वोटर डेटा डैशबोर्ड", dash_desc: "राज्य-वार जनसांख्यिकी का अन्वेषण करें।",
    sim_title: "इंटरैक्टिव प्रक्रिया सिम्युलेटर", sim_desc: "भारतीय चुनाव की समयरेखा का पालन करें।",
    build_title: "लोकतंत्र निर्माता", build_desc: "एक नकली निर्वाचन क्षेत्र बनाएं और परिणामों का अनुकरण करें।",
    quest_title: "वोट क्वेस्ट", quest_desc: "अपने ज्ञान का परीक्षण करें और पासपोर्ट टिकट अर्जित करें।",
    step_1: "ईसीआई घोषणा", step_2: "नामांकन", step_3: "अभियान", step_4: "ईवीएम मतदान", step_5: "परिणाम",
    evm_title: "ईवीएम मॉकअप (एआर पूर्वावलोकन)", evm_drag: "मॉक वोट डालने के लिए एक उम्मीदवार को यहां खींचें",
    th_state: "राज्य", th_total: "कुल मतदाता (करोड़)", th_male: "पुरुष %", th_female: "महिला %", th_new: "नए मतदाता (लाख)", th_date: "मतदान की तारीख",
    badges_title: "डिजिटल पासपोर्ट", badge_1: "नौसिखिया", badge_2: "सूचित", badge_3: "विशेषज्ञ",
    onboard_title: "जनादेश में आपका स्वागत है", onboard_desc: "अपनी यात्रा को वैयक्तिकृत करें। अपने बारे में बताएं।",
    onboard_role: "मैं एक हूँ:", onboard_state: "मेरा राज्य:", onboard_btn: "यात्रा शुरू करें"
  },
};

// Auto-populate the remaining 20 languages with a localization prefix for demonstration
const langNames = {
  bn: 'বাংলা', te: 'తెలుగు', mr: 'मराठी', ta: 'தமிழ்', ur: 'اردو',
  gu: 'ગુજરાતી', kn: 'ಕನ್ನಡ', or: 'ଓଡ଼ିଆ', ml: 'മലയാളം', pa: 'ਪੰਜਾਬੀ',
  as: 'অসমীয়া', mai: 'मैथिली', sat: 'ᱥᱟᱱᱛᱟᱲᱤ', ks: 'कॉशुर', ne: 'नेपाली',
  sd: 'सिन्धी', kok: 'कोंकणी', doi: 'डोगरी', mni: 'মৈতৈলোন্', brx: 'बड़ो', sa: 'संस्कृतम्'
};

Object.keys(langNames).forEach(code => {
  dictionary[code] = {};
  for(let key in dictionary.en) {
    dictionary[code][key] = `[${langNames[code]}] ` + dictionary.en[key];
  }
});

function changeLanguage(langCode) {
  currentLang = langCode;
  translatePage();
}

function translatePage() {
  const dict = dictionary[currentLang] || dictionary['en'];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if(dict[key]) {
      // If it has children icons, preserve them
      const icon = el.querySelector('i');
      if(icon) {
        el.innerHTML = '';
        el.appendChild(icon);
        el.appendChild(document.createTextNode(' ' + dict[key]));
      } else {
        el.innerText = dict[key];
      }
    }
  });
}

function toggleNarration() {
  isNarrationEnabled = !isNarrationEnabled;
  const btn = document.getElementById('narrate-btn');
  btn.style.color = isNarrationEnabled ? 'var(--accent-cyan)' : 'var(--text-muted)';
  
  if(isNarrationEnabled) {
    speakText(dictionary[currentLang] ? dictionary[currentLang].hero_title : dictionary['en'].hero_title);
  } else {
    window.speechSynthesis.cancel();
  }
}

function speakText(text) {
  if(!isNarrationEnabled || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  // Attempt to set voice based on lang
  if(currentLang === 'hi') utterance.lang = 'hi-IN';
  else utterance.lang = 'en-IN';
  window.speechSynthesis.speak(utterance);
}

// 4. Voter Dashboard & 2026 Filters
const stateData = [
  // 29 States (including Telangana)
  { state: "Andhra Pradesh", total: 4.09, male: 49.5, female: 50.5, new: 8.2, date: "May 2024", year: 2024 },
  { state: "Arunachal Pradesh", total: 0.08, male: 51.0, female: 49.0, new: 0.3, date: "Apr 2024", year: 2024 },
  { state: "Assam", total: 2.37, male: 50.4, female: 49.6, new: 5.1, date: "2026", year: 2026 },
  { state: "Bihar", total: 7.64, male: 52.8, female: 47.2, new: 15.4, date: "2025", year: 2025 },
  { state: "Chhattisgarh", total: 2.03, male: 50.1, female: 49.9, new: 4.8, date: "Nov 2023", year: 2023 },
  { state: "Goa", total: 0.11, male: 48.5, female: 51.5, new: 0.2, date: "Feb 2022", year: 2022 },
  { state: "Gujarat", total: 4.90, male: 52.0, female: 48.0, new: 10.5, date: "Dec 2022", year: 2022 },
  { state: "Haryana", total: 1.98, male: 53.5, female: 46.5, new: 4.2, date: "Oct 2024", year: 2024 },
  { state: "Himachal Pradesh", total: 0.55, male: 50.5, female: 49.5, new: 1.1, date: "Nov 2022", year: 2022 },
  { state: "Jharkhand", total: 2.39, male: 51.2, female: 48.8, new: 5.8, date: "Nov 2024", year: 2024 },
  { state: "Karnataka", total: 5.30, male: 50.8, female: 49.2, new: 11.2, date: "May 2023", year: 2023 },
  { state: "Kerala", total: 2.74, male: 48.2, female: 51.8, new: 5.5, date: "Apr 2026", year: 2026 },
  { state: "Madhya Pradesh", total: 5.60, male: 51.9, female: 48.1, new: 12.5, date: "Nov 2023", year: 2023 },
  { state: "Maharashtra", total: 9.20, male: 52.1, female: 47.9, new: 18.5, date: "Nov 2024", year: 2024 },
  { state: "Manipur", total: 0.20, male: 48.5, female: 51.5, new: 0.5, date: "Feb 2022", year: 2022 },
  { state: "Meghalaya", total: 0.21, male: 49.5, female: 50.5, new: 0.6, date: "Feb 2023", year: 2023 },
  { state: "Mizoram", total: 0.08, male: 48.2, female: 51.8, new: 0.2, date: "Nov 2023", year: 2023 },
  { state: "Nagaland", total: 0.13, male: 50.5, female: 49.5, new: 0.3, date: "Feb 2023", year: 2023 },
  { state: "Odisha", total: 3.32, male: 51.0, female: 49.0, new: 7.5, date: "May 2024", year: 2024 },
  { state: "Punjab", total: 2.14, male: 52.8, female: 47.2, new: 4.5, date: "Feb 2022", year: 2022 },
  { state: "Rajasthan", total: 5.25, male: 52.0, female: 48.0, new: 11.8, date: "Nov 2023", year: 2023 },
  { state: "Sikkim", total: 0.04, male: 51.5, female: 48.5, new: 0.1, date: "Apr 2024", year: 2024 },
  { state: "Tamil Nadu", total: 6.23, male: 49.1, female: 50.9, new: 14.6, date: "Apr 2026", year: 2026 },
  { state: "Telangana", total: 3.26, male: 50.2, female: 49.8, new: 7.1, date: "Nov 2023", year: 2023 },
  { state: "Tripura", total: 0.28, male: 50.5, female: 49.5, new: 0.7, date: "Feb 2023", year: 2023 },
  { state: "Uttar Pradesh", total: 15.30, male: 53.5, female: 46.5, new: 25.0, date: "2027", year: 2027 },
  { state: "Uttarakhand", total: 0.83, male: 51.8, female: 48.2, new: 2.0, date: "Feb 2022", year: 2022 },
  { state: "West Bengal", total: 7.32, male: 49.0, female: 51.0, new: 15.0, date: "Apr 2026", year: 2026 },
  // 7 UTs (Including Delhi, J&K, Puducherry, A&N, Chandigarh, D&N/D&D, Lakshadweep)
  { state: "Delhi (UT)", total: 1.47, male: 54.5, female: 45.5, new: 3.5, date: "2025", year: 2025 },
  { state: "Jammu & Kashmir (UT)", total: 0.86, male: 51.5, female: 48.5, new: 2.2, date: "Oct 2024", year: 2024 },
  { state: "Puducherry (UT)", total: 0.10, male: 47.5, female: 52.5, new: 0.2, date: "Apr 2026", year: 2026 },
  { state: "Andaman & Nicobar (UT)", total: 0.03, male: 52.0, female: 48.0, new: 0.1, date: "Apr 2024", year: 2024 },
  { state: "Chandigarh (UT)", total: 0.06, male: 52.5, female: 47.5, new: 0.2, date: "Apr 2024", year: 2024 },
  { state: "DNH & DD (UT)", total: 0.04, male: 55.0, female: 45.0, new: 0.1, date: "Apr 2024", year: 2024 },
  { state: "Lakshadweep (UT)", total: 0.01, male: 50.5, female: 49.5, new: 0.02, date: "Apr 2024", year: 2024 }
];

function renderDashboard() {
  const filter = document.getElementById('year-filter').value;
  const tbody = document.getElementById('dashboard-tbody');
  tbody.innerHTML = '';

  const filtered = filter === '2026' ? stateData.filter(d => d.year === 2026) : stateData;

  filtered.forEach(d => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${d.state}</strong></td>
      <td>${d.total}</td>
      <td style="color:var(--accent-cyan)">${d.male}%</td>
      <td style="color:var(--accent-saffron)">${d.female}%</td>
      <td>${d.new}</td>
      <td>${d.date}</td>
    `;
    tbody.appendChild(tr);
  });
}

// 5. Simulator (EVM Drag & Drop)
function showSimulatorDetail(stepId) {
  document.querySelectorAll('.timeline-step').forEach(el => el.classList.remove('active-step'));
  event.currentTarget.classList.add('active-step');
  
  if(isNarrationEnabled) {
    const dict = dictionary[currentLang] || dictionary['en'];
    const text = event.currentTarget.innerText;
    speakText(text);
  }
}

function allowDrop(ev) {
  ev.preventDefault();
  document.querySelector('.ballot-dropzone').classList.add('drag-over');
}

function dragCandidate(ev) {
  ev.dataTransfer.setData("text", ev.target.getAttribute('data-id'));
  ev.dataTransfer.setData("name", ev.target.innerText);
}

function dropVote(ev) {
  ev.preventDefault();
  const zone = document.querySelector('.ballot-dropzone');
  zone.classList.remove('drag-over');
  const data = ev.dataTransfer.getData("name");
  
  if(data) {
    zone.innerHTML = `<i data-lucide="check-circle" color="var(--accent-green)" style="width:64px;height:64px;margin-bottom:10px;"></i>
                      <h3>Vote Cast Successfully!</h3>
                      <p>You voted for: <strong>${data}</strong></p>`;
    lucide.createIcons();
    addXP(100);
    speakText("Vote Cast Successfully");
  }
}

// 6. Democracy Builder
function updateBuilder() {
  const youth = document.getElementById('slide-youth').value;
  const female = document.getElementById('slide-female').value;
  const rural = document.getElementById('slide-rural').value;

  document.getElementById('val-youth').innerText = youth;
  document.getElementById('val-female').innerText = female;
  document.getElementById('val-rural').innerText = rural;

  // Mock math logic
  let partyA = 50 + (youth * 0.2) - (female * 0.1) - (rural * 0.1);
  if(partyA > 95) partyA = 95;
  if(partyA < 5) partyA = 5;
  const partyB = 100 - partyA;

  document.getElementById('bar-a').style.height = `${partyA}%`;
  document.getElementById('bar-a').innerText = `Party A (${Math.round(partyA)}%)`;
  
  document.getElementById('bar-b').style.height = `${partyB}%`;
  document.getElementById('bar-b').innerText = `Party B (${Math.round(partyB)}%)`;

  const insight = document.getElementById('builder-insight');
  if(female > 70) {
    insight.innerText = "High female turnout strongly favors Party B in this model.";
  } else if (youth > 75) {
    insight.innerText = "Youth wave detected! Party A gains momentum.";
  } else {
    insight.innerText = "A balanced voter turnout leads to a tight race.";
  }
}

// 7. Gamified Learning (Vote Quest Quiz)
const questions = [
  { q: "What is the minimum voting age in India?", options: ["16", "18", "21", "25"], ans: 1, exp: "The 61st Amendment Act (1988) lowered the voting age from 21 to 18 years." },
  { q: "Which form is used for new voter registration?", options: ["Form 4", "Form 6", "Form 8", "Form 10"], ans: 1, exp: "Form 6 is specifically for first-time voters to get onto the electoral roll." },
  { q: "What does VVPAT stand for?", options: ["Voter Verified Paper Audit Trail", "Voting Verification Polling Agent Test", "Valid Vote Paper Analysis Tool", "Voter Validation Polling Action Type"], ans: 0, exp: "VVPAT provides a paper slip confirming your vote was recorded as cast." },
  { q: "Who conducts the Lok Sabha Elections in India?", options: ["State Election Commission", "Election Commission of India (ECI)", "Parliament", "President of India"], ans: 1, exp: "The ECI is an autonomous constitutional authority responsible for administering Union and State election processes." },
  { q: "What is NOTA?", options: ["None Of The Above", "National Organization of Teachers Association", "New Official Taxation Authority", "National Office for Transport Administration"], ans: 0, exp: "NOTA allows voters to express their disapproval of all the candidates contesting the election." },
  { q: "What is the maximum number of candidates a single EVM ballot unit can accommodate?", options: ["10", "16", "24", "64"], ans: 1, exp: "A single Ballot Unit can cater to 16 candidates (including NOTA)." },
  { q: "Which of the following colors is NOT in the Indian National Flag?", options: ["Saffron", "White", "Green", "Blue", "Black"], ans: 4, exp: "The flag features Saffron, White, and Green, with a Navy Blue Chakra." },
  { q: "Can NRIs (Non-Resident Indians) vote in Indian elections?", options: ["Yes, via postal ballot only", "Yes, by being physically present", "No, they cannot vote", "Yes, via e-voting"], ans: 1, exp: "Currently, registered NRI voters must be physically present at their designated polling booth to cast their vote." },
  { q: "What is the tenure of the Chief Election Commissioner of India?", options: ["5 years or up to 65 years of age", "6 years or up to 65 years of age", "4 years", "Lifetime"], ans: 1, exp: "The CEC holds office for a term of 6 years or until they attain the age of 65 years, whichever is earlier." },
  { q: "What is the Model Code of Conduct?", options: ["A dress code for politicians", "Guidelines for political parties and candidates", "Rules for news channels", "A tax code"], ans: 1, exp: "The MCC is a set of guidelines issued by the ECI to regulate political parties and candidates prior to elections." }
];
let currentQ = 0;
let score = 0;

function loadQuiz() {
  if(currentQ >= questions.length) return;
  const qObj = questions[currentQ];
  document.getElementById('quiz-progress').innerText = `Question ${currentQ + 1}/${questions.length}`;
  document.getElementById('quiz-question').innerText = qObj.q;
  document.getElementById('quiz-explanation-container').classList.add('hidden');
  
  const optsContainer = document.getElementById('quiz-options');
  optsContainer.innerHTML = '';
  
  qObj.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-opt-btn';
    btn.innerText = opt;
    btn.onclick = () => checkAnswer(idx, btn);
    optsContainer.appendChild(btn);
  });
}

function checkAnswer(selectedIdx, btnNode) {
  const qObj = questions[currentQ];
  const allBtns = document.querySelectorAll('.quiz-opt-btn');
  allBtns.forEach(b => b.disabled = true);

  if(selectedIdx === qObj.ans) {
    btnNode.classList.add('correct');
    score += 100;
    addXP(100);
    document.getElementById('quiz-score-badge').innerText = `Score: ${score}`;
  } else {
    btnNode.classList.add('wrong');
    allBtns[qObj.ans].classList.add('correct');
  }

  document.getElementById('quiz-explanation').innerText = qObj.exp;
  document.getElementById('quiz-explanation-container').classList.remove('hidden');
}

function nextQuestion() {
  currentQ++;
  if(currentQ < questions.length) {
    loadQuiz();
  } else {
    document.getElementById('quiz-question').innerText = "Quiz Completed!";
    document.getElementById('quiz-options').innerHTML = `<p>Final Score: ${score}</p>`;
    document.getElementById('quiz-explanation-container').classList.add('hidden');
    addXP(500); // Bonus
    checkBadges();
  }
}

function checkBadges() {
  if(userXP >= 100) document.getElementById('badge-1').classList.remove('locked');
  if(userXP >= 500) document.getElementById('badge-2').classList.remove('locked');
  if(userXP >= 1000) document.getElementById('badge-3').classList.remove('locked');
}

// 8. AI Assistant Toggle Fix
function toggleChat() {
  const chatWindow = document.getElementById('ai-chat-window');
  const orb = document.getElementById('ai-orb');
  
  if (chatWindow.classList.contains('hidden')) {
    chatWindow.classList.remove('hidden');
    orb.classList.add('hidden');
  } else {
    chatWindow.classList.add('hidden');
    orb.classList.remove('hidden');
  }
}

// 9. Premium 3D Tilt Effect
document.addEventListener('mousemove', (e) => {
  document.querySelectorAll('.glass-panel:not(.ai-chat-window)').forEach(panel => {
    const rect = panel.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Only apply if mouse is over the element
    if(x > 0 && y > 0 && x < rect.width && y < rect.height) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -3; // max 3 deg
      const rotateY = ((x - centerX) / centerX) * 3;
      
      panel.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
      panel.style.transition = 'none';
      panel.style.zIndex = '10';
    } else {
      panel.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      panel.style.transition = 'transform 0.5s ease';
      panel.style.zIndex = '1';
    }
  });
});

function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const msg = input.value.trim().toLowerCase();
  if(!msg) return;

  const chatContainer = document.getElementById('chat-messages');
  
  // User Bubble
  chatContainer.innerHTML += `<div class="chat-bubble user-bubble">${input.value}</div>`;
  input.value = '';
  chatContainer.scrollTop = chatContainer.scrollHeight;

  // Simulated AI response
  setTimeout(() => {
    let aiRes = "";
    
    // Check for profiles
    if (msg.includes('first-time') || msg.includes('first time')) {
      aiRes = `Great! Welcome to the democratic process, First-Time Voter! 🌟
      <br><br>
      Let's get you set up. Your journey begins at the **Registration** phase.
      <br>• First, you need to fill out **Form 6** online.
      <br>• Keep your Age Proof and Address Proof handy.
      <br><br>
      You just earned your first **+10 Democracy Points** for starting the journey!
      <br><br>
      **What happens next?** Reply with "How to find Form 6?" or "What proof do I need?" to continue.`;
    } 
    // Check for timeline/deadlines
    else if (msg.includes('when') || msg.includes('deadline') || msg.includes('date') || msg.includes('time')) {
      aiRes = `**T-Minus 15 Days** until the voter registration deadline! ⏳
      <br><br>
      It is absolutely crucial to stay ahead of the schedule.
      <br>• **Action Item:** Verify your name on the electoral roll immediately.
      <br>• **Action Item:** Submit any necessary correction forms (Form 8).
      <br><br>
      Here is your **"Early Bird" Badge** for checking deadlines!
      <br><br>
      **Myth vs. Fact:** 
      *Myth:* You can vote as long as you have an ID card, even if you miss the registration deadline.
      *Fact:* False! Your name MUST be on the electoral roll before the deadline.`;
    }
    // Check for complex questions (e.g. EVM, process, how to)
    else if (msg.includes('how') || msg.includes('process') || msg.includes('evm') || msg.includes('vote')) {
      aiRes = `Let's break that down into a simple step-by-step checklist to make it easy:
      <br><br>
      **Your Voting Day Checklist:**
      <br>• **Step 1:** Locate your polling booth via the ECI portal or Voter Helpline App.
      <br>• **Step 2:** Bring your EPIC (Voter ID) or an approved alternative photo ID.
      <br>• **Step 3:** A polling officer will check your name and ink your finger.
      <br>• **Step 4:** Proceed to the EVM and press the blue button next to your candidate.
      <br><br>
      You've earned the **"Booth Finder" Badge**! 🏆
      <br><br>
      **What happens next?** Want to learn how votes are counted after the polling ends?`;
    } 
    else if (msg.includes('confused') || msg.includes('help') || msg.includes('restart')) {
      aiRes = `Don't worry, democracy can be complex, but I'm here to help! 
      <br><br>
      Shall we **Restart the Journey**? Tell me your voter profile again (e.g., First-time, Migrant, Senior Citizen), and we'll take it one simple step at a time!`;
    }
    else if (msg.includes('id') && msg.includes('without')) {
      aiRes = `<strong style="color:var(--accent-saffron);">Verdict: Myth</strong><br><br>
      <strong>Explanation:</strong> You cannot vote without an approved ID. While the EPIC (Voter ID card) is standard, you can use 11 other alternative photo IDs (like Aadhaar, PAN card, or Passport) as long as your name is on the electoral roll.
      <br><br>
      🏅 <strong>Myth Buster Badge unlocked!</strong> (+15 XP)`;
      userXP += 15;
    }
    else if (msg.includes('register') && msg.includes('day')) {
      aiRes = `<strong style="color:var(--accent-saffron);">Verdict: Myth</strong><br><br>
      <strong>Explanation:</strong> Registration usually closes weeks before polling day (the last date to file Form 6 is the last date of nomination). Check your state's deadline to avoid missing out.
      <br><br>
      🏅 <strong>Myth Buster Badge unlocked!</strong> (+15 XP)`;
      userXP += 15;
    }
    else {
      aiRes = `That's an excellent point! If you have a specific claim or rumor you want me to verify, just type it out, and I will fact-check it for you using official sources.
      <br><br>
      Every question is crucial for a strong democracy. You've earned **+5 Democracy Points** for asking!
      <br><br>
      **What happens next?** Would you like to check your voter registration status?`;
    }
    
    // Always append the trust & accuracy disclaimer
    aiRes += `<br><br><small style="color:var(--accent-saffron); font-style:italic;">*Note: Please always verify information and confirm specific deadlines with your local election authorities or the official ECI website.*</small>`;

    chatContainer.innerHTML += `<div class="chat-bubble ai-bubble" style="line-height: 1.6;">${aiRes}</div>`;
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, 1000);
}

// 10. Voter Impact City (Isometric 3D Gamification)
function updateImpactCity() {
  const grid = document.getElementById('isometric-grid');
  if(!grid) return;

  // Clear existing buildings (keep grid base)
  const existingBuildings = grid.querySelectorAll('.building-block');
  existingBuildings.forEach(b => b.remove());

  // Determine number of buildings based on XP
  let numBuildings = Math.floor(userXP / 100) + 1; // Start with 1, gain 1 per 100 XP
  if (numBuildings > 25) numBuildings = 25; // Max grid capacity

  document.getElementById('city-level').innerText = numBuildings;

  // Grid coordinates mapping (5x5)
  const positions = [
    {x: 10, y: 10}, {x: 30, y: 10}, {x: 50, y: 10}, {x: 70, y: 10}, {x: 90, y: 10},
    {x: 10, y: 30}, {x: 30, y: 30}, {x: 50, y: 30}, {x: 70, y: 30}, {x: 90, y: 30},
    {x: 10, y: 50}, {x: 30, y: 50}, {x: 50, y: 50}, {x: 70, y: 50}, {x: 90, y: 50},
    {x: 10, y: 70}, {x: 30, y: 70}, {x: 50, y: 70}, {x: 70, y: 70}, {x: 90, y: 70},
    {x: 10, y: 90}, {x: 30, y: 90}, {x: 50, y: 90}, {x: 70, y: 90}, {x: 90, y: 90}
  ];

  // Shuffle positions for random drop
  const shuffled = positions.sort(() => 0.5 - Math.random());

  for(let i = 0; i < numBuildings; i++) {
    const pos = shuffled[i];
    const building = document.createElement('div');
    building.className = 'building-block';
    
    // Random height between 20px and 80px
    const h = Math.floor(Math.random() * 60) + 20;
    building.style.setProperty('--b-height', `${h}px`);
    
    // Position
    building.style.left = `calc(${pos.x}% - 28px)`;
    building.style.top = `calc(${pos.y}% - 28px)`;
    
    // Stagger animation delay
    building.style.animationDelay = `${i * 0.1}s`;
    
    // Translate Z to build up
    building.style.transform = `translateZ(${h}px)`;
    
    grid.appendChild(building);
  }
}

// Intercept addXP to update city
const originalAddXP = addXP;
window.addXP = function(amount) {
  originalAddXP(amount);
  if(document.getElementById('view-impact').classList.contains('active')) {
    updateImpactCity();
  }
};

// Update city when navigating to the impact tab
const originalNavigate = navigate;
window.navigate = function(viewId) {
  originalNavigate(viewId);
  if(viewId === 'impact') {
    setTimeout(updateImpactCity, 100); // slight delay for DOM
  } else if (viewId === 'myths') {
    renderMythsAndFAQ();
  }
};

// 11. Push Notification System (Reminders)
function showNotification(title, message, type = 'cyan', icon = 'bell') {
  const container = document.getElementById('notification-container');
  if(!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-icon"><i data-lucide="${icon}"></i></div>
    <div class="toast-content">
      <h4>${title}</h4>
      <p>${message}</p>
    </div>
  `;

  // Click to dismiss
  toast.onclick = () => {
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 500);
  };

  container.appendChild(toast);
  lucide.createIcons();

  // Auto remove after 5 seconds
  setTimeout(() => {
    if(toast.parentElement) {
      toast.classList.add('hiding');
      setTimeout(() => toast.remove(), 500);
    }
  }, 5000);
}

// Simulate push notifications periodically
setTimeout(() => showNotification("T-Minus 15 Days", "Voter Registration Deadline Approaching. Have you filled Form 6?", "saffron", "clock"), 5000);
setTimeout(() => showNotification("Document Prep", "Keep your Aadhar and Age Proof ready for registration.", "cyan", "file-text"), 25000);

// 12. Myth vs Fact & FAQ Mode
const mythsData = [
  { myth: "You can vote online in India.", fact: "False. There is no internet voting. You must vote in person at your designated booth (or via postal ballot if eligible)." },
  { myth: "If your name is not on the voter slip, you cannot vote.", fact: "False. The slip is just for convenience. As long as your name is on the Electoral Roll and you have an ID, you can vote." },
  { myth: "EVMs can be hacked via Bluetooth.", fact: "False. EVMs are standalone machines not connected to any network, internet, or wireless signals." }
];

const faqData = [
  { q: "How do I register?", a: "Fill out Form 6 online via the Voter Service Portal. Provide age and address proof." },
  { q: "Am I eligible to vote?", a: "You must be an Indian citizen, 18 years or older on the qualifying date, and ordinarily resident in the constituency." },
  { q: "What should I bring on voting day?", a: "Bring your EPIC (Voter ID). If you don't have it, bring one of the 11 approved alternatives (like Aadhar, Passport, PAN Card)." }
];

function renderMythsAndFAQ() {
  const grid = document.getElementById('myths-grid');
  const faqCont = document.getElementById('faq-container');
  if(!grid || grid.innerHTML.trim() !== '') return; // already rendered

  // Render Myths
  mythsData.forEach(m => {
    const card = document.createElement('div');
    card.className = 'myth-card';
    card.onclick = () => card.classList.toggle('flipped');
    card.innerHTML = `
      <div class="myth-inner">
        <div class="myth-front">
          <h3>Myth</h3>
          <p>"${m.myth}"</p>
          <div class="flip-hint"><i data-lucide="refresh-cw"></i> Click to flip</div>
        </div>
        <div class="myth-back">
          <h3>Fact</h3>
          <p>${m.fact}</p>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  // Render FAQ
  faqData.forEach(f => {
    const item = document.createElement('div');
    item.className = 'faq-item';
    item.innerHTML = `
      <div class="faq-header" onclick="this.parentElement.classList.toggle('active')">
        <span>${f.q}</span>
        <i data-lucide="chevron-down" class="faq-icon"></i>
      </div>
      <div class="faq-content">
        <p>${f.a}</p>
        <p style="margin-top:10px;font-size:0.85rem;color:var(--accent-saffron);">*Official Reference Placeholder*</p>
      </div>
    `;
    faqCont.appendChild(item);
  });

  lucide.createIcons();
}
