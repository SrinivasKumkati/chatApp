//here in userModel we have declared the backend user Schema via mongoose
const User = require("../models/userModel");

//here we use this to hash the password for the user before saving it in the database!
const bcrypt = require("bcrypt");


//revise same stuff from the module.exports.register!
module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    
    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

//the api call from the frontend in register page comes here!
module.exports.register = async (req, res, next) => {
  try {
    //here the register page sends the username, password, email as request body
    const { username, email, password } = req.body;

    //checking whether already a users exists with that name in DB.
    const usernameCheck = await User.findOne({ username });

    //if already present, then giving error msg as response body with status false!
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });

    //if already present, then giving error msg as response body with status false!
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });

    //hashing the password and storing it in the data base!
    // The second argument (10) is the number of salt rounds. The salt is a randomly generated value that is combined 
    // with the password before hashing. The higher the number of rounds, 
    // the more computationally expensive the hashing process becomes, making it harder for attackers to perform brute-force attacks.
    const hashedPassword = await bcrypt.hash(password, 10);

    //here we are using create functions of MongoDB..using imported mongoose schema "User"..
    //storing the data in the mongodb!
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    //here we are deleting the user.password in the catche too!
    delete user.password;

    //send response to the API called in register page, with detials of only username, email which gets stored in local storage!
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};


//this call comes from chat.Jsx from frontend!
module.exports.getAllUsers = async (req, res, next) => {
  try {
    //This code is looking for all users except the one with this ID in the database(mongodb).
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    //sending the response to the chat page with all the users..along with email..username..avatarImage..id..
    return res.json(users);
  } catch (ex) {
    //if it is not succesful we get some error...
    next(ex);
  }
};

//this api executes when we call from the SetAvatar component!
module.exports.setAvatar = async (req, res, next) => {
  try {
    //we that request only we have body which contains..userId..avatarImage..
    const userId = req.params.id;
    const avatarImage = req.body.image;

    //here we are find the user with id and updating the image..
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );

    //we are sending the response to SetAvatar Component after updating the data in DB!
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });

  } catch (ex) {
    //if some error occurs then returns false status
    next(ex);
  }
};

//api comes from logout component...
module.exports.logOut = async (req, res, next) => {
  try {
    //if id of the user is not present then we gives respnse wit error msg...
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};

//api comes from resetpassword page!
module.exports.resetpassword = async (req,res,next) => {
  try {
    //extracting folllowing info from the user...
    const { username, password, otp} = req.body;
    const user = await User.findOne({ username });

    if (!user)
      return res.json({ msg: "User doesn't exists, please verify your username", status: false });
    if (otp!=="1234")
      return res.json({msg:"Wrong otp, Please Check Your OTP",status:false})

    const hashedPassword = await bcrypt.hash(password, 10);
    const user1 = await User.update({username:user.username},{$set:{password:hashedPassword}})
    delete user1.password
    return res.json({status:true,user1})
  } catch (ex) {
    next(ex);
  }
};

module.exports.forgotpassword = async (req,res,next) => {
  try{
      const {username,email} = req.body;
      const User_username = await User.findOne({username});
      const User_email = await User.findOne({email});
      if(!User_username)
        return res.json({msg:"User doesn't exits, please verify your username", status:false});
      if(!User_email)
        return res.json({msg:"User doesn't exits, please verify your email-id", status:false});
      return res.json({status:true,User_username});
  }catch(ex)
  {
    next(ex);
  }
};

// module.exports.updateUsername = async (req,res) => 
// {
//   try
//   {
//     if(!req.body)
//     {
//       return res.status(400).send({message:"Data and Body can not be Empty..."});
//     }
//     const {_id} = req.body;
//     await User.findByIdAndUpdate({_id},req.body,{useFindAndModify:false});
//     return res.status(200).send({message:"Updated Username Succesfully..."});
//   }catch(ex)
//   {
//     next(ex);
//   }
// }
