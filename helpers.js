const getUserByEmail = (email, users) => {
  //checks if the given (users) object contains given (email)
    //if true, returns the user
    //else, returns false
  
    for (const user in users) {
      if (email === users[user].email) {
        return users[user];
      }
    }
    return undefined;
  };
  
  const getUserURLs = (id, urlDB) => {
    let result = {};
  
    for (const shortURL in urlDB) {
      if (urlDB[shortURL].userID === id) {
        result[shortURL] = urlDB[shortURL];
      }
    }
    return result;
  };


const generateRandomString = (num) => {
  //takes in a number (num) and returns a random-ish string of num length
  
    const notSecure = ["a", "b", "c", "d", "e", "f", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let randomString = "t";
  
    for (let i = 0; i < num; i++) {
      const randomNum = (Math.random() * 10).toFixed(0);
      randomString += notSecure[randomNum];
    }
    return randomString;
  };

  module.exports = { getUserByEmail, getUserURLs, generateRandomString };