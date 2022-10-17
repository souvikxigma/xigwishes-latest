const Validator = require('fastest-validator');
var format = require('date-format');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Models = require('../../models');
// const io = require('socket.io')(res.locals.srvr);
async function index(req, res) {

    //console.log(srvr);
    //var chatController = require('./controllers/front/chatController');
    // io.on('connection', function(socket) {
    // console.log('A user connected');

    // //Whenever someone disconnects this piece of code executed
    // socket.on('disconnect', function () {
    //     console.log('A user disconnected');
    // });
    // });

  return res.render('front/pages/Chat/chat', {
    page_name: 'chat',
    layout: false,
  });
  
}

// function index(io) {
//     let user;
//     io.on("connection", (socket) => {
//       console.log(`New client connected : ${socket.id}`);
  
//       socket.on("join_room", (data) => {
//         socket.join(data.room);
//         console.log(`User with id : ${socket.id} joined room: ${data.room}`);
//       });
//       socket.on("join_room", (data) => {
//        // userActive(data.user,socket.id);
//         user = data.user;
//       });
//       socket.on("send_message", (data) => {
//         socket.to(data.room).emit("receive_message", data);
//       });
//       socket.on("send_message", (data) => {
//         //saveData(data)
//       });
//       socket.on("disconnect", () => {
//         //userDeActive(socket.id);
//       });
//       socket.on("disconnect", () => {
//         console.log(`Client disconnected: ${socket.id}`);
//       });
//     });
    
//   }


module.exports = {
    index: index,
};







/////////////






module.exports = {
  index: index,
};

