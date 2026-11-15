import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { FigmaProductModel, PRODUCT_MODELS } from '../../data/figmaCatalog';
import { ResilientImage } from '../ResilientImage';
import { FigmaRoute } from './FigmaHeader';

interface FigmaModelDetailViewProps {
  model: FigmaProductModel;
  onNavigate: (next: FigmaRoute) => void;
}

export const FigmaModelDetailView: React.FC<FigmaModelDetailViewProps> = ({
  model,
  onNavigate,
}) => {
  const siblings = PRODUCT_MODELS.filter(
    (m) => m.collection === model.collection && m.id !== model.id
  );

  return (
    <div>
      {/* Breadcrumb */}
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 pt-8 pb-4">
        <div className="flex items-center gap-3 text-xs text-[#9E9EA7]">
          <button
            type="button"
            onClick={() => onNavigate({ page: 'home' })}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Home
          </button>
          <span>/</span>
          <button
            type="button"
            onClick={() => onNavigate({ page: 'collection', slug: model.collection })}
            className="hover:text-white transition-colors cursor-pointer"
          >
            {model.collectionName}
          </button>
          <span>/</span>
          <span className="text-white">{model.shortLabel}</span>
        </div>
      </div>

      {/* Hero Split */}
      <section className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 pt-6 pb-20 border-b border-[#1E1E24]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-5 pt-2">
            <p className="text-[11px] font-semibold tracking-[0.12em] text-[#E5C148] uppercase mb-5">
              {model.kicker}
            </p>
            <h1
              className="font-display font-semibold text-white tracking-[-0.025em] leading-[1.03] mb-6"
              style={{ fontSize: 'clamp(2.75rem, 4.8vw, 4.25rem)' }}
            >
              {model.titleLine1}
              <br />
              {model.titleLine2}
            </h1>
            <p className="text-sm sm:text-base text-[#9E9EA7] leading-relaxed max-w-md mb-8">
              {model.heroSummary}
            </p>

            <button
              type="button"
              onClick={() =>
                onNavigate({
                  page: 'quote',
                  prefillModel: model.fullName,
                })
              }
              className="inline-flex items-center gap-1.5 px-5 py-3 min-h-[42px] bg-[#E5C148] hover:bg-[#D4B038] text-[#0B0B0D] text-xs font-semibold transition-colors cursor-pointer"
            >
              <span>Request pricing</span>
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.2]" />
            </button>
            <p className="text-[11px] text-[#6E6E77] mt-3.5">
              Tell us your quantity and project requirements.
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="aspect-[16/10] w-full overflow-hidden bg-[#141417] border border-[#242429]">
              <ResilientImage
                src={model.imageUrl}
                alt={model.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-[10px] tracking-[0.1em] text-[#6E6E77] uppercase mt-2.5">
              VISUAL CONCEPT / NOT A PRODUCT PHOTOGRAPH
            </p>
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 py-20 border-b border-[#1E1E24]">
        <p className="text-[11px] font-semibold tracking-[0.12em] text-[#E5C148] uppercase mb-2.5">
          THE DETAILS
        </p>
        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-[-0.02em] mb-10">
          Technical specifications
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-8">
            <div className="border-t border-[#242429] divide-y divide-[#242429]">
              {model.specs.map((row) => (
                <div
                  key={row.label}
                  className="py-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm"
                >
                  <span className="text-[#9E9EA7]">{row.label}</span>
                  <span className="text-white font-medium tabular-nums">{row.value}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-[#6E6E77] mt-5">{model.specsFootnote}</p>
          </div>

          <div className="lg:col-span-4 bg-[#141417] border border-[#242429] p-6 sm:p-8">
            <h3 className="font-display text-lg font-semibold text-white mb-3">
              Plan the right setup.
            </h3>
            <p className="text-xs sm:text-sm text-[#9E9EA7] leading-relaxed mb-6">
              Share your venue, quantity and desired effects. Ask the team for the verified
              datasheet and a project-specific recommendation.
            </p>
            <p className="text-xs text-[#E5C148] leading-relaxed">
              Product specifications are pending manufacturer confirmation.
            </p>
          </div>
        </div>
      </section>

      {/* Show Applications */}
      <section className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6">
            <div className="aspect-[16/10] w-full overflow-hidden bg-[#141417] border border-[#242429]">
              <ResilientImage
                src={model.imageUrl}
                alt={`${model.fullName} show application`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-6">
            <p className="text-[11px] font-semibold tracking-[0.12em] text-[#E5C148] uppercase mb-3">
              SHOW APPLICATIONS
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-[-0.02em] mb-4">
              See the possibilities.
            </h2>
            <p className="text-base font-semibold text-white mb-4">{model.applicationsLead}</p>
            <p className="text-sm text-[#9E9EA7] leading-relaxed max-w-md mb-6">
              {model.applicationsBody}
            </p>
            <p className="text-[11px] text-[#6E6E77] max-w-sm leading-relaxed">
              {model.applicationsFootnote}
            </p>
          </div>
        </div>

        {/* Gold CTA Banner */}
        <div className="mt-20 bg-[#E5C148] p-8 sm:p-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <p className="text-[10px] font-bold tracking-[0.12em] text-[#0B0B0D]/80 uppercase mb-3">
              MAKE IT PART OF YOUR NEXT SHOW
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#0B0B0D] tracking-[-0.02em]">
              Let&apos;s talk about your project.
            </h2>
            <p className="text-xs sm:text-sm text-[#0B0B0D]/80 mt-2">
              Ask about availability, configuration and competitive pricing.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              onNavigate({
                page: 'quote',
                prefillModel: model.fullName,
              })
            }
            className="inline-flex items-center gap-1.5 px-6 py-3.5 min-h-[44px] bg-[#0B0B0D] hover:bg-[#1E1E24] text-white text-xs font-semibold transition-colors self-start lg:self-end whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Contact for pricing</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Also in this collection */}
        {siblings.length > 0 && (
          <div className="mt-16 pt-4">
            <p className="text-[11px] font-semibold tracking-[0.12em] text-[#9E9EA7] uppercase mb-5">
              ALSO IN THIS COLLECTION
            </p>
            <div
              className={`grid grid-cols-1 ${
                siblings.length === 1
                  ? 'sm:grid-cols-1'
                  : siblings.length === 2
                  ? 'sm:grid-cols-2'
                  : siblings.length === 3
                  ? 'sm:grid-cols-3'
                  : 'sm:grid-cols-2 lg:grid-cols-4'
              } gap-4`}
            >
              {siblings.map((sib) => (
                <button
                  key={sib.id}
                  type="button"
                  onClick={() => onNavigate({ page: 'detail', modelId: sib.id })}
                  className="text-left px-5 py-4 bg-[#141417] border border-[#242429] hover:border-[#E5C148]/70 transition-colors flex items-center gap-1.5 text-sm font-medium text-white hover:text-[#E5C148] cursor-pointer"
                >
                  <span>{sib.shortLabel}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#E5C148]" />
                </button>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
