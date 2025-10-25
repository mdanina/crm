import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    date_of_birth: '',
    gender: '',
    address: '',
    emergency_contact: '',
    notes: '',
    status: 'active'
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get('/clients');
      setClients(response.data);
    } catch (error) {
      console.error('Ошибка загрузки клиентов:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClient) {
        await axios.put(`/clients/${editingClient.id}`, formData);
      } else {
        await axios.post('/clients', formData);
      }
      fetchClients();
      closeModal();
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert('Ошибка сохранения клиента');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этого клиента?')) {
      try {
        await axios.delete(`/clients/${id}`);
        fetchClients();
      } catch (error) {
        console.error('Ошибка удаления:', error);
        alert('Ошибка удаления клиента');
      }
    }
  };

  const openModal = (client = null) => {
    if (client) {
      setEditingClient(client);
      setFormData(client);
    } else {
      setEditingClient(null);
      setFormData({
        full_name: '',
        phone: '',
        email: '',
        date_of_birth: '',
        gender: '',
        address: '',
        emergency_contact: '',
        notes: '',
        status: 'active'
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingClient(null);
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
        <h1>Клиенты</h1>
        <button onClick={() => openModal()} className="btn btn-primary">
          Добавить клиента
        </button>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>ФИО</th>
              <th>Телефон</th>
              <th>Email</th>
              <th>Дата рождения</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td>{client.full_name}</td>
                <td>{client.phone}</td>
                <td>{client.email}</td>
                <td>{client.date_of_birth ? new Date(client.date_of_birth).toLocaleDateString('ru-RU') : '-'}</td>
                <td>{client.status}</td>
                <td>
                  <button onClick={() => openModal(client)} className="btn btn-primary" style={{ marginRight: '5px' }}>
                    Редактировать
                  </button>
                  <button onClick={() => handleDelete(client.id)} className="btn btn-danger">
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
            <h2>{editingClient ? 'Редактировать клиента' : 'Добавить клиента'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>ФИО *</label>
                <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Телефон *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Дата рождения</label>
                <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Пол</label>
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="">Не указан</option>
                  <option value="male">Мужской</option>
                  <option value="female">Женский</option>
                </select>
              </div>
              <div className="form-group">
                <label>Адрес</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Экстренный контакт</label>
                <input type="text" name="emergency_contact" value={formData.emergency_contact} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Заметки</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange}></textarea>
              </div>
              <div className="form-group">
                <label>Статус</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="active">Активный</option>
                  <option value="inactive">Неактивный</option>
                </select>
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

export default Clients;
