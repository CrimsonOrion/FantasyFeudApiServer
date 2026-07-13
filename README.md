# Fantasy Feud API Server

The game-content server. It holds the static question/answer data for Fantasy
Feud games (and their media) and serves it as JSON over HTTP, the same way
`jeopardy-api-server` does for Jeopardy. It doesn't know anything about live
game state (scores, strikes, who's revealed) — that's [FantasyFeudServer](../FantasyFeudServer)'s job.

## Content layout

```
game-content/
  seasons.json                      list of seasons
  <season-id>/
    overview.json                   list of games in that season
    <game-id>/
      game.json                     the questions for that game
      media/                        optional audio/image files for a question
```

A `game.json` looks like:

```json
{
  "id": "test-season---test-game-1",
  "game_title": "Test Game #1",
  "description": "Sample beach-themed test game",
  "questions": [
    {
      "id": "q1",
      "question": "Name something you find at the beach",
      "answers": [
        { "answer": "Sand", "value": 40 },
        { "answer": "Water", "value": 30 }
      ]
    }
  ]
}
```

A question can optionally include `media`, `audio`, or `video` fields with
paths relative to that game's folder (e.g. `"./media/audio/clip.mp3"`) —
the server rewrites these into absolute URLs based on the request host when
a game is fetched, so content authors never hardcode a domain.

## Endpoints

| Method | Path                          | Returns                                   |
|--------|-------------------------------|--------------------------------------------|
| GET    | `/status`                     | `{ "Status": "Running" }`                 |
| GET    | `/game-content/seasons`       | contents of `seasons.json`                |
| GET    | `/game-content/seasons/:id`   | contents of `<season-id>/overview.json`   |
| GET    | `/game-content/games/:id`     | a game's `game.json`, with media URLs resolved. `:id` is `<season-id>---<game-id>` |

Media files themselves are also served directly under `/game-content/...`
via static file serving.

## Adding a new season or game

1. Add an entry to `game-content/seasons.json` with a new `id`.
2. Create `game-content/<season-id>/overview.json` listing the games in
   that season (each with an `id` of `<season-id>---<game-id>`).
3. Create `game-content/<season-id>/<game-id>/game.json` with the questions.
4. Drop any media files under `game-content/<season-id>/<game-id>/media/`
   and reference them with relative paths in `game.json`.

## Usage

```bash
npm install
npm start
```

Listens on port `3001` by default (override with the `PORT` env var).
