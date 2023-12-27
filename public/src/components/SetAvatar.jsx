import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { setAvatarRoute } from "../utils/APIRoutes";
//above stuff already in register page!


// In summary, this line of code is importing the Buffer class from the "buffer" package, 
// which provides a way to work with binary data in environments like Node.js. If you're working with binary data, 
// this import allows you to use the Buffer class in your JavaScript code.
import { Buffer } from "buffer";

//loader is the gif image till the avatar images loads we will show this image!
import loader from "../assets/loader.gif";

export default function SetAvatar() {

  //this generates the multiavatar image, each time when uh change the numerical number..avatar image will display different!
  const api = `https://api.multiavatar.com/4645646`;

  //same like in register page!
  const navigate = useNavigate();

  //this code is the variable for avatar image, intially we kept this empty, later it contains all 4 options of avatar
  const [avatars, setAvatars] = useState([]);

  //initially before user select the avatar image we keep Loading image, so initial value is TRUE
  const [isLoading, setIsLoading] = useState(true);

  //when user selects avatar..we store that avatar in it
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  //same toastoptions styling for all pages
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  //if we dont find user in LOCAL STORAGE then we redirect the page to login page!
  useEffect(async () => {
    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))
      navigate("/login");
  }, []);

//this is on submit event by the form!
  const setProfilePicture = async () => {

    //so if we submit before selecting, it gives toast error!
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
    } else {

      //extracting user data from local storage!
      const user = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );
      
      //here we are having a API call to the backend...
      //for each user it may have diff thing..so adding user._id with it!
      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      });

      //if we get response as true..then we are updating the current user parameters to true..
      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;

        //adding user back to local storage..after updating avatarImage..isAvatarImageSet!
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(user)
        );

        //after adding the user into local storage..navigate through the ChatPage...
        navigate("/");
      } else {

        //if some error has occured in backend we get status as false so we give toast error!
        toast.error("Error setting avatar. Please try again.", toastOptions);
      }
    }
  };

  //here we are extracting the multiavatars api..useffect used for fetching the data!

  useEffect(async () => {
    //storing all the avatar images in the array..
    const data = [];

    //..for each user we are giving 4 options to select image!
    for (let i = 0; i < 4; i++) {

      //fetching avatar image from the online...
      const image = await axios.get(
        `${api}/${Math.round(Math.random() * 1000)}`
      );

      //converting it into the raw data!
      const buffer = new Buffer(image.data);

      //it is converted into string from raw data
      data.push(buffer.toString("base64"));
    }

    //after all 4 images loaded.. we are storing those in avatars!
    setAvatars(data);

    //when it loads cmplty.. we are setting it into false... which means now we can show avatar images
    setIsLoading(false);
  }, []);


  return (
    <>
      {/* if isLoading is true then..we show loaded image */}
      {isLoading ? (
        <Container>
          <img src={loader} alt="loader" className="loader" />
        </Container>
      ) : (
        <Container>

          
          <div className="title-container">
            <h1>Pick an Avatar as your profile picture</h1>
          </div>

          <div className="avatars">

            {/* we are iterating for each avatar */}
            {avatars.map((avatar, index) => {
              return (
                <div
                  className={`avatar ${
                    selectedAvatar === index ? "selected" : ""
                  }`}
                >
                  <img
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"
                    key={avatar}
                    //if the user click on it..save the avatar in SelectedAvatar!
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              );
            })}
          </div>

          {/* when we click on submit button...setProfilePicutre function executes */}
          <button onClick={setProfilePicture} className="submit-btn">
            Set as Profile Picture
          </button>

          <ToastContainer />
        </Container>
      )}
    </>
  );
}

//styling for the avatar compoent page!
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: white;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
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
`;
