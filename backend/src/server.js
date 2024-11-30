const express = require('express');
const path = require('path');
const app = express();
const session = require('express-session');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');

// 配置 session 中间件
app.use(
  session({
    secret: 'your_secret_key', // 替换为随机的密钥字符串
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 }, // 会话持续时间（1小时）
  })
);

// 中间件：验证用户是否已登录
function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login.html'); // 如果没有登录，重定向到登录页面
  }
  next();
}

// 查询访问计数 
function getVisitCount(callback) {
  db.get('SELECT count FROM visit_counts LIMIT 1', (err, row) => {
    if (err) return callback(err);
    callback(null, row ? row.count : 0);
  });
}

// 更新访问计数
function incrementVisitCount(callback) {
  db.run(`UPDATE visit_counts SET count = count + 1`, (err) => {
    if (err) {
      console.error('Error incrementing visit count:', err.message);
      callback(err);
    } else {
      callback(null);
    }
  });
}

// 中间件：解析 JSON 格式请求体
app.use(express.json());

// 更新计数 API
app.post('/api/increment-visit', (req, res) => {
  incrementVisitCount((err) => {
    if (err) return res.status(500).json({ error: 'Error updating visit count.' });
    res.json({ message: 'Visit count incremented successfully.' });
  });
});

// 获取计数 API
app.get('/api/visit-count', (req, res) => {
  getVisitCount((err, count) => {
    if (err) return res.status(500).json({ error: 'Error fetching visit count.' });
    res.json({ visitCount: count });
  });
});

// 路由保护：编辑页面
app.get('/edit.html', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/edit.html'));
});

// 登录 API
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // 查询数据库，查找用户名对应的用户记录
  db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
    if (err) {
      console.error('数据库查询错误:', err);
      return res.status(500).json({ success: false, message: '数据库查询错误' });
    }

    if (!user) {
      return res.status(401).json({ success: false, message: '用户名或密码错误' });
    }

    // 使用 bcrypt.compare 验证输入的密码是否与存储的哈希密码匹配
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.error('密码验证失败:', err);
        return res.status(500).json({ success: false, message: '登录失败' });
      }

      if (result) {
        req.session.user = { username }; // 在 session 中存储用户信息
        res.json({ success: true, message: '登录成功' });
      } else {
        res.status(401).json({ success: false, message: '用户名或密码错误' });
      }
    });
  });
});

// 静态文件托管
app.use(express.static(path.join(__dirname, '../../frontend')));

// const cors = require('cors');
// app.use(cors());
// //跨域中间件


// 头像修改
const multer = require('multer');
const fs = require('fs');
// 设置上传目录
const uploadDir = path.join(__dirname, '../../frontend/img');

// 确保上传目录存在
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
// 设置 multer 存储配置
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

// 提供静态文件服务，让前端可以访问 img 目录中的文件
app.use('/img', express.static(uploadDir));

// 处理文件上传的路由
app.post('/upload', upload.single('head_picture'), (req, res) => {
  if (req.file) {
    // 构建返回的文件访问路径
    const filePath = `/img/${req.file.filename}`;
  

    // 返回成功消息
    res.json({ message: '文件上传成功', filePath });
  } else {
    res.status(400).json({ message: '没有文件上传' });
  }
});




const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
