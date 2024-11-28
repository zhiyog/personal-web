const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');
const bcrypt = require('bcrypt');
// 初始化数据库
// db.serialize(() => {
//   // 创建 users 表
  

//   db.run(`
//     CREATE TABLE IF NOT EXISTS users (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       username TEXT NOT NULL UNIQUE,
//       password TEXT NOT NULL
//     )
//   `);

//   // 插入默认用户
//   db.run(`
//     INSERT OR IGNORE INTO users (username, password)
//     VALUES ('admin', '123456') -- 修改为你需要的初始用户名和密码
//   `);

//   // 创建 visit_counts 表
//   db.run(`
//     CREATE TABLE IF NOT EXISTS visit_counts (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       count INTEGER NOT NULL DEFAULT 0
//     )
//   `);

//   // 初始化访问计数
//   db.run(`
//     INSERT OR IGNORE INTO visit_counts (count)
//     VALUES (0)
//   `);
// });
 // 加密密码
 

 // 初始化数据库
 db.serialize(() => {
   // 创建用户表
   db.run(`
     CREATE TABLE IF NOT EXISTS users (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       username TEXT UNIQUE NOT NULL,
       password TEXT NOT NULL
     )
   `);
 
   // 加密密码
   const username = 'admin';
   const plainPassword = 'admin123';
 
   bcrypt.hash(plainPassword, 10, (err, hashedPassword) => {
     if (err) {
       console.error('密码加密失败:', err);
       db.close(); // 在发生错误时也需要关闭数据库
       return;
     }
 
     // 插入初始化数据
     db.run(
       `INSERT INTO users (username, password) VALUES (?, ?)`,
       [username, hashedPassword],
       (err) => {
         if (err) {
           console.error('数据插入失败:', err);
         } else {
           console.log(`用户 ${username} 数据初始化完成`);
         }
         // 所有操作完成后关闭数据库
         db.close();
       }
     );
   });
 });
 