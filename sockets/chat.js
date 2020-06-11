const express = require("express");
const route = require("express").Router()
const server = require('http').createServer(express);
const io = require("socket.io")(server);

io.on('connection', socket => { 
    // console.log("Socket joined", socket.id);

    socket.on("I'm thinking about this", ({ thoughts }) => {
        // sends out to all the clients
        io.emit("Someone said", { thoughts: escape(thoughts) });

        // sends back to the very same client
        //socket.emit("Someone said", { thoughts });

        // sends to all clients but the client itself
        // socket.broadcast.emit("Someone said", { thoughts });


    });

/*     socket.on('disconnect', () => {
        console.log("Socket left", socket.id);
    }); */
});

server.listen(3500)

module.exports = route