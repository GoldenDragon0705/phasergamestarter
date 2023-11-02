const socket = io();

socket.on(SOCKET_PROC.QUIT_SUCCESS, (data) => {
  console.log("quit success")
  // quitGame(data)
})
const enter = () => {
  const username = document.getElementById("input").value;
  socket.emit(SOCKET_PROC.ENTER_ROOM, { username });

  socket.on(SOCKET_PROC.ENTER_SUCCESS, (data) => {
    createGame(data);
  })

}