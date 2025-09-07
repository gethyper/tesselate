// Initialize Google Analytics
export const initGA = (measurementId) => {
  if (typeof window !== 'undefined' && measurementId) {
    // Add the gtag script to the page
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${measurementId}');
    `;
    document.head.appendChild(script2);
  }
};

// Track page views
export const trackPageView = (page_path) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.REACT_APP_GA_MEASUREMENT_ID, {
      page_path: page_path,
    });
  }
};

// Track custom events
export const trackEvent = (action, category = 'User Interaction', label = null, value = null) => {
  if (typeof window !== 'undefined' && window.gtag) {
    const eventParams = {
      event_category: category,
    };
    
    if (label) eventParams.event_label = label;
    if (value) eventParams.value = value;
    
    window.gtag('event', action, eventParams);
  }
};

// Track tessellation-specific events
export const trackTessellationEvent = (action, details = {}) => {
  trackEvent(action, 'Tessellation', details.label, details.value);
};