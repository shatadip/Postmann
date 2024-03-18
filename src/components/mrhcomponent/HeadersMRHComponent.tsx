//HeadersMRHComponent.tsx

import React, { useState, useEffect, useRef } from 'react';
import './HeadersMRHComponent.css';

interface Variable {
  name: string;
  value: string;
}

const HeadersMRHComponent: React.FC = () => {
  const [headersMRH, setHeadersMRH] = useState<Variable[]>([]);
  const nameRefs = useRef<HTMLDivElement[]>([]);
  const valueRefs = useRef<HTMLDivElement[]>([]); // Ref for value fields

  const defaultHeaders = [
    { name: 'Content-Type', value: 'application/json' },
    { name: 'Cache-Control', value: 'no-cache' },
    { name: 'Accept', value: '*/*' },
    { name: 'Accept-Encoding', value: 'gzip, deflate, br' },
    { name: 'Connection', value: 'keep-alive' },
  ];

  useEffect(() => {
    const storedHeadersMRH = localStorage.getItem('postmannHeadersMRH');
    if (storedHeadersMRH) {
      setHeadersMRH(JSON.parse(storedHeadersMRH));
    } else {
      // Set default headers if none are found in localStorage
      setHeadersMRH(defaultHeaders);
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
    const newHeadersMRH = [...headersMRH, { name: '', value: '' }];
    setHeadersMRH(newHeadersMRH);
    // Focus on the last added variable's name field
    const lastIndex = newHeadersMRH.length - 1;
    setTimeout(() => {
      nameRefs.current[lastIndex]?.focus();
    }, 0);
  };

  const restoreDefaultHeaders = () => {
    setHeadersMRH(defaultHeaders);
  };

  const deleteHeader = (index: number) => {
    setHeadersMRH(headersMRH.filter((_, i) => i !== index));
  };

  const handleInputChange = (index: number, key: keyof Variable, value: string) => {
    const updatedHeadersMRH = [...headersMRH];
    updatedHeadersMRH[index][key] = value;
    setHeadersMRH(updatedHeadersMRH);
  };

  const handleKeyPress = (
    index: number,
    key: keyof Variable,
    e: React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        if (key === 'value') {
          nameRefs.current[index]?.focus();
        } else if (index > 0) {
          valueRefs.current[index - 1]?.focus();
        }
      } else {
        if (key === 'name') {
          valueRefs.current[index]?.focus();
        } else if (index < headersMRH.length - 1) {
          nameRefs.current[index + 1]?.focus();
        }
      }
    }
  };

  return (
    <>
      <div className='mrh-label'>Headers are auto-saved, if you do not want to headers</div>
      <div className='mrh-label'>You currently have {headersMRH.length} headers{headersMRH.length == 0 ? ', add one by clicking on [Add Header] button' : ''}</div>
      <div className="table-container">
        <div className="table-row header">
          <div className="table-cell var-name">Header</div>
          <div className="table-cell">Value</div>
          <div className="table-cell">Delete</div>
        </div>
        {headersMRH.map((header, index) => (
          <div className="table-row" key={index}>
            <div
              ref={(element) => (nameRefs.current[index] = element as HTMLDivElement)}
              className="table-cell var-name ellipsis"
              contentEditable
              onBlur={(e) => handleInputChange(index, 'name', e.currentTarget.textContent || '')}
              onKeyDown={(e) => handleKeyPress(index, 'name', e)}
            >
              {header.name}
            </div>
            <div
              ref={(element) => (valueRefs.current[index] = element as HTMLDivElement)} // Ref for value field
              className="table-cell ellipsis"
              contentEditable
              onBlur={(e) => handleInputChange(index, 'value', e.currentTarget.textContent || '')}
              onKeyDown={(e) => handleKeyPress(index, 'value', e)}
            >
              {header.value}
            </div>
            <div className="table-cell delete-button" onClick={() => deleteHeader(index)}>
              Delete
            </div>
          </div>
        ))}
      </div>
      <div className='btnContainerMRH'>
      <button onClick={addHeader}>Add Header</button>
      <button onClick={restoreDefaultHeaders}>Restore Defaults</button>
      </div>
    </>
  );
};

export default HeadersMRHComponent;
