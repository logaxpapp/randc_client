import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import RecentProject from '../../components/projects/RecentProject';
import DashboardHome from '../../components/dashboard/DashboardHome';
import Statistics from '../../components/projects/Statistics';
import useThemeSwitcher from '../themes/useThemeSwitcher'; 
import Kanban from '../../components/boards/Kanban'; // Make sure to create this component
import ScrumBoard from '../../components/boards/ScrumBoard'; 
import ScrumList from '../../components/boards/ScrumList';
import RecentProjectsComponent from '../../components/projects/RecentProjectsComponent';
import CreateTaskForm from '../../components/tasks/CreateTaskForm';
import TaskDetails from '../../components/tasks/TaskListView';
import TaskListView from '../../components/tasks/TaskListView';
import PrivateProject from '../../components/projects/PrivateProject';
import ProjectDetailComponent from '../projects/ProjectDetailComponent';
import CreateNewProject from '../projects/CreateNewProject';
import AllProjectsComponent from '../projects/AllProjectsComponent';
import  CreateUserForm from '../users/CreateUserForm';
import UpdateUserForm from '../users/UpdateUserForm';
import UserList from '../users/UserList';
import IssueBoard from '../tasks/IssueBoard';
import { FilterProvider } from '../../context/useFilters';
import TeamList from '../team/TeamList';
import CreateSprintForm from '../sprints/CreateSprint';
import SprintList from '../sprints/SprintList';
import CreateSprintTask from '../sprints/CreateSprintTask';
import SprintTaskList from '../sprints/SprintTaskList';
import ActivityReport from '../reports/ActivityReport';
import RiskAnalysisReport from '../reports/RiskAnalysisReport';
import DueDateForecasting from '../reports/DueDateForecasting';
import PriorityBreakdownReport from '../reports/PriorityBreakdownReport';
import WorkLoadReport from '../reports/WorkLoadReport';
import Upgrade from '../subscription/Upgrade';





const Dashboard = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<DashboardHome />} />
        <Route path="recent-project" element={<RecentProject />} />
        <Route path="all-projects" element={<AllProjectsComponent />} />
        <Route path="recent-projects" element={<RecentProjectsComponent />} />
        <Route path="statistics" element={<Statistics />} />
        <Route path="kanban" element={<Kanban />} /> 
        <Route path="scrum" element={<ScrumBoard />} />
        <Route path="scrum-list" element={<ScrumList />} />
        <Route path="create-task" element={<CreateTaskForm />} />
        <Route path="task-list" element={<TaskListView />} />
        <Route path="private-projects" element={<PrivateProject />} />
        <Route path="project-detail/:tenantId/:projectId" element={<ProjectDetailComponent />} />
        <Route path="create-project" element={<CreateNewProject />} />
        <Route path="create-user" element={<CreateUserForm />} />
        <Route path="user-list" element={<UserList />} />
        <Route path="team-list" element={<TeamList />} />
        <Route path="update-user/:userId" element={<UpdateUserForm />} />
        <Route path="create-sprinttask" element={<CreateSprintTask />} />
        <Route path="sprint_task" element={<SprintTaskList />} />
        <Route path="activity-report" element={<ActivityReport />} />
        <Route path="create-sprint" element={<CreateSprintForm />} />
        <Route path="sprint-list" element={<SprintList />} />
        <Route path="risk-analysis-report" element={<RiskAnalysisReport />} />
        <Route path="due-date-forecasting" element={<DueDateForecasting />} />
        <Route path="priority-breakdown-report" element={<PriorityBreakdownReport />} />
        <Route path="work-load-report" element={<WorkLoadReport />} />
        <Route path="upgrade" element={<Upgrade />} />
        <Route path="issueboard" element={
          <FilterProvider>
            <IssueBoard />
          </FilterProvider>
        } />
        {/* Define other nested routes as needed */}
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboard;
