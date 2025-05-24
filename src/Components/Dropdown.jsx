import React, {use, useState} from 'react'

export default function Dropdown({ options, value, onChange, placeholder }) {
  
  return (
    <select 
      value={value} 
      onChange={onChange} 
      className="Dropdown"
    >
    <option key="?" value="?">{placeholder || "Selecciona una opción"}</option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  )
}
