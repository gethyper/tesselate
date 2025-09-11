import React, { useState, useEffect } from 'react';
import { Carousel, CarouselItem } from './ui/carousel';

// Presentation slides data
const slidesData = [
  {
    id: 0,
    title: "Tessellations",
    content: {
      logo: true,
      heading: "TESSELLATIONS"
    }
  },
  {
    id: 1,
    title: "Tessellation Example 1",
    content: {
      backgroundImage: `${process.env.PUBLIC_URL}/images/examples/tessellation_1920x1080_persianKnots_Purp-uh-trator.png`
    }
  },
  {
    id: 2,
    title: "Tessellation Example 2", 
    content: {
      backgroundImage: `${process.env.PUBLIC_URL}/images/examples/tessellation_1920x1080_shadowBoxes_End-century_Modern.png`
    }
  },
  {
    id: 3,
    title: "Tessellation Example 3",
    content: {
      backgroundImage: `${process.env.PUBLIC_URL}/images/examples/tessellation_1920x1080_mosaicMitres_Electric_Sheep.png`
    }
  },
  {
    id: 4,
    title: "Inspiration",
    content: {
      sectionTitle: true,
      heading: "Inspiration",
      backgroundImage: `${process.env.PUBLIC_URL}/images/examples/tessellation_1920x1080_flatTop3x3_Coily_Cubes.png`
    }
  },
  {
    id: 5,
    title: "Quilting blocks",
    content: {
      backgroundImage: `${process.env.PUBLIC_URL}/images/examples/tessellation_1920x1080_Cat_Castle_Faded_Robot.png`
    }
  },
  {
    id: 6,
    title: "Escher sketches",
    content: {
      backgroundImage: `${process.env.PUBLIC_URL}/images/examples/tessellation_1920x1080_flatTop_2x1_Nanobeast.png`
    }
  },
  {
    id: 7,
    title: "Video games",
    content: {
      backgroundImage: `${process.env.PUBLIC_URL}/images/examples/tessellation_1920x1080_flatTop+3x3_Basic_Bee.png`
    }
  },
  {
    id: 8,
    title: "Islamic tiling",
    content: {
      backgroundImage: `${process.env.PUBLIC_URL}/images/examples/tessellation_1920x1080_mosaicMitres_Banned_in_'85.png`
    }
  },
  {
    id: 9,
    title: "Building the stack...",
    content: {
      sectionTitle: true,
      heading: "Inspiration",
      backgroundImage: `${process.env.PUBLIC_URL}/images/examples/tessellation_1920x1080_flatTop3x3_Coily Cubes.png`
    }
  },
  {
    id: 10,
    title: "Claude Code Time!",
    content: {
      heading: "Demo Time!",
      text: "Let's explore the tessellation generator live",
      sections: [
        {
          title: "Key Features to Show",
          items: [
            "Pattern selection",
            "Color theme preview",
            "Size and adjustment controls",
            "Real-time rendering",
            "Download functionality"
          ]
        },
        {
          title: "URL Parameter Examples",
          items: [
            { text: "Persian Knots + Purple", code: "?pattern=persianKnots&theme=Purp-uh-trator&size=25" },
            { text: "Shadow Boxes + Chrome", code: "?pattern=shadowBoxes&theme=Chrome Dreams&size=30" },
            { text: "Triangles + Neon", code: "?pattern=persianTriangles&theme=Nanobeast&size=20" },
            { text: "Wave Effects", code: "?pattern=shadowBoxes&theme=basicBee&tile_x_adjust=wave:15:0.2" }
          ]
        }
      ]
    }
  },
  {
    id: 11,
    title: "Hexatile Pattern Schema",
    content: {
      customHtml: true,
      leftColumn: {
        title: "JSON Schema Editor",
        code: `{
  "tileShape": "hexagon",
  "colorPalette": [
    [255, 107, 107], 
    [78, 205, 196], 
    [199, 244, 100]
  ],
  "patternMatrix": [
    [0, 1, 0],
    [1, 2, 1], 
    [0, 1, 0]
  ],
  "transforms": {
    "rotation": 30,
    "scale": 1.0
  }
}`
      },
      rightColumn: {
        title: "Live Hexagon Preview",
        content: "Interactive hexagon pattern will render here based on the JSON schema"
      }
    }
  },
  {
    id: 12,
    title: "Open Source",
    content: {
      heading: "Open Source",
      sections: [
        {
          title: "Available on GitHub",
          items: [
            "Full source code",
            "MIT License",
            "Community contributions welcome",
            "Documentation and examples"
          ]
        },
        {
          title: "Tech Stack Details",
          items: [
            "Modern React patterns",
            "Responsive CSS",
            "Canvas optimization",
            "Performance monitoring"
          ]
        }
      ]
    }
  },
  {
    id: 13,
    title: "Questions & Discussion",
    content: {
      heading: "Questions & Discussion",
      sections: [
        {
          title: "Contact Information",
          items: [
            "GitHub: gethyper/tesselate",
            "Issues and feature requests welcome",
            "Community feedback appreciated"
          ]
        }
      ],
      footer: {
        title: "Thank You!",
        text: "Ready to create your own tessellations?"
      }
    }
  }
];

const Presentation = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      setSlides(slidesData);
    } catch (error) {
      console.error('Error loading presentation slides:', error);
      setSlides([
        {
          id: 0,
          title: "Error",
          content: {
            heading: "Error Loading Presentation",
            text: "Sorry, we couldn't load the presentation content. Please try refreshing the page."
          }
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  const renderSlideContent = (content) => {
    const elements = [];

    // Section title slide with background image
    if (content.sectionTitle) {
      elements.push(
        <div key="section-title" className="flex items-center justify-center h-full">
          <h1 
            className="text-white font-bold text-center px-8 py-4 rounded-lg"
            style={{ 
              fontFamily: 'Inter, sans-serif',
              fontSize: '120px',
              lineHeight: '1',
              letterSpacing: '3px',
              textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
              backgroundColor: 'rgba(0,0,0,0.3)',
              backdropFilter: 'blur(4px)'
            }}
          >
            {content.heading}
          </h1>
        </div>
      );
      return elements;
    }

    // Custom HTML two-column layout
    if (content.customHtml) {
      elements.push(
        <div key="custom-layout" className="flex h-full p-8">
          {/* Left Column */}
          <div className="w-1/2 pr-4">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              {content.leftColumn.title}
            </h3>
            {content.leftColumn.code && (
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-auto h-80">
                <code>{content.leftColumn.code}</code>
              </pre>
            )}
            {content.leftColumn.content && (
              <div className="text-base leading-relaxed">
                {content.leftColumn.content}
              </div>
            )}
          </div>
          
          {/* Right Column */}
          <div className="w-1/2 pl-4">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              {content.rightColumn.title}
            </h3>
            {content.rightColumn.content && (
              <div className="text-base leading-relaxed bg-gray-100 p-6 rounded-lg h-80 flex items-center justify-center text-gray-600">
                {content.rightColumn.content}
              </div>
            )}
          </div>
        </div>
      );
      return elements;
    }

    // Background image slide - full bleed
    if (content.backgroundImage && !content.sectionTitle) {
      return null; // No content needed, handled by background
    }

    // Logo slide with centered title
    if (content.logo) {
      elements.push(
        <div key="logo-container" className="flex flex-col items-center justify-center h-full text-center">
          <div className="flex items-center justify-center mb-8">
            <svg 
              width="80" 
              height="80" 
              viewBox="0 0 24 24" 
              className="mr-8"
              style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))' }}
            >
              <polygon 
                points="12,1 22,7 22,17 12,23 2,17 2,7" 
                stroke="#1f2937" 
                strokeWidth="1.5px" 
                fill="none" 
              />
            </svg>
            <h1 
              className="text-gray-900 font-medium tracking-wider"
              style={{ 
                fontFamily: 'Tourney, sans-serif',
                fontSize: '180px',
                lineHeight: '1',
                letterSpacing: '2px'
              }}
            >
              {content.heading}
            </h1>
          </div>
          {content.subheading && (
            <h2 className="text-4xl font-bold text-gray-700 mt-4">
              {content.subheading}
            </h2>
          )}
        </div>
      );
      return elements;
    }

    // Main heading
    if (content.heading) {
      elements.push(
        <h1 key="heading" className="font-bold mb-8 text-gray-900" style={{ fontSize: '128px' }}>
          {content.heading}
        </h1>
      );
    }

    // Subheading
    if (content.subheading) {
      elements.push(
        <h2 key="subheading" className="text-4xl font-bold mb-6 text-gray-900">
          {content.subheading}
        </h2>
      );
    }

    // Text content
    if (content.text) {
      elements.push(
        <p key="text" className="text-base leading-relaxed mb-4">
          {content.text}
        </p>
      );
    }

    // Simple items list
    if (content.items && !content.items[0]?.text) {
      elements.push(
        <ul key="items" className="list-disc list-inside space-y-2 mb-6 text-base">
          {content.items.map((item, index) => (
            <li key={index} className="mb-2">{item}</li>
          ))}
        </ul>
      );
    }

    // Complex items with descriptions
    if (content.items && content.items[0]?.text) {
      elements.push(
        <ul key="complex-items" className="list-disc list-inside space-y-2 mb-6 text-base">
          {content.items.map((item, index) => (
            <li key={index} className="mb-2">
              <strong className="font-semibold text-gray-900">{item.text}</strong>
              {item.description && `: ${item.description}`}
              {item.code && (
                <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono ml-2">
                  {item.code}
                </code>
              )}
            </li>
          ))}
        </ul>
      );
    }

    // Sections
    if (content.sections) {
      content.sections.forEach((section, sectionIndex) => {
        elements.push(
          <h3 key={`section-${sectionIndex}`} className="text-2xl font-semibold mb-4 text-gray-800">
            {section.title}
          </h3>
        );

        if (section.code) {
          // Code block section
          elements.push(
            <pre key={`section-code-${sectionIndex}`} className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-auto mb-6 max-h-80">
              <code>{section.code}</code>
            </pre>
          );
        } else if (section.items && !section.items[0]?.text) {
          elements.push(
            <ul key={`section-items-${sectionIndex}`} className="list-disc list-inside space-y-2 mb-6 text-base">
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex} className="mb-2">{item}</li>
              ))}
            </ul>
          );
        } else if (section.items && section.items[0]?.text) {
          elements.push(
            <ul key={`section-complex-items-${sectionIndex}`} className="list-disc list-inside space-y-2 mb-6 text-base">
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex} className="mb-2">
                  <strong className="font-semibold text-gray-900">{item.text}</strong>
                  {item.description && `: ${item.description}`}
                  {item.code && (
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono ml-2">
                      {item.code}
                    </code>
                  )}
                </li>
              ))}
            </ul>
          );
        }
      });
    }

    // Note
    if (content.note) {
      elements.push(
        <p key="note" className="text-base leading-relaxed mb-4 italic">
          {content.note}
        </p>
      );
    }

    // Footer
    if (content.footer) {
      elements.push(
        <div key="footer" className="mt-8">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">
            {content.footer.title}
          </h3>
          <p className="text-base leading-relaxed mb-4">
            {content.footer.text}
          </p>
        </div>
      );
    }

    return elements;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-xl text-gray-600">Loading presentation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      {/* Carousel container with max dimensions and responsive scaling */}
      <div 
        className="rounded-2xl shadow-2xl overflow-hidden bg-white"
        style={{
          width: 'min(100vw - 2rem, min(100vh * 16/9 - 2rem, 1920px))',
          height: 'min(100vh - 2rem, min(100vw * 9/16 - 2rem, 1080px))',
          aspectRatio: '16/9',
        }}
      >
        <Carousel className="bg-white h-full">
          {slides.map((slide) => (
            <CarouselItem 
              key={slide.id} 
              className={
                slide.content.backgroundImage ? "h-full p-0 border-r border-gray-300 last:border-r-0" :
                slide.content.logo ? "h-full border-r border-gray-300 last:border-r-0" : 
                "px-12 py-8 border-r border-gray-300 last:border-r-0"
              }
              style={
                slide.content.backgroundImage ? {
                  backgroundImage: `url(${slide.content.backgroundImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center center',
                  backgroundRepeat: 'no-repeat',
                  width: '100%',
                  height: '100%'
                } : {}
              }
            >
              <div className={
                slide.content.backgroundImage || slide.content.sectionTitle ? "h-full" :
                slide.content.logo ? "h-full" : 
                "max-w-4xl mx-auto"
              }>
                <div className={
                  slide.content.backgroundImage || slide.content.sectionTitle ? "h-full" :
                  slide.content.logo ? "h-full" : 
                  "prose prose-lg max-w-none"
                }>
                  {renderSlideContent(slide.content)}
                </div>
              </div>
            </CarouselItem>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default Presentation;