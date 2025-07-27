import React from 'react';
import ReactMarkdown, { Components } from 'react-markdown'; // Import 'Components' type
import rehypeRaw from 'rehype-raw';

interface SlideProps {
  title: string;
  className?: string; // Optional for additional styling
}

interface TextOnlySlideProps extends SlideProps {
  content: string;
}

interface TextImageSlideProps extends SlideProps {
  textContent: string;
  imageUrl: string;
  imageAlt: string;
}

interface TwoColumnTextSlideProps extends SlideProps {
  column1Content: string;
  column2Content: string;
}

// Custom components to override default Markdown rendering for better styling control
// Use the 'Components' type from 'react-markdown' to correctly type the renderers
const MarkdownComponents: Components = {
  // Fix: Explicitly type the props for each component
  // Using an underscore for 'node' tells ESLint it's intentionally unused.
  h1: ({ node: _node, ...props }) => <h3 className="text-2xl font-bold text-gray-800 mb-4" {...props} />,
  h2: ({ node: _node, ...props }) => <h4 className="text-xl font-semibold text-gray-700 mb-3" {...props} />,
  h3: ({ node: _node, ...props }) => <h5 className="text-lg font-semibold text-gray-600 mb-2" {...props} />,
  p: ({ node: _node, ...props }) => <p className="mb-4 leading-relaxed" {...props} />,
  ul: ({ node: _node, ...props }) => <ul className="list-disc pl-5 mb-4 space-y-2" {...props} />,
  ol: ({ node: _node, ...props }) => <ol className="list-decimal pl-5 mb-4 space-y-2" {...props} />,
  li: ({ node: _node, ...props }) => <li className="text-base text-gray-700" {...props} />,
  a: ({ node: _node, ...props }) => <a className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
  strong: ({ node: _node, ...props }) => <strong className="font-bold text-gray-900" {...props} />,
  em: ({ node: _node, ...props }) => <em className="italic text-gray-600" {...props} />,
  // Add more custom components for blockquote, code, etc., if needed
  // If you need the 'node' for more complex logic (e.g., checking node type or children),
  // then you'd use it normally and remove the '_' prefix.
};

// Base Slide Wrapper
const SlideWrapper: React.FC<React.PropsWithChildren<SlideProps>> = ({ title, children, className }) => (
  <div className={`
    bg-gradient-to-br from-white to-gray-50 p-10 rounded-2xl shadow-2xl border border-gray-100
    flex flex-col justify-between min-h-[550px] transition-all duration-300 ease-in-out
    ${className}
  `}>
    <h2 className="text-5xl font-extrabold text-purple-800 mb-10 text-center drop-shadow-md tracking-tight">
      {title}
    </h2>
    <div className="flex-grow flex items-center justify-center w-full">
      {children}
    </div>
  </div>
);

export const TextOnlySlide: React.FC<TextOnlySlideProps> = ({ title, content }) => (
  <SlideWrapper title={title}>
    <div className="prose lg:prose-xl max-w-3xl text-gray-700 text-center px-4">
      <ReactMarkdown rehypePlugins={[rehypeRaw]} components={MarkdownComponents}>
        {content}
      </ReactMarkdown>
    </div>
  </SlideWrapper>
);

export const TextLeftImageRightSlide: React.FC<TextImageSlideProps> = ({ title, textContent, imageUrl, imageAlt }) => (
  <SlideWrapper title={title}>
    <div className="flex flex-col md:flex-row items-center justify-center gap-12 w-full max-w-5xl mx-auto">
      <div className="md:w-1/2 flex justify-end"> {/* Pushes text to the left */}
        <div className="prose lg:prose-lg max-w-xl text-gray-700 text-left">
          <ReactMarkdown rehypePlugins={[rehypeRaw]} components={MarkdownComponents}>
            {textContent}
          </ReactMarkdown>
        </div>
      </div>
      <div className="md:w-1/2 flex items-center justify-center">
        <div className="relative w-full max-w-md bg-white p-2 rounded-xl shadow-lg border border-gray-200 transform hover:scale-105 transition-transform duration-300">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="w-full h-auto rounded-lg object-contain max-h-[350px]"
            onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400/D1D5DB/4B5563?text=Image+Not+Found'; }}
          />
          {imageAlt && (
            <p className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-50 text-white text-xs p-1 rounded-md text-center">
              {imageAlt}
            </p>
          )}
        </div>
      </div>
    </div>
  </SlideWrapper>
);

export const ImageLeftTextRightSlide: React.FC<TextImageSlideProps> = ({ title, imageUrl, imageAlt, textContent }) => (
  <SlideWrapper title={title}>
    <div className="flex flex-col md:flex-row items-center justify-center gap-12 w-full max-w-5xl mx-auto">
      <div className="md:w-1/2 flex items-center justify-center">
        <div className="relative w-full max-w-md bg-white p-2 rounded-xl shadow-lg border border-gray-200 transform hover:scale-105 transition-transform duration-300">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="w-full h-auto rounded-lg object-contain max-h-[350px]"
            onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400/D1D5DB/4B5563?text=Image+Not+Found'; }}
          />
          {imageAlt && (
            <p className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-50 text-white text-xs p-1 rounded-md text-center">
              {imageAlt}
            </p>
          )}
        </div>
      </div>
      <div className="md:w-1/2 flex justify-start"> {/* Pushes text to the right */}
        <div className="prose lg:prose-lg max-w-xl text-gray-700 text-left">
          <ReactMarkdown rehypePlugins={[rehypeRaw]} components={MarkdownComponents}>
            {textContent}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  </SlideWrapper>
);

export const TwoColumnTextSlide: React.FC<TwoColumnTextSlideProps> = ({ title, column1Content, column2Content }) => (
  <SlideWrapper title={title}>
    <div className="flex flex-col md:flex-row items-start justify-center gap-10 w-full max-w-5xl mx-auto">
      <div className="md:w-1/2 prose lg:prose-lg max-w-lg text-gray-700 text-left">
        <ReactMarkdown rehypePlugins={[rehypeRaw]} components={MarkdownComponents}>
          {column1Content}
        </ReactMarkdown>
      </div>
      <div className="md:w-1/2 prose lg:prose-lg max-w-lg text-gray-700 text-left">
        <ReactMarkdown rehypePlugins={[rehypeRaw]} components={MarkdownComponents}>
          {column2Content}
        </ReactMarkdown>
      </div>
    </div>
  </SlideWrapper>
);