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

let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const notCrypto = (num) => {
//takes in a number (num) and returns a random-ish string of num length

  const notSecure = ["a", "b", "c", "d", "e", "f", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  let randomString = "";

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


app.get("/login", (req, res) => {
  const templateVars = { user: users[req.cookies['user_id']]};
  res.render("login", templateVars);
});


app.post("/login", (req, res) => {
//endpoint to handle login requests

  const { email, password } = req.body;
  const user = getUser(email, users);   //returns false if email not found
  
  if (!user) {
    res.status(403)
      .send("user not found");
  }

  if (user.password !== password) {
    res.status(403)
      .send("incorect password");
  } else {
    res.cookie("user_id", user.id)
      .redirect(302, "/urls");
  }
});


app.get("/register", (req, res) => {
  const templateVars = { user: users[req.cookies['user_id']]};
  res.render("register", templateVars);
});


app.post("/register", (req, res) => {
//endpoint to handle new registrations

  const { email, password } = req.body;

  if (password === "" | email === "") {
    res.status(400)
      .send("email or password cannot be blank!");

  } else if (getUser(email, users)) {
    res.status(400)
      .send("email is already in use");

  } else {
  //create new user object using variables destructured from req.body (form data)
  
    const newUser = { id: notCrypto(8), email, password };  //generate and set unique id for newUser
    users[newUser.id] = newUser;      //save newUser object in users database
    res.cookie("user_id", newUser.id) //set a cookie using user_id value
      .redirect(302, "/urls");        //redirect to /urls
  }
  
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id")  //clear cookie
    .redirect(302, "/urls");
});

app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  const templateVars = {
    user: users[req.cookies['user_id']],
    urls: urlDatabase,
  };
  res.render("urls_index", templateVars);
});


app.get("/urls/new", (req, res) => {
  const templateVars = { user: users[req.cookies['user_id']] };
  res.render("urls_new", templateVars);
});


app.post("/urls", (req, res) => {
//endpoint to handle new so tiny urls

  const shortURL = notCrypto(6);    //generate random unique string
  urlDatabase[shortURL] = req.body.longURL; //create database object with shortURL as the key and longURL as value
  res.redirect(302, `/urls/${shortURL}`); //redirect to show page for new url
});

app.get("/urls/:shortURL", (req, res) => {
//endpoint to serve unique show pages for each so tiny URL

  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[req.cookies['user_id']]
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
//endpoint that makes urls so tiny!
// aka redirects each request to the unique shortURL to it's associated longURL

  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(302, longURL);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
