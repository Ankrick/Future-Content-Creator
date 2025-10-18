import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Upload, Plus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import BusinessInfoForm from './BusinessInfoForm';
import './UploadImageModal.css';
import axios from 'axios';

const UploadImageModal = ({ isOpen, onClose, businesses = [], onBusinessAdded, onPostCreated }) => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isBusinessFormOpen, setIsBusinessFormOpen] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  // Business form handlers
  const handleAddBusiness = () => {
    setIsBusinessFormOpen(true);
  };

  const handleBusinessFormClose = () => {
    setIsBusinessFormOpen(false);
  };

  const handleBusinessFormSubmit = (businessData) => {
    // Handle new business creation
    if (onBusinessAdded) {
      onBusinessAdded(businessData);
    }
    setIsBusinessFormOpen(false);
  };

  const onSubmit = async (data) => {
    // Validate that a file is selected
    if (!selectedFile) {
      alert(t('selectImageFile'));
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      console.log('Upload Image form data:', data);
      console.log('Selected business ID:', data.businessId);
      console.log('Selected file:', selectedFile);
    
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('imageFile', selectedFile);
      formData.append('businessId', data.businessId);
      formData.append('contentLength', data.contentLength);
      formData.append('tone', data.tone);
      formData.append('targetAge', data.targetAge);
      formData.append('contentPurpose', data.contentPurpose);
      formData.append('emotion', data.emotion);
      if (data.reference) {
        formData.append('reference', data.reference);
      }

      // Debug: log FormData entries
      for (let pair of formData.entries()) {
        console.log(pair[0] + ', ', pair[1]);
      }

      const res = await axios.post('http://https://future-content-creator-2.onrender.com//api/prompts/imageInput', formData)
      console.log('=== UploadImageModal API Response Debug ===');
      console.log('Full API Response:', res);
      console.log('Response Data:', res.data);
      console.log('Response Data Type:', typeof res.data);
      console.log('Response Data Keys:', Object.keys(res.data || {}));
      
      // Format the response data similar to WriteTextModal
      const formattedPosts = [];
      
      if (res.data) {
        // NEW: Handle the cleaned JSON string response format
        if (res.data.cleaned) {
          console.log('Found cleaned data:', res.data.cleaned);
          try {
            const parsedData = JSON.parse(res.data.cleaned);
            console.log('Parsed cleaned data:', parsedData);
            
            // Check if there's a post object
            if (parsedData.post && parsedData.post.title) {
              const post = parsedData.post;
              console.log('Processing post from cleaned data:', post);
              
              // Extract content from various possible fields
              let content = post.content || post.caption || post.description || post.text || '';
              
              // If content is empty, try to extract from other fields
              if (!content) {
                // Look for any text-like fields
                const textFields = Object.values(post).filter(value => 
                  typeof value === 'string' && value.length > 10 && value !== post.title
                );
                content = textFields[0] || 'Generated content for image';
              }
              
              const formattedPost = {
                id: Date.now(),
                title: post.title,
                type: 'image',
                createdAt: new Date().toISOString().split('T')[0],
                preview: content.length > 100 ? 
                         content.substring(0, 100) + '...' : 
                         content,
                fullContent: content,
                imageFile: selectedFile
              };
              console.log('Adding formatted post from cleaned data:', formattedPost);
              formattedPosts.push(formattedPost);
            }
          } catch (parseError) {
            console.error('Error parsing cleaned data:', parseError);
            console.log('Raw cleaned data:', res.data.cleaned);
          }
        }
        
        // FALLBACK: Check for posts in the response (original format)
        if (formattedPosts.length === 0) {
          const postKeys = Object.keys(res.data).filter(key => key.startsWith('post_'));
          console.log('Found post keys:', postKeys);
          
          postKeys.forEach((key, index) => {
            const post = res.data[key];
            console.log(`Processing ${key}:`, post);
            if (post && post.title && post.content) {
              const formattedPost = {
                id: Date.now() + index, // Generate unique ID
                title: post.title,
                type: 'image', // Mark as image content
                createdAt: new Date().toISOString().split('T')[0],
                preview: post.content.length > 100 ? 
                         post.content.substring(0, 100) + '...' : 
                         post.content,
                fullContent: post.content,
                imageFile: selectedFile // Include the uploaded image reference
              };
              console.log('Adding formatted post:', formattedPost);
              formattedPosts.push(formattedPost);
            } else {
              console.log(`Skipping ${key} - missing title or content:`, post);
            }
          });
        }
        
        // If no post_ keys found, check for direct content
        if (formattedPosts.length === 0 && res.data.content) {
          console.log('No post_ keys found, checking for direct content:', res.data.content);
          const directPost = {
            id: Date.now(),
            title: res.data.title || 'Generated Image Content',
            type: 'image',
            createdAt: new Date().toISOString().split('T')[0],
            preview: res.data.content.length > 100 ? 
                     res.data.content.substring(0, 100) + '...' : 
                     res.data.content,
            fullContent: res.data.content,
            imageFile: selectedFile
          };
          console.log('Adding direct content post:', directPost);
          formattedPosts.push(directPost);
        }
        
        console.log('Final Formatted Image Posts:', formattedPosts);
        console.log(`Total image posts formatted: ${formattedPosts.length}`);
        console.log('onPostCreated callback exists:', !!onPostCreated);
        
        // Enhanced parsing for different API response formats
        if (formattedPosts.length === 0) {
          console.log('No posts formatted yet, trying alternative parsing methods...');
          
          // Method 1: Check for 'output' property (your API format)
          if (res.data.output) {
            console.log('Found output property:', res.data.output);
            formattedPosts.push({
              id: Date.now(),
              title: 'Generated Image Content',
              type: 'image',
              createdAt: new Date().toISOString().split('T')[0],
              preview: res.data.output.length > 100 ? 
                       res.data.output.substring(0, 100) + '...' : 
                       res.data.output,
              fullContent: res.data.output,
              imageFile: selectedFile
            });
          }
          // Method 2: Check if response has direct title/content structure
          else if (res.data.title && res.data.content) {
            console.log('Found direct title/content structure');
            formattedPosts.push({
              id: Date.now(),
              title: res.data.title,
              type: 'image',
              createdAt: new Date().toISOString().split('T')[0],
              preview: res.data.content.length > 100 ? 
                       res.data.content.substring(0, 100) + '...' : 
                       res.data.content,
              fullContent: res.data.content,
              imageFile: selectedFile
            });
          }
          // Method 3: Check if response is a string (direct content)
          else if (typeof res.data === 'string') {
            console.log('Found string response, treating as content');
            formattedPosts.push({
              id: Date.now(),
              title: 'Generated Image Content',
              type: 'image',
              createdAt: new Date().toISOString().split('T')[0],
              preview: res.data.length > 100 ? 
                       res.data.substring(0, 100) + '...' : 
                       res.data,
              fullContent: res.data,
              imageFile: selectedFile
            });
          }
          // Method 4: Check for any text-like properties
          else if (res.data.text || res.data.message || res.data.response) {
            const content = res.data.text || res.data.message || res.data.response;
            console.log('Found alternative content property:', content);
            formattedPosts.push({
              id: Date.now(),
              title: res.data.title || 'Generated Image Content',
              type: 'image',
              createdAt: new Date().toISOString().split('T')[0],
              preview: content.length > 100 ? 
                       content.substring(0, 100) + '...' : 
                       content,
              fullContent: content,
              imageFile: selectedFile
            });
          }
          // Method 5: Check for nested objects
          else {
            console.log('Trying to find content in nested objects...');
            const values = Object.values(res.data);
            for (const value of values) {
              if (typeof value === 'object' && value.title && value.content) {
                console.log('Found content in nested object:', value);
                formattedPosts.push({
                  id: Date.now(),
                  title: value.title,
                  type: 'image',
                  createdAt: new Date().toISOString().split('T')[0],
                  preview: value.content.length > 100 ? 
                           value.content.substring(0, 100) + '...' : 
                           value.content,
                  fullContent: value.content,
                  imageFile: selectedFile
                });
                break; // Take the first valid one
              }
            }
          }
        }
        
        // Call the callback to update parent component with all formatted posts
        if (onPostCreated && formattedPosts.length > 0) {
          console.log('Calling onPostCreated with posts:', formattedPosts);
          onPostCreated(formattedPosts);
          console.log('onPostCreated called successfully');
        } else {
          console.log('Not calling onPostCreated - callback missing or no posts:', {
            hasCallback: !!onPostCreated,
            postsLength: formattedPosts.length,
            responseData: res.data
          });
        }
        
        // Close the modal and reset form after successful submission
        console.log('Image upload form submitted successfully!');
        reset();
        setSelectedFile(null);
        onClose();
      } else {
        // Fallback if no structured data received
        alert(t('imageUploadSuccess'));
        reset();
        setSelectedFile(null);
        onClose();
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert(t('formSubmissionFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log('File selected:', file);
    setSelectedFile(file);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t('uploadImageContent')}</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="upload-form">
          {/* Business Selection */}
          <div className="form-group">
            <label htmlFor="businessId">{t('selectBusiness')}</label>
            <div className="business-select-container">
              <select
                id="businessId"
                className={`form-select ${errors.businessId ? 'error' : ''}`}
                {...register('businessId', { required: t('selectBusinessRequired') })}
              >
                <option value="">{t('businessNameDropdown')}</option>
                {businesses.map((business) => (
                  <option key={business.id} value={business.id}>
                    {business.businessName}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="add-business-button"
                onClick={handleAddBusiness}
                title={t('addBusiness')}
              >
                <Plus />
              </button>
            </div>
            {errors.businessId && <span className="error-message">{errors.businessId.message}</span>}
          </div>

          {/* Image File Upload */}
          <div className="form-group">
            <label htmlFor="imageFile">{t('uploadImageFile')}</label>
            <div className="file-upload-container">
              <input
                type="file"
                id="imageFile"
                accept="image/*"
                className="file-input"
                onChange={handleFileChange}
              />
              <div className="file-upload-display">
                <Upload size={24} />
                <span>{selectedFile ? selectedFile.name : t('chooseImageFile')}</span>
              </div>
            </div>
            {!selectedFile && <span className="error-message">{t('selectImageFile')}</span>}
          </div>

            {/* Content Length */}
            <div className="form-group">
                <label>{t('contentLength')}</label>
                <div className="radio-group">
                <label className="radio-option">
                    <input
                    type="radio"
                    value="short"
                    {...register('contentLength', { required: t('contentLengthRequired') })}
                    />
                    <span className="radio-label">{t('short')}</span>
                </label>
                <label className="radio-option">
                    <input
                    type="radio"
                    value="medium"
                    {...register('contentLength', { required: t('contentLengthRequired') })}
                    />
                    <span className="radio-label">{t('medium')}</span>
                </label>
                <label className="radio-option">
                    <input
                    type="radio"
                    value="long"
                    {...register('contentLength', { required: t('contentLengthRequired') })}
                    />
                    <span className="radio-label">{t('long')}</span>
                </label>
                </div>
                {errors.contentLength && <span className="error-message">{errors.contentLength.message}</span>}
            </div>

            {/* Tone Options */}
            <div className="form-group">
            <label htmlFor="tone">{t('tone')}</label>
            <select
                id="tone"
                className={`form-select ${errors.tone ? 'error' : ''}`}
                {...register('tone', { required: t('toneRequired') })}
            >
                <option value="professional">{t('professional')}</option>
                <option value="casual">{t('casual')}</option>
                <option value="friendly">{t('friendly')}</option>
                <option value="formal">{t('formal')}</option>
                <option value="humorous">{t('humorous')}</option>
                <option value="persuasive">{t('persuasive')}</option>
            </select>
            {errors.tone && <span className="error-message">{errors.tone.message}</span>}
            </div>

            {/* Target Age */}
            <div className="form-group">
            <label htmlFor="targetAge">{t('targetAge')}</label>
            <select
                id="targetAge"
                className={`form-select ${errors.targetAge ? 'error' : ''}`}
                {...register('targetAge', { required: t('targetAgeRequired') })}
            >
                <option value="child">{t('child')}</option>
                <option value="teen">{t('teen')}</option>
                <option value="young-adult">{t('youngAdult')}</option>
                <option value="adult">{t('adult')}</option>
                <option value="senior">{t('senior')}</option>
                <option value="all">{t('allAges')}</option>
            </select>
            {errors.targetAge && <span className="error-message">{errors.targetAge.message}</span>}
            </div>

            {/* Content Purpose */}
            <div className="form-group">
                <label htmlFor="contentPurpose">{t('purpose')}</label>
                <select
                id="contentPurpose"
                className={`form-select ${errors.contentPurpose ? 'error' : ''}`}
                {...register('contentPurpose', { required: t('contentPurposeRequired') })}
                >
                    <option value="engagement">{t('engagement')}</option>
                    <option value="conversion">{t('conversion')}</option>
                    <option value="lead">{t('lead')}</option>
                    <option value="increase-follower">{t('increaseFollower')}</option>
                </select>
                {errors.contentPurpose && <span className="error-message">{errors.contentPurpose.message}</span>}
            </div>

            {/* Describe Emotion */}
            <div className="form-group">
            <label htmlFor="emotion">{t('emotion')}</label>
            <select
                id="emotion"
                className={`form-select ${errors.emotion ? 'error' : ''}`}
                {...register('emotion', { required: t('emotionRequired') })}
            >
                <option value="neutral">{t('neutral')}</option>
                <option value="happy">{t('happy')}</option>
                <option value="excited">{t('excited')}</option>
                <option value="calm">{t('calm')}</option>
                <option value="serious">{t('serious')}</option>
                <option value="inspiring">{t('inspiring')}</option>
            </select>
            {errors.emotion && <span className="error-message">{errors.emotion.message}</span>}
            </div>

            {/* Reference */}
            <div className="form-group">
                <label htmlFor="reference">{t('reference')}</label>
                <input
                id="reference"
                type="text"
                className="form-input"
                placeholder={t('referencePlaceholder')}
                {...register('reference')}
                />
            </div>
          

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={isLoading}
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className={`submit-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  {t('loading')}
                </>
              ) : (
                t('generateContent')
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Business Info Form Modal */}
      <BusinessInfoForm
        isOpen={isBusinessFormOpen}
        onClose={handleBusinessFormClose}
        onSubmit={handleBusinessFormSubmit}
        isLoading={false}
      />
    </div>
  );
};

export default UploadImageModal;
