import React from 'react';

export default function About() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <img src="https://i.pinimg.com/736x/87/c0/26/87c026bd7024de1f67d82e3e51caae79.jpg" alt="Let's cook" className='h-80 rounded mb-5 m-auto'/>
      <p className="text-gray-800 mb-2 text-center">
        Welcome to Recipe Book! We are passionate about bringing you
the best recipes from around the world.
      </p>
      <p className="text-gray-800 mb-2 text-center">
        Our mission is to inspire home cooks with easy-to-follow
recipes, helpful tips, and delicious ideas for every meal.
      </p>
      <p className="text-gray-800 text-center">
        Thank you for being part of our community—happy cooking!
      </p>
    </div>
  )
}
