//HeadersMRHComponent.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Trash, Clipboard } from 'react-bootstrap-icons';
import './HeadersMRHComponent.css';

interface header {
  name: string;
  value: string;
}

const HeadersMRHComponent: React.FC = () => {
  const [headersMRH, setHeadersMRH] = useState<header[]>([]);
  const [restoreButtonText, setRestoreButtonText] = useState<string>('Restore Defaults');
  const [restoreButtonBGColor, setRestoreButtonBGColor] = useState<string>('#F9F9F9');
  const [btnTextColor, setBtnTextColor] = useState<string>('buttontext');
  const [isRestoring, setIsRestoring] = useState(false);
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
    // Focus on the last added header's name field
    const lastIndex = newHeadersMRH.length - 1;
    setTimeout(() => {
      nameRefs.current[lastIndex]?.focus();
    }, 0);
  };

  const restoreDefaultHeaders = () => {
    setIsRestoring(true);
    setRestoreButtonText('Restoring...');
    setRestoreButtonBGColor('#0b5f03'); // Change to green
    setBtnTextColor('#b2ff00');
    setTimeout(() => {
      setBtnTextColor('#ffffff');
      setRestoreButtonText('Restored Successfully');
    }, 1000);
    setTimeout(() => {
      setHeadersMRH(defaultHeaders);
      setRestoreButtonText('Restore Defaults');
      setRestoreButtonBGColor('#F9F9F9'); // Change back to the original color
      setBtnTextColor('buttontext');
      setIsRestoring(false);
    }, 1750);
  };

  const deleteHeader = (index: number) => {
    setHeadersMRH(headersMRH.filter((_, i) => i !== index));
  };

  const copyHeaderVal = (index: number) => {
    // Ensure the valueRefs are up to date with the current variables
    valueRefs.current = valueRefs.current.slice(0, headersMRH.length);
  
    // Check if the valueRefs array has an element at the given index
    if (valueRefs.current[index]) {
      // Get the text content of the value field
      const valueToCopy = valueRefs.current[index].textContent || '';
  
      // Use the Clipboard API to copy the value
      navigator.clipboard.writeText(valueToCopy).then(() => {
        console.log('Header value copied to clipboard');
      }).catch(err => {
        console.error('Failed to copy header value: ', err);
      });
    }
  };
   


  const handleInputChange = (index: number, key: keyof header, value: string) => {
    const updatedHeadersMRH = [...headersMRH];
    updatedHeadersMRH[index][key] = value;
    setHeadersMRH(updatedHeadersMRH);
  };

  const handleKeyPress = (
    index: number,
    key: keyof header,
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
      <div className='mrh-label'>Headers are auto-saved, add/change them as needed.</div>
      <div className='mrh-label'>Don't worry if you screw up, you can always restore the default headers.</div>
      <div className='mrh-label'>You currently have <span className='squared-number'>{headersMRH.length}</span> headers{headersMRH.length == 0 ? ', add one by clicking on \'Add Header\' button' : ''}</div>
      <div className="table-container">
        <div className="table-row header">
          <div className="table-cell var-name">Header</div>
          <div className="table-cell">Value</div>
          <div className="table-cell">Options</div>
        </div>
        {headersMRH.map((header, index) => (
          <div className="table-row" key={index}>
            <div
              ref={(element) => (nameRefs.current[index] = element as HTMLDivElement)}
              className="table-cell var-name"
              contentEditable
              onBlur={(e) => handleInputChange(index, 'name', e.currentTarget.textContent || '')}
              onKeyDown={(e) => handleKeyPress(index, 'name', e)}
            >
              {header.name}
            </div>
            <div
              ref={(element) => (valueRefs.current[index] = element as HTMLDivElement)} // Ref for value field
              className="table-cell"
              contentEditable
              onBlur={(e) => handleInputChange(index, 'value', e.currentTarget.textContent || '')}
              onKeyDown={(e) => handleKeyPress(index, 'value', e)}
            >
              {header.value}
            </div>
            <div className="table-cell buttons-div">
              <div style={{ display: 'flex', gap: '0.45rem', border: 'none', alignItems: 'center', justifyContent: 'center' }}>
              <Clipboard className='icon-copy-header-value' data-tooltip='Copy Value' onClick={() => copyHeaderVal(index)} />
              <Trash className='icon-delete-header' data-tooltip='Delete Header' onClick={() => deleteHeader(index)} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='btnContainerMRH'>
        <button onClick={addHeader}>Add Header</button>
        <button
        onClick={restoreDefaultHeaders}
        style={{backgroundColor:`${restoreButtonBGColor}`, color:`${btnTextColor}`}}
        disabled={isRestoring}
        >
          {restoreButtonText}
        </button>
      </div>
    </>
  );
};

export default HeadersMRHComponent;
