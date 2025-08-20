import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddStore = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: '',
  });

  const [owners, setOwners] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchOwners = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/admin/owners', config);
      setOwners(res.data.owners);
    } catch (err) {
      console.error('Error fetching owners:', err);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/admin/stores', form, config);
      setMessage('Store added successfully!');
      setForm({ name: '', email: '', address: '', ownerId: '' });
      setTimeout(() => navigate('/admin-dashboard'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error adding store');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Add New Store</h2>

        {message && (
          <p className="text-sm mb-4 text-center text-gray-700">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Store Name"
            className="w-full border p-2 rounded"
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="Store Email"
            className="w-full border p-2 rounded"
          />

          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            required
            placeholder="Store Address"
            className="w-full border p-2 rounded"
          />

          <select
            name="ownerId"
            value={form.ownerId}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">Select Store Owner</option>
            {owners.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {owner.name} - {owner.email}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Add Store
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStore;
