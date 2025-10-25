require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');

// Инициализация БД
require('./config/database');

// Импорт маршрутов
const authRoutes = require('./routes/auth');
const clientsRoutes = require('./routes/clients');
const psychologistsRoutes = require('./routes/psychologists');
const appointmentsRoutes = require('./routes/appointments');
const sessionsRoutes = require('./routes/sessions');
const paymentsRoutes = require('./routes/payments');
const dashboardRoutes = require('./routes/dashboard');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Маршруты API
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/psychologists', psychologistsRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/sessions', sessionsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Обслуживание статических файлов React в production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
} else {
  // Базовый маршрут для разработки
  app.get('/', (req, res) => {
    res.json({ message: 'CRM система для психологического центра - API сервер запущен' });
  });
}

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Что-то пошло не так!' });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
