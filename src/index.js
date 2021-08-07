import WebSocket from 'ws'
import initConfiguration from './configuration/init'
import express from 'express';
import http from 'http';

// import { getClient, onClear, upsertClientId } from './actions/index';
import { publisher, subscriber } from './configuration/caching/index';

const app = express();
const PORT = process.env.PORT || 7071
app.use(initConfiguration())

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const WS_CHANNEL = "ws:messages";

subscriber.on("message", (channel, message) => {
    if (channel === WS_CHANNEL) {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }
});

wss.on("connection", ws => {
    console.log("new connection");
    ws.on("message", data => {
        const message = JSON.parse(data);
        if (message.type === "get-users") {
            ws.send(JSON.stringify(message));
        }

        if (message.type === "broadcast") {
            publisher.publish(WS_CHANNEL, JSON.stringify(message));
        }
    });
});

subscriber.subscribe(WS_CHANNEL);

// wss.on('connection', async (ws, req) => {
//     const id = req.url
//     const key = req.headers['sec-websocket-key'];
//     await upsertClientId(id, key, ws)
//     ws.on('message', async (messageAsString) => {
//         try {
//             const message = JSON.parse(messageAsString);
//             console.log(message)
//             const listWs = await getClient(id, key)
//             listWs.forEach((client) => {
//                 if (client && client.key !== key) {
//                     console.log('vao', client.key)
//                     client.ws.send(JSON.stringify(message));
//                 }
//             });
//         } catch (error) {
//             console.log(error)
//         }
//     });
// });

// wss.on("close", () => {
//     onClear()
// });

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});