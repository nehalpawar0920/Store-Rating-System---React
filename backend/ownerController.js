import { Store, Rating, User } from '../models/index.js';

export const getOwnerDashboard = async (req, res) => {
  const ownerId = req.user.userId;

  try {
    const store = await Store.findOne({ where: { ownerId } });
    if (!store)
      return res.status(404).json({ message: 'Store not found for this owner' });

    const ratings = await Rating.findAll({
      where: { storeId: store.id },
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
      order: [['createdAt', 'DESC']],
    });

    const avgRating =
      ratings.length > 0
        ? ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length
        : null;

    res.json({
      storeId: store.id,
      storeName: store.name,
      averageRating: avgRating ? Number(avgRating.toFixed(2)) : null,
      ratings: ratings.map((r) => ({
        id: r.id,
        rating: r.rating,
        createdAt: r.createdAt,
        user: r.User,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load dashboard' });
  }
};
