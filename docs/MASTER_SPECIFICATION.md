# Multiplayer Bingo and Trivia Web App

## 1. Project Overview

Build a complete, functional, real-time multiplayer bingo and trivia web application that lets friends compete in private game sessions.

The application combines customizable bingo cards, points for completed squares, bonuses for completed rows and columns, live trivia rounds, extra points for the first correct trivia answer, and a real-time leaderboard.

The experience should feel like a polished mobile game when opened in a phone browser, while also working well on desktop and tablet browsers.

This project is a WEB APPLICATION ONLY.

Do not build a native iOS application, native Android application, or Progressive Web App. Do not spend time implementing app installation, app-store distribution, or native device integrations. Use responsive web design and ordinary browser capabilities.

The application must be functional, not merely a static mockup. Implement real database persistence, secure backend logic, and real-time synchronization across players' devices.

### Core requirements

- Players can create and join private game sessions.
- The host is also a full participant in the game.
- Every player receives a bingo card.
- Players mark their own completed squares using the honour system.
- Players earn points for squares and bonus points for completed lines.
- The host can initiate trivia rounds at any time during gameplay.
- All players, including the host, receive and answer trivia questions.
- Correct trivia answers earn normal points.
- The first player to submit a correct answer earns an additional speed bonus.
- A live leaderboard displays rankings and scores.
- The game preserves progress through refreshes and temporary disconnections.
- The host can end the game and display final results.

## 2. Technology Stack

Use the following technologies unless the existing project already uses a suitable, compatible stack:

- Frontend: React with TypeScript.
- Styling: Tailwind CSS.
- UI components: shadcn/ui or an equivalent accessible component library.
- Backend and database: Supabase with PostgreSQL.
- Authentication: Supabase Auth, supporting secure guest identities.
- Real-time functionality: Supabase Realtime.
- Server-side logic: Supabase Edge Functions and secure PostgreSQL functions or transactions.
- Hosting: Vercel or an equivalent web hosting platform.

Build a modular, maintainable, type-safe application.

Inspect the existing repository before making changes. Reuse working components and infrastructure wherever possible.

Do not hardcode fake players, fake scores, or simulated multiplayer events into the production application. Demo data may be used in a clearly identified development mode.

## 3. User Roles and Host Participation

Every participant has a player identity within a session.

One participant additionally has host permissions. The host is both an administrator and a normal competitor.

### Host permissions

The host can:
- Create a game session.
- Configure bingo prompts and scoring rules before the game starts.
- Create trivia questions and answer choices.
- Configure trivia time limits and scoring bonuses.
- Generate and share an invite code.
- View players in the lobby.
- Start, pause, resume, and end the game.
- Initiate trivia rounds during gameplay.
- Close a trivia round early.
- Reveal the correct answer and explanation after a round closes.
- View the leaderboard and final results.

### Host participation

The host must also be able to:
- Receive their own bingo card automatically.
- Mark their own bingo squares.
- Earn bingo square points and line bonuses.
- Receive and answer trivia questions.
- Earn regular trivia points and first-correct-answer bonuses.
- Appear on the leaderboard.
- Compete for first place and win the game.

When creating a game, automatically register the host as a player. The host must not have to rejoin using the invite code or create a second account.

Separate administrative permissions from player participation in the data model.

The host must follow the same scoring rules as every other player. Do not award extra points merely for being the host, and do not reveal trivia answers to the host before they are revealed to all participants.

## 4. Game Creation

Create a straightforward game creation workflow.

The host enters:
- Game name.
- Display name.
- Bingo board configuration.
- Bingo prompts.
- Scoring settings.
- Trivia questions and answer choices.
- Trivia time limit.
- First-correct-answer bonus value.
- Bingo card arrangement preference.

Default settings:

| Setting | Default |
|---|---:|
| Bingo board | 5×5 |
| Free center square | Enabled |
| Completed square | 10 points |
| Completed row | 50 bonus points |
| Completed column | 50 bonus points |
| Completed diagonal | 50 bonus points |
| Correct trivia answer | 100 points |
| Incorrect trivia answer | 0 points |
| First correct answer bonus | 50 additional points |
| Trivia time limit | 20 seconds |
| Answer choices per question | 4 |

Make the scoring values and trivia settings configurable by the host before the game starts.

The host must be able to enter bingo prompts individually or paste a list of prompts into a multiline field.

Each trivia question must have:
- Question text.
- Two to six answer choices.
- One correct answer.
- Optional explanation.
- Point value.
- Optional time limit.

Validate the configuration before creating the session. Require enough bingo prompts to populate the selected board and ensure every trivia question has a valid correct answer.

Once the game begins, lock settings that would invalidate existing cards, scores, or trivia answers.

## 5. Session Creation and Invite Codes

Generate a unique, easy-to-share invite code containing 6–8 alphanumeric characters.

Generate and validate invite codes on the backend. Prevent duplicate active codes.

Players join by entering:
- Invite code.
- Display name.

On successful joining:
- Create the player's membership.
- Generate or assign their bingo card.
- Load the game configuration.
- Show the player in the lobby.
- Synchronize their presence with the other participants.

The host must already appear in the lobby as a player.

The lobby displays:
- Game name.
- Invite code.
- Copy invite code button.
- Share link or invitation button.
- Player list.
- Player count.
- Host indicator.
- Start game button visible only to the host.

Use ordinary web links to share invitations. If someone opens a valid invitation URL, direct them to the join screen with the invite code prefilled.

Reject invalid invite codes, ended sessions, and unauthorized requests with clear error messages.

## 6. Bingo Cards

Each player receives a bingo card populated with the host's prompts.

Support two arrangements:

1. Identical arrangement: every player receives the same prompt arrangement.
2. Shuffled arrangement: every player receives the same prompt pool in a different order.

The default should be shuffled cards.

Persist each card's layout so it remains unchanged after a refresh or reconnection.

Every player, including the host, receives a card.

Display the bingo board as a responsive grid of large, touch-friendly squares.

Each square can have two main states:
- Not completed.
- Completed.

When a player taps a square:
1. Send the completion request to the backend.
2. Validate the player, session, square, and game status.
3. Record the square completion.
4. Award the square points exactly once.
5. Recalculate qualifying bingo-line bonuses.
6. Update the player's score and leaderboard.

### Honour system

The game uses the honour system exclusively.

Players are responsible for marking squares that they have genuinely completed. There is no host approval queue, no pending verification state, and no approval workflow.

The host follows the same honour system as every other player.

Players can optionally unmark a square if the host enables that setting. If a square is unmarked, reverse its square points and recalculate completed lines. Do not allow the same line bonus to be earned repeatedly by marking and unmarking the same squares.

Prevent duplicate points from repeated taps, browser retries, or repeated API requests.

## 7. Bingo Scoring

Implement all scoring on the backend. Never trust the frontend to determine or submit the final score.

Default rules:

- Completed square: +10 points.
- Completed horizontal row: +50 bonus points.
- Completed vertical column: +50 bonus points.
- Completed diagonal: +50 bonus points.
- Correct trivia answer: +100 points.
- First correct trivia answer bonus: +50 additional points.
- Incorrect or unanswered trivia: 0 points.

For a 5×5 board, evaluate:
- Five horizontal rows.
- Five vertical columns.
- Two main diagonals.

A free center square counts as completed for line detection but does not award ordinary square points.

Support multiple qualifying lines being completed from a single square completion.

Each line bonus can be awarded only once per player per line. Store a persistent record of awarded bonuses. If a player later unmarks and re-marks squares, do not award the same bonus again.

When a player completes a line, display a notification such as "BINGO! +50 points."

Use database transactions or secure backend functions to prevent race conditions and duplicate score awards.

Record every score change in an auditable score-event ledger.

The player's displayed total must agree with their recorded score events.

## 8. Trivia Rounds

The host can initiate a trivia round at any point while the game is in progress, provided no other trivia round is active.

When the host starts trivia:

1. The backend selects an eligible question from the configured trivia pool.
2. The backend creates a trivia round with a server-authoritative start time and deadline.
3. All connected players receive the same question and answer choices.
4. A trivia overlay appears on every player's screen, including the host's.
5. Each player submits one multiple-choice answer.
6. The backend validates and records each answer.
7. The round closes when the timer expires or the host closes it early.
8. The correct answer and optional explanation are revealed to everyone.
9. Regular trivia points and the first-correct-answer bonus are awarded.
10. The leaderboard updates in real time.

### Trivia interface

Display:
- Question text.
- Answer choices.
- Countdown timer.
- Answer submission confirmation.
- Status indicating whether the player has answered.
- Correct answer after the round closes.
- Optional explanation.
- Points awarded.

Use large, accessible answer buttons suitable for mobile browsers.

After submitting an answer, a player cannot change it or submit another answer for that round.

If a player does not answer before the deadline, their answer is recorded as unanswered and they receive no trivia points or speed bonus.

The host must answer their own question like every other player. Starting a round does not automatically submit an answer.

### Question pool

Avoid repeating questions until the available pool has been exhausted, unless the host explicitly enables question repetition.

If no unused questions remain, inform the host and allow them to restart the pool or end the trivia phase.

Prevent multiple trivia rounds from being active simultaneously.

## 9. First-Correct-Answer Bonus

This is a core game mechanic and must be implemented carefully.

The first player to submit a correct answer to a trivia question receives an additional speed bonus.

With the default configuration:
- Correct answer: +100 points.
- First correct answer: +50 additional points.
- Total for the first correct answer: 150 points.

Every other player who answers correctly receives the normal 100 points.

Incorrect and unanswered questions receive zero points.

### Determining who answered first

Use the backend as the authoritative source of truth.

When a player submits an answer, the backend must:
1. Verify that the trivia round is active.
2. Verify that the submission arrives before the deadline.
3. Verify that the player belongs to the session.
4. Verify that the player has not already submitted an answer.
5. Record the answer and its server-side receipt timestamp atomically.
6. Validate whether the submitted answer is correct.
7. If it is correct and no first-correct-answer bonus has been awarded, award the bonus to this player.
8. If the bonus has already been awarded, award only the normal correct-answer points.

Use an atomic database transaction, lock, or equivalent concurrency-safe mechanism to ensure only one player receives the bonus.

The first player to submit a correct answer wins the bonus, not necessarily the first player to click an answer button on their device.

Do not use the player's device clock to determine the winner.

If multiple submissions arrive almost simultaneously, use the authoritative server-side processing order or a precisely defined database receipt-order rule. Apply the same deterministic rule consistently.

Award the speed bonus only to a correct answer. An incorrect answer can never receive it.

If a trivia round closes early, accept only answers received before the effective closing time.

### Bonus notifications

After the round closes:
- Tell the bonus winner that they received the extra points.
- Show the number of points earned for the question.
- Display the correct answer to everyone.
- Update the leaderboard.

Do not reveal who is currently leading the race for the bonus while a question is active unless a separate live speed indicator is explicitly implemented.

The first-correct-answer bonus must be awarded once per trivia round. Prevent duplicate awards caused by retries, concurrent submissions, or repeated result processing.

## 10. Real-Time Multiplayer Synchronization

Use Supabase Realtime or an equivalent reliable mechanism.

Synchronize:
- Players joining and leaving.
- Player presence.
- Game status.
- Bingo square completion.
- Score changes.
- Active trivia questions.
- Answer submission status where appropriate.
- Trivia round closure.
- Correct answer reveal.
- Leaderboard rankings.

The leaderboard must update without refreshing the page.

Persist game state in PostgreSQL. Real-time messages should notify clients about changes rather than serve as the only source of truth.

On reconnection, reload the authoritative state from the backend.

Prevent duplicate player entries, duplicate score awards, and duplicate trivia submissions when reconnecting.

The host's administrative controls must not interfere with their normal gameplay screen.

## 11. Leaderboard

Create a leaderboard accessible throughout the game.

Display:
- Player rank.
- Display name.
- Host indicator.
- Total score.
- Completed bingo squares.
- Completed lines.
- Trivia questions answered correctly.
- Speed bonuses earned.

Sort players by total points in descending order.

Use a consistent tie-breaking rule. Players with equal scores can share a rank, with a secondary display ordering by the time they reached that score.

Highlight the current player and the top three positions.

Include the host in all rankings. The host must be able to win the game.

Update rankings immediately after square completions, line bonuses, and trivia results.

Ensure all totals are derived from trusted backend scoring.

## 12. Game Lifecycle and Host Controls

Support these game states:
- Lobby.
- In progress.
- Paused.
- Ended.

The host can start, pause, resume, and end the game.

Only the host can execute administrative actions.

When the game is paused:
- Prevent new bingo completions.
- Prevent new trivia submissions.
- Handle an active trivia round according to a clearly implemented rule, such as pausing the remaining time safely.

When the game ends:
- Stop accepting new scoring actions.
- Close any active trivia round consistently.
- Finalize score events.
- Display final standings.
- Announce the winner.
- Display each player's score breakdown.
- Allow players to review their performance.
- Allow the host to return to the home screen or create another game.

Do not automatically transfer host permissions when the host disconnects. Preserve their role and game state.

## 13. Database Schema

Create PostgreSQL tables with appropriate foreign keys, unique constraints, indexes, and Row Level Security.

### profiles
Store user identity and profile information.

### game_sessions
Store:
- Session ID.
- Game name.
- Invite code.
- Host identity.
- Session status.
- Scoring configuration.
- Board configuration.
- Creation and update timestamps.

### session_players
Store:
- Session ID.
- Player identity.
- Display name.
- Host-permission indicator or role.
- Join time.
- Last-seen information.

The host must have exactly one player membership in each session.

### bingo_prompts
Store the session's configured bingo prompts.

### player_bingo_cards
Store each player's card layout and configuration.

### bingo_squares
Store each square's prompt, position, completion status, and completion timestamp.

### trivia_questions
Store question text, answer choices, correct answer, explanation, point value, time limit, and question order.

### trivia_rounds
Store the session, question, start time, deadline, closing time, and round status.

Include a field or associated record for the player who earned the first-correct-answer bonus.

### trivia_answers
Store each player's answer, server-side receipt timestamp, correctness, and award status.

Enforce one submission per player per trivia round.

### score_events
Store:
- Session ID.
- Player ID.
- Event type.
- Related square, line, or trivia round.
- Point change.
- Timestamp.
- Idempotency key.

Ensure a trivia round can award its first-correct-answer bonus only once.

Use unique constraints to prevent duplicate square points, duplicate line bonuses, duplicate trivia points, and duplicate speed bonuses.

Use atomic server-side operations to calculate and apply scoring changes safely.

Provide versioned database migrations and reproducible setup instructions.

## 14. Security and Authorization

Implement secure authentication, authorization, and Supabase Row Level Security.

Requirements:
- Only session members can access private session data.
- Only the host can modify game settings and game state.
- Players can submit actions only for their own player identities.
- Players cannot modify their total score directly.
- Clients cannot award themselves points.
- Correct answers remain private until the question closes.
- Only authorized backend logic can award the first-correct-answer bonus.
- Players cannot change another player's bingo squares or answers.
- Invite codes must be validated on the backend.
- Rate-limit repeated join attempts and suspicious submissions.
- Validate all inputs.
- Never expose service-role keys or other secrets in frontend code.
- Protect backend functions against unauthorized direct calls.

If guest accounts are supported, use secure persistent guest identities or authenticated sessions. A display name or invite code alone must never authorize changes to an existing player's data.

Do not treat a hidden frontend button as a security boundary. Enforce permissions on the backend and in database policies.

## 15. Main Web Pages

Build these pages and components:

### A. Home page
- App name and logo.
- Create Game button.
- Join Game button.
- Short explanation of the game.

### B. Create Game page
- Game name and display name.
- Bingo prompt editor.
- Board configuration.
- Scoring settings.
- Trivia question builder.
- Trivia timer settings.
- First-correct-answer bonus settings.
- Card arrangement options.

### C. Join Game page
- Invite code field.
- Display name field.
- Join Game button.
- Helpful validation errors.

### D. Lobby page
- Game name.
- Invite code and sharing controls.
- Player list.
- Host indicator.
- Host's own player entry.
- Start Game button.

### E. Bingo page
- Responsive bingo grid.
- Current score.
- Progress toward completed lines.
- Notifications for completed squares and bingo lines.
- Navigation to the leaderboard.
- Host controls when applicable.

### F. Trivia overlay
- Question.
- Answer choices.
- Countdown timer.
- Submission status.
- Correct answer reveal.
- Explanation.
- Points earned.
- First-correct-answer bonus notification.

### G. Leaderboard page
- Live rankings.
- Total points.
- Bingo statistics.
- Trivia statistics.
- Speed bonus statistics.

### H. Final results page
- Winner announcement.
- Final standings.
- Score breakdown.
- Play again or return home.

## 16. Visual Design and Responsive Web Experience

Create a polished, modern party-game interface.

Use:
- Dark navy or charcoal backgrounds.
- Bright accent colours.
- Rounded cards and bingo tiles.
- Readable typography.
- Large touch-friendly controls.
- Smooth, subtle scoring animations.
- Clear selected and completed states.
- Animated leaderboard updates.
- Prominent trivia overlays.

Optimize for mobile browsers first while ensuring a strong desktop experience.

Provide a simple navigation pattern between Bingo, Leaderboard, and Host Controls.

When trivia appears, preserve the current bingo state and return the player to their previous screen when the round finishes.

Use accessible colour contrast, visible focus states, semantic HTML, keyboard navigation, and descriptive labels.

This is a browser-based web app only. Do not implement:
- Native iOS or Android applications.
- App-store packaging.
- Native mobile SDK integrations.
- PWA installation or service-worker functionality.
- App-store release processes.

Ordinary responsive browser behaviour and secure web sharing are sufficient.

## 17. Error Handling and Reliability

Handle:
- Invalid or expired invite codes.
- Ended sessions.
- Duplicate display names according to the chosen policy.
- Insufficient bingo prompts.
- Invalid trivia questions.
- Duplicate requests.
- Simultaneous answer submissions.
- Trivia deadlines and late answers.
- Host disconnection.
- Player reconnection.
- Page refreshes.
- Database failures.
- Network interruptions.
- Unauthorized actions.
- Attempts to award duplicate points.

Preserve scores, card layouts, answers, and game state in the database.

Display clear loading states, helpful error messages, and retry options.

Never silently reset a player's progress after a refresh or reconnection.

## 18. Automated Tests and Acceptance Criteria

Write automated tests for backend scoring, permissions, game lifecycle, and concurrent trivia submissions.

The application is not complete until all of the following work:

1. A host can create a game and automatically participate as a player.
2. The host receives a bingo card without rejoining the session.
3. Multiple players can join using the invite code on separate devices.
4. Every player can mark their own bingo squares using the honour system.
5. Each square awards points exactly once.
6. Rows, columns, and diagonals award the correct bonuses.
7. Unmarking a square reverses its points and updates line completion correctly.
8. The host can initiate trivia and answer the question themselves.
9. All participants receive the same question and deadline.
10. Players can submit only one answer per round.
11. Correct answers remain hidden until the round closes.
12. Correct answers earn regular trivia points.
13. Incorrect and unanswered questions earn no points.
14. The first correct answer earns the additional speed bonus.
15. Two simultaneous correct submissions cannot both receive the speed bonus.
16. An incorrect submission cannot win the speed bonus.
17. Duplicate requests cannot award duplicate points.
18. The leaderboard updates without refreshing.
19. The host appears in the rankings and can win.
20. Refreshing or reconnecting preserves game state.
21. Unauthorized users cannot alter scores, answers, or host settings.
22. Ending the game produces accurate final results.
23. The application works in modern mobile and desktop web browsers.

Include tests for concurrency and edge cases, especially the first-correct-answer bonus.

## 19. Implementation Plan

Inspect the existing project and preserve working functionality.

Implement in phases:

Phase 1: Project setup, database schema, secure player identities, session creation, invite codes, lobby, and host participation.

Phase 2: Bingo cards, honour-system marking, scoring engine, line bonuses, and score-event ledger.

Phase 3: Real-time synchronization, player presence, and live leaderboard.

Phase 4: Trivia question builder, timed trivia rounds, answer submission, and answer reveal.

Phase 5: First-correct-answer bonus, atomic bonus allocation, score notifications, and concurrency tests.

Phase 6: Host controls, game lifecycle, reconnection handling, and final results.

Phase 7: Security review, database policies, automated tests, responsive design, and deployment preparation.

Test each phase before proceeding. Do not stop after creating the UI or a simulated demo.

Do not claim a feature works unless it has been implemented and tested.

## 20. Final Deliverables

Provide:
- Complete working web application source code.
- Database schema and migrations.
- Secure backend functions and authorization policies.
- Automated tests.
- Environment variable template.
- Local development instructions.
- Supabase configuration instructions.
- Deployment instructions.
- A list of completed features.
- A list of any remaining limitations.

Begin by inspecting the repository and implementing Phase 1. Continue through all phases, keeping the application functional throughout development.

The final result must be a real multiplayer web app in which friends can join a shared session, play bingo, answer trivia, earn points, compete for the first-correct-answer bonus, and watch the leaderboard update live. The host must participate on equal scoring terms while retaining game-management permissions.