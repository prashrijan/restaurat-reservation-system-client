import React from 'react'
export default function StatusBadge({status}){
  const s = (status||'').toUpperCase()
  let cls='bg-secondary-subtle text-secondary-emphasis'
  if (s==='CONFIRMED') cls='bg-success-subtle text-success-emphasis'
  if (s==='CANCELLED') cls='bg-danger-subtle text-danger-emphasis'
  return <span className={`badge rounded-pill ${cls}`}>{s||'UNKNOWN'}</span>
}
