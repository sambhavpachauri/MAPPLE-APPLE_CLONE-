import React from 'react';
import { Truck, RotateCcw, PackageCheck, AlertCircle } from 'lucide-react';

export const ShippingReturnsPage: React.FC = () => {
  return (
    <div className="py-12 max-w-3xl mx-auto px-4 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-[10px] font-bold tracking-wider uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          Fulfillment & Guarantee
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1d1d1f]">
          Shipping and Returns Policy
        </h1>
        <p className="text-xs text-neutral-500">Transparent logistics across India</p>
      </div>

      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-neutral-200/60 shadow-sm space-y-8 text-neutral-700 text-xs sm:text-sm leading-relaxed">
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-neutral-900 font-bold text-base">
            <Truck className="w-5 h-5 text-blue-600" />
            <h2>Complimentary Standard Shipping</h2>
          </div>
          <p>
            MAPPLE provides complimentary standard express air delivery on all hardware orders within India. Orders placed before 3:00 PM IST on business days are dispatched within 24 to 48 hours. Typical door-to-door transit time is 2 to 4 business days.
          </p>
        </section>

        <section className="space-y-3 pt-6 border-t border-neutral-100">
          <div className="flex items-center gap-2 text-neutral-900 font-bold text-base">
            <RotateCcw className="w-5 h-5 text-emerald-600" />
            <h2>14-Day Return Privilege</h2>
          </div>
          <p>
            If you are not thoroughly satisfied with your MAPPLE device, you may initiate a return within 14 calendar days from the date of physical delivery. Returned items must include all original cords, documentation, and retail packaging.
          </p>
          <p>
            Once our inspection center receives and verifies the serial authenticity of the returned hardware, a full refund will be disbursed to your original payment method within 3 to 5 business days.
          </p>
        </section>

        <section className="space-y-3 pt-6 border-t border-neutral-100">
          <div className="flex items-center gap-2 text-neutral-900 font-bold text-base">
            <PackageCheck className="w-5 h-5 text-purple-600" />
            <h2>Secure Signature Delivery</h2>
          </div>
          <p>
            Because of the high-value titanium and silicon components, all MAPPLE consignments require an OTP or physical signature upon courier handoff.
          </p>
        </section>
      </div>
    </div>
  );
};
