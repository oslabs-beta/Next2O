import React from 'react'

const Errors = (props) => {
  return (
    <div style={{border: '1px solid black'}}>
      <p>Error number: {props.number + 1}</p>
      <p>Height: {props.height} Width: {props.width}</p>
      <p>{props.msg}</p>
    </div>
  )
}

export default Errors