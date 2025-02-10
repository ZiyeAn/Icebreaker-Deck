const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const { SerialPort } = require('serialport');

const app = express();
app.use(express.json());
app.use(cors());  // Allow frontend to send requests

const port = 3000;
const server = app.listen(port, () => console.log(`Server running on http://localhost:${port}`));

// WebSocket Server
const wss = new WebSocket.Server({ server });

// Open Serial Port for Arduino
const arduinoPort = new SerialPort({ path: '/dev/cu.usbmodem2101', baudRate: 9600 });

wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');

    ws.on('message', (message) => {
        console.log('Received:', message);

        // Send data to Arduino
        arduinoPort.write(message + '\n', (err) => {
            if (err) console.error('Error writing to Arduino:', err);
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// API Endpoint to Receive Print Requests
app.post('/print', (req, res) => {
    const { name, question, answer } = req.body;

    const printText = `
    Name: ${name}
    Q: ${question}
    A: ${answer}
    `;

    // Send to Arduino
    arduinoPort.write(printText + '\n', (err) => {
        if (err) return res.status(500).json({ error: 'Failed to send data' });
        console.log('Sent to Arduino:', printText);
        res.json({ message: 'Print command sent' });
    });
});