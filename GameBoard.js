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
        body: JSON.stringify({id:quoteDetails.id ,"solution": data.join("").toUpperCase(), "userInput": data.join("").toUpperCase()}),
        }).then((response)=>{
            return response.json()
        }).then((data)=>{
          console.log("valid data", data)
          if (data.valid) {
              setTimerOn(false)
              toggleTimer(false)
              setFinish(true)
              
          }
        })
        
        console.log("Hint: ", hintAmount)
        console.log("id: ", quoteDetails.id)
    }




    //Functionality for the Hint Component
    function getHint() {

        // Get all the input tags
        let inputs = document.getElementsByClassName("inputs");

        // Use to store letters that the user already entered, they will be unique
        let keys = []

        // Loop through all the inputs
        for (let i of inputs){

            // If there is a key in the input that is not in the key array, append it
            if (!keys.includes(i.value.toUpperCase())){
                keys.push(i.value.toUpperCase())
            }
        }

        // Should print out all the keys that the user entered
        console.log("keys:", keys)

        // Data send to server format
        // {userInput:keys, quoteID:xxx}


        // HARD CODE test purposes showing that the server should send back
        // letter: The letter that server gives as a hint; index: the first occurence of that key in the quote array 
        let temp = {"letter": ["C"], "index":7}

         // Grab the input in the provided index and put "C" (the hint letter) in it
        var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(inputs[temp["index"]], 'C');


        // Re-render OnChnage event so that it will fill in other input fields with the same key as the key provided by the hint
        var inputEvent = new Event('input', { bubbles: true});
        inputs[temp["index"]].dispatchEvent(inputEvent);
        
        
        
        //-----------DEBUG---------------//
        //inputs[temp["index"]].value = "C"
        //inputs[temp["index"]].dispatchEvent(new Event('change', { bubbles: true }))

    
        setHintAmount(prevHintAmount => prevHintAmount + 1)
        
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

    useEffect(() => {
        //setValue(words)


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



        // Fetch here
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
        //setState(temp)


        //Setting all same key field to have the same input
        
       
      },[]);



  return (
    <div>
        {finish? 
        <div className='finish-cover'>
           <div className='finish-title-wrapper'> 
            <h1 className='finish-title'> Correct! </h1>
            <button className='finish-btn' onClick={handleRefresh}> New Game </button>
            </div> 
        </div> :


    <GameContext.Provider value={c}>
    <h1> Welcome to Cryptogram </h1>
     <div className='board'>
   
        {/*console.log("state", state)*/}
        {/*console.log("value", value)*/}
    {words.map((wordss, index)=>{
        //console.log(wordss)
         return <Word timer={timerOn} setTimer = {() => toggleTimer(true)} wIndex={index} word={wordss} wordIndex= {words.values[index]}/>
    })}

    
    </div>


    <div>
    <button onClick={getBoard} className="button">Submit</button>
   {/* <button onClick={sendBoard}> Send </button>*/}

    <button onClick={getHint} className="button">Hint</button>
    
    <Timer time={time} start={() => toggleTimer(true)} stop={() => toggleTimer(false)}/>
    </div>
    <h1>{time.sec}</h1>

    
    </GameContext.Provider>
}
    </div>
  )
}
