export const setupWSConnection = (updateContacts, updateMessages, texts) => {
  // if not registered, do nothing
  if (sessionStorage.getItem("token") === null) {
    return;
  }

  // Create WebSocket connection
  const socket = new WebSocket("ws://localhost:8085", sessionStorage.getItem("token"));

  // Connection opened
  socket.addEventListener("open", () => {
    console.log("ws connection opened");
    socket.send("Hello Server!");
  });

  // Listener for messages
  socket.addEventListener("message", (event) => {
    // parse message to json
    const pushMessage = JSON.parse(event.data);
    console.log("Message from server ", pushMessage);
    if (pushMessage.type === "new user") {
      console.log(`user ${pushMessage.user}`);
      updateContacts(); // update contacts to fire re-rendering
    }
    if (pushMessage.type === "delivered") {
      texts.current.push(`sent(${pushMessage.to}): ${pushMessage.text}`);
      // update previous message box via state and props
      updateMessages(); // update messages to fire re-rendering
    }
    if (pushMessage.type === "new message") {
      console.log("new message");
      texts.current.push(`${pushMessage.from}: ${pushMessage.text}`);
      // update previous message box via state and props
      updateMessages(); // update messages to fire re-rendering
    }
  });

  // Connection closed
  socket.addEventListener("close", (_event) => {
    console.log("Connection closed bye bye! ");
  });
};
