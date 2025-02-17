// src/components/layouts/PowerfulEmailEditor.tsx

import React, { useState } from 'react';
import {
  MdCleaningServices,
  MdOutlineSanitizer,
  MdOutlineTextFields,
  MdOutlineTipsAndUpdates,
  MdFormatListNumbered,
  MdDoneAll,
  MdPhotoCamera,
  MdVideoLibrary,
  MdHorizontalRule,
  MdClose,
} from 'react-icons/md';
import { FaBroom, FaSoap } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// Example images for each step
import OverviewImage from '../../assets/images/stock9.png';
import CleaningStepsImage from '../../assets/images/stock8.png';
import ReviewConfirmImage from '../../assets/images/stock6.png';

/**
 * A mock data structure to define our content blocks.
 * Each block can hold a label, icon, and some "help text."
 */
const CONTENT_BLOCKS = [
  {
    key: 'sweepFloors',
    label: 'Sweep Floors',
    icon: <FaBroom />,
    helpText: 'Use a dry broom to remove large debris before mopping.',
  },
  {
    key: 'sanitizeSurfaces',
    label: 'Sanitize Surfaces',
    icon: <MdCleaningServices />,
    helpText: 'Apply disinfectant spray to surfaces and wipe thoroughly.',
  },
  {
    key: 'applyDetergent',
    label: 'Apply Detergent',
    icon: <FaSoap />,
    helpText: 'Mix detergent with warm water to remove stubborn stains.',
  },
  {
    key: 'useDisinfectant',
    label: 'Use Disinfectant',
    icon: <MdOutlineSanitizer />,
    helpText: 'Kills bacteria and viruses—especially critical on high-touch areas.',
  },
  {
    key: 'addTextNote',
    label: 'Add Text Note',
    icon: <MdOutlineTextFields />,
    helpText: 'Insert additional instructions or commentary here.',
  },
  {
    key: 'safetyTips',
    label: 'Safety Tips',
    icon: <MdOutlineTipsAndUpdates />,
    helpText: 'Wear gloves and mask when dealing with chemicals.',
  },
  {
    key: 'checklists',
    label: 'Checklists',
    icon: <MdFormatListNumbered />,
    helpText: 'Keep track of tasks in order: from dusting to finishing touches.',
  },
  {
    key: 'divider',
    label: 'Section Divider',
    icon: <MdHorizontalRule />,
    helpText: 'Visually separate sections or categories of tasks.',
  },
  {
    key: 'attachPhotos',
    label: 'Attach Photos',
    icon: <MdPhotoCamera />,
    helpText: 'Show before/after pictures to demonstrate your cleaning success!',
  },
  {
    key: 'embedVideo',
    label: 'Embed Video',
    icon: <MdVideoLibrary />,
    helpText: 'Include cleaning tutorial or instruction videos.',
  },
  {
    key: 'markCompleted',
    label: 'Mark Completed',
    icon: <MdDoneAll />,
    helpText: 'Indicate that a cleaning step or entire job is done!',
  },
];

/** Steps top nav: 1) Overview, 2) Cleaning Steps, 3) Review & Confirm */
type Step = 1 | 2 | 3;

export default function PowerfulEmailEditor() {
  /**
   * Manage which step is currently active.
   * (1) Overview, (2) Steps, (3) Review)
   */
  const [activeStep, setActiveStep] = useState<Step>(1);

  /**
   * Keep track of which content block is currently "selected" for the modal.
   */
  const [selectedBlockKey, setSelectedBlockKey] = useState<string | null>(null);

  /**
   * If user hits "Next," increment the step up to the next one (1->2->3).
   * If at 3, maybe do something else, etc.
   */
  const handleNext = () => {
    setActiveStep((prev) => (prev < 3 ? (prev + 1) as Step : 3));
  };

  /**
   * Based on active step, pick which image to show in the left panel.
   */
  const getStepImage = () => {
    switch (activeStep) {
      case 1:
        return OverviewImage;
      case 2:
        return CleaningStepsImage;
      case 3:
        return ReviewConfirmImage;
      default:
        return OverviewImage;
    }
  };

  /**
   * Find the currently selected block object (for the modal).
   */
  const currentBlock = CONTENT_BLOCKS.find((b) => b.key === selectedBlockKey);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-lime-100 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-md py-3 px-2 flex items-center justify-between">
        <nav className="flex items-center space-x-4 text-xs  text-gray-600">
          <StepIndicator stepNumber={1} label="Overview" active={activeStep === 1} onClick={() => setActiveStep(1)} />
          <StepIndicator stepNumber={2} label="Cleaning Steps" active={activeStep === 2} onClick={() => setActiveStep(2)} />
          <StepIndicator stepNumber={3} label="Review & Confirm" active={activeStep === 3} onClick={() => setActiveStep(3)} />
        </nav>
        <div>
          <button
            onClick={handleNext}
            className="px-4 py-2 font-medium bg-amber-600 text-white rounded hover:bg-amber-700 transition"
          >
            {activeStep < 3 ? 'Next' : 'Finish'}
          </button>
        </div>
      </header>

      {/* Main Content Area, centered with a max width */}
      <main className="flex-1 p-6 w-full mx-auto flex gap-6">
        {/* Left Panel: Full image */}
        <aside className="flex-1 bg-white rounded-lg shadow-md overflow-hidden flex items-center justify-center">
          <img
            src={getStepImage()}
            alt={`Step ${activeStep}`}
            className="w-full h-auto object-cover p-2 rounded-2xl"
          />
        </aside>

        {/* Right Panel: Content Blocks */}
        {/**
         * We'll add a framer-motion "ul" wrapper to animate the list with stagger effect.
         * Each ContentBlockButton is also a motion.li to fade in & move slightly upward.
         */}
        <motion.aside
          className="w-1/4 bg-white rounded-lg shadow-md p-4 overflow-auto"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Cleaning Components</h2>

          <motion.ul
            className="space-y-2 text-sm"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 1 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.05, // slight delay between items
                },
              },
            }}
          >
            {CONTENT_BLOCKS.map((block) => (
              <motion.li
                key={block.key}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                <ContentBlockButton
                  icon={block.icon}
                  label={block.label}
                  onClick={() => setSelectedBlockKey(block.key)}
                />
              </motion.li>
            ))}
          </motion.ul>
        </motion.aside>
      </main>

      {/* Modal for selected block */}
      <AnimatePresence>
        {selectedBlockKey && currentBlock && (
          <Modal onClose={() => setSelectedBlockKey(null)}>
            <div className="flex flex-col">
              {/* Modal Header */}
              <div className="bg-gray-100 px-6 py-4 rounded-t-lg flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="text-2xl">{currentBlock.icon}</span>
                  {currentBlock.label}
                </h2>
                <button
                  onClick={() => setSelectedBlockKey(null)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <MdClose size={24} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <p className="text-gray-700">{currentBlock.helpText}</p>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

/** A simple Modal component with backdrop and center alignment + framer-motion. */
function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  // We wrap both the backdrop and modal content in motion components.
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If the user clicks directly on the backdrop, close the modal.
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
        onClick={handleBackdropClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Modal Content Container */}
        <motion.div
          className="bg-white rounded-lg w-full max-w-md mx-4"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/** Step Indicator stays the same, but you can add subtle hover transitions with framer-motion if you wish. */
function StepIndicator({
  stepNumber,
  label,
  active = false,
  onClick,
}: {
  stepNumber: number;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-300 ease-in-out focus:outline-none ${
        active
          ? 'bg-amber-400 text-gray-900 shadow-sm hover:bg-amber-500'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition-transform duration-300 ${
          active ? 'bg-white text-gray-900 scale-110' : 'bg-gray-300 text-gray-600'
        }`}
      >
        {stepNumber}
      </div>
      <span
        className={`text-lg font-medium transition-colors duration-300 ${
          active ? 'text-gray-900 font-extrabold' : 'text-gray-700'
        }`}
      >
        {label}
      </span>
    </button>
  );
}

/** A regular button that you can also wrap in motion if desired. */
function ContentBlockButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-300 ease-in-out focus:outline-none
          bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:ring-2 focus:ring-blue-200"
    >
      <span className="text-xl">{icon}</span>
      <span className="flex-1 text-left font-medium">{label}</span>
    </button>
  );
}
