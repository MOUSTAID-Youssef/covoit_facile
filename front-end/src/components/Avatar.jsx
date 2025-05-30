import React, { useState } from 'react';

const Avatar = ({
  src,
  alt = '',
  size = 'md',
  className = '',
  fallbackSrc = '/images/default-avatar.svg'
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20'
  };

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  const getImageSrc = () => {
    // Si pas de src ou erreur, utiliser le fallback
    if (!src || hasError) {
      return fallbackSrc;
    }

    // Si l'URL commence par http, on l'utilise telle quelle
    if (src.startsWith('http')) {
      return src;
    }

    // Si c'est un chemin relatif (commence par /), on l'utilise tel quel
    if (src.startsWith('/')) {
      return src;
    }

    // Sinon, on assume que c'est un fichier dans le storage Laravel
    return `http://localhost:8000/storage/${src}`;
  };

  return (
    <img
      src={getImageSrc()}
      alt={alt}
      className={`${sizeClasses[size]} rounded-full border-2 border-gray-200 object-cover ${className}`}
      onError={handleError}
    />
  );
};

export default Avatar;
