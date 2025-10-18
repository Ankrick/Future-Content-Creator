import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Plus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import BusinessInfoForm from './BusinessInfoForm';
import './WriteTextModal.css';
import axios from 'axios';

const WriteTextModal = ({ isOpen, onClose, onPostCreated, onBusinessAdded, businesses = [] }) => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [isBusinessFormOpen, setIsBusinessFormOpen] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm();

  const handleAddBusiness = () => {
    setIsBusinessFormOpen(true);
  };

  const handleBusinessFormClose = () => {
    setIsBusinessFormOpen(false);
  };

  const handleBusinessFormSubmit = (businessData) => {
    // TODO: Replace with actual API call to save business
    console.log('New business data:', businessData);
    
    // Call parent callback to add the new business
    if (onBusinessAdded) {
      const newBusiness = {
        id: Date.now(), // Generate temporary ID
        ...businessData
      };
      onBusinessAdded(newBusiness);
    }
    
    setIsBusinessFormOpen(false);
    alert('Business added successfully!'); // TODO: Replace with proper notification
  };

  const onSubmit = async (data) => {
    try {
      // TODO: Replace with actual API call
    //   console.log('Write Text form data:', data);

      setIsLoading(true);
      const promptDetails = {
        businessId: data.businessId,
        contentLength: data.contentLength,
        tone: data.tone,
        targetAge: data.targetAge,
        contentPurpose: data.contentPurpose,
        emotion: data.emotion,
        reference: data.reference
      };

      console.log('Sending data to API:', promptDetails);
      console.log('API URL:', 'http://localhost:4000/api/prompts/copy');

      const res = await axios.post('http://localhost:4000/api/prompts/copy', promptDetails);

      if(res.status == 200){
        setIsLoading(false);
        
        console.log('API Response Data:', res.data);
        
        // Extract posts from the specific structure (post_1, post_2, etc.)
        const formattedPosts = [];
        const postKeys = Object.keys(res.data).filter(key => key.startsWith('post_'));
        
        postKeys.forEach((key, index) => {
          const post = res.data[key];
          if (post && post.title && post.content) {
            formattedPosts.push({
              id: Date.now() + index, // Generate unique ID
              title: post.title,
              type: 'text',
              createdAt: new Date().toISOString().split('T')[0],
              preview: post.content.length > 100 ? 
                       post.content.substring(0, 100) + '...' : 
                       post.content,
              fullContent: post.content
            });
          }
        });
        
        console.log('Formatted Posts:', formattedPosts);
        console.log(`Total posts formatted: ${formattedPosts.length}`);
        
        // Call the callback to update parent component with all formatted posts
        if (onPostCreated && formattedPosts.length > 0) {
          onPostCreated(formattedPosts);
        }
        
        // Close the modal and reset form after successful submission
        console.log('Form submitted successfully!');
        reset();
        onClose();
      }
    } catch (error) {
      console.error('Form submission error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      
      // More specific error message
      const errorMessage = error.response?.data?.message || 
                          error.response?.statusText || 
                          error.message || 
                          'Unknown error occurred';
      
      alert(`Failed to submit form: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t('createTextContent')}</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="write-form">
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
                title={t('addNewBusiness')}
              >
                <Plus size={16} />
              </button>
            </div>
            {errors.businessId && <span className="error-message">{errors.businessId.message}</span>}
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
                  {t('generating')}
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

export default WriteTextModal;