// code away!
const server = require('./server');
// const port = 4500;
const port = process.env.PORT || 4500;


server.listen(port, () => {
   console.log(`Server running on port ${port}`)
})