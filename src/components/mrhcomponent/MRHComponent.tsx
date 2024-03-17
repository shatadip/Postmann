import React, { useState, useEffect, useRef } from 'react';
import './MRHComponent.css';

interface Variable {
 name: string;
 value: string;
}

const headersMRHComponent: React.FC = () => {
 const [headersMRH, setheadersMRH] = useState<Variable[]>([]);
 const nameRefs = useRef<HTMLDivElement[]>([]);
 const valueRefs = useRef<HTMLDivElement[]>([]); // Ref for value fields

 useEffect(() => {
    const storedheadersMRH = localStorage.getItem('postmannHeadersMRH');
    if (storedheadersMRH) {
      setheadersMRH(JSON.parse(storedheadersMRH));
    }
 }, []);

 useEffect(() => {
    localStorage.setItem('postmannHeadersMRH', JSON.stringify(headersMRH));
 }, [headersMRH]);

 useEffect(() => {
    nameRefs.current = nameRefs.current.slice(0, headersMRH.length);
    valueRefs.current = valueRefs.current.slice(0, headersMRH.length); // Update valueRefs as well
 }, [headersMRH]);

 const addHeader = () => {
    const newheadersMRH = [...headersMRH, { name: '', value: '' }];
    setheadersMRH(newheadersMRH);
    // Focus on the last added variable's name field
    const lastIndex = newheadersMRH.length - 1;
    setTimeout(() => {
      nameRefs.current[lastIndex]?.focus();
    }, 0);
 };

 const restoreDefaultHeaders = () => {
    const defaultHeaders = [
      { name: 'Content-Type', value: 'application/json' },
      { name: 'Cache-Control', value: 'no-cache' },
      { name: 'Accept', value: '*/*' },
      { name: 'Accept-Encoding', value: 'gzip, deflate, br' },
      { name: 'Connection', value: 'keep-alive' },
    ];
    setheadersMRH(defaultHeaders);
 };

 const deleteHeader = (index: number) => {
    setheadersMRH(headersMRH.filter((_, i) => i !== index));
 };

 const handleInputChange = (index: number, key: keyof Variable, value: string) => {
    const updatedheadersMRH = [...headersMRH];
    updatedheadersMRH[index][key] = value;
    setheadersMRH(updatedheadersMRH);
 };

 const handleKeyPress = (index: number, key: keyof Variable, e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) { // If Shift+Tab is pressed
        if (key === 'value') { // If currently focused on a value field
          // Focus on the current variable's name field
          nameRefs.current[index]?.focus();
        } else if (index > 0) { // If currently focused on a name field and not the first variable
          // Focus on the previous variable's value field
          valueRefs.current[index - 1]?.focus();
        }
      } else {
        if (key === 'name') {
          // Focus on the current variable's value field
          valueRefs.current[index]?.focus();
        } else if (index < headersMRH.length - 1) { // If currently focused on a value field and not the last variable
          // Focus on the next variable's name field
          nameRefs.current[index + 1]?.focus();
        }
      }
    }
 };

 return (
    <>
      <div className='mrh-label'>Headers are auto-saved, if you do not want to headers</div>
      <div className='mrh-label'>You currently have {headersMRH.length} headers{headersMRH.length==0 ? ', add one by clicking on [Add Header] button':''}</div>
      <div className="table-container">
        <div className="table-row header">
          <div className="table-cell var-name">Header</div>
          <div className="table-cell">Value</div>
          <div className="table-cell">Delete</div>
        </div>
        {headersMRH.map((variable, index) => (
          <div className="table-row" key={index}>
            <div
              ref={(element) => (nameRefs.current[index] = element as HTMLDivElement)}
              className="table-cell var-name ellipsis"
              contentEditable
              onBlur={(e) => handleInputChange(index, 'name', e.currentTarget.textContent || '')}
              onKeyDown={(e) => handleKeyPress(index, 'name', e)}
            >
              {variable.name}
            </div>
            <div
              ref={(element) => (valueRefs.current[index] = element as HTMLDivElement)} // Ref for value field
              className="table-cell ellipsis"
              contentEditable
              onBlur={(e) => handleInputChange(index, 'value', e.currentTarget.textContent || '')}
              onKeyDown={(e) => handleKeyPress(index, 'value', e)}
            >
              {variable.value}
            </div>
            <div className="table-cell delete-button" onClick={() => deleteHeader(index)}>
              Delete
            </div>
          </div>
        ))}
      </div>
      <button onClick={addHeader}>Add Header</button>
      <button onClick={restoreDefaultHeaders}>Restore Defaults</button>
    </>
 );
};

export default headersMRHComponent;
