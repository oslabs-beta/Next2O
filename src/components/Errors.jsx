import React from 'react'

const Errors = (props) => {
  
  return (
    <div id='error-div-inner'>
      <p><strong>Error number:</strong> {props.number + 1}</p>
      <p><strong>Node type: </strong> {props.type}</p>
      <p><strong>Location:</strong> Height: {props.height} Width: {props.width}</p>
      <p><strong>Message:</strong> {props.msg}</p>
    </div>
  )
}

export default Errors