const db = require('../config/database');

exports.getAllSessions = (req, res) => {
  db.all(
    `SELECT s.*, c.full_name as client_name, p.full_name as psychologist_name
     FROM sessions s
     JOIN clients c ON s.client_id = c.id
     JOIN psychologists p ON s.psychologist_id = p.id
     ORDER BY s.session_date DESC`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
};

exports.getSessionById = (req, res) => {
  db.get(
    `SELECT s.*, c.full_name as client_name, p.full_name as psychologist_name
     FROM sessions s
     JOIN clients c ON s.client_id = c.id
     JOIN psychologists p ON s.psychologist_id = p.id
     WHERE s.id = ?`,
    [req.params.id],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!row) {
        return res.status(404).json({ error: 'Сеанс не найден' });
      }
      res.json(row);
    }
  );
};

exports.createSession = (req, res) => {
  const { appointment_id, client_id, psychologist_id, session_date, duration, notes, diagnosis, recommendations, next_session_planned } = req.body;

  db.run(
    `INSERT INTO sessions (appointment_id, client_id, psychologist_id, session_date, duration, notes, diagnosis, recommendations, next_session_planned)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [appointment_id, client_id, psychologist_id, session_date, duration, notes, diagnosis, recommendations, next_session_planned],
    function(err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID, message: 'Сеанс создан' });
    }
  );
};

exports.updateSession = (req, res) => {
  const { appointment_id, client_id, psychologist_id, session_date, duration, notes, diagnosis, recommendations, next_session_planned } = req.body;

  db.run(
    `UPDATE sessions SET appointment_id = ?, client_id = ?, psychologist_id = ?, session_date = ?,
     duration = ?, notes = ?, diagnosis = ?, recommendations = ?, next_session_planned = ? WHERE id = ?`,
    [appointment_id, client_id, psychologist_id, session_date, duration, notes, diagnosis, recommendations, next_session_planned, req.params.id],
    function(err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Сеанс не найден' });
      }
      res.json({ message: 'Сеанс обновлен' });
    }
  );
};

exports.deleteSession = (req, res) => {
  db.run('DELETE FROM sessions WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Сеанс не найден' });
    }
    res.json({ message: 'Сеанс удален' });
  });
};
