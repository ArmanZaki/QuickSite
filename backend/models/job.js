module.exports = (sequelize, DataTypes) => {
  const Job = sequelize.define(
    'Job',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      budget: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      location: { type: DataTypes.STRING, allowNull: true },
      ownerId: { type: DataTypes.INTEGER, allowNull: false },
      status: { type: DataTypes.ENUM('open', 'in-progress', 'completed'), defaultValue: 'open' },
    },
    {
      tableName: 'jobs',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
      underscored: true,
    }
  );

  return Job;
};
