
import LoginInput from "./LoginInput"
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
    const [values, setValues] = useState({
        email: "",
        password: ""
    });
    const [message, setMessage] = useState("");
    const navigateTo = useNavigate(); // Initialize useHistory hook
    const inputs = [
      {
        id: 1,
        name: "email",
        type: "email",
        placeholder: "Email",
      
        label: "Email",
        required: true,
      },
     
      {
        id: 2,
        name: "password",
        type: "password",
        placeholder: "Password",
        label: "Password",
        required: true,
      },
    ];

   

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
              const data = await response.json();
                setMessage(""); // Clear previous error message
                // Store the token in local storage
                localStorage.setItem('token', data.token);
                // Redirect to home page after successful login
               
                navigateTo('/'); // Redirect to home page after successful login

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

    return (
        <div className="app">
            <form onSubmit={handleSubmit}>
                <h1>Sign In</h1>
                <div>{message && <p>{message}</p>}</div>
                {/* <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={values.email}
                    onChange={onChange}
                    required
                />
                <br />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={values.password}
                    onChange={onChange}
                    required
                /> */}
                {inputs.map((input) => (
          <LoginInput
            key={input.id}
            {...input}
            value={values[input.name]}
            onChange={onChange}
          />
        ))}
               <Link to="/forgotpassword">Forgot Password?</Link>
                <button className="sbtn" type="submit">Submit</button>
            </form>
           
        </div>
    );
};

export default Login;
