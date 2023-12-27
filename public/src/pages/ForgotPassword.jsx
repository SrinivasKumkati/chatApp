//below function are already used before...
import React, { useState, useEffect } from "react";
import axios from "axios";
// right now not having any API then we get error...
// import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { forgotpasswordRoute } from "../utils/APIRoutes";


//import { forgotpasswordRoute } from "../utils/APIRoutes";
//with help of this library..we can mail to the user
import emailjs from "emailjs-com";

export default function ForgotPassword() {
  const navigate = useNavigate();
  //values entered by user..
  const [values, setValues] = useState({ username: "", email: "" });

  //toast error styling..
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  
  //if the user present in localstrge..then it redirects to chat page...
  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, []);

  //live handler change..
  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  
  const validateForm = () => {
    const { username, email } = values;
    if (username === "") {
      toast.error("Username is required.", toastOptions);
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => 
{
    event.preventDefault(); // Prevents default refresh by the browser
    if(validateForm())
    {
      const {username,email} = values;
      const { data } = await axios.post(forgotpasswordRoute, {
          username,
          email,
      });
      if(data.status == false)
      {
        toast.error(data.msg,toastOptions);
      }else
      {
      //mail template..receiver's email along with name and OTP.
        var template_params = {
            to_name: username,
            email: email,
            otp_no: "1234"
        };
        //used emailJS!for sending email to the user!
        emailjs.send('service_zvw5rd7','template_j4xbje7',template_params,'FcHafgLCuOe93QLvK')
        .then((result) => {
        alert("Message Sent, We will get back to you shortly", result.text);
        //after email succefuslly done redirect it to resetpassword form page...
        navigate('/resetpassword')
        },
        (error) => {
        alert("An error occurred, Please try again", error.text);
        });
      }
    }
};

//form with username...email..details
  return (
    <>
      <FormContainer>
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>ChatVerse</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
            min="3"
          />
           <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Submit</button>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

//styling of the page...
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
    padding: 5rem;
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
