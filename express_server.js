const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}...`);
});

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require('cookie-parser');
// const e = require("express");
app.use(cookieParser());

app.set('view engine', 'ejs');

let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const notCrypto = (num) => {
  const notSecure = ["a", "b", "c", "d", "e", "f", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  let randomString = "";

  for (let i = 0; i < num; i++) {
    const randomNum = (Math.random() * 10).toFixed(0);
    randomString += notSecure[randomNum];
  }
  return randomString;
};

const users = {
  edc0abe0: {
    id: 'edc0abe0',
    email: 'Moira@jazzagals.com',
    password: 'afsdfsdf'
  },
  fe0af0c0: {
    id: 'fe0af0c0',
    email: 'alexis@alittlebit.ca',
    password: 'ewdavid'
  },
  '0323dfb2': {
    id: '0323dfb2',
    email: 'david@roseapothacary.com',
    password: 'dfss'
  }
};

const getUser = (email, users) => {
  for (const user in users) {
    if (email === users[user].email) {
      return users[user]
    }
  }
  return false;
};

app.get("/login", (req, res) => {
  const templateVars = { user: users[req.cookies['user_id']]};
  res.render("login", templateVars);
});

app.post("/login", (req, res) => {

  const { email, password } = req.body; //destructure email password
  const user = getUser(email, users);
  
    if (!user){ //if false, return 403 
      res.status(403)
        .send("user not found");
    } 

    if (user.password !== password){
      res.status(403)
      .send("incorect password");
    } 

    else {
      res.cookie("user_id", user.id)
      .redirect(302, "/urls");
    }
});


app.get("/register", (req, res) => {
  const templateVars = { user: users[req.cookies['user_id']]};
  res.render("register", templateVars);
});

app.post("/register", (req, res) => {

  const { email, password } = req.body; //destructure email password

  if (password === "" | email === "") {   //check for blank inputs
    res.status(400)
      .send("email or password cannot be blank!");

} else if (getUser(email, users)) {  //if checkEmail returns true, email is already in use
  res.status(400)
    .send("email is already in use");

  } else {  //create new user and save to users object

    const newUser = { id: notCrypto(8), email, password };
    users[newUser.id] = newUser;
    res.cookie("user_id", newUser.email)
      .redirect(302, "/urls");
  }
  
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id")
    .redirect(302, "/urls");
});

app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {

  const templateVars = {
    user: users[req.cookies['user_id']],
    urls: urlDatabase,  //refactor this
    shortURL: urlDatabase
  };

  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { user: users[req.cookies['user_id']] };
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
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(302, longURL);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

