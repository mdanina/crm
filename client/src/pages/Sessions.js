import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [clients, setClients] = useState([]);
  const [psychologists, setPsychologists] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [formData, setFormData] = useState({
    appointment_id: '',
    client_id: '',
    psychologist_id: '',
    session_date: '',
    duration: 60,
    notes: '',
    diagnosis: '',
    recommendations: '',
    next_session_planned: ''
  });

  useEffect(() => {
    fetchSessions();
    fetchClients();
    fetchPsychologists();
    fetchAppointments();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await axios.get('/sessions');
      setSessions(response.data);
    } catch (error) {
      console.error('Ошибка загрузки сеансов:', error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get('/clients');
      setClients(response.data);
    } catch (error) {
      console.error('Ошибка загрузки клиентов:', error);
    }
  };

  const fetchPsychologists = async () => {
    try {
      const response = await axios.get('/psychologists');
      setPsychologists(response.data);
    } catch (error) {
      console.error('Ошибка загрузки психологов:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('/appointments');
      setAppointments(response.data);
    } catch (error) {
      console.error('Ошибка загрузки записей:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSession) {
        await axios.put(`/sessions/${editingSession.id}`, formData);
      } else {
        await axios.post('/sessions', formData);
      }
      fetchSessions();
      closeModal();
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert('Ошибка сохранения сеанса');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот сеанс?')) {
      try {
        await axios.delete(`/sessions/${id}`);
        fetchSessions();
      } catch (error) {
        console.error('Ошибка удаления:', error);
        alert('Ошибка удаления сеанса');
      }
    }
  };

  const openModal = (session = null) => {
    if (session) {
      setEditingSession(session);
      setFormData({
        appointment_id: session.appointment_id || '',
        client_id: session.client_id,
        psychologist_id: session.psychologist_id,
        session_date: session.session_date,
        duration: session.duration,
        notes: session.notes || '',
        diagnosis: session.diagnosis || '',
        recommendations: session.recommendations || '',
        next_session_planned: session.next_session_planned || ''
      });
    } else {
      setEditingSession(null);
      setFormData({
        appointment_id: '',
        client_id: '',
        psychologist_id: '',
        session_date: '',
        duration: 60,
        notes: '',
        diagnosis: '',
        recommendations: '',
        next_session_planned: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSession(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Сеансы</h1>
        <button onClick={() => openModal()} className="btn btn-primary">
          Добавить сеанс
        </button>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Дата</th>
              <th>Клиент</th>
              <th>Психолог</th>
              <th>Длительность</th>
              <th>Диагноз</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr key={session.id}>
                <td>{new Date(session.session_date).toLocaleDateString('ru-RU')}</td>
                <td>{session.client_name}</td>
                <td>{session.psychologist_name}</td>
                <td>{session.duration} мин</td>
                <td>{session.diagnosis || '-'}</td>
                <td>
                  <button onClick={() => openModal(session)} className="btn btn-primary" style={{ marginRight: '5px' }}>
                    Редактировать
                  </button>
                  <button onClick={() => handleDelete(session.id)} className="btn btn-danger">
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingSession ? 'Редактировать сеанс' : 'Добавить сеанс'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Запись</label>
                <select name="appointment_id" value={formData.appointment_id} onChange={handleChange}>
                  <option value="">Выберите запись (необязательно)</option>
                  {appointments.map((appointment) => (
                    <option key={appointment.id} value={appointment.id}>
                      {appointment.client_name} - {appointment.appointment_date} {appointment.appointment_time}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Клиент *</label>
                <select name="client_id" value={formData.client_id} onChange={handleChange} required>
                  <option value="">Выберите клиента</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>{client.full_name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Психолог *</label>
                <select name="psychologist_id" value={formData.psychologist_id} onChange={handleChange} required>
                  <option value="">Выберите психолога</option>
                  {psychologists.map((psychologist) => (
                    <option key={psychologist.id} value={psychologist.id}>{psychologist.full_name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Дата сеанса *</label>
                <input type="date" name="session_date" value={formData.session_date} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Длительность (минут)</label>
                <input type="number" name="duration" value={formData.duration} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Заметки</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange}></textarea>
              </div>
              <div className="form-group">
                <label>Диагноз</label>
                <textarea name="diagnosis" value={formData.diagnosis} onChange={handleChange}></textarea>
              </div>
              <div className="form-group">
                <label>Рекомендации</label>
                <textarea name="recommendations" value={formData.recommendations} onChange={handleChange}></textarea>
              </div>
              <div className="form-group">
                <label>Следующий сеанс запланирован на</label>
                <input type="date" name="next_session_planned" value={formData.next_session_planned} onChange={handleChange} />
              </div>
              <div className="modal-buttons">
                <button type="button" onClick={closeModal} className="btn btn-secondary">
                  Отмена
                </button>
                <button type="submit" className="btn btn-primary">
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sessions;
