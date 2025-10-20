import express from "express";
const router = express.Router();
import multer from "multer";
import { uploadMulter } from "../utils/tool.js";
import { FileUploadError } from "../utils/errors.js";
import { formatResponseData } from "../utils/tool.js";

router.post("/", async (req, res, next) => {
  uploadMulter().single("file")(req, res, (err) => {
    // 上传文件错误
    if (err instanceof multer.MulterError) {
      return next(new FileUploadError("请检查文件的大小,限制2MB"));
    } else if (err) {
      return next(err);
    } else {
      const path = "static/uploads/" + req.file.filename;
      res.send(formatResponseData(200, "上传成功", path));
    }
  });
});
export default router;
