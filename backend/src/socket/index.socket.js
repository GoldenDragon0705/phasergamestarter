const SOCKET_IDS = require('./eventids.socket');

// var of rooms
const rooms = {
  running: {},
  waiting: {}
};
const sockets = {};
const users = {};
let roomId = 0;


const Socket = (io) => {
  io.on("connection", (socket) => {

    const thisSocketId = socket.id;

    console.log("A client is connected: " + thisSocketId);

    sockets[thisSocketId] = {
      username : "",
      roomId : 0,
      socket
    };

    socket.on(SOCKET_IDS.ENTER, data => {

      console.log("A client send to enter event: " + thisSocketId);

      // get username from socket request
      const { username } = data;

      const createRoomAndEnter = () => {
        const newRoomId = ++roomId;
        // create waiting room and enter this room
        rooms.waiting[newRoomId] = { roomId: newRoomId, players : {
          [username] : { socketId: thisSocketId }
        }};
        // socket.emit(SOCKET_IDS.ENTER_SUCCESS, { ...rooms.waiting[newRoomId] });
        // if after 30s, this room is not auto-closed, close this room

        // bind user and room info to room
        sockets[thisSocketId].roomId = newRoomId;
        sockets[thisSocketId].username = username;
      };

      // validate of this username is not duplicated
      if(Object.keys(users).indexOf(username) >= 0) {
        // this username is duplicated
        socket.emit(SOCKET_IDS.USERNAME_DUPLICATED);
        return ;
      }

      users[username] = { socket, roomId : 0 };

      // set username of this socket
      sockets[thisSocketId].username = username;
      const nUsers = Object.keys(users);
      // if this user create room
      if(nUsers & 1 == 0) {
        createRoomAndEnter();
      } else {
        // get waiting room Ids
        const waitingRoomIds = Object.keys(rooms.waiting);
        if(waitingRoomIds.length) {
          const enterRoomId = waitingRoomIds[0];
          let room = rooms.waiting[enterRoomId];
          let oppoisteUsername = Object.keys(rooms.waiting[enterRoomId].players)[0];
          // update room info
          room = {...room, players : {
            ...room.players,
            [username] : { socketId : thisSocketId }
          }};
          if(rooms.running[roomId]) delete rooms.running[roomId];
          // this room's status is running
          rooms.running[roomId] = room;
          delete rooms.waiting[roomId];
          // send result to clients enter a room
          socket.emit(SOCKET_IDS.ENTER_SUCCESS, { 
            ...rooms.running[roomId], 
            me: { username },
            opposite : { username : oppoisteUsername } });

          sockets[room.players[oppoisteUsername].socketId].socket.emit(SOCKET_IDS.ENTER_SUCCESS, {
            ...rooms.running[roomId], 
            me : { username : oppoisteUsername },
            opposite : { username }});
            // bind user and room info to room
            sockets[thisSocketId].roomId = roomId;
            sockets[thisSocketId].username = username;
        } else {
          // no waiting rooms, you need create a room or send result to enter room is failed
          createRoomAndEnter();
        }
      }
    });

    const outFromRoom = (isConnected = false) => {
      const roomId = sockets[thisSocketId].roomId;
      const username = sockets[thisSocketId].username;
      if(rooms.running[roomId]) {
        console.log("Request quit room is running. " + roomId);
        delete rooms.running[roomId].players[username];
        const oppositeName = Object.keys(rooms.running[roomId].players)[0];
        const oppositeSocketId = rooms.running[roomId].players[oppositeName].socketId;
        /* waiting[roomId] = rooms.running[roomId]; */
        // delete running room
        delete rooms.running[roomId];
        sockets[oppositeSocketId].socket.emit(SOCKET_IDS.QUIT_SUCCESS);
        isConnected && sockets[thisSocketId].socket.emit(SOCKET_IDS.QUIT_SUCCESS);
        // destroy oppoiste socket info
        sockets[oppositeSocketId].roomId = 0;
        sockets[oppositeSocketId].username = "";
        delete users[oppositeName];
        // send to opposite user to this user is outed, so this match is stopped and waiting
      } else if(rooms.waiting[roomId]) {
        delete rooms.waiting[roomId];
      }
      sockets[thisSocketId].roomId = 0;
      sockets[thisSocketId].username = "";
      delete users[username];
    };

    socket.on(SOCKET_IDS.QUIT, () => {
      console.log("Recevie quit event from client.: " + thisSocketId);
      outFromRoom(true);
    });

    socket.on("disconnect", () => {
      console.log("A client is disconnected: " + thisSocketId);
      const socketInfo = sockets[thisSocketId];
      if(!socketInfo) return;
      // get out from room
      if(socketInfo.roomId) {
        outFromRoom();
      }
      delete sockets[thisSocketId];
    });
  });

};

module.exports = Socket;