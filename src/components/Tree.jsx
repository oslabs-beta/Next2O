import React from 'react'
import Errors from './Errors'

const Tree = (props) => {
  return (
    <div>
      <div id='tree-div'>
        <svg id='tree-svg' class='chart'></svg>
      </div>
      <div id="errorList">
        {props.errors ? <p>Errors: {props.errors.length}</p> : ''}
        {props.errors && props.errors.length > 0 ? props.errors.map((el, i) => <Errors key={i + 1} number={i} type={el.type} height={el.id.height} width={el.id.width} msg={el.msg} />) : ''}
      </div>
    </div>
  )
}

export default Tree