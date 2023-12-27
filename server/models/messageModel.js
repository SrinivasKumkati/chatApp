//importing the mongooose library here...
//mongoose is an ODM library for MongoDB.
const mongoose = require("mongoose");
//This is a JavaScript code snippet that defines a Mongoose schema for a msg in a MongoDB database
const MessageSchema = mongoose.Schema(
  {
    //it should be string and not empty...
    message: {
      text: { type: String, required: true },
    },
    
    users: Array,

    // sender: This property is of type mongoose.Schema.Types.ObjectId, which is used to store MongoDB ObjectIds. 
    //It's also marked as required (required: true). Additionally, it's associated with the User model via the ref property. 
    //This suggests that sender should be an ObjectId referencing a document in the "User" collection.
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    //This argument configures Mongoose to automatically manage createdAt and updatedAt timestamps for each document created using this schema. 
    //This is a common practice for keeping track of when a document was created and last updated.
    timestamps: true,
  }
//msg id 
);
module.exports = mongoose.model("Messages", MessageSchema);
