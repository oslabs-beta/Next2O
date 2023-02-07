import React from 'react'
import Errors from './Errors'
import * as d3 from 'd3'

const Tree = (props) => {
  console.log('props from tree', props)

  return (
    <div id='tree-div'>
      <div style={{height: '300px', width: '300px'}}>
      <svg style={{height: '100%', width: '100%'}} id='tree-svg' class='chart'></svg>
      </div>
      <div id='tree-error-div'>
        {props.errors ? <p>Errors: {props.errors.length}</p> : ''}
        {props.errors && props.errors.length > 0 ? props.errors.map((el, i) => <Errors key={i + 1} number={i} type={el.type} height={el.id.height} width={el.id.width} msg={el.msg} />) : ''}
      </div>
    </div>
  )
}

export default Tree