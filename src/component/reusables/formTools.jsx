
/**
 * Reusable Text Validation Box to Appear Under Respective Input
 * @param {valMsg, className} props 
 * @returns Text highlighted validation concern
 */
export const ValMsg = props => {
    const { valMsg, className } = props;
    return  (
      <p className={`text-red-300 flex ${className}`}>{valMsg}</p>
    );
}

/**
 * Verifies whether email meets certain patterns
 * @param {string} email 
 * @returns boolean value of whether email matches pattern of '@' and '.' presence
 */
export const isValidEmail = email => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

