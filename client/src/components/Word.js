import React from 'react'
import Letter from './Letter'
import './Word.css'


export default function word({word, wordIndex}) {



  return (
    <div className='word'>
     {word.split("").map((letter, index)=>{
            //console.log(letter)
            return <Letter fieldValue={wordIndex[index]} keyLetter={letter}/>

        })

     }



        {/*<Letter fieldValue={13} keyLetter={"X"}/>*/}
    </div>
  )
}
