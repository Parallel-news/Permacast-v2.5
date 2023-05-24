import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";

interface debouncedInputProps {
  input: string | number;
  className: string;
  timeout?: number;
  disabled: boolean;
  placeholder: string;
  setInput: Dispatch<SetStateAction<any>>;
  callback: (arg: any) => void;
};

const DebouncedInput: FC<debouncedInputProps> = ({ 
  input,
  className,
  timeout,
  disabled,
  placeholder,
  setInput,
  callback
}) => {
  const [debouncedInput, setDebouncedInput] = useState('');

  // Update the idebounced input state after the user has stopped typing for 1.5 seconds
  useEffect(() => {

    const handler = setTimeout(() => {
      setDebouncedInput('' + input);
    }, timeout);

    // Cleanup function to cancel the timeout if the user starts typing again
    return () => {
      clearTimeout(handler);
    };
  }, [input]); // Only re-run the effect if the input state changes

  // Perform the expensive calculation whenever the debounced input changes
  useEffect(() => {
    if (debouncedInput) {
      callback(debouncedInput);
    }
  }, [debouncedInput]);

  return (
    <input 
      type="text"
      value={input}
      className={className}
      disabled={disabled}
      placeholder={placeholder}
      onChange={(e) => setInput(e.target.value)}
    />
  );
};

export default DebouncedInput;