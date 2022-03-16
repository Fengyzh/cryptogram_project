import React, { useContext, useEffect } from 'react'
import Letter from './Letter'
import './Word.css'
import { GameContext } from './GameContext'


export default function Word({timer, setTimer, word, wordIndex, wIndex}) {

  let count = 0
  const puncuation = [",", ".", ":", "\"", "\'", ";", "!", "?", "-"]
  let c  = useContext(GameContext);

  


  return (
    
    <div className='word'>
      
     {word.split("").map((letter, index)=>{
           
           count+=1
           if (puncuation.includes(letter)) {
             count -=1
            return <div className='Letters'>{letter} </div>
           } else {
             return <Letter timer = {timer} setTimer = {setTimer} lIndex={wIndex} fieldValue={" "} keyLetter={letter}/> 
           }

        })

     }
     
     
     
     



    </div>
  )
}
