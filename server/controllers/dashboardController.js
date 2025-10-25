const db = require('../config/database');

exports.getStatistics = (req, res) => {
  const stats = {};

  // Получаем количество клиентов
  db.get('SELECT COUNT(*) as count FROM clients WHERE status = "active"', [], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    stats.activeClients = row.count;

    // Получаем количество психологов
    db.get('SELECT COUNT(*) as count FROM psychologists WHERE status = "active"', [], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      stats.activePsychologists = row.count;

      // Получаем количество предстоящих записей
      db.get('SELECT COUNT(*) as count FROM appointments WHERE status = "scheduled"', [], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        stats.scheduledAppointments = row.count;

        // Получаем сумму платежей за текущий месяц
        db.get(
          `SELECT SUM(amount) as total FROM payments
           WHERE strftime('%Y-%m', payment_date) = strftime('%Y-%m', 'now')`,
          [],
          (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            stats.monthlyRevenue = row.total || 0;

            // Получаем количество сеансов за текущий месяц
            db.get(
              `SELECT COUNT(*) as count FROM sessions
               WHERE strftime('%Y-%m', session_date) = strftime('%Y-%m', 'now')`,
              [],
              (err, row) => {
                if (err) return res.status(500).json({ error: err.message });
                stats.monthlySessions = row.count;

                res.json(stats);
              }
            );
          }
        );
      });
    });
  });
};

exports.getRecentAppointments = (req, res) => {
  db.all(
    `SELECT a.*, c.full_name as client_name, p.full_name as psychologist_name
     FROM appointments a
     JOIN clients c ON a.client_id = c.id
     JOIN psychologists p ON a.psychologist_id = p.id
     WHERE a.appointment_date >= date('now')
     ORDER BY a.appointment_date, a.appointment_time
     LIMIT 10`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
};

exports.getRevenueByMonth = (req, res) => {
  db.all(
    `SELECT strftime('%Y-%m', payment_date) as month, SUM(amount) as revenue
     FROM payments
     GROUP BY month
     ORDER BY month DESC
     LIMIT 12`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
};
