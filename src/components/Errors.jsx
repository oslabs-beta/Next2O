import React from 'react'

const Errors = (props) => {
  
  console.log(props)

  const handleClick = () => {
    const node = document.getElementById(`${props.height}, ${props.width}`)
    const gNodes = document.getElementById('node-g')
    const gLinks = document.getElementById('link-g')
    
    const coordinates = node.attributes.transform.nodeValue;
    const nums = coordinates.replace('translate', '').split(',')
    
    const x = Number(nums[0].replace('(', ''))
    const y = Number(nums[1].replace(')', ''))
    const gCoordinates = gNodes.attributes.transform.nodeValue.split(' ')
    const scale = Number(gCoordinates[1].replace('scale(', '').replace(')', ''))
    
    const newX = (x * scale) * -1
    const newY = (y * scale) * -1

    gNodes.setAttribute('transform', `translate(${0 + newX},${0 + newY}) ${gCoordinates[1]}`)
    gLinks.setAttribute('transform', `translate(${0 + newX},${0 + newY}) ${gCoordinates[1]}`)
  }
  let bgColor = props.bg
  return (
    <div style={{backgroundColor: bgColor, opacity: 0.9}} id='error-div-inner'>
      <p><strong>Error number:</strong> {props.number + 1}</p>
      <p><strong>Node type: </strong> {props.type}</p>
      <p><strong>Location:</strong> Height: {props.height} Width: {props.width}</p>
      <p><strong>Message:</strong> {props.msg}</p>
      <button style={{backgroundColor: 'white', width: 'fit-content', height: 'fit-content', padding: '5px', border: '1px solid black', borderRadius: '5px', textAlign: 'center'}} onClick={handleClick}>Center node in tree</button>
    </div>
  )
}

export default Errors