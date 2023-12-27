                              //LOGIN PAGE FOLLOWS AS IT SAME AS REGISTER PAGE!
// This uses destructuring to import specific functions (useState and useEffect) from the "react" package. These are React Hooks.

// useState is a Hook that allows you to add state to functional components. It returns an array with two elements: 
//the current state value and a function that lets you update it.
// Example usage: const [count, setCount] = useState(0)

// useEffect is a Hook that allows you to perform side effects in your functional components. 
// It's commonly used for tasks like fetching data, subscriptions, or manually changing the DOM.
import React, { useState, useEffect } from "react";

// Axios is a popular JavaScript library used for making HTTP requests from the browser. 
// It supports both the browser environment (using XMLHttpRequests or the fetch API) and the Node.js environment. 
// Axios provides a simple API for sending HTTP requests and handling responses.
import axios from "axios";

//used for styling the page in react-js
import styled from "styled-components";

// It is used to import two named exports, useNavigate and Link, from the "react-router-dom" package!
// useNavigate: It returns a navigate function that allows you to programmatically navigate to different routes in your application!
// Link: Link is a component provided by React Router. It's used to create a navigation link within your application!
import { useNavigate, Link } from "react-router-dom";

//used this image as logo for the page!
import Logo from "../assets/logo.svg";

//using this library we are sending notifications!
import { ToastContainer, toast } from "react-toastify";


// This line is importing a CSS file from the "react-toastify" package. 
// CSS (Cascading Style Sheets) is used to style the components or elements of a web page.
import "react-toastify/dist/ReactToastify.css";

//importing the server register page route..from utils/APIRoutes.
import { registerRoute } from "../utils/APIRoutes";

export default function Register() {

  const navigate = useNavigate();

  //it is used to add styling to error notifications!
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  // So, essentially, this code sets up a piece of state (values) which is an object with four properties: username, email, password, and confirmPassword. 
  // Each of these properties is initially set to an empty string. Later in your code, you can use setValues to update any of these properties as needed.
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  //checking whether if a user present in the local storage wr.to this specific app, then navigate throguh chat page!
  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, []);

  //updating the values of the input...
  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  //here we are doing validation of the inputs!
  const handleValidation = () => {

    //destructing the values array.. (which will be entered by user)!
    const { password, confirmPassword, username, email } = values;

    if (password !== confirmPassword) {
      //using toasterror package sending the error notifications!
      toast.error(
        "Password and Confirm password should be same.",
        toastOptions
      );
      return false;
    } else if (username.length < 3) {
      toast.error(
        "Username should be greater than 3 characters.",
        toastOptions
      );
      return false;
    } else if (password.length < 8) {
      toast.error(
        "Password should be equal or greater than 8 characters.",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    }else if(!email.includes('@') || !email.includes('.'))
    {
        toast.error("Email must contains '@' and '.' characters in it",toastOptions);
        return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {

      //here we are destructing the user details, after he submits the form!
      const { email, username, password } = values;
      
      //here while using axios, making HTTP POST request, sending the data to backend(through Axios API)..
      //username, email, password is the data being sent with the POST request!.

      // In summary, this code is sending a POST request to a specific route (registerRoute) with an object containing username, email, and password 
      // as the request data. It then awaits the response, and once it's received, it extracts the response data. 
      // This pattern is commonly used for sending data to a server, 
      // such as during user registration or form submissions in a web application.

      // The await keyword is used to make the asynchronous call synchronous, which means the execution of the code will pause 
      // at this line until the promise returned by axios.post is resolved.

// Here's why you would want to make a function asynchronous when using await in an HTTP POST request:
//Avoid Blocking the Event Loop:
//JavaScript is single-threaded, meaning it can only execute one operation at a time. If a synchronous operation takes a long time to complete (like a network request), it can block the entire program and make the application unresponsive.
//By making the function asynchronous and using await, you allow other tasks to continue executing while waiting for the asynchronous operation to complete. This keeps the application responsive.
//Handling Asynchronous Operations:    
// Making a function asynchronous is necessary when you need to perform operations that may take some time to complete, like making HTTP requests. The await keyword allows you to wait for the result of that operation before proceeding with the next steps.
// Code Readability:
// When you use await, it makes your code look more synchronous and easier to understand. It allows you to write asynchronous code in a manner that resembles synchronous code, which can make the logic more straightforward.
// Error Handling:
// Using await in an async function allows you to handle errors in a way that's similar to synchronous code using try and catch blocks. This makes it easier to manage errors that may occur during asynchronous operations.
// Sequencing Asynchronous Tasks:
// If you have multiple asynchronous tasks that depend on each other, using await allows you to sequence them in a readable and understandable manner. For example, you might want to perform one HTTP request, then use the result to perform another.

      //in utils folder, we have our API Routes!
      //this api calls go to UserControl.js file in server..where module.exports.register is present!
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
      });
      
     //means here while registering we got some error, and it sends respnse with body as error msg!
      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }

      //if true means, then user is created and we are adding the user into local storage and navigate into chat page!
      //here we getting the user details with only username,email and we r storing it in the local storage!
      if (data.status === true) {
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data.user)
        );
        //after storing the data in DB, we are navigating through the chatPage!
        navigate("/");
      }
    }
  };

  return (
    <>
      <FormContainer>
        <form action="" onSubmit={(event) => handleSubmit(event)}>

          {/* here for this page we are adding logo and name to the page! */}
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>ChatVerse</h1>
          </div>

          {/* taking the input for username from the user */}
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
          />

          {/* taking the input for email from the user */}
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={(e) => handleChange(e)}
          />

          {/* taking the input for password from the user */}
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />

          {/* taking the input for confirm password from the user */}
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={(e) => handleChange(e)}
          />

          {/* when user press on the his button then form gets submitted */}
          <button type="submit">Create Account</button>

          {/* if already has the account then giving option to redirects it into login page! */}
          <span>
            Already have an account ? <Link to="/login">Login.</Link>
          </span>

        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

//styling of the page take place here using Styled components library in react-js
const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;
