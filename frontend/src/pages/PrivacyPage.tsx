import React from 'react';
import { ShieldCheck, Lock, EyeOff } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="py-12 max-w-3xl mx-auto px-4 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-[10px] font-bold tracking-wider uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          Customer Privacy Principles
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1d1d1f]">
          MAPPLE Privacy Policy
        </h1>
        <p className="text-xs text-neutral-500">Effective Date: January 1, 2026</p>
      </div>

      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-neutral-200/60 shadow-sm space-y-6 text-neutral-700 text-xs sm:text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">1. Our Fundamental Privacy Commitment</h2>
          <p>
            At MAPPLE, privacy is a fundamental human right. We design our hardware, software, and services to minimize data collection. Where data is necessary to process transactions or provide technical support, we employ hardware-level encryption and secure cryptographic isolation.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">2. Information Collected for E-Commerce</h2>
          <p>
            When purchasing from MAPPLE, we collect the necessary contact, billing, and shipping details to fulfill your delivery, provide real-time tracking, and service hardware warranties. We do not store raw payment card credentials on our servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">3. On-Device Computing</h2>
          <p>
            MAPPLE Silicon devices execute artificial intelligence, face authentication, and voice diagnostics locally. Personal telemetry is not uploaded to central corporate data banks.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-neutral-900">4. Your Data Rights</h2>
          <p>
            You retain the right to inspect, correct, export, or permanently delete your account records and stored shipping addresses at any time via your MAPPLE Account Dashboard.
          </p>
        </section>
      </div>
    </div>
  );
};
