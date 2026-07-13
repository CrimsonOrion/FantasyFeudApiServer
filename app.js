const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use('/game-content', express.static(path.join(__dirname, 'game-content')));

app.listen(PORT, (err) => {
    if (err) {
        return console.error(err);
    }
    return console.log('Fantasy Feud content server listening on port:', PORT);
});

app.get('/status', (req, res) => {
    res.json({ Status: 'Running' });
});

app.get('/game-content/seasons', (req, res) => {
    const fileData = fs.readFileSync('./game-content/seasons.json');
    res.json(JSON.parse(fileData));
});

app.get('/game-content/seasons/:id', (req, res) => {
    const seasonId = req.params.id;
    const fileData = fs.readFileSync('./game-content/' + seasonId + '/overview.json');
    res.json(JSON.parse(fileData));
});

app.get('/game-content/games/:id', (req, res) => {
    const seasonGameId = req.params.id.replace('---', '/');
    const fileData = fs.readFileSync('./game-content/' + seasonGameId + '/game.json');
    const jsonData = JSON.parse(fileData);

    const baseUrl = req.protocol + '://' + req.get('host') + '/game-content/' + seasonGameId + '/';
    const mediaKeys = ['media', 'audio', 'video'];

    function resolveUrl(value) {
        if (typeof value === 'string' && !/^https?:\/\//i.test(value)) {
            return baseUrl + value.replace(/^\.\//, '');
        }
        return value;
    }

    (jsonData.questions || []).forEach(function (question) {
        mediaKeys.forEach(function (mediaKey) {
            if (mediaKey in question) {
                question[mediaKey] = Array.isArray(question[mediaKey])
                    ? question[mediaKey].map(resolveUrl)
                    : resolveUrl(question[mediaKey]);
            }
        });
    });

    res.json(jsonData);
});
