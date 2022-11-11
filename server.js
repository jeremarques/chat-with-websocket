const express = require('express');
const path = require('path');
const { createServer } = require('http')
const { Server } = require('socket.io');

const app = express(); 
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
  res.render('index.html');
});

const messages = [];

io.on("connection", socket => {
  console.log(`Socket: ${socket.id}`);

  socket.emit('previousMessages', messages);

  socket.on('sendMessage', data => {
    messages.push(data)
    socket.broadcast.emit('receivedMessage', data);
  })
});

httpServer.listen(3000);