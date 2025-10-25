import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [clients, setClients] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [formData, setFormData] = useState({
    session_id: '',
    client_id: '',
    amount: '',
    payment_date: '',
    payment_method: '',
    status: 'completed',
    notes: ''
  });

  useEffect(() => {
    fetchPayments();
    fetchClients();
    fetchSessions();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get('/payments');
      setPayments(response.data);
    } catch (error) {
      console.error('Ошибка загрузки платежей:', error);
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

  const fetchSessions = async () => {
    try {
      const response = await axios.get('/sessions');
      setSessions(response.data);
    } catch (error) {
      console.error('Ошибка загрузки сеансов:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPayment) {
        await axios.put(`/payments/${editingPayment.id}`, formData);
      } else {
        await axios.post('/payments', formData);
      }
      fetchPayments();
      closeModal();
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert('Ошибка сохранения платежа');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот платеж?')) {
      try {
        await axios.delete(`/payments/${id}`);
        fetchPayments();
      } catch (error) {
        console.error('Ошибка удаления:', error);
        alert('Ошибка удаления платежа');
      }
    }
  };

  const openModal = (payment = null) => {
    if (payment) {
      setEditingPayment(payment);
      setFormData({
        session_id: payment.session_id || '',
        client_id: payment.client_id,
        amount: payment.amount,
        payment_date: payment.payment_date,
        payment_method: payment.payment_method || '',
        status: payment.status,
        notes: payment.notes || ''
      });
    } else {
      setEditingPayment(null);
      setFormData({
        session_id: '',
        client_id: '',
        amount: '',
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: '',
        status: 'completed',
        notes: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPayment(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getTotalAmount = () => {
    return payments.reduce((total, payment) => total + payment.amount, 0).toFixed(2);
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Платежи</h1>
        <div>
          <span style={{ marginRight: '20px', fontSize: '18px', fontWeight: 'bold' }}>
            Всего: {getTotalAmount()} ₽
          </span>
          <button onClick={() => openModal()} className="btn btn-primary">
            Добавить платеж
          </button>
        </div>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Дата</th>
              <th>Клиент</th>
              <th>Сумма</th>
              <th>Способ оплаты</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{new Date(payment.payment_date).toLocaleDateString('ru-RU')}</td>
                <td>{payment.client_name}</td>
                <td>{payment.amount.toFixed(2)} ₽</td>
                <td>{payment.payment_method || '-'}</td>
                <td>{payment.status}</td>
                <td>
                  <button onClick={() => openModal(payment)} className="btn btn-primary" style={{ marginRight: '5px' }}>
                    Редактировать
                  </button>
                  <button onClick={() => handleDelete(payment.id)} className="btn btn-danger">
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
            <h2>{editingPayment ? 'Редактировать платеж' : 'Добавить платеж'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Сеанс</label>
                <select name="session_id" value={formData.session_id} onChange={handleChange}>
                  <option value="">Выберите сеанс (необязательно)</option>
                  {sessions.map((session) => (
                    <option key={session.id} value={session.id}>
                      {session.client_name} - {new Date(session.session_date).toLocaleDateString('ru-RU')}
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
                <label>Сумма (₽) *</label>
                <input type="number" step="0.01" name="amount" value={formData.amount} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Дата платежа *</label>
                <input type="date" name="payment_date" value={formData.payment_date} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Способ оплаты</label>
                <select name="payment_method" value={formData.payment_method} onChange={handleChange}>
                  <option value="">Выберите способ</option>
                  <option value="cash">Наличные</option>
                  <option value="card">Карта</option>
                  <option value="transfer">Перевод</option>
                </select>
              </div>
              <div className="form-group">
                <label>Статус</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="completed">Завершен</option>
                  <option value="pending">В ожидании</option>
                  <option value="cancelled">Отменен</option>
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

export default Payments;
