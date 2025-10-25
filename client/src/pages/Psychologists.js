import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const Psychologists = () => {
  const [psychologists, setPsychologists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPsychologist, setEditingPsychologist] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    specialization: '',
    phone: '',
    email: '',
    education: '',
    experience_years: '',
    rate_per_hour: '',
    status: 'active',
    photo_url: '',
    bio: ''
  });

  useEffect(() => {
    fetchPsychologists();
  }, []);

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
      if (editingPsychologist) {
        await axios.put(`/psychologists/${editingPsychologist.id}`, formData);
      } else {
        await axios.post('/psychologists', formData);
      }
      fetchPsychologists();
      closeModal();
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert('Ошибка сохранения психолога');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этого психолога?')) {
      try {
        await axios.delete(`/psychologists/${id}`);
        fetchPsychologists();
      } catch (error) {
        console.error('Ошибка удаления:', error);
        alert('Ошибка удаления психолога');
      }
    }
  };

  const openModal = (psychologist = null) => {
    if (psychologist) {
      setEditingPsychologist(psychologist);
      setFormData(psychologist);
    } else {
      setEditingPsychologist(null);
      setFormData({
        full_name: '',
        specialization: '',
        phone: '',
        email: '',
        education: '',
        experience_years: '',
        rate_per_hour: '',
        status: 'active',
        photo_url: '',
        bio: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPsychologist(null);
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
        <h1>Психологи</h1>
        <button onClick={() => openModal()} className="btn btn-primary">
          Добавить психолога
        </button>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>ФИО</th>
              <th>Специализация</th>
              <th>Телефон</th>
              <th>Email</th>
              <th>Опыт (лет)</th>
              <th>Ставка/час</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {psychologists.map((psychologist) => (
              <tr key={psychologist.id}>
                <td>{psychologist.full_name}</td>
                <td>{psychologist.specialization}</td>
                <td>{psychologist.phone}</td>
                <td>{psychologist.email}</td>
                <td>{psychologist.experience_years}</td>
                <td>{psychologist.rate_per_hour} ₽</td>
                <td>{psychologist.status}</td>
                <td>
                  <button onClick={() => openModal(psychologist)} className="btn btn-primary" style={{ marginRight: '5px' }}>
                    Редактировать
                  </button>
                  <button onClick={() => handleDelete(psychologist.id)} className="btn btn-danger">
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
            <h2>{editingPsychologist ? 'Редактировать психолога' : 'Добавить психолога'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>ФИО *</label>
                <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Специализация</label>
                <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Телефон</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Образование</label>
                <textarea name="education" value={formData.education} onChange={handleChange}></textarea>
              </div>
              <div className="form-group">
                <label>Опыт работы (лет)</label>
                <input type="number" name="experience_years" value={formData.experience_years} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Ставка за час (₽)</label>
                <input type="number" name="rate_per_hour" value={formData.rate_per_hour} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Биография</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange}></textarea>
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

export default Psychologists;
