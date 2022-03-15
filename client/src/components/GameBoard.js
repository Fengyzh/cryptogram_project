import React, { useEffect, useState, useRef } from 'react';
import Word from './Word';
import './GameBoard.css';
import { GameContext } from './GameContext';
import Timer from './Timer';



export default function GameBoard() {


    const [words, setWords] = useState([]);
    const [quoteDetails, setQuoteDetails] = useState({
        id:""
    })
    //const [currentWords, setCurrentWords] = useState([]);
    const [hintAmount, setHintAmount] = useState(0);
    const [finish, setFinish] = useState(false);
    const [finishPageData, setFinishPageData] = useState({})
    const [message, setMessage] = useState(" ")
    const [scores, setScores] = useState([])


    let c = 0


    function getBoard() {
        let list = document.getElementsByClassName(`inputs`);
        let arr = []
        let dic = {}
        //console.log(list)
        for (let i of list) {
            if (dic[i.dataset.keyl] !== i.value){
                dic[i.dataset.keyl] = i.value
            }

            arr.push(i.value)
        }



        //console.log(arr)
        //console.log(dic)

        sendBoard(arr)
    }


    function sendBoard(data) {

        // TODO: Put stopTimer() when you recevice a valid response
        // Do nothing when the response is not valid (user input not right)

        console.log(data.join(""))
 

        fetch('http://localhost:4000/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        withCredentials: true,
        body: JSON.stringify({id:quoteDetails.id ,"solution": data.join("").toUpperCase(), "userInput": data.join("").toUpperCase(), "hintAmount": hintAmount, "time": time.sec}),
        }).then((response)=>{
            return response.json()
        }).then((data)=>{
          console.log("valid data", data)
          if (data.valid) {
              setTimerOn(false)
              toggleTimer(false)
              setFinish(true)
              setFinishPageData({"score": data.score})
              setMessage("")

          } else {
              setMessage("Invalid answer, Please try again")
              setTimeout(()=>{setMessage("")},2000)
              
          }
        })

        console.log("Hint: ", hintAmount)
        console.log("id: ", quoteDetails.id)
    }




    //Functionality for the Hint Component
function getHint() {

    // Hard Code sample of what the server will send back
    let temp = {"letter": "C", "index":7}

    // Get all the input tags
    let inputs = document.getElementsByClassName("inputs");

    // Use to store letters that the user already entered, they will be unique
    let letters = []

    for (let i of inputs) {
        if (!letters.includes(i.value) && i.value != "") {
            letters.push(i.value)
        }
    }


    // console.log('letters: ', letters) DEBUG

    // Pick a random number
    let rand = Math.floor(Math.random() * (inputs.length));
    
    let hintInputField = inputs[rand]

    // While the randomly selected input field is not empty (Already has a value)
    // Re-select another field
    while (hintInputField.value !== "") {
        rand = Math.floor(Math.random() * (inputs.length));
    
        hintInputField = inputs[rand]
    }




    /* Fetch Request when hint amount is < 5 */ 
    if (hintAmount < 5 && letters.length < 5) {
    fetch('http://localhost:4000/hint', {
    method: 'POST', 
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({"quoteID":quoteDetails.id , "userInput": rand}),
    }).then((response)=>{
        return response.json()
    }).then((data)=>{
        console.log(data)

    // Input value via code    
    var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    nativeInputValueSetter.call(hintInputField, data.letter);


    // Re-render OnChnage event so that it will fill in other input fields with the same key as the key provided by the hint
    var inputEvent = new Event('input', { bubbles: true});
    hintInputField.dispatchEvent(inputEvent);

    // Disable all input field with the same key after hint request
    for (let i of inputs) {
        if (i.dataset.keyl == hintInputField.dataset.keyl) {
            i.disabled = true;
        }
    }


    })

    // Increment hint count
    setHintAmount(prevHintAmount => prevHintAmount + 1)
}



    //console.log(hintInputField)  //DEBUG
    console.log("rand", rand)  //DEBUG


    //-----------DEBUG---------------//
    //inputs[temp["index"]].value = "C"
    //inputs[temp["index"]].dispatchEvent(new Event('change', { bubbles: true }))


    
    
}

    //Functionality for for Timer
    //Initiate Timer
    const [time, setTime] = useState({
        "sec": 0,
    })

    //When page loads, Timer is initially turned off
    const [timerOn, setTimerOn] = useState(false)

    //Set Interval for Timer use
    let interval = useRef(0)

    //Starts or clears timer depending on whether timer is enabled or not.
    //timerOn is set to the value of the input boolean flag.
    //If timer is (expected to be) available, increment the timer every second.
    function toggleTimer(timeFlag){
        clearInterval(interval.current);
        setTimerOn(timeFlag);

        if (timeFlag){
            interval.current = setInterval(()=>{
                let temp = time;
                temp.sec += 1;
                setTime({"sec": temp.sec});
            }, 1000)
        }
    }

    function handleRefresh() {
        window.location.reload(false)
    }


    function getScores() {
        fetch('http://localhost:4000/scores', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        withCredentials: true,
        body: JSON.stringify({quoteID: quoteDetails.id})}
        ).then((res)=>{
           return res.json()
        }).then((data)=>{
            console.log(data)
            if (data.rows.length == 0) {
                setScores(["No Scores Available"])
            } else {
                setScores(data.rows)
            }
        })
    }
    



    useEffect(() => {

        fetch('http://localhost:4000/crypt').then((response)=>{
            return response.json()
        }).then((data)=>{

            let wordData = data.quote.split(" ")
            let quoteID = data.id
            console.log(wordData)
            console.log(quoteID)
            setWords(wordData)
            setQuoteDetails({id: quoteID})

        }).then(()=>{
            let first = document.getElementsByClassName("inputs");
            first[0].focus()
        })



        
        let temp = {}

        for (let i = 0; i < words.keys.length; i++) {
            let split = words.keys[i].split("")
            for (let j = 0; j < split.length; j++) {
                if (!temp.hasOwnProperty(split[j])) {
                    temp[split[j]] = []
                    temp[split[j]].push([i,j])
                } else {
                    temp[split[j]].push([i,j])

                }
            }
        }

        console.log(temp)


        //Setting all same key field to have the same input


      },[]);



  return (
    <div>
        {finish? 
        <div className='finish-cover'>
           <div className='finish-title-wrapper'> 
            <h1 className='finish-title'> Correct! </h1>
            <h6> Score: {finishPageData.score} </h6>
            <button className='finish-btn' onClick={handleRefresh}> New Game </button>
            </div> 
        </div> :


    <GameContext.Provider value={c}>
    

    <h1> Cryptogram </h1>

        <div className='time-container'>
        <h1 className='time'> Time: {time.sec}</h1>
        </div>    



     <div className='board'>

        {/*console.log("state", state)*/}
        {/*console.log("value", value)*/}
    {words.map((wordss, index)=>{
        //console.log(wordss)
         return <Word timer={timerOn} setTimer = {() => toggleTimer(true)} wIndex={index} word={wordss} wordIndex= {words.values[index]}/>
    })}


    </div>


    <div>
    <button onClick={getBoard} className="button submit-btn">Submit</button>
   {/* <button onClick={sendBoard}> Send </button>*/}

    <button onClick={getHint} className="button hint-btn">Hint</button>

    <button onClick={getScores} className="button score-btn">Scores</button>


    <Timer time={time} start={() => toggleTimer(true)} stop={() => toggleTimer(false)}/>
    </div>
    <h2 className='message'>{message}</h2>
    <h2>Scores</h2>
    <div className='scores-display'>
        {scores.map((score)=>{
            return <h3 className='scores'>{score}</h3>
        })}
    </div>

    </GameContext.Provider>
}
    </div>
  )
}