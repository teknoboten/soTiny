const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

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
}


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
  const shortURL = notCrypto(6);
  urlDatabase[shortURL] = req.body.longURL;
  // console.log(urlDatabase);
  res.redirect(302, `/urls/${shortURL}`);

})

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  // const templateVars = { shortURL: urlDatabase, longURL: req.params.shortURL };
  const longURL = urlDatabase[req.params.shortURL];
  // res.redirect(longURL);
  // res.send(longURL);
  res.redirect(302, longURL);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
