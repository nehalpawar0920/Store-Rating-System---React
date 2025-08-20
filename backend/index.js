import sequelize from '../config/db.js';
import User from './user.js';
import Store from './store.js';
import Rating from './rating.js';


User.hasMany(Store, { foreignKey: 'ownerId' });
Store.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });

Store.hasMany(Rating, { foreignKey: 'storeId' });
Rating.belongsTo(Store, { foreignKey: 'storeId' });

User.hasMany(Rating, { foreignKey: 'userId' });
Rating.belongsTo(User, { foreignKey: 'userId' }); 

const syncDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected...');
    await sequelize.sync({ alter: true }); 
    console.log('Models synced...');
  } catch (err) {
    console.error('DB Error:', err);
  }
};

export { sequelize, User, Store, Rating, syncDB };
