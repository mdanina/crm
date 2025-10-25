const db = require('../config/database');

exports.getAllPsychologists = (req, res) => {
  db.all('SELECT * FROM psychologists ORDER BY full_name', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};

exports.getPsychologistById = (req, res) => {
  db.get('SELECT * FROM psychologists WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Психолог не найден' });
    }
    res.json(row);
  });
};

exports.createPsychologist = (req, res) => {
  const { full_name, specialization, phone, email, education, experience_years, rate_per_hour, status, photo_url, bio } = req.body;

  db.run(
    `INSERT INTO psychologists (full_name, specialization, phone, email, education, experience_years, rate_per_hour, status, photo_url, bio)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [full_name, specialization, phone, email, education, experience_years, rate_per_hour, status || 'active', photo_url, bio],
    function(err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID, message: 'Психолог добавлен' });
    }
  );
};

exports.updatePsychologist = (req, res) => {
  const { full_name, specialization, phone, email, education, experience_years, rate_per_hour, status, photo_url, bio } = req.body;

  db.run(
    `UPDATE psychologists SET full_name = ?, specialization = ?, phone = ?, email = ?, education = ?,
     experience_years = ?, rate_per_hour = ?, status = ?, photo_url = ?, bio = ? WHERE id = ?`,
    [full_name, specialization, phone, email, education, experience_years, rate_per_hour, status, photo_url, bio, req.params.id],
    function(err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Психолог не найден' });
      }
      res.json({ message: 'Психолог обновлен' });
    }
  );
};

exports.deletePsychologist = (req, res) => {
  db.run('DELETE FROM psychologists WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Психолог не найден' });
    }
    res.json({ message: 'Психолог удален' });
  });
};
