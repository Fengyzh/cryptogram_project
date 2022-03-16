const express = require('express')
const axios = require('axios');
const app = express();
var cors = require('cors');
const pg = require('pg');

var cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser())

// imports database environment variables
const connection = require("./env.json");

const Pool = pg.Pool;
const pool = new Pool(connection);

pool.connect().then(function () {
    console.log("Connected!");
});

app.use(cors({
    credentials: true,
    origin: true
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
    console.log(req.cookies)
    // Needed to avoid CORS issues
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    
    let data = req.body;
    let usrSol = data.userInput;
    let id = data.id;
    let hintUsed = data.hintAmount;
    let timeUsed = data.time

    let totalScore = 0
    let actualScore = 0

    function computeScore() {
        actualScore = totalScore - (hintUsed*500) - ((Math.floor(timeUsed/30))*100)
        console.log(hintUsed, timeUsed)  // DEBUG
        console.log("inside: ", actualScore)
        if (actualScore < 0) {
            actualScore = 0
        }
    }

    function compressString(string) {
        return string.replace(/\W/g, "").toUpperCase();
    }

    function validate(string_1, string_2){
        new_str = compressString(string_2)
        console.log(new_str)
        console.log(string_1)
        //console.log(string_2)
        
        if (string_1 === new_str){
            totalScore = new_str.length*500
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

    let answer;

    for (i of quotes) {
        if (i.id === id) {
            answer = i.text;
            console.log("yes");
        }
    }
    totalScore = compressString(answer).length * 500;
    computeScore();
    console.log("sessionID Check: ", req.cookies.sessionID)

    pool.query(
        `SELECT DISTINCT userID FROM COOKIES
        WHERE userID = $1`,
        [req.cookies.sessionID]
    ).then(function (response) {
        
        let sessionID = req.cookies.sessionID;

        console.log(response.rows);

        if (response.rows.length === 0){
            cookieFlag = false;
        }
        
        if (!cookieFlag){
            const life = 1000*60*60*24*20; //20 days
            sessionID = Math.floor((1+Math.random()) * Date.now());
            res.cookie('sessionID', sessionID, {expires: new Date(life + Date.now())});
            pool.query(
                `INSERT INTO COOKIES(userID)
                VALUES ($1)
                RETURNING *`,
                [sessionID]
            ).then(function (response) {
                console.log("Inserted:");
                console.log(response.rows);
            }).catch(function (error) {
                console.log(error);
            })
            console.log("cookie made")
        }

        if (validate(usrSol, answer)){
            res.json({valid:true, score:actualScore});

            pool.query(
                `INSERT INTO SCORES(quoteID, userID, score)
                VALUES ($1, $2, $3)
                RETURNING *`,
                [id, sessionID, actualScore]
            ).then(function (response) {
                console.log("Inserted:");
                console.log(response.rows);
            }).catch(function (error) {
                console.log(error);
            })
        } else {
            res.json({valid:false});
        }
    

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


app.post("/scores", cors(), (req,res)=>{

    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    let cookieID = req.cookies.sessionID
    let scores = []
    pool.query(
        `SELECT * FROM SCORES WHERE userid = $1`,
        [cookieID]
    ).then((response)=>{
        for (i of response.rows) {
            scores.push({"score": i.score, "quoteID": i.quoteid})
        }
        res.json({"rows":scores})
    })
})





app.listen(4000)
console.log("Server started")