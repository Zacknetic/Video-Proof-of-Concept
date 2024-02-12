import express from 'express';
import https from 'https';
import fs from 'fs';
import WebSocket from 'ws';

const app = express();

// Specify the path to your key and certificate
const key = fs.readFileSync('./server.key', 'utf8');
const cert = fs.readFileSync('./server.cert', 'utf8');

// Create an HTTPS server
const server = https.createServer({ key, cert }, app);

// Attach WebSocket server to the same HTTPS server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('A new client connected!');
    ws.on('message', (message) => {
        console.log('Raw message data:', message); // `message` is the raw data
        try {
            const data = JSON.parse(message.toString()); // Directly parse `message`
            console.log('Parsed message:', data);

            // Broadcasting message to all connected clients except the sender
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(message); // Sending the original message string
                }
            });
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });
});

// Use your desired port
const port = 3000;
server.listen(port, () => {
    console.log(`Server listening on https://192.168.50.12:${port}`);
});
