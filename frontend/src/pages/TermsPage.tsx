import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="py-12 max-w-3xl mx-auto px-4 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-[10px] font-bold tracking-wider uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          Legal Agreement
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1d1d1f]">
          Terms and Conditions
        </h1>
        <p className="text-xs text-neutral-500">Updated: 2026</p>
      </div>

      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-neutral-200/60 shadow-sm space-y-6 text-neutral-700 text-xs sm:text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">1. Acceptance of Terms</h2>
          <p>
            By accessing MAPPLE websites, configuring products, or placing purchase orders, you agree to comply with and be bound by these Terms of Service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">2. Products and Fictional Brand Context</h2>
          <p>
            MAPPLE is an original demonstration brand created for showcasing state-of-the-art full-stack digital e-commerce technology. All product names, specifications, and configurations are fictional assets engineered for this application experience.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">3. Pricing and Order Validation</h2>
          <p>
            All prices are stated in Indian Rupees (INR) and inclusive of applicable GST taxes. Orders are validated transactionally on the server, ensuring real-time inventory reservation and accurate discount qualification.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">4. Warranty and Care Protection</h2>
          <p>
            Hardware sold through MAPPLE carries a 1-year limited warranty against manufacturing and assembly defects under normal consumer operating conditions.
          </p>
        </section>
      </div>
    </div>
  );
};
