const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.set('view engine', 'ejs');

let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

notCrypto = (num) => {
  const notSecure = ["a", "b", "c", "d", "e", "f", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  let randomString = "";

  for (let i = 0; i < num; i++){
    randomNum = (Math.random() * 10).toFixed(0);
    randomString += notSecure[randomNum]
  }
return randomString;
};

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}...`);
});


app.post("/login", (req, res) => {
  res.cookie("username", req.body.username)
  .redirect(302, "/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("username")
  // res.cookie("username", req.body.username)
  .redirect(302, "/urls");
})

app.get("/register", (req, res) => {
  const templateVars = { username: req.cookies['username']};
  res.render("register", templateVars);
})

app.post("/register", (req, res) => {
  console.log(req.params);
  console.log(req.body);
  res.redirect(302, "/urls");
})

app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  const templateVars = { 
    username: req.cookies['username'],
    urls: urlDatabase,
    shortURL: urlDatabase
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { username: req.cookies['username']};
  res.render("urls_new", templateVars);
});

app.post("/urls", (req, res) => {
  const shortURL = notCrypto(6);
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(302, `/urls/${shortURL}`);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL], 
    username: req.cookies['username']
  };
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL/edit", (req, res) => {
  urlDatabase[`${req.params.shortURL}`] = req.body.longURL;
  res.redirect(302,`/urls`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect(302, "/urls");
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(302, longURL);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

