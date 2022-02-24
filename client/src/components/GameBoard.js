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
        console.log(data.join(""))
        
        fetch('http://localhost:4000/auth', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({id:quoteDetails.id ,"solution": data.join("").toUpperCase(), "userInput": data.join("").toUpperCase()}),
        }).then((response)=>{
            return response.text()
        }).then((data)=>{
          console.log(data)
        })
        console.log("Hint: ", hintAmount)
        console.log("id: ", quoteDetails.id)
    }

    function getHint() {
        let inputs = document.getElementsByClassName("inputs");
        let keys = []

        for (let i of inputs){
            if (!keys.includes(i.value.toUpperCase())){
                keys.push(i.value.toUpperCase())
            }
        }
        console.log("keys:", keys)

        // Data send to server format
        // {userInput:keys, quoteID:xxx}


        let temp = {"letter": "C", "index":7}
        var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(inputs[temp["index"]], 'C');

        var inputEvent = new Event('input', { bubbles: true});
        inputs[temp["index"]].dispatchEvent(inputEvent);
        //inputs[temp["index"]].value = "C"
        //inputs[temp["index"]].dispatchEvent(new Event('change', { bubbles: true }))

    
        setHintAmount(prevHintAmount => prevHintAmount + 1)
        
    }

    const [time, setTime] = useState({
        "sec":0,
        "min": 0,
        "hr": 0
    })
    
    let interval = useRef()
    
    function stopTimer() {
        console.log(interval.current)
        clearInterval(interval.current)
    }
    
    
    
    function startTimer() {
        clearInterval(interval.current)
    
        interval.current = setInterval(()=>{
            let temp = time
            temp.sec += 1
            setTime({...time,"sec": time.sec})
        
            if (time.sec === 60) {
                temp.min += 1
                temp.sec = 0
                setTime({...time,"sec":time.sec, "min":time.min})
            }
            if (time.min === 60) {
                temp.hr += 1
                temp.min = 0
                temp.sec = 0
                setTime({...time,"sec":time.sec, "min":time.min, "hr":time.hr})
            }
        
        
            console.log(time, interval)
        }, 1000)
        
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
    <GameContext.Provider value={c}>
     <div className='board'>
   
        {/*console.log("state", state)*/}
        {/*console.log("value", value)*/}
    {words.map((wordss, index)=>{
        //console.log(wordss)
         return <Word wIndex={index} word={wordss} wordIndex= {words.values[index]}/>
    })}

    
    </div>


    <div>
    <button onClick={getBoard} className="button">Submit</button>
   {/* <button onClick={sendBoard}> Send </button>*/}

    <button onClick={getHint} className="button">Hint</button>
    
    <Timer time={time} setTime={setTime} start={startTimer} stop={stopTimer}/>
    </div>
    <h1>{time.sec}</h1>
    </GameContext.Provider>
    
    </div>
  )
}
