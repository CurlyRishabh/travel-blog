const { DataTypes } = require('sequelize');

const BlogModel = (sequelize) => {
    const Blog = sequelize.define('Blog', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING, // Store URL/path to the image
            allowNull: true,
        },
        description: {
            type: DataTypes.TEXT, // Using TEXT for longer content
            allowNull: false,
        },
        tags: {
            type: DataTypes.ARRAY(DataTypes.STRING), // Array of strings for multiple tags
            defaultValue: [],
        },
        total_cost: {
            type: DataTypes.DECIMAL(10, 2), // Decimal for currency with 2 decimal places
            allowNull: true,
            validate: {
                min: 0 // Ensure cost is not negative
            }
        },
        destination: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'User',
                key: 'id'
            }
        }
    });

    return Blog;
};

module.exports = BlogModel;