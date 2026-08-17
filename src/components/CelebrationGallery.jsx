import React, { useState, useEffect, useCallback } from 'react';
import { 
  Images, 
  Sparkles, 
  Maximize2, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Download, 
  Play, 
  Pause, 
  Calendar, 
  Heart, 
  Award,
  CreditCard,
  Vote,
  Camera,
  ArrowRight,
  Filter
} from 'lucide-react';
import { fireFestiveConfetti, fireTrophyConfetti } from '../utils/confetti';

export const GALLERY_PHOTOS = [
  {
    id: 'photo-1',
    src: '/TECHERSDAY_2025/IMG-20250908-WA0050.jpg',
    title: 'Grand Faculty Felicitation & Floral Greetings',
    category: 'felicitation',
    categoryLabel: 'Felicitations',
    description: 'CSE students expressing gratitude with traditional shawls and floral bouquets to our respected professors.',
    tag: 'Felicitation 2025',
    date: 'Sept 5, 2025'
  },
  {
    id: 'photo-2',
    src: '/TECHERSDAY_2025/IMG-20250908-WA0052.jpg',
    title: 'Department Cake Cutting Ceremony',
    category: 'celebration',
    categoryLabel: 'Celebration',
    description: 'Faculty and students coming together for the celebratory Teachers\' Day cake cutting in the department.',
    tag: 'Sweet Moments',
    date: 'Sept 5, 2025'
  },
  {
    id: 'photo-3',
    src: '/TECHERSDAY_2025/IMG-20250908-WA0055.jpg',
    title: 'Warm Smiles & Inspiring Mentorship',
    category: 'moments',
    categoryLabel: 'Faculty Joy',
    description: 'Heartwarming interactions and memorable candid moments with our CSE professors.',
    tag: 'Mentor Love',
    date: 'Sept 5, 2025'
  },
  {
    id: 'photo-4',
    src: '/TECHERSDAY_2025/IMG-20250908-WA0057.jpg',
    title: 'Classroom Memories & Student Tributes',
    category: 'felicitation',
    categoryLabel: 'Tributes',
    description: 'Student coordinators presenting tokens of appreciation and heartfelt cards to our mentors.',
    tag: 'Gratitude',
    date: 'Sept 5, 2025'
  },
  {
    id: 'photo-5',
    src: '/TECHERSDAY_2025/IMG-20250908-WA0059.jpg',
    title: 'Faculty Gathering & Department Camaraderie',
    category: 'celebration',
    categoryLabel: 'Department Meet',
    description: 'The entire CSE family celebrating academic excellence, guidance, and teacher-student bonds.',
    tag: 'CSE Family',
    date: 'Sept 5, 2025'
  },
  {
    id: 'photo-6',
    src: '/TECHERSDAY_2025/IMG-20250908-WA0060.jpg',
    title: 'Mementos & Commemorative Honors',
    category: 'felicitation',
    categoryLabel: 'Mementos',
    description: 'Honouring teachers with custom commemorative gifts and awards funded by student contributions.',
    tag: 'Honours',
    date: 'Sept 5, 2025'
  },
  {
    id: 'photo-7',
    src: '/TECHERSDAY_2025/IMG-20250908-WA0076.jpg',
    title: 'Celebration High-Tea & Joyful Discussions',
    category: 'moments',
    categoryLabel: 'High-Tea',
    description: 'Sharing treats, laughter, and wisdom beyond the chalkboards and coding labs.',
    tag: 'Festive High-Tea',
    date: 'Sept 5, 2025'
  },
  {
    id: 'photo-8',
    src: '/TECHERSDAY_2025/IMG-20250908-WA0079.jpg',
    title: 'Group Photo with Respected Professors',
    category: 'group',
    categoryLabel: 'Group Memories',
    description: 'The iconic group photo capturing the vibrant spirit and unity of the CSE department.',
    tag: 'Grand Group Photo',
    date: 'Sept 5, 2025'
  },
  {
    id: 'photo-9',
    src: '/TECHERSDAY_2025/IMG_20260818_012120.jpg',
    title: 'Unforgettable Highlights & Department Pride',
    category: 'group',
    categoryLabel: 'Highlights',
    description: 'Cherished memories from last year motivating us to make Guru Utsav 2026 even grander!',
    tag: 'Department Pride',
    date: 'Sept 5, 2025'
  }
];

export const CelebrationGallery = ({ setActiveTab }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [likedPhotos, setLikedPhotos] = useState({});

  // Filtered photos
  const filteredPhotos = selectedCategory === 'all' 
    ? GALLERY_PHOTOS 
    : GALLERY_PHOTOS.filter(p => p.category === selectedCategory);

  // Category counts
  const categories = [
    { id: 'all', label: 'All Moments', count: GALLERY_PHOTOS.length },
    { id: 'felicitation', label: 'Felicitations & Tributes', count: GALLERY_PHOTOS.filter(p => p.category === 'felicitation').length },
    { id: 'celebration', label: 'Cake Cutting & Events', count: GALLERY_PHOTOS.filter(p => p.category === 'celebration').length },
    { id: 'moments', label: 'Faculty Joy & High-Tea', count: GALLERY_PHOTOS.filter(p => p.category === 'moments').length },
    { id: 'group', label: 'Group Memories', count: GALLERY_PHOTOS.filter(p => p.category === 'group').length },
  ];

  // Open Lightbox
  const openLightbox = (index) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    setIsAutoplay(false);
  };

  const showNext = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev + 1) % filteredPhotos.length);
    }
  }, [lightboxIndex, filteredPhotos.length]);

  const showPrev = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length);
    }
  }, [lightboxIndex, filteredPhotos.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === ' ') {
        e.preventDefault();
        setIsAutoplay(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, showNext, showPrev]);

  // Autoplay slideshow
  useEffect(() => {
    let interval = null;
    if (isAutoplay && lightboxIndex !== null) {
      interval = setInterval(() => {
        showNext();
      }, 3500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoplay, lightboxIndex, showNext]);

  const handleLike = (e, photoId) => {
    e.stopPropagation();
    setLikedPhotos(prev => ({
      ...prev,
      [photoId]: !prev[photoId]
    }));
    fireFestiveConfetti();
  };

  const handleDownload = (e, src, title) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = src;
    link.download = `TeachersDay2025_${title.replace(/\s+/g, '_')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="py-6 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      
      {/* 1. HERO HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20 text-xs font-black">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>FLASHBACK 2025 • GURU UTSAV</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          <span>9 Cherished Moments</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-slate-900 dark:text-white">
          Last Year's <span className="gradient-text-festive">Celebration Gallery</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto">
          Reliving the joyous smiles, grand felicitations, cake cutting, and student tributes from Teachers' Day 2025 in the CSE Department.
        </p>

        {/* Quick Highlights Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
          <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            <span>Sept 5, 2025 Flashback</span>
          </span>
          <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-purple-500" />
            <span>Official Photo Archive</span>
          </span>
          <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-emerald-500" />
            <span>CSE Department Memories</span>
          </span>
        </div>
      </div>

      {/* 2. CATEGORY FILTER PILLS & SLIDESHOW LAUNCHER */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-card p-3 sm:p-4 rounded-3xl border border-slate-200 dark:border-white/10">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all touch-press ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-400'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Launch Slideshow Button */}
        <button
          onClick={() => {
            setLightboxIndex(0);
            setIsAutoplay(true);
            fireFestiveConfetti();
          }}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-md transition-all touch-press"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Play Full Slideshow</span>
        </button>

      </div>

      {/* 3. RESPONSIVE MASONRY / PHOTO GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {filteredPhotos.map((photo, index) => {
          const isLiked = likedPhotos[photo.id];

          return (
            <div
              key={photo.id}
              onClick={() => openLightbox(index)}
              className="glass-card rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 hover:border-amber-400/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/10 cursor-pointer group flex flex-col justify-between bg-white dark:bg-slate-950"
            >
              {/* Photo Image Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                <img
                  src={photo.src}
                  alt={photo.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs font-bold border border-white/20">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>View Full Size</span>
                  </span>
                  <button
                    onClick={(e) => handleDownload(e, photo.src, photo.title)}
                    title="Download Photo"
                    className="p-2 rounded-xl bg-slate-950/80 hover:bg-amber-400 hover:text-slate-950 text-white backdrop-blur-md border border-white/20 transition-all touch-press"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Top Corner Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/15 text-amber-400 text-[10px] font-black uppercase tracking-wider">
                    {photo.tag}
                  </span>
                </div>

                {/* Like Button */}
                <button
                  onClick={(e) => handleLike(e, photo.id)}
                  title={isLiked ? "Unlike" : "Heart this memory"}
                  className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md border transition-all touch-press ${
                    isLiked 
                      ? 'bg-rose-600 text-white border-rose-500 scale-110 shadow-lg shadow-rose-600/30' 
                      : 'bg-slate-950/60 text-white/80 hover:text-rose-400 border-white/15 hover:bg-slate-950/90'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Photo Caption Content */}
              <div className="p-4 sm:p-5 space-y-2 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-1">
                    <span className="text-purple-600 dark:text-purple-300 font-bold">{photo.categoryLabel}</span>
                    <span>{photo.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors leading-snug">
                    {photo.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {photo.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
                  <span className="text-slate-400 dark:text-slate-500 font-medium">Memory #{index + 1}</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                    <span>Enlarge</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* 4. LIGHTBOX MODAL */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-950/95 backdrop-blur-xl animate-fadeIn">
          
          {/* Top Floating Controls */}
          <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-mono font-bold">
                {lightboxIndex + 1} / {filteredPhotos.length}
              </span>
              <span className="text-xs font-bold text-amber-300 hidden sm:inline-block">
                {filteredPhotos[lightboxIndex]?.tag}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Autoplay toggle */}
              <button
                onClick={() => setIsAutoplay(prev => !prev)}
                title={isAutoplay ? "Pause Slideshow" : "Start Slideshow"}
                className={`p-2.5 rounded-2xl backdrop-blur-md border border-white/15 transition-all touch-press ${
                  isAutoplay ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {isAutoplay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              </button>

              {/* Download */}
              <button
                onClick={(e) => handleDownload(e, filteredPhotos[lightboxIndex]?.src, filteredPhotos[lightboxIndex]?.title)}
                title="Download High-Res"
                className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white transition-all touch-press"
              >
                <Download className="w-4 h-4" />
              </button>

              {/* Close */}
              <button
                onClick={closeLightbox}
                title="Close (Esc)"
                className="p-2.5 rounded-2xl bg-white/10 hover:bg-rose-600 backdrop-blur-md border border-white/15 text-white transition-all touch-press"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Left Arrow */}
          <button
            onClick={(e) => { e.stopPropagation(); showPrev(); }}
            title="Previous (Left Arrow)"
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white transition-all touch-press hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Center Main Image & Content */}
          <div 
            className="max-w-5xl w-full max-h-[85vh] flex flex-col items-center justify-center p-2 sm:p-4 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[65vh] sm:max-h-[70vh] rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-slate-900">
              <img
                src={filteredPhotos[lightboxIndex]?.src}
                alt={filteredPhotos[lightboxIndex]?.title}
                className="max-h-[65vh] sm:max-h-[70vh] w-auto object-contain rounded-3xl animate-scaleUp"
              />
            </div>

            {/* Bottom Caption Bar */}
            <div className="mt-4 max-w-2xl text-center space-y-1 px-4">
              <div className="flex items-center justify-center gap-2">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  {filteredPhotos[lightboxIndex]?.categoryLabel}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {filteredPhotos[lightboxIndex]?.date}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                {filteredPhotos[lightboxIndex]?.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
                {filteredPhotos[lightboxIndex]?.description}
              </p>
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={(e) => { e.stopPropagation(); showNext(); }}
            title="Next (Right Arrow)"
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white transition-all touch-press hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Click background to close */}
          <div className="absolute inset-0 -z-10" onClick={closeLightbox}></div>

        </div>
      )}

      {/* 5. CALL TO ACTION FOR 2026 CELEBRATION */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 text-center space-y-4 bg-gradient-to-br from-amber-500/10 via-purple-500/10 to-indigo-500/10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs font-black">
          <Sparkles className="w-3.5 h-3.5 text-purple-500" />
          <span>Teachers' Day 2026 is Here!</span>
        </div>

        <h3 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">
          Let's Make <span className="gradient-text-gold">Guru Utsav 2026</span> Even Grander!
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto font-medium leading-relaxed">
          Join all CSE 2nd & 3rd Year students in honoring our mentors. Complete your ₹50 contribution for the celebration pass and cast your confidential faculty votes!
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              fireFestiveConfetti();
              setActiveTab('pay');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-sm shadow-xl hover:scale-105 transition-all touch-press"
          >
            <CreditCard className="w-4 h-4" />
            <span>1. Payment & Entry Pass (₹50)</span>
          </button>

          <button
            onClick={() => {
              fireTrophyConfetti();
              setActiveTab('vote-faculty');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-sm shadow-xl hover:scale-105 transition-all touch-press"
          >
            <Vote className="w-4 h-4" />
            <span>2. Vote Faculty & Stories</span>
          </button>
        </div>
      </div>

    </section>
  );
};
