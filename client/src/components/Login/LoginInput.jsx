
import { useState } from "react";
const LoginInput = (props) => {
    const [focused, setFocused] = useState(false);
    const { label, errorMessage, onChange, id, ...inputProps } = props;
  
    const handleFocus = (e) => {
      setFocused(true);
    };
  
    return (
        <div className="formInput">
          <label>{label}</label>
          <input
            {...inputProps}
            onChange={onChange}
            onBlur={handleFocus}
            focused={focused.toString()}
          />
        
        </div>
      );
}

export default LoginInput