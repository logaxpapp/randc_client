import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { updateTask } from '../../features/tasks/taskSlice';
import { fetchProjects } from '../../features/project/projectSlice';
import { fetchUsers } from '../../features/user/userSlice';
import { fetchTeams } from '../../features/team/teamSlice';
import CustomCircularProgress from '../global/CustomCircularProgress';

const UpdateTaskForm = ({ open, onClose, taskId }) => {
  const [imageUrls, setImageUrls] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const projects = useSelector((state) => state.project.projects);
  const tenantId = useSelector((state) => state.auth.user?.tenantId);
  const users = useSelector((state) => state.users.list);
  const teams = useSelector((state) => state.teams.teams);
  const task = useSelector((state) => state.tasks.tasks.find(task => task._id === taskId));
  const reportedBy = useSelector((state) => state.auth.user?.id);
  const { tasks } = useSelector((state) => state.tasks);
  const tagsOptions = ['Bug', 'Feature', 'Improvement', 'Documentation'];

 

  const [loading, setLoading] = useState(false);
  const [taskDetails, setTaskDetails] = useState({
    title: '',
    description: '',
    type: '',
    priority: '',
    status: '',
    projectId: '',
    assigneeId: '',
    reporterId: reportedBy, // Set reporterId based on logged-in user
    dueDate: '',
    taskId: '',
    summary: '',
    imageUrls: [],
    tags: [],
    teamId: '',
  });


  useEffect(() => {
    if (!tenantId || !task) {
      // Handle case where tenantId or task is not available
      return;
    }
  
    // Dispatch actions to fetch projects, users, and teams
    dispatch(fetchProjects({ tenantId }));
    dispatch(fetchUsers(tenantId));
    dispatch(fetchTeams(tenantId));
  
    // Set initial task details
    setTaskDetails({
      title: task.title || '',
      description: task.description || '',
      type: task.type || '',
      priority: task.priority || '',
      status: task.status || '',
      projectId: task.projectId || '',
      assigneeId: task.assigneeId || '',
      dueDate: task.dueDate || '',
      summary: task.summary || '',
      tags: task.tags || [],
      teamId: task.teamId || '',
    });
  }, [task, tenantId, dispatch, fetchProjects, fetchUsers, fetchTeams]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTaskDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  
  const handleImageUpload = (e) => {
    const files = e.target.files;
    const urls = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = (e) => {
            urls.push(e.target.result);
            setImageUrls(urls);
        };

        reader.readAsDataURL(file);
    }
};


  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const updatedTask = {
      ...taskDetails,
      taskId: taskId, // Assuming taskId is part of the taskDetails
      tenantId: tenantId, // Assuming tenantId is part of the taskDetails
    };

    // Dispatch action to update the task
    dispatch(updateTask(updatedTask));

    // Navigate back to the Issue Board page after updating
    navigate("/dashboard/issueboard");

    setLoading(false);
  };

  if (!task || !projects || !users || !teams) {
    return <CustomCircularProgress />;
  }
  if (!open) return null;

  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'hidden'} flex items-center justify-center p-4 bg-black bg-opacity-50`}>
    <div 
      className="relative p-8 bg-white w-full max-w-2xl m-auto flex-col flex rounded-lg shadow-lg overflow-y-auto"
      style={{ maxHeight: '90vh' }} // Limits the modal height to 90% of the viewport height
    >
      <div className="flex justify-end">
        {/* Close button */}
        <button onClick={onClose} className="text-black">
          [Close]
        </button>
      </div>
      <h1 className="text-2xl font-bold mb-6">Update Issue</h1>
      <form onSubmit={handleSubmit}>
          {/* title */}
          <div className="mb-4">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="title">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={taskDetails.title}
              onChange={handleChange}
              placeholder="Enter a title for the issue"
              required
              className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            />
          <p children="Please enter a title for the issue" className="text-red-500 text-xs italic" />
          </div>
          
          {/* Project and Issue Type */}
          <div className="flex flex-wrap -mx-3 mb-6">
          
          
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="project">
                Project *
              </label>
              <div className="relative">
                <select
                  id="project"
                  name="projectId"
                  value={taskDetails.projectId}
                  onChange={handleChange}
                  required
                  className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                >
                  <option value="">Select Project</option>
                  {Array.isArray(projects) ? projects.map((project) => (
                    <option key={project._id} value={project?._id}>{project?.name}</option>
                  )): null}
                </select>
              </div>
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="issue-type">
                Issue type *
              </label>
              <div className="relative">
                <select
                  id="issue-type"
                  name="type"
                  value={taskDetails.type}
                  onChange={handleChange}
                  required
                  className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                >
                  <option value="">Select Type</option>
                  <option value="">Select Type</option>
                        <option value="Task">Task</option>
                        <option value="Bug">Bug</option>
                        <option value="Epic">Epic</option>
                        <option value="Story">Story</option>
                </select>
              </div>
            </div>
          </div>
  
          {/* Summary and Description */}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="summary">
                Summary *
              </label>
              <textarea
                type="text"
                id="summary"
                name="summary"
                value={taskDetails.summary}
                onChange={handleChange}
                required
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-50 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                placeholder="Enter a summary for the issue"
              />
              
            </div>
          </div>
                    {/* //handleImageUpload field to handle image upload and make image apear in the input field */}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="image">
                    Image
                </label>
                <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-50 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                />
                <p className="text-gray-500">Allowed file types: .jpg, .jpeg, .png, .gif</p>
                <div className="flex">
                {imageUrls.map((imageUrl, index) => (
                  <div key={index} className="mr-2"> {/* Added margin to create spacing between images */}
                    <img src={imageUrl} alt="uploaded" style={{ width: '50px', height: '50px' }} />
                  </div>
                ))}
              </div>

            </div>
        </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={taskDetails.description}
                onChange={handleChange}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-200  rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                placeholder="Enter a detailed description"
                rows={8}
                required
              />
              <p className="text-red-500 text-xs italic">Please fill out this field.</p>
            </div>
          </div>
  
          {/* Assignee and Labels */}

          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="assignee">
                Assignee
              </label>
              <div className="relative">
                <select
                  id="assignee"
                  name="assigneeId"
                  value={taskDetails.assigneeId}
                  onChange={handleChange}
                  className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-10 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                >
                  <option value="">Select Assignee</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>{user.firstName} {user.lastName}</option>
                  ))}
                </select>
              </div>

            </div>
            <div className="w-full md:w-1/2 px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="labels">
                Labels
              </label>
              <div className="relative">
                <select
                
                  multiple
                  value={taskDetails.tags}
                  onChange={handleChange}
                  name="tags"
                  className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                >
                   {tagsOptions.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
                </select>
              </div>
            </div>
          </div>
          {/* ... Similar structure for other fields ... */}
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="due-date">
                Due Date
              </label>
              <input
                type="date"
                id="due-date"
                name="dueDate"
                value={taskDetails.dueDate}
                onChange={handleChange}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                placeholder="Enter a due date"
                required
                min={new Date().toISOString().split('T')[0]}
                max="2025-12-31"

              />
              <p className="text-red-500 text-xs italic">Please fill out this field.</p>
            </div>
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="priority">
                Priority
              </label>
              <div className="relative">
                <select
                  id="priority"
                  name="priority"
                  value={taskDetails.priority}
                  onChange={handleChange}
                  className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                >
                  {/* //ToDo', 'InProgress', 'Done', 'Reviewed', 'Cancelled', 'OnHold */}
                  <option value="">Select Priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Blocker">Blocker</option>
                  <option value="Major">Major</option>
                  <option value="Minor">Minor</option>
                  <option value="None">None</option>
                  <option value="Trivial">Trivial</option>

                </select>
              </div>
              <p className="text-red-500 text-xs italic">Please fill out this field.</p>
            </div>
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="status">
                Status
              </label>
              <div className="relative">
                <select
                  id="status"
                  name="status"
                  value={taskDetails.status}
                  onChange={handleChange}
                  className="block appearance-none w-full bg-gray-100 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                >
                  <option value="">Select Status</option>
                <option value="ToDo">ToDo</option>
                <option value="InProgress">InProgress</option>
                <option value="Done">Done</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="OnHold">OnHold</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
                <option value="Reopened">Reopened</option>
              </select>
              </div>
              <p className="text-red-500 text-xs italic">Please fill out this field.</p>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6 mt-4">
          {/* Parent Task Dropdown */}
          <div className="w-full md:w-1/2 px-12 mb-6 md:mb-0 ">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="task">
              Parent Task
            </label>
            <div className="relative p-4">
              <select
                id="task"
                name="parentId"
                value={taskDetails.taskId}
                onChange={handleChange}
                className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              >
                <option value="">Select Parent Task</option>
                {tasks.map((task) => (
                  <option key={task._id} value={task._id}>{task.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Team Dropdown */}
          <div className="w-full md:w-1/2 px-12">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="team">
              Team
            </label>
            <div className="relative p-4">
              <select
                id="team"
                name="teamId"
                value={taskDetails.teamId}
                onChange={handleChange}
                className="block appearance-none w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              >
                <option value="">Select Team</option>
                {teams.map((team) => (
                  <option key={team._id} value={team._id}>{team.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
       </div>
        
         
                      {/* Submit Button */}
                      <div className="flex justify-end">
                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                          {loading ? 'Updating...' : 'Update Issue'}
                        </button>
                      </div>

                    </form>
                    </div>
                    </div>
                    );
                    };
                    export default UpdateTaskForm;