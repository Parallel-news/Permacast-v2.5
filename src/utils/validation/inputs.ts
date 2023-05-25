export const convertToValidNumber = (input: string, defaultReturn=0) => {
  const num = Number(input); // Convert the input to a number

  // Check if the number is positive, is a finite number, is an integer, and is not NaN.
  if (num > 0 && Number.isFinite(num) && Number.isInteger(num) && !Number.isNaN(num)) {
    return num;
  } else {
    return defaultReturn;
  };
};