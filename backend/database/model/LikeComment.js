const { DataTypes } = require('sequelize');

const LikeCommentModel = (sequelize) => {
    const LikeComment = sequelize.define('LikeComment', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users', // References the User model
                key: 'id'
            }
        },
        blogId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Blogs', // References the Blog model
                key: 'id'
            }
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true // Allow null for cases where user only likes without commenting
        }
    });

    return LikeComment;
};

module.exports = LikeCommentModel;