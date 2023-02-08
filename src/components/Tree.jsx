import React from 'react'
import Errors from './Errors'
import * as d3 from 'd3'

const Tree = (props) => {
  console.log('props from tree', props)

  return (
    <div id='tree-div'>
      <svg id='tree-svg' class='chart'></svg>
      <div id='tree-error-div'>
        <h3 style={{padding: '3px', textAlign: 'center'}}>{props.errors ? <p>Errors: {props.errors.length}</p> : ''}</h3>
        {props.errors && props.errors.length > 0 ? props.errors.map((el, i) => <Errors key={i + 1} number={i} type={el.type} height={el.id.height} width={el.id.width} msg={el.msg} />) : ''}
      </div>
    </div>
  )
}

export default Tree