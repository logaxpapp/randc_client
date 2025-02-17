// src/pages/booking/BookingManager.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { FaCircleNotch } from 'react-icons/fa';
import { useSearchParams, useNavigate } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';

// Redux/RTK
import { useAppSelector } from '../../../app/hooks';
import {
  useGetServiceByIdQuery,
  useGetServiceSlotsByDateQuery,
  useCreateBookingMutation,
} from '../../../features/public/publicApi';

// Single endpoint to register+login
import { useRegisterAndLoginUserMutation } from '../../../features/auth/authApi';

// Steps
import StepSelectDateAndSlot from './StepSelectDateAndSlot';
import StepSpecialRequests from './StepSpecialRequests';
import StepPayment from './StepPayment';
import StepLoggedIn from './StepLoggedIn';
import StepConfirm from './StepConfirm';
import StepDone from './StepDone';
import Step4GuestOrEmail from './Step4GuestOrEmail';

// For special requests shape
import { SpecialRequests } from '../../../types/Booking';

// 1) Local wizard flow state
export interface BookingFlowState {
  step: number;
  serviceId: string;
  selectedDate: Date | null;
  selectedSlot: any | null;
  specialRequests: SpecialRequests;
  payNow: boolean;
  guestEmail: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
 
}

// 2) Reusable Step Wizard sidebar
function StepWizardSidebar({
  currentStep,
  steps,
}: {
  currentStep: number;
  steps: { number: number; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-2 md:gap-4">
      {steps.map((st) => {
        const isActive = st.number === currentStep;
        const isCompleted = st.number < currentStep;
        return (
          <div key={st.number} className="flex items-center gap-2">
            <div
              className={clsx(
                'w-4 h-4 rounded-full border-2 border-gray-300',
                isActive && 'border-blue-500 bg-blue-500',
                isCompleted && 'border-green-500 bg-green-500'
              )}
            />
            <span
              className={clsx(
                'text-sm',
                isActive && 'font-semibold text-blue-600',
                isCompleted && 'text-green-600 line-through'
              )}
            >
              {st.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

const BookingManager: React.FC = () => {
  // Always-on banner
  const VITAL_MESSAGE = 'Vital message: This flow uses register-and-login + auto OTP entry!';

  // If user is logged in
  const user = useAppSelector((state) => state.auth.user);

  // Router stuff
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const serviceIdParam = searchParams.get('serviceId') || '';

  // 3) Our local wizard state
  const [flow, setFlow] = useState<BookingFlowState>({
    step: 1,
    serviceId: serviceIdParam,
    selectedDate: null,
    selectedSlot: null,
    specialRequests: {},
    payNow: false,
    guestEmail: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  // Steps for the sidebar
  const stepLabels = [
    { number: 1, label: 'Select Date & Slot' },
    { number: 2, label: 'Special Requests' },
    { number: 3, label: 'Payment' },
    { number: 4, label: 'Account' },
    { number: 5, label: 'Confirm' },
    { number: 6, label: 'Done' },
  ];

  // 4) Queries for service & slots
  const {
    data: serviceData,
    isLoading: serviceLoading,
    error: serviceError,
  } = useGetServiceByIdQuery(flow.serviceId, { skip: !flow.serviceId });

  const dateParam = flow.selectedDate
    ? flow.selectedDate.toISOString().split('T')[0]
    : '';

  const {
    data: timeSlots,
    isLoading: slotsLoading,
    error: slotsError,
  } = useGetServiceSlotsByDateQuery(
    { serviceId: flow.serviceId, date: dateParam },
    { skip: !flow.serviceId || !dateParam }
  );

  // 5) createBooking
  const [createBooking, { isLoading: creatingBooking }] = useCreateBookingMutation();

  // 6) single RTK mutation for "register-and-login"
  const [triggerRegLoginUser] = useRegisterAndLoginUserMutation();

  // 7) We'll pass down a simpler function that returns a plain Promise
  async function registerAndLoginUser(args: {
    email: string;
    code?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
  }): Promise<any> {
    // call the RTK mutation
    const result = await triggerRegLoginUser(args);
    // if error
    if ('error' in result) {
      throw result.error;
    }
    return result.data; // success
  }

  // local messages
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Step nav
  function nextStep() {
    setFlow((prev) => ({ ...prev, step: prev.step + 1 }));
  }
  function prevStep() {
    setFlow((prev) => ({ ...prev, step: Math.max(1, prev.step - 1) }));
  }

  // Step 1
  function handleSelectDate(date: Date | null) {
    setFlow((prev) => ({ ...prev, selectedDate: date, selectedSlot: null }));
  }
  function handleSelectSlot(slotObj: any) {
    setFlow((prev) => ({ ...prev, selectedSlot: slotObj }));
  }

  // Step 2
  function handleSpecialRequestsSave(data: SpecialRequests) {
    setFlow((prev) => ({ ...prev, specialRequests: data }));
    nextStep();
  }

  // Step 3
  function handleSelectPayment(payNow: boolean) {
    setFlow((prev) => ({ ...prev, payNow }));
    nextStep();
  }

  // Step 4
  function handleGuestSelected(guestEmail: string) {
    setFlow((prev) => ({ ...prev, guestEmail }));
    nextStep();
  }
  function handleSignUpComplete({
    firstName,
    lastName,
    email,
  }: {
    firstName: string;
    lastName: string;
    email: string;
  }) {
    setFlow((prev) => ({ ...prev, firstName, lastName, email }));
    nextStep();
  }

  // Step 5 => confirm booking
  // STEP 5 => Confirm booking & create it in the DB
async function handleConfirmBooking() {
  setErrorMessage(null);
  setSuccessMessage(null);

  // Check if user is logged in
  const isUserLoggedIn = !!user?._id;
  
  // If user is NOT logged in, we only store nonUserEmail
  // If user is logged in, we store 'seeker' (the user._id) on the booking
  let finalEmail: string | undefined;
  let seekerId: string | undefined;

  if (!isUserLoggedIn) {
    finalEmail = flow.email || flow.guestEmail;
  } else {
    seekerId = user?._id; 
  }

  try {
    const newBooking = await createBooking({
      serviceId: flow.serviceId,
      timeSlotId: flow.selectedSlot?._id,
      notes: 'some notes',
      nonUserEmail: finalEmail,
      seeker: seekerId,  // <--- Add seeker if logged in
      specialRequests: flow.specialRequests,
    }).unwrap();

    setSuccessMessage(`Booking #${newBooking.shortCode} created successfully!`);
  } catch (err: any) {
    setErrorMessage(err?.data?.message || 'Failed to create booking.');
  }
}


  // 8) render step content
  function renderStepContent() {
    switch (flow.step) {
      case 1:
        return (
          <StepSelectDateAndSlot
            flow={flow}
            serviceData={serviceData}
            slotsLoading={slotsLoading}
            slotsError={slotsError}
            timeSlots={timeSlots}
            onSelectDate={handleSelectDate}
            onSelectSlot={handleSelectSlot}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <StepSpecialRequests
            flow={flow}
            onBack={prevStep}
            onSave={handleSpecialRequestsSave}
          />
        );
      case 3:
        return (
          <StepPayment
            flow={flow}
            onSelectPayment={handleSelectPayment}
            onBack={prevStep}
            onNext={nextStep}
          />
        );
      case 4:
        if (user?._id) {
          return <StepLoggedIn onBack={prevStep} onNext={nextStep} />;
        }
        return (
          <Step4GuestOrEmail
            flow={flow}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
            onGuestSelected={handleGuestSelected}
            onSignUpComplete={handleSignUpComplete}
            registerAndLoginUser={registerAndLoginUser}
            onBack={prevStep}
          />
        );
        case 5:
          return (
            <StepConfirm
              flow={flow}
              creatingBooking={creatingBooking}
              errorMessage={errorMessage}
              successMessage={successMessage}
              onConfirm={handleConfirmBooking}
              onBack={prevStep}
              onNext={() => setFlow((prev) => ({ ...prev, step: 6 }))}
          />
        );
        default:
          return <StepDone successMessage={successMessage} />;
      } // <-- THIS is the missing brace
    }

// Now we can proceed:
const isLoadingSomething = serviceLoading || (slotsLoading && flow.step === 1);

  return (
    <section className="relative w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-rose-50 overflow-hidden">
      {/* Vital banner */}
      <div className="sticky top-0 z-5 bg-yellow-300 text-yellow-900 p-2 font-bold text-center shadow">
        <p>{VITAL_MESSAGE}</p>
      </div>

      <div className="max-w-5xl mx-auto flex flex-col md:flex-row py-8 px-4 relative z-10">
        {/* Sidebar */}
        <aside className="md:w-1/5 bg-white/90 rounded-md p-8 h-auto md:sticky md:top-20 shadow">
          <h3 className="font-bold text-xl mb-4 text-gray-700 text-center border-b">
            Booking Steps
          </h3>
          <StepWizardSidebar currentStep={flow.step} steps={stepLabels} />
        </aside>

        {/* Main content */}
        <div className="md:w-3/4 bg-white rounded-md p-4 md:p-8 md:ml-4 shadow">
          <motion.h1
            className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Booking Manager
          </motion.h1>

          <div className="mb-4">
            {serviceLoading && (
              <div className="flex items-center gap-2 text-gray-500">
                <FaCircleNotch className="animate-spin" />
                <span>Loading service info...</span>
              </div>
            )}
            {serviceError && (
              <p className="text-red-500">Failed to load service details.</p>
            )}
            {serviceData && (
              <p className="text-sm text-gray-500">
                Booking <strong>{serviceData?.name}</strong>
              </p>
            )}
          </div>

          <div className="relative p-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={flow.step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Loader overlay if needed */}
      {isLoadingSomething && (
        <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center z-30">
          <div className="bg-white p-4 rounded-md shadow-md flex items-center gap-2">
            <FaCircleNotch className="animate-spin text-gray-500" />
            <span className="text-gray-500">Loading...</span>
          </div>
        </div>
      )}
    </section>
  );
};

export default BookingManager;
