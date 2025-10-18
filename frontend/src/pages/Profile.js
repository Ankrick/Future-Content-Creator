import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Save, Eye, EyeOff, Crown, Calendar, CreditCard, Check, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import './Profile.css';

const Profile = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  
  // Mock subscription data - TODO: Replace with actual API data
  const [currentSubscription] = useState({
    plan: 'Free',
    status: 'active',
    nextBilling: null,
    features: [t('feature1'), t('feature2'), t('feature3')]
  });
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm({
    defaultValues: {
      fullName: '',
      username: '',
      email: ''
    }
  });

  // Update form when user data is available
  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName || user.name || '',
        username: user.username || '',
        email: user.email || ''
      });
    }
  }, [user, reset]);

  const newPassword = watch('newPassword');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      console.log('Profile update data:', data);
      console.log('Profile image:', profileImage);
      
      // Create FormData for profile update (in case of image upload)
      const formData = new FormData();
      formData.append('fullName', data.fullName);
      formData.append('username', data.username);
      formData.append('email', data.email);
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }
      if (data.currentPassword && data.newPassword) {
        formData.append('currentPassword', data.currentPassword);
        formData.append('newPassword', data.newPassword);
      }
      
      // TODO: Replace with actual API call when backend endpoint is ready
      // const response = await axios.put('http://https://future-content-creator-2.onrender.com//api/users/profile', formData, {
      //   withCredentials: true,
      //   headers: {
      //     'Content-Type': 'multipart/form-data'
      //   }
      // });
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Profile updated successfully!');
      alert(t('profileUpdatedSuccess'));
      setIsEditingPassword(false);
      
      // Reset password fields
      if (data.currentPassword) {
        reset({
          ...data,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      alert(t('profileUpdateFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleUpgrade = (planType) => {
    // TODO: Implement actual upgrade logic
    console.log(`Upgrading to ${planType} plan`);
    alert(t('redirectingCheckout').replace('{plan}', planType));
  };

  return (
    <div className="profile-container">
      {/* Show loading state while user data is being fetched */}
      {!user ? (
        <div className="loading-container" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '200px',
          fontSize: '18px'
        }}>
          {t('loading')}
        </div>
      ) : (
        <>
          <div className="profile-header">
            <button className="back-button" onClick={handleBack}>
              <ArrowLeft size={20} />
              {t('backToDashboard')}
            </button>
            <h1 style={{ textAlign: 'center' }}>{t('profileSettings')}</h1>
          </div>

      <div className="profile-content">
        <form onSubmit={handleSubmit(onSubmit)} className="profile-form">
          {/* Profile Picture Section */}
          <div className="profile-image-section">
            <div className="profile-image-container">
              <div className="profile-image">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" />
                ) : (
                  <div className="profile-placeholder">
                    <Camera size={32} />
                  </div>
                )}
              </div>
              <label className="image-upload-button">
                <Camera size={16} />
                {t('changePhoto')}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>

          {/* Basic Information */}
          <div className="form-section">
            <h2>{t('basicInformation')}</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullName">{t('fullName')}</label>
                <input
                  type="text"
                  id="fullName"
                  className={`form-input ${errors.fullName ? 'error' : ''}`}
                  {...register('fullName', {
                    required: t('fullNameRequired'),
                    minLength: {
                      value: 2,
                      message: t('nameMinLength')
                    }
                  })}
                />
                {errors.fullName && <span className="error-message">{errors.fullName.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="username">{t('username')}</label>
                <input
                  type="text"
                  id="username"
                  className={`form-input ${errors.username ? 'error' : ''}`}
                  {...register('username', {
                    required: t('usernameRequired'),
                    minLength: {
                      value: 3,
                      message: t('usernameMinLength')
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9_]+$/,
                      message: t('usernamePattern')
                    }
                  })}
                />
                {errors.username && <span className="error-message">{errors.username.message}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">{t('emailAddress')}</label>
              <input
                type="email"
                id="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                {...register('email', {
                  required: t('emailRequired'),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t('invalidEmail')
                  }
                })}
              />
              {errors.email && <span className="error-message">{errors.email.message}</span>}
            </div>
          </div>

          {/* Current Subscription Section */}
          <div className="form-section">
            <h2>{t('currentSubscription')}</h2>
            
            <div className="subscription-info">
              <div className="current-plan">
                <div className="plan-header">
                  <div className="plan-icon">
                    {currentSubscription.plan === 'Free' ? <Star size={24} /> : <Crown size={24} />}
                  </div>
                  <div className="plan-details">
                    <h3>{t(currentSubscription.plan.toLowerCase() + 'Plan')}</h3>
                    <span className={`plan-status ${currentSubscription.status}`}>
                      {currentSubscription.status === 'active' ? t('active') : t('inactive')}
                    </span>
                  </div>
                </div>
                
                {currentSubscription.nextBilling && (
                  <div className="billing-info">
                    <Calendar size={16} />
                    <span>{t('nextBilling')}: {currentSubscription.nextBilling}</span>
                  </div>
                )}
                
                <div className="plan-features">
                  <h4>{t('currentFeatures')}:</h4>
                  <ul>
                    {currentSubscription.features.map((feature, index) => (
                      <li key={index}>
                        <Check size={16} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Upgrade Subscription Section */}
          <div className="form-section">
            <h2>{t('upgradeYourPlan')}</h2>
            
            <div className="subscription-plans">
              <div className="plan-card">
                <div className="plan-card-header">
                  <Crown size={24} />
                  <h3>{t('proPlan')}</h3>
                  <div className="plan-price">
                    <span className="price">45000 MMK</span>
                    <span className="period">/month</span>
                  </div>
                </div>
                
                <div className="plan-features">
                  <ul>
                    <li><Check size={16} />{t('feature4')}</li>
                    <li><Check size={16} />{t('feature5')}</li>
                    <li><Check size={16} />{t('feature6')}</li>
                    <li><Check size={16} />{t('feature7')}</li>
                    <li><Check size={16} />{t('feature8')}</li>
                  </ul>
                </div>
                
                <button
                  type="button"
                  className="upgrade-button pro"
                  onClick={() => handleUpgrade('Pro')}
                  disabled={currentSubscription.plan === 'Pro'}
                >
                  {currentSubscription.plan === 'Pro' ? t('currentPlan') : t('upgradeToPro')}
                </button>
              </div>

              <div className="plan-card premium">
                <div className="plan-badge">{t('mostPopular')}</div>
                <div className="plan-card-header">
                  <Crown size={24} />
                  <h3>{t('premiumPlan')}</h3>
                  <div className="plan-price">
                    <span className="price">79000 MMK</span>
                    <span className="period">/month</span>
                  </div>
                </div>
                
                <div className="plan-features">
                  <ul>
                    <li><Check size={16} />{t('feature9')}</li>
                    <li><Check size={16} />{t('feature10')}</li>
                    <li><Check size={16} />{t('feature11')}</li>
                    <li><Check size={16} />{t('feature12')}</li>
                    <li><Check size={16} />{t('feature13')}</li>
                    <li><Check size={16} />{t('feature14')}</li>
                  </ul>
                </div>
                
                <button
                  type="button"
                  className="upgrade-button premium"
                  onClick={() => handleUpgrade('Premium')}
                  disabled={currentSubscription.plan === 'Premium'}
                >
                  {currentSubscription.plan === 'Premium' ? t('currentPlan') : t('upgradeToPremiun')}
                </button>
              </div>
            </div>
            
            <div className="billing-info-section">
              <div className="billing-note">
                <CreditCard size={16} />
                <span>{t('allPlansInclude')}</span>
              </div>
            </div>
          </div>

          {/* Password Change Section */}
          <div className="form-section">
            <div className="section-header">
              <h2>{t('password')}</h2>
              <button
                type="button"
                className="toggle-password-button"
                onClick={() => setIsEditingPassword(!isEditingPassword)}
              >
                {isEditingPassword ? t('cancel') : t('changePassword')}
              </button>
            </div>

            {isEditingPassword && (
              <div className="password-change-section">
                <div className="form-group">
                  <label htmlFor="currentPassword">{t('currentPassword')}</label>
                  <div className="password-input-container">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      id="currentPassword"
                      className={`form-input ${errors.currentPassword ? 'error' : ''}`}
                      {...register('currentPassword', {
                        required: isEditingPassword ? t('currentPasswordRequired') : false
                      })}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.currentPassword && <span className="error-message">{errors.currentPassword.message}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="newPassword">{t('newPassword')}</label>
                    <div className="password-input-container">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        id="newPassword"
                        className={`form-input ${errors.newPassword ? 'error' : ''}`}
                        {...register('newPassword', {
                          required: isEditingPassword ? t('newPasswordRequired') : false,
                          minLength: {
                            value: 8,
                            message: t('passwordMinLength8')
                          },
                          pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                            message: t('passwordMustContain')
                          }
                        })}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.newPassword && <span className="error-message">{errors.newPassword.message}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmNewPassword">{t('confirmNewPassword')}</label>
                    <div className="password-input-container">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmNewPassword"
                        className={`form-input ${errors.confirmNewPassword ? 'error' : ''}`}
                        {...register('confirmNewPassword', {
                          required: isEditingPassword ? t('pleaseConfirmNewPassword') : false,
                          validate: value =>
                            !isEditingPassword || value === newPassword || t('passwordsNotMatch')
                        })}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.confirmNewPassword && <span className="error-message">{errors.confirmNewPassword.message}</span>}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="form-actions">
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
                  {t('saveChanges')}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
        </>
      )}
    </div>
  );
};

export default Profile;