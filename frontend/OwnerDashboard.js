import { useEffect, useState } from 'react';
import axios from 'axios';

const OwnerDashboard = () => {
  const [ratings, setRatings] = useState([]);
  const [store, setStore] = useState(null);
  const [average, setAverage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchDashboard = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/ratings', config);
      setRatings(res.data.ratings || []);
      setAverage(res.data.averageRating);
      setStore({
        id: res.data.storeId,
        name: res.data.storeName,
      });
    } catch (err) {
      if (err.response?.status === 404) {
        setStore(null); // No store yet
      } else {
        console.error('Fetch error:', err);
      }
    }
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const ownerId = JSON.parse(atob(token.split('.')[1])).userId;

      const res = await axios.post('http://localhost:5001/api/stores', {
        ...form,
        ownerId
      }, config);

      setSuccess('Store created successfully!');
      setShowForm(false);
      setForm({ name: '', email: '', address: '' });
      fetchDashboard(); // Refresh to show new store
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create store');
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Store Owner Dashboard</h2>
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

      {!store ? (
        <div className="bg-white p-6 rounded shadow mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">You don’t have a store yet</h3>

          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Create Store
            </button>
          ) : (
            <form onSubmit={handleCreateStore} className="space-y-4">
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-600 text-sm">{success}</p>}

              <input
                type="text"
                placeholder="Store Name"
                name="name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <input
                type="email"
                placeholder="Store Email"
                name="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border p-2 rounded"
              />
              <textarea
                placeholder="Store Address"
                name="address"
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full border p-2 rounded"
                rows={3}
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Submit
              </button>
            </form>
          )}
        </div>
      ) : (
        <>
          <div className="bg-white shadow p-4 rounded mb-6">
            <h3 className="text-lg font-semibold">Store: {store.name}</h3>
            <p className="text-gray-600">
              Average Rating: {average ? average.toFixed(2) : 'N/A'}
            </p>
          </div>

          <div className="bg-white shadow p-4 rounded">
            <h4 className="text-lg font-semibold mb-2">Ratings from Users</h4>
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3">User Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Rating</th>
                </tr>
              </thead>
              <tbody>
                {ratings.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center p-3 text-gray-500">
                      No ratings yet.
                    </td>
                  </tr>
                ) : (
                  ratings.map((entry) => (
                    <tr key={entry.id} className="border-b">
                      <td className="p-3">{entry.user.name}</td>
                      <td className="p-3">{entry.user.email}</td>
                      <td className="p-3">{entry.rating}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default OwnerDashboard;
