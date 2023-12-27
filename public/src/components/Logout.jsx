//already discussed regarding below lib...
import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

//logout icon imported...
import { BiPowerOff } from "react-icons/bi";

//importing the route of logout backend...
import { logoutRoute } from "../utils/APIRoutes";


export default function Logout() {

  const navigate = useNavigate();

  //when we submit using logout button...this func executes
  const handleClick = async () => {

    //extracting the user from here
    const id = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    )._id;

    //calling the api of logout in the backend...
    const data = await axios.get(`${logoutRoute}/${id}`);

    //if status 200, means the user should remove from lcoal storage...and redirects him to login page...
    if (data.status === 200) {
      localStorage.clear();
      navigate("/login");
    }
  };

  return (
    //button BiPowerOff...
    <Button onClick={handleClick}>
      <BiPowerOff />
    </Button>
  );
}


//styling component for button...
const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #9a86f3;
  border: none;
  cursor: pointer;
  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }
`;
