import WebSocket from 'ws'
import initConfiguration from './configuration/init'
import express from 'express';
import http from 'http';
import { publisher, subscriber } from './configuration/caching/index';
import { getUuid } from './helpers/uuid';
import { isRoomConnection } from './helpers/common';


const app = express();
const PORT = process.env.PORT || 7071
app.use(initConfiguration())

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const WS_CHANNEL = "ws:messages";

subscriber.on("message", (channel, message) => {
    if (channel === WS_CHANNEL) {
        wss.clients.forEach(client => {
            const dataOutput = JSON.parse(message)
            if (client.readyState === WebSocket.OPEN && isRoomConnection(dataOutput, client)) {
                client.send(message);
            }
        });
    }
});

wss.getUniqueID = function () {
    return getUuid()
};

wss.on("connection", (ws, req) => {
    const id = wss.getUniqueID()
    ws.id = id;
    const room = req.url
    ws.room = room
    console.log(`***** New connection ${id} & room is ${room} *****`)
    ws.on("message", data => {
        let message = JSON.parse(data);
        message = {
            ...message,
            id: id,
            room: ws.room,
        }
        if (message.type === "broadcast") {
            publisher.publish(WS_CHANNEL, JSON.stringify(message));
        }
    });
});

subscriber.subscribe(WS_CHANNEL);

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});