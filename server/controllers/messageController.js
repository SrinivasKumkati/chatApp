//here importing the schema of msg body...
const Messages = require("../models/messageModel");


//extracting the msgs from the database!
module.exports.getMessages = async (req, res, next) => {
  try {
    //here we are getting info from , to ...
    const { from, to } = req.body;

    //$all: This is a MongoDB operator. In this context, it's being used to match documents where the users array contains both from and to.
    //[from, to]: This is an array containing two values, from and to. 
    //It's specifying that both of these values should be present in the users array for a document to be considered a match.
    //sort(updateAt:1) : (1mean ascending order) This means that the messages will be returned in the order of when they were last updated, with the oldest ones first.
   
    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

// For each msg, this code block creates a new object with two properties: fromSelf and message.
// fromSelf:
// msg.sender likely represents the sender of the message. It appears to be an ObjectId.
// .toString() is called to convert it to a string.
// This string is then compared (===) to the value of from. If they are equal, fromSelf will be true; otherwise, it will be false. This indicates whether the message was sent by the current user.
// message:
// This property is assigned the value of msg.message.text. It appears that msg.message.text is the actual text content of the message.

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
   
    // sending the responses to frontend..
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};


//adding the msg to the database...
module.exports.addMessage = async (req, res, next) => {
  try {
    //getting details from request body...
    const { from, to, message } = req.body;

    //using mongodb prop..creating the msgs adding in database..
    //users contaisn detials of from, to user data...
    //sender contains from data...

    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    //if we get status true...then msg is added successfully in the database..
    if (data) return res.json({ msg: "Message added successfully." });
    //if unable to added sending error msg...
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};
