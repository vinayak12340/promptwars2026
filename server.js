require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

// Google Cloud Dialogflow Setup
// A unique identifier for the given session
const sessionId = uuid.v4();

async function detectIntent(projectId, text, languageCode) {
  try {
    const sessionClient = new dialogflow.SessionsClient();
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: text,
          languageCode: languageCode,
        },
      },
    };
    const responses = await sessionClient.detectIntent(request);
    return responses[0].queryResult.fulfillmentText;
  } catch (error) {
    console.error('Dialogflow API Error:', error);
    return null;
  }
}

// Chatbot Endpoint
app.post('/api/chat', async (req, res) => {
  const { message, lang = 'en-US' } = req.body;
  const projectId = process.env.DIALOGFLOW_PROJECT_ID;

  if (!projectId || !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return res.json({ 
      reply: "Backend Warning: Dialogflow Project ID or Service Account Credentials are not configured. I am responding using my fallback NLP engine.",
      fallback: true
    });
  }

  const aiReply = await detectIntent(projectId, message, lang);
  
  if (aiReply) {
    res.json({ reply: aiReply, fallback: false });
  } else {
    res.json({ reply: "I'm having trouble connecting to my Google Dialogflow brain right now.", fallback: true });
  }
});

// Fact Checker Endpoint
app.post('/api/factcheck', (req, res) => {
  const { claim } = req.body;
  
  // A simple simulated fact-checking algorithm (can be upgraded to Dialogflow/Google NLP)
  const lowerClaim = claim.toLowerCase();
  let result = {
    status: 'unverified',
    message: 'We could not verify this claim in the ECI database. Please consult official sources.'
  };

  if (lowerClaim.includes('online') && lowerClaim.includes('vote')) {
    result = { status: 'false', message: 'FALSE: There is no online voting in India. You must vote at a designated polling booth.' };
  } else if (lowerClaim.includes('bluetooth') || lowerClaim.includes('wifi')) {
    result = { status: 'false', message: 'FALSE: EVMs are standalone machines and have no wireless communication capabilities.' };
  } else if (lowerClaim.includes('adhar') || lowerClaim.includes('epic') || lowerClaim.includes('voter id')) {
    result = { status: 'true', message: 'TRUE: You can vote using an EPIC card, or 11 other alternative documents like Aadhaar, provided your name is on the electoral roll.' };
  }

  res.json(result);
});

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Janadesh Backend Server running on http://localhost:" + PORT);
});
