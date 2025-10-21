const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const basename = path.basename(__filename);

function createSequelizeInstance() {
  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl && databaseUrl.length > 0) {
    return new Sequelize(databaseUrl, {
      dialect: 'postgres',
      logging: false,
    });
  }
  return new Sequelize(
    process.env.DB_NAME || 'quicksite_dev',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASS || 'postgres',
    {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5432),
      dialect: 'postgres',
      logging: false,
    }
  );
}

const sequelize = createSequelizeInstance();

const db = {};

// Import models explicitly for clarity and tree-shaking friendliness
const User = require('./user')(sequelize, DataTypes);
const Job = require('./job')(sequelize, DataTypes);
const Application = require('./application')(sequelize, DataTypes);
const Message = require('./message')(sequelize, DataTypes);
const Review = require('./review')(sequelize, DataTypes);

// Associations
User.hasMany(Job, { foreignKey: 'ownerId', as: 'jobs', onDelete: 'CASCADE' });
Job.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

User.belongsToMany(Job, { through: Application, as: 'appliedJobs', foreignKey: 'studentId', otherKey: 'jobId' });
Job.belongsToMany(User, { through: Application, as: 'applicants', foreignKey: 'jobId', otherKey: 'studentId' });
Application.belongsTo(User, { foreignKey: 'studentId', as: 'student' });
Application.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });
User.hasMany(Application, { foreignKey: 'studentId', as: 'applications', onDelete: 'CASCADE' });
Job.hasMany(Application, { foreignKey: 'jobId', as: 'applications', onDelete: 'CASCADE' });

Message.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });
Message.belongsTo(User, { as: 'receiver', foreignKey: 'receiverId' });
User.hasMany(Message, { as: 'sentMessages', foreignKey: 'senderId', onDelete: 'CASCADE' });
User.hasMany(Message, { as: 'receivedMessages', foreignKey: 'receiverId', onDelete: 'CASCADE' });

Review.belongsTo(User, { as: 'reviewer', foreignKey: 'reviewerId' });
Review.belongsTo(User, { as: 'reviewee', foreignKey: 'revieweeId' });
User.hasMany(Review, { as: 'reviewsGiven', foreignKey: 'reviewerId', onDelete: 'CASCADE' });
User.hasMany(Review, { as: 'reviewsReceived', foreignKey: 'revieweeId', onDelete: 'CASCADE' });

// Expose models on db
Object.assign(db, { User, Job, Application, Message, Review, sequelize, Sequelize });

module.exports = db;
