import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [userRes, storeRes] = await Promise.all([
        axios.get('http://localhost:5001/api/admin/users', config),
        axios.get('http://localhost:5001/api/admin/stores', config),
      ]);

      setUsers(userRes.data);
      setStores(storeRes.data.stores || storeRes.data); // handles both paginated or flat response
      setLoading(false);
    } catch (err) {
      console.error(err);
      navigate('/');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          {/* Users Table */}
          <div className="mb-10">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">All Users</h3>
            <div className="overflow-auto rounded shadow bg-white">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Address</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="p-3">{user.name}</td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3 capitalize">{user.role}</td>
                      <td className="p-3">{user.address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Stores Table */}
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">All Stores</h3>
            <div className="overflow-auto rounded shadow bg-white">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-3">Store Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Address</th>
                    <th className="p-3">Avg. Rating</th>
                    <th className="p-3">Total Ratings</th>
                    <th className="p-3">Owner</th>
                  </tr>
                </thead>
                <tbody>
                  {stores.map((store) => (
                    <tr key={store.id} className="border-b">
                      <td className="p-3">{store.name}</td>
                      <td className="p-3">{store.email}</td>
                      <td className="p-3">{store.address}</td>
                      <td className="p-3">
                        {store.averageRating ? store.averageRating : 'N/A'}
                      </td>
                      <td className="p-3">{store.ratingsCount || 0}</td>
                      <td className="p-3">
                        {store.owner
                          ? `${store.owner.name} (${store.owner.email})`
                          : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
