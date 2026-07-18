import React from 'react';

const Loading = ({ size = 48, message = 'Loading...' }) => {
  const style = {
    width: size,
    height: size,
    borderRadius: '50%',
    border: '4px solid rgba(0,0,0,0.08)',
    borderTopColor: '#2563eb',
    animation: 'spin 1s linear infinite',
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div style={style} aria-hidden="true" />
      <div className="mt-2 text-sm text-gray-600">{message}</div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Loading;
