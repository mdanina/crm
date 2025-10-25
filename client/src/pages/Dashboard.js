import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, appointmentsRes] = await Promise.all([
        axios.get('/dashboard/statistics'),
        axios.get('/dashboard/recent-appointments')
      ]);

      setStats(statsRes.data);
      setRecentAppointments(appointmentsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container">Загрузка...</div>;
  }

  return (
    <div className="container">
      <h1>Панель управления</h1>

      <div className="stats-grid">
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <h3>Активные клиенты</h3>
          <div className="value">{stats.activeClients || 0}</div>
        </div>

        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
          <h3>Активные психологи</h3>
          <div className="value">{stats.activePsychologists || 0}</div>
        </div>

        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
          <h3>Запланированные записи</h3>
          <div className="value">{stats.scheduledAppointments || 0}</div>
        </div>

        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
          <h3>Доход за месяц</h3>
          <div className="value">{stats.monthlyRevenue?.toFixed(2) || '0.00'} ₽</div>
        </div>

        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
          <h3>Сеансов за месяц</h3>
          <div className="value">{stats.monthlySessions || 0}</div>
        </div>
      </div>

      <div className="card">
        <h2>Ближайшие записи</h2>
        {recentAppointments.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Дата</th>
                <th>Время</th>
                <th>Клиент</th>
                <th>Психолог</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{new Date(appointment.appointment_date).toLocaleDateString('ru-RU')}</td>
                  <td>{appointment.appointment_time}</td>
                  <td>{appointment.client_name}</td>
                  <td>{appointment.psychologist_name}</td>
                  <td>{appointment.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Нет предстоящих записей</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
