// src/pages/admin/tenant-tabs/AllTenants.tsx

import React, { useState } from 'react';
import {
  useListTenantsQuery,
  useDeleteTenantMutation,
  useSuspendTenantMutation,
  useUnsuspendTenantMutation,
  useUpdateTenantMutation,
} from '../../features/tenant/tenantApi';
import { Tenant } from '../../types/Tenant';
import ActionDropdown from './ActionDropdown';
import ConfirmationDialog from '../../components/ui/ConfirmDialog';
import UpdateTenantModal from './UpdateTenantModal';
import { FaSpinner } from 'react-icons/fa';

import clsx from 'clsx';

const AllTenants: React.FC = () => {
  // State for confirmation dialog
  const [confirmation, setConfirmation] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    action: () => void;
  }>({ isOpen: false, title: '', message: '', action: () => {} });

  // State for update modal
  const [updateModal, setUpdateModal] = useState<{
    isOpen: boolean;
    tenant: Tenant | null;
  }>({ isOpen: false, tenant: null });

  // RTK Query hooks
  const { data: tenants, isLoading, isError, refetch } = useListTenantsQuery();
  const [deleteTenant, { isLoading: isDeleting }] = useDeleteTenantMutation();
  const [suspendTenant, { isLoading: isSuspending }] = useSuspendTenantMutation();
  const [unsuspendTenant, { isLoading: isUnsuspending }] = useUnsuspendTenantMutation();
  const [updateTenant, { isLoading: isUpdating }] = useUpdateTenantMutation();

  // Handlers for actions
  const handleDelete = (tenant: Tenant) => {
    setConfirmation({
      isOpen: true,
      title: 'Confirm Delete',
      message: `Are you sure you want to delete tenant "${tenant.name}"? This action cannot be undone.`,
      action: async () => {
        try {
          await deleteTenant(tenant._id).unwrap();
          refetch();
          // Optionally, show success toast
        } catch (error) {
          console.error('Delete Tenant Error:', error);
          // Optionally, show error toast
        } finally {
          setConfirmation({ isOpen: false, title: '', message: '', action: () => {} });
        }
      },
    });
  };

  const handleSuspend = (tenant: Tenant) => {
    setConfirmation({
      isOpen: true,
      title: 'Confirm Suspend',
      message: `Are you sure you want to suspend tenant "${tenant.name}"?`,
      action: async () => {
        try {
          await suspendTenant(tenant._id).unwrap();
          refetch();
          // Optionally, show success toast
        } catch (error) {
          console.error('Suspend Tenant Error:', error);
          // Optionally, show error toast
        } finally {
          setConfirmation({ isOpen: false, title: '', message: '', action: () => {} });
        }
      },
    });
  };

  const handleUnsuspend = (tenant: Tenant) => {
    setConfirmation({
      isOpen: true,
      title: 'Confirm Unsuspend',
      message: `Are you sure you want to unsuspend tenant "${tenant.name}"?`,
      action: async () => {
        try {
          await unsuspendTenant(tenant._id).unwrap();
          refetch();
          // Optionally, show success toast
        } catch (error) {
          console.error('Unsuspend Tenant Error:', error);
          // Optionally, show error toast
        } finally {
          setConfirmation({ isOpen: false, title: '', message: '', action: () => {} });
        }
      },
    });
  };

  const handleUpdate = (tenant: Tenant) => {
    setUpdateModal({ isOpen: true, tenant });
  };

  const handleUpdateSubmit = async (updatedData: Partial<Tenant>) => {
    if (updateModal.tenant) {
      try {
        await updateTenant({
          tenantId: updateModal.tenant._id,
          data: updatedData,
        }).unwrap();
        refetch();
        setUpdateModal({ isOpen: false, tenant: null });
        // Optionally, show success toast
      } catch (error) {
        console.error('Update Tenant Error:', error);
        // Optionally, show error toast
      }
    }
  };

  const handleUpdateCancel = () => {
    setUpdateModal({ isOpen: false, tenant: null });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <FaSpinner className="animate-spin text-3xl text-blue-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-600 py-10">
        <p>Failed to load tenants. Please try again later.</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Tenant Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg shadow">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Domain</th>
              <th className="py-2 px-4 border-b text-left">Status</th>
              <th className="py-2 px-4 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tenants && tenants.length > 0 ? (
              tenants.map((tenant) => (
                <tr key={tenant._id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">{tenant.name}</td>
                  <td className="py-2 px-4 border-b">{tenant.domain || '-'}</td>
                  <td className="py-2 px-4 border-b">
                    <span
                      className={clsx(
                        'px-2 py-1 rounded text-sm font-medium',
                        tenant.isSuspended
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      )}
                    >
                      {tenant.isSuspended ? 'Suspended' : 'Active'}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <ActionDropdown
                      actions={[
                        {
                          label: 'Update',
                          onClick: () => handleUpdate(tenant),
                        },
                        {
                          label: tenant.isSuspended ? 'Unsuspend' : 'Suspend',
                          onClick: tenant.isSuspended
                            ? () => handleUnsuspend(tenant)
                            : () => handleSuspend(tenant),
                        },
                        {
                          label: 'Delete',
                          onClick: () => handleDelete(tenant),
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  No tenants found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmation.isOpen}
        title={confirmation.title}
        message={confirmation.message}
        onConfirm={confirmation.action}
        onCancel={() =>
          setConfirmation({ isOpen: false, title: '', message: '', action: () => {} })
        }
      />

      {/* Update Tenant Modal */}
      <UpdateTenantModal
        isOpen={updateModal.isOpen}
        tenant={updateModal.tenant}
        onClose={handleUpdateCancel}
        onUpdate={handleUpdateSubmit}
        isUpdating={isUpdating}
      />
    </div>
  );
};

export default AllTenants;
