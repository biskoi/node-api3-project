const express = require('express');

const userRouter = require('./users/userRouter');
const server = express();

const motd = process.env.MOTD || `${new Date().toISOString()}`

server.use(express.json())
server.use(logger)
server.use('/api/users', userRouter);

server.get('/', (req, res) => {
  res.send(`<h2>MOTD: ${motd}</h2>`);
});

//custom middleware

function logger(req, res, next) {
console.dir(`${req.method} to ${req.originalUrl} with query ${JSON.stringify(req.query)} at ${new Date().toISOString()}`)
// JSON.stringify is turning the req.query object into a string so that we can see it in our console.dir
next();
}

module.exports = server;
