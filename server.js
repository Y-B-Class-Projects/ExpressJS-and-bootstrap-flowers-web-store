const express = require('express')
const bodyParser = require('body-parser');
const mongo = require("mongoose");
const favicon = require('express-favicon');
const app = express()
const port = 80

app.use(favicon(__dirname + '/public/images/favicon.ico'));

let db = mongo.createConnection();
(async () => {
    try {
        await db.openUri('mongodb://localhost:27017/flowers_store');
    } catch (err) {
        console.log("Error connecting to DB: " + err);
    }
})();

require("./users/users_model")(db)
require("./flowers/flowers_model")(db)

module.exports = model => db.model(model);

app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false }));

var flowers = require('./flowers/flowers_controller.js');
app.use('/flowers', flowers);

var users = require('./users/users_controller.js');
app.use('/users', users);

var navbar = require('./navbar/navbar_controller.js');
app.use('/navbar', navbar);

app.get('/', (req, res) => {
  res.render('index.html')  
})

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})

