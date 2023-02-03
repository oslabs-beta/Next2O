import React from 'react'
import Errors from './Errors'


const Tree = (props) => {
  console.log('props from tree', props)

  return (
    <div id='tree-div'>
      <svg id='tree-svg' class='chart'></svg>
      <div id='tree-error-div' style={props.errors ? {backgroundColor: "#f3bdb7cc"} : {backgroundColor: "#aaf5a881"}}>
        {props.errors ? <p>Errors: {props.errors.length}</p> : <p>No Errors Found</p>}
        {props.errors && props.errors.length > 0 ? props.errors.map((el, i) => <Errors key={i + 1} number={i} height={el.id.height} width={el.id.width} msg={el.msg} />) : ''}
      </div>
    </div>
  )
}

export default Tree