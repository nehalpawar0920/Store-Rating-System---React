import { useEffect, useState } from 'react';
import axios from 'axios';

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [userRatings, setUserRatings] = useState({});
  const token = localStorage.getItem('token');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchStores = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/user/stores', config);
      setStores(res.data.stores);
      setUserRatings(res.data.userRatings || {});
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const handleRating = async (storeId, rating) => {
    try {
      await axios.post(
        `http://localhost:5001/api/ratings/${storeId}`,
        { rating },
        config
      );
      fetchStores(); 
    } catch (err) {
      console.error('Rating error:', err);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const filteredStores = stores.filter((store) =>
    `${store.name} ${store.address}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">User Dashboard</h2>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/';
          }}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <input
        type="text"
        placeholder="Search stores by name or address"
        className="mb-6 w-full p-3 rounded border border-gray-300"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredStores.map((store) => (
          <div
            key={store.id}
            className="bg-white rounded shadow p-4 flex flex-col justify-between"
          >
            <h3 className="text-lg font-bold mb-1">{store.name}</h3>
            <p className="text-gray-600 mb-2">{store.address}</p>
            <p className="text-sm text-gray-500 mb-2">
              Overall Rating: {store.averageRating?.toFixed(2) || 'N/A'}
            </p>

            <div className="flex items-center gap-2">
              <select
                value={userRatings[store.id] || ''}
                onChange={(e) => handleRating(store.id, parseInt(e.target.value))}
                className="border px-2 py-1 rounded"
              >
                <option value="">Rate</option>
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              {userRatings[store.id] && (
                <span className="text-green-600 text-sm">You rated: {userRatings[store.id]}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;
