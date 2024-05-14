// VariablesComponent.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Trash, Clipboard, ExclamationTriangle } from 'react-bootstrap-icons';
import './VariablesComponent.css';

interface Variable {
  name: string;
  value: string;
}

const VariablesComponent: React.FC = () => {
  const [variables, setVariables] = useState<Variable[]>([]);
  const [warnStyle, setWarnStyle] = useState<String>('none');
  const [isShaking, setIsShaking] = useState(false);
  const [justMounted, setJustMounted] = useState(true); // New state to track if component just mounted
  const maxNumOfVars = 42;
  // [FOR TEST PURPOSES]
  // const [displayMsgText, setDisplayMsgText] = useState<string>('');
  const nameRefs = useRef<HTMLDivElement[]>([]);
  const valueRefs = useRef<HTMLDivElement[]>([]); // Ref for value fields

  useEffect(() => {
    const storedVariables = localStorage.getItem('postmannVars');
    if (storedVariables) {
      setVariables(JSON.parse(storedVariables));
    }
    // Set justMounted to false after initial render
    setJustMounted(false);
  }, []);

  useEffect(() => {
    localStorage.setItem('postmannVars', JSON.stringify(variables));
  }, [variables]);

  useEffect(() => {
    nameRefs.current = nameRefs.current.slice(0, variables.length);
    valueRefs.current = valueRefs.current.slice(0, variables.length); // Update valueRefs as well
  }, [variables]);

  useEffect(() => {
    if (!justMounted) {
      // Synchronize contentEditable divs with the state
      variables.forEach((variable, index) => {
        if (nameRefs.current[index]) {
          nameRefs.current[index].textContent = variable.name;
        }
        if (valueRefs.current[index]) {
          valueRefs.current[index].textContent = variable.value;
        }
      });
    }
  }, [variables]);

  // Delete empty variables (both name and value are empty) using useEffect (without using filter)
  useEffect(() => {
    if (!justMounted && variables.length > 0) {
      let emptyVars = 0;
      variables.forEach((variable, index) => {
        if (variable.name === '' && variable.value === '') {
          emptyVars++;
          deleteVariable(index);
        }
      });
      if (emptyVars > 0) {
        console.log(`Deleted ${emptyVars} empty variables`);
      }
    }
  }, [variables, justMounted]);


  const addVariable = () => {
    if (variables.length < maxNumOfVars) {
      setJustMounted(true);
      const newVariables = [...variables, { name: '', value: '' }];
      setVariables(newVariables);
      // Focus on the last added variable's name field
      const lastIndex = newVariables.length - 1;
      setTimeout(() => {
        nameRefs.current[lastIndex]?.focus();
      }, 0);
    } else {
      // Set a warning message or disable the "Add Variable" button
      setWarnStyle('block');
      setIsShaking(true);

      // Remove the "shaker" class after 2 seconds
      setTimeout(() => {
        setIsShaking(false);
      }, 2000);
    }
  };

  const deleteVariable = (index: number) => {
    setVariables(variables.filter((_, i) => i !== index));
    setWarnStyle('none');
  };
  const deleteAllVariables = () => {
    const isConfirmed = window.confirm('Are you sure you want to delete all variables?');

    if (isConfirmed) {
      setVariables([]);
      setWarnStyle('none');
    }
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
        if (key === 'name') { // If currently focused on a name field
          // Delay the focus change after the blur event
          setTimeout(() => {
            if (index > 0) { // If not the first variable
              // Focus on the previous variable's value field
              valueRefs.current[index - 1]?.focus();
            }
          }, 10);
        } else if (key === 'value') { // If currently focused on a value field
          // Delay the focus change after the blur event
          setTimeout(() => {
            // Focus on the current variable's name field
            nameRefs.current[index]?.focus();
          }, 10);
        }
      } else {
        if (key === 'name') {
          // Focus on the current variable's value field
          valueRefs.current[index]?.focus();
        } else if (key === 'value' && index === variables.length - 1) {
          // add a new variable if the last variable's value field is focused
          addVariable();
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

  const handleNameFieldBlur = (index: number, value: string) => {

    let sanitizedValue = value.trim().replace(/[^\w-]/g, ''); // Remove whitespace and special characters

    handleInputChange(index, 'name', sanitizedValue == '' ? '\n' : sanitizedValue); // \n seems to be a hack to prevent only special characters used as a variable name

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
      {variables.length > 0 && (
        <>
          <div className="vars-label flex-icon"><img src="click-outside-2.png" alt="Click Outside" style={{ width: '24px' }} /> Click outside to save</div>
          <div className="vars-label flex-icon" style={{ marginLeft: '6px' }}><img src="tab.png" alt="Tab" style={{ width: '17px' }} /> Hit Tab/Shift+tab to navigate</div>
        </>
      )}
      <div className='vars-label'>You currently have <span className='squared-number'>{variables.length}</span> {variables.length == 1 ? 'variable' : 'variables'}{variables.length == 0 ? ', create one by clicking on \'Add Variable\' button.' : ''}</div>
      <div className="table-container">

        {variables.length > 0 && (
          <div className="table-row header">
            <div className="table-cell var-name">Variable Name</div>
            <div className="table-cell">Value</div>
            <div className="table-cell">Options</div>
          </div>
        )}

        {variables.map((variable, index) => (
          <div className="table-row" key={index}>
            <div
              ref={(element) => (nameRefs.current[index] = element as HTMLDivElement)}
              className="table-cell var-name"
              contentEditable
              // onBlur={(e) => handleInputChange(index, 'name', e.currentTarget.textContent || '')}
              onBlur={(e) => handleNameFieldBlur(index, e.currentTarget.textContent || '')}
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
      <div className="buttonContainerVars">
        <button onClick={addVariable} id="btnAddVar" className={isShaking ? 'shake' : ''}>Add Variable</button>
        {variables.length > 0 && (
          <button onClick={deleteAllVariables} id="btnDelAllVars"><ExclamationTriangle />Delete All Variables</button>
        )}
      </div>
      <div className="vars-label max-num-warn" style={{ display: `${warnStyle}` }}>Max {maxNumOfVars} Variables, delete some old vars to add more.</div>
    </>
  );
};

export default VariablesComponent;

