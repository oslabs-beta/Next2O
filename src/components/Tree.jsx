import React from 'react'
import Errors from './Errors'
import * as d3 from 'd3'

const Tree = (props) => {
  console.log('props from tree', props)

  // const handleZoom = (e) => { d3.select('chart').attr('transform, e.transform') }
  // const zoom = d3.zoom().on('zoom', handleZoom) 
  // d3.select('chart').call(zoom)

  return (
    <div id='tree-div'>
      <svg id='tree-svg' class='chart'></svg>
      <div id='tree-error-div'>
        {props.errors ? <p>Errors: {props.errors.length}</p> : ''}
        {props.errors && props.errors.length > 0 ? props.errors.map((el, i) => <Errors key={i + 1} number={i} type={el.type} height={el.id.height} width={el.id.width} msg={el.msg} />) : ''}
      </div>
    </div>
  )
}

export default Tree