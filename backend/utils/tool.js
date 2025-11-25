import jwt from "jsonwebtoken";
import md5 from "md5";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import pkg from "markdown-toc";
const { toc } = pkg;

// 在 ES 模块中获取 __dirnames
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 格式化要响应的数据
export function formatResponseData(code, msg, data) {
  return {
    code,
    msg,
    data,
  };
}

// 解析token
export function parseToken(token) {
  try {
    return jwt.verify(token.split(" ")[1], md5(process.env.JWT_SECRET));
  } catch (err) {
    return null;
  }
}

// 处理数组类型相应数据
export function handleArrayResponseData(data) {
  return data.map((item) => item.dataValues);
}

// 上传multer的引擎
const storage = multer.diskStorage({
  // 文件存储的目录
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "/../public/static/uploads"));
  },
  // 处理上传到服务器的文件名
  filename: function (req, file, cb) {
    // 解决中文名乱码问题
    file.originalname = Buffer.from(file.originalname, "latin1").toString(
      "utf8"
    );
    // 获取文件名
    const baseName = path.basename(
      file.originalname,
      path.extname(file.originalname)
    );
    // 获取文件扩展名
    const extName = path.extname(file.originalname);
    // 构建新的文件名
    const newFileName =
      baseName +
      "-" +
      Date.now() +
      "-" +
      Math.floor(Math.random() * 9000 + 1000) +
      extName;
    cb(null, newFileName);
  },
});

// 上传multer的实例
export function uploadMulter() {
  return multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 2, files: 1 },
  });
}

export function transfer(faltArr) {
  const stack = [];
  const result = [];
  let min = 6; //标题最小的级别
  // 寻找当前数组中最小的级别
  for (const item of faltArr) {
    if (item.lvl < min) {
      min = item.lvl;
    }
  }

  // 创建TOC项
  function createTocItem(item) {
    return {
      title: item.content,
      level: item.lvl,
      anchor: item.slug,
      children: [],
    };
  }

  // 处理数组项
  function handleItem(item) {
    // 获取栈顶元素
    const top = stack[stack.length - 1];
    if (!top) {
      stack.push(item);
    } else if (item.level > top.level) {
      // 栈顶元素的级别小于当前项的级别，当前项成为栈顶元素 当前toc对象应该成为上一个toc对象的子元素
      top.children.push(item);
      stack.push(item);
    } else {
      // 栈顶元素的级别大于等于当前项的级别，弹出栈顶元素
      stack.pop();
      handleItem(item);
    }
  }

  // 遍历数组 构建树结构
  for (const item of faltArr) {
    const tocItem = createTocItem(item);
    // 处理最小级别的标题
    if (tocItem.level === min) {
      result.push(tocItem);
    }
    // 处理其他级别的标题
    handleItem(tocItem);
  }
  return result;
}

// 处理TOC
export function handleTOC(info) {
  try {
    // 如果没有 markdownContent，返回空 TOC
    if (!info.markdownContent || !info.markdownContent.trim()) {
      info.toc = [];
      return info;
    }

    // 如果没有 htmlContent，无法处理 TOC
    if (!info.htmlContent || !info.htmlContent.trim()) {
      info.toc = [];
      return info;
    }

    let res = toc(info.markdownContent || "").json;

    // 如果 TOC 解析失败，返回空数组
    if (!res || !Array.isArray(res)) {
      info.toc = [];
      return info;
    }

    info.toc = transfer(res);

    // 保存 markdownContent（虽然会被删除，但调用者会恢复）
    const markdownContent = info.markdownContent;
    delete info.markdownContent;

    // 为各个级别的标题添加id属性（只替换第一个匹配的）
    for (const item of res) {
      if (!item || !item.lvl || !item.slug) continue;

      try {
        switch (item.lvl) {
          case 1:
            var newStr = `<h1 id="${item.slug}">`;
            // 只替换第一个匹配的
            if (info.htmlContent.includes("<h1>")) {
              info.htmlContent = info.htmlContent.replace("<h1>", newStr);
            }
            break;
          case 2:
            var newStr = `<h2 id="${item.slug}">`;
            if (info.htmlContent.includes("<h2>")) {
              info.htmlContent = info.htmlContent.replace("<h2>", newStr);
            }
            break;
          case 3:
            var newStr = `<h3 id="${item.slug}">`;
            if (info.htmlContent.includes("<h3>")) {
              info.htmlContent = info.htmlContent.replace("<h3>", newStr);
            }
            break;
          case 4:
            var newStr = `<h4 id="${item.slug}">`;
            if (info.htmlContent.includes("<h4>")) {
              info.htmlContent = info.htmlContent.replace("<h4>", newStr);
            }
            break;
          case 5:
            var newStr = `<h5 id="${item.slug}">`;
            if (info.htmlContent.includes("<h5>")) {
              info.htmlContent = info.htmlContent.replace("<h5>", newStr);
            }
            break;
          case 6:
            var newStr = `<h6 id="${item.slug}">`;
            if (info.htmlContent.includes("<h6>")) {
              info.htmlContent = info.htmlContent.replace("<h6>", newStr);
            }
            break;
        }
      } catch (err) {
        console.error(`处理标题级别 ${item.lvl} 时出错:`, err);
        // 继续处理下一个
      }
    }

    return info;
  } catch (error) {
    console.error("handleTOC 函数出错:", error);
    // 出错时返回空 TOC
    info.toc = [];
    return info;
  }
}
