import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, CreditCard, CheckCircle, XCircle, Edit3, Save, X } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/students/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      updateUser(data.student);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || ''
    });
    setIsEditing(false);
    setError('');
  };

  const handlePayFees = () => {
    navigate('/payment');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-black via-blue-700 to-black bg-clip-text text-transparent mb-2">
            Student Profile
          </h1>
          <p className="text-gray-600">Manage your personal information and account settings</p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-black via-blue-700 to-black px-8 py-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
                <p className="text-blue-100">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 animate-pulse">
                <div className="flex items-center">
                  <XCircle className="w-5 h-5 mr-2" />
                  {error}
                </div>
              </div>
            )}

            {!isEditing ? (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                    <div className="flex items-center mb-3">
                      <User className="w-5 h-5 text-blue-600 mr-2" />
                      <label className="text-sm font-semibold text-gray-700">Full Name</label>
                    </div>
                    <p className="text-xl font-medium text-gray-900">{user?.name}</p>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                    <div className="flex items-center mb-3">
                      <Mail className="w-5 h-5 text-purple-600 mr-2" />
                      <label className="text-sm font-semibold text-gray-700">Email Address</label>
                    </div>
                    <p className="text-xl font-medium text-gray-900">{user?.email}</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center mb-2">
                        <CreditCard className="w-5 h-5 text-green-600 mr-2" />
                        <label className="text-sm font-semibold text-gray-700">Fee Payment Status</label>
                      </div>
                      <div className="flex items-center">
                        {user?.feesPaid ? (
                          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600 mr-2" />
                        )}
                        <span className={`px-4 py-2 text-sm font-semibold rounded-full ${user?.feesPaid
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                          }`}>
                          {user?.feesPaid ? 'Paid' : 'Not Paid'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-900 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <Edit3 className="w-5 h-5 mr-2" />
                    Edit Profile
                  </button>

                  {!user?.feesPaid && (
                    <button
                      onClick={handlePayFees}
                      className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      Pay Fees
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-900 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-xl font-medium hover:bg-gray-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <X className="w-5 h-5 mr-2" />
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
