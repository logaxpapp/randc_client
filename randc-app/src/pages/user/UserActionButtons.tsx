// src/pages/user/components/UserActionButtons.tsx
import React from 'react';
import Button from '../../components/ui/Button';
import { FaPlus, FaChartBar, FaClipboardList } from 'react-icons/fa';

interface Props {
  setToastOpen: (value: boolean) => void;
  setIsBookingModalOpen: (value: boolean) => void;
}

const UserActionButtons: React.FC<Props> = ({ setToastOpen, setIsBookingModalOpen }) => {
  return (
    <div className="flex flex-wrap gap-4">
      <Button onClick={() => setIsBookingModalOpen(true)} variant="primary">
        <FaPlus className="mr-2" /> Book New Service
      </Button>
      <Button onClick={() => setToastOpen(true)} variant="secondary">
        <FaChartBar className="mr-2" /> View Reports
      </Button>
      <Button variant="tertiary">
        <FaClipboardList className="mr-2" /> Manage Bookings
      </Button>
    </div>
  );
};

export default UserActionButtons;
