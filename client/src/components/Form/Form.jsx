import { useState } from "react"
import {useNavigate} from "react-router-dom"
import FormInput from "./FormInput"
const Form = () => {
    const [values, setValues] = useState({
        username: "",
        email: "",
        password:"",
        confirmPassword: ""
    })
    const navigateTo = useNavigate(); // Initialize useHistory hook
    const [message, setMessage] = useState("");
    const inputs = [
        {
          id: 1,
          name: "username",
          type: "text",
          placeholder: "Username",
          errorMessage:
            "Username should be 3-16 characters and shouldn't include any special character!",
          label: "Username",
          pattern: "^[A-Za-z0-9]{3,16}$",
          required: true,
        },
        {
          id: 2,
          name: "email",
          type: "email",
          placeholder: "Email",
          errorMessage: "It should be a valid email address!",
          label: "Email",
          required: true,
        },
        {
          id: 3,
          name: "password",
          type: "password",
          placeholder: "Password",
          errorMessage:
            "Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!",
          label: "Password",
          pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`,
          required: true,
        },
        {
          id: 4,
          name: "confirmPassword",
          type: "password",
          placeholder: "Confirm Password",
          errorMessage: "Passwords don't match!",
          label: "Confirm Password",
          pattern: values.password,
          required: true,
        },
      ];

      const handleSubmit = async (e) => {
        e.preventDefault();

        // =========================

        try {
          const response = await fetch('http://localhost:5000/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          });
    
          if (response.ok) {
            const data = await response.json();
            setMessage(data.message);
            localStorage.setItem('token', data.token);
            // Reset form or redirect user as needed
            setTimeout(() => {
              navigateTo('/login'); // Redirect to home page
            }, 1000);
          } else {
            const data = await response.json();
            setMessage(data.message);
          }
        } catch (error) {
          setMessage("Error submitting form");
          console.error('Error submitting form:', error);

        }
      };
    
      const onChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
        setMessage(""); // Clear message when input changes
      };

    return(
      <div className="app">
        <form onSubmit={handleSubmit}>
        <h1>Register</h1>
        {inputs.map((input) => (
          <FormInput
            key={input.id}
            {...input}
            value={values[input.name] || ''}
            onChange={onChange}
          />
        ))}
        <button className="sbtn" type="submit">Submit</button>
        {message && <p>{message}</p>}
      </form>
      </div>
    )
}

export default Form 