const User = require("./user.model");
const Classes = require("../class/class.model");

async function getAllUsers(req, res) {
  try {
    let users = await User.find();
    res.status(200).json(users);
  } catch (e) {
    res.status(500).json({ message: "uable to get users" });
  }
}

async function userJoinClass(req, res) {
  const { user_id, class_id } = req.params;
  if (!user_id || !class_id) {
    return res
      .status(400)
      .json({ message: "missing params user_id and/or class_id" });
  }

  try {
    const [user, classes] = await Promise.all([
      User.findById(user_id),
      Classes.findById(class_id)
    ]);

    if (!user) {
      return res.status(400).json({ message: "user does not exist" });
    }

    if (!classes) {
      return res.status(400).json({ message: "class does not exist" });
    }

    // check to see if class is already fulled up
    if (classes.numberOfRegisteredAttendees === classes.maxClassSize) {
      return res
        .status(400)
        .json({ message: "already reach the max capacity for class" });
    }

    // add user to specified class
    await User.joinClass(user_id, class_id);

    // update number of registered attendees joined
    const joinedClass = await Classes.update(class_id, {
      numberOfRegisteredAttendees: classes.numberOfRegisteredAttendees + 1
    });

    res.status(200).json(joinedClass);
  } catch (e) {
    if (e.code === "SQLITE_CONSTRAINT") {
      return res.status(400).json({ message: "user has already joined class" });
    }
    res.status(500).json({ message: "uable to join class" });
  }
}

async function userLeaveClass(req, res) {
  const { user_id, class_id } = req.params;
  if (!user_id || !class_id) {
    return res
      .status(400)
      .json({ message: "missing params user_id and/or class_id" });
  }
  try {
    const [user, classes] = await Promise.all([
      User.findById(user_id),
      Classes.findById(class_id)
    ]);

    if (!user) {
      return res.status(400).json({ message: "user does not exist" });
    }

    if (!classes) {
      return res.status(400).json({ message: "class does not exist" });
    }

    await User.removeFromClass(user_id, class_id);

    await Classes.update(class_id, {
      numberOfRegisteredAttendees: classes.numberOfRegisteredAttendees - 1
    });

    res.status(200).json({ message: "user removed from class" });
  } catch (e) {
    res.status(500).json({ message: "uable to remove from class" });
  }
}

module.exports = { getAllUsers, userJoinClass, userLeaveClass };
