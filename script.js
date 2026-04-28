// Initialize Lucide icons
lucide.createIcons();

// Data
const STATES_DATA = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi (UT)"
].map(state => ({
  name: state,
  maleVoters: Math.floor(Math.random() * 50) + 20 + "M",
  femaleVoters: Math.floor(Math.random() * 50) + 19 + "M",
  newVoters: Math.floor(Math.random() * 10) + 2 + "%",
  youthTurnout: "+" + (Math.random() * 15).toFixed(1) + "%",
  status: Math.random() > 0.7 ? 'Live' : 'Upcoming'
}));

const QUIZ_DATA = [
  { 
    q: "What is the minimum age to vote in India?", 
    opts: [ { t: "18 Years", c: true }, { t: "21 Years", c: false }, { t: "25 Years", c: false } ], 
    expl: "The 61st Amendment Act (1988) lowered the voting age from 21 to 18." 
  },
  { 
    q: "Which authority conducts the Lok Sabha elections in India?", 
    opts: [ { t: "Supreme Court", c: false }, { t: "Election Commission of India", c: true }, { t: "President", c: false } ], 
    expl: "The Election Commission of India (ECI) is an autonomous constitutional authority." 
  },
  { 
    q: "What does VVPAT stand for?", 
    opts: [ { t: "Voter Verifiable Paper Audit Trail", c: true }, { t: "Voting Validator Print", c: false }, { t: "Voter Voice Assessment", c: false } ], 
    expl: "VVPAT provides physical printout feedback to voters." 
  }
];

const VIDEOS_DATA = [
  { id: 1, title: "How EVMs & VVPATs Work", dur: "3:41", thumb: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=500&q=80" },
  { id: 2, title: "History of Indian Elections", dur: "10:15", thumb: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=500&q=80" },
  { id: 3, title: "Voting Process for First Timers", dur: "4:20", thumb: "https://images.unsplash.com/photo-1603584820875-1a86847bc0a8?w=500&q=80" }
];

// App State
let currentView = 'home';
let selectedState = null;
let chatOpen = false;
let chatMsgs = [{ sender: 'ai', text: "Namaste! I am the Janadesh AI. How can I help you understand the election process today?" }];
let quizIdx = 0;
let answeredIdx = null;
let quizScore = 0;

// Navigation
function navigate(view) {
  // Hide current view
  document.getElementById(`view-${currentView}`).classList.add('hidden');
  document.getElementById(`view-${currentView}`).classList.remove('active');
  
  // Show new view
  currentView = view;
  const newViewEl = document.getElementById(`view-${currentView}`);
  newViewEl.classList.remove('hidden');
  // Small timeout to allow display:block to apply before animating opacity
  setTimeout(() => {
    newViewEl.classList.add('active');
  }, 10);
  
  if(view === 'map' && !document.getElementById('state-grid-container').innerHTML) {
    renderMapState();
  }
  if(view === 'learn' && !document.getElementById('videos-container').innerHTML) {
    renderLearnState();
  }
}

// Map Section Logic
function renderMapState() {
  const container = document.getElementById('state-grid-container');
  container.innerHTML = '';
  
  STATES_DATA.forEach(state => {
    const box = document.createElement('div');
    box.className = `state-box ${selectedState?.name === state.name ? 'active' : ''}`;
    box.onclick = () => selectState(state);
    
    let html = '';
    if(state.status === 'Live') html += '<div class="live-indicator"></div>';
    html += `<h5>${state.name}</h5><div class="val">${state.youthTurnout}</div>`;
    
    box.innerHTML = html;
    container.appendChild(box);
  });
}

function selectState(state) {
  selectedState = state;
  renderMapState(); // Update active class
  renderStateDetails();
}

function renderStateDetails() {
  const container = document.getElementById('state-details-content');
  if(!selectedState) return;

  const phaseClass = selectedState.status === 'Live' ? 'live' : 'upcoming';
  
  container.innerHTML = `
    <div class="glass-panel state-details-card">
      <div class="state-details-header">
        <h3 class="state-details-title">${selectedState.name}</h3>
        <span class="phase-badge ${phaseClass}">${selectedState.status} PHASE</span>
      </div>
      
      <div class="stat-box">
        <p class="text-muted label">Male Voters</p>
        <h2>${selectedState.maleVoters}</h2>
      </div>
      
      <div class="stat-box">
        <p class="text-muted label">Female Voters</p>
        <h2 class="green-text">${selectedState.femaleVoters}</h2>
      </div>

      <div class="youth-shift-box">
        <div class="flex-between" style="margin-bottom: 5px;">
          <span class="text-muted" style="font-size: 0.9rem;">Youth Shift (AI Predicted)</span>
          <span style="color: var(--accent-saffron); font-weight:bold;">${selectedState.youthTurnout}</span>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" id="youth-bar-${selectedState.name}"></div>
        </div>
      </div>
    </div>
  `;

  // Animate the bar
  setTimeout(() => {
    const bar = document.getElementById(`youth-bar-${selectedState.name}`);
    if(bar) bar.style.width = '70%';
  }, 100);
}

// Learn Section Logic
function renderLearnState() {
  renderVideos();
  renderQuiz();
}

function renderVideos() {
  const container = document.getElementById('videos-container');
  container.innerHTML = '';
  VIDEOS_DATA.forEach(vid => {
    container.innerHTML += `
      <div class="vid-card glass-panel">
        <img src="${vid.thumb}" alt="${vid.title}" />
        <i data-lucide="play-circle" class="vid-play" style="width: 48px; height: 48px;"></i>
        <span class="dur">${vid.dur}</span>
        <div class="title-box"><h4>${vid.title}</h4></div>
      </div>
    `;
  });
  lucide.createIcons();
}

function renderQuiz() {
  document.getElementById('quiz-progress').innerText = `Question ${quizIdx + 1}/${QUIZ_DATA.length}`;
  document.getElementById('quiz-score-badge').innerText = `Score: ${quizScore}`;
  
  const qData = QUIZ_DATA[quizIdx];
  document.getElementById('quiz-question').innerText = qData.q;
  
  const optsContainer = document.getElementById('quiz-options');
  optsContainer.innerHTML = '';
  
  qData.opts.forEach((opt, i) => {
    const btn = document.createElement('div');
    btn.className = 'quiz-opt';
    btn.innerHTML = `<span style="margin-right: 15px; opacity: 0.5;">${String.fromCharCode(65 + i)}.</span> ${opt.t}`;
    
    if(answeredIdx !== null) {
      btn.classList.add('disabled');
      if(i === answeredIdx) {
        btn.classList.add(opt.c ? 'correct' : 'wrong');
      } else if (opt.c) {
        btn.classList.add('correct');
      }
    } else {
      btn.onclick = () => handleQuizAnswer(i, opt.c);
    }
    
    optsContainer.appendChild(btn);
  });

  const expContainer = document.getElementById('quiz-explanation-container');
  if(answeredIdx !== null) {
    document.getElementById('quiz-explanation').innerText = qData.expl;
    expContainer.classList.remove('hidden');
    lucide.createIcons();
  } else {
    expContainer.classList.add('hidden');
  }
}

function handleQuizAnswer(idx, isCorrect) {
  if(answeredIdx !== null) return;
  answeredIdx = idx;
  if(isCorrect) quizScore++;
  renderQuiz();
}

function nextQuestion() {
  answeredIdx = null;
  quizIdx = (quizIdx + 1) % QUIZ_DATA.length;
  renderQuiz();
}

// Chat AI Logic
function toggleChat() {
  chatOpen = !chatOpen;
  const win = document.getElementById('ai-chat-window');
  if(chatOpen) {
    win.classList.remove('hidden');
    renderChatMessages();
    setTimeout(() => document.getElementById('chat-input').focus(), 300);
  } else {
    win.classList.add('hidden');
  }
}

function renderChatMessages() {
  const container = document.getElementById('chat-messages');
  container.innerHTML = '';
  chatMsgs.forEach(msg => {
    const el = document.createElement('div');
    el.className = `chat-bubble ${msg.sender}`;
    el.innerText = msg.text;
    container.appendChild(el);
  });
  container.scrollTop = container.scrollHeight;
}

function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if(!text) return;
  
  chatMsgs.push({ sender: 'user', text });
  input.value = '';
  renderChatMessages();
  
  setTimeout(() => {
    chatMsgs.push({ sender: 'ai', text: `I'm currently a mock assistant! But normally I would use RAG to fetch accurate election details regarding: '${text}'.` });
    renderChatMessages();
  }, 1000);
}

// Initialize on load
renderChatMessages();
