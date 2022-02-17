const express = require('express')
const app = express()
var cors = require('cors')


app.get('/', function (req, res) {
  res.send('Hello World')
})


//Function utilizes Fisher-Yates algorithm for randomizing
//Source Code: http://sedition.com/perl/javascript-fy.html
app.get("/crypt", cors(), function (req, res){
  function randomizedKey(){
      function fisherYates ( myArray ) {
          var i = myArray.length;
          if ( i == 0 ) return false;
          while ( --i ) {
             var j = Math.floor( Math.random() * ( i + 1 ) );
             var tempi = myArray[i];
             var tempj = myArray[j];
             myArray[i] = tempj;
             myArray[j] = tempi;
          }
      }
      let alphabet =["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
      fisherYates(alphabet)
      return alphabet
  }
  
  function applyKey(string, key){
      let alphabet =["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
      string = string.toUpperCase();
      let encrypt = ""
      for (let i=0; i<string.length; i++){
          if (alphabet.includes(string[i])){
              let pos = alphabet.indexOf(string[i])
              encrypt += key[pos]
          } else {
              encrypt += string[i];
          }
      }
      return encrypt
  }
  
  key = randomizedKey();
  QUOTE = "Eat more chicken.";
  let newQuote = applyKey(QUOTE, key)
  res.send(newQuote)
})




app.listen(4000)
console.log("Server started")