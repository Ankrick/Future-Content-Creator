import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Save, Building2, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import './BusinessInfoForm.css';

const BusinessInfoForm = ({ isOpen, onClose, onSubmit, initialData = {}, isLoading = false, isInitialSetup = false }) => {
  const { t } = useLanguage();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      businessName: initialData.businessName || '',
      coreOffering: initialData.coreOffering || '',
      uniqueSellingProposition: initialData.uniqueSellingProposition || '',
      targetAudience: initialData.targetAudience || '',
      businessMission: initialData.businessMission || ''
    }
  });

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={isInitialSetup ? undefined : onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h2>{isInitialSetup ? t('setupFirstBusiness') : t('addNewBusiness')}</h2>
          {!isInitialSetup && (
            <button
              onClick={onClose}
              className="close-button"
              type="button"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Business Info Form */}
        <div className="business-info-form">
          <div className="form-header">
            <div className="form-icon">
              <Building2 size={24} />
            </div>
            <h3>{isInitialSetup ? t('setupFirstBusiness') : t('businessInformation')}</h3>
            <p>{isInitialSetup ? t('addFirstBusinessDescription') : t('businessInformationDescription')}</p>
          </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="business-form">
        {/* Business Name */}
        <div className="form-group">
          <label htmlFor="businessName">{t('businessName')}</label>
          <input
            type="text"
            id="businessName"
            className={`form-input ${errors.businessName ? 'error' : ''}`}
            placeholder={t('businessNamePlaceholder')}
            {...register('businessName', {
              required: t('businessNameRequired'),
              minLength: {
                value: 2,
                message: t('businessNameMinLength')
              },
              maxLength: {
                value: 100,
                message: t('businessNameMaxLength')
              }
            })}
          />
          {errors.businessName && (
            <span className="error-message">{errors.businessName.message}</span>
          )}
        </div>

        {/* Core Offering/Niche */}
        <div className="form-group">
          <label htmlFor="coreOffering">{t('coreOffering')}</label>
          <input
            type="text"
            id="coreOffering"
            className={`form-input ${errors.coreOffering ? 'error' : ''}`}
            placeholder={t('coreOfferingPlaceholder')}
            {...register('coreOffering', {
              required: t('coreOfferingRequired'),
              minLength: {
                value: 5,
                message: t('coreOfferingMinLength')
              },
              maxLength: {
                value: 200,
                message: t('coreOfferingMaxLength')
              }
            })}
          />
          {errors.coreOffering && (
            <span className="error-message">{errors.coreOffering.message}</span>
          )}
        </div>

        {/* Unique Selling Proposition */}
        <div className="form-group">
          <label htmlFor="uniqueSellingProposition">{t('uniqueSellingProposition')}</label>
          <textarea
            id="uniqueSellingProposition"
            className={`form-textarea ${errors.uniqueSellingProposition ? 'error' : ''}`}
            placeholder={t('uniqueSellingPropositionPlaceholder')}
            rows={3}
            {...register('uniqueSellingProposition', {
              required: t('uniqueSellingPropositionRequired'),
              minLength: {
                value: 10,
                message: t('uniqueSellingPropositionMinLength')
              },
              maxLength: {
                value: 500,
                message: t('uniqueSellingPropositionMaxLength')
              }
            })}
          />
          {errors.uniqueSellingProposition && (
            <span className="error-message">{errors.uniqueSellingProposition.message}</span>
          )}
        </div>

        {/* Target Audience */}
        <div className="form-group">
          <label htmlFor="targetAudience">{t('targetAudience')}</label>
          <input
            type="text"
            id="targetAudience"
            className={`form-input ${errors.targetAudience ? 'error' : ''}`}
            placeholder={t('targetAudiencePlaceholder')}
            {...register('targetAudience', {
              required: t('targetAudienceRequired'),
              minLength: {
                value: 5,
                message: t('targetAudienceMinLength')
              },
              maxLength: {
                value: 200,
                message: t('targetAudienceMaxLength')
              }
            })}
          />
          {errors.targetAudience && (
            <span className="error-message">{errors.targetAudience.message}</span>
          )}
        </div>

        {/* Business Mission */}
        <div className="form-group">
          <label htmlFor="businessMission">{t('businessMission')}</label>
          <textarea
            id="businessMission"
            className={`form-textarea ${errors.businessMission ? 'error' : ''}`}
            placeholder={t('businessMissionPlaceholder')}
            rows={3}
            {...register('businessMission', {
              required: t('businessMissionRequired'),
              minLength: {
                value: 10,
                message: t('businessMissionMinLength')
              },
              maxLength: {
                value: 500,
                message: t('businessMissionMaxLength')
              }
            })}
          />
          {errors.businessMission && (
            <span className="error-message">{errors.businessMission.message}</span>
          )}
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          {!isInitialSetup && (
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={isLoading}
            >
              {t('cancel')}
            </button>
          )}
          <button
            type="submit"
            className={`submit-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                {t('saving')}
              </>
            ) : (
              <>
                <Save size={14} />
                {t('saveBusinessInfo')}
              </>
            )}
          </button>
        </div>
      </form>
        </div>
      </div>
    </div>
  );
};

export default BusinessInfoForm;