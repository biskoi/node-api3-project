const express = require('express');

const userRouter = require('./users/userRouter');
const server = express();

server.use(express.json())
server.use(logger)
server.use('/api/users', userRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
console.dir(`${req.method} to ${req.originalUrl} with query ${JSON.stringify(req.query)} at ${new Date().toISOString()}`)
// JSON.stringify is turning the req.query object into a string so that we can see it in our console.dir
next();
}

module.exports = server;
