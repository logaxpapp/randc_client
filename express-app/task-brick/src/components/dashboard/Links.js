
import { AiOutlineCalendar, AiOutlineShoppingCart, AiOutlineAreaChart, AiOutlineBarChart, AiOutlineStock } from 'react-icons/ai';
import { FiShoppingBag, FiEdit, FiPieChart } from 'react-icons/fi';
import { BsKanban, BsBarChart, BsColumnsGap } from 'react-icons/bs';
import { BiColorFill } from 'react-icons/bi';
import { IoMdContacts } from 'react-icons/io';
import { RiContactsLine, RiStockLine } from 'react-icons/ri';
import { GiLouvrePyramid } from 'react-icons/gi';
import ViewListIcon from '@mui/icons-material/ViewList';
import ListAltIcon from '@mui/icons-material/ListAlt';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';


export const links = [
    {
      title: 'Project',
      links: [
        {
          name: 'Dashboard',
          url: '',
          icon: <AiOutlineCalendar />,
        },
        {
          name: 'Recent Activities',
          url: 'recent-project',
          icon: <FiShoppingBag />,
        },
        {
          name: 'Statistics',
          url: 'statistics',
          icon: <GiLouvrePyramid />,
        },
        {
          name: 'Projects',
          url: 'recent-projects',
          icon: <BiColorFill />,
        },
        {
          name: 'Create New Project',
        url: 'create-project',
        icon: <GiLouvrePyramid />,
        }
      ],
    },
  
    {
      title: 'Pages',
      links: [
        {
          name: 'orders',

          icon: <AiOutlineShoppingCart />,
        },
        {
          name: 'employees',
          icon: <IoMdContacts />,
        },
        {
          name: 'customers',
          icon: <RiContactsLine />,
        },
      ],
    },
    {
      title: 'Tasks',
      links: [
        {
          name: 'create-task',
          url: 'create-task',
          icon: <ListAltIcon />,
        },
        {
          name: 'tasklist',
          icon: <ViewListIcon />,
        },
        {
          name: 'Issueboard',
          url: 'issueboard',
          icon: <DashboardIcon />,
        },
        {
          name: 'taskdetails',
          icon: <AssignmentIcon />,
        },
      ],
    },
   
    {
      title: 'Apps',
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
          name: 'scrumlist',
          url: 'scrum-list',
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
          name: 'line',
          icon: <AiOutlineStock />,
        },
        {
          name: 'area',
          icon: <AiOutlineAreaChart />,
        },
  
        {
          name: 'bar',
          icon: <AiOutlineBarChart />,
        },
        {
          name: 'pie',
          icon: <FiPieChart />,
        },
        {
          name: 'financial',
          icon: <RiStockLine />,
        },
        {
          name: 'color-mapping',
          icon: <BsBarChart />,
        },
        {
          name: 'pyramid',
          icon: <GiLouvrePyramid />,
        },
        {
          name: 'stacked',
          icon: <AiOutlineBarChart />,
        },
      ],
    },
  ];
  