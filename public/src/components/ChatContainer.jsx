//below libraries are already used...
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import axios from "axios";

//importing the ChatInput, Logout component..adding those features in ChatContainer..
import ChatInput from "./ChatInput";


// The uuid library, particularly the v4 function, is commonly used in React (and in JavaScript development in general) for generating unique identifiers, 
// especially UUIDs (Universally Unique Identifiers). H
//here we are using this to generate unique id's to the msgs..
import { v4 as uuidv4 } from "uuid";

//importing the api routes...
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";

export default function ChatContainer({ currentChat, socket }) {

  //storing the messages in this variable...
  const [messages, setMessages] = useState([]);

  //here with useRef without render the page... we can see the data!
  const scrollRef = useRef();

  //here we are storing the arrival msgs...(msgs comming to user)
  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(async () => {

    //extracting the current user detials from local storage...
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );

    //this api calls the getMsg in the message controller..also sending the parameters of the current user...
    // and current char.id ...means (the person which we are chatting)
    const response = await axios.post(recieveMessageRoute, {
      from: data._id,
      to: currentChat._id,
    });

    //after getting response...storing the response in messages...
    setMessages(response.data);
  }, [currentChat]);

    //extracting the current chat of the user....
  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )._id;
      }
    };
    getCurrentChat();
  }, [currentChat]);

  //function executes when we press send button...
  const handleSendMsg = async (msg) => {
    
    //extracting user data..
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );

    //calling send-msg event handler for socket...where msg is send 'from' user to 'to' user...!
    //here message would be msg...
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: data._id,
      msg,
    });

    //storing the msg in the database..by calling api in the backend..
    await axios.post(sendMessageRoute, {
      from: data._id,
      to: currentChat._id,
      message: msg,
    });

    //adding the above msg in the frontend array..messages!
    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
    //now messages contains the above msg too in it!
  };

  //arrival msg timestamp....
  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        //adding recieved msgs into arrivalMessage varaible..
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  //this will run each time new arrivalMessage comes..adding it into the msgs section...!
  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  //so this will run whenever messages section changes..we scroll the new msgs here...!
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
              alt=""
            />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>
      </div>
      <div className="chat-messages">
        {messages.map((message) => {
          return (
            //here using this ScrollRef we are able to add immediately to our chat container without reloading it..
            <div ref={scrollRef} key={uuidv4()}>
              <div
                className={`message ${
                  message.fromSelf ? "sended" : "recieved"
                }`}
              >
                <div className="content ">
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* here this component handles the input msg.. */}
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
}

//styled components for the ChatContainer Page...
const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;
