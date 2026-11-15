import React, { useEffect, useState } from 'react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { FIGMA_ASSETS } from '../../data/figmaCatalog';
import { ResilientImage } from '../ResilientImage';
import { FigmaRoute } from './FigmaHeader';

interface FigmaQuoteViewProps {
  prefillModel?: string;
  onNavigate: (next: FigmaRoute) => void;
}

const TAILOR_POINTS = [
  { num: '01', text: 'Product type and preferred model' },
  { num: '02', text: 'Quantity and installation location' },
  { num: '03', text: 'Event date and creative requirements' },
];

export const FigmaQuoteView: React.FC<FigmaQuoteViewProps> = ({
  prefillModel = '',
  onNavigate,
}) => {
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [productModel, setProductModel] = useState(prefillModel);
  const [quantity, setQuantity] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [projectDetails, setProjectDetails] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  useEffect(() => {
    if (prefillModel) {
      setProductModel(prefillModel);
    }
  }, [prefillModel]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim() || !email.trim() || !productModel.trim() || !projectDetails.trim()) {
      setErrorMsg('Please fill in all required fields marked with *.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: fullName.trim(),
          phone: email.trim(),
          company_agency: company.trim() || 'Direct Client',
          event_date: eventDate || 'TBD',
          interested_categories: [productModel.trim()],
          stage_requirements: `Qty: ${quantity.trim() || 'TBD'} · ${projectDetails.trim()}`,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Could not submit your quote request.');
      }
      setSubmittedRef(json.reference_code || 'SS-BG-1003');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to send quote request.');
    } finally {
      setSubmitting(false);
    }
  };

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
          <span className="text-white">Request a quote</span>
        </div>
      </div>

      {/* Main 2-Column Quote Section */}
      <section className="max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 pt-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column */}
          <div className="lg:col-span-5 pt-2">
            <p className="text-[11px] font-semibold tracking-[0.12em] text-[#E5C148] uppercase mb-5">
              LET&apos;S CREATE SOMETHING EXTRAORDINARY
            </p>
            <h1
              className="font-display font-semibold text-white tracking-[-0.025em] leading-[1.05] mb-6"
              style={{ fontSize: 'clamp(2.5rem, 4.2vw, 3.75rem)' }}
            >
              Your next show
              <br />
              starts here.
            </h1>
            <p className="text-sm sm:text-base text-[#9E9EA7] leading-relaxed mb-10 max-w-md">
              Tell us what you have in mind.
              <br />
              Let&apos;s find the right setup and a competitive quote.
            </p>

            <h2 className="text-sm font-semibold text-white mb-5">
              A few details help us tailor your quote.
            </h2>

            <div className="space-y-4 mb-10">
              {TAILOR_POINTS.map((pt) => (
                <div key={pt.num} className="flex items-center gap-4 text-xs sm:text-sm">
                  <span className="font-mono text-[#6E6E77] tabular-nums">{pt.num}</span>
                  <span className="text-[#9E9EA7]">{pt.text}</span>
                </div>
              ))}
            </div>

            <div>
              <div className="aspect-[16/9] w-full overflow-hidden bg-[#141417] border border-[#242429]">
                <ResilientImage
                  src={FIGMA_ASSETS.heroConcert}
                  alt="Illustrative show concept"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-[10px] tracking-[0.1em] text-[#6E6E77] uppercase mt-2.5">
                ILLUSTRATIVE SHOW CONCEPT
              </p>
            </div>
          </div>

          {/* Right Column: Dark Form Panel */}
          <div className="lg:col-span-7 bg-[#141417] border border-[#242429] p-6 sm:p-10">
            {submittedRef ? (
              <div className="py-8 space-y-5" role="status" aria-live="polite">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-7 h-7 text-[#E5C148] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-mono text-[#E5C148] tabular-nums">
                      REFERENCE: {submittedRef}
                    </p>
                    <h2 className="font-display text-2xl font-semibold text-white mt-1">
                      Quote request received.
                    </h2>
                    <p className="text-sm text-[#9E9EA7] mt-2 leading-relaxed">
                      Thank you, <span className="text-white font-medium">{fullName}</span>. Our
                      production team will follow up at{' '}
                      <span className="text-white font-medium">{email}</span> regarding{' '}
                      <span className="text-[#E5C148]">{productModel}</span>.
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedRef(null);
                      setFullName('');
                      setCompany('');
                      setEmail('');
                      setQuantity('');
                      setEventDate('');
                      setProjectDetails('');
                    }}
                    className="px-5 py-2.5 bg-[#E5C148] hover:bg-[#D4B038] text-[#0B0B0D] text-xs font-semibold cursor-pointer"
                  >
                    Submit another enquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div>
                  <h2 className="font-display text-2xl font-semibold text-white">
                    Tell us about your project
                  </h2>
                  <p className="text-xs text-[#6E6E77] mt-1">Fields marked * are required.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label
                      htmlFor="fq-name"
                      className="block text-xs font-medium text-[#D4D4D8] mb-2"
                    >
                      Full name *
                    </label>
                    <input
                      id="fq-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your name"
                      className="w-full h-11 px-3.5 bg-[#0B0B0D] border border-[#242429] text-sm text-white placeholder-[#6E6E77] focus:outline-none focus:border-[#E5C148] transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="fq-company"
                      className="block text-xs font-medium text-[#D4D4D8] mb-2"
                    >
                      Company
                    </label>
                    <input
                      id="fq-company"
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Company name"
                      className="w-full h-11 px-3.5 bg-[#0B0B0D] border border-[#242429] text-sm text-white placeholder-[#6E6E77] focus:outline-none focus:border-[#E5C148] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="fq-email"
                    className="block text-xs font-medium text-[#D4D4D8] mb-2"
                  >
                    Email address *
                  </label>
                  <input
                    id="fq-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full h-11 px-3.5 bg-[#0B0B0D] border border-[#242429] text-sm text-white placeholder-[#6E6E77] focus:outline-none focus:border-[#E5C148] transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="fq-model"
                    className="block text-xs font-medium text-[#D4D4D8] mb-2"
                  >
                    Product &amp; model *
                  </label>
                  <input
                    id="fq-model"
                    type="text"
                    value={productModel}
                    onChange={(e) => setProductModel(e.target.value)}
                    placeholder="e.g. Laser 40W or Kinetic Rings"
                    className="w-full h-11 px-3.5 bg-[#0B0B0D] border border-[#242429] text-sm text-white placeholder-[#6E6E77] focus:outline-none focus:border-[#E5C148] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="fq-qty"
                      className="block text-xs font-medium text-[#D4D4D8] mb-2"
                    >
                      Quantity
                    </label>
                    <input
                      id="fq-qty"
                      type="text"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="Estimated quantity"
                      className="w-full h-11 px-3.5 bg-[#0B0B0D] border border-[#242429] text-sm text-white placeholder-[#6E6E77] focus:outline-none focus:border-[#E5C148] transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="fq-date"
                      className="block text-xs font-medium text-[#D4D4D8] mb-2"
                    >
                      Event date
                    </label>
                    <input
                      id="fq-date"
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full h-11 px-3.5 bg-[#0B0B0D] border border-[#242429] text-sm text-white font-mono tabular-nums focus:outline-none focus:border-[#E5C148] transition-colors [color-scheme:dark]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="fq-details"
                    className="block text-xs font-medium text-[#D4D4D8] mb-2"
                  >
                    Project details *
                  </label>
                  <textarea
                    id="fq-details"
                    rows={4}
                    value={projectDetails}
                    onChange={(e) => setProjectDetails(e.target.value)}
                    placeholder="Venue, location, desired effects and any technical requirements..."
                    className="w-full p-3.5 bg-[#0B0B0D] border border-[#242429] text-sm text-white placeholder-[#6E6E77] focus:outline-none focus:border-[#E5C148] transition-colors resize-y"
                  />
                </div>

                <p className="text-[11px] text-[#6E6E77]">
                  Your details will be used to respond to this enquiry.
                </p>

                {errorMsg && (
                  <p className="text-xs text-[#FF4D6D]" role="alert">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-12 bg-[#E5C148] hover:bg-[#D4B038] disabled:opacity-60 text-[#0B0B0D] text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>
                    {submitting ? 'Sending request...' : 'Request a competitive quote'}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.2]" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
