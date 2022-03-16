import React, { useState, useContext } from 'react';
import { GameContext } from './GameContext';

export default function Letter({timer, setTimer, keyLetter, fieldValue, lIndex}) {

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





    function shift(e) {
      let next;
      // Handles going to the next input in the same word AND going to the first input of the next word (Doesn't skip letter)
      if (e.target !== undefined) {



        next  = e.target.parentElement.nextSibling // Next Letter div
        

      } else {
        next = e.parentElement.nextSibling
      }
      
      if (e.value !== undefined && e.value.length === 0 && e.tagName === "INPUT") {
        e.focus()
        return
      }
      

      if (next === null) { // If next letter is null that means this is the end of the word

        if (e.target == undefined){
            next = e.parentElement.parentElement.nextSibling.firstChild
        } else {


        next = e.target.parentElement.parentElement.nextSibling.firstChild // Correct next letter to -> The first div of the next word's first letter
        }



        if (next.firstChild.value !== undefined && next.firstChild.value != 0) {
          shift(next.firstChild)
          return
          
        }
      }


      // Skips letter
      // If the first input of the next letter is not undefined and the length of that value is not 0 (already have an input)
      else if (next.firstChild.value !== undefined && next.firstChild.value.length !== 0) {

          next = next.firstChild

         while (next !== null && (next.value !== undefined && next.value.length !== 0) || next.tagName !== "INPUT") {



           //End of word
           if (next.parentElement.nextSibling === null) {
              if (next.parentElement.parentElement.nextSibling == null) {
                return
              }

              next = next.parentElement.parentElement.nextSibling.firstChild.firstChild


           } else {

            next = next.parentElement.nextSibling.firstChild
           }


         } 
        


        // Check if its the end of the word


       
          // Move the next pointer to the next Letter div

        
      } else if (next.firstChild.value === undefined && next.parentElement.nextSibling != null) {
        if (next.firstChild != null && next.nextSibling != null && next.nextSibling.firstChild != null) {
          next = next.nextSibling.firstChild
        } else {
          
          shift(next.parentElement.nextSibling.firstChild.firstChild)
        }
      }

      
      if (next.firstChild !== null && next.firstChild.tagName === "INPUT") {
        next.firstChild.focus()
      } else if (next.tagName === "INPUT") {
        next.focus()
      }


    }




    function getValues(e) {
      let list = document.getElementsByClassName(`input${e.target.dataset.keyl}`);
      let allInputs = document.getElementsByClassName(`inputs`);
      //setAllInputs(allInputs);
      let dict = {}
      let stack = []

      if (!timer) {
        setTimer(true)
      }

      
      //console.log("indexxxx: ", e.target.dataset.inputindex) // DEBUG



      if (!(e.target.value.length === 1 && e.target.value.match(/[a-z]/i))) {
        e.target.value = ""
   
      }

      // Populate all the fields with the same key with the value the user inputted
      for (let i of list) {
        i.value = e.target.value.toUpperCase()
        console.log(i.dataset.keyl)
        
      }

      // Populates the dictionary that keeps track of all the keys and their user input values
      for (let j of allInputs) {
          if (dict[j.dataset.keyl] != j.value.toUpperCase()){
            dict[j.dataset.keyl] = j.value.toUpperCase()
        }
      }
      

        var keys = Object.keys(dict);
        console.log(keys)

        for(var i = 0; i<keys.length; i++){ // Go through every key in the arry
     
          for(var j = i+1; j<keys.length; j++){ // j = i + 1 and not j = 0 because you don't want to check 2 keys' value bc they will always be the same. This still checks for dups because even if i is at the second to last digit, if there is a dup, it wouldve be added to the list already in one of the early iterations
            if(dict[keys[i]].toUpperCase() === dict[keys[j]].toUpperCase() && dict[keys[i]] != ""){
              stack.push(dict[keys[i]].toUpperCase())
   
            }
           
        }
       
      }
      console.log("stack: ", stack)
      //setStk(stack)




      //--------------------------------------

      for (let k of allInputs) {
        k.style.color = "black"

          if (stack.includes(k.value)) {
            k.style.color = "red"
          }

      }

     
    
 

        



        // Move to the next input field in this word
        
      if (e.target.parentElement.nextSibling != null && e.target.value.length == 1 && e.target.value != "") {
    
       
        shift(e)
      } 

      // Move to the next input field in the next word
   

      if (e.target.parentElement.nextSibling == null && e.target.parentElement.parentElement.firstChild != null && e.target.value != "") {
        
        
        shift(e)
      }


      
     
  }




  return (
    <div className='input-div'>
        <input className={`inputs input${keyLetter}`} data-inputIndex= {index} data-index={lIndex} onFocus={selectColor} onChange={getValues}  data-keyL={keyLetter} maxLength="1"/>
        <div><h1 className='keys'>{keyLetter}</h1></div>

    </div>
  )
}
