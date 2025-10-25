const db = require('../config/database');

exports.getAllAppointments = (req, res) => {
  db.all(
    `SELECT a.*, c.full_name as client_name, p.full_name as psychologist_name
     FROM appointments a
     JOIN clients c ON a.client_id = c.id
     JOIN psychologists p ON a.psychologist_id = p.id
     ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
};

exports.getAppointmentById = (req, res) => {
  db.get(
    `SELECT a.*, c.full_name as client_name, p.full_name as psychologist_name
     FROM appointments a
     JOIN clients c ON a.client_id = c.id
     JOIN psychologists p ON a.psychologist_id = p.id
     WHERE a.id = ?`,
    [req.params.id],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!row) {
        return res.status(404).json({ error: 'Запись не найдена' });
      }
      res.json(row);
    }
  );
};

exports.createAppointment = (req, res) => {
  const { client_id, psychologist_id, appointment_date, appointment_time, duration, status, notes } = req.body;

  db.run(
    `INSERT INTO appointments (client_id, psychologist_id, appointment_date, appointment_time, duration, status, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [client_id, psychologist_id, appointment_date, appointment_time, duration || 60, status || 'scheduled', notes],
    function(err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID, message: 'Запись создана' });
    }
  );
};

exports.updateAppointment = (req, res) => {
  const { client_id, psychologist_id, appointment_date, appointment_time, duration, status, notes } = req.body;

  db.run(
    `UPDATE appointments SET client_id = ?, psychologist_id = ?, appointment_date = ?, appointment_time = ?,
     duration = ?, status = ?, notes = ? WHERE id = ?`,
    [client_id, psychologist_id, appointment_date, appointment_time, duration, status, notes, req.params.id],
    function(err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Запись не найдена' });
      }
      res.json({ message: 'Запись обновлена' });
    }
  );
};

exports.deleteAppointment = (req, res) => {
  db.run('DELETE FROM appointments WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Запись не найдена' });
    }
    res.json({ message: 'Запись удалена' });
  });
};

exports.getAppointmentsByDate = (req, res) => {
  db.all(
    `SELECT a.*, c.full_name as client_name, p.full_name as psychologist_name
     FROM appointments a
     JOIN clients c ON a.client_id = c.id
     JOIN psychologists p ON a.psychologist_id = p.id
     WHERE a.appointment_date = ?
     ORDER BY a.appointment_time`,
    [req.params.date],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
};
