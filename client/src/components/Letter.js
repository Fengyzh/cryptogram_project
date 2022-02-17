import React, { useState } from 'react';

export default function Letter({keyLetter, fieldValue, lIndex}) {

  const [state, setState] = useState({});


   
    let letterList = []

    function getValues(e) {
      let list = document.getElementsByClassName(`input${keyLetter}`);
      let allInputs = document.getElementsByClassName(`inputs`);
      let dict = {}
      let stack = []
      
      for (let i of list) {
        i.value = e.target.value
        console.log(i.dataset.keyl)
        
      }

      for (let j of allInputs) {
          if (dict[j.dataset.keyl] != j.value){
            dict[j.dataset.keyl] = j.value
        }
      }

      /* Current: If there is a value that is dup, it will make
         every input you click color red
      */
      for (const [key, value] of Object.entries(dict)) {
          if (stack.includes(value) && value != "") {
            console.log(stack.includes(value) && value != "")
            for (let i of list) {
              if (i.dataset.keyl == key){
                i.style.color="red"
              } 
             
            }
          } else {
            for (let i of list) {
              if (i.dataset.keyl == key){
                i.style.color="black"
              } 
             
            }
            stack.push(value)
          }
        }
      
      console.log(stack)
      console.log(dict)
      
     
  }

  return (
    <div>
        <input className={`inputs input${keyLetter}`} data-index={lIndex} onChange={getValues} data-keyL={keyLetter} maxLength="1"/>
        <div><h1>{keyLetter}</h1></div>

    </div>
  )
}
