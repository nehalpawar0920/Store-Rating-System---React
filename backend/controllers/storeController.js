import { Store, User, Rating } from '../models/index.js';
import { Op } from 'sequelize';

export const createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    const owner = await User.findByPk(ownerId);
    if (!owner || owner.role !== 'owner') {
      return res.status(400).json({ message: 'Owner ID is invalid or not a store owner' });
    }

    const store = await Store.create({ name, email, address, ownerId });
    res.status(201).json(store);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create store' });
  }
};

export const getAllStores = async (req, res) => {
  const search = req.query.search || '';
  const userId = req.user?.userId;

  try {
    const stores = await Store.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { address: { [Op.iLike]: `%${search}%` } }
        ]
      },
      include: [
        {
          model: Rating,
          attributes: ['rating', 'userId']
        }
      ]
    });

    const enrichedStores = stores.map(store => {
      const ratings = store.Ratings;
      const total = ratings.reduce((sum, r) => sum + r.rating, 0);
      const avg = ratings.length ? (total / ratings.length).toFixed(2) : null;

      const userRating = ratings.find(r => r.userId === userId)?.rating || null;

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating: avg,
        userRating
      };
    });

    res.json(enrichedStores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch stores' });
  }
};


