module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define(
    'Review',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      reviewerId: { type: DataTypes.INTEGER, allowNull: false },
      revieweeId: { type: DataTypes.INTEGER, allowNull: false },
      rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
      comment: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      tableName: 'reviews',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
      underscored: true,
    }
  );

  return Review;
};
