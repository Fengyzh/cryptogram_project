import React from 'react'

export default function letter({keyLetter, fieldValue}) {

    function handleChange() {
        console.log("At letter " + keyLetter)
    }


    function getValues(e) {
      let list = document.getElementsByClassName(`input${keyLetter}`);
      for (let i of list) {
        i.value = e.target.value
        console.log(i.dataset.keyl)
      }
     
  }

  return (
    <div>
        <input className={`inputs input${keyLetter}`} onChange={getValues} data-keyL={keyLetter} maxLength="1"/>
        <div><h1>{keyLetter}</h1></div>

    </div>
  )
}
