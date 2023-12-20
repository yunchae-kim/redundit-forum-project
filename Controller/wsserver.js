const WebSocket = require('ws');

const jwt = require('jsonwebtoken');

// web socket
const wss = new WebSocket.Server({ port: 8085, clientTracking: true });

// Map of connected clients (user - client id) pairs
const connectedUsers = new Map();

// connection event
wss.on('connection', (ws, req) => {
  console.log('New connection');
  let client = '';
  let token;
  // client authentication get the name from the token
  if (req.headers.token !== '') {
    token = req.headers.token;
  }
  if (ws.protocol !== '') { // the client's address
    token = ws.protocol;
  }

  jwt.verify(token, 'this_is_a_secret', (err, decoded) => {
    if (err) {
      console.log(`Error: ${err}`);
      return;
    }
    client = decoded.name;
    console.log(`New connection from user ${client}`);
    if (client !== 'webserver') {
      // add client to map of clients
      connectedUsers.set(String(client), ws);
    }
  });

  // message event: sent by the webserver
  ws.on('message', (message) => {
    console.log(`Received message ${message} from user ${client}`);
    if (client === 'webserver') {
      // get the text message
      const msg = JSON.parse(message);
      if(msg.type === 'message'){
        console.log(`new message notification ${connectedUsers.has(msg.data.to)} - ${connectedUsers.has(msg.data.from)}`);
        if(connectedUsers.has(msg.data.to) && connectedUsers.has(msg.data.from)){
          console.log(`send message`);
          // send message to receiver
          const newMessage = {type: 'new message', from: msg.data.from, text: msg.data.message};
          connectedUsers.get(msg.data.to).send(JSON.stringify(newMessage));
          // send update to sender
          console.log(`send receipt`);
          const update = {type: 'delivered', to: msg.data.to, text: msg.data.message};
          connectedUsers.get(msg.data.from).send(JSON.stringify(update));
        }
      }
      if(msg.type === 'new user'){ // ask all connected clients to update
        console.log(`new user notification`);
        const newUser = {type: 'new user', user: msg.data};
        connectedUsers.forEach((v) => { v.send(JSON.stringify(newUser))});
      }
  }
  });
  // welcome message
  const greet = {type:'welcome'}
  ws.send(JSON.stringify(greet));
});
