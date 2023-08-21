import React from 'react'

function PRImpactCard({number, type, text}) {
  return (
    <div className='PRImpactCard'>
        <h4 className='green'>{number} {type}</h4>
        <p>{text}</p>
    </div>
  )
}

export default PRImpactCard