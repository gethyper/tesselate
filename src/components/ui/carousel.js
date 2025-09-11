import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const Carousel = ({ children, className, ...props }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const slides = React.Children.toArray(children);
  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

  // Keyboard navigation
  const handleKeyPress = useCallback((event) => {
    switch(event.key) {
      case 'ArrowRight':
      case ' ':
        event.preventDefault();
        nextSlide();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        prevSlide();
        break;
      case 'Home':
        event.preventDefault();
        goToSlide(0);
        break;
      case 'End':
        event.preventDefault();
        goToSlide(totalSlides - 1);
        break;
      default:
        break;
    }
  }, [nextSlide, prevSlide, goToSlide, totalSlides]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Touch handling
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }
  };

  return (
    <div 
      className={cn("relative w-full h-full overflow-hidden group", className)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      {...props}
    >
      {/* Main carousel content */}
      <div 
        className="flex transition-transform duration-300 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="w-full flex-shrink-0 h-full">
            {slide}
          </div>
        ))}
      </div>

      {/* Navigation buttons - glass themed */}
      <button
        onClick={prevSlide}
        disabled={currentSlide === 0}
        className={cn(
          "absolute left-4 bottom-4 z-10",
          "rounded-full p-3 shadow-lg border border-white/20",
          "transition-all duration-200 hover:scale-110",
          "opacity-0 group-hover:opacity-100",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        )}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
        }}
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-gray-800" />
      </button>

      <button
        onClick={nextSlide}
        disabled={currentSlide === totalSlides - 1}
        className={cn(
          "absolute right-4 bottom-4 z-10",
          "rounded-full p-3 shadow-lg border border-white/20",
          "transition-all duration-200 hover:scale-110",
          "opacity-0 group-hover:opacity-100",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        )}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
        }}
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-gray-800" />
      </button>

      {/* Slide indicators - hidden */}

      {/* Slide counter - glass themed */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
        <div 
          className="text-gray-800 px-3 py-1 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-white/20 shadow-lg"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {currentSlide + 1} / {totalSlides}
        </div>
      </div>

      {/* Keyboard help - hidden completely */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10" style={{ display: 'none' }}>
        <div className="bg-black/50 text-white px-3 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          ← → or Space to navigate
        </div>
      </div>
    </div>
  );
};

const CarouselContent = ({ children, className, ...props }) => {
  return (
    <div className={cn("w-full h-full", className)} {...props}>
      {children}
    </div>
  );
};

const CarouselItem = ({ children, className, ...props }) => {
  return (
    <div 
      className={cn(
        "w-full h-full",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

export { Carousel, CarouselContent, CarouselItem };