const express = require('express');
const cors = require('cors');
const { sequelize } = require('./database');
const { router: authRouter } = require('./routes/auth');
const { router: blogRouter } = require('./routes/blog');
const { router: likeCommentRouter } = require('./routes/likeComment');
const path = require('path');
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Auth routes
app.use('/auth', authRouter);
app.use('/blog', blogRouter);
app.use('/likeComment', likeCommentRouter);

// Sync database
sequelize.sync({ alter: true })
    .then(() => console.log('Database synced'))
    .catch(err => console.error('Error syncing database:', err));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});