import React from 'react';

const InputValidation = ({ children, isValid, message }) => (
  <React.Fragment>
    {children({ isValid: isValid ? 'valid' : '' })}
    {message && <span className="invalid">{message}</span>}
  </React.Fragment>
);

export default InputValidation;
