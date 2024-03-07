import React, { useState, useEffect, useRef } from 'react';
import './VariablesComponent.css';

interface Variable {
  name: string;
  value: string;
}

const VariablesComponent: React.FC = () => {
  const [variables, setVariables] = useState<Variable[]>([]);
  const cellRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const storedVariables = localStorage.getItem('variables');
    if (storedVariables) {
      setVariables(JSON.parse(storedVariables));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('variables', JSON.stringify(variables));
  }, [variables]);

  useEffect(() => {
    cellRefs.current = cellRefs.current.slice(0, variables.length);
  }, [variables]);

  const addVariable = () => {
    setVariables([...variables, { name: '', value: '' }]);
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
      const nextIndex = key === 'name' ? index : index + 1;
      if (nextIndex < variables.length) {
        cellRefs.current[nextIndex]?.focus();
      }
    }
  };

  return (
    <>
      <div>VariablesComponent</div>
      <div className="table-container">
        <div className="table-row header">
          <div className="table-cell">Variable Name</div>
          <div className="table-cell">Value</div>
          <div className="table-cell">Delete</div>
        </div>
        {variables.map((variable, index) => (
          <div className="table-row" key={index}>
            <div
              ref={(element) => (cellRefs.current[index] = element as HTMLDivElement)}
              className="table-cell"
              contentEditable
              onBlur={(e) => handleInputChange(index, 'name', e.currentTarget.textContent || '')}
              onKeyDown={(e) => handleKeyPress(index, 'name', e)}
            >
              {variable.name}
            </div>
            <div
              className="table-cell"
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
