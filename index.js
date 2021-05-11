const axios = require('axios');
const chokidar = require('chokidar');
require('dotenv').config();
const sysPath = require('path');
const webhookURL = process.env.WEBHOOK_URL;
const watchPath = process.env.WATCH_PATH;
const chokidarOptions = {
    ignoreInitial: true, // Disable alerts during application start up.
    ignored: path => {
        return /(^[.#~]|(?:__|~)$)/.test(sysPath.basename(path));
    },
    depth: 99,
    usePolling: true, // May result in high CPU utilization. Assists in monitoring over the network.
    interval: 100,
    awaitWriteFinish: true // Do not generate an alert until after the file has finished writing to the server.

};

const watcher = chokidar.watch(watchPath, chokidarOptions);
watcher.on('ready', (path) => {
    console.log(`Ready: Watching: ${watchPath}`)
    postMessageToTeams('Ready', `Watching: ${watchPath}`);
})

watcher.on('add', (path) => {
    console.log(`New file was added at ${path}`)
    postMessageToTeams('File Added', `New file was added at ${path}`);
})

watcher.on('change', (path) => {
    console.log(`A file was modified added at ${path}`)
    postMessageToTeams('File Modified', `A file was modified added at ${path}`);
})

watcher.on('unlink', (path) => {
    console.log(`File was deleted at ${path}`)
})

watcher.on('error', (err) => {
    console.log(`An error has occured: ${err}`)
    //postMessageToTeams('Error', `An error has occured: ${err}`);
})
const delay = interval => new Promise(resolve => setTimeout(resolve, interval));
async function postMessageToTeams(title, message) {
    const card = {
        '@type': 'MessageCard',
        '@context': 'http://schema.org/extensions',
        'themeColor': "0072C6", // light blue
        summary: 'Summary description',
        sections: [
          {
            activityTitle: title,
            text: message,
          },
        ],
    };
    
    try {
        await delay(1000);
        const response = await axios.post(webhookURL, card, {
            headers: {
                'content-type': 'application/vnd.microsoft.teams.card.o365connector',
                'content-length': `${card.toString().length}`,
            }
        });
        return `${response.status} - ${response.statusText}`;
    }
    catch(err) {
        return err;
    }

}