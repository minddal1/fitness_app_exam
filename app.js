const express = require("express");
const app = express();
const path = require("path");
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* Setup Knex with Objection */

const { Model } = require("objection");
const Knex = require("knex");
const knexfile = require("./knexfile.js");

const knex = Knex(knexfile.development);

Model.knex(knex);
const config = require("./config/config.json");

const session = require("express-session");

//PORTS
const PORT = 3000;

//Server Starting
app.listen(PORT, (error) => {
  if (error) {
    console.log(error);
  }
  console.log("Server is running on the port", PORT);
});

app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
  })
);

const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);

app.use("/login", limiter);
app.use("/signup", limiter);
app.use("/trainerLogin", limiter);
app.use("/trainerSignup", limiter);

const authRoute = require("./routes/auth.js");
app.use(authRoute);

const trainersRoute = require("./routes/trainers.js");
app.use(trainersRoute);

const redirectLogin = (req, res, next) => {
  if (!req.session.loggedin) {
    res.redirect("/trainerLogin");
  } else {
    next();
  }
};

// Public available routes
//Route for frontpage, the landing page.
app.get("/", (req, res) => {
  return res.sendFile(__dirname + "/view/frontpage.html");
});

//Route for loggin in
app.get("/clientLogin", (req, res) => {
  return res.sendFile(__dirname + "/view/clientLogin.html");
});

//Route for loggin in
app.get("/trainerLogin", (req, res) => {
  return res.sendFile(__dirname + "/view/trainerLogin.html");
});
//Route for loggin in
app.get("/clientChat", (req, res) => {
  return res.sendFile(__dirname + "/view/clientChat.html");
});

//Route for loggin in
app.get("/trainerChat", (req, res) => {
  return res.sendFile(__dirname + "/view/trainerChat.html");
});

//Route for loggin in
app.get("/chooseLogin", (req, res) => {
  return res.sendFile(__dirname + "/view/chooseLogin.html");
});

//Route for loggin in
app.get("/chooseSignup", (req, res) => {
  return res.sendFile(__dirname + "/view/chooseSignup.html");
});

//--------------------------
// Sign up routes
//Route for signing up
app.get("/signupClient", (req, res) => {
  return res.sendFile(__dirname + "/view/signupClient.html");
});
//Route for signing up
app.get("/signupTrainer", (req, res) => {
  return res.sendFile(__dirname + "/view/signupTrainer.html");
});
//--------------------------

app.get("/trainerDashboard", redirectLogin, (req, res) => {
  res.sendFile(__dirname + "/view/trainerDashboard.html");
});

//Route for dashboard, the first page a member meets when the login has been done
app.get("/dashboard", (req, res) => {
  return res.sendFile(__dirname + "dashboard.html");
});

const server = require("http").createServer(app);
const io = require("socket.io")(server);
const helmet = require("helmet");
const escape = require("escape-html");
app.use(helmet());

server.listen(3232, (error) => {
  if (error) {
    console.log("Error running the server");
  }
  console.log("The server is running on port", 3232);
});

// usernames which are currently connected to the chat
var usernames = {};

io.on("connection", (socket) => {
  // console.log(socket.id);

  socket.on("sendchat", (data) => {
    // we tell the client to execute 'updatechat' with 2 parameters
		io.sockets.emit('updatechat', socket.username, data);
	
  });

	// when the client emits 'adduser', this listens and executes
	socket.on('adduser', function(username){
		// we store the username in the socket session for this client
		socket.username = username;
		// add the client's username to the global list
		usernames[username] = username;
		// echo to client they've connected
		socket.emit('updatechat', 'SERVER', 'you have connected');
		// echo globally (all clients) that a person has connected
		socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
		// update the list of users in chat, client-side
		io.sockets.emit('updateusers', usernames);
	});

	// when the user disconnects.. perform this
	socket.on('disconnect', function(){
		// remove the username from global usernames list
		delete usernames[socket.username];
		// update list of users in chat, client-side
		io.sockets.emit('updateusers', usernames);
		// echo globally that this client has left
		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
  });
});
