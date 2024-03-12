import React, { useState, useEffect, useRef } from 'react';
import './VariablesComponent.css';

interface Variable {
  name: string;
  value: string;
}

const VariablesComponent: React.FC = () => {
  const [variables, setVariables] = useState<Variable[]>([]);
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

  const handleInputChange = (index: number, key: keyof Variable, value: string) => {
    const updatedVariables = [...variables];
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
  };

  return (
    <>
      <div className='vars-label'>Variables are auto-saved, use &#x7B;&#x7B;var_name&#x7D;&#x7D; in URL input or body</div>
      <div className='vars-label'>You currently have {variables.length} variables{variables.length==0 ? ', create one by clicking on [Add Variable] button':''}</div>
      <div className="table-container">
        <div className="table-row header">
          <div className="table-cell var-name">Variable Name</div>
          <div className="table-cell">Value</div>
          <div className="table-cell">Delete</div>
        </div>
        {variables.map((variable, index) => (
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
            <div className="table-cell delete-button" onClick={() => deleteVariable(index)}>
              Delete
            </div>
          </div>
        ))}
      </div>
      <button onClick={addVariable}>Add Variable</button>
    </>
  );
};

export default VariablesComponent;
