# AI MYSTERY ROOM
## Software Requirements & Technical Specification

**Version:** 1.0  
**Status:** Approved for MVP Development  
**Project Type:** Full-Stack AI Web Application  
**Development Methodology:** Spec-Driven Development (SDD)

---

# 1. PROJECT OVERVIEW

## 1.1 Introduction

AI Mystery Room is an AI-powered interactive mystery-solving web application. It allows users to experience detective investigations through dynamically generated mysteries powered by Google's Gemini API.

Users enter a mystery scenario, investigate suspects, examine evidence, discover clues, request hints, and identify the culprit.

Unlike traditional mystery games with predetermined storylines, AI Mystery Room generates unique mystery scenarios with structured characters, evidence, timelines, and solutions.

The AI must maintain consistency throughout the investigation. The culprit and the underlying solution must be determined before gameplay begins and must not change based on the user's interactions.

## 1.2 Problem Statement

Traditional mystery-solving games often provide fixed storylines, limited replayability, and predetermined interactions.

AI Mystery Room addresses these limitations by generating dynamic mystery scenarios and providing interactive investigation experiences.

## 1.3 Project Objectives

1. Generate unique mystery cases using Google Gemini.
2. Create believable suspects with individual backgrounds, motives, and alibis.
3. Provide interactive investigation through clues and suspect questioning.
4. Allow users to request progressive hints.
5. Require users to select one suspect as the culprit.
6. Evaluate the user's selection against the actual solution.
7. Display the correct explanation and investigation results.
8. Save completed and active investigations in MongoDB.
9. Deploy a functional application accessible through a public URL.

## 1.4 Target Users

- Mystery and detective game enthusiasts.
- Students interested in interactive AI applications.
- Users looking for short investigative games.
- People interested in AI-generated storytelling.

---

# 2. PROJECT SCOPE

## 2.1 MVP Features

The initial release must include:

- Landing page.
- Mystery generation.
- Difficulty selection.
- Mystery introduction.
- Suspect profiles.
- Evidence and clue investigation.
- Interactive suspect interrogation.
- Progressive hint system.
- Culprit selection.
- Answer evaluation.
- Final solution reveal.
- Investigation score.
- Game restart and new mystery generation.
- Persistent game records in MongoDB.

## 2.2 Out of Scope for MVP

The following features are not required for the first release:

- Multiplayer investigations.
- Real-time player-versus-player gameplay.
- Voice-based interrogation.
- User-created mystery publishing.
- Public leaderboards.
- Payment integration.
- Social networking.
- Advanced character animations.
- Mobile native applications.

The application must nevertheless be responsive and usable on mobile browsers.

---

# 3. USER EXPERIENCE AND APPLICATION FLOW

## 3.1 Main User Journey

The application must follow this sequence:

1. User opens the website.
2. User views the landing page.
3. User clicks "Start Investigation".
4. User selects the mystery difficulty.
5. User clicks "Generate Mystery".
6. Gemini generates a complete mystery.
7. The application displays the case introduction.
8. User enters the investigation room.
9. User investigates suspects and clues.
10. User interrogates suspects.
11. User requests hints if necessary.
12. User selects the suspected culprit.
13. Application evaluates the selection.
14. Application displays the result and correct explanation.
15. User can start another investigation.

## 3.2 Application Navigation

The application must contain:

- Home
- Start Investigation
- How to Play
- My Investigations (optional for guest users)
- About

During an active game, the user must have access to:

- Case Overview
- Suspects
- Evidence
- Interrogation
- Hints
- Final Accusation

---

# 4. FUNCTIONAL REQUIREMENTS

## FR-01: Landing Page

The landing page introduces the AI Mystery Room experience.

Required elements:

- Application name and logo.
- Hero heading: "Every Mystery Has a Secret."
- Supporting text explaining the game.
- Primary CTA: "Start Investigation".
- Secondary CTA: "How to Play".
- Brief feature descriptions.
- How-it-works section.
- Footer.

The primary CTA must navigate to the difficulty selection screen.

## FR-02: Difficulty Selection

Users must be able to select one of three difficulty levels.

**Easy**
- 3 suspects.
- 4–5 clues.
- 1 culprit.
- Straightforward motives.
- Obvious contradictions.

**Medium**
- 4 suspects.
- 6–8 clues.
- 1 culprit.
- More complex motives.
- Multiple misleading details.

**Hard**
- 5 suspects.
- 9–12 clues.
- 1 culprit.
- Complex timelines.
- Subtle contradictions.
- More challenging deduction.

These counts are generation targets. The backend must validate the generated case against the selected difficulty before making it playable.

## FR-03: Mystery Generation

When a user requests a new mystery:

1. Frontend sends the selected difficulty to the backend.
2. Backend validates the request.
3. Backend calls the Gemini API.
4. Gemini generates a structured mystery.
5. Backend validates the AI response.
6. Backend stores the mystery in MongoDB.
7. Backend returns only the player-accessible information.
8. Frontend displays the generated case.

Every mystery must contain:

- Case ID.
- Case title.
- Case category.
- Difficulty.
- Scenario description.
- Crime location.
- Crime time.
- Suspects.
- Evidence.
- Investigation questions.
- Correct culprit.
- Hidden solution.
- Explanation of the crime.

**Critical rule:** The culprit and solution must be generated once and stored before gameplay begins. They must never be regenerated during interrogation, clue discovery, or hint requests.

If Gemini produces invalid JSON or an incomplete mystery, the backend must retry generation with a limited retry policy. Invalid mysteries must never enter active gameplay.

## FR-04: Mystery Introduction

Display:

- Case title.
- Case category.
- Difficulty.
- Crime location.
- Crime summary.
- Victim details, when applicable.
- Initial investigation briefing.
- "Enter Investigation Room" button.

The introduction must not reveal the culprit or hidden solution.

## FR-05: Suspect Investigation

Each mystery must have multiple suspects.

Every suspect must contain:

- Unique suspect ID.
- Name.
- Age.
- Occupation.
- Relationship with the victim.
- Background description.
- Possible motive.
- Publicly available alibi.
- Interrogation dialogue.

Suspect cards must display the information available to the player.

The user must be able to select a suspect and enter an interrogation view.

## FR-06: Evidence and Clue System

The evidence section must display clues discovered during the investigation.

Each clue must contain:

- Clue ID.
- Clue title.
- Description.
- Evidence type.
- Discovery location.
- Related suspect, if applicable.
- Relevance to the mystery.

The user must be able to inspect available clues individually.

Clues must be consistent with the predetermined solution.

The application must distinguish between:

- Initially available evidence.
- Evidence discovered through investigation.
- Hidden evidence that requires an interaction or investigation action.

The user must not receive the complete solution merely by opening the evidence section.

## FR-07: Suspect Interrogation

Users must be able to ask questions to individual suspects.

Example questions:

- Where were you at the time of the incident?
- What was your relationship with the victim?
- Did you notice anything unusual?
- Can anyone confirm your alibi?

Backend processing:

1. Receive the selected suspect ID and question.
2. Validate the active game session.
3. Retrieve the suspect and relevant mystery context.
4. Send the permitted context to Gemini.
5. Generate a response consistent with the stored mystery.
6. Save the conversation.
7. Return the response.

The AI must not invent facts that contradict the established mystery.

Suspects must have consistent personalities and knowledge.

A suspect must not reveal information they could not reasonably know.

The interrogation system must not expose the hidden solution or internal culprit field.

## FR-08: Hint System

Users can request hints when they need assistance.

Three progressive hint levels:

**Hint 1 — Gentle Nudge**

Provides a general direction without identifying a suspect.

**Hint 2 — Investigative Direction**

Points the player toward a relevant clue, contradiction, or relationship.

**Hint 3 — Strong Hint**

Provides a more direct indication of the evidence connecting the culprit to the crime without explicitly revealing the answer.

Rules:

- Hints must be generated using the established mystery context.
- Hints must not contradict existing clues.
- Hint levels must be requested sequentially.
- Each level can only be requested once per investigation.
- Hint usage must be recorded for scoring.
- The system must never reveal the culprit directly through a hint.

## FR-09: Culprit Selection

This is a mandatory gameplay feature.

The user must ultimately select one suspect as the culprit.

Requirements:

- Display all suspects as selectable options.
- Allow exactly one suspect to be selected.
- Highlight the currently selected suspect.
- Display a confirmation button: "Submit Final Accusation".
- Ask for confirmation before submitting.
- Prevent submission without a selection.
- Lock the accusation after submission.

The submitted suspect ID must be compared against the stored actual culprit ID.

The evaluation must happen on the backend, never exclusively in the frontend.

## FR-10: Result Evaluation

After the accusation is submitted, the backend evaluates the answer.

If correct:

- Display "Case Solved".
- Show a success message.
- Display the correct suspect.
- Explain the motive.
- Explain the method.
- Explain the timeline.
- Show the decisive evidence.

If incorrect:

- Display "Case Unsolved".
- Identify the actual culprit.
- Explain why the selected suspect was incorrect.
- Reveal the complete solution.
- Explain the clues that identify the real culprit.

Both outcomes must provide the complete solution after submission.

## FR-11: Scoring System

The MVP must use a simple 100-point scoring model.

Starting score: 100.

Deductions:

- Each hint requested: -10 points.
- Each failed interrogation-independent accusation: not applicable, because only one final accusation is permitted.

Final score:

Correct accusation:
100 minus hint deductions.

Incorrect accusation:
0 points.

Minimum score: 0.

The result page must display:

- Final score.
- Correct/incorrect status.
- Hints used.
- Selected suspect.
- Actual culprit.
- Investigation summary.

## FR-12: New Investigation

After completing a mystery, the user must be able to:

- Start another mystery.
- Return to the homepage.
- View previous investigation results.

A new investigation must have a unique case ID and an independent solution.

---

# 5. AI INTEGRATION — GOOGLE GEMINI

## 5.1 AI Responsibilities

Gemini is responsible for:

- Mystery scenario generation.
- Suspect generation.
- Motive generation.
- Evidence generation.
- Interrogation responses.
- Progressive hint generation.
- Mystery explanation generation.

The backend is responsible for:

- Mystery validation.
- Game state management.
- Culprit verification.
- Scoring.
- Data persistence.
- Access control.
- API security.

Gemini must never independently decide whether a player's accusation is correct.

## 5.2 Mystery Generation Prompt Requirements

The mystery-generation prompt must instruct Gemini to:

1. Create an original and logically consistent mystery.
2. Generate exactly one culprit.
3. Generate suspects matching the selected difficulty.
4. Give each suspect a believable background and possible motive.
5. Establish a consistent crime timeline.
6. Generate evidence that supports the actual solution.
7. Include plausible misleading evidence.
8. Ensure the solution can be logically deduced.
9. Avoid contradictions between suspects, clues, and timeline.
10. Return strictly structured JSON.
11. Keep the correct culprit and solution in protected fields.
12. Never place the actual culprit's identity in player-visible descriptions.

## 5.3 Structured AI Output

The mystery-generation response must follow a schema equivalent to:

{
  "title": "The Midnight Disappearance",
  "category": "Missing Person",
  "difficulty": "medium",
  "scenario": "A detailed case introduction.",
  "location": "Blackwood Estate",
  "crimeTime": "11:30 PM",
  "suspects": [
    {
      "id": "S01",
      "name": "Alex Morgan",
      "occupation": "Estate Manager",
      "background": "Public background information.",
      "motive": "Possible motive.",
      "alibi": "Claimed alibi",
      "personality": "Calm and defensive"
    }
  ],
  "clues": [
    {
      "id": "C01",
      "title": "Broken Watch",
      "description": "An unexplained watch found near the study.",
      "type": "Physical Evidence",
      "relatedSuspectIds": ["S01"],
      "discoveryCondition": "initial"
    }
  ],
  "solution": {
    "culpritId": "S01",
    "motive": "Private motive.",
    "method": "How the crime happened.",
    "timeline": "Actual sequence of events.",
    "explanation": "Complete logical explanation.",
    "decisiveClueIds": ["C01"]
  }
}

This is an illustrative schema. Production generation must include all fields required by the final application data model.

## 5.4 AI Consistency Rules

- The actual culprit must remain unchanged.
- The crime timeline must remain unchanged.
- Suspect motives must remain unchanged.
- Evidence must remain unchanged.
- Interrogation responses must follow established facts.
- Hints must be grounded in existing evidence.
- The AI must not invent new decisive evidence during interrogation.
- The AI must not reveal protected solution data before accusation submission.

## 5.5 Gemini Error Handling

Handle:

- API timeout.
- Invalid API key.
- Rate limits.
- Malformed JSON.
- Empty responses.
- Safety-blocked responses.
- Model unavailability.

Show a user-friendly error message and allow retrying where appropriate.

Never expose the Gemini API key or internal error stack traces.

---

# 6. TECHNICAL ARCHITECTURE

## 6.1 Technology Stack

### Frontend
- React.js
- Vite
- JavaScript
- HTML5
- CSS3
- React Router
- Axios or Fetch API

### Backend
- Node.js
- Express.js
- JavaScript
- REST API architecture

### Database
- MongoDB Atlas
- Mongoose ODM

### Artificial Intelligence
- Google Gemini API
- Official Google Gen AI SDK for Node.js

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
- AI: Gemini API

## 6.2 System Architecture

The application follows a three-layer architecture:

**Presentation Layer**
React frontend handles pages, interactions, selections, and results.

**Application Layer**
Node.js and Express handle API requests, business logic, Gemini communication, and game state.

**Data Layer**
MongoDB stores mysteries, active game sessions, interactions, and completed results.

Communication flow:

React Frontend → Express Backend → Gemini API / MongoDB Atlas

The Gemini API key must only exist on the backend.

## 6.3 Suggested Folder Structure

ai-mystery-room/

client/
- src/
  - components/
  - pages/
  - layouts/
  - hooks/
  - services/
  - context/
  - styles/
  - assets/
  - App.jsx
  - main.jsx

server/
- src/
  - config/
  - controllers/
  - routes/
  - models/
  - services/
  - middleware/
  - validators/
  - prompts/
  - utils/
  - app.js
  - server.js

- .env
- package.json

root/
- README.md
- .gitignore
- SPEC.md

The structure may be refined during implementation, but frontend, backend, AI integration, and database responsibilities must remain separated.

---

# 7. DATABASE DESIGN

## 7.1 Mystery Collection

Fields:

- _id
- title
- category
- difficulty
- scenario
- location
- crimeTime
- suspects
- clues
- solution
- createdAt
- updatedAt

The solution object must contain:

- culpritId
- motive
- method
- timeline
- explanation
- decisiveClueIds

The solution must never be returned through public mystery endpoints.

## 7.2 Game Session Collection

Fields:

- _id
- mysteryId
- status
- discoveredClueIds
- interrogationHistory
- hintsUsed
- selectedSuspectId
- finalScore
- startedAt
- completedAt

Status values:

- active
- completed

## 7.3 Investigation Result Collection

Fields:

- _id
- gameSessionId
- mysteryId
- selectedSuspectId
- actualCulpritId
- isCorrect
- hintsUsed
- finalScore
- completedAt

Database indexes must be created for frequently queried IDs and timestamps.

---

# 8. REST API SPECIFICATION

Base URL: /api/v1

## Mystery APIs

POST /mysteries/generate

Purpose: Generate a mystery.

Request:
{
  "difficulty": "medium"
}

Response:
{
  "success": true,
  "gameSessionId": "session_id",
  "mystery": {
    "title": "The Midnight Disappearance",
    "difficulty": "medium",
    "scenario": "...",
    "suspects": [],
    "clues": []
  }
}

The response must not contain the solution.

GET /mysteries/:id

Purpose: Retrieve player-accessible mystery information.

## Game APIs

GET /games/:sessionId

Purpose: Retrieve the current investigation state.

POST /games/:sessionId/clues/:clueId/discover

Purpose: Discover an available clue.

POST /games/:sessionId/interrogate

Request:
{
  "suspectId": "S01",
  "question": "Where were you at 11:30 PM?"
}

POST /games/:sessionId/hints

Request:
{
  "level": 1
}

POST /games/:sessionId/accusation

Request:
{
  "suspectId": "S01"
}

Response:
{
  "success": true,
  "isCorrect": true,
  "finalScore": 90,
  "result": {},
  "solution": {}
}

GET /games/:sessionId/result

Purpose: Retrieve completed investigation results.

## System API

GET /health

Purpose: Verify backend availability.

All endpoints must return consistent JSON responses and appropriate HTTP status codes.

---

# 9. UI/UX DESIGN SPECIFICATION

## 9.1 Design Direction

Theme: Cinematic Detective Investigation.

Visual direction:

- Dark detective atmosphere.
- Elegant typography.
- Evidence-board inspired layouts.
- Subtle animations.
- Clear visual hierarchy.
- Professional and immersive experience.

## 9.2 Color Palette

Primary background: #101116

Secondary background: #191B23

Card background: #222530

Primary accent: #C9A45C

Secondary accent: #A83232

Primary text: #F4F1EA

Secondary text: #A5A5AE

Success: #4CAF82

Error: #D65A5A

Colors should be implemented as reusable CSS variables.

## 9.3 Typography

Recommended fonts:

- Headings: Playfair Display.
- Body: Inter.
- Buttons and labels: Inter.

## 9.4 Page Specifications

### Page 1: Landing Page

- Cinematic hero section.
- Mystery-themed background.
- Large title.
- Start Investigation CTA.
- How It Works section.
- Feature cards.

### Page 2: Difficulty Selection

- Three difficulty cards.
- Description of each level.
- Number of suspects and expected clues.
- Selected difficulty indicator.
- Generate Mystery CTA.

### Page 3: Case Briefing

- Case title.
- Case summary.
- Crime details.
- Initial investigation information.
- Enter Investigation CTA.

### Page 4: Investigation Dashboard

Main dashboard layout:

- Left sidebar: navigation.
- Main area: case information and investigation workspace.
- Right panel: selected suspect or evidence details.

Sections:

- Case Overview.
- Suspects.
- Evidence Board.
- Interrogation.
- Hints.

### Page 5: Interrogation Interface

- Selected suspect profile.
- Suspect background.
- Question input.
- Send button.
- Conversation history.
- Loading indicator.

### Page 6: Culprit Selection

- Suspect selection cards.
- Single-selection functionality.
- Selected suspect highlight.
- Final accusation confirmation.
- Submit button.

### Page 7: Result Page

- Case Solved / Case Unsolved.
- Final score.
- Actual culprit.
- Explanation.
- Timeline.
- Decisive evidence.
- Play Again CTA.

## 9.5 Responsive Design

Desktop:
Full investigation dashboard with multiple panels.

Tablet:
Reduced sidebar and adaptable evidence layout.

Mobile:
Stacked cards, collapsible navigation, and full-width interrogation interface.

All buttons, inputs, and selections must remain usable on smaller screens.

---

# 10. SECURITY REQUIREMENTS

1. Store Gemini API keys in backend environment variables.
2. Never expose secrets in frontend code.
3. Validate all incoming API requests.
4. Sanitize user-generated questions.
5. Implement request rate limiting.
6. Restrict CORS to permitted frontend origins in production.
7. Protect against prompt injection.
8. Never trust client-submitted scores or correctness values.
9. Never expose the actual culprit before final submission.
10. Prevent users from modifying completed game sessions.
11. Limit Gemini request size and user input length.
12. Avoid storing unnecessary personal information.

The solution object must be accessible only to authorized backend services until the accusation is submitted.

For the guest MVP, use unguessable session identifiers and backend ownership tokens to prevent users from accessing other players' sessions.

---

# 11. ERROR HANDLING

The application must handle:

| Situation | Expected Behaviour |
|---|---|
| Gemini unavailable | Display retry message |
| Mystery generation fails | Do not create an active session |
| Invalid AI JSON | Validate and retry generation |
| MongoDB unavailable | Display service error |
| Invalid suspect ID | Return validation error |
| Empty question | Prevent submission |
| Duplicate hint request | Reject request |
| Invalid accusation | Reject request |
| Completed game modified | Return conflict error |
| Network failure | Display retry option |

Error messages must be understandable to normal users.

---

# 12. TESTING REQUIREMENTS

## 12.1 Frontend Testing

Verify:

- Navigation works.
- Difficulty selection works.
- Mystery information displays correctly.
- Suspects can be selected.
- Clues can be inspected.
- Interrogation works.
- Hints can be requested.
- Only one culprit can be selected.
- Final accusation works.
- Result page displays correctly.
- Responsive layouts work.

## 12.2 Backend Testing

Verify:

- Mystery generation.
- AI response validation.
- Database storage.
- Mystery retrieval.
- Session management.
- Clue discovery.
- Interrogation response generation.
- Hint progression.
- Culprit verification.
- Score calculation.
- Result persistence.

## 12.3 AI Testing

Test the following:

1. Every mystery has exactly one valid culprit.
2. Every suspect has a unique ID.
3. Every clue has a unique ID.
4. The solution is consistent with the evidence.
5. Interrogation responses do not contradict established facts.
6. Hints do not reveal the culprit directly.
7. AI does not change the culprit during gameplay.
8. The final explanation matches the stored solution.

## 12.4 End-to-End Acceptance Test

A complete test must follow this scenario:

1. Open the deployed website.
2. Start a new investigation.
3. Select Medium difficulty.
4. Generate a mystery.
5. Read the case introduction.
6. Examine all available suspects.
7. Investigate evidence.
8. Interrogate at least two suspects.
9. Request a hint.
10. Identify a suspect.
11. Submit the final accusation.
12. Verify the answer.
13. Read the complete explanation.
14. Start another investigation.

The application passes the main acceptance test only when this complete journey works on the deployed website.

---

# 13. DEPLOYMENT SPECIFICATION

## 13.1 Frontend Deployment

Platform: Vercel

Requirements:
- Build React application.
- Configure production API base URL.
- Configure SPA routing fallback.
- Verify frontend deployment.

## 13.2 Backend Deployment

Platform: Render

Requirements:
- Deploy Express application.
- Configure production environment variables.
- Connect MongoDB Atlas.
- Configure CORS.
- Configure production API URL.
- Verify health endpoint.

## 13.3 Database Deployment

Platform: MongoDB Atlas

Requirements:
- Create production database.
- Configure database credentials.
- Restrict network access appropriately.
- Configure database connection string.
- Verify read/write operations.

## 13.4 Environment Variables

Backend:

GEMINI_API_KEY=
MONGODB_URI=
PORT=
CLIENT_URL=
NODE_ENV=

Frontend:

VITE_API_BASE_URL=

All secrets must be excluded from GitHub.

---

# 14. DEVELOPMENT PHASES

The project must be developed in the following order.

**Phase 1 — Specification and Planning**
- Finalize project requirements.
- Define architecture.
- Define database schema.
- Define API contracts.
- Define Gemini prompt structure.
- Review this specification.

**Phase 2 — Frontend Development**
- Set up React and Vite.
- Create landing page.
- Implement difficulty selection.
- Create case briefing.
- Build investigation dashboard.
- Build suspect and evidence interfaces.
- Implement interrogation and culprit selection interfaces.
- Build result page.

**Phase 3 — Backend Development**
- Set up Express server.
- Configure MongoDB.
- Implement models.
- Implement API routes.
- Implement controllers and services.
- Implement session management.
- Implement game business logic.

**Phase 4 — Gemini Integration**
- Integrate Gemini SDK.
- Implement mystery generation.
- Implement JSON validation.
- Implement interrogation.
- Implement hint generation.
- Implement AI consistency controls.

**Phase 5 — Integration and Testing**
- Connect frontend and backend.
- Test all API endpoints.
- Verify database persistence.
- Test complete gameplay.
- Fix bugs and edge cases.

**Phase 6 — Deployment**
- Deploy backend.
- Deploy frontend.
- Configure production database.
- Configure environment variables.
- Verify the deployed application.

**Phase 7 — Final Demonstration**
- Open the live website.
- Generate a new mystery.
- Investigate suspects.
- Discover clues.
- Interrogate suspects.
- Request hints.
- Select the culprit.
- Display the final solution.

---

# 15. DEFINITION OF DONE

The project is considered complete only when all the following conditions are satisfied:

- [ ] Website is publicly accessible.
- [ ] Landing page is functional.
- [ ] Difficulty selection works.
- [ ] Gemini generates unique mysteries.
- [ ] Mystery data is stored in MongoDB.
- [ ] Suspects display correctly.
- [ ] Evidence investigation works.
- [ ] Interrogation works.
- [ ] Hint system works.
- [ ] User must select one culprit.
- [ ] Backend verifies the selected culprit.
- [ ] Correct and incorrect answers produce appropriate results.
- [ ] Final explanation is displayed.
- [ ] Investigation results are persisted.
- [ ] Application is responsive.
- [ ] API keys are protected.
- [ ] No critical errors exist.
- [ ] Complete gameplay has been demonstrated on the live website.

---

# 16. CODEX IMPLEMENTATION RULES

This specification is the Single Source of Truth for AI Mystery Room.

Codex must follow these rules:

1. Read SPEC.md completely before writing implementation code.
2. Do not invent features outside the approved MVP scope.
3. Follow the documented technology stack.
4. Follow the documented API contracts and database models.
5. Keep frontend, backend, AI services, and database logic separated.
6. Never expose hidden solution data to the frontend before final accusation.
7. Keep the culprit fixed throughout an investigation.
8. Validate all Gemini-generated structured data before saving it.
9. Do not use mock data in the final production gameplay flow.
10. Do not hardcode mystery answers.
11. Implement proper loading, empty, success, and error states.
12. Do not leave buttons or navigation elements nonfunctional.
13. Write maintainable and reusable code.
14. Test each phase before proceeding to the next.
15. Update this specification whenever an approved requirement changes.
16. Never silently change an API contract, database schema, or business rule.
17. Do not claim deployment or testing is complete without verifying it.

## Final Instruction

Build AI Mystery Room as a complete, functional, production-deployable MVP.

The primary success criterion is not merely generating an AI story. It is delivering a complete, consistent, interactive mystery-solving experience in which the player investigates evidence, interrogates suspects, selects the culprit, and receives a logically correct final explanation.

**End of Specification — Version 1.0**