const fs = require('fs');

const fallbackFile = process.env.FALLBACK_FILE ?? 'index.html';
const buildPath = process.env.BUILD_PATH ?? 'build';

module.exports = async (context) => {
    let url = context.req.path;
    url = url === '/' ? '/' + fallbackFile : url;

    let path = __dirname + '/' + buildPath + url;

    if(!fs.existsSync(path)) {
        path = __dirname + '/' + buildPath + '/' + fallbackFile
    }

    return context.res.send(fs.readFileSync(path), 200, { 'content-type': getContentTypes(path) });
};
