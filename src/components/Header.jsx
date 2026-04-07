import React from 'react';

const Header = ({ title, subtitle }) => {
  return (
    <header className="mb-10 animate-fade-in">
      <h1 className="text-4xl font-bold text-white tracking-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="text-lg text-gray-400 mt-2 font-medium">
            {subtitle}
        </p>
      )}
    </header>
  );
};

export default Header;