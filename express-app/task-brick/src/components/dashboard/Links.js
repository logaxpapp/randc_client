
import { AiOutlineCalendar, AiOutlineShoppingCart, AiOutlineAreaChart, AiOutlineBarChart, AiOutlineStock } from 'react-icons/ai';
import { FiShoppingBag, FiEdit, FiPieChart } from 'react-icons/fi';
import { BsKanban, BsBarChart, BsColumnsGap } from 'react-icons/bs';
import { BiColorFill } from 'react-icons/bi';

import {  RiStockLine } from 'react-icons/ri';
import { GiLouvrePyramid } from 'react-icons/gi';




export const links = [
    {
      title: 'Project',
      links: [
        {
          name: 'Events',
          url: '',
          icon: <AiOutlineCalendar />,
        },
        {
          name: 'Recent Activities',
          url: 'recent-project',
          icon: <FiShoppingBag />,
        },
        {
          name: 'Projects',
          url: 'recent-projects',
          icon: <BiColorFill />,
        },
        {
          name: 'New Project',
        url: 'create-project',
        icon: <GiLouvrePyramid />,
        }
      ],
    },
  

    {
      title: 'Tasks',
      links: [
        {
          name: 'create-task',
          url: 'create-task',
          icon: <AiOutlineShoppingCart />,
        },
        {
          name: 'Issueboard',
          url: 'issueboard',
          icon: <BsBarChart />,
        },
      ],
    },
   
    {
      title: 'Board',
      links: [
       
        {
          name: 'kanban',
          url:  'kanban',
          icon: <BsKanban />,
        },
        {
          name: 'Scrum',
          url: 'scrum',
          icon:  <BsColumnsGap />,
        },
     {
          name: 'editor',
          icon: <FiEdit />,
        },
      
      ],
    },
    {
      title: 'Reports',
      links: [
        {
          name: 'Activity',
          url: 'activity-report',
          icon: <AiOutlineStock />,
        },
        {
          name: 'Risk Analysis',
          url: 'risk-analysis-report',
          icon: <AiOutlineAreaChart />,
        },
  
        {
          name: 'Due Date Forecasting',
          url: 'due-date-forecasting',
          icon: <AiOutlineBarChart />,
        },
        {
          name: 'Priority Breakdown',
          url: 'priority-breakdown-report',
          icon: <AiOutlineBarChart />,
          icon: <FiPieChart />,
        },
        {
          name: 'Work Load',
          url: 'work-load-report',
          icon: <RiStockLine />,
        },
      ],
    },
    {
      title: 'Sprints',
      links: [
        {
          name: 'Sprints',
          url: 'sprint-list',
          icon: <AiOutlineCalendar />,
        },
        {
          name: 'Create Sprint',
          url: 'create-sprint',
          icon: <FiShoppingBag />,
        },
        {
          name: 'Sprint Tasks',
          url: 'create-sprinttask',
          icon: <GiLouvrePyramid />,
        },
        {
          name: 'Task List',
          url: 'sprint_task',
          icon: <BiColorFill />,
        },
        {
          name: 'Sprint Details',
        url: 'create-project',
        icon: <GiLouvrePyramid />,
        }
      ],
    },
  ];
  