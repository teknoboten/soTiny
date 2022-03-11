const express = require("express");
const app = express();
const PORT = 8080;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}...`);
});

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieSession = require('cookie-session');

app.use(cookieSession({
  name: 'session',
  keys: ['bestwisheswarmestregards'],
  maxAge: 24 * 60 * 60 * 1000
}));

app.set('view engine', 'ejs');

const bcrypt = require('bcryptjs');

//imported helper functions
const { getUserByEmail, getUserURLs, generateRandomString } = require('./helpers');

//fakeDBs
const urlDatabase = {};
const users = {};

app.get("/login", (req, res) => {

  const user = users[req.session['user_id']];

  if (user) {
    return res.redirect(302, "/urls");
  }

  const templateVars = { user };
  res.render("login", templateVars);
});

app.post("/login", (req, res) => {
//endpoint to handle login requests

  const { email, password } = req.body;
  const user = getUserByEmail(email, users);   //returns false if email not found
  

  if (!user) {
    const message = "User not found. ";
    const templateVars = { user, message };
    return res.status(403).render("error", templateVars);
  }

  if (!bcrypt.compareSync(password, user.password)) {

    const message = "Incorrect Password. ";
    const templateVars = { user, message };
    return res.status(403).render("error", templateVars);
  }
  
  req.session.user_id = user.id;
  res.redirect(302, "/urls");
});

app.get("/register", (req, res) => {

  const user = users[req.session['user_id']];

  if (user) {
    return res.redirect(302, "/urls");
  }

  const templateVars = { user };
  res.render("register", templateVars);
});

app.post("/register", (req, res) => {
//endpoint to handle new registrations

  let { email, password } = req.body;
  let user = undefined;

  if (password === "" | email === "") {

    const message = "Email or Password cannot be blank.";
    const templateVars = { user, message };
    return res.status(403).render("error", templateVars);
  }
  
  if (getUserByEmail(email, users)) {
  
    const message = "That email is already registered.";
    const templateVars = { user, message };
    return res.status(403).render("error", templateVars);
  }

  //create new user object and save
  password = bcrypt.hashSync(password, 10); //hash password
  const newUser = { id: generateRandomString(8), email, password };
  users[newUser.id] = newUser;

  //set cookie and redirect
  req.session.user_id = newUser.id;
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {

  req.session = null;

  res.redirect("/login");
});

app.get("/urls", (req, res) => {

  const user = users[req.session['user_id']];

  if (!user) {
    return res.redirect(302, "/login");
  }

  const urls = getUserURLs(user['id'], urlDatabase);
  const templateVars = { user, urls };

  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
//endpoint to handle new so tiny urls

  const user = users[req.session['user_id']];

  //if user is not logged in, send an error message
  if (!user) {
    const message = "Please log in to continue";
    return res.status(403).send(message);
  }
  
  //create a new entry in urldatabase
  const shortURL = generateRandomString(6);
  const userID = user.id;
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = { longURL, userID };

  res.redirect(302, `/urls/${shortURL}`); //redirect to show page for new url
});

app.get("/urls/new", (req, res) => {

  const user = users[req.session['user_id']];

  if (!user) {
    return res.redirect(302, "/login");
  }

  const templateVars = { user };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
//endpoint to serve unique show pages for each so tiny URL

  const user = users[req.session['user_id']];

  if (!user) {
    return res.redirect(302, "/login");
  }

  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: users[req.session['user_id']]
  };

  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL/edit", (req, res) => {
//endpoint to handle edit requests

  if (!req.session['user_id']) {
    return res.send("you must be logged in to do that");
  }

  //check if user_id cookie matches the shortURL userID
  if (urlDatabase[req.params.shortURL]['userID'] !== users[req.session['user_id']].id) {
    return res.send("you do not have permission to do that");
  }

  //if the given shortURL doesn't exist, return an error
  if (!urlDatabase[req.params.shortURL]) {
    return res.send("invalid soTiny URL");
  }

  //update the longURL and redirect
  urlDatabase[req.params.shortURL].longURL = req.body.longURL;
  res.redirect(302,`/urls`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
//endpoint to handle delete requests

  if (!req.session['user_id']) {
    return res.send("you must be logged in to do that");
  }

  //check if user_id cookie matches the given shortURL userID
  if (urlDatabase[req.params.shortURL]['userID'] !== users[req.session['user_id']].id) {
    return res.send("you do not have permission to do that");
  }

  //if the given shortURL doesn't exist, return an error
  if (!urlDatabase[req.params.shortURL]) {
    return res.send("invalid soTiny URL");
  }

  delete urlDatabase[req.params.shortURL];
  res.redirect(302, "/urls");
});

app.get("/u/:shortURL", (req, res) => {
//endpoint that makes urls so tiny!
// aka redirects each request to a unique shortURL to it's associated longURL

  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(302, longURL);
});

app.get("/", (req, res) => {
  res.redirect("/login");
});