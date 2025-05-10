const { Sequelize } = require('sequelize');
const UserModel = require('./model/User');
const BlogModel = require('./model/Blog');
const LikeCommentModel = require('./model/LikeComment');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT
});

const User  = UserModel(sequelize)
const Blog = BlogModel(sequelize)
const LikeComment = LikeCommentModel(sequelize)

// Add these two lines to define the User-Blog relationship
User.hasMany(Blog, { foreignKey: 'userId', as: 'blogs' });
Blog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Blog.hasMany(LikeComment);
LikeComment.belongsTo(Blog);
User.hasMany(LikeComment);
LikeComment.belongsTo(User);

module.exports = {
    sequelize,
    User,
    Blog,
    LikeComment
}