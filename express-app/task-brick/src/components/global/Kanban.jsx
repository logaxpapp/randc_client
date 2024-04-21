import React, { useState, useMemo } from 'react';
import { KanbanComponent, ColumnsDirective, ColumnDirective } from '@syncfusion/ej2-react-kanban';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { kanbanData as initialKanbanData, kanbanGrid } from '../data/dummy';
import { Header } from '../components';

const Kanban = () => {
  const [kanbanData, setKanbanData] = useState(initialKanbanData);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [newIssue, setNewIssue] = useState({ Summary: '', Status: 'Open' });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => (
    !searchTerm ? kanbanData : kanbanData.filter((item) =>
      item.Summary.toLowerCase().includes(searchTerm.toLowerCase()) 
  || item.Status.toLowerCase().includes(searchTerm.toLowerCase()))
  ), [kanbanData, searchTerm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewIssue({ ...newIssue, [name]: value });
  };

  const addNewIssue = () => {
    const issueToAdd = {
      ...newIssue,
      Id: `Task ${kanbanData.length + 1}`,
      Title: `Task - ${kanbanData.length + 29001}`,
    };
    setKanbanData([...kanbanData, issueToAdd]);
    setDialogVisible(false);
    setNewIssue({ Summary: '', Status: 'Open' }); // Reset new issue state after adding
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="App" title="Kanban" />
      <div className="flex justify-between mb-4">
        <button
          type="button"
          onClick={() => setDialogVisible(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Issue
        </button>
        <input
          type="text"
          placeholder="Search...."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-2  border-gray-300 p-2 rounded"
        />
      </div>
      <DialogComponent
        isVisible={dialogVisible}
        header="Add New Issue"
        showCloseIcon
        width="500px"
        onClose={() => setDialogVisible(false)}
      >
        <div className="p-4">
          <input
            type="text"
            name="Summary"
            placeholder="Issue Summary"
            value={newIssue.Summary}
            onChange={handleInputChange}
            className="border-2 border-gray-300 p-2 rounded w-full my-2"
          />
          <select
            name="Status"
            value={newIssue.Status}
            onChange={handleInputChange}
            className="border-2 border-gray-300 p-2 rounded w-full mt-4"
          >
            <option value="Open">Open</option>
            <option value="InProgress">In Progress</option>
            <option value="Testing">Testing</option>
            <option value="Done">Done</option>
          </select>
          <button
            type="button"
            onClick={addNewIssue}
            className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            Submit
          </button>
        </div>
      </DialogComponent>
      <KanbanComponent
        id="kanban"
        keyField="Status"
        dataSource={filteredData}
        cardSettings={{ contentField: 'Summary', headerField: 'Id' }}
      >
        <ColumnsDirective>
          {kanbanGrid.map((column, index) => (
            <ColumnDirective key={index} {...column} />
          ))}
        </ColumnsDirective>
      </KanbanComponent>
    </div>
  );
};

export default Kanban;
