const { DataTypes } = require('sequelize');
const UserTypes = require('../enum');

const UserModel = (sequelize) => {
    const User = sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true // Making it optional since some users might prefer using just username
        },
        profile_picture: {
            type: DataTypes.STRING, // This will store the URL/path to the profile picture
            allowNull: true, // Making it optional since not all users might have a profile picture
            defaultValue: null
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userType: {
            type: DataTypes.ENUM(Object.values(UserTypes)),
            defaultValue: UserTypes.USER,
            allowNull: false
        }
    });

    return User;
};

module.exports = UserModel;