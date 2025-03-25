module.exports = (req, res, next) => {
    const { title, description = '' } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
    
    if (title.length > 100) {
      return res.status(400).json({ error: "Title too long (max 100 chars)" });
    }
    
    if (description && description.length > 500) {
      return res.status(400).json({ error: "Description too long (max 500 chars)" });
    }
    next();
  };