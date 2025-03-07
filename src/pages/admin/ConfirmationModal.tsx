import React from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  user,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-in fade-in duration-200">
        <div className="flex items-start mb-4">
          <div className="mr-4 mt-1">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <p className="mt-2 text-sm text-gray-500">{message}</p>
          </div>
        </div>

        {user && (
          <div className="mt-3 bg-gray-50 p-3 rounded-md border border-gray-200">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                <CheckCircle className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={isLoading}
            className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
            onClick={onConfirm}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Usage example component
const UserApprovalButton = ({ user, approveUserMutation }) => {
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);

  const handleApprove = () => {
    approveUserMutation.mutate(user.id);
    setIsConfirmOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsConfirmOpen(true)}
        className="px-3 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200"
      >
        Approve
      </button>

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleApprove}
        title="Approve User"
        message={`Are you sure you want to approve this user? This action cannot be undone.`}
        confirmText="Approve"
        cancelText="Cancel"
        user={user}
        isLoading={approveUserMutation.isLoading}
      />
    </>
  );
};

export default UserApprovalButton;
