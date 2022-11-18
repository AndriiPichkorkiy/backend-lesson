const express = require("express")
const Message = require("../../models/message");

const router = express.Router();

router.get("/", async (req, res) => { const data = await Message.find(); res.json(data); })

router.post("/", async (req, res) => {   const message = req.body; 
  const data = await Message.create(message);
//   console.log("req.body", req.body);
  res.json(data);
})

module.exports = router;