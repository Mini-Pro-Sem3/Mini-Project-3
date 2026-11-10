import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GarbageCategory } from '../../types';
import { SAMPLE_IMAGES } from '../../data/imagePresets';
import { LeafletMap } from '../common/LeafletMap';
import {
  Upload,
  MapPin,
  Compass,
  CheckCircle2,
  Trash2,
  Sparkles,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

const CATEGORIES: GarbageCategory[] = [
  'Overflowing dustbin',
  'Roadside garbage',
  'Uncollected household waste',
  'Construction waste',
  'Illegal dumping',
  'Other',
];

export const ReportGarbagePage: React.FC = () => {
  const { currentUser, submitComplaint, setActiveView, openAuthModal } = useApp();

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GarbageCategory>('Overflowing dustbin');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('520 Howard Street');
  const [landmark, setLandmark] = useState('Near Transbay Transit Park');
  const [ward, setWard] = useState('Ward 3');
  const [location, setLocation] = useState<{ lat: number; lng: number }>({
    lat: 37.7885,
    lng: -122.3995,
  });

  const [images, setImages] = useState<string[]>([SAMPLE_IMAGES.overflowingDumpster]);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsSuccess, setGpsSuccess] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  // Browser GPS detection
  const handleDetectLocation = () => {
    setIsDetectingGps(true);
    setGpsError('');

    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser. You can click on the map to pin.');
      setIsDetectingGps(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: Number(latitude.toFixed(5)), lng: Number(longitude.toFixed(5)) });
        setIsDetectingGps(false);
        setGpsSuccess(true);
        setTimeout(() => setGpsSuccess(false), 4000);
      },
      (err) => {
        console.warn('GPS error', err);
        // Fallback to simulated high-accuracy municipal coordinates with polite explanation
        setGpsError('Browser GPS denied or unavailable. You can click or drag anywhere on the map to set location.');
        setIsDetectingGps(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Image Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const loadPresetImage = (presetKey: keyof typeof SAMPLE_IMAGES) => {
    setImages([SAMPLE_IMAGES[presetKey]]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      alert('Please upload at least one photograph of the uncollected garbage.');
      return;
    }

    const newId = submitComplaint({
      title: title || `${category} reported at ${address}`,
      category,
      description,
      images,
      location: {
        lat: location.lat,
        lng: location.lng,
        address,
        landmark,
        ward,
      },
    });

    setSubmittedId(newId);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF5] py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Title */}
        <div className="mb-8">
          <div className="text-xs font-semibold text-[#687447] tracking-wider uppercase mb-1">
            Citizen Action Portal
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#292D25]">
            Report Uncollected Garbage
          </h1>
          <p className="text-sm text-[#292D25]/75 mt-1">
            Provide geotagged photos and details to dispatch the municipal sanitation team.
          </p>
        </div>

        {/* Not logged in prompt reminder */}
        {!currentUser && (
          <div className="mb-6 p-4 rounded-xl bg-[#F6F5EC] border border-[#E6E5DA] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-[#687447]" />
              <div className="text-xs text-[#292D25]">
                <span className="font-semibold">Reporting anonymously.</span> For tracking updates in your personal dashboard, consider signing in.
              </div>
            </div>
            <button
              onClick={() => openAuthModal('citizen')}
              className="text-xs font-semibold text-[#687447] hover:underline"
            >
              Sign In
            </button>
          </div>
        )}

        {/* Submission Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Upload Photograph */}
          <div className="bg-white rounded-2xl border border-[#E6E5DA] p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#292D25]">
                  1. Upload Photographs
                </h3>
                <p className="text-xs text-[#71717A]">
                  Clear photos help crews assess equipment (e.g. compactor vs heavy loader).
                </p>
              </div>
              <div className="text-xs font-mono text-[#687447] font-semibold">
                {images.length} {images.length === 1 ? 'Photo' : 'Photos'} Attached
              </div>
            </div>

            {/* Photo Previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative rounded-xl border border-[#E6E5DA] overflow-hidden group h-36 bg-slate-100"
                  >
                    <img
                      src={img}
                      alt={`Upload preview ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-red-600 transition-colors shadow-xs"
                      title="Remove photograph"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-black/60 text-white">
                      Photo #{idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Zone */}
            <label className="border-2 border-dashed border-[#E6E5DA] hover:border-[#687447] rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-[#FAFAF5]/60 hover:bg-[#F6F5EC]/40">
              <Upload className="w-8 h-8 text-[#687447] mb-2" />
              <span className="text-xs font-semibold text-[#292D25]">
                Click or drag & drop garbage photos here
              </span>
              <span className="text-[11px] text-[#71717A] mt-1">
                Supports JPG, PNG, WEBP (Up to 10MB each)
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* Preset shortcuts for quick testing */}
            <div className="mt-4 pt-3 border-t border-[#E6E5DA]/60 flex flex-wrap items-center gap-2">
              <span className="text-xs text-[#71717A] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#687447]" />
                <span>Quick Photo Samples:</span>
              </span>
              <button
                type="button"
                onClick={() => loadPresetImage('overflowingDumpster')}
                className="text-xs px-2.5 py-1 rounded bg-[#F6F5EC] hover:bg-[#ECEADF] text-[#424D2B] border border-[#E6E5DA]"
              >
                Dumpster Overflow
              </button>
              <button
                type="button"
                onClick={() => loadPresetImage('roadsidePiles')}
                className="text-xs px-2.5 py-1 rounded bg-[#F6F5EC] hover:bg-[#ECEADF] text-[#424D2B] border border-[#E6E5DA]"
              >
                Roadside Rubbish
              </button>
              <button
                type="button"
                onClick={() => loadPresetImage('constructionDebris')}
                className="text-xs px-2.5 py-1 rounded bg-[#F6F5EC] hover:bg-[#ECEADF] text-[#424D2B] border border-[#E6E5DA]"
              >
                Construction Debris
              </button>
            </div>
          </div>

          {/* Section 2: Category */}
          <div className="bg-white rounded-2xl border border-[#E6E5DA] p-6 shadow-xs">
            <h3 className="text-base font-bold text-[#292D25] mb-1">
              2. Garbage Category
            </h3>
            <p className="text-xs text-[#71717A] mb-4">
              Select the primary waste classification for appropriate disposal routing.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    category === cat
                      ? 'border-[#687447] bg-[#F6F5EC] text-[#424D2B] font-semibold shadow-xs ring-1 ring-[#687447]'
                      : 'border-[#E6E5DA] hover:border-[#687447]/50 text-[#292D25]'
                  }`}
                >
                  <div className="text-xs">{cat}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Location & Geotagging */}
          <div className="bg-white rounded-2xl border border-[#E6E5DA] p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-[#292D25]">
                  3. Geolocation & Interactive Map Pin
                </h3>
                <p className="text-xs text-[#71717A]">
                  Click or drag the marker to pinpoint the exact waste location.
                </p>
              </div>

              {/* GPS Auto-detect button */}
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={isDetectingGps}
                className="px-3.5 py-2 text-xs font-semibold text-[#424D2B] bg-[#F6F5EC] hover:bg-[#ECEADF] border border-[#E6E5DA] rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
              >
                <Compass className={`w-3.5 h-3.5 text-[#687447] ${isDetectingGps ? 'animate-spin' : ''}`} />
                <span>{isDetectingGps ? 'Detecting GPS...' : 'Auto-Detect My GPS'}</span>
              </button>
            </div>

            {gpsSuccess && (
              <div className="p-2.5 rounded-lg bg-green-50 border border-green-200 text-xs text-green-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <span>GPS coordinates acquired with high accuracy! Marker updated.</span>
              </div>
            )}

            {gpsError && (
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{gpsError}</span>
              </div>
            )}

            {/* Coordinates Display Bar */}
            <div className="p-2.5 bg-[#FAFAF5] rounded-xl border border-[#E6E5DA] flex flex-wrap items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className="text-[#71717A]">LAT:</span>
                <span className="font-bold text-[#292D25]">{location.lat.toFixed(5)}</span>
                <span className="text-[#71717A]">LNG:</span>
                <span className="font-bold text-[#292D25]">{location.lng.toFixed(5)}</span>
              </div>
              <span className="text-[#687447] font-sans text-[11px] font-semibold">
                Interactive Pin Mode Active
              </span>
            </div>

            {/* Interactive Leaflet Pin Map */}
            <LeafletMap
              isPickerMode={true}
              pickedLocation={location}
              onLocationChange={(lat, lng) => setLocation({ lat, lng })}
              height="300px"
            />

            {/* Address fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#292D25] mb-1">
                  Street Address or Cross-street *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#71717A] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 520 Howard St near 1st Ave"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#E6E5DA] rounded-lg focus:outline-none focus:border-[#687447]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#292D25] mb-1">
                  Municipal Ward / Zone
                </label>
                <select
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#E6E5DA] rounded-lg focus:outline-none focus:border-[#687447]"
                >
                  <option value="Ward 1">Ward 1 – Downtown Central</option>
                  <option value="Ward 2">Ward 2 – West End</option>
                  <option value="Ward 3">Ward 3 – West Central</option>
                  <option value="Ward 4">Ward 4 – Eastside Riverside</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-[#292D25] mb-1">
                  Landmark (Optional, helps drivers find the exact spot)
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Opposite the public library parking lot entrance"
                  className="w-full px-3 py-2 text-sm bg-white border border-[#E6E5DA] rounded-lg focus:outline-none focus:border-[#687447]"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Description */}
          <div className="bg-white rounded-2xl border border-[#E6E5DA] p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#292D25]">
              4. Issue Summary & Description
            </h3>

            <div>
              <label className="block text-xs font-semibold text-[#292D25] mb-1">
                Headline / Title (Optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Broken bags spilling onto sidewalk near bus stop"
                className="w-full px-3 py-2 text-sm bg-white border border-[#E6E5DA] rounded-lg focus:outline-none focus:border-[#687447]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#292D25] mb-1">
                Detailed Description *
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe how long the garbage has been there, whether it poses health/traffic hazards, or special notes for municipal cleaning staff..."
                className="w-full px-3 py-2 text-sm bg-white border border-[#E6E5DA] rounded-lg focus:outline-none focus:border-[#687447]"
              />
            </div>
          </div>

          {/* Submission Button */}
          <div className="flex items-center justify-end gap-4 pt-2">
            <button
              type="button"
              onClick={() => setActiveView('landing')}
              className="px-5 py-2.5 text-xs font-semibold text-[#71717A] hover:text-[#292D25] transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-7 py-3 text-sm font-semibold text-white bg-[#687447] hover:bg-[#57623a] rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Submit Complaint</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal Confirmation */}
      {submittedId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="max-w-md w-full bg-white rounded-2xl border border-[#E6E5DA] p-6 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-green-50 text-[#15803D] flex items-center justify-center mx-auto border border-green-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-[#687447] bg-[#F6F5EC] px-3 py-1 rounded-md">
                {submittedId}
              </span>
              <h3 className="text-xl font-bold text-[#292D25] pt-2">
                Complaint Successfully Registered!
              </h3>
              <p className="text-xs text-[#292D25]/75 leading-relaxed">
                Your report has been entered into the municipal dispatch queue. Sanitation officers have been alerted and your tracking timeline is active.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  const id = submittedId;
                  setSubmittedId(null);
                  setActiveView('complaint-detail', id);
                }}
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#687447] hover:bg-[#57623a] rounded-lg transition-colors"
              >
                View Complaint Progress Tracker →
              </button>
              <button
                onClick={() => {
                  setSubmittedId(null);
                  setActiveView('my-complaints');
                }}
                className="w-full py-2 px-4 text-xs font-semibold text-[#292D25] bg-[#F6F5EC] hover:bg-[#ECEADF] rounded-lg transition-colors border border-[#E6E5DA]"
              >
                Go to My Complaints
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
