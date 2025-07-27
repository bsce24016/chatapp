import Conversation from "../models/conversationModel.js";
import Message from "../models/messageSchema.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: reciverId} = req.params;
    const senderId = req.user._id || req.user.userId;


    let chats = await Conversation.findOne({
      participants: { $all: [senderId, reciverId] }
    });

    if (!chats) {
      chats = await Conversation.create({
        participants: [senderId, reciverId],
        messages: []
      });
    }

    const newMessage = new Message({
      senderId,
      reciverId,
      message,
      conversationId: chats._id
    });

    chats.messages.push(newMessage._id);

    await Promise.all([chats.save(), newMessage.save()]);        //socket

    res.status(201).send({
      success: true,
      message: "Message sent successfully",
      newMessage
    });

  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).send({
      success: false,
      message: error.message || "Something went wrong"
    });
  }
};
export const getMessages = async (req, res) => {
    try {
         const { id: reciverId } = req.params;
    const senderId = req.user._id || req.user.userId;
    const chats = await Conversation.findOne({
      participants: { $all: [senderId, reciverId] }
    }).populate("messages");

    if (!chats)return res.status(200).send([]);
 const message=chats.messages;

    res.status(200).send(message);

  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).send({
      success: false,
      message: error.message || "Something went wrong"
        
    }
    );
  }
};