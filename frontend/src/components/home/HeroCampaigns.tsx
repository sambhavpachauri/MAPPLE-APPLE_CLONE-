import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles, Cpu, ShieldAlert, Compass } from 'lucide-react';

export const HeroCampaigns: React.FC = () => {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* HERO 1: MAPPLE Phone Pro (Dark Titanium Aesthetic) */}
      <section className="relative overflow-hidden bg-black text-white rounded-3xl min-h-[580px] md:min-h-[660px] flex flex-col justify-between p-8 sm:p-12 text-center border border-white/10 shadow-2xl">
        <div className="relative z-10 max-w-3xl mx-auto space-y-3 pt-4 sm:pt-8 animate-in fade-in duration-700">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold tracking-wider uppercase backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Grade 5 Titanium
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white">
            MAPPLE Phone Pro
          </h1>
          <p className="text-lg sm:text-2xl text-neutral-300 font-light max-w-xl mx-auto">
            Titanium. So strong. So light. So Pro.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link
              to="/product/mapple-phone-pro"
              className="px-7 py-3 rounded-full bg-[#0071e3] text-white text-sm font-semibold hover:bg-[#0077ed] transition-all hover:scale-105 shadow-lg"
            >
              Explore Phone Pro
            </Link>
            <Link
              to="/store/iphone"
              className="px-6 py-3 rounded-full bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-all flex items-center gap-1 backdrop-blur-md"
            >
              View all models <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Hero Product Image */}
        <div className="relative z-0 mt-8 w-full max-w-2xl mx-auto flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1200&q=80"
            alt="MAPPLE Phone Pro Titanium"
            className="w-full max-h-[380px] object-cover rounded-2xl shadow-2xl border border-white/10 transform hover:scale-[1.02] transition-transform duration-700"
          />
        </div>
      </section>

      {/* HERO 2: MAPPLE MacBook Pro (Split Asymmetric Cinematic) */}
      <section className="relative overflow-hidden bg-[#161617] text-white rounded-3xl min-h-[500px] md:min-h-[560px] p-8 sm:p-12 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1 space-y-4 max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-800 text-neutral-300 text-xs font-semibold tracking-wider uppercase">
            <Cpu className="w-3.5 h-3.5 text-purple-400" /> M-Compute Silicon
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            MAPPLE MacBook Pro
          </h2>
          <p className="text-xl sm:text-2xl text-neutral-400 font-light">
            Mind-blowing architecture. Head-turning speed.
          </p>
          <p className="text-sm text-neutral-400 leading-relaxed max-w-md">
            Up to 128GB unified memory, 22 hours of continuous battery longevity, and Liquid Retina XDR display with 1600 nits peak brightness.
          </p>
          <div className="flex items-center gap-4 pt-3">
            <Link
              to="/product/mapple-macbook-pro"
              className="px-7 py-3 rounded-full bg-white text-black text-sm font-semibold hover:bg-neutral-200 transition-all hover:scale-105 shadow-md"
            >
              Order MacBook Pro
            </Link>
            <Link
              to="/store/mac"
              className="px-6 py-3 rounded-full border border-neutral-700 text-neutral-300 text-sm font-medium hover:border-neutral-500 hover:text-white transition-all flex items-center gap-1"
            >
              Learn more <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="flex-1 w-full max-w-xl">
          <img
            src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80"
            alt="MAPPLE MacBook Pro Space Black"
            className="w-full h-[320px] md:h-[400px] object-cover rounded-2xl border border-white/10 shadow-2xl hover:scale-[1.02] transition-transform duration-700"
          />
        </div>
      </section>

      {/* DUAL HERO GRID: HERO 3 (iPad Pro) & HERO 4 (Watch Ultra) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* HERO 3: MAPPLE iPad Pro */}
        <section className="relative overflow-hidden bg-[#f5f5f7] text-[#1d1d1f] rounded-3xl p-8 sm:p-10 flex flex-col justify-between border border-neutral-200/80 shadow-sm min-h-[500px]">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              Tandem OLED Canvas
            </span>
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1d1d1f]">
              MAPPLE iPad Pro
            </h3>
            <p className="text-base sm:text-lg text-neutral-600 font-light">
              Thinpossible. 5.1mm of pure creative superpower.
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-3 pt-2">
              <Link
                to="/product/mapple-ipad-pro"
                className="px-6 py-2.5 rounded-full bg-[#0071e3] text-white text-xs font-semibold hover:bg-[#0077ed] transition-all"
              >
                Buy iPad Pro
              </Link>
              <Link
                to="/store/ipad"
                className="text-xs text-[#0071e3] hover:underline font-semibold flex items-center"
              >
                Learn more <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="mt-8">
            <img
              src="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=80"
              alt="MAPPLE iPad Pro"
              className="w-full h-[240px] object-cover rounded-2xl shadow-md border border-neutral-200/60"
            />
          </div>
        </section>

        {/* HERO 4: MAPPLE Watch Ultra */}
        <section className="relative overflow-hidden bg-[#0d0e12] text-white rounded-3xl p-8 sm:p-10 flex flex-col justify-between border border-neutral-800 shadow-xl min-h-[500px]">
          <div className="space-y-2 text-center sm:text-left">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-orange-400">
              <Compass className="w-3.5 h-3.5" /> Extreme Endurance
            </span>
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              MAPPLE Watch Ultra
            </h3>
            <p className="text-base sm:text-lg text-neutral-400 font-light">
              Forged for summit peaks and oceanic depths.
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-3 pt-2">
              <Link
                to="/product/mapple-watch-ultra"
                className="px-6 py-2.5 rounded-full bg-orange-600 text-white text-xs font-semibold hover:bg-orange-500 transition-all shadow-md"
              >
                Buy Watch Ultra
              </Link>
              <Link
                to="/store/watch"
                className="text-xs text-orange-400 hover:underline font-semibold flex items-center"
              >
                Explore all models <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="mt-8">
            <img
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80"
              alt="MAPPLE Watch Ultra"
              className="w-full h-[240px] object-cover rounded-2xl shadow-xl border border-white/10"
            />
          </div>
        </section>
      </div>
    </div>
  );
};
