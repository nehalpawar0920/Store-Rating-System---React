import { User, Store, Rating } from '../models/index.js';
import { Op } from 'sequelize';

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();

    res.json({
      totalUsers,
      totalStores,
      totalRatings,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
};

export const getAllUsers = async (req, res) => {
  const {
    search = '',
    role,
    sortBy = 'name',
    order = 'asc'
  } = req.query;

  try {
    const where = {
      [Op.or]: [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { address: { [Op.iLike]: `%${search}%` } }
      ]
    };

    if (role) where.role = role;

    const users = await User.findAll({
      where,
      order: [[sortBy, order]],
      attributes: ['id', 'name', 'email', 'address', 'role']
    });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

export const getAllStores = async (req, res) => {
  const {
    search = '',
    sortBy = 'name',
    order = 'asc'
  } = req.query;

  try {
    const stores = await Store.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
          { address: { [Op.iLike]: `%${search}%` } }
        ]
      },
      order: [[sortBy, order]],
      attributes: ['id', 'name', 'email', 'address']
    });

    res.json(stores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch stores' });
  }
};

export const getUserDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, {
      attributes: ['id', 'name', 'email', 'address', 'role'],
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    let storeDetails = null;

    // If user is a store owner, fetch their store + avg rating
    if (user.role === 'owner') {
      const store = await Store.findOne({ where: { ownerId: user.id } });
      if (store) {
        const ratings = await Rating.findAll({ where: { storeId: store.id } });
        const avgRating =
          ratings.reduce((sum, r) => sum + r.rating, 0) / (ratings.length || 1);

        storeDetails = {
          id: store.id,
          name: store.name,
          address: store.address,
          averageRating: Number(avgRating.toFixed(2)),
        };
      }
    }

    res.json({ user, store: storeDetails });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch user details' });
  }
};
