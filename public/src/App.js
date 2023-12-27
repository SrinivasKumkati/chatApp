// In React, the React object is fundamental. It provides the core functionality of the React library, 
// including methods for creating and managing components, handling the component lifecycle, and updating the virtual DOM.
import React from "react";

// in a React application using React Router imports several components and the main module from the "react-router-dom" package.
//Browser Router: It should wrap your entire application or the section of the application where you want to enable routing.
// Routes: Component used to define the routes of your application. It's used as a parent component that contains multiple Route components.
//Route : component used to declare a route in your application. It's typically used inside the Routes component.
import { BrowserRouter, Routes, Route } from "react-router-dom";


import SetAvatar from "./components/SetAvatar";
import Chat from "./pages/Chat";
import ForgotPassword from "./pages/ForgotPassword";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword"


export default function App() {
  return (
    //adding all the pages here...routing takes place from here!
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/setAvatar" element={<SetAvatar />} />
        <Route path="/" element={<Chat />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}
