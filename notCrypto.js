notCrypto = (num) => {
  const notSecure = ["a", "b", "c", "d", "e", "f", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  let randomString = "";

  for (let i = 0; i < num; i++){
    randomNum = (Math.random() * 10).toFixed(0);
    randomString += notSecure[randomNum]
  }
return randomString;
}


module.exports = { notCrypto };