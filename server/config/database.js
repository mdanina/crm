const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err.message);
  } else {
    console.log('Подключено к базе данных SQLite');
  }
});

// Создание таблиц
db.serialize(() => {
  // Таблица пользователей (администраторы, менеджеры)
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      full_name TEXT NOT NULL,
      email TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Таблица психологов
  db.run(`
    CREATE TABLE IF NOT EXISTS psychologists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      specialization TEXT,
      phone TEXT,
      email TEXT,
      education TEXT,
      experience_years INTEGER,
      rate_per_hour REAL,
      status TEXT DEFAULT 'active',
      photo_url TEXT,
      bio TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Таблица клиентов
  db.run(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      date_of_birth DATE,
      gender TEXT,
      address TEXT,
      emergency_contact TEXT,
      notes TEXT,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Таблица записей на прием
  db.run(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER NOT NULL,
      psychologist_id INTEGER NOT NULL,
      appointment_date DATE NOT NULL,
      appointment_time TEXT NOT NULL,
      duration INTEGER DEFAULT 60,
      status TEXT DEFAULT 'scheduled',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES clients(id),
      FOREIGN KEY (psychologist_id) REFERENCES psychologists(id)
    )
  `);

  // Таблица сеансов (история)
  db.run(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      appointment_id INTEGER NOT NULL,
      client_id INTEGER NOT NULL,
      psychologist_id INTEGER NOT NULL,
      session_date DATE NOT NULL,
      duration INTEGER,
      notes TEXT,
      diagnosis TEXT,
      recommendations TEXT,
      next_session_planned DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (appointment_id) REFERENCES appointments(id),
      FOREIGN KEY (client_id) REFERENCES clients(id),
      FOREIGN KEY (psychologist_id) REFERENCES psychologists(id)
    )
  `);

  // Таблица платежей
  db.run(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER,
      client_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      payment_date DATE NOT NULL,
      payment_method TEXT,
      status TEXT DEFAULT 'completed',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES sessions(id),
      FOREIGN KEY (client_id) REFERENCES clients(id)
    )
  `);

  // Вставка тестового пользователя (admin/admin123)
  const bcrypt = require('bcryptjs');
  const hashedPassword = bcrypt.hashSync('admin123', 10);

  db.run(`
    INSERT OR IGNORE INTO users (username, password, role, full_name, email)
    VALUES ('admin', ?, 'admin', 'Администратор', 'admin@example.com')
  `, [hashedPassword]);
});

module.exports = db;
