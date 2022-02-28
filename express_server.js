const express = require("express");
const app = express();
const PORT = 8080; // default port 8080


app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


app.get("/", (req, res) => {
  res.send('hey.');
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}...`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/some.html", (req, res) => {
  res.send("<html><h1>i am yelling this!</h1></html>");
});