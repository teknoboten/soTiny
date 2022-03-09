const express = require("express");
const app = express();
const PORT = 8080;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}...`);
});

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.set('view engine', 'ejs');


const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "fe0af0c0"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "fe0af0c0"
  },
  "v9xVb4": {
    longURL: "http://bikerave.ca",
    userID: "0323dfb2"
  },
  "Ssm6xK": {
    longURL: "http://www.tweeter.com",
    userID: "edc0abe0"
  }
};

const notCrypto = (num) => {
//takes in a number (num) and returns a random-ish string of num length

  const notSecure = ["a", "b", "c", "d", "e", "f", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  let randomString = "t";

  for (let i = 0; i < num; i++) {
    const randomNum = (Math.random() * 10).toFixed(0);
    randomString += notSecure[randomNum];
  }
  return randomString;
};

const users = {
//user database

  edc0abe0: {
    id: 'edc0abe0',
    email: 'Moira@jazzagals.com',
    password: 'ohdannyboy'
  },
  fe0af0c0: {
    id: 'fe0af0c0',
    email: 'alexis@alittlebit.ca',
    password: 'ewdavid'
  },
  '0323dfb2': {
    id: '0323dfb2',
    email: 'david@roseapothacary.com',
    password: 'warmestregards'
  }
};

const getUser = (email, users) => {
//checks if the given (users) object contains given (email)
  //if true, returns the user
  //else, returns false

  for (const user in users) {
    if (email === users[user].email) {
      return users[user];
    }
  }
  return false;
};

const getUserURLs = (id, urlDB) => {
  let result = {};

  for (shortURL in urlDB) {
    if (urlDB[shortURL].userID === id) {
      result[shortURL] = urlDB[shortURL];
    }
  }
  return result;
};


app.get("/login", (req, res) => {

  if (req.cookies.user_id) { //if user is logged in, redirect
    return res.redirect(302, "/urls");
  }
  const templateVars = { user: users[req.cookies['user_id']]};
  res.render("login", templateVars);
});

app.post("/login", (req, res) => {
//endpoint to handle login requests

  const { email, password } = req.body;
  const user = getUser(email, users);   //returns false if email not found
  
  if (!user) {
    return res.status(403)
      .send("user not found");
  }

  if (user.password !== password) {
    return res.status(403).send("incorect password");
  }
  
  res.cookie("user_id", user.id)
    .redirect(302, "/urls");
});

app.get("/register", (req, res) => {

  if (req.cookies.user_id) { //if user is logged in, redirect
    return res.redirect(302, "/urls");
  }
  const templateVars = { user: users[req.cookies['user_id']]};
  res.render("register", templateVars);
});

app.post("/register", (req, res) => {
//endpoint to handle new registrations

  const { email, password } = req.body;

  if (password === "" | email === "") {
    return res.status(400).send("email or password cannot be blank!");
  }
  
  if (getUser(email, users)) {
    return res.status(400).send("email is already in use");
  }

  //create new user object using variables destructured from req.body (form data)
  
  const newUser = { id: notCrypto(8), email, password };  //generate and set unique id for newUser
  users[newUser.id] = newUser;      //save newUser object in users database
  res.cookie("user_id", newUser.id) //set a cookie using user_id value
    .redirect(302, "/urls");        //redirect to /urls
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id")  //clear cookie
    .redirect(302, "/urls");
});

app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {

  if (!req.cookies['user_id']) {
    return res.redirect(302, "/login");
  }

  const user = users[req.cookies['user_id']];
  urls = getUserURLs(user['id'], urlDatabase);
  const templateVars = { user, urls };

  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {

  if (!req.cookies.user_id) {
    return res.redirect(302, "/login");
  }

  const templateVars = { user: users[req.cookies['user_id']] };
  res.render("urls_new", templateVars);
});

app.post("/urls", (req, res) => {
//endpoint to handle new so tiny urls

  //if user is not logged in, send an error message
  if (!req.cookies.user_id) {
    return res.status(403).send("please log in to continue");
  }
  
  //create a new entry in urldatabase

  const shortURL = notCrypto(6);
  const userID = req.cookies.user_id;
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = { longURL, userID };

  res.redirect(302, `/urls/${shortURL}`); //redirect to show page for new url
});

app.get("/urls/:shortURL", (req, res) => {
//endpoint to serve unique show pages for each so tiny URL

  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: users[req.cookies['user_id']]
  };

  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL/edit", (req, res) => {
//endpoint to handle edit requests


  if (!req.cookies['user_id']) {
    return res.send("you must be logged in to do that");
  }

  //check if user_id cookie matches the shortURL userID
  if (urlDatabase[req.params.shortURL]['userID'] !== users[req.cookies['user_id']]) {
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

  if (!req.cookies['user_id']) {
    return res.send("you must be logged in to do that");
  }

  //check if user_id cookie matches the given shortURL userID
  if (urlDatabase[req.params.shortURL]['userID'] !== users[req.cookies['user_id']]) {
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

