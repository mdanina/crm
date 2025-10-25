const db = require('../config/database');

exports.getAllPayments = (req, res) => {
  db.all(
    `SELECT p.*, c.full_name as client_name
     FROM payments p
     JOIN clients c ON p.client_id = c.id
     ORDER BY p.payment_date DESC`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
};

exports.getPaymentById = (req, res) => {
  db.get(
    `SELECT p.*, c.full_name as client_name
     FROM payments p
     JOIN clients c ON p.client_id = c.id
     WHERE p.id = ?`,
    [req.params.id],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!row) {
        return res.status(404).json({ error: 'Платеж не найден' });
      }
      res.json(row);
    }
  );
};

exports.createPayment = (req, res) => {
  const { session_id, client_id, amount, payment_date, payment_method, status, notes } = req.body;

  db.run(
    `INSERT INTO payments (session_id, client_id, amount, payment_date, payment_method, status, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [session_id, client_id, amount, payment_date, payment_method, status || 'completed', notes],
    function(err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID, message: 'Платеж создан' });
    }
  );
};

exports.updatePayment = (req, res) => {
  const { session_id, client_id, amount, payment_date, payment_method, status, notes } = req.body;

  db.run(
    `UPDATE payments SET session_id = ?, client_id = ?, amount = ?, payment_date = ?,
     payment_method = ?, status = ?, notes = ? WHERE id = ?`,
    [session_id, client_id, amount, payment_date, payment_method, status, notes, req.params.id],
    function(err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Платеж не найден' });
      }
      res.json({ message: 'Платеж обновлен' });
    }
  );
};

exports.deletePayment = (req, res) => {
  db.run('DELETE FROM payments WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Платеж не найден' });
    }
    res.json({ message: 'Платеж удален' });
  });
};

exports.getPaymentsByClient = (req, res) => {
  db.all(
    'SELECT * FROM payments WHERE client_id = ? ORDER BY payment_date DESC',
    [req.params.clientId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
};
