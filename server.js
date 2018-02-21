const express = require('express');
const helmet = require('helmet');
const cors = require('cors'); // https://www.npmjs.com/package/cors
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Friend = require('./Friends/FriendModel.js');

const friendsAPI = require('./routes/api/friends');
const postsAPI = require('./routes/api/posts');

const server = express();

server.use(helmet()); // https://helmetjs.github.io/
server.use(cors()); // https://medium.com/trisfera/using-cors-in-express-cac7e29b005b
server.use(bodyParser.json());

server.use('/api/friends', friendsAPI);
server.use('/api/posts', postsAPI);

server.get('/', function(req, res) {
  res.status(200).json({ status: 'API Running' });
});

mongoose
  .connect('mongodb://localhost/GenericWebsite')
  .then(db => {
    console.log(
      `Successfully connected to -- ${db.connections[0].name} -- database`,
    );
  })
  .catch(err => {
    console.error('Database connection failed.');
  });

const port = process.env.PORT || 5005;
server.listen(port, () => {
  console.log(`API running on http://localhost:${port}.`);
});
