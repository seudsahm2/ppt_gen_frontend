import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TextOnlySlide, TextLeftImageRightSlide, ImageLeftTextRightSlide, TwoColumnTextSlide } from './SlideComponents';

// IMPORTANT: Get the backend URL from the environment variable
// This ensures it's available in the browser during client-side rendering
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'; // Make sure this matches your Express.js port

interface SlideData {
  id: string;
  type: 'text_only' | 'text_left_image_right' | 'image_left_text_right' | 'two_column_text';
  title: string;
  content?: string; // For text_only
  textContent?: string; // For image slides
  imageUrl?: string; // For image slides
  imageAlt?: string; // For image slides
  column1Content?: string; // For two_column_text
  column2Content?: string; // For two_column_text
}

interface PresentationViewerProps {
  slides: SlideData[];
  currentSlideIndex: number;
  onNext: () => void;
  onPrev: () => void;
}

const PresentationViewer: React.FC<PresentationViewerProps> = ({ slides, currentSlideIndex, onNext, onPrev }) => {
  if (slides.length === 0) {
    return <p className="text-center text-gray-500">No slides to display.</p>;
  }

  const currentSlide = slides[currentSlideIndex];

  // Helper function to construct the full image URL
  const getFullImageUrl = (relativePath: string | undefined): string => {
    if (!relativePath) {
      return ''; // Return empty string if no image path is provided
    }
    // Ensure that BACKEND_URL does not end with a '/' and relativePath starts with one, or vice-versa
    const cleanedBaseUrl = BACKEND_URL.endsWith('/') ? BACKEND_URL.slice(0, -1) : BACKEND_URL;
    const cleanedRelativePath = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
    const fullUrl = `${cleanedBaseUrl}${cleanedRelativePath}`;
    // console.log(`[PresentationViewer] Constructed Image URL: ${fullUrl}`); // Add this for debugging
    return fullUrl;
  };

  const renderSlide = (slide: SlideData) => {
    switch (slide.type) {
      case 'text_only':
        return <TextOnlySlide title={slide.title} content={slide.content || ''} />;
      case 'text_left_image_right':
        return (
          <TextLeftImageRightSlide
            title={slide.title}
            textContent={slide.textContent || ''}
            // *** HERE IS THE CHANGE ***
            imageUrl={getFullImageUrl(slide.imageUrl)}
            imageAlt={slide.imageAlt || ''}
          />
        );
      case 'image_left_text_right':
        return (
          <ImageLeftTextRightSlide
            title={slide.title}
            // *** HERE IS THE CHANGE ***
            imageUrl={getFullImageUrl(slide.imageUrl)}
            imageAlt={slide.imageAlt || ''}
            textContent={slide.textContent || ''}
          />
        );
      case 'two_column_text':
        return (
          <TwoColumnTextSlide
            title={slide.title}
            column1Content={slide.column1Content || ''}
            column2Content={slide.column2Content || ''}
          />
        );
      default:
        return <TextOnlySlide title="Error" content="Unknown slide type." />;
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gradient-to-br from-blue-50 to-purple-100 rounded-xl shadow-2xl border border-blue-200">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Your Generated Presentation</h2>

      <div className="relative w-full max-w-4xl min-h-[500px] bg-white rounded-lg shadow-xl overflow-hidden mb-6">
        {renderSlide(currentSlide)}
      </div>

      <div className="flex items-center justify-between w-full max-w-4xl mt-4">
        <button
          onClick={onPrev}
          disabled={currentSlideIndex === 0}
          className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-full shadow-md hover:bg-purple-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
        >
          <ChevronLeft className="w-6 h-6 mr-2" /> Previous
        </button>
        <span className="text-xl font-semibold text-gray-700">
          Slide {currentSlideIndex + 1} / {slides.length}
        </span>
        <button
          onClick={onNext}
          disabled={currentSlideIndex === slides.length - 1}
          className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-full shadow-md hover:bg-purple-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
        >
          Next <ChevronRight className="w-6 h-6 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default PresentationViewer;