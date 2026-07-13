/*
 * Rewrite relative media/audio/video paths on a game's questions into
 * absolute URLs under baseUrl, so content authors can write "./media/..."
 * references that resolve correctly wherever the API happens to be hosted.
 */

const mediaKeys = ['media', 'audio', 'video'];

function resolveUrl(value, baseUrl) {
    if (typeof value === 'string' && !/^https?:\/\//i.test(value)) {
        return baseUrl + value.replace(/^\.\//, '');
    }
    return value;
}

function resolveMediaUrls(jsonData, baseUrl) {
    (jsonData.questions || []).forEach(function (question) {
        mediaKeys.forEach(function (mediaKey) {
            if (mediaKey in question) {
                question[mediaKey] = Array.isArray(question[mediaKey])
                    ? question[mediaKey].map(function (value) { return resolveUrl(value, baseUrl); })
                    : resolveUrl(question[mediaKey], baseUrl);
            }
        });
    });
    return jsonData;
}

module.exports = { resolveMediaUrls, resolveUrl };
