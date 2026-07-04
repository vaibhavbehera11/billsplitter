const express = require("express");

const upload = require(
  "../middleware/upload"
);

const {
  parseBillImage,
} = require(
  "../services/geminiService"
);


const router = express.Router();


router.post(
  "/parse-bill",

  upload.single("billImage"),

  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Bill image is required",
        });
      }


      const items =
        await parseBillImage(
          req.file.buffer,
          req.file.mimetype
        );


      return res.status(200).json({
        success: true,
        items,
      });

    } catch (error) {
      console.error(error);


      return res.status(500).json({
        success: false,
        message:
          "Failed to parse bill image",
      });
    }
  }
);


module.exports = router;