import React from 'react';
import Checkout2Form from '../components/Checkout2Form';

const Checkout2: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🚀 Direct API Checkout Test
          </h1>
          <p className="text-gray-600">
            Test the YagoutPay Direct API integration with detailed debugging
          </p>
        </div>
        
        <Checkout2Form />
        
        <div className="mt-8 text-center">
          <a 
            href="/" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            ← Back to Main Checkout
          </a>
        </div>
      </div>
    </div>
  );
};

export default Checkout2;
