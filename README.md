# DirectoryWatcher

Watches a directory for new files or modifications. Uses a MS Teams webhook to send an alert.

Use a `.ENV` file to set options:
```
# .env
WEBHOOK_URL=http://webhook.url
WATCH_PATH=\\path\to\watch
```
`service.js` requires node-windows to be installed and linked.
```
npm i -g node-windows

Within the repo directory:
npm link node-windows
```
