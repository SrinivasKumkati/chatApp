// Express.js is a popular web application framework for Node.js that simplifies the process of building web applications and APIs. 
// It provides a robust set of features for routing, handling requests and responses, middleware support, and much more.
const express = require("express");


//CROSS ORIGIN RESOURCE SHARING!(middleware function)
// However, there are legitimate use cases where a web application might need to make requests to servers on different domains!
// for example, when a frontend application needs to communicate with a backend API on a different domain.
// This is where the CORS middleware comes into play. When you use cors in your Node.js application, 
// it helps to handle these Cross-Origin requests by adding the necessary headers to the HTTP response.
const cors = require("cors");

const mongoose = require("mongoose");
//:used to interact with mongodb server

//here we are importing every user API routes into authRoutes Object
const authRoutes = require("./routes/auth");

const messageRoutes = require("./routes/messages");

const app = express();
//By creating an instance of express(),you're essentially initializing a new Express application that you can then configure and build upon.
//This app variable will be used to define routes, middleware, and handle HTTP requests and responses within your application.

//socket.io is a JavaScript library that enables real-time, bidirectional and event-based communication. 
//It is commonly used for building applications with real-time features, like chat applications, online games, and collaborative tools.
const socket = require("socket.io");

require("dotenv").config();


// In Node.js with the Express framework, app.use() is a method that is used to mount middleware functions in the request-response cycle.
// It specifies a function that will be executed for each request made to the server.
// Middleware functions in Express have access to the request object (req), the response object (res), 
// and the next middleware function in the application's request-response cycle.
 
// They can perform operations on the request and response objects, and can also choose to either terminate the 
// request-response cycle or pass control to the next middleware function.
app.use(cors());

// express.json() is middleware that intercepts the incoming request, reads any JSON included in the request's body, 
// and then parses it so that it's available as a JavaScript object in your route handlers.
app.use(express.json());


//here Node.js script that connects to a MongoDB database using the Mongoose library
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

//middle ware function..executions..
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

//here we are starting our server, if it succesful then we are printing port no!
const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);

//This argument should be a Node.js HTTP server instance. It's not shown in the provided code snippet,
// but it's assumed that server is defined elsewhere in your code.
const io = socket(server, {
  cors: {
    //giving access that from this host it can access the server...
    //http://localhost:3000 are allowed to access resources on the server. In other words, the client application 
    //running on http://localhost:3000 is permitted to establish a socket.io connection with this serve
    origin: "http://localhost:3000",
    credentials: true,
  },
});

//declaring global online users...
global.onlineUsers = new Map();

//It's setting up event listeners for various actions that occur when clients connect to the server. Let's break down the code:
//(socket) => { ... } is a callback function that runs when a new client connects. It takes socket as an argument, 
//which represents the communication channel with that specific client.

io.on("connection", (socket) => {

  //making global variable for this socket...!
  global.chatSocket = socket;

  //event listner for the socket object with event name "add-user" ....!
  //whenever any user added...then we add it in the online users with userId and socket.Id(to indentify it belongs to this socket..)
  socket.on("add-user", (userId) => {
    //here userId specific one for each user...paired with socket id..
    onlineUsers.set(userId, socket.id);
  });

  //seeing the current users right now..
  //console.log(onlineUsers);

  //This sets up an event listener on the socket object for an event named "send-msg"...
  //(data) => { ... } is a callback function that will be executed when the "send-msg" event is received. 
  //It takes data as an argument, which likely contains information about the message being sent.
  socket.on("send-msg", (data) => {
    //here with this we are checking that the user which we are sending is online or not..
    const sendUserSocket = onlineUsers.get(data.to);
    
    //if he is online he can see this image immediately..and stores it in the database..
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
    //if not online it will be stored only in the database directly...so when he get logged in it 
    //automatically takes all the info from database.
  });

});
