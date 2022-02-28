import React, { useState, useContext } from 'react';
import { GameContext } from './GameContext';

export default function Letter({keyLetter, fieldValue, lIndex}) {

  const { index, setIndex } = useContext(GameContext);


    let letterList = []

   function selectColor(e) {
    let list = document.getElementsByClassName(`input${e.target.dataset.keyl}`);
    let allInputs = document.getElementsByClassName(`inputs`);

    for (let i of list) {
      i.style.backgroundColor  =  "lightgrey"
    }

    for (let j of allInputs) {
      if (j.dataset.keyl !== e.target.dataset.keyl) {
        j.style.backgroundColor = "transparent"
      }
    }

   }





    function test(e) {
      let next;
      // Handles going to the next input in the same word AND going to the first input of the next word (Doesn't skip letter)
      if (e.target !== undefined) {
        next  = e.target.parentElement.nextSibling // Next Letter div
      } else {
        next = e.parentElement.nextSibling
      }
      console.log(111,next)
      console.log(111, next===null? null : next.firstChild)


      if (next === null) { // If next letter is null that means this is the end of the word
        console.log(333)
        console.log("next:", next)
        next = e.target.parentElement.parentElement.nextSibling.firstChild // Correct next letter to -> The first div of the next word's first letter
        console.log("after:",next)

        if (next.firstChild.value !== undefined && next.firstChild.value != 0) {
          console.log("rec")
          test(next.firstChild)
          return
          
        }
      }


      // Skips letter
      // If the first input of the next letter is not undefined and the length of that value is not 0 (already have an input)
      else if (next.firstChild.value !== undefined && next.firstChild.value.length !== 0) {
        console.log(777)
        /*
          Known: It can jump 1 letter within the same word with "next = next.nextSibling"
          Next: Is currently at "the next input field of the current input"
          TODO: Skip multiple letters in the same word (Finished)
        */
          console.log("next:", next)
          next = next.firstChild

         while (next !== null && (next.value !== undefined && next.value.length !== 0) || next.tagName !== "INPUT") {
           console.log(666)


           //End of word
           if (next.parentElement.nextSibling === null) {
              if (next.parentElement.parentElement.nextSibling == null) {
                return
              }

              next = next.parentElement.parentElement.nextSibling.firstChild.firstChild
              console.log("next1:", next)

           } else {

            next = next.parentElement.nextSibling.firstChild
           }
            console.log("next2:", next)

         } 
        


        // Check if its the end of the word


       
          // Move the next pointer to the next Letter div
        console.log(next)
      } else if (next.firstChild.value === undefined && next.parentElement.nextSibling != null) {
        console.log(767)
        test(next.parentElement.nextSibling.firstChild.firstChild)

      }

      if (next.firstChild !== null && next.firstChild.tagName === "INPUT") {
        next.firstChild.focus()
      } else if (next.tagName === "INPUT") {
        next.focus()
      }



      /*
      // If the first input of the next letter is not undefined and the length of that value is not 0 (already have an input)
      else if (next.firstChild.value != undefined && next.firstChild.value.length != 0) {
        console.log(11)
        next = next.nextSibling  // Move the next pointer to the next Letter div
        if (next == null) {   // If next letter is null that means this is the end of the word
          console.log(22)
          next = e.target.parentElement.parentElement.nextSibling   //Move the pointer to the next
          //temp = e.target.parentElement.parentElement.nextSibling.firstChild.firstChild.value.length
          console.log("target:", e.target.parentElement.parentElement.nextSibling.firstChild)
          console.log(99)
          console.log("while: ", next.firstChild.firstChild)

          let temp = next.firstChild
          while (temp.firstChild.value.length != 0) {
            
            next = next.firstChild.firstChild.nextSibling
            temp = temp.firstChild.parentElement.nextSibling
            console.log("temp: ", temp)
          }

          //next = e.target.parentElement.parentElement.nextSibling.firstChild
         console.log("temmm: ", next)
            next = temp
          

        }
      } 
      //console.log("next: ", next.firstChild)

      if (next.firstChild != null && next.firstChild.tagName == "INPUT") {
        next.firstChild.focus()
      }

      */
    }




    function getValues(e) {
      let list = document.getElementsByClassName(`input${e.target.dataset.keyl}`);
      let allInputs = document.getElementsByClassName(`inputs`);
      let dict = {}
      let stack = []
      
      console.log("indexxxx: ", e.target.dataset.inputindex)


      for (let i of list) {
        i.value = e.target.value.toUpperCase()
        console.log(i.dataset.keyl)
        
      }

      for (let j of allInputs) {
          if (dict[j.dataset.keyl] != j.value.toUpperCase()){
            dict[j.dataset.keyl] = j.value.toUpperCase()
        }
      }

      /* Current: If there is a value that is dup, it will make
         every input you click color red
      */

      
        var keys = Object.keys(dict);
        console.log(keys)

        for(var i = 0; i<keys.length; i++){ // Go through every key in the arry
          //var dupe = false;
          for(var j = i+1; j<keys.length; j++){ // j = i + 1 and not j = 0 because you don't want to check 2 keys' value bc they will always be the same. This still checks for dups because even if i is at the second to last digit, if there is a dup, it wouldve be added to the list already in one of the early iterations
            if(dict[keys[i]].toUpperCase() === dict[keys[j]].toUpperCase() && dict[keys[i]] != ""){
              stack.push(dict[keys[i]].toUpperCase())
              //dupe = true;
            }
           
        }
       
        //if(dupe){ console.log("dupe value is there.."); } 
      }

      if (stack.includes(e.target.value.toUpperCase())) {
        for (let k of list ) {
          k.style.color = "red"
        }
      } else {
        for (let k of list ) {
          k.style.color = "black"
        }
      }

      console.log(stack)
      //console.log("dupe: " , dupe)
 

        



        // Move to the next input field in this word
        
      if (e.target.parentElement.nextSibling != null && e.target.value.length == 1) {
        //e.target.parentElement.nextSibling.firstChild.focus()
        console.log(222)
        test(e)
      } 

      // Move to the next input field in the next word
      //console.log(e.target.parentElement.parentElement.nextSibling.firstChild)

      if (e.target.parentElement.nextSibling == null && e.target.parentElement.parentElement.firstChild != null) {
        console.log(111)
        //e.target.parentElement.parentElement.nextSibling.firstChild.firstChild.focus()
        test(e)
      }

      console.log(stack)
      console.log(dict)
      
     
  }

  return (
    <div>
        <input className={`inputs input${keyLetter}`} data-inputIndex= {index} data-index={lIndex} onFocus={selectColor} onChange={getValues} data-keyL={keyLetter} maxLength="1"/>
        <div><h1>{keyLetter}</h1></div>

    </div>
  )
}
