import express from "express";
import crypto from "crypto";
import sqlite3 from "sqlite3";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Получаем абсолютный путь к текущей папке (решает проблемы с путями на macOS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Database } = sqlite3;
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const PARTNER_TOKEN = process.env.PARTNER_TOKEN || "local_test_token";

// Абсолютный путь к базе данных
const dbPath = path.join(__dirname, "tasks.db");
console.log("📂 Путь к базе данных:", dbPath);
const db = new Database(dbPath);

// Создаём таблицу
db.run(`CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY, 
  salon_id INTEGER, 
  title TEXT, 
  staff_id INTEGER,
  deadline TEXT, 
  done INTEGER DEFAULT 0, 
  created_at TEXT
)`, (err) => {
  if (err) console.error("❌ Ошибка создания таблицы БД:", err);
  else console.log("✅ Таблица tasks готова к работе");
});

// Middleware с логированием
function verifyAuth(req, res, next) {
  console.log("🔍 [verifyAuth] Получен запрос. Query:", req.query);
  const salon_id = req.query.salon_id;
  req.salonId = salon_id ? Number(salon_id) : 1;
  console.log("✅ [verifyAuth] salonId установлен в:", req.salonId);
  next();
}

// 1. Получить задачи
app.get("/api/tasks", verifyAuth, (req, res) => {
  console.log("📥 [GET /api/tasks] Запрос на получение задач для salon_id:", req.salonId);
  db.all("SELECT * FROM tasks WHERE salon_id = ? ORDER BY created_at DESC", [req.salonId], (err, rows) => {
    if (err) {
      console.error("❌ [DB Error] Ошибка чтения из БД:", err);
      return res.status(500).json({ error: err.message });
    }
    console.log("✅ [GET /api/tasks] Успешно отправлено задач:", rows ? rows.length : 0);
    res.json(rows || []);
  });
});

// 2. Создать задачу
app.post("/api/tasks", verifyAuth, (req, res) => {
  console.log("📥 [POST /api/tasks] Получены данные от клиента:", req.body);
  const { title, staff_id, deadline } = req.body;
  const id = crypto.randomUUID();
  
  db.run(
    "INSERT INTO tasks (id, salon_id, title, staff_id, deadline, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    [id, req.salonId, title, staff_id || null, deadline, new Date().toISOString()],
    function(err) {
      if (err) {
        console.error("❌ [DB Insert Error] Ошибка записи в БД:", err);
        return res.status(500).json({ error: err.message });
      }
      console.log("✅ [POST /api/tasks] Задача успешно создана, ID:", id);
      res.json({ id, success: true });
    }
  );
});

// 3. Завершить задачу
app.patch("/api/tasks/:id", verifyAuth, (req, res) => {
  console.log("📥 [PATCH /api/tasks/:id] Обновление задачи:", req.params.id);
  db.run(
    "UPDATE tasks SET done = 1 WHERE id = ? AND salon_id = ?", 
    [req.params.id, req.salonId], 
    (err) => {
      if (err) {
        console.error("❌ [DB Update Error] Ошибка обновления в БД:", err);
        return res.status(500).json({ error: err.message });
      }
      console.log("✅ [PATCH /api/tasks/:id] Задача успешно обновлена");
      res.json({ success: true });
    }
  );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
});