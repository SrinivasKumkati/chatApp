// Unlike useState, which causes a re-render when the state value changes, 
// useRef does not trigger a re-render when the current property of the ref changes.
// Common use cases for useRef include:
// Holding a reference to a DOM element (e.g., to access its properties or methods).
// Storing a value that should not trigger a re-render when it changes.
// Persisting values across renders without causing a re-render.
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
// import Logout from "./Logout";
import Logout from "../components/Logout";

// 1) socket.io-client is a JavaScript library that provides client-side functionality for interacting with a server that uses the Socket.IO library. 
// Socket.IO enables real-time, bidirectional, and event-based communication.
// 2)The io object allows you to establish a connection to a Socket.IO server from the client side. 
// This connection enables real-time communication between the client and the server.
import { io } from "socket.io-client";

//extracting all the contacts from here!
import { allUsersRoute, host } from "../utils/APIRoutes";

//importing the components in the ChatPage.. (Components are Welcome Page..Contacts...ChatContainer)
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();

  //stores all the contacts other then the currentUser...
  const [contacts, setContacts] = useState([]);
  //represents the currentChat...
  const [currentChat, setCurrentChat] = useState(undefined);
  //currenUser in the local storage/person who did the login now...
  const [currentUser, setCurrentUser] = useState(undefined);

  //checking whether the user is in login or not.., extracting the user info and storing data in currentUser variable!
  useEffect(async () => {
    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/login");
    } else {
      //setting the current user from local storage...
      setCurrentUser(
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )
      );
    }
  }, []);

  // In summary, this code sets up an effect that runs whenever currentUser changes.
  //  If there is a valid currentUser, it establishes a connection to a Socket.IO server and emits an "add-user" event with the current user's ID. 
  //  This pattern is common in real-time applications where you want to perform actions when a user logs in or their status change...
  //  host is a variable or constant that contains the URL or location of the Socket.IO server
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);


  useEffect(async () => {
    //here we are checking whether user is present in local storage or not and also along with avatar image...
    if (currentUser) {
      if (currentUser.isAvatarImageSet) {
        // sending the HTTP get request to get all the contacts...
        const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
        //changine the state of the form...
        setContacts(data.data);
      } else {
        //if the user doesnt select avatar image...it automatically redirects into /setAvatar page...
        navigate("/setAvatar");
      }
    }
  }, [currentUser]);

//so whenever user selects on any chat...then we need to change CurrentChat parallely...
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  const handleChangeAvatar = () => 
  {
      navigate("/setAvatar");
  }
  return (
    <>
    {/* here we are defining that at each time when the user selects the chat we add handleChatChange function... */}
    {/* if there is no currentchat then we show welcome page.. */}
      <Container>
        <div className="edit-profile">
            <button onClick={handleChangeAvatar}>Edit Avatar Image</button>
            {/* <button>Change Password</button> */}
            <Logout />
        </div>
        <div className="container">
          {/* giving parameter as contacts along with handlechatchange... */}
          <Contacts contacts={contacts} changeChat={handleChatChange} />
          {/* //if no chat selected then we need to show welcome page... */}
          {currentChat === undefined ? (
            <Welcome />
          ) : (
            // if the currentChat selected...then we need to open that chatBox
            <ChatContainer currentChat={currentChat} socket={socket} />
          )}
        </div>
      </Container>
    </>
  );
}


//here we are styling the chat..page!
const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
  .edit-profile{
    width:85vw;
    height:5vh;
    display: flex;
    justify-content:space-between;
  }
  button {
  color:white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #9a86f3;
  }
`;

