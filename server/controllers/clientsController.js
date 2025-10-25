const db = require('../config/database');

exports.getAllClients = (req, res) => {
  db.all('SELECT * FROM clients ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};

exports.getClientById = (req, res) => {
  db.get('SELECT * FROM clients WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Клиент не найден' });
    }
    res.json(row);
  });
};

exports.createClient = (req, res) => {
  const { full_name, phone, email, date_of_birth, gender, address, emergency_contact, notes, status } = req.body;

  db.run(
    `INSERT INTO clients (full_name, phone, email, date_of_birth, gender, address, emergency_contact, notes, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [full_name, phone, email, date_of_birth, gender, address, emergency_contact, notes, status || 'active'],
    function(err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID, message: 'Клиент создан' });
    }
  );
};

exports.updateClient = (req, res) => {
  const { full_name, phone, email, date_of_birth, gender, address, emergency_contact, notes, status } = req.body;

  db.run(
    `UPDATE clients SET full_name = ?, phone = ?, email = ?, date_of_birth = ?, gender = ?,
     address = ?, emergency_contact = ?, notes = ?, status = ? WHERE id = ?`,
    [full_name, phone, email, date_of_birth, gender, address, emergency_contact, notes, status, req.params.id],
    function(err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Клиент не найден' });
      }
      res.json({ message: 'Клиент обновлен' });
    }
  );
};

exports.deleteClient = (req, res) => {
  db.run('DELETE FROM clients WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Клиент не найден' });
    }
    res.json({ message: 'Клиент удален' });
  });
};

exports.getClientSessions = (req, res) => {
  db.all(
    `SELECT s.*, p.full_name as psychologist_name
     FROM sessions s
     JOIN psychologists p ON s.psychologist_id = p.id
     WHERE s.client_id = ?
     ORDER BY s.session_date DESC`,
    [req.params.id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
};
