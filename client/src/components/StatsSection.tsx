import React from 'react';

const StatsSection: React.FC = () => {
  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Making an Impact Together
          </h2>
          <p className="mt-3 text-xl text-gray-500 sm:mt-4 font-body">
            Every donation counts. See how we're making a difference.
          </p>
        </div>
        <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8">
          <div className="flex flex-col">
            <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
              Donations This Month
            </dt>
            <dd className="order-1 text-5xl font-extrabold text-primary-600">
              1,240
            </dd>
          </div>
          <div className="flex flex-col mt-10 sm:mt-0">
            <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
              Lives Saved
            </dt>
            <dd className="order-1 text-5xl font-extrabold text-primary-600">
              3,720
            </dd>
          </div>
          <div className="flex flex-col mt-10 sm:mt-0">
            <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
              Active Donors
            </dt>
            <dd className="order-1 text-5xl font-extrabold text-primary-600">
              5,230
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
};

export default StatsSection;
