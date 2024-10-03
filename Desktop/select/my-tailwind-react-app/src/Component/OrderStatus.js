import React from 'react';

const OrderStatus = () => {
  return (
    <div className="flex space-x-4 p-4">
    
      <div className="bg-green-600 text-white flex items-center p-4 rounded-lg">
        <div className="bg-green-200 p-2 rounded-lg mr-4">
         
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-6 h-6 text-green-800"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div>
          <p className="font-bold text-lg">Completed orders</p>
          <p>0 order</p>
        </div>
      </div>

     
      <div className="bg-red-600 text-white flex items-center p-4 rounded-lg">
        <div className="bg-red-200 p-2 rounded-lg mr-4">
         
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-6 h-6 text-red-800"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <div>
          <p className="font-bold text-lg">Canceled orders</p>
          <p>1 order</p>
        </div>
      </div>

    
      <div className="bg-yellow-500 text-white flex items-center p-4 rounded-lg">
        <div className="bg-yellow-200 p-2 rounded-lg mr-4">
         
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-6 h-6 text-yellow-800"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m6 1a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <p className="font-bold text-lg">Processing orders</p>
          <p>3 orders</p>
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;
