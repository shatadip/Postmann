// VariablesComponent.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Trash, Clipboard } from 'react-bootstrap-icons';
import './VariablesComponent.css';

interface Variable {
  name: string;
  value: string;
}

const VariablesComponent: React.FC = () => {
  const [variables, setVariables] = useState<Variable[]>([]);
  // [FOR TEST PURPOSES]
  // const [displayMsgText, setDisplayMsgText] = useState<string>('');
  const nameRefs = useRef<HTMLDivElement[]>([]);
  const valueRefs = useRef<HTMLDivElement[]>([]); // Ref for value fields

  useEffect(() => {
    const storedVariables = localStorage.getItem('postmannVars');
    if (storedVariables) {
      setVariables(JSON.parse(storedVariables));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('postmannVars', JSON.stringify(variables));
  }, [variables]);

  useEffect(() => {
    nameRefs.current = nameRefs.current.slice(0, variables.length);
    valueRefs.current = valueRefs.current.slice(0, variables.length); // Update valueRefs as well
  }, [variables]);

  useEffect(() => {
    // Synchronize contentEditable divs with the state
    variables.forEach((variable, index) => {
      if (nameRefs.current[index]) {
        nameRefs.current[index].textContent = variable.name;
      }
      if (valueRefs.current[index]) {
        valueRefs.current[index].textContent = variable.value;
      }
    });
  }, [variables]);

  const addVariable = () => {
    const newVariables = [...variables, { name: '', value: '' }];
    setVariables(newVariables);
    // Focus on the last added variable's name field
    const lastIndex = newVariables.length - 1;
    setTimeout(() => {
      nameRefs.current[lastIndex]?.focus();
    }, 0);
  };

  const deleteVariable = (index: number) => {
    setVariables(variables.filter((_, i) => i !== index));
  };
  const copyVarVal = (index: number) => {
    // Ensure the valueRefs are up to date with the current variables
    valueRefs.current = valueRefs.current.slice(0, variables.length);
  
    // Check if the valueRefs array has an element at the given index
    if (valueRefs.current[index]) {
      // Get the text content of the value field
      const valueToCopy = valueRefs.current[index].textContent || '';
  
      // Use the Clipboard API to copy the value
      navigator.clipboard.writeText(valueToCopy).then(() => {
        console.log('Variable value copied to clipboard');
      }).catch(err => {
        console.error('Failed to copy variable value: ', err);
      });
    }
  };
   

  const handleInputChange = (index: number, key: keyof Variable, value: string) => {
    let updatedVariables = [...variables];
    updatedVariables[index][key] = value;
    setVariables(updatedVariables);
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
        } else if (index < variables.length - 1) { // If currently focused on a value field and not the last variable
          // Focus on the next variable's name field
          nameRefs.current[index + 1]?.focus();
        }
      }
    }
    // Remove whitespace and special characters when Enter or Shift+Enter is pressed
    if ((e.key == 'Enter' || (e.shiftKey && e.key == 'Enter') || e.key == 'Tab') && key == 'name') {
      e.preventDefault(); // Prevent default behavior
      let sanitizedName = (e.currentTarget.textContent || '').trim(); // Trim the variable name
      sanitizedName = sanitizedName.replace(/[^\w-]/g, ''); // Remove whitespace and special characters

      handleInputChange(index, key, sanitizedName);
      // Update the display message [FOR TEST PURPOSES]
      // setDisplayMsgText(`Sanitized Name (${Math.random()}): ${sanitizedName}`);

      // Ensure the focus is set after the state has been updated
      setTimeout(() => {
        valueRefs.current[index]?.focus();
      }, 0);
    }
  };

  return (
    <>
      {/*     
    FOR TEST PURPOSES
      <div className="debugVars" style={{ color: 'yellow', fontSize: '1.35rem' }}>
        {displayMsgText}
      </div> 
  */}
      <div className='vars-label'>Variables are auto-saved, use &#x7B;&#x7B;var_name&#x7D;&#x7D; in URL input or body</div>
      <div className='vars-label'>You currently have {variables.length} variables{variables.length == 0 ? ', create one by clicking on [Add Variable] button' : ''}</div>
      <div className="table-container">
        <div className="table-row header">
          <div className="table-cell var-name">Variable Name</div>
          <div className="table-cell">Value</div>
          <div className="table-cell">Options</div>
        </div>
        {variables.map((variable, index) => (
          <div className="table-row" key={index}>
            <div
              ref={(element) => (nameRefs.current[index] = element as HTMLDivElement)}
              className="table-cell var-name"
              contentEditable
              onBlur={(e) => handleInputChange(index, 'name', e.currentTarget.textContent || '')}
              onKeyDown={(e) => handleKeyPress(index, 'name', e)}
            >
              {variable.name}
            </div>
            <div
              ref={(element) => (valueRefs.current[index] = element as HTMLDivElement)} // Ref for value field
              className="table-cell"
              style={{ whiteSpace: 'pre-wrap' }}
              contentEditable
              onBlur={(e) => handleInputChange(index, 'value', e.currentTarget.textContent || '')}
              onKeyDown={(e) => handleKeyPress(index, 'value', e)}
            >
              {variable.value}
            </div>
            <div className="table-cell buttons-div">
              <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center', justifyContent: 'center' }}>
              <Clipboard className='icon-copy-variable-value' data-tooltip='Copy Value' onClick={() => copyVarVal(index)} />
              <Trash className='icon-delete-variable' data-tooltip='Delete Variable' onClick={() => deleteVariable(index)} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={addVariable}>Add Variable</button>
    </>
  );
};

export default VariablesComponent;

