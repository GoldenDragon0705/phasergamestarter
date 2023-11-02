
const enter = () => {
  const socket = io();
  const username = document.getElementById("input").value;

  socket.emit(SOCKET_PROC.ENTER_ROOM, { username })

  socket.on(SOCKET_PROC.START, (data) => {
    createGame(data);
    
  })
}