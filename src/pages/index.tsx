import { useState } from 'react';
import Head from 'next/head';
import FileUpload from '../components/FileUpload';
import LoadingSpinner from '../components/LoadingSpinner';
import TopicOutline from '../components/TopicOutline';
import PresentationViewer from '../components/PresentationViewer';
import '../app/globals.css'; 

// Define interfaces for data structures
interface Topic {
  id: string;
  title: string;
  description: string;
}

interface ExtractedImage {
  id: string;
  filename: string;
  relativePath: string;
  description: string; // Now includes description from backend
}

interface SlideData {
  id: string;
  type: 'text_only' | 'text_left_image_right' | 'image_left_text_right' | 'two_column_text';
  title: string;
  content?: string;
  textContent?: string;
  imageUrl?: string;
  imageAlt?: string;
  column1Content?: string;
  column2Content?: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

const HomePage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [extractedTopics, setExtractedTopics] = useState<Topic[]>([]);
  const [extractedImages, setExtractedImages] = useState<ExtractedImage[]>([]);
  const [rawTextContent, setRawTextContent] = useState<string>(''); // Store raw text for content generation
  const [uploadId, setUploadId] = useState<string | null>(null);

  const [generatedSlides, setGeneratedSlides] = useState<SlideData[]>([]);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setUploading(true);
    setUploadError(null);
    setExtractedTopics([]);
    setExtractedImages([]);
    setRawTextContent('');
    setUploadId(null);
    setGeneratedSlides([]);
    setGenerating(false);
    setGenerateError(null);
    setCurrentSlideIndex(0);

    const formData = new FormData();
    formData.append('pdfFile', file);

    try {
      const response = await fetch(`${BACKEND_URL}/upload-pdf`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload PDF and extract topics.');
      }

      const data = await response.json();
      setExtractedTopics(data.topics);
      setExtractedImages(data.extractedImages);
      setRawTextContent(data.rawTextContent); // Assuming backend sends this back (it should from the prompt)
      setUploadId(data.uploadId);
      console.log('Extracted Topics:', data.topics);
      console.log('Extracted Images (with descriptions):', data.extractedImages);
      console.log('Upload ID:', data.uploadId);

    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleAddTopic = (title: string, description: string) => {
    const newTopic: Topic = {
      id: `manual-${Date.now()}`, // Simple unique ID for manual topics
      title,
      description,
    };
    setExtractedTopics((prev) => [...prev, newTopic]);
  };

  const handleEditTopic = (id: string, newTitle: string, newDescription: string) => {
    setExtractedTopics((prev) =>
      prev.map((topic) =>
        topic.id === id ? { ...topic, title: newTitle, description: newDescription } : topic
      )
    );
  };

  const handleRemoveTopic = (id: string) => {
    setExtractedTopics((prev) => prev.filter((topic) => topic.id !== id));
  };

  const handleGenerateContent = async () => {
    setGenerating(true);
    setGenerateError(null);
    setGeneratedSlides([]);
    setCurrentSlideIndex(0);

    try {
      const response = await fetch(`${BACKEND_URL}/generate-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topics: extractedTopics,
          rawTextContent: rawTextContent,
          extractedImages: extractedImages,
          uploadId: uploadId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate presentation content.');
      }

      const data = await response.json();
      setGeneratedSlides(data.slides);
      console.log('Generated Slides:', data.slides);
    } catch (error: any) {
      console.error('Content generation error:', error);
      setGenerateError(error.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => Math.min(prev + 1, generatedSlides.length - 1));
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-900 font-sans p-8">
      <Head>
        <title>PPT Generator AI</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto max-w-6xl py-8">
        <h1 className="text-5xl font-extrabold text-center text-purple-800 mb-12 drop-shadow-lg">
          AI-Powered Presentation Generator
        </h1>

        {/* Section 1: File Upload */}
        <section className="mb-16">
          <FileUpload onFileSelect={handleFileSelect} isLoading={uploading} />
          {uploadError && (
            <p className="text-red-600 text-center mt-4 text-lg font-medium">Error: {uploadError}</p>
          )}
        </section>

        {/* Section 2: Loading State */}
        {uploading && (
          <section className="flex justify-center mb-16">
            <LoadingSpinner />
          </section>
        )}

        {/* Section 3: Topic Outline (Visible after upload or if topics exist) */}
        {!uploading && extractedTopics.length > 0 && (
          <section className="mb-16">
            <TopicOutline
              topics={extractedTopics}
              onAddTopic={handleAddTopic}
              onEditTopic={handleEditTopic}
              onRemoveTopic={handleRemoveTopic}
              onGenerateContent={handleGenerateContent}
              isGenerating={generating}
            />
            {generateError && (
              <p className="text-red-600 text-center mt-4 text-lg font-medium">Error generating content: {generateError}</p>
            )}
          </section>
        )}

        {/* Section 4: Generating Content Loading State */}
        {generating && (
          <section className="flex justify-center mb-16">
            <LoadingSpinner />
          </section>
        )}

        {/* Section 5: Generated Presentation Viewer */}
        {!generating && generatedSlides.length > 0 && (
          <section>
            <PresentationViewer
              slides={generatedSlides}
              currentSlideIndex={currentSlideIndex}
              onNext={handleNextSlide}
              onPrev={handlePrevSlide}
            />
          </section>
        )}
      </main>
    </div>
  );
};

export default HomePage;