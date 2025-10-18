import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  ArrowLeft, 
  Save, 
  Download, 
  Globe, 
  Settings as SettingsIcon,
  Bell,
  CreditCard,
  BarChart3,
  Shield,
  FileText,
  Volume2
} from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const navigate = useNavigate();
  const { language, changeLanguage, t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    defaultValues: {
      language: language,
      defaultContentLength: 'medium',
      defaultTone: 'professional',
      defaultAgeGroup: 'adult',
      defaultLocation: 'global',
      defaultPurpose: 'general',
      defaultEmotion: 'neutral',
      businessDescription: ''
    }
  });

  // Mock data - TODO: Replace with actual API data
  const [usageData] = useState({
    currentPlan: 'Free',
    contentGenerated: 15,
    contentLimit: 50,
  });

  const [billingHistory] = useState([
    { date: '2024-09-15', amount: '$0.00', plan: 'Free Plan', status: 'Active' },
  ]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Save language preference
      if (data.language !== language) {
        changeLanguage(data.language);
      }
      
      // TODO: Replace with actual API call
      console.log('Settings update data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // TODO: Handle successful settings update
      console.log('Settings updated successfully!');
      alert(t('Settings updated successfully!'));
    } catch (error) {
      console.error('Settings update error:', error);
      alert(t('Failed to update settings. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };



  const handleDataExport = async () => {
    setIsExporting(true);
    try {
      // TODO: Replace with actual API call
      console.log('Exporting user data...');
      
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // TODO: Trigger actual download
      alert('Data export completed! Download will start shortly.');
    } catch (error) {
      console.error('Data export error:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const getUsagePercentage = (used, limit) => {
    return Math.min((used / limit) * 100, 100);
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <button className="back-button" onClick={handleBack}>
          <ArrowLeft size={20} />
          {t('backToDashboard')}
        </button>
        <h1 style={{ textAlign: 'center' }}>{t('settingsTitle')}</h1>
      </div>

      <div className="settings-content">
        <form onSubmit={handleSubmit(onSubmit)} className="settings-form">
          
          {/* Language & Region */}
          <div className="settings-section">
            <div className="section-header">
              <div className="section-title">
                <Globe size={20} />
                <h2>{t('languageRegion')}</h2>
              </div>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <label htmlFor="language">{t('interfaceLanguage')}</label>
                <span className="setting-description">{t('languageDescription')}</span>
              </div>
              <select
                id="language"
                className="setting-select"
                {...register('language')}
              >
                <option value="en">English</option>
                <option value="my">မြန်မာ (Burmese)</option>
              </select>
            </div>
          </div>

          {/* Content Generation Defaults */}
          <div className="settings-section">
            <div className="section-header">
              <div className="section-title">
                <FileText size={20} />
                <h2>{t('contentGenerationDefaults')}</h2>
              </div>
            </div>
            
            <div className="settings-grid">
              <div className="setting-item">
                <label htmlFor="defaultContentLength">Default Content Length</label>
                <select
                  id="defaultContentLength"
                  className="setting-select"
                  {...register('defaultContentLength')}
                >
                  <option value="short">Short (100-200 words)</option>
                  <option value="medium">Medium (200-500 words)</option>
                  <option value="long">Long (500+ words)</option>
                </select>
              </div>

              <div className="setting-item">
                <label htmlFor="defaultTone">Default Tone</label>
                <select
                  id="defaultTone"
                  className="setting-select"
                  {...register('defaultTone')}
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="friendly">Friendly</option>
                  <option value="formal">Formal</option>
                  <option value="humorous">Humorous</option>
                  <option value="persuasive">Persuasive</option>
                </select>
              </div>

              <div className="setting-item">
                <label htmlFor="defaultAgeGroup">Default Target Age</label>
                <select
                  id="defaultAgeGroup"
                  className="setting-select"
                  {...register('defaultAgeGroup')}
                >
                  <option value="child">Child (5-12)</option>
                  <option value="teen">Teen (13-17)</option>
                  <option value="young-adult">Young Adult (18-25)</option>
                  <option value="adult">Adult (26-45)</option>
                  <option value="senior">Senior (45+)</option>
                  <option value="all">All Ages</option>
                </select>
              </div>

              <div className="setting-item">
                <label htmlFor="defaultLocation">Default Location</label>
                <select
                  id="defaultLocation"
                  className="setting-select"
                  {...register('defaultLocation')}
                >
                  <option value="global">Global</option>
                  <option value="myanmar">Myanmar</option>
                </select>
              </div>

              <div className="setting-item">
                <label htmlFor="defaultPurpose">Default Purpose</label>
                <select
                  id="defaultPurpose"
                  className="setting-select"
                  {...register('defaultPurpose')}
                >
                  <option value="general">General</option>
                  <option value="marketing">Marketing</option>
                  <option value="education">Education</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="information">Information</option>
                  <option value="persuasion">Persuasion</option>
                </select>
              </div>

              <div className="setting-item">
                <label htmlFor="defaultEmotion">Default Emotion</label>
                <select
                  id="defaultEmotion"
                  className="setting-select"
                  {...register('defaultEmotion')}
                >
                  <option value="neutral">Neutral</option>
                  <option value="happy">Happy</option>
                  <option value="excited">Excited</option>
                  <option value="calm">Calm</option>
                  <option value="serious">Serious</option>
                  <option value="inspiring">Inspiring</option>
                </select>
              </div>
            </div>
          </div>

          {/* Business Description */}
          {/* <div className="settings-section">
            <div className="section-header">
              <div className="section-title">
                <FileText size={20} />
                <h2>Business Description</h2>
              </div>
            </div>
            
            <div className="setting-item business-description-item">
              <div className="setting-info">
                <label htmlFor="businessDescription">Describe Your Business</label>
                <span className="setting-description">Tell us about your business to help generate more relevant content</span>
              </div>
              <div className="business-description-container">
                <textarea
                  id="businessDescription"
                  className="form-textarea"
                  placeholder="Describe your business, industry, target audience, products/services, etc..."
                  rows="5"
                  {...register('businessDescription')}
                />
                <button
                  type="button"
                  className="save-business-button"
                  onClick={() => {
                    // TODO: Save business description separately
                    console.log('Business description saved');
                    alert('Business description saved successfully!');
                  }}
                >
                  <Save size={16} />
                  Save Business Info
                </button>
              </div>
            </div>
          </div> */}

          {/* Data Export */}
          <div className="settings-section">
            <div className="section-header">
              <div className="section-title">
                <Download size={20} />
                <h2>{t('dataExport')}</h2>
              </div>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <label>{t('exportYourData')}</label>
                <span className="setting-description">{t('exportDescription')}</span>
              </div>
              <button
                type="button"
                className={`export-button ${isExporting ? 'loading' : ''}`}
                onClick={handleDataExport}
                disabled={isExporting}
              >
                {isExporting ? (
                  <>
                    <span className="spinner"></span>
                    {t('exporting')}
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    {t('exportData')}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Usage & Billing */}
          <div className="settings-section">
            <div className="section-header">
              <div className="section-title">
                <BarChart3 size={20} />
                <h2>{t('usageBilling')}</h2>
              </div>
            </div>
            
            {/* Current Plan */}
            <div className="usage-card">
              <div className="usage-header">
                <h3>{t('currentPlan')}: {usageData.currentPlan}</h3>
                <button
                  type="button"
                  className="upgrade-link"
                  onClick={() => navigate('/profile')}
                >
                  {t('upgradePlan')}
                </button>
              </div>
              
              {/* Usage Metrics */}
              <div className="usage-metrics">
                <div className="usage-metric">
                  <div className="metric-header">
                    <span>Content Generated</span>
                    <span>{usageData.contentGenerated}/{usageData.contentLimit}</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${getUsagePercentage(usageData.contentGenerated, usageData.contentLimit)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Billing History */}
            <div className="billing-section">
              <h3>Billing History</h3>
              <div className="billing-table">
                <div className="table-header">
                  <span>Date</span>
                  <span>Plan</span>
                  <span>Amount</span>
                  <span>Status</span>
                </div>
                {billingHistory.map((bill, index) => (
                  <div key={index} className="table-row">
                    <span>{bill.date}</span>
                    <span>{bill.plan}</span>
                    <span>{bill.amount}</span>
                    <span className={`status ${bill.status.toLowerCase()}`}>{bill.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="settings-actions">
            <button
              type="submit"
              className={`save-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  {t('saving')}
                </>
              ) : (
                <>
                  <Save size={16} />
                  {t('settingsTitle')} {t('save')} 
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;