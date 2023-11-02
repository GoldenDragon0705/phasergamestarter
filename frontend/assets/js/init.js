
const enter = () => {
  const socket = io(
  );
  const data = document.getElementById("input").value;
  console.log(data, socket)

  socket.emit(SOCKET_PROC.ENTER_ROOM, { data: data })

  socket.on(SOCKET_PROC.START, (data) => {
    createGame(data);
    
  })
}