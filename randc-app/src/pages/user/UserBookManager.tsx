// src/pages/booking/UserBookingManager.tsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCircleNotch } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';

// Steps
import StepNotes from '../../pages/booking/user/StepNotes';
import StepSelectDateAndSlot from '../../pages/booking/user/StepSelectDateAndSlot';
import StepSpecialRequests from '../../pages/booking/user/StepSpecialRequests';
import StepPayment from '../../pages/booking/user/StepPayment';
import StepConfirm from '../../pages/booking/user/StepConfirm';
import StepDone from '../../pages/booking/user/StepDone';

// RTK queries
import {
  useGetServiceByIdQuery,
  useGetServiceSlotsByDateQuery,
 
} from '../../features/public/publicApi';

import {  useCreateBookingMutation } from '../../features/booking/bookingApi';

import { SpecialRequests } from '../../types/Booking';

interface BookingFlowState {
  step: number;
  serviceId: string;
  selectedDate: Date | null;
  selectedSlot: any | null;
  specialRequests: SpecialRequests;
  payNow: boolean;
  notes?: string;
}

const stepLabels = [
  { number: 1, label: 'Select Date & Slot' },
  { number: 2, label: 'Special Requests' },
  { number: 3, label: 'Notes' },
  { number: 4, label: 'Payment' },
  { number: 5, label: 'Confirm' },
  { number: 6, label: 'Done' },
];

// Simple step sidebar
function StepWizardSidebar({
  currentStep,
  steps,
}: {
  currentStep: number;
  steps: { number: number; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-2">
      {steps.map((st) => {
        const isActive = st.number === currentStep;
        const isCompleted = st.number < currentStep;
        return (
          <div key={st.number} className="flex items-center gap-2">
            <div
              className={
                'w-4 h-4 rounded-full border-2 ' +
                (isActive
                  ? 'border-blue-500 bg-blue-500'
                  : isCompleted
                  ? 'border-green-500 bg-green-500'
                  : 'border-gray-300')
              }
            />
            <span
              className={
                'text-sm ' +
                (isActive
                  ? 'font-semibold text-blue-600'
                  : isCompleted
                  ? 'text-green-600 line-through'
                  : '')
              }
            >
              {st.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

const UserBookingManager: React.FC = () => {
  const [searchParams] = useSearchParams();
  const user = useAppSelector((state) => state.auth.user);

  // If no user => error
  if (!user?._id) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">You must be logged in to make a booking.</p>
      </div>
    );
  }

  // Wizard state
  const [flow, setFlow] = useState<BookingFlowState>({
    step: 1,
    serviceId: searchParams.get('serviceId') || '',
    selectedDate: null,
    selectedSlot: null,
    specialRequests: {},
    payNow: false,
    notes: '',
  });

  // Load service/time slots
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

  // createBooking mutation
  const [createBooking, { isLoading: creatingBooking }] = useCreateBookingMutation();

  // messages
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
  function handleNotesSave(notes: string) {
    setFlow((prev) => ({ ...prev, notes }));
    nextStep();
  }

  // Step 4
  function handleSelectPayment(payNow: boolean) {
    setFlow((prev) => ({ ...prev, payNow }));
    nextStep();
  }

  // Step 5 => confirm => create booking
  async function handleConfirmBooking() {
    setErrorMessage(null);
    setSuccessMessage(null);

    // See exactly what we are about to send
    const payload = {
      serviceId: flow.serviceId,
      timeSlotId: flow.selectedSlot?._id,
      notes: flow.notes,
      seeker: user._id, // CRUCIAL
      specialRequests: flow.specialRequests,
    };
    console.log('Creating booking with payload:', payload);

    try {
      const booking = await createBooking(payload).unwrap();
      setSuccessMessage(`Booking #${booking.shortCode} created successfully!`);
      console.log('createBooking response:', booking);
    } catch (err: any) {
      console.error('createBooking error:', err);
      setErrorMessage(err?.data?.message || 'Failed to create booking.');
    }
  }

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
          <StepNotes
            flow={flow}
            onBack={prevStep}
            onNext={handleNotesSave}
          />
        );
      case 4:
        return (
          <StepPayment
            flow={flow}
            onSelectPayment={handleSelectPayment}
            onBack={prevStep}
            onNext={nextStep}
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
    }
  }

  const isLoadingSomething = serviceLoading || (slotsLoading && flow.step === 1);

  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row py-8 px-4">
        <aside className="md:w-1/5 p-8 shadow">
          {/* step sidebar */}
          <StepWizardSidebar currentStep={flow.step} steps={stepLabels} />
        </aside>

        <div className="md:w-3/4 bg-white rounded p-4 md:ml-4 shadow relative">
          {/* Service loading states */}
          {serviceLoading && (
            <div className="text-gray-500 flex items-center gap-2">
              <FaCircleNotch className="animate-spin" />
              Loading service...
            </div>
          )}
          {serviceError && (
            <div className="text-red-500">Failed to load service.</div>
          )}
          {serviceData && (
            <p className="text-sm text-gray-700 mb-4">
              Booking: <strong>{serviceData.name}</strong>
            </p>
          )}

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

      {isLoadingSomething && (
        <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-md flex items-center gap-2">
            <FaCircleNotch className="animate-spin" />
            <span>Loading...</span>
          </div>
        </div>
      )}
   {/* ─────────────────────────────────────────────────────
          Bottom Wave
         ───────────────────────────────────────────────────── */}
      <div className="absolute bottom-0 w-full leading-none z-0">
        <svg
          className="block w-full h-20 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#3b82f6"
            fillOpacity="1"
            d="M0,64L48,64C96,64,192,64,288,101.3C384,139,480,213,576,224
              C672,235,768,181,864,165.3C960,149,1056,171,1152,186.7
              C1248,203,1344,213,1392,218.7L1440,224L1440,0
              L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0
              C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default UserBookingManager;
