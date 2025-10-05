import React from "react";
import { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | Transformik AI",
  description:
    "Reach out to the Transformik AI team for inquiries, feedback, or collaboration opportunities.",
};

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
          Contact Us
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Have questions, feedback, or want to collaborate? We&apos;d love to
          hear from you. Fill out the form below and we&apos;ll get back to you
          as soon as possible.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Contact Information */}
        <div className="md:col-span-1 space-y-8">
          <div className="bg-white shadow-md rounded-md p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Contact Information
            </h3>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-gray-100 p-2 rounded-lg mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600">Email</h4>
                  <a
                    href="mailto:contact@transformik.ai"
                    className="text-gray-700 hover:text-black transition-colors"
                  >
                    contact@transformik.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-gray-100 p-2 rounded-lg mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600">
                    Social Media
                  </h4>
                  <div className="flex space-x-3 mt-2">
                    <a
                      href="https://twitter.com/transformik"
                      className="text-gray-600 hover:text-black transition-colors"
                    >
                      <svg
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                    <a
                      href="https://linkedin.com/company/transformik"
                      className="text-gray-600 hover:text-black transition-colors"
                    >
                      <svg
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-md p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Quick Response
            </h3>
            <p className="text-gray-600 mb-4">
              We aim to respond to all inquiries within 24-48 hours during
              business days.
            </p>
            <div className="text-sm text-gray-500">
              For urgent matters, please email us directly at:
              <a
                href="mailto:urgent@transformik.ai"
                className="block text-gray-700 hover:text-black mt-1 font-medium transition-colors"
              >
                contact@transformik.com
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2">
          <div className="bg-white shadow-md rounded-md p-8 border border-gray-200 h-full">
            <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
