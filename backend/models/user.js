module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      phone: { type: DataTypes.STRING, allowNull: true },
      password: { type: DataTypes.STRING, allowNull: false },
      role: { type: DataTypes.ENUM('student', 'owner', 'admin'), allowNull: false },
      college: { type: DataTypes.STRING, allowNull: true },
      shopName: { type: DataTypes.STRING, allowNull: true },
      skills: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
      location: { type: DataTypes.STRING, allowNull: true },
      isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      tableName: 'users',
      timestamps: true,
      underscored: true,
    }
  );

  return User;
};
