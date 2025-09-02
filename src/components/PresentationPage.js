import React, { useState, useEffect } from 'react';
import Presentation from './Presentation';
import { presentationContent } from './presentationContent';
import './Presentation.css';

const PresentationPage = () => {
  const [markdownContent, setMarkdownContent] = useState('');
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    // Use imported presentation content directly
    setMarkdownContent(presentationContent);
    setLoading(false);
  }, []);



  if (loading) {
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


  return <Presentation markdownContent={markdownContent} />;
};

export default PresentationPage;