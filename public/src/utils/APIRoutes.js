//location where our server is running right now!
export const host = "http://localhost:5001";

//api call route from frontend to backend for the register page!
export const loginRoute = `${host}/api/auth/login`;

//api call route from frontend to backend for the register page!
export const registerRoute = `${host}/api/auth/register`;

export const logoutRoute = `${host}/api/auth/logout`;

//api call route from fronetend to backwnd for the chat page
export const allUsersRoute = `${host}/api/auth/allusers`;

//storing the msg into the database...
export const sendMessageRoute = `${host}/api/messages/addmsg`;

//extracting the msg from database...
export const recieveMessageRoute = `${host}/api/messages/getmsg`;

//api call route from frontend to backend for the register page!
export const setAvatarRoute = `${host}/api/auth/setavatar`;


export const resetpasswordRoute = `${host}/api/auth/resetpassword`;


export const forgotpasswordRoute = `${host}/api/auth/forgotpassword`;