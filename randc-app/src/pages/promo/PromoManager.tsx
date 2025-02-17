import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  useListPromosQuery,
  useCreatePromoMutation,
  useUpdatePromoMutation,
  useDeletePromoMutation,
  useValidatePromoQuery,
  useLazyValidatePromoQuery,
  PromoPayload,
} from '../../features/promo/promoApi';

/* ------------------------------------------------------------------
   1) CUSTOM UI COMPONENTS (Tailwind-based)
   ------------------------------------------------------------------ */

/** A simple button with variants (default, outline, destructive). */
const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' | 'destructive' | 'ghost' }
> = ({ children, variant = 'default', className = '', ...rest }) => {
  let baseClasses =
    'inline-flex items-center px-4 py-2 text-sm font-medium transition rounded focus:outline-none focus:ring-2 focus:ring-offset-2';
  let variantClasses = '';

  switch (variant) {
    case 'outline':
      variantClasses = 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50';
      break;
    case 'destructive':
      variantClasses = 'bg-red-600 text-white hover:bg-red-700';
      break;
    default:
      // default
      variantClasses = 'bg-blue-600 text-white hover:bg-blue-700';
      break;
  }

  return (
    <button className={`${baseClasses} ${variantClasses} ${className}`} {...rest}>
      {children}
    </button>
  );
};

/** A simple card wrapper with optional shadow & spacing. */
const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...rest }) => {
  return (
    <div
      className={`bg-white border border-gray-200 rounded shadow-sm p-4 ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};

/** Sub-component for card header (title or other header content). */
const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...rest }) => {
  return (
    <div className={`mb-3 ${className}`} {...rest}>
      {children}
    </div>
  );
};

/** Sub-component for card title (usually an <h2> or <h3>). */
const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, className = '', ...rest }) => {
  return (
    <h2 className={`text-lg font-semibold ${className}`} {...rest}>
      {children}
    </h2>
  );
};

/** Sub-component for card content (main body). */
const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...rest }) => {
  return (
    <div className={`text-sm space-y-2 ${className}`} {...rest}>
      {children}
    </div>
  );
};

/** Sub-component for card footer (actions or summary). */
const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...rest }) => {
  return (
    <div className={`mt-4 flex items-center space-x-2 ${className}`} {...rest}>
      {children}
    </div>
  );
};

/** A basic label with a consistent style. */
const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ children, className = '', ...rest }) => {
  return (
    <label className={`block text-sm font-medium text-gray-700 mb-1 ${className}`} {...rest}>
      {children}
    </label>
  );
};

/** A basic text input styled with Tailwind. */
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...rest }) => {
  return (
    <input
      className={`block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 ${className}`}
      {...rest}
    />
  );
};

/** A minimal "select" component for showing options (e.g. discountType). */
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
}
const Select: React.FC<SelectProps> = ({ className = '', options, ...rest }) => {
  return (
    <select
      className={`block w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 ${className}`}
      {...rest}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

/** A simple horizontal separator (similar to <hr>) */
const Separator: React.FC<React.HTMLAttributes<HTMLHRElement>> = ({ className = '', ...rest }) => {
  return <hr className={`border-gray-200 my-4 ${className}`} {...rest} />;
};

/** A basic toggle switch. */
interface SwitchProps {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
}
const Switch: React.FC<SwitchProps> = ({ checked, onCheckedChange }) => {
  const handleClick = () => {
    onCheckedChange && onCheckedChange(!checked);
  };

  return (
    <button
      type="button"
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
        checked ? 'bg-blue-600' : 'bg-gray-300'
      }`}
      onClick={handleClick}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-4' : 'translate-x-1'
        }`}
      />
    </button>
  );
};

/* ------------------------------------------------------------------
   2) PROMO MANAGER COMPONENT
   ------------------------------------------------------------------ */

const PromoManager: React.FC = () => {
  // === Hooks & State ===
  const { data: promoList = [], isLoading, isError } = useListPromosQuery();
  const [createPromo, { isLoading: isCreating }] = useCreatePromoMutation();
  const [updatePromo, { isLoading: isUpdating }] = useUpdatePromoMutation();
  const [deletePromo, { isLoading: isDeleting }] = useDeletePromoMutation();

  // For code validation example
  const [codeToValidate, setCodeToValidate] = useState('');
  const [serviceIdToValidate, setServiceIdToValidate] = useState('');
  const [
    triggerValidate,
    { data: validatedData, error: validateError, isFetching: isValidating },
  ] = useLazyValidatePromoQuery();
  

  // State for new promo creation
  const [newPromo, setNewPromo] = useState<Partial<PromoPayload>>({
    code: '',
    description: '',
    discountType: 'PERCENT',
    discountValue: 10,
    usageLimit: 0,
    isActive: true,
    appliesToAllServices: true,
  });

  // State for editing an existing promo
  const [editPromoId, setEditPromoId] = useState<string | null>(null);
  const [editPromoData, setEditPromoData] = useState<Partial<PromoPayload>>({});

  // === Handlers ===

  // Create a new promo
  const handleCreatePromo = async () => {
    try {
      await createPromo(newPromo).unwrap();
      alert('Promo created successfully!');
      setNewPromo({
        code: '',
        description: '',
        discountType: 'PERCENT',
        discountValue: 10,
        usageLimit: 0,
        isActive: true,
        appliesToAllServices: true,
      });
    } catch (err) {
      alert('Error creating promo. Check console for details.');
      console.error(err);
    }
  };

  // Prepare to edit an existing promo
  const handleEditPromo = (promo: PromoPayload) => {
    setEditPromoId(promo._id!);
    setEditPromoData({
      code: promo.code,
      description: promo.description || '',
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      usageLimit: promo.usageLimit,
      isActive: promo.isActive,
      appliesToAllServices: promo.appliesToAllServices,
    });
  };

  // Update an existing promo
  const handleUpdatePromo = async () => {
    if (!editPromoId) return;
    try {
      await updatePromo({ promoId: editPromoId, body: editPromoData }).unwrap();
      alert('Promo updated successfully!');
      setEditPromoId(null);
      setEditPromoData({});
    } catch (err) {
      alert('Error updating promo.');
      console.error(err);
    }
  };

  // Delete an existing promo
  const handleDeletePromo = async (promoId: string) => {
    if (!window.confirm('Are you sure you want to delete this promo?')) return;
    try {
      await deletePromo(promoId).unwrap();
      alert('Promo deleted successfully!');
    } catch (err) {
      alert('Error deleting promo.');
      console.error(err);
    }
  };

  // Validate promo code
  const handleValidatePromo = () => {
    console.log('Validate button clicked!', codeToValidate, serviceIdToValidate);
    if (!codeToValidate) {
      alert('Please enter a promo code before validating.');
      return;
    }
    triggerValidate({ code: codeToValidate, serviceId: serviceIdToValidate });
  };
  

  // === Render ===
  return (
    <motion.div
      className="container mx-auto p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* ===== The Vital Message Banner (always displayed) ===== */}
      <div className="mb-4 bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 sticky top-0 z-10">
        <p className="font-semibold text-sm">
          ⚡ Manage and Validate your Promo Codes efficiently! ⚡
        </p>
      </div>

      {/* ===== Create Promo Section ===== */}
      <Card className="mb-6 shadow-lg">
        <CardHeader>
          <CardTitle>Create a New Promo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="promo-code">Code</Label>
              <Input
                id="promo-code"
                value={newPromo.code || ''}
                onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value })}
                placeholder="e.g. SUMMER25"
              />
            </div>
            <div>
              <Label htmlFor="promo-desc">Description</Label>
              <Input
                id="promo-desc"
                value={newPromo.description || ''}
                onChange={(e) => setNewPromo({ ...newPromo, description: e.target.value })}
                placeholder="Optional description"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div>
              <Label>Discount Type</Label>
              <Select
                value={newPromo.discountType}
                onChange={(e) => setNewPromo({ ...newPromo, discountType: e.target.value as any })}
                options={[
                  { value: 'PERCENT', label: 'PERCENT' },
                  { value: 'FIXED', label: 'FIXED' },
                ]}
              />
            </div>
            <div>
              <Label htmlFor="promo-value">Discount Value</Label>
              <Input
                type="number"
                id="promo-value"
                value={newPromo.discountValue || 0}
                onChange={(e) => setNewPromo({ ...newPromo, discountValue: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="promo-limit">Usage Limit</Label>
              <Input
                type="number"
                id="promo-limit"
                value={newPromo.usageLimit || 0}
                onChange={(e) => setNewPromo({ ...newPromo, usageLimit: Number(e.target.value) })}
              />
              <p className="text-xs text-gray-600">0 means unlimited</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 mt-4">
            <div className="flex items-center space-x-2">
              <Label>Is Active?</Label>
              <Switch
                checked={newPromo.isActive!}
                onCheckedChange={(checked) => setNewPromo({ ...newPromo, isActive: checked })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label>Applies to All Services?</Label>
              <Switch
                checked={newPromo.appliesToAllServices!}
                onCheckedChange={(checked) =>
                  setNewPromo({ ...newPromo, appliesToAllServices: checked })
                }
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleCreatePromo} disabled={isCreating}>
            {isCreating ? 'Creating...' : 'Create Promo'}
          </Button>
        </CardFooter>
      </Card>

      {/* ===== Promos List & Edit ===== */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
      >
        <h2 className="text-xl font-bold mb-2">Existing Promos</h2>
        <Separator />

        {isLoading && <p>Loading promos...</p>}
        {isError && <p className="text-red-600">Error loading promos</p>}

        {!isLoading && !isError && (
        promoList.length === 0 ? (
          <p className="text-gray-600">No promo codes found yet. Create one above!</p>
        ) : (
          <div className="space-y-4">
          {promoList.map((promo) => {
            const isEditing = editPromoId === promo._id;
            return (
                <Card key={promo._id} className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex justify-between">
                      <span>
                        Code: <span className="font-mono">{promo.code}</span>
                      </span>
                      <span className="text-sm text-gray-500">ID: {promo._id}</span>
                    </CardTitle>
                  </CardHeader>

                  {!isEditing ? (
                    // --- READ-ONLY VIEW ---
                    <CardContent className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div>
                        <Label>Description</Label>
                        <p className="text-gray-700">{promo.description || 'N/A'}</p>
                      </div>
                      <div>
                        <Label>Type / Value</Label>
                        <p className="text-gray-700">
                          {promo.discountType} / {promo.discountValue}
                        </p>
                      </div>
                      <div>
                        <Label>Usage</Label>
                        <p className="text-gray-700">
                          {promo.usedCount} / {promo.usageLimit === 0 ? '∞' : promo.usageLimit}
                        </p>
                      </div>
                      <div>
                        <Label>Status</Label>
                        <p className="text-gray-700">
                          {promo.isActive ? 'Active' : 'Inactive'} |{' '}
                          {promo.appliesToAllServices ? 'All Services' : 'Selected Services Only'}
                        </p>
                      </div>
                    </CardContent>
                  ) : (
                    // --- EDIT VIEW ---
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label>Code</Label>
                          <Input
                            value={editPromoData.code || ''}
                            onChange={(e) =>
                              setEditPromoData({ ...editPromoData, code: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Input
                            value={editPromoData.description || ''}
                            onChange={(e) =>
                              setEditPromoData({
                                ...editPromoData,
                                description: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <Label>Discount Type</Label>
                          <Select
                            value={editPromoData.discountType}
                            onChange={(e) =>
                              setEditPromoData({
                                ...editPromoData,
                                discountType: e.target.value as any,
                              })
                            }
                            options={[
                              { value: 'PERCENT', label: 'PERCENT' },
                              { value: 'FIXED', label: 'FIXED' },
                            ]}
                          />
                        </div>
                        <div>
                          <Label>Discount Value</Label>
                          <Input
                            type="number"
                            value={editPromoData.discountValue || 0}
                            onChange={(e) =>
                              setEditPromoData({
                                ...editPromoData,
                                discountValue: Number(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>Usage Limit</Label>
                          <Input
                            type="number"
                            value={editPromoData.usageLimit || 0}
                            onChange={(e) =>
                              setEditPromoData({
                                ...editPromoData,
                                usageLimit: Number(e.target.value),
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Label>Is Active?</Label>
                          <Switch
                            checked={!!editPromoData.isActive}
                            onCheckedChange={(checked) =>
                              setEditPromoData({ ...editPromoData, isActive: checked })
                            }
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Label>All Services?</Label>
                          <Switch
                            checked={!!editPromoData.appliesToAllServices}
                            onCheckedChange={(checked) =>
                              setEditPromoData({
                                ...editPromoData,
                                appliesToAllServices: checked,
                              })
                            }
                          />
                        </div>
                      </div>
                    </CardContent>
                  )}

                  <CardFooter>
                    {!isEditing ? (
                      <>
                        <Button variant="outline" onClick={() => handleEditPromo(promo)}>
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeletePromo(promo._id!)}
                          disabled={isDeleting}
                        >
                          {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="default" onClick={handleUpdatePromo} disabled={isUpdating}>
                          {isUpdating ? 'Updating...' : 'Save'}
                        </Button>
                        <Button variant="ghost" onClick={() => setEditPromoId(null)}>
                          Cancel
                        </Button>
                      </>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )
        )}
      </motion.div>

      {/* ===== Validate Promo Section ===== */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Validate a Promo Code</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Promo Code</Label>
              <Input
                placeholder="Enter code to validate"
                value={codeToValidate}
                onChange={(e) => setCodeToValidate(e.target.value)}
              />
            </div>
            <div>
              <Label>Service ID</Label>
              <Input
                placeholder="Optional serviceId"
                value={serviceIdToValidate}
                onChange={(e) => setServiceIdToValidate(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Some promos only apply to certain services
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleValidatePromo} disabled={isValidating}>
            {isValidating ? 'Validating...' : 'Validate'}
          </Button>
          {validatedData && (
            <div className="ml-4 flex items-center p-3 bg-green-50 border border-green-200 rounded-lg shadow-sm">
            {/* Checkmark Icon */}
            <svg
              className="w-5 h-5 text-green-600 mr-2 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.172l7.879-7.879a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            {/* Promo Info */}
            <span className="text-green-700 text-sm">
              <strong>Valid:</strong> {validatedData.code}{" "}
              <span className="mx-1">|</span> {validatedData.discountType} /{" "}
              {validatedData.discountValue}
            </span>
          </div>
          
          )}
          {validateError && (
            <div className="ml-4 text-red-600 text-sm">
              {JSON.stringify((validateError as any).data?.message || 'Invalid code')}
            </div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default PromoManager;
