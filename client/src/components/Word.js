import React from 'react'
import Letter from './Letter'
import './Word.css'


export default function word({word, wordIndex, wIndex}) {



  return (
    <div className='word'>
     {word.split("").map((letter, index)=>{
            //console.log(letter)
            
            return <Letter lIndex={(wIndex)+(index+1)} fieldValue={" "} keyLetter={letter}/>

        })

     }



        {/*<Letter fieldValue={13} keyLetter={"X"}/>*/}
    </div>
  )
}
