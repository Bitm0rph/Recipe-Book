import React from 'react';

export default function TermsOfService() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
      <p className="text-gray-700 mb-4">
        Welcome to Recipe Book. By accessing or using our service, you agree to be bound
by these Terms of Service. Please read them carefully.
      </p>
      <h2 className="text-2xl font-semibold mb-2">User Responsibilities</h2>
      <ul className="list-disc list-inside mb-4 text-gray-700">
        <li>You are responsible for maintaining the confidentiality of your account.</li>
        <li>Do not share your password or allow unauthorized access.</li>
      </ul>
      <h2 className="text-2xl font-semibold mb-2">Content Ownership</h2>
      <p className="text-gray-700 mb-4">
        All recipes and content created by users remain their intellectual property.
      </p>
      <h2 className="text-2xl font-semibold mb-2">Limitation of Liability</h2>
      <p className="text-gray-700 mb-4">
        Recipe Book is provided "as is" without warranties of any kind. We are not
liable for any damages arising from your use of the service.
      </p>
      <p className="text-gray-700">
        If you have any questions about these Terms, please contact us.
      </p>
    </div>
  );
}