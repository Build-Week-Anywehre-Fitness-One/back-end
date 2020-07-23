const { insert, update, findById, remove, findBy } = require("./class.model");

async function createClass(req, res) {
  try {
    const classes = await insert(req.body, req.decodedToken.subject);
    res.status(201).json(classes);
  } catch (e) {
    res.status(500).json({ message: "uable to create new class" });
  }
}

async function updateClass(req, res) {
  const { id } = req.params;
  try {
    const classes = await findById(id);
    if (!classes) {
      return res.status(400).json({ message: "class does not exist" });
    }

    const updatedContent = await update(id, req.body);
    res.status(200).json(updatedContent);
  } catch (e) {
    res.status(500).json({ message: "unable to update class" });
  }
}

async function removeClass(req, res) {
  const { id } = req.params;
  try {
    const classes = await findById(id);
    if (!classes) {
      return res.status(400).json({ message: "class does not exist" });
    }
    await remove(id);
    res.status(200).json({ message: "successfully deleted class" });
  } catch (e) {
    res.status(500).json({ message: "unable to remove class" });
  }
}

async function searchClass(req, res) {
  const { time, date, duration, type, intensity, location } = req.query;
  const finalquery = {};

  if (time) {
    finalquery.startTime = time;
  }

  if (date) {
    finalquery.date = date;
  }

  if (duration) {
    finalquery.duration = +duration;
  }

  if (type) {
    finalquery.type = type;
  }

  if (intensity) {
    finalquery.intensity = intensity;
  }

  if (location) {
    finalquery.location = location;
  }

  try {
    const searchResult = await findBy(finalquery);
    res.status(200).json(searchResult);
  } catch (e) {
    res.status(500).json({ message: "unable to perform any search" });
  }
}

module.exports = { createClass, updateClass, removeClass, searchClass };
