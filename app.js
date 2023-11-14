const http = require('http');
const fs = require('fs');
const socketIo = require('socket.io');

const server = http.createServer((req, res) => {
    if (req.url === '/index.html' || req.url === '/') {
        fs.readFile('index.html', (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    }
});

const io = socketIo(server);

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Assign roles to users
    const role = io.sockets.sockets.size % 2 === 0 ? 'you' : 'partner';

    // Send role information to the connected user
    socket.emit('role', role);

    socket.on('message', (message) => {
        io.emit('message', { id: role, message });
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 5500;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
