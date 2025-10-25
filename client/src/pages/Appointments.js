import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [clients, setClients] = useState([]);
  const [psychologists, setPsychologists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [formData, setFormData] = useState({
    client_id: '',
    psychologist_id: '',
    appointment_date: '',
    appointment_time: '',
    duration: 60,
    status: 'scheduled',
    notes: ''
  });

  useEffect(() => {
    fetchAppointments();
    fetchClients();
    fetchPsychologists();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('/appointments');
      setAppointments(response.data);
    } catch (error) {
      console.error('Ошибка загрузки записей:', error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAppointment) {
        await axios.put(`/appointments/${editingAppointment.id}`, formData);
      } else {
        await axios.post('/appointments', formData);
      }
      fetchAppointments();
      closeModal();
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert('Ошибка сохранения записи');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту запись?')) {
      try {
        await axios.delete(`/appointments/${id}`);
        fetchAppointments();
      } catch (error) {
        console.error('Ошибка удаления:', error);
        alert('Ошибка удаления записи');
      }
    }
  };

  const openModal = (appointment = null) => {
    if (appointment) {
      setEditingAppointment(appointment);
      setFormData({
        client_id: appointment.client_id,
        psychologist_id: appointment.psychologist_id,
        appointment_date: appointment.appointment_date,
        appointment_time: appointment.appointment_time,
        duration: appointment.duration,
        status: appointment.status,
        notes: appointment.notes || ''
      });
    } else {
      setEditingAppointment(null);
      setFormData({
        client_id: '',
        psychologist_id: '',
        appointment_date: '',
        appointment_time: '',
        duration: 60,
        status: 'scheduled',
        notes: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAppointment(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return '#007bff';
      case 'completed': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Записи на прием</h1>
        <button onClick={() => openModal()} className="btn btn-primary">
          Добавить запись
        </button>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Дата</th>
              <th>Время</th>
              <th>Клиент</th>
              <th>Психолог</th>
              <th>Длительность</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>{new Date(appointment.appointment_date).toLocaleDateString('ru-RU')}</td>
                <td>{appointment.appointment_time}</td>
                <td>{appointment.client_name}</td>
                <td>{appointment.psychologist_name}</td>
                <td>{appointment.duration} мин</td>
                <td>
                  <span style={{ color: getStatusColor(appointment.status), fontWeight: 'bold' }}>
                    {appointment.status}
                  </span>
                </td>
                <td>
                  <button onClick={() => openModal(appointment)} className="btn btn-primary" style={{ marginRight: '5px' }}>
                    Редактировать
                  </button>
                  <button onClick={() => handleDelete(appointment.id)} className="btn btn-danger">
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
            <h2>{editingAppointment ? 'Редактировать запись' : 'Добавить запись'}</h2>
            <form onSubmit={handleSubmit}>
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
                <label>Дата *</label>
                <input type="date" name="appointment_date" value={formData.appointment_date} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Время *</label>
                <input type="time" name="appointment_time" value={formData.appointment_time} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Длительность (минут)</label>
                <input type="number" name="duration" value={formData.duration} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Статус</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="scheduled">Запланирована</option>
                  <option value="completed">Завершена</option>
                  <option value="cancelled">Отменена</option>
                </select>
              </div>
              <div className="form-group">
                <label>Заметки</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange}></textarea>
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

export default Appointments;
