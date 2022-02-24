const express = require('express')
const axios = require('axios');
const app = express()
var cors = require('cors')

app.use(express.json())
app.use(express.static("public"))

app.use(cors({
    origin: '*'
}));

app.get('/', function (req, res) {
  res.send('Hello World')
})

let quotes = [];
axios.get("https://type.fit/api/quotes").then(function (response){
    for (let i=0; i<response.data.length; i++){
        response.data[i].id = i
        quotes.push(response.data[i]);
    }
    // console.log(quotes);
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

  function pickRandQuote(){
    let i = Math.floor( Math.random() * ( quotes.length + 1 ) );
    console.log("currentQuote: ", quotes[i])
    return quotes[i];
  }
  
  key = randomizedKey();
  let quote = pickRandQuote();
  let newQuote = applyKey(quote.text, key)
  res.json({id:quote.id, quote:newQuote, author:quote.author})
})


app.post("/auth", cors(), function(req, res){
    
    function validate(string_1, string_2){
        new_str = string_2.replace(/\W/g, "").toUpperCase();
        console.log(new_str)
        console.log(string_1)
        //console.log(string_2)
        
        if (string_1 === new_str){
            return true;
        }
    
        return false;
    }

    if (!req.body.hasOwnProperty("solution")){
        res.status(400);
        res.send();
        return
    }

    let data = req.body;
    let usrSol = data.userInput;
    let id = data.id;

    
    //let answer = quotes[id];
    let answer;

    //console.log(quotes)
    
    for (i of quotes) {
        if (i.id === id) {
            answer = i.text
            console.log("yes")
        }
    }
    
    if (validate(usrSol, answer)){
        res.json({valid:true, score:100000});
    } else {
        res.json({valid:false});
    }

    return;

})

app.listen(4000)
console.log("Server started")