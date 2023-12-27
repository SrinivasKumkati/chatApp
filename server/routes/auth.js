const {
  login,
  register,
  getAllUsers,
  setAvatar,
  logOut,
  resetpassword,
  forgotpassword
} = require("../controllers/userController");

// both of these options achieve the same result, but they serve slightly different purposes.

// Using app.post() directly is appropriate if you're building a smaller, single-file application where defining routes directly on the app instance makes sense. This is common for simple applications or prototypes.
// Using express.Router() is useful when you're working on a larger, more complex application where you might have many routes and want to organize them into separate modules. 
//Router allows you to group related routes together and then mount them on your main app instance.
// For example, you might have different routers for handling different parts of your application...!

const router = require("express").Router();

router.post("/login", login);
router.post("/register", register);
router.get("/allusers/:id", getAllUsers);
router.post("/setavatar/:id", setAvatar);
router.get("/logout/:id", logOut);
router.post("/resetpassword",resetpassword);
router.post("/forgotpassword",forgotpassword);

module.exports = router;
