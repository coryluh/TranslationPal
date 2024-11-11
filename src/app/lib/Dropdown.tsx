import { useState } from 'react';

function Dropdown({ options, onSelect }) {
    const [selectedOption, setSelectedOption] = useState(options[0] || '1+');
  
    const handleChange = (event) => {
      const newValue = event.target.value;
      setSelectedOption(newValue);
      onSelect(newValue); // Notify parent component
    };
  
    return (
      <select value={selectedOption} onChange={handleChange}>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  export default Dropdown;