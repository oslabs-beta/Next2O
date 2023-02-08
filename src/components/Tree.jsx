import React from 'react'
import Errors from './Errors'
import * as d3 from 'd3'

const Tree = (props) => {
  console.log('props from tree', props)
  
  const zoomOut = () => {
    const gNodes = document.getElementById('node-g')
    const gLink = document.getElementById('link-g')
    const gnodeTransform = gNodes.attributes.transform.nodeValue.split(' ')
    let newScale;
    for (let word of gnodeTransform) {
      if (word.includes('scale')) {
        const uh = word.slice(5, word.length).replace('(', '').replace(')', '')
        newScale = Number(uh) - 1
      }
    }
    gNodes.setAttribute('transform', `${gnodeTransform[0]} scale(${newScale})`)
    gLink.setAttribute('transform', `${gnodeTransform[0]} scale(${newScale})`)
  }

  const zoomIn = () => {
    const gNodes = document.getElementById('node-g')
    const gLink = document.getElementById('link-g')
    const gnodeTransform = gNodes.attributes.transform.nodeValue.split(' ')
    let newScale;
    for (let word of gnodeTransform) {
      if (word.includes('scale')) {
        const uh = word.slice(5, word.length).replace('(', '').replace(')', '')
        newScale = Number(uh) + 1
      }
    }
    gNodes.setAttribute('transform', `${gnodeTransform[0]} scale(${newScale})`)
    gLink.setAttribute('transform', `${gnodeTransform[0]} scale(${newScale})`)
  }

  return (
    <div id='tree-div'>
      <div style={{height: '300px', width: '300px'}}>
      <svg style={{height: '100%', width: '100%'}} id='tree-svg' class='chart'></svg>
      </div>
      <div style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: '10px', marginBottom: '10px'}}>
        <button style={{backgroundColor: 'white', width: 'fit-content', height: 'fit-content', padding: '5px', border: '1px solid black', borderRadius: '5px'}} onClick={zoomIn}>Zoom In</button>
        <button style={{backgroundColor: 'white', width: 'fit-content', height: 'fit-content', padding: '5px', border: '1px solid black', borderRadius: '5px'}} onClick={zoomOut}>Zoom Out</button>
      </div>
      <div id='tree-error-div'>
<<<<<<< HEAD
        {props.errors ? <h3 style={{textAlign: 'center'}}><strong>Total errors: {props.errors.length}</strong></h3> : ''}
=======
        <h3 style={{padding: '3px', textAlign: 'center'}}>{props.errors ? <p>Errors: {props.errors.length}</p> : ''}</h3>
>>>>>>> main
        {props.errors && props.errors.length > 0 ? props.errors.map((el, i) => <Errors key={i + 1} number={i} type={el.type} height={el.id.height} width={el.id.width} msg={el.msg} />) : ''}
      </div>
    </div>
  )
}

export default Tree