import React, { useContext, useEffect } from 'react'
import Letter from './Letter'
import './Word.css'
import { GameContext } from './GameContext'


export default function Word({word, wordIndex, wIndex}) {

  let count = 0
  const puncuation = [",", ".", ":", ""]
  let c  = useContext(GameContext);

  


  return (
    
    <div className='word'>
      
     {word.split("").map((letter, index)=>{
           
           count+=1
           if (puncuation.includes(letter)) {
             count -=1
            return <div>{letter} </div>
           } else {
             return <Letter lIndex={wIndex} fieldValue={" "} keyLetter={letter}/> 
           }

/*
            return puncuation.includes(letter)? (<div>{letter} </div>, count-=1): <Letter lIndex={count} fieldValue={" "} keyLetter={letter}/> 
           */
        })

     }
     
     
     
     



        {/*<Letter fieldValue={13} keyLetter={"X"}/>*/}
    </div>
  )
}
