const express = require("express");
const app = express();
const ejsMate = require("ejs-mate");
const path = require('path');
const bodyParser = require('body-parser');

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { serverDownArr, serverUpArr } = require("./init");

app.get('/', async (req, res) => {
  console.log(serverDownArr, serverUpArr);
  res.render("index", { serverDownArr, serverUpArr }); // Corrected render syntax
});

app.listen(8080, () => {
  console.log("Listening on port 8080");
});

