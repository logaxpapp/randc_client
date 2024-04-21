import React, { useState, useEffect } from 'react';
import DeleteIcon from './assets/trash.svg';
import EditIcon from './assets/edit.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faSearch } from '@fortawesome/free-solid-svg-icons';
import DeleteModal from './modal//DeleteCountryModal'; 
import EditCountryModal from './modal/EditCountryModal'; 
import ImportCountryModal from './modal/ImportCountryModal';
import NewCountryModal from './modal/NewCountryModal'; 
import DetailsModal from './modal/DetailsModal';
import DetailsIcon from './assets/details.svg';
import AddIcon  from './assets/add.svg';


const countries = [
 
  { id: "1", code: "US", name: "United States", currency: "USD", state: "50", cities: "1000" },
  { id: "2", code: "CA", name: "Canada", currency: "CAD", state: "13", cities: "100" },
  { id: "3", code: "AU", name: "Australia", currency: "AUD", state: "6", cities: "100" },
  { id: "4", code: "GB", name: "United Kingdom", currency: "GBP", state: "4", cities: "100" },
  { id: "5", code: "DE", name: "Germany", currency: "EUR", state: "16", cities: "100" },
  { id: "6", code: "FR", name: "France", currency: "EUR", state: "16", cities: "100" },
  { id: "7", code: "IT", name: "Italy", currency: "EUR", state: "16", cities: "100" },
  { id: "8", code: "ES", name: "Spain", currency: "EUR", state: "16", cities: "100" },
  { id: "9", code: "NL", name: "Netherlands", currency: "EUR", state: "16", cities: "100" },
  { id: "10", code: "PT", name: "Portugal", currency: "EUR", state: "16", cities: "100" },
  { id: "11", code: "SE", name: "Sweden", currency: "EUR", state: "16", cities: "100" },
  { id: "12", code: "CH", name: "Switzerland", currency: "EUR", state: "16", cities: "100" },
  { id: "13", code: "JP", name: "Japan", currency: "JPY", state: "16", cities: "100" },
  // More countries...
];

function Country() {
  const [currentPage, setCurrentPage] = useState(0);
  const [countriesToShow, setCountriesToShow] = useState(countries);
  const [filter, setFilter] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5); // Number of items per page

    // Modals state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isNewCountryModalOpen, setIsNewCountryModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
    // Handling the modals
    const openDeleteModal = () => setIsDeleteModalOpen(true);
    const closeDeleteModal = () => setIsDeleteModalOpen(false);
    const openEditModal = () => setIsEditModalOpen(true);
    const closeEditModal = () => setIsEditModalOpen(false);
    const openImportModal = () => setIsImportModalOpen(true);
    const closeImportModal = () => setIsImportModalOpen(false);
    const openNewCountryModal = () => setIsNewCountryModalOpen(true);
    const closeNewCountryModal = () => setIsNewCountryModalOpen(false);
    const openDetailsModal = () => setIsDetailsModalOpen(true);
    const closeDetailsModal = () => setIsDetailsModalOpen(false)

    const handleUpdate = (country) => {
      // Update the country in your state
      console.log(`Updated country: ${country}`);
      closeEditModal();
    };

    const handleCountryData = (country) => {
      // Update the country in your state
      console.log(`Updated country: ${country}`);
      closeImportModal();
    };

    const handleImportCountry = (country) => {
      // Update the country in your state
      console.log(`Updated country: ${country}`);
      closeNewCountryModal();
    };


   

  // Pagination
  const pageCount = Math.ceil(countriesToShow.length / itemsPerPage);
  const pages = [...Array(pageCount).keys()]; // create an array of page numbers
  const currentCountryData = countriesToShow.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  useEffect(() => {
    const lowercasedFilter = filter.toLowerCase();
    const filteredData = countries.filter((country) =>
      Object.values(country).some((value) =>
        value.toString().toLowerCase().includes(lowercasedFilter)
      )
    );
    setCountriesToShow(filteredData);
  }, [filter]);

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = (country) => {
    // Delete the country from your state
    console.log(`Deleted country: ${country}`);
    closeDeleteModal();
  };


   // Classes definition for styling
  
   const tableClass = "min-w-full divide-y divide-gray-50";
   const thClass = "px-6 py-3 bg-slate-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider";
   const tdClass = "px-6 py-4 whitespace-nowrap text-sm text-gray-900";
   const buttonClass = "inline-flex items-center px-2 py-2 border border-transparent shadow-sm font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2";
   const editButtonClass = `${buttonClass} bg-yellow-100 text-xs hover:bg-yellow-400 hover:text-white focus:ring-blue-500`;
   const deleteButtonClass = `${buttonClass} bg-red-100 text-xs hover:bg-red-600 hover:text-white focus:ring-red-500`;
   const detailButtonClass = `${buttonClass} bg-gray-300 rounded-full text-xs hover:bg-gray-700 hover:text-white focus:ring-green-500`;
 

  return (
    <div className="container mx-auto px-4 sm:px-8">
      <div className="py-4">

                <div className="flex justify-between items-center mb-20">
            <div className="relative w-1/3">
              <FontAwesomeIcon icon={faSearch} className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                className="pl-10 border-gray-300 rounded-lg p-2 w-full"
                placeholder="What service do you need?"
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
            <div className="flex justify-between items-center gap-4">
            <div className="relative w-1/2 border px-8 rounded-lg">
          <input
            type="button"
            className="pl-10 border-gray-300 rounded-lg p-2 w-full"
            value="Import Country" 
            onClick={openImportModal} 
          />
          <img src={AddIcon} className="absolute top-1/2 left-3 transform -translate-y-1/2 h-6 w-6" alt="Add Icon" />
        </div>

        <div className="relative w-1/2 border px-8 rounded-lg">
          <input
            type="button"
            className="pl-10 border-gray-300 rounded-lg p-2 w-full"
            value="New Country"
            onClick={openNewCountryModal} 
          />
          <img src={AddIcon} className="absolute top-1/2 left-3 transform -translate-y-1/2 h-6 w-6" alt="Add Icon" />
        </div>

</div>

        </div>
        <table className={`${tableClass} mb-10`}>
        <thead className="bg-gray-50">
            <tr>
            <th scope="col" className={thClass}>Code</th>
            <th scope="col" className={thClass}>Name</th>
            <th scope="col" className={thClass}>Currency</th>
            <th scope="col" className={thClass}>State</th>
            <th scope="col" className={thClass}>Cities</th>
            <th scope="col" className={thClass}>Details</th>
            <th scope="col" className={thClass}>Edit</th>
            <th scope="col" className={thClass}>Delete</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y mb-2 divide-gray-200">
            {currentCountryData.map((country) => (
              <tr key={country.id}>
            <td className={tdClass}>
                <div className="flex items-center">
                  <input type="checkbox" className="mr-2 rounded-md text-gray-500" />
                  {country.code}
                </div>
              </td>

              <td className={tdClass}>{country.name}</td>
              <td className={tdClass}>{country.currency}</td>
              <td className={tdClass}>{country.state}</td>
              <td className={tdClass}>{country.cities}</td>
              <td className={tdClass}>
                <button className={`${detailButtonClass} text-black`} onClick={openDetailsModal}>
                  <img src={DetailsIcon} alt="Details" className="h-3 w-3 mr-1" />
                  Details
                </button>
              </td>
              <td className={`${tdClass} rounded-full`} >
                <button className={`${editButtonClass} rounded-full`} onClick={openEditModal}>
                  <img src={EditIcon} alt="Edit" className="h-3 w-4 mr-1" />
                  Edit
                </button>
              </td>
              <td className={`${tdClass} mb-10`}>
                <button className={`${deleteButtonClass} text-red-700`} onClick={openDeleteModal}>
                  <img src={DeleteIcon} alt="Delete" className="h-3 w-4 mr-1" />
                  Delete
                </button>
              </td>

            </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="flex max-w-6xl mx-auto justify-between items-center">

          <button onClick={() => handlePageClick(currentPage - 1)} disabled={currentPage === 0} className='border py-2 px-4 rounded-lg hover:bg-black hover:text-white'>
            <FontAwesomeIcon icon={faChevronLeft} className='mr-2' />
            Previous
          </button>
          {pages.map((page) => (
            <button key={page} onClick={() => handlePageClick(page)}>
              {page + 1}
            </button>
          ))}
          <button onClick={() => handlePageClick(currentPage + 1)} disabled={currentPage === pageCount - 1} className='border py-2 px-4 rounded-lg hover:bg-black hover:text-white'>
            Next
            <FontAwesomeIcon icon={faChevronRight} className='ml-2' />
          </button>
        </div>
        {isDeleteModalOpen && <DeleteModal closeModal={closeDeleteModal} /* other props */ />}
        {isEditModalOpen && (
        <EditCountryModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          countryData={currentCountryData[4]}
          onUpdate={handleUpdate}
          /* other props */
        />
      )}
      {isImportModalOpen &&
        <ImportCountryModal
          isOpen={isImportModalOpen}
          onClose={closeImportModal}
          countryData={currentCountryData[4]}
          onCountryData={handleCountryData}
          /* other props */
        />
      }
      {isNewCountryModalOpen && (
        <NewCountryModal
          isOpen={isNewCountryModalOpen}
          onClose={closeNewCountryModal}
          countryData={currentCountryData[4]}
          onImportCountry={handleImportCountry}
          /* other props */
        />
      )}
      {isDetailsModalOpen && (
        <DetailsModal
          isOpen={isDetailsModalOpen}
          onClose={closeDetailsModal}
          countryData={currentCountryData[4]}
          /* other props */
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onDelete={handleDelete}
          /* other props */
        />
      )}
      
      </div>
  );
}

export default Country;
