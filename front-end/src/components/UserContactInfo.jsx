import React from 'react';
import { FaPhone, FaUser, FaEnvelope } from 'react-icons/fa';

const UserContactInfo = ({ 
  user, 
  showPhoto = true, 
  showName = true, 
  showEmail = false, 
  showPhone = true,
  size = 'md',
  layout = 'horizontal',
  className = ''
}) => {
  if (!user) return null;

  const sizeClasses = {
    sm: {
      photo: 'w-8 h-8',
      text: 'text-sm',
      name: 'text-sm font-medium',
      phone: 'text-xs'
    },
    md: {
      photo: 'w-10 h-10',
      text: 'text-sm',
      name: 'text-sm font-medium',
      phone: 'text-xs'
    },
    lg: {
      photo: 'w-12 h-12',
      text: 'text-base',
      name: 'text-base font-medium',
      phone: 'text-sm'
    }
  };

  const sizes = sizeClasses[size] || sizeClasses.md;

  const layoutClasses = layout === 'vertical' 
    ? 'flex flex-col items-center space-y-2' 
    : 'flex items-center space-x-3';

  return (
    <div className={`${layoutClasses} ${className}`}>
      {showPhoto && (
        <div className="flex-shrink-0">
          <img
            src={user.photo_url || '/default-avatar.png'}
            alt={`${user.prenom} ${user.nom}`}
            className={`${sizes.photo} rounded-full object-cover border-2 border-gray-200`}
          />
        </div>
      )}
      
      <div className={`flex-1 min-w-0 ${layout === 'vertical' ? 'text-center' : ''}`}>
        {showName && (
          <div className={`${sizes.name} text-gray-900 truncate`}>
            {user.prenom} {user.nom}
          </div>
        )}
        
        {showEmail && user.email && (
          <div className={`${sizes.text} text-gray-600 flex items-center ${layout === 'vertical' ? 'justify-center' : ''} mt-1`}>
            <FaEnvelope className="mr-1 text-gray-400" />
            <a href={`mailto:${user.email}`} className="hover:text-indigo-600 truncate">
              {user.email}
            </a>
          </div>
        )}
        
        {showPhone && user.telephone && (
          <div className={`${sizes.phone} text-gray-600 flex items-center ${layout === 'vertical' ? 'justify-center' : ''} mt-1`}>
            <FaPhone className="mr-1 text-green-500" />
            <a 
              href={`tel:${user.telephone}`} 
              className="text-green-600 hover:text-green-800 font-medium"
            >
              {user.telephone}
            </a>
          </div>
        )}
        
        {user.role && (
          <div className={`${sizes.text} text-gray-500 capitalize ${layout === 'vertical' ? 'text-center' : ''} mt-1`}>
            {user.role}
          </div>
        )}
      </div>
    </div>
  );
};

// Composant spécialisé pour les cartes de trajets
export const TripUserInfo = ({ user, role = 'conducteur' }) => (
  <UserContactInfo
    user={user}
    showPhoto={true}
    showName={true}
    showEmail={false}
    showPhone={true}
    size="md"
    layout="horizontal"
    className="bg-gray-50 p-3 rounded-lg"
  />
);

// Composant spécialisé pour les listes admin
export const AdminUserInfo = ({ user }) => (
  <UserContactInfo
    user={user}
    showPhoto={true}
    showName={true}
    showEmail={true}
    showPhone={true}
    size="sm"
    layout="horizontal"
    className="p-2"
  />
);

// Composant spécialisé pour les réservations
export const ReservationUserInfo = ({ user, role = 'voyageur' }) => (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
    <div className="text-xs text-blue-600 font-medium mb-2 uppercase">
      {role === 'voyageur' ? 'Voyageur' : 'Conducteur'}
    </div>
    <UserContactInfo
      user={user}
      showPhoto={true}
      showName={true}
      showEmail={false}
      showPhone={true}
      size="sm"
      layout="horizontal"
    />
  </div>
);

// Composant spécialisé pour les notifications
export const NotificationUserInfo = ({ user }) => (
  <UserContactInfo
    user={user}
    showPhoto={true}
    showName={true}
    showEmail={false}
    showPhone={true}
    size="sm"
    layout="horizontal"
    className="border-l-4 border-indigo-500 pl-3"
  />
);

// Composant compact pour les listes
export const CompactUserInfo = ({ user }) => (
  <div className="flex items-center space-x-2">
    <img
      src={user.photo_url || '/default-avatar.png'}
      alt={`${user.prenom} ${user.nom}`}
      className="w-6 h-6 rounded-full object-cover"
    />
    <span className="text-sm font-medium text-gray-900">
      {user.prenom} {user.nom}
    </span>
    {user.telephone && (
      <a 
        href={`tel:${user.telephone}`} 
        className="text-xs text-green-600 hover:text-green-800 flex items-center"
        title={`Appeler ${user.prenom}`}
      >
        <FaPhone className="w-3 h-3" />
      </a>
    )}
  </div>
);

// Composant pour les dashboards
export const DashboardUserInfo = ({ user, stats = {} }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
    <UserContactInfo
      user={user}
      showPhoto={true}
      showName={true}
      showEmail={true}
      showPhone={true}
      size="lg"
      layout="horizontal"
    />
    
    {Object.keys(stats).length > 0 && (
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="capitalize">{key.replace('_', ' ')}:</span>
              <span className="font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default UserContactInfo;
