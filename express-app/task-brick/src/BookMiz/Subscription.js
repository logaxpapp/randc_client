import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import NewSubscriptionModal from './modal/NewSubscriptionModal';
import EditSubscriptionModal from './modal/EditSubscriptionModal';
import DeleteSubscriptionModal from './modal/DeleteModal';


// Dummy data for subscription plans
const initialPlansData = [
  { 
    id: 1, 
    name: 'Starter', 
    description: 'Basic subscription plan', 
    freePeriod: 1, 
    price: '10',
    availableInCountries: ['USA', 'Canada', 'UK'] // array of country codes
  },
  { 
    id: 2, 
    name: 'Standard', 
    description: 'Most popular subscription plan', 
    freePeriod: 2, 
    price: '20',
    availableInCountries: ['USA', 'UK'] 
  },
  { 
    id: 3, 
    name: 'Premium', 
    description: 'All features subscription plan', 
    freePeriod: 3, 
    price: '30',
    availableInCountries: ['Canada', 'Australia'] 
  },
  // ... more plans
];

const countries = ['USA', 'Canada', 'UK', 'Australia', 'Germany', 'France', 'Japan', 'China', 'India', 'Brazil'];

const Subscription = () => {
  const [plans, setPlans] = useState(initialPlansData);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [filteredPlans, setFilteredPlans] = useState([]);

  const getPlansForCountry = (country) => {
    return initialPlansData.filter(plan => plan.availableInCountries.includes(country));
  };
  

   // Handlers for country change
   const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
  };

  // When selectedCountry changes, filter the plans.
  useEffect(() => {
    const newFilteredPlans = getPlansForCountry(selectedCountry);
    setFilteredPlans(newFilteredPlans);
  }, [selectedCountry, plans]);


 // Handlers for New Plan Modal
 const handleNewPlan = () => {
  setSelectedPlan(null);
  setIsNewModalOpen(true);
};
const closeNewModal = () => setIsNewModalOpen(false);

// Handlers for Edit Plan Modal
const handleEditPlan = (planId) => {
  const plan = plans.find(plan => plan.id === planId);
  setSelectedPlan(plan);
  setIsEditModalOpen(true);
};
const closeEditModal = () => setIsEditModalOpen(false);

// Handlers for Delete Plan Modal
const handleDeletePlan = (planId) => {
  setSelectedPlan(planId);
  setIsDeleteModalOpen(true);
};
const closeDeleteModal = () => setIsDeleteModalOpen(false);
  const handleNewPlanSubmit = () => {
    // Logic to add a new plan
    // Example: You can add the new plan to the plans list
    const newPlan = {
      id: plans.length + 1,
      name: "New Plan",
      description: "New Description",
      freePeriod: 1,
    };
    setPlans([...plans, newPlan]);
    closeNewModal();
  };

  const handleEditPlanSubmit = () => {
    // Logic to edit a plan
    // Example: You can update the plan details in the plans list
    const updatedPlans = plans.map(plan => {
      if (plan.id === selectedPlan.id) {
        return {
          ...plan,
          name: "Updated Plan",
          description: "Updated Description",
        };
      }
      return plan;
    });
    setPlans(updatedPlans);
    closeEditModal();
  };

  const handleDeletePlanSubmit = () => {
    // Logic to delete a plan
    const updatedPlans = plans.filter(plan => plan.id !== selectedPlan);
    setPlans(updatedPlans);
    closeDeleteModal();
  };


  return (
    <div className="container mx-auto px-4 sm:px-8">
    <div className="py-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl leading-tight">Subscription plan</h2>
          <select
            value={selectedCountry}
            onChange={handleCountryChange}
            className="mt-2 form-select block w-full pl-3 bg-gray-50 rounded-full pr-10 py-2 text-base leading-6 border-gray-300 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
          >
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleNewPlan}
          className="flex items-center px-8 py-2 border bg-gray-200 border-gray-500 text-sm leading-5 font-medium rounded-md text-gray-700 hover:bg-gray-600 hover:text-white focus:outline-none focus:shadow-outline-blue"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2 border py-1 px-1 bg-custom-green rounded-full" />
          New Plan
        </button>
      </div>
        <div className="mt-4">
          <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b border-gray-200 bg-slate-200 text-left text-xs leading-4 font-bold text-gray-800 uppercase tracking-wider">
                    Plans
                  </th>
                  <th className="px-6 py-3  border-b border-gray-200 bg-custom-green leading-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3  border-b border-gray-200 bg-purple-300 leading-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">Period</th>
                  <th className="px-6 py-3 border-b border-gray-200 bg-gray-700 leading-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 border-b border-gray-200 bg-gray-400">Country</th>
                  <th className="px-6 py-3  border-b border-gray-200 bg-pink-300 leading-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white">
              {filteredPlans.map((plan) => (
                  <tr key={plan.id}>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                      <input type="checkbox" className="form-checkbox rounded-md" />
                      <div className="text-sm leading-5 text-gray-900 ml-2 inline">{plan.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                      <div className="text-sm leading-5 text-gray-900">{plan.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                      <div className="text-sm leading-5 text-gray-900">{plan.freePeriod}</div>
                    </td>
                    <td className="text-sm px-6 py-4 whitespace-no-wrap border-b border-gray-200">{plan.price}</td>
                    <td className="text-sm px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                      {plan.availableInCountries.join(', ')}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap text-right border-b border-gray-200 text-sm leading-5 font-medium">
                      <button onClick={() => handleEditPlan(plan.id)} className="text-indigo-600 bg-yellow-100 px-2 rounded-full hover:text-indigo-900">
                        <FontAwesomeIcon icon={faEdit} className="mr-1" />
                        Edit
                      </button>
                      <button onClick={() => handleDeletePlan(plan.id)} className="text-red-600 text-xs bg-red-200 px-1 rounded-full py-1 hover:text-red-900 ml-6">
                      Delete
                        <FontAwesomeIcon icon={faTrash} className="ml-1" />
                       
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <NewSubscriptionModal isOpen={isNewModalOpen} onClose={closeNewModal} onNewPlan={handleNewPlanSubmit} />
      <EditSubscriptionModal isOpen={isEditModalOpen} onClose={closeEditModal} onEditPlan={handleEditPlanSubmit} plan={selectedPlan} />
      <DeleteSubscriptionModal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} onDeletePlan={handleDeletePlanSubmit} planId={selectedPlan} />
    </div>
  );
};

export default Subscription;
