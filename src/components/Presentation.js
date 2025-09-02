import React, { useState, useEffect, useCallback } from 'react';
import './Presentation.css';

const Presentation = ({ markdownContent }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);

  // Parse markdown content into slides
  useEffect(() => {
    if (markdownContent) {
      // Split markdown by slide separators (---)
      const slideContent = markdownContent.split(/\n---\n/);
      const parsedSlides = slideContent.map((content, index) => ({
        id: index,
        content: content.trim(),
        title: content.split('\n')[0].replace('#', '').trim()
      }));
      setSlides(parsedSlides);
    } else {
      // Default slides
      setSlides([
        {
          id: 0,
          title: "Welcome to Tessellations",
          content: "# Welcome to Tessellations\n\nA beautiful geometric pattern generator"
        },
        {
          id: 1, 
          title: "Features",
          content: "## Features\n\n- Interactive pattern generation\n- Multiple tile designs\n- Customizable color themes\n- Real-time adjustments\n- High-resolution downloads"
        },
        {
          id: 2,
          title: "Getting Started", 
          content: "## Getting Started\n\n1. Choose a pattern\n2. Select a color theme\n3. Adjust the size\n4. Apply effects\n5. Download your creation"
        },
        {
          id: 3,
          title: "Thank You",
          content: "## Thank You!\n\nQuestions?"
        }
      ]);
    }
  }, [markdownContent]);


  // Keyboard navigation
  const handleKeyPress = useCallback((event) => {
    switch(event.key) {
      case 'ArrowRight':
      case ' ':
        if (currentSlide < slides.length - 1) {
          setCurrentSlide(prev => prev + 1);
        }
        break;
      case 'ArrowLeft':
        if (currentSlide > 0) {
          setCurrentSlide(prev => prev - 1);
        }
        break;
      case 'Home':
        setCurrentSlide(0);
        break;
      case 'End':
        setCurrentSlide(slides.length - 1);
        break;
      default:
        break;
    }
  }, [currentSlide, slides.length]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Navigate to slide
  const goToSlide = (slideIndex) => {
    setCurrentSlide(slideIndex);
  };

  // Render markdown as HTML (simple implementation)
  const renderMarkdown = (markdown) => {
    return markdown
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      .replace(/^(\d+\. .*$)/gm, '<li>$1</li>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(?!<[h|l])/gm, '<p>')
      .replace(/<p><\/p>/g, '')
      .replace(/<p>(<[hl])/g, '$1')
      .replace(/(<\/[hl][^>]*>)<\/p>/g, '$1')
      .replace(/<li>/g, '<ul><li>')
      .replace(/<\/li>\n<li>/g, '</li><li>')
      .replace(/<\/li>(?!\n<li>)/g, '</li></ul>');
  };


  if (slides.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-pulse">
            <div className="loading-icon">📊</div>
            <p className="loading-text">Loading presentation...</p>
          </div>
        </div>
      </div>
    );
  }

  const currentSlideData = slides[currentSlide] || slides[0];

  return (
    <div className="presentation-container">
      {/* Presentation Container */}
      <div className="presentation-content">
        {/* Main Slide Area */}
        <div className="slide-area">
          <div className="slide-container no-tessellation">
            <div 
              className="prose"
              dangerouslySetInnerHTML={{ 
                __html: renderMarkdown(currentSlideData.content) 
              }}
            />
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="nav-controls">
          <div className="nav-bar">
            {/* Previous Button */}
            <button
              onClick={() => goToSlide(Math.max(0, currentSlide - 1))}
              disabled={currentSlide === 0}
              className="nav-button"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Slide Indicators */}
            <div className="slide-indicators">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`slide-dot ${index === currentSlide ? 'active' : ''}`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() => goToSlide(Math.min(slides.length - 1, currentSlide + 1))}
              disabled={currentSlide === slides.length - 1}
              className="nav-button"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Slide Counter */}
        <div className="slide-counter">
          {currentSlide + 1} / {slides.length}
        </div>

        {/* Keyboard Instructions */}
        <div className="keyboard-help">
          Use ←→ or Space to navigate
        </div>
      </div>
    </div>
  );
};

export default Presentation;