import Conversation from '../models/conversationModel.js';
import User from '../models/userModels.js';

export const getUserBySearch = async (req, res) => {
  try {
    const search = req.query.search || "";
    const currentUserId = req.user._id || req.user.userId;

    const users = await User.find({
      $and: [
        {
          $or: [
            { username: { $regex: '.*' + search + '.*', $options: "i" } },
            { fullname: { $regex: '.*' + search + '.*', $options: "i" } }
          ]
        },
        { _id: { $ne: currentUserId } }
      ]
    }).select("-password").select("-email");

    res.status(200).send(users);

  } catch (error) {
    console.error("Error in getUserBySearch:", error.message);
    res.status(500).send({
      success: false,
      message: error.message || "Something went wrong"
    });
  }
};
export const getCurrentChatters = async (req, res) => {
  try {
    const currentUserId = req.user._id || req.user.userId;

    const currentChatters = await Conversation.find({
      participants: currentUserId
    }).sort({ updatedAt: -1 });

    if (!currentChatters || currentChatters.length === 0) {
      return res.status(200).send([]);
    }

    const participantsIDS = currentChatters.reduce((ids, conversation) => {
      const others = conversation.participants.filter(
        id => id.toString() !== currentUserId.toString()
      );
      return [...ids, ...others];
    }, []);

    const uniqueOtherParticipants = [...new Set(participantsIDS.map(id => id.toString()))];

    const users = await User.find({
      _id: { $in: uniqueOtherParticipants }
    }).select("-password -email");


    res.status(200).send(users);

  } catch (error) {
    console.error("Error in getCurrentChatters:", error.message);
    res.status(500).send({
      success: false,
      message: error.message || "Something went wrong"
    });
  }
};
