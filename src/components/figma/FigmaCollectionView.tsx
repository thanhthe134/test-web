import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { COLLECTIONS, PRODUCT_MODELS, CollectionSlug } from '../../data/figmaCatalog';
import { ResilientImage } from '../ResilientImage';
import { FigmaRoute } from './FigmaHeader';

interface FigmaCollectionViewProps {
  slug: CollectionSlug;
  onNavigate: (next: FigmaRoute) => void;
}

export const FigmaCollectionView: React.FC<FigmaCollectionViewProps> = ({ slug, onNavigate }) => {
  const collection = COLLECTIONS[slug];
  const models = PRODUCT_MODELS.filter((m) => m.collection === slug);

  const gridColsClass =
    slug === 'led-matrix'
      ? 'grid-cols-1 md:grid-cols-2'
      : slug === 'laser'
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

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
          <span>Products</span>
          <span>/</span>
          <span className="text-white">{collection.name}</span>
        </div>
      </div>

      {/* Split Hero */}
      <section className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 pt-6 pb-20 border-b border-[#1E1E24]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-5 pt-2">
            <p className="text-[11px] font-semibold tracking-[0.12em] text-[#E5C148] uppercase mb-5">
              {collection.kicker}
            </p>
            <h1
              className="font-display font-semibold text-white tracking-[-0.025em] leading-[1.05] mb-6"
              style={{ fontSize: 'clamp(2.75rem, 4.5vw, 4rem)' }}
            >
              {collection.heroLine1}
              <br />
              {collection.heroLine2}
            </h1>
            <p className="text-sm sm:text-base text-[#9E9EA7] leading-relaxed whitespace-pre-line mb-8 max-w-md">
              {collection.heroDescription}
            </p>

            <button
              type="button"
              onClick={() =>
                onNavigate({
                  page: 'quote',
                  prefillModel: collection.name,
                })
              }
              className="inline-flex items-center gap-1.5 px-5 py-3 min-h-[42px] bg-[#E5C148] hover:bg-[#D4B038] text-[#0B0B0D] text-xs font-semibold transition-colors cursor-pointer"
            >
              <span>Request a competitive quote</span>
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.2]" />
            </button>
          </div>

          <div className="lg:col-span-7">
            <div className="aspect-[16/10] w-full overflow-hidden bg-[#141417] border border-[#242429]">
              <ResilientImage
                src={collection.heroImage}
                alt={`${collection.name} visual concept`}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-[10px] tracking-[0.1em] text-[#6E6E77] uppercase mt-2.5">
              ILLUSTRATIVE EFFECT CONCEPT
            </p>
          </div>
        </div>
      </section>

      {/* Explore The Collection Range */}
      <section className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 py-20 border-b border-[#1E1E24]">
        <p className="text-[11px] font-semibold tracking-[0.12em] text-[#E5C148] uppercase mb-2.5">
          {collection.rangeKicker}
        </p>
        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-[-0.02em] mb-10">
          {collection.rangeTitle}
        </h2>

        <div className={`grid ${gridColsClass} gap-6`}>
          {models.map((model) => (
            <button
              key={model.id}
              type="button"
              onClick={() => onNavigate({ page: 'detail', modelId: model.id })}
              className="group text-left bg-[#141417] border border-[#242429] hover:border-[#E5C148]/70 transition-colors flex flex-col cursor-pointer"
            >
              <div className="aspect-[16/10] w-full overflow-hidden bg-[#0B0B0D]">
                <ResilientImage
                  src={model.imageUrl}
                  alt={model.fullName}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-xl font-semibold text-white">
                    {slug === 'kinetic' ? model.shortLabel : model.fullName}
                  </h3>
                  <p className="text-xs text-[#9E9EA7] mt-1.5">{model.cardTag}</p>
                </div>

                <div className="mt-6 pt-3.5 border-t border-[#242429] flex items-center justify-between text-xs font-medium text-[#E5C148]">
                  <span>
                    {slug === 'led-matrix' ? 'View model & specifications' : 'Explore model'}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3-Column Inspiration Section */}
      <section className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 py-20">
        <p className="text-[11px] font-semibold tracking-[0.12em] text-[#E5C148] uppercase mb-2.5">
          {collection.inspirationKicker}
        </p>
        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-[-0.02em] mb-12">
          {collection.inspirationTitle}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collection.inspirationItems.map((item) => (
            <div key={item.num} className="border-t border-[#242429] pt-5">
              <h3 className="font-display text-lg font-semibold text-white mb-2">{item.num}</h3>
              <p className="text-sm text-[#9E9EA7] leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-[#6E6E77] mt-10">
          Creative concepts shown. Program availability and control compatibility to be confirmed.
        </p>

        {/* Gold CTA Banner */}
        <div className="mt-14 bg-[#E5C148] p-8 sm:p-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <p className="text-[10px] font-bold tracking-[0.12em] text-[#0B0B0D]/80 uppercase mb-3">
              {collection.bannerKicker}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#0B0B0D] tracking-[-0.02em]">
              {collection.bannerTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#0B0B0D]/80 mt-2">
              Tell us your venue, quantities and creative vision.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              onNavigate({
                page: 'quote',
                prefillModel: collection.name,
              })
            }
            className="inline-flex items-center gap-1.5 px-6 py-3.5 min-h-[44px] bg-[#0B0B0D] hover:bg-[#1E1E24] text-white text-xs font-semibold transition-colors self-start lg:self-end whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Get a competitive quote</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
};
