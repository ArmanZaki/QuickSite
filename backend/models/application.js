module.exports = (sequelize, DataTypes) => {
  const Application = sequelize.define(
    'Application',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      studentId: { type: DataTypes.INTEGER, allowNull: false },
      jobId: { type: DataTypes.INTEGER, allowNull: false },
      status: { type: DataTypes.ENUM('applied', 'accepted', 'rejected', 'completed'), defaultValue: 'applied' },
    },
    {
      tableName: 'applications',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
      underscored: true,
    }
  );

  return Application;
};
