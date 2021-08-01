const WebSocket = require('ws');

const PORT = process.env.PORT || 7071

const wss = new WebSocket.Server({ port: PORT });
let CLIENTS = {};
wss.on('connection', (ws, req) => {
    const id = req.url
    upsertClientId(id, ws)
    ws.on('message', (messageAsString) => {
        try {
            const message = JSON.parse(messageAsString);
            console.log(message)
            const listWs = getClient(id)
            listWs.forEach((client) => {
                client.send(JSON.stringify(message));
            });
        } catch (error) {
            console.log(error)
        }
    });
});

const upsertClientId = (id, ws) => {
    if (CLIENTS[`${id}`]) {
        CLIENTS[`${id}`] = CLIENTS[`${id}`].concat(ws)
        return
    }
    CLIENTS[`${id}`] = [ws]
}

const getClient = (id) => {
    return CLIENTS[`${id}`]
}

wss.on("close", () => {
    CLIENTS = {}
});

console.log("wss up");