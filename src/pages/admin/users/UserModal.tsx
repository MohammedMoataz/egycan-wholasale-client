import React from 'react';
import { X, User, Mail, Shield, Calendar, Phone, Building, Globe, FileText, Hash, CreditCard } from 'lucide-react';

interface User {
  name: string;
  email: string;
  role: string;
  phoneNumber: string;
  createdAt: string;
  businessName?: string;
  businessType?: string;
  businessEmail?: string;
  businessPhone?: string;
  website?: string;
  businessAddress?: string;
  documentUrl?: string;
  registrationNumber?: string;
  taxId?: string;
  status?: string;
}

interface UserDetailsModalProps {
  selectedUser: User;
  setIsUserDetailsModalOpen: (isOpen: boolean) => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ selectedUser, setIsUserDetailsModalOpen }) => {
  // Group the user details into logical sections
  const personalInfo = [
    { icon: <User size={16} />, label: "Name", value: selectedUser.name },
    { icon: <Mail size={16} />, label: "Email", value: selectedUser.email },
    { icon: <Shield size={16} />, label: "Role", value: selectedUser.role },
    { icon: <Phone size={16} />, label: "Phone Number", value: selectedUser.phoneNumber },
    { 
      icon: <Calendar size={16} />, 
      label: "Joined", 
      value: new Date(selectedUser.createdAt).toLocaleDateString() 
    }
  ];
  
  const businessInfo = [
    { icon: <Building size={16} />, label: "Business Name", value: selectedUser.businessName },
    { icon: <Building size={16} />, label: "Business Type", value: selectedUser.businessType },
    { icon: <Mail size={16} />, label: "Business Email", value: selectedUser.businessEmail },
    { icon: <Phone size={16} />, label: "Business Phone", value: selectedUser.businessPhone },
    { icon: <Globe size={16} />, label: "Website", value: selectedUser.website },
    { icon: <Building size={16} />, label: "Business Address", value: selectedUser.businessAddress }
  ];
  
  const legalInfo = [
    { icon: <FileText size={16} />, label: "Document URL", value: selectedUser.documentUrl },
    { icon: <Hash size={16} />, label: "Registration Number", value: selectedUser.registrationNumber },
    { icon: <CreditCard size={16} />, label: "Tax ID", value: selectedUser.taxId }
  ];

  // Status badge styling
  const getStatusColor = (status: string | undefined) => {
    switch(status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const InfoItem = ({ item }) => (
    item.value ? (
      <div className="flex items-start mb-3">
        <span className="text-gray-500 mr-2 mt-0.5">{item.icon}</span>
        <div>
          <span className="text-sm text-gray-500">{item.label}: </span>
          <span className="text-sm font-medium">{item.value}</span>
        </div>
      </div>
    ) : null
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-6 max-h-90vh overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center mr-3">
              <User className="text-blue-600" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{selectedUser.name}</h2>
              <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedUser.status)}`}>
                {selectedUser.status}
              </div>
            </div>
          </div>
          <button 
            onClick={() => setIsUserDetailsModalOpen(false)}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div>
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Personal Information</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                {personalInfo.map((item, index) => (
                  <InfoItem key={index} item={item} />
                ))}
              </div>
            </div>
            
            {selectedUser.registrationNumber && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Legal Information</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  {legalInfo.map((item, index) => (
                    <InfoItem key={index} item={item} />
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Right Column */}
          <div>
            {selectedUser.businessName && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Business Information</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  {businessInfo.map((item, index) => (
                    <InfoItem key={index} item={item} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
          <button 
            onClick={() => setIsUserDetailsModalOpen(false)} 
            className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;