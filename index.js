const path = require('path');
const express = require('express');
const app = express();
app.use(express.json());
app.use('/', express.static(path.join(__dirname, './')));

const HOST = '0.0.0.0';
const PORT = 3000;

app.get('/', (req, res) => res.json({ success: true, message: "We're fucking doing this shit" }));

app.get('/frame', (req, res) => res.sendFile(path.join(__dirname, '/frame/index.html')));
app.get('/sender', (req, res) => res.sendFile(path.join(__dirname, '/sender/index.html')));

app.listen(PORT, '192.168.0.12', () => console.log(`Running on port ${PORT}`));