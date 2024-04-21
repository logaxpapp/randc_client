import React, { Component } from 'react';
import axios from 'axios';

class UserSignup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        tenantId: props.tenantId,
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        role: '',
      },
      isSubmitting: false,
      error: '',
    };
  }

  handleUserSubmit = async (event) => {
    event.preventDefault();
    this.setState({ isSubmitting: true });

    try {
      const response = await axios.post('/api/users', { ...this.state.user, passwordHash: this.state.user.password });
      if (response.status === 200 || response.status === 201) {
        this.setState({
          error: '',
          user: {
            ...this.state.user,
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            role: '',
          },
        });
      } else {
        this.setState({ error: 'There was an unexpected issue creating the user.' });
      }
    } catch (error) {
      this.setState({ error: 'There was an error creating the user' });
      console.error('There was an error creating the user:', error);
    } finally {
      this.setState({ isSubmitting: false });
    }
  };

  render() {
    const { user, isSubmitting, error } = this.state;

    return (
      <div className="mx-auto max-w-md">
        <div className="bg-white p-8 rounded shadow-md">
          <h2 className="text-2xl font-bold mb-4">User Registration</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
         <form onSubmit={this.handleUserSubmit} className="grid grid-cols-2 gap-4">
          <div className="mb-4 col-span-2">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={user.email}
              onChange={(e) => this.setState({ user: { ...user, email: e.target.value } })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={user.firstName}
              onChange={(e) => this.setState({ user: { ...user, firstName: e.target.value } })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={user.lastName}
              onChange={(e) => this.setState({ user: { ...user, lastName: e.target.value } })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={user.password}
              onChange={(e) => this.setState({ user: { ...user, password: e.target.value } })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Role</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={user.role}
              onChange={(e) => this.setState({ user: { ...user, role: e.target.value } })}
              required
            >
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="ProjectManager">Project Manager</option>
              <option value="Developer">Developer</option>
              <option value="User">User</option>
            </select>
          </div>
          {/* Repeat the above structure for other form fields */}
          <div className="mb-4 col-span-2">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>

        </div>
      </div>
    );
  }
}

export default UserSignup;
