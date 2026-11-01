# AI Mystery Room — Specification (SPEC.md)

**Version:** 2.0
**Status:** Implemented. This document describes the app as built and is the source of truth for future changes.
**Repository layout:** one repo with two apps, `client/` (React) and `server/` (Express), run together with npm workspaces.

---

## A. Project requirements

### A.1 Overview

AI Mystery Room is a web-based detective game. Google Gemini writes a new mystery for every game: a story, a cast of suspects, a set of clues, and one fixed solution. The player reads the case, searches for hidden clues, questions suspects, asks for hints if stuck, and makes one final accusation. The server then reveals the verdict, the real culprit, the full explanation, and a score.

### A.2 Problem statement

Most mystery games have a fixed storyline, so a case can be played only once. AI Mystery Room creates a new, logically consistent case every time, including cases built from the player's own story idea. The solution is decided before play starts and never changes.

### A.3 Target users

- Fans of detective and puzzle games.
- Students interested in AI-powered applications.
- Anyone who wants a short (10–20 minute) game in the browser.

### A.4 Expected user experience

- No sign-up. A player can start a case within two clicks.
- A case is ready in roughly 5–15 seconds; a clear loading state is shown meanwhile.
- The atmosphere is a dark, cinematic "investigation room" with clear, readable text.
- Works on desktop, tablet, and phone.

### A.5 Core features (all implemented)

| # | Feature |
|---|---|
| 1 | Home page with introduction and start buttons |
| 2 | Quick start: choose a difficulty and get a random AI mystery |
| 3 | **Create your own mystery:** enter a title, premise, optional setting, case type, tone, and difficulty |
| 4 | Case briefing with story, location, time, and victim details |
| 5 | Investigation room: suspects, evidence board, hidden clues to discover, progress |
| 6 | Progressive hints (2 on Easy, 3 on Medium/Hard), each costing points |
| 7 | One final accusation, locked after submission |
| 8 | Result: verdict, culprit, motive, method, timeline, explanation, decisive clues, score breakdown |
| 9 | "My investigations" list of past and active cases in this browser |
| 10 | Start another mystery from the result page or header |

### A.6 Optional enhancements (implemented)

- **Suspect interrogation:** ask any suspect a free-text question; Gemini answers in character using only the fixed facts.
- **Model fallback:** if the main Gemini model is busy or retired, the server tries backup models automatically.

### A.7 Technology stack

| Layer | Brief asks for | Used | Notes |
|---|---|---|---|
| Frontend | React + Vite | React 18 + Vite 6 | |
| Routing | react-router-dom | react-router-dom 7 | |
| Styling | Tailwind CSS | Tailwind CSS v4 (`@tailwindcss/vite`) | Theme colors and fonts are Tailwind theme tokens in `client/src/styles.css` (e.g. `bg-bg`, `text-gold`, `font-serif`). Header, footer, Home, Difficulty, Create Mystery, Briefing, How to play, About, My investigations, and 404 are styled with Tailwind utilities. The Investigation room, Result page, and animated home-page scene still use the older hand-written styles in `legacy.css`, loaded in a lower cascade layer so Tailwind classes always win. |
| HTTP client | axios | Built-in `fetch` wrapper (`client/src/lib/api.js`) | Same job, no extra dependency. |
| Backend | Node.js + Express | Node 20+ + Express 4 | |
| Database | MongoDB + Mongoose | MongoDB Atlas + Mongoose 8 | |
| AI | Gemini API | `@google/genai` | |
| Validation | zod | Hand-written validators + Gemini JSON schema | See section E.2. |
| Dev reload | nodemon | `node --watch` (built into Node 20+) | |
| Hosting | — | Frontend on Vercel, backend on Render | See section H. |

### A.8 Limitations

- No accounts. Progress is tied to the browser that started the case (session token kept in `localStorage`).
- AI quality varies. Cases are validated (section E.2) but the writing quality depends on the Gemini model.
- Gemini free-tier limits and outages can slow or block case creation; the app shows a retry message.
- Free hosting on Render sleeps when idle, so the first request after a pause can take ~30 seconds.
- Not included: multiplayer, leaderboards, voice, sharing or publishing user-created cases.

### A.9 Final deliverables

1. This `SPEC.md`.
2. Full source code on GitHub.
3. A live website (frontend on Vercel, API on Render, database on MongoDB Atlas).

---

## B. User flow

```
Home ─┬─> Choose difficulty (/new) ──────────────┐
      └─> Create your own mystery (/create) ─────┤
                                                 v
                                 Gemini generates case (server)
                                                 v
                              Case briefing (/case/:sessionId)
                                                 v
                    Investigation room (/investigation/:sessionId)
                    - read story, suspects, evidence
                    - search locations -> discover hidden clues
                    - question suspects (optional)
                    - request hints (optional, costs points)
                    - final accusation (confirm dialog)
                                                 v
                            Result (/result/:sessionId)
                    verdict · culprit · explanation · score
                                                 v
                         Start another mystery -> Home / /new
```

Step by step:

1. **Open the website.** The home page explains the game and shows "Start investigation" and "Create your own mystery".
2. **Enter a premise and pick a difficulty.**
   - Quick start (`/new`): choose Easy, Medium, or Hard.
   - Custom (`/create`): type a title and story idea, optionally a setting, pick a case type, tone, and difficulty.
3. **Gemini generates the case** on the server: story, suspects, clues, and the hidden solution. The server validates it and saves it. Hints are generated later by Gemini, on request, from the same saved solution.
4. **Investigate.** Some clues are on the evidence board at the start; others are hidden at named locations and must be searched to be discovered.
5. **Request hints** if needed, in order, up to the difficulty's limit.
6. **Accuse one suspect.** A confirmation dialog warns that this is final.
7. **See the result:** correct/incorrect verdict, the real culprit, motive, method, timeline, full explanation, decisive clues, and a score breakdown.
8. **Start another mystery** from the result page or the header.

---

## C. UI and page specifications

Design tokens (Tailwind `@theme` in `client/src/styles.css`; also mirrored as CSS variables in `legacy.css`): background `#101116`, surface `#191b23`, card `#222530`, gold accent `#c9a45c`, red accent `#a83232`, text `#f4f1ea`, muted text `#a5a5ae`. Fonts: Playfair Display (headings), DM Sans (body), DM Mono (labels).

### C.1 Pages

| Page | Route | Purpose | Essential elements |
|---|---|---|---|
| Home | `/` | Introduce the game | Hero title, "Start investigation", "Create your own mystery", "How to play", feature cards, closing call to action |
| Choose difficulty | `/new` | Quick start | Three difficulty cards (suspects, clues, hints), "Generate mystery" button, link to Create page |
| Create mystery | `/create` | Player's own premise | Title (3–80 chars, required), story idea (20–800, required), setting (0–120, optional), case type chips, tone cards, difficulty selector, "Fill with an example", live preview, "Create my mystery" button |
| Case briefing | `/case/:sessionId` | Set the scene | Title, difficulty tag, "Your story" tag for custom cases, scenario, location, time, victim, "Enter investigation room" |
| Investigation room | `/investigation/:sessionId` | Play | Tabs: Case overview, Suspects, Evidence board, Interrogation, Hints, Final accusation. Sidebar with case facts and progress (clues found, hints used of max) |
| Accusation | "Final accusation" tab inside the investigation room | Pick the culprit | Suspect cards (single select), confirm dialog ("This is your one final answer"), submit |
| Result | `/result/:sessionId` | Reveal | Solved/Unsolved, score out of max with breakdown, your accusation vs real culprit, motive, method, timeline, explanation, decisive clues, investigation summary |
| My investigations | `/investigations` | History | Cases started in this browser with status and score |
| How to play / About | `/how-to-play`, `/about` | Help | Rules, scoring, hint limits |

### C.2 Loading states

- Case creation: button shows a spinner and "Preparing case" / "Building your case"; inputs are disabled.
- Page loads: full-page "Opening the case file" loader.
- Hints, clue search, interrogation: the button shows a spinner and is disabled until the reply arrives.

### C.3 Error messages

All errors are short, plain-language sentences returned by the server (section D.4) and shown inline with a **Retry** button where retrying makes sense. Examples: "The AI service is temporarily unavailable. Please try again.", "The case title must be between 3 and 80 characters.", "All 2 hints for this case have been used." Network failures show "Could not connect to the investigation server."

### C.4 Navigation

Header on every page: brand (home), The Room, How to play, Create a mystery, My investigations, "Start a case". Back links on setup pages. Unknown URLs show a 404 page with a link home.

### C.5 Responsive behavior

- **Desktop (>1100px):** multi-column layouts; investigation room with sidebar, workspace, and fact rail.
- **Tablet (≤980px):** Create page stacks the form above the difficulty/preview panel; grids drop to fewer columns.
- **Phone (≤620px):** single column, 16px side gutters, collapsible menu, tone cards in two columns, no horizontal scrolling.

### C.6 Design source

The UI was designed directly in code from this spec (no Stitch AI export). Each screen in C.1 maps to a requirement in A.5 by number.

---

## D. Backend and database design

### D.1 Base URL and authentication

- All routes are served under **`/api`** (paths below) and also under **`/api/v1`** (used by the website). Both behave the same.
- Creating a case returns a `gameSessionId` and a secret `sessionToken`. Every later request for that case must send the header `X-Session-Token: <sessionToken>`. A wrong or missing token returns 404 so other players' sessions can't be discovered.
- Rate limit: 60 requests per minute per IP. Request body limit: 25 KB.

### D.2 Endpoints

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/cases` | Generate a mystery (random or custom) and start a session |
| GET | `/api/cases/:id` | Get the active game: case, discovered clues, hints, progress, rules |
| POST | `/api/cases/:id/clues/:clueId/discover` | Discover a hidden clue |
| POST | `/api/cases/:id/interrogate` | Ask a suspect a question (optional feature) |
| POST | `/api/cases/:id/hints` | Request the next hint |
| POST | `/api/cases/:id/accuse` | Submit the final accusation |
| GET | `/api/cases/:id/result` | Get the completed result and solution |
| GET | `/api/health` | Server and database status |

`:id` is the `gameSessionId`. Equivalent website paths: `/api/v1/mysteries/generate`, `/api/v1/games/:id`, `/api/v1/games/:id/clues/:clueId/discover`, `/api/v1/games/:id/interrogate`, `/api/v1/games/:id/hints`, `/api/v1/games/:id/accusation`, `/api/v1/games/:id/result`.

### D.3 Request and response formats

All responses are JSON with `success: true|false`.

**POST /api/cases**

```json
// Random case
{ "difficulty": "easy" }

// Custom case
{
  "difficulty": "medium",
  "custom": {
    "title": "The Last Lecture",
    "story": "A strict professor vanishes the night before final exams...",
    "setting": "An engineering college campus during exam week",
    "category": "disappearance",
    "tone": "noir"
  }
}
```

Validation: `difficulty` ∈ `easy|medium|hard`. If `custom` is present: `title` 3–80 chars, `story` 20–800 chars, `setting` 0–120 chars (control characters and extra spaces removed); `category` ∈ `surprise|theft|disappearance|forgery|sabotage|blackmail|murder` (default `surprise`); `tone` ∈ `classic|cozy|noir|spooky|lighthearted` (default `classic`).

Response `201`:

```json
{
  "success": true,
  "gameSessionId": "d1c0e841-...",
  "sessionToken": "LumeHH...",
  "status": "active",
  "mystery": {
    "id": "6ae6...", "title": "...", "category": "...", "difficulty": "medium", "origin": "custom",
    "scenario": "...", "location": "...", "crimeTime": "...", "victimDetails": "...", "briefing": "...",
    "suspects": [{ "id": "S01", "name": "...", "age": 34, "occupation": "...", "relationship": "...",
                   "background": "...", "motive": "...", "alibi": "...", "personality": "...", "openingStatement": "..." }],
    "clues": [{ "id": "C01", "title": "...", "description": "...", "type": "...", "discoveryLocation": "...", "relatedSuspectIds": ["S02"] }],
    "hiddenLeads": [{ "id": "C04", "discoveryLocation": "Library desk" }],
    "investigationQuestions": ["..."]
  }
}
```

`clues` contains only clues the player can see. Hidden clues appear only as `hiddenLeads` (id + location) until discovered.

**GET /api/cases/:id** → `{ success, game }` where `game` has `sessionId`, `status`, `rules` (`maxHints`, `correctPoints`, `pointsPerDiscoveredClue`, `pointsPerHint`, `maxScore`), `discoveredClueIds`, `hintsUsed[]`, `interrogationHistory[]`, `selectedSuspectId`, `finalScore`, and `mystery` (same public shape as above).

**POST /api/cases/:id/clues/:clueId/discover** → `{ success, clue, discoveredClueIds }`.

**POST /api/cases/:id/interrogate** body `{ "suspectId": "S02", "question": "Where were you at 9 PM?" }` (1–500 chars, HTML stripped) → `{ success, turn: { suspectId, suspectName, question, response } }`.

**POST /api/cases/:id/hints** body `{ "level": 1 }` → `{ success, hint: { level, content, usedAt } }`. Levels must be requested in order, from 1 to the difficulty's limit.

**POST /api/cases/:id/accuse** body `{ "suspectId": "S03" }` → the result payload below. Submitting again returns the original locked result; the accusation can't be changed.

**GET /api/cases/:id/result** →

```json
{
  "success": true,
  "result": {
    "isCorrect": true, "finalScore": 175, "hintsUsed": 3,
    "scoreBreakdown": { "correctAccusation": 200, "cluesDiscovered": 1, "clueBonus": 5, "hintPenalty": -30, "maxScore": 235 },
    "selectedSuspect": { "...": "..." }, "actualCulprit": { "...": "..." }, "completedAt": "...",
    "investigationSummary": { "cluesDiscovered": 5, "suspectsQuestioned": 2, "interviews": 4 }
  },
  "solution": {
    "motive": "...", "method": "...", "timeline": "...", "explanation": "...",
    "decisiveClues": [{ "id": "C05", "title": "...", "description": "...", "discoveryLocation": "..." }],
    "whySelectedWasIncorrect": null
  },
  "mystery": { "...": "public case fields" }
}
```

### D.4 Error handling

Errors return `{ "success": false, "error": { "code": "...", "message": "..." } }` with an HTTP status:

| Status | Code(s) | When |
|---|---|---|
| 400 | `INVALID_DIFFICULTY`, `INVALID_CUSTOM_CASE`, `INVALID_SUSPECT`, `EMPTY_QUESTION`, `QUESTION_TOO_LONG`, `INVALID_HINT_LEVEL` | Bad input |
| 404 | `SESSION_NOT_FOUND`, `CLUE_NOT_FOUND`, `MYSTERY_NOT_FOUND`, `NOT_FOUND` | Unknown id, wrong token, unknown route |
| 409 | `GAME_COMPLETED`, `HINT_OUT_OF_ORDER`, `HINT_LIMIT_REACHED`, `HINT_ALREADY_USED`, `CLUE_ALREADY_AVAILABLE`, `ACCUSATION_REQUIRED`, `GAME_CHANGED` | Action not allowed in the current game state |
| 429 | `RATE_LIMITED`, `INTERROGATION_LIMIT` | Too many requests / more than 80 questions |
| 503 | `AI_UNAVAILABLE`, `AI_RATE_LIMITED`, `AI_AUTH_FAILED`, `AI_BLOCKED`, `INVALID_AI_MYSTERY`, `AI_NOT_CONFIGURED` | Gemini failed or produced an invalid case after retries |
| 500 | `REQUEST_FAILED` | Unexpected server error (details are logged, not sent) |

If case generation fails, no mystery or session is saved.

### D.5 Database model (MongoDB, Mongoose)

**`Mystery`** — the generated case.

| Field | Type | Notes |
|---|---|---|
| `title`, `category`, `scenario`, `location`, `crimeTime`, `victimDetails`, `briefing` | String | The story |
| `difficulty` | `easy\|medium\|hard` | |
| `origin` | `generated\|custom` | `custom` = built from the player's premise |
| `suspects[]` | `{ id, name, age, occupation, relationship, background, motive, alibi, personality, openingStatement, privateKnowledge* }` | |
| `clues[]` | `{ id, title, description, type, discoveryLocation, relatedSuspectIds[], relevance*, discoveryCondition: initial\|hidden }` | |
| `investigationQuestions[]` | String | Suggested questions |
| `solution*` | `{ culpritId, motive, method, timeline, explanation, decisiveClueIds[] }` | **Hidden** |

`*` = `select: false` in Mongoose, so these fields are never loaded unless the code explicitly asks for them.

**`GameSession`** — one player's progress.

| Field | Type | Notes |
|---|---|---|
| `_id` | String (random UUID) | The `gameSessionId` |
| `mysteryId` | ObjectId → Mystery | |
| `ownerTokenHash` | String, hidden | SHA-256 of the session token |
| `status` | `active\|completed` | |
| `discoveredClueIds[]` | String | Starts with the initial clues |
| `hintsUsed[]` | `{ level, content, usedAt }` | |
| `interrogationHistory[]` | `{ suspectId, question, response, createdAt }` | |
| `selectedSuspectId` | String | The accusation |
| `finalScore` | Number | Set by the server |
| `startedAt`, `completedAt` | Date | |

**`InvestigationResult`** — one locked result per session: `gameSessionId` (unique), `mysteryId`, `selectedSuspectId`, `actualCulpritId`, `isCorrect`, `hintsUsed`, `finalScore`, `completedAt`.

### D.6 Security requirement: keep the solution private

- The culprit, solution, suspects' `privateKnowledge`, and clues' `relevance` are `select: false` and are **never** included in any response before the accusation.
- Hidden clues are not sent until discovered; only their id and search location are.
- Interrogation and hint replies are checked on the server; if a reply names the culprit or reads like a confession, it is replaced with a safe neutral reply.
- Score and correctness are calculated only on the server; the client never sends them.
- API keys live only in server environment variables, never in frontend code or Git (`.env` is in `.gitignore`).
- Player text (questions, custom premise) is treated as untrusted data in prompts, with explicit instructions to ignore embedded commands (prompt-injection defense).
- CORS allows only `CLIENT_URL`. Helmet security headers are enabled.

---

## E. AI behavior and scoring rules

### E.1 Difficulty rules (`server/src/config/gameRules.js`)

| Difficulty | Suspects | Clues | Hints | Correct accusation |
|---|---|---|---|---|
| Easy | 3 | 5 | 2 | 100 points |
| Medium | 4 | 7 | 3 | 150 points |
| Hard | 5 | 9 | 3 | 200 points |

Every case has at least 2 clues visible at the start and at least 1 hidden clue.

### E.2 Gemini output format and validation

The server asks Gemini for JSON using a response schema (`responseJsonSchema`) with these fields: `title, category, difficulty, scenario, location, crimeTime, victimDetails, briefing, suspects[], clues[], investigationQuestions[], solution`. The full schema is in `server/src/services/mysteryService.js`.

Before saving, `findMysteryProblem()` rejects the case if any of these fail:

1. All case text fields are present and non-empty; `difficulty` matches the request.
2. Exactly the required number of suspects and clues (E.1).
3. Suspect ids, suspect names, and clue ids are unique; every suspect is complete with an age of 18–100.
4. Every clue is complete; `discoveryCondition` is `initial` or `hidden`; at least 2 initial and at least 1 hidden.
5. At least 3 investigation questions.
6. The solution is complete; `culpritId` is one of the suspects.
7. Every `relatedSuspectIds` entry is a real suspect; every `decisiveClueIds` entry is a real clue; at least one decisive clue relates to the culprit (the solution is supported by evidence).
8. The culprit's name is not in the title, category, or suggested questions, and no player-facing text states who is guilty (e.g. "X is the thief").

If validation fails or the JSON can't be parsed, generation is retried up to **3 attempts**, then the player gets a retry message. Invalid cases never enter gameplay.

Custom cases: the player's premise is placed inside `<player_idea>` tags with instructions to treat it as story material only. The server then forces the saved title to the player's title, and the category to the player's choice (unless "Surprise me").

**Hints** are generated by Gemini when requested, from the saved solution and the clues the player has found, so they always match the fixed case. Hint 1 is a gentle nudge; the last hint is the strongest lead (Easy: nudge → strong lead; Medium/Hard: nudge → direction → strong lead). Hints never name a suspect; if one does, a safe pre-written hint is used.

**Models:** main model `GEMINI_MODEL` (default `gemini-3.5-flash-lite`). If it fails with 404/429/5xx/timeout, the server tries each model in `GEMINI_FALLBACK_MODELS` in order.

### E.3 Scoring (calculated on the backend)

```
base        = correct accusation ? (100 | 150 | 200 by difficulty) : 0
clueBonus   = 5 × (hidden clues discovered by searching)
hintPenalty = -10 × (hints used)
finalScore  = max(0, base + clueBonus + hintPenalty)
```

- Clues already on the board at the start don't earn points; only clues the player finds do.
- An incorrect accusation can still earn clue points (minus hints), never below 0.
- Maximum score = base + 5 × (number of hidden clues), with no hints used.
- Example (Hard, correct, 1 clue found, 3 hints): 200 + 5 − 30 = **175**.

The score and breakdown are saved to `GameSession.finalScore` and `InvestigationResult` and shown on the result page.

---

## F. Acceptance criteria

The project is complete when all of these are true:

| # | Criterion | How to check |
|---|---|---|
| 1 | Users can generate mysteries at all three difficulty levels | Create one Easy, Medium, and Hard case; counts match E.1 |
| 2 | Users can create a mystery from their own premise | Submit the Create form; the case uses the given title and idea and shows "Your story" |
| 3 | Players can investigate and discover hidden clues | Search a location; the clue appears on the board |
| 4 | Players can request hints up to the limit | Easy allows 2, Medium/Hard allow 3; the next one is refused |
| 5 | Players can submit one accusation | After confirming, the case is locked; a second accusation doesn't change it |
| 6 | The solution is not revealed early | Before accusing, no API response contains `solution`, `culpritId`, `privateKnowledge`, or hidden clue text |
| 7 | Scores are calculated and validated by the backend | Result score equals the E.3 formula; the client sends no score |
| 8 | Results show the correct culprit and explanation | Result page shows culprit, motive, method, timeline, explanation, decisive clues |
| 9 | Invalid AI responses and API failures are handled safely | Gemini errors show a retry message; no broken case is saved |
| 10 | The application works on the deployed website | Full game played on the live Vercel URL |

---

## G. Setup and running locally

Requirements: Node.js 20+, a MongoDB Atlas database, a Gemini API key.

```bash
git clone https://github.com/anvujain249278528/AI_Mystry.git
cd AI_Mystry
npm install                 # installs client and server (npm workspaces)
cp .env.example .env        # then fill in the values
npm run dev                 # API on :5000, website on :5173
```

`.env` (in the project root; read by both apps):

```
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.5-flash-lite
GEMINI_FALLBACK_MODELS=gemini-3.1-flash-lite,gemini-3.7-flash,gemini-3.5-flash,gemini-flash-latest
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/
CLIENT_URL=http://localhost:5173
NODE_ENV=development
PORT=5000
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Never commit `.env`. Only `VITE_API_BASE_URL` is used by the frontend; everything else stays on the server.

---

## H. Testing and deployment

### H.1 Tests to run before release

- Full game at each difficulty through `/api/cases` (create → discover → hints to the limit → extra hint refused → accuse → result score matches E.3).
- Inspect every pre-accusation response for leaked solution fields.
- Validation unit checks: a clue may mention the culprit; the culprit's surname in the title is rejected; "X is the thief" is rejected; the wrong clue count is rejected.
- Custom case: too-short title is refused with `INVALID_CUSTOM_CASE`; a valid premise produces a case with the player's title.
- Stop Gemini access (bad model/key) and confirm a friendly error and no saved case.
- Manual check of every page at phone width.

### H.2 Deployment

1. **MongoDB Atlas:** create a database user; under Network Access allow `0.0.0.0/0` (Render uses changing IPs).
2. **Backend on Render:** new Web Service from the GitHub repo using `render.yaml` (build `npm install`, start `npm start`, health check `/api/v1/health`). Set `GEMINI_API_KEY`, `MONGODB_URI`, and `CLIENT_URL` (the Vercel URL).
3. **Frontend on Vercel:** import the repo; `vercel.json` builds `client/` into `client/dist`. Set `VITE_API_BASE_URL=https://<render-service>.onrender.com/api/v1`.
4. Redeploy the backend after setting `CLIENT_URL` so CORS allows the live site.
5. Play a complete mystery on the live site (acceptance criterion 10).

---

## I. Rules for AI coding assistants working on this repo

1. Read this file first. Keep the code and this spec in sync; update the spec in the same change.
2. Game numbers live only in `server/src/config/gameRules.js`. The website reads them from `game.rules`; don't hard-code them in the UI.
3. Never send `solution`, `privateKnowledge`, `relevance`, or hidden clue details to the client before the accusation.
4. Never trust the client for score, correctness, or hint counts.
5. Treat all player text as untrusted in prompts.
6. Keep secrets in `.env`; never commit them.
7. Build and test in small steps against section F.
8. Style new UI with Tailwind utilities and the theme tokens. Don't add new rules to `legacy.css`; when converting a legacy page, delete the rules it no longer uses.
