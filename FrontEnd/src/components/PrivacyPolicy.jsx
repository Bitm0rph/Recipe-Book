import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-gray-700 mb-4">
        Your privacy is important to us. This Privacy Policy explains how we collect, use,
and protect your personal information when you use the Recipe Book application.
      </p>
      <h2 className="text-2xl font-semibold mb-2">Information We Collect</h2>
      <ul className="list-disc list-inside mb-4 text-gray-700">
        <li>Personal details provided during signup and login (e.g., email).</li>
        <li>Recipe preferences and favorites saved in your account.</li>
        <li>Analytics data to improve our services.</li>
      </ul>
      <h2 className="text-2xl font-semibold mb-2">How We Use Your Data</h2>
      <p className="text-gray-700 mb-4">
        We use your information to personalize your experience, save your favorites,
and communicate important updates about the application.
      </p>
      <h2 className="text-2xl font-semibold mb-2">Security</h2>
      <p className="text-gray-700 mb-4">
        We implement industry-standard measures to protect your data, including secure
storage and encrypted connections.
      </p>
      <p className="text-gray-700">
        By using our app, you agree to the terms of this Privacy Policy.
      </p>
    </div>
  );
}