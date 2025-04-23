'use client'
import { useState, ChangeEvent, FormEvent } from 'react';

type FormData = {
  name: string;
  email: string;
  pn: string;
  subject: string;
  message: string;
};

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    pn: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Email sended');
        setFormData({ name: '', email: '', pn: '', subject: '', message: '' });
      } else {
        alert('Error');
      }
    } catch (error) {
      console.error(error);
      alert('Error');
    }
  };

  return (
    <section className="pt-[5rem] pb-[3rem] gowun-batang-regular">
      <div className="py-[2rem] lg:py-16 px-[3rem] mx-auto max-w-screen-md bg-gray-200 rounded-[1rem] shadow-xl">
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-black text-center">
          Contact Us
        </h2>
        <p className="mb-8 lg:mb-16 font-light text-center text-gray-700 sm:text-xl">
          We are here to help! Fill out the form below, and we’ll be happy to answer your questions, discuss potential collaborations, or explore your ideas.
        </p>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="-mx-2 md:items-center md:flex">
            <div className="flex-1 px-2">
              <label className="block mb-2 text-sm text-gray-900">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="shadow-sm border text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 bg-gray-400 border-gray-600 placeholder-white text-black shadow-sm-light"
                placeholder="Joseph Martines"
                required
              />
            </div>

            <div className="flex-1 px-2 mt-4 md:mt-0">
              <label className="block mb-2 text-sm text-gray-900">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="shadow-sm border text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 bg-gray-400 border-gray-600 placeholder-white text-black shadow-sm-light"
                placeholder="name@gmail.com"
                required
              />
            </div>

            <div className="flex-1 px-2 mt-4 md:mt-0">
              <label className="block mb-2 text-sm text-gray-900">Phone Number</label>
              <input
                type="text"
                name="pn"
                value={formData.pn}
                onChange={handleChange}
                className="shadow-sm border text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 bg-gray-400 border-gray-600 placeholder-white text-black shadow-sm-light"
                placeholder="+1 80676872"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="block p-3 w-full text-sm rounded-lg border shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-gray-400 border-gray-600 placeholder-white text-black shadow-sm-light"
              placeholder="Subject..."
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-700">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="block p-6 w-full text-sm rounded-lg shadow-sm border focus:ring-primary-500 focus:border-primary-500 bg-gray-400 border-gray-600 placeholder-white text-black shadow-sm-light"
              placeholder="Leave your message..."
              required
            ></textarea>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="py-3 px-9 text-sm font-medium text-center text-white rounded-lg bg-gray-400 sm:w-fit hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-primary-300"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
