const { resolveMediaUrls } = require('../lib/resolveMediaUrls');

const BASE_URL = 'http://localhost:3001/game-content/test-season/test-game-1/';

describe('resolveMediaUrls', () => {
    test('rewrites a relative media path (array) into an absolute URL', () => {
        const jsonData = {
            questions: [{ id: 'q1', media: ['./media/img/q1.jpg'] }]
        };

        resolveMediaUrls(jsonData, BASE_URL);

        expect(jsonData.questions[0].media).toEqual([
            'http://localhost:3001/game-content/test-season/test-game-1/media/img/q1.jpg'
        ]);
    });

    test('rewrites relative audio and video paths (strings) into absolute URLs', () => {
        const jsonData = {
            questions: [
                { id: 'q1', audio: './media/audio/q1.mp3' },
                { id: 'q2', video: './media/video/q2.mp4' }
            ]
        };

        resolveMediaUrls(jsonData, BASE_URL);

        expect(jsonData.questions[0].audio).toBe(
            'http://localhost:3001/game-content/test-season/test-game-1/media/audio/q1.mp3'
        );
        expect(jsonData.questions[1].video).toBe(
            'http://localhost:3001/game-content/test-season/test-game-1/media/video/q2.mp4'
        );
    });

    test('leaves an already-absolute URL unchanged', () => {
        const jsonData = {
            questions: [{ id: 'q1', media: ['https://example.com/img/q1.jpg'] }]
        };

        resolveMediaUrls(jsonData, BASE_URL);

        expect(jsonData.questions[0].media).toEqual(['https://example.com/img/q1.jpg']);
    });

    test('leaves questions without media/audio/video fields untouched', () => {
        const jsonData = {
            questions: [{ id: 'q1', question: 'Name something', answers: [{ answer: 'Sand', value: 40 }] }]
        };

        const result = resolveMediaUrls(jsonData, BASE_URL);

        expect(result).toEqual(jsonData);
    });

    test('handles a game with no questions array', () => {
        const jsonData = { id: 'test-season---test-game-1', game_title: 'Test Game #1' };

        expect(() => resolveMediaUrls(jsonData, BASE_URL)).not.toThrow();
    });
});
