import React from 'react'

const Errors = (props) => {
  console.log(props.height)
  console.log(props.width)
  const handleClick = () => {
    const node = document.getElementById(`${props.height}, ${props.width}`)
    const svg = document.getElementById('node-g')
    const links = document.getElementById('link-g')
    svg.scrollBy(30, 50)
    links.scrollBy(30, 50)
    console.log(svg.scrollHeight)
    console.log(node.getBoundingClientRect())
  }

  return (
    <div style={{ boxShadow: '2px 2px 2px 2px gainsboro', margin: '5px', padding: '5px' }}>
      <p><strong>Error number:</strong> {props.number + 1}</p>
      <p><strong>Node type: </strong> {props.type}</p>
      <p><strong>Location:</strong> Height: {props.height} Width: {props.width}</p>
      <p><strong>Message:</strong> {props.msg}</p>
      <button onClick={handleClick}>Center</button>
    </div>
  )
}

export default Errors