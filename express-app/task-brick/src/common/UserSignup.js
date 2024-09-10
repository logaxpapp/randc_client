import React, { Component } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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



  resetForm = () => {
    // Logic to reset the form
    this.setState({
      user: {
        tenantId: this.props.tenantId,
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        role: '',
      },
      isSubmitting: false,
      error: '',
    });
  };

  render() {
    const { user, isSubmitting, error } = this.state;

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-6 py-8">
        <div className="max-w-4xl w-full space-y-8 bg-gray-50 p-16 shadow rounded-lg mb-12">
          <h2 className="text-4xl font-bold text-left text-gray-900">
            User Registration
          </h2>
          <p className="mt-2 text-lg text-gray-500 text-left">
            Create a new account to get started with TaskBrick.
          </p>
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          <form onSubmit={this.handleUserSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-lg font-medium text-gray-700">
                  Email
                </label>
                <p className="mt-2 text-sm text-gray-500 mb-4">
              Choose a name that represents your team's identity. This will be displayed across the TaskBrick platform.
            </p>
                <input
                  type="email"
                  className="appearance-none text-gray-500 rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  value={user.email}
                  onChange={(e) => this.setState({ user: { ...user, email: e.target.value } })}
                  required
                  placeholder="Enter a valid email address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* FirstName */}
                <div>
                  <label className="block text-lg font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="rounded-md block w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={user.firstName}
                    onChange={(e) => this.setState({ user: { ...user, firstName: e.target.value } })}
                    required
                  />
                </div>

                {/* LastName */}
                <div>
                  <label className="block text-lg font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="rounded-md block w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={user.lastName}
                    onChange={(e) => this.setState({ user: { ...user, lastName: e.target.value } })}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-lg font-medium text-gray-700">
                  Password
                </label>
                <p className="mt-2 text-sm text-gray-500 mb-4">
              Choose a name that represents your team's identity. This will be displayed across the TaskBrick platform.
            </p>
                <input
                  type="password"
                  className="rounded-md block w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={user.password}
                  onChange={(e) => this.setState({ user: { ...user, password: e.target.value } })}
                  required
                  placeholder="Password"
                />
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-lg font-medium text-gray-700">
                  Role
                </label>
                <p className="mt-2 text-sm text-gray-500 mb-4">
              Choose a name that represents your team's identity. This will be displayed across the TaskBrick platform.
            </p>
                <select
                  className="rounded-md block w-full px-4 py-3 border border-gray-300 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
            </div>

            {/* Submit Button */}
            <div className="flex justify-between mb-12">
              <button
                type="submit"
                className="flex-grow mr-3 bg-blue-600 text-white text-lg rounded-md py-3 px-6 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>
              <button
                type="button"
                className="flex-grow bg-gray-200 text-lg rounded-md py-3 px-6 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                onClick={this.resetForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default UserSignup;
