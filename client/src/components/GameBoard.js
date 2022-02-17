import React, { useEffect, useState } from 'react';
import Word from './Word';
import './GameBoard.css';
import wwords from '../data.json'



export default function GameBoard() {

    const [state, setState] = useState({});
    const [value, setValue] = useState({});
    const [words, setWords] = useState([]);

    function getBoard() {
        let list = document.getElementsByClassName(`inputs`);
        let arr = []
        let dic = {}
        console.log(list)
        for (let i of list) {
            if (dic[i.dataset.keyl] != i.value){
                dic[i.dataset.keyl] = i.value
            }

            arr.push(i.value)
        }

        

        console.log(arr)
        console.log(dic)
        
    }



    useEffect(() => {
        setValue(words)


        fetch('http://localhost:4000/crypt').then((response)=>{
            return response.text()
        }).then((data)=>{
          
            data = data.split(" ")
            console.log(data)
            setWords(data)
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
        setState(temp)


        //Setting all same key field to have the same input
 


       
      },[]);



  return (
     <div className='board'>
        {console.log("state", state)}
        {console.log("value", value)}
    {wwords.keys.map((wordss, index)=>{
        return <Word wIndex={index} word={wordss} wordIndex= {words.values[index]}/>
    })}

    <button onClick={getBoard}>Click</button>

    </div>
  )
}
