const request = require('supertest');
const app = require('../app');

describe('GET /status', () => {
    test('reports running', async () => {
        const response = await request(app).get('/status');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ Status: 'Running' });
    });
});

describe('GET /game-content/seasons', () => {
    test('returns the seasons list', async () => {
        const response = await request(app).get('/game-content/seasons');

        expect(response.status).toBe(200);
        expect(response.body).toContainEqual(
            expect.objectContaining({ id: 'test-season' })
        );
    });
});

describe('GET /game-content/seasons/:id', () => {
    test('returns the games in that season', async () => {
        const response = await request(app).get('/game-content/seasons/test-season');

        expect(response.status).toBe(200);
        expect(response.body).toContainEqual(
            expect.objectContaining({ id: 'test-season---test-game-1' })
        );
    });
});

describe('GET /game-content/games/:id', () => {
    test('returns the questions for that game', async () => {
        const response = await request(app).get(
            '/game-content/games/test-season---test-game-1'
        );

        expect(response.status).toBe(200);
        expect(response.body.game_title).toBe('Test Game #1');
        expect(response.body.questions).toHaveLength(5);
        expect(response.body.questions[0]).toEqual(
            expect.objectContaining({
                question: 'Name something you find at the beach',
                answers: expect.arrayContaining([{ answer: 'Sand', value: 40 }])
            })
        );
    });

    test('500s when the game does not exist', async () => {
        const response = await request(app).get('/game-content/games/nope---nope');

        expect(response.status).toBe(500);
    });
});
