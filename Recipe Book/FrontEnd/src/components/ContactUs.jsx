import React, { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    // dummy submission: just show thank you
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
        <p className="text-gray-700">Your message has been received. We'll get back to you soon.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
        <label className="block mb-2">
          Name
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none"
            required
          />
        </label>
        <label className="block mb-2">
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none"
            required
          />
        </label>
        <label className="block mb-4">
          Message
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border rounded-lg focus:outline-none h-24"
            required
          />
        </label>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
