import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { FIGMA_ASSETS } from '../../data/figmaCatalog';
import { ResilientImage } from '../ResilientImage';
import { FigmaRoute } from './FigmaHeader';

interface FigmaHomeViewProps {
  onNavigate: (next: FigmaRoute) => void;
}

const COLLECTION_CARDS = [
  {
    slug: 'led-matrix' as const,
    num: '01 / LED MATRIX',
    title: 'LED Matrix',
    subtitle: 'Pixel-perfect possibilities.',
    meta: '20-pixel / 60-pixel',
    image: FIGMA_ASSETS.ledMatrix,
  },
  {
    slug: 'laser' as const,
    num: '02 / LASER',
    title: 'Laser',
    subtitle: 'Command every dimension.',
    meta: '20W / 30W / 40W / 60W',
    image: FIGMA_ASSETS.laser,
  },
  {
    slug: 'kinetic' as const,
    num: '03 / KINETIC',
    title: 'Kinetic',
    subtitle: 'Light, set in motion.',
    meta: 'Balls / Rings / Lanterns / More',
    image: FIGMA_ASSETS.kineticBalls,
  },
];

const WORKFLOW_STEPS = [
  {
    num: '01',
    title: 'Explore the possibilities',
    body: 'Find your format, output or kinetic shape.',
  },
  {
    num: '02',
    title: 'Tell us about your show',
    body: 'Share the venue, schedule and creative brief.',
  },
  {
    num: '03',
    title: 'Get a tailored quote',
    body: 'Discuss the right setup and competitive pricing.',
  },
];

export const FigmaHomeView: React.FC<FigmaHomeViewProps> = ({ onNavigate }) => {
  return (
    <div>
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden border-b border-[#1E1E24] bg-[#0B0B0D]">
        <div className="absolute inset-0">
          <ResilientImage
            src={FIGMA_ASSETS.heroConcert}
            alt="SquareSnake FX live concert stage lighting concept"
            className="w-full h-full object-cover object-center opacity-75"
          />
          {/* Left-to-right obsidian readability scrim */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0D] via-[#0B0B0D]/80 to-[#0B0B0D]/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-transparent to-[#0B0B0D]/55" />
        </div>

        <div className="relative max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 pt-20 pb-10 lg:pt-28 lg:pb-12">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-[#E5C148] uppercase mb-5">
              LIGHT. MOTION. IMPACT.
            </p>

            <h1
              className="font-display font-bold text-white tracking-[-0.025em] leading-[1.03] mb-6"
              style={{ fontSize: 'clamp(3rem, 5.5vw, 4.75rem)' }}
            >
              Built for the
              <br />
              unforgettable.
            </h1>

            <p className="text-base sm:text-lg text-[#B4B4BD] leading-relaxed max-w-md mb-9">
              LED Matrix, laser and kinetic systems.
              <br />
              Extraordinary possibilities for your next show.
            </p>

            <div className="flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={() => onNavigate({ page: 'collection', slug: 'led-matrix' })}
                className="inline-flex items-center gap-1.5 px-5 py-3 min-h-[42px] bg-[#E5C148] hover:bg-[#D4B038] text-[#0B0B0D] text-xs font-semibold transition-colors cursor-pointer"
              >
                <span>Explore LED Matrix</span>
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.2]" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate({ page: 'quote' })}
                className="inline-flex items-center gap-1.5 px-5 py-3 min-h-[42px] bg-[#0B0B0D]/70 hover:bg-[#16161B] border border-[#383842] text-white text-xs font-medium transition-colors cursor-pointer"
              >
                <span>Discuss your project</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="mt-24 pt-6 flex items-center justify-between text-[10px] tracking-[0.12em] uppercase">
            <div className="flex items-center gap-6">
              <span className="text-white font-semibold tabular-nums">01 / 03</span>
              <span className="text-[#9E9EA7]">PRECISION MEETS PERFORMANCE</span>
            </div>
            <span className="text-[#9E9EA7]">VISUAL CONCEPT</span>
          </div>
        </div>
      </section>

      {/* 2. COLLECTION CARDS */}
      <section className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-12">
          <div className="lg:col-span-4">
            <p className="text-[11px] font-semibold tracking-[0.12em] text-[#E5C148] uppercase">
              THE SQUARESNAKE FX COLLECTION
            </p>
          </div>
          <div className="lg:col-span-8">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-[-0.02em] leading-[1.18] max-w-2xl">
              Three ways to transform a space. One extraordinary experience.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLLECTION_CARDS.map((card) => (
            <button
              key={card.slug}
              type="button"
              onClick={() => onNavigate({ page: 'collection', slug: card.slug })}
              className="group text-left bg-[#141417] border border-[#242429] hover:border-[#E5C148]/70 transition-colors flex flex-col cursor-pointer"
            >
              <div className="aspect-[16/11] w-full overflow-hidden bg-[#0B0B0D]">
                <ResilientImage
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.1em] text-[#E5C148] uppercase mb-2.5">
                    {card.num}
                  </p>
                  <h3 className="font-display text-2xl font-semibold text-white">
                    {card.title}
                  </h3>
                  <p className="text-sm text-[#9E9EA7] mt-1.5">{card.subtitle}</p>
                  <p className="text-xs text-[#6E6E77] mt-3">{card.meta}</p>
                </div>

                <div className="mt-7 pt-4 border-t border-[#242429] flex items-center justify-between text-xs font-semibold text-white group-hover:text-[#E5C148] transition-colors">
                  <span>Explore collection</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#E5C148]" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. BEYOND THE HARDWARE SPLIT */}
      <section className="border-t border-[#1E1E24]">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6">
            <div className="aspect-[16/10] w-full overflow-hidden bg-[#141417] border border-[#242429]">
              <ResilientImage
                src={FIGMA_ASSETS.ledMatrix}
                alt="LED Matrix stage wave concept"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-[11px] text-[#6E6E77] mt-2.5">
              Imagery throughout is an illustrative show concept.
            </p>
          </div>

          <div className="lg:col-span-6 lg:pl-4">
            <p className="text-[11px] font-semibold tracking-[0.12em] text-[#E5C148] uppercase mb-4">
              BEYOND THE HARDWARE
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold text-white tracking-[-0.02em] leading-[1.08] mb-5">
              Make every cue
              <br />
              a moment.
            </h2>
            <p className="text-sm sm:text-base text-[#9E9EA7] leading-relaxed max-w-md mb-8">
              From pixel chases to sweeping beams and moving light sculptures. Explore the creative
              possibilities of each collection.
            </p>
            <button
              type="button"
              onClick={() => onNavigate({ page: 'collection', slug: 'led-matrix' })}
              className="inline-flex items-center gap-1.5 px-5 py-3 min-h-[42px] bg-[#E5C148] hover:bg-[#D4B038] text-[#0B0B0D] text-xs font-semibold transition-colors cursor-pointer"
            >
              <span>Discover LED effects</span>
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.2]" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. THREE-STEP PROCESS */}
      <section className="border-t border-[#1E1E24]">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 py-20 lg:py-24">
          <p className="text-[11px] font-semibold tracking-[0.12em] text-[#E5C148] uppercase mb-3">
            FROM FIRST IDEA TO FINAL CUE
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-[-0.02em] mb-12">
            Your vision. A considered setup.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {WORKFLOW_STEPS.map((step) => (
              <div key={step.num} className="border-t border-[#242429] pt-5">
                <p className="text-xs font-mono text-[#E5C148] mb-4">{step.num}</p>
                <h3 className="font-display text-lg font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-[#9E9EA7] leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>

          {/* 5. FULL-WIDTH GOLD CTA BANNER */}
          <div className="mt-16 bg-[#E5C148] p-8 sm:p-12 lg:p-14 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <p className="text-[10px] font-bold tracking-[0.12em] text-[#0B0B0D]/80 uppercase mb-3">
                LET&apos;S BUILD YOUR NEXT SHOW
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-semibold text-[#0B0B0D] tracking-[-0.02em] leading-[1.1]">
                Big ideas deserve
                <br />
                an extraordinary setup.
              </h2>
            </div>

            <button
              type="button"
              onClick={() => onNavigate({ page: 'quote' })}
              className="inline-flex items-center gap-1.5 px-6 py-3.5 min-h-[44px] bg-[#0B0B0D] hover:bg-[#1E1E24] text-white text-xs font-semibold transition-colors self-start lg:self-end whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Request a competitive quote</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
