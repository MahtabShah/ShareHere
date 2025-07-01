const mongoose = require("mongoose");
const Status = require("./models/Status");
const User = require("./models/User");

// Call this function every few minutes using node-cron
const cleanUpOldStatuses = async () => {
  const expiryTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago

  try {
    const expiredStatuses = await Status.find({ createdAt: { $lt: expiryTime } });

    for (let status of expiredStatuses) {
      // 1. Remove status from user's status array
      await User.updateMany(
        { status: status._id },
        { $pull: { status: status._id } }
      );

      // 2. Delete the actual status from Status collection
      await Status.deleteOne({ _id: status._id });

      // console.log(`Deleted status: ${status._id}`);
    }
  } catch (err) {
    console.error("Error cleaning statuses:", err);
  }
};

module.exports = cleanUpOldStatuses;
