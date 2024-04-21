import React, { useState, useEffect} from 'react';
import DeleteIcon from './assets/trash.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import StatusModal from './modal/StatusModal'; 
import DeleteModal from '../BookMiz/modal/DeleteModal';
import DeletedModal from './modal/DeletedModal';


const Company = () => {

 
  const initialCompanies = [
    { id: "1", name: 'Ujah Emmanuel', country: 'Canada', status: 'Active', subscription: 'Premium' },
    {  id: "2", name: 'Kriss Bajo', country: 'Canada', status: 'Active', subscription: 'Premium' },
    {  id: "3", name: 'Krissy Boggie', country: 'Canada', status: 'Active', subscription: 'Premium' },
    { id: "4",  name: 'Krissy Francis', country: 'Canada', status: 'Active', subscription: 'Basic' },
    {  id: "5", name: 'Patience Adebajo', country: 'Canada', status: 'Active', subscription: 'Premium' },
    {  id: "6", name: 'Patience Adebajo', country: 'Canada', status: 'Active', subscription: 'Standard' },
    {  id: "7", name: 'Patience Adebajo', country: 'Canada', status: 'Active', subscription: 'Premium' },
    { id: "8", name: 'Ujah Emmanuel', country: 'Canada', status: 'Active', subscription: 'Premium' },
    {  id: "9", name: 'Kriss Bajo', country: 'Canada', status: 'Active', subscription: 'Premium' },
    {  id: "10", name: 'Krissy Boggie', country: 'Canada', status: 'Active', subscription: 'Premium' },
    { id: "11",  name: 'Krissy Francis', country: 'Canada', status: 'Active', subscription: 'Basic' },
    {  id: "12", name: 'Patience Adebajo', country: 'Canada', status: 'Active', subscription: 'Premium' },
    {  id: "13", name: 'Patience Adebajo', country: 'Canada', status: 'Active', subscription: 'Standard' },
    {  id: "14", name: 'Patience Adebajo', country: 'Canada', status: 'Active', subscription: 'Premium' },

  ]

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeletedModal, setShowDeletedModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('');
  const [allCompanies, setAllCompanies] = useState(initialCompanies);
  const [filteredCompanies, setFilteredCompanies] = useState(initialCompanies);
  const [searchTerm, setSearchTerm] = useState('');


  // Update the deletion logic as needed
  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      // Perform deletion logic
      setAllCompanies((prev) => prev.filter((company) => company.id !== itemToDelete.id));
      setFilteredCompanies((prev) => prev.filter((company) => company.id !== itemToDelete.id));
      
      setShowDeleteModal(false);
      setShowDeletedModal(true);
    }
  };

   // Handlers for closing modals:
   const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleCloseDeletedModal = () => {
    setShowDeletedModal(false);
  };

  const handleCloseStatusModal = () => {
    setShowStatusModal(false);
  };


   // Handlers...
   const handleOpenDeleteModal = (company) => {
    setItemToDelete(company); // Set the company to delete
    setShowDeleteModal(true);
  };

  // Ensure that when you open the StatusModal, you handle it similarly
  const handleOpenStatusModal = (status) => {
    setCurrentStatus(status);
    setShowStatusModal(true);
  };
  
  const handleUpdateStatus = (newStatus) => {
    // Here, you'd update the status in your state
    // This example doesn't include updating the state to keep it simple
    console.log(`Updating status to ${newStatus}`);
    setIsModalOpen(false);
  };

  
  const itemsPerPage = 10; // Adjust as needed

const [currentPage, setCurrentPage] = useState(0);

// Calculate total pages
const pageCount = Math.ceil(filteredCompanies.length / itemsPerPage);

// Calculate the slice of data to show based on the current page
const paginatedCompanies = filteredCompanies.slice(
  currentPage * itemsPerPage,
  (currentPage + 1) * itemsPerPage
);

const handlePageChange = (newPage) => {
  setCurrentPage(newPage);
};

// Render page numbers dynamically based on total page count
const pageNumbers = Array.from({ length: pageCount }, (_, index) => index);


  useEffect(() => {
    if (!searchTerm) {
      setFilteredCompanies(allCompanies);
    } else {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      const filtered = allCompanies.filter(company =>
        company.name.toLowerCase().includes(lowercasedSearchTerm) ||
        company.country.toLowerCase().includes(lowercasedSearchTerm) ||
        company.status.toLowerCase().includes(lowercasedSearchTerm) ||
        company.subscription.toLowerCase().includes(lowercasedSearchTerm)
      );
      setFilteredCompanies(filtered);
    }
  }, [searchTerm, allCompanies]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className=" mx-auto px-4 sm:px-8 min-h-screen">
      <div className="py-2">
        <div className="flex flex-row mb-1 sm:mb-0 justify-between w-full">
          <h2 className="text-xl leading-tight">Companies</h2>
          <div className="text-end">
            <form onSubmit={(e) => e.preventDefault()} className="flex w-full max-w-md space-x-3">
            <div className="relative">
            <input
              type="text"
              id="form-subscribe-Filter"
              className="rounded-lg text-xs border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-slate-200 text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="name, country, status, subscription"
              value={searchTerm}
              onChange={handleSearchChange}
            />
              </div>
              <button
                className="flex-shrink-0 px-4 py-2 text-xs font-semibold text-white bg-green-500 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2"
                type="submit"
              >
                Filter
              </button>
            </form>
          </div>
        </div>
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-2 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Subscription
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white'>
                {paginatedCompanies.map((company, index) => (
                  <tr  key={company.id}>
                    <td className="px-5 py-2 text-xs border-b border-gray-200 bg-white">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <a href="#" className="block relative ">
                            <input type="checkbox" className="form-checkbox h-3 w-3 text-gray-600" />
                          </a>
                        </div>
                        <div className="ml-3">
                          <p className="text-gray-900 whitespace-no-wrap">{company.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{company.country}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <div className="relative flex items-center justify-between">
                        <span
                          className={`relative inline-block px-3 py-1 font-semibold text-xs hover:border-yellow-600  text-green-900 leading-tight ${company.status === 'Active' ? 'cursor-pointer' : ''}`}
                          onClick={() => handleOpenStatusModal(company.status)} 
                        >
                          <span
                            aria-hidden="true"
                            className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                          ></span>
                          <span className="relative">{company.status}</span>
                          {company.status === 'Active' && (
                            <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{company.subscription}</p>
                      </td>
                      <button
                      onClick={() => handleOpenDeleteModal(company)}
                      className="bg-red-300 text-xs hover:bg-red-600 hover:text-white focus:ring-red-500 inline-flex items-center px-2 py-2 border border-transparent shadow-sm font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2"
                    >
                      <img src={DeleteIcon} alt="Delete" className="h-3 w-4 mr-1 hover:text-white" />
                      Delete
                    </button>

                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between items-center">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className={`p-4 border text-base rounded-l-xl text-gray-600 bg-white hover:bg-gray-100 ${currentPage === 0 && 'cursor-not-allowed opacity-50'}`}
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      {pageNumbers.map(number => (
        <button
          key={number}
          onClick={() => handlePageChange(number)}
          className={`px-4 py-2 border-t border-b text-base ${currentPage === number ? 'text-indigo-500' : 'text-gray-700'} bg-white hover:bg-gray-100`}
        >
          {number + 1}
        </button>
      ))}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === pageCount - 1}
        className={`p-4 border text-base rounded-r-xl text-gray-600 bg-white hover:bg-gray-100 ${currentPage === pageCount - 1 && 'cursor-not-allowed opacity-50'}`}
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
    </div>

              </div>
            </div>
          </div>
          <DeleteModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onDeleteConfirm={handleDeleteConfirm}
      />

      <DeletedModal
        isOpen={showDeletedModal}
        onClose={handleCloseDeletedModal}
        countryName={itemToDelete ? itemToDelete.name : ''}
      />

      <StatusModal
        isOpen={showStatusModal}
        onClose={handleCloseStatusModal}
        currentStatus={currentStatus}
        onUpdateStatus={(newStatus) => {
          // Here, implement your logic to update the status.
          console.log("Status updated to", newStatus);
          setShowStatusModal(false); // Optionally close the modal after updating
        }}
      />
    </div>
  );
};

export default Company;
