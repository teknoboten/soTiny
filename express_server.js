const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const notCrypto = require('./notCrypto');

// const generateRandomString = require('randomstring');

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const generateRandomString = notCrypto();

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}...`);
});

app.get("/", (req, res) => {
  res.send('hey.');
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  // const templateVars = {}
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  //do something to add the URL here
  // const templateVars = { urls: urlDatabase };
  console.log(req.body);
  res.send('ok');
  // res.render("urls_show");
})

app.get("/urls/:id", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase };
  res.render("urls_show", templateVars);
});


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/some.html", (req, res) => {
  res.send("<html><h1>i am yelling this!</h1></html>");
});