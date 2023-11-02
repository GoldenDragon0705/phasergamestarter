const SOCKET_IDS = require('./eventids.socket');

const users = {};
// var of rooms
const rooms = {
  running: {},
  waiting: {}
};
const sockets = {};
let roomId = 0;

const Socket = (io) => {
  io.on("connection", (socket) => {

    console.log("A client is connected: " + socket.id);
    sockets[socket.id] = {
      username : "",
      roomId : 0,
      socket
    };

    socket.on(SOCKET_IDS.ENTER, data => {

      console.log("A client send to enter event: " + socket.id);

      const { username } = data;
      // set username of this socket
      sockets[socket.id].username = username;
      const nUsers = Object.keys(users);
      // if this user create room
      if(nUsers % 2 == 0) {
        const newRoomId = ++roomId;
        // create waiting room and enter this room
        rooms.waiting[newRoomId] = { players : [ username ] };
      } else {
        // get waiting room Ids
        const waitingRoomIds = Object.keys(rooms.waiting);
        if(waitingRoomIds.length) {
          const enterRoomId = waitingRoomIds[0];
          let room = rooms.waiting[enterRoomId];
          // update room info
          room = {...room, players : room.players.push (username)};
          if(rooms.running[roomId]) delete rooms.running[roomId];
          // this room's status is running
          rooms.running[roomId] = room;
          delete rooms.waiting[roomId];
          // send result to client enter a room

        } else {
          // no waiting rooms, you need create a room or send result to enter room is failed


        }
      }
    });

    socket.on("disconnect", () => {
      console.log("A client is disconnected: " + socket.id);
      const socketInfo = sockets[socket.id];
      if(!socketInfo) return;
      // get out from room
      if(socket.roomId) {

      }
      // remove user
      if(socket.username) {

      }
    });
  });

};

module.exports = Socket;