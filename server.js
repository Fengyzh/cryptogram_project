const express = require('express')
const axios = require('axios');
const app = express();
var cors = require('cors');
const pg = require('pg');

const cookieParser = require('cookie-parser')

app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser())

// imports database environment variables
const connection = require("../env.json");

const Pool = pg.Pool;
const pool = new Pool(connection);

pool.connect().then(function () {
    console.log("Connected!");
});

app.use(cors({
    origin: '*'
}));

app.get('/', function (req, res) {
  res.send('Hello World')
})

//Request grabs a large amounts of quote from a 3rd-party API, type.fit,
//and stores it in a local list. Each list is appended with an identifier number.
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
//
//Function randomizes and encrypts a key (gaurenteed to not match any original positions)
//Sends it to the client.
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
      let key =["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
        fisherYates(key)
        while (true){
            let match = false
            for (let j = 0; j<26; j++){
                if (alphabet[j] === key[j]){
                    match = true;
                }
            }
            if (match === true){
                fisherYates(key)
            } else {
                break;
            }
        }
        return key
    }
      //fisherYates(alphabet)
      //return alphabet
  
  
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

    let cookieFlag = true;

    if (!req.body.hasOwnProperty("solution")){
        res.status(400);
        res.send();
        return
    }

    pool.query(
        `SELECT DISTINCT userID FROM SCORE
        WHERE userID = $1`,
        [req.cookies.sessionID]
    ).then(function (response) {
        let sessionID = req.cookies.sessionID;

        console.log("Result:");
        console.log(response.rows);

        if (response.rows.length === 0){
            cookieFlag = false;
        }

        let data = req.body;
        let usrSol = data.userInput;
        let id = data.id;

        //let answer = quotes[id];
        let answer;

        for (i of quotes) {
            if (i.id === id) {
                answer = i.text;
                console.log("yes");
            }
        }

        let usrScore;
        
        if (validate(usrSol, answer)){
            usrScore =  computeScore();
            res.json({valid:true, score:100000});
        } else {
            res.json({valid:false});
            return
        }

        if (!cookieFlag){
            const life = 1000*60*60*24*20; //20 days
            sessionID = Math.floor((1+Math.random()) * Date.now());
            res.cookie('sessionID', sessionID, {expires: life + Date.now()});
        }

        pool.query(
            `INSERT INTO SCORE(quoteID, userID, score)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [answer, sessionID, userScore]
        ).then(function (response) {
            console.log("Inserted:");
            console.log(response.rows);
        }).catch(function (error) {
            console.log(error);
        })
    }).catch(function (error) {
        console.log(error);
    })
})

//Randomly generates a cookie based on timestamp of request
//There will be sliver of a chance on collision, but
//I've chose to forgo querying the database 
function getCookie(req, res){
    
}

//Handles selecting a letter for hint.
//Expects the form {userInput: String, quoteID:int}
app.post("/hint", cors(), function(req, res){
    let quoteID = req.body.quoteID;
    let pos = req.body.userInput;
    let answer;

    //Find quote according to ID
    for (i of quotes) {
        if (i.id === quoteID) {
            answer = i.text;
        }
    }

    fmtQuote = answer.replace(/\W/g, "");
    
    res.json({"letter": fmtQuote[pos], "pos": pos});
    return
})

app.listen(4000)
console.log("Server started")