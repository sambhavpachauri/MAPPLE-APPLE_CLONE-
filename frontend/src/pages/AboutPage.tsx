import React from 'react';
import { Sparkles, Cpu, Layers, ShieldCheck } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="py-12 space-y-16 max-w-4xl mx-auto px-4">
      {/* Editorial Hero */}
      <div className="text-center space-y-4">
        <span className="text-[10px] font-bold tracking-wider uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          The MAPPLE Manifesto
        </span>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#1d1d1f]">
          Technology. Beautifully Simplified.
        </h1>
        <p className="text-lg text-neutral-500 max-w-2xl mx-auto font-light leading-relaxed">
          We believe technology should dissolve into the background, elevating human creativity, connection, and focus without friction.
        </p>
      </div>

      {/* Narrative Section */}
      <div className="bg-white rounded-3xl p-8 sm:p-14 border border-neutral-200/60 shadow-sm space-y-8 text-neutral-700 text-sm leading-relaxed">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-[#1d1d1f] tracking-tight">Original Craft. Precision Silicon.</h2>
          <p>
            MAPPLE was founded with a singular conviction: consumer electronics should be crafted with the same obsessive precision as high-horology timepieces and aeronautical structures. Every chassis is precision-milled from aerospace Grade 5 titanium or unibody recycled aluminum.
          </p>
          <p>
            Rather than relying on generic off-the-shelf components, our hardware engineers and software architects harmonize silicon microarchitecture directly with on-device intelligence. The result is unprecedented computational power with whisper-quiet fanless thermals and multi-day battery endurance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-neutral-100">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#1d1d1f] text-sm">Titanium Engineering</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Grade 5 titanium alloy delivers the highest strength-to-weight ratio of any metal, creating devices that feel impossibly light yet virtually indestructible.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#1d1d1f] text-sm">Unified M-Silicon</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Unified memory architecture eliminates bus transfer bottlenecks, enabling neural machine-learning workflows to run entirely locally on-device.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#1d1d1f] text-sm">Privacy by Architecture</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Biometric signatures, private keys, and on-device machine learning never leave your local hardware enclave without explicit hardware-key authorization.
            </p>
          </div>
        </div>
      </div>

      {/* Sustainable Commitment */}
      <div className="bg-[#161617] text-white rounded-3xl p-8 sm:p-12 border border-white/10 shadow-xl space-y-4">
        <h3 className="text-2xl font-bold tracking-tight text-white">Carbon Neutral by Design</h3>
        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-2xl font-light">
          100% of the aluminum in MAPPLE MacBook enclosures is recycled, and 100% of the rare earth elements in internal magnets are sustainably reclaimed. We believe building exceptional technology must never come at the expense of our planet.
        </p>
      </div>
    </div>
  );
};
