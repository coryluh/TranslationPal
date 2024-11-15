import { useState } from "react";


interface DropdownProps {
  options: string[]; // Correctly typed as an array of strings
  onSelect: (value: string) => void; // Function that takes a string as an argument
}

function Dropdown({ options, onSelect } : DropdownProps) {
    const [selectedOption, setSelectedOption] = useState(options[0] || '1+');
  
    const handleChange = (event:React.ChangeEvent<HTMLSelectElement>) => {
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