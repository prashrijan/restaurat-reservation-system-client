import React from 'react'
export default function Alert({variant='info', children}){
  return <div className={`alert alert-${variant}`} role="alert">{children}</div>
}
