import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Headphones, CreditCard, Sparkles } from 'lucide-react';

const BENEFITS = [
  {
    icon: Truck,
    title: 'Complimentary Delivery',
    description: 'Fast, secure standard dispatch across India with real-time tracking on all orders.',
  },
  {
    icon: RotateCcw,
    title: '14-Day Effortless Returns',
    description: 'Hassle-free return policy. If you are not completely enchanted, return with ease.',
  },
  {
    icon: ShieldCheck,
    title: '1-Year MAPPLE Care',
    description: 'Comprehensive warranty covering all internal hardware and silicon defects.',
  },
  {
    icon: Headphones,
    title: 'Specialist Support',
    description: 'Our customer success technicians are available 24/7 to assist with onboarding.',
  },
];

export const BenefitsBanner: React.FC = () => {
  return (
    <section className="py-12 bg-white rounded-3xl border border-neutral-200/60 p-8 sm:p-12 shadow-sm my-10">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-[10px] font-bold tracking-wider uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          The MAPPLE Experience
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f] mt-3">
          Why purchase directly from MAPPLE
        </h2>
        <p className="text-sm text-neutral-500 mt-1">
          Uncompromised excellence from unboxing to lifetime customer care.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {BENEFITS.map((b, idx) => {
          const IconComp = b.icon;
          return (
            <div key={idx} className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-[#1d1d1f] flex items-center justify-center shadow-inner">
                <IconComp className="w-6 h-6 text-[#0071e3]" />
              </div>
              <h3 className="text-sm font-semibold text-[#1d1d1f]">{b.title}</h3>
              <p className="text-xs text-neutral-500 leading-relaxed max-w-xs">{b.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
