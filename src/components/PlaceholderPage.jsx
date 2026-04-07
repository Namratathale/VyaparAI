import React from 'react';
import Header from './Header';

const PlaceholderPage = ({ name }) => (
  <div className="animate-fade-in">
    <Header title={name} subtitle={`You are currently in the ${name} section.`} />
    <div className="bg-slate-800/30 border border-slate-700 p-10 rounded-3xl text-center">
      <p className="text-slate-500 italic">This module is coming soon...</p>
    </div>
  </div>
);

export default PlaceholderPage;