import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PenTool, Image, Mic, FileText, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import WriteTextModal from '../components/WriteTextModal';
import UploadImageModal from '../components/UploadImageModal';
import RecordVoiceModal from '../components/RecordVoiceModal';
import ContentDetailModal from '../components/ContentDetailModal';
import BusinessInfoForm from '../components/BusinessInfoForm';
import UserDropdown from '../components/UserDropdown';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const [isWriteTextModalOpen, setIsWriteTextModalOpen] = useState(false);
  const [isUploadImageModalOpen, setIsUploadImageModalOpen] = useState(false);
  const [isRecordVoiceModalOpen, setIsRecordVoiceModalOpen] = useState(false);
  const [isContentDetailModalOpen, setIsContentDetailModalOpen] = useState(false);
  const [isInitialBusinessFormOpen, setIsInitialBusinessFormOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  // State for recent posts - will be updated from WriteTextModal
  const [recentPosts, setRecentPosts] = useState([]);

  // Businesses data from API
  const [businesses, setBusinesses] = useState([]);
  const [isLoadingBusinesses, setIsLoadingBusinesses] = useState(true);

  // Fetch businesses from API on component mount
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setIsLoadingBusinesses(true);
        const response = await axios.get('http://localhost:4000/api/stores', {
          withCredentials: true
        });
        setBusinesses(response.data);
      } catch (error) {
        console.error('Error fetching businesses:', error);
        // If there's an error fetching, keep businesses as empty array
      } finally {
        setIsLoadingBusinesses(false);
      }
    };

    fetchBusinesses();
  }, []);

  // Check if businesses array is empty and show initial business form
  useEffect(() => {
    // Only show form if we're not loading and there are no businesses
    if (!isLoadingBusinesses && businesses.length === 0) {
      setIsInitialBusinessFormOpen(true);
    }
  }, [businesses.length, isLoadingBusinesses]);

  const handleLogout = async () => {
    try {
      await logout();
      console.log('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still navigate to login even if logout API fails
      navigate('/login');
    }
  };

  const handleWriteText = () => {
    if (isLoadingBusinesses) {
      return; // Don't do anything while loading
    }
    if (businesses.length === 0) {
      setIsInitialBusinessFormOpen(true);
      return;
    }
    setIsWriteTextModalOpen(true);
  };

  const closeWriteTextModal = () => {
    setIsWriteTextModalOpen(false);
  };

  const handleUploadImage = () => {
    if (isLoadingBusinesses) {
      return; // Don't do anything while loading
    }
    if (businesses.length === 0) {
      setIsInitialBusinessFormOpen(true);
      return;
    }
    setIsUploadImageModalOpen(true);
  };

  const closeUploadImageModal = () => {
    setIsUploadImageModalOpen(false);
  };

  const handleRecordVoice = () => {
    if (isLoadingBusinesses) {
      return; // Don't do anything while loading
    }
    if (businesses.length === 0) {
      setIsInitialBusinessFormOpen(true);
      return;
    }
    setIsRecordVoiceModalOpen(true);
  };

  const closeRecordVoiceModal = () => {
    setIsRecordVoiceModalOpen(false);
  };

  const handleGenerateImage = (post) => {
    if (isLoadingBusinesses) {
      return; // Don't do anything while loading
    }
    if (businesses.length === 0) {
      setIsInitialBusinessFormOpen(true);
      return;
    }
    // TODO: Implement AI image generation modal based on post content
    console.log('Generate Image for post:', post.title);
    console.log('Post content:', post.preview);
    // This could open a new modal for AI image generation
    // using the post content as context for image generation
  };

  // Handle new post creation from WriteTextModal
  const handlePostCreated = (newPosts) => {
    console.log('=== Dashboard handlePostCreated called ===');
    console.log('Received newPosts:', newPosts);
    console.log('Current recentPosts before update:', recentPosts);
    
    // Handle both single post and multiple posts
    if (Array.isArray(newPosts)) {
      // If multiple posts are passed, add all of them
      console.log('Adding multiple posts to recent posts');
      setRecentPosts(prevPosts => {
        const updated = [...newPosts, ...prevPosts].slice(0, 5);
        console.log('Updated recentPosts (multiple):', updated);
        return updated;
      });
    } else {
      // If single post is passed, add it
      console.log('Adding single post to recent posts');
      setRecentPosts(prevPosts => {
        const updated = [newPosts, ...prevPosts].slice(0, 5);
        console.log('Updated recentPosts (single):', updated);
        return updated;
      });
    }
  };

  // Handle post click to show detail modal
  const handlePostClick = (post) => {
    setSelectedPost(post);
    setIsContentDetailModalOpen(true);
  };

  // Close content detail modal
  const closeContentDetailModal = () => {
    setIsContentDetailModalOpen(false);
    setSelectedPost(null);
  };

  // Handle new business addition
  const handleBusinessAdded = async (businessData) => {
    try {
      const response = await axios.post('http://localhost:4000/api/stores/create', businessData, {
        withCredentials: true
      });
      const newBusiness = response.data;
      setBusinesses(prevBusinesses => [...prevBusinesses, newBusiness]);
    } catch (error) {
      console.error('Error creating business:', error);
      // Fallback to local state only if API fails
      const newBusiness = {
        id: Date.now(), // Generate unique ID as fallback
        ...businessData
      };
      setBusinesses(prevBusinesses => [...prevBusinesses, newBusiness]);
    }
  };

  // Handle initial business form
  const handleInitialBusinessFormClose = () => {
    // Only allow closing if there's at least one business
    // This function is called when clicking outside the modal,
    // but we prevent closing during initial setup
    if (businesses.length > 0) {
      setIsInitialBusinessFormOpen(false);
    }
  };

  const handleInitialBusinessFormSubmit = async (businessData) => {
    try {
      const response = await axios.post('http://localhost:4000/api/stores/create', businessData, {
        withCredentials: true
      });
      const newBusiness = response.data;
      setBusinesses(prevBusinesses => [...prevBusinesses, newBusiness]);
      setIsInitialBusinessFormOpen(false);
    } catch (error) {
      console.error('Error creating business:', error);
      // Fallback to local state only if API fails
      const newBusiness = {
        id: Date.now(), // Generate unique ID as fallback
        ...businessData
      };
      setBusinesses(prevBusinesses => [...prevBusinesses, newBusiness]);
      setIsInitialBusinessFormOpen(false);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="brand-logo">
            <h1>One-Click Content</h1>
          </div>
          <div className="header-actions">
            <UserDropdown onLogout={handleLogout} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-content">
          <div className="welcome-section">
            <h2>{t('whatCreateToday')}</h2>
            <p>{t('chooseOptions')}</p>
          </div>

          <div className="creation-options">
            <div 
              className={`option-card ${isLoadingBusinesses ? 'loading' : ''}`} 
              onClick={handleWriteText}
              style={{ pointerEvents: isLoadingBusinesses ? 'none' : 'auto', opacity: isLoadingBusinesses ? 0.7 : 1 }}
            >
              <div className="option-icon">
                <PenTool size={48} />
              </div>
              <div className="option-content">
                <h3>{t('writeText')}</h3>
                <p>{t('writeTextDescription')}</p>
              </div>
              <div className="option-arrow">→</div>
            </div>

            <div 
              className={`option-card ${isLoadingBusinesses ? 'loading' : ''}`} 
              onClick={handleUploadImage}
              style={{ pointerEvents: isLoadingBusinesses ? 'none' : 'auto', opacity: isLoadingBusinesses ? 0.7 : 1 }}
            >
              <div className="option-icon">
                <Image size={48} />
              </div>
              <div className="option-content">
                <h3>{t('uploadImage')}</h3>
                <p>{t('uploadImageDescription')}</p>
              </div>
              <div className="option-arrow">→</div>
            </div>

            <div 
              className={`option-card ${isLoadingBusinesses ? 'loading' : ''}`} 
              onClick={handleRecordVoice}
              style={{ pointerEvents: isLoadingBusinesses ? 'none' : 'auto', opacity: isLoadingBusinesses ? 0.7 : 1 }}
            >
              <div className="option-icon">
                <Mic size={48} />
              </div>
              <div className="option-content">
                <h3>{t('recordVoice')}</h3>
                <p>{t('recordVoiceDescription')}</p>
              </div>
              <div className="option-arrow">→</div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <WriteTextModal 
        isOpen={isWriteTextModalOpen} 
        onClose={closeWriteTextModal}
        onPostCreated={handlePostCreated}
        businesses={businesses}
        onBusinessAdded={handleBusinessAdded}
      />
      
      <UploadImageModal 
        isOpen={isUploadImageModalOpen} 
        onClose={closeUploadImageModal}
        businesses={businesses}
        onBusinessAdded={handleBusinessAdded}
        onPostCreated={handlePostCreated}
      />
      
      <RecordVoiceModal 
        isOpen={isRecordVoiceModalOpen} 
        onClose={closeRecordVoiceModal}
        businesses={businesses}
        onBusinessAdded={handleBusinessAdded}
      />
      
      <ContentDetailModal 
        isOpen={isContentDetailModalOpen}
        onClose={closeContentDetailModal}
        post={selectedPost}
      />

      {/* Initial Business Form Modal - Required when no businesses exist */}
      <BusinessInfoForm
        isOpen={isInitialBusinessFormOpen}
        onClose={handleInitialBusinessFormClose}
        onSubmit={handleInitialBusinessFormSubmit}
        isLoading={false}
        isInitialSetup={true}
      />

      {/* Recent Posts Section - Only show if there are posts */}
      {recentPosts.length > 0 && (
        <div className="recentPostsSection">
          <h3 className="sectionTitle">{t('recentContent')}</h3>
          <div className="recentPostsList">
          {recentPosts.map((post) => (
            <div key={post.id} className="postItem">
              <div className="postContent" onClick={() => handlePostClick(post)}>
                <div className="postHeader">
                    <div className="postIcon">
                      {post.type === 'text' && <FileText size={16} />}
                      {post.type === 'image' && <Image size={16} />}
                      {post.type === 'voice' && <Mic size={16} />}
                    </div>
                    <div className="postInfo">
                      <h4 className="postTitle">{post.title}</h4>
                    </div>
                  </div>
                  <p className="postPreview">{post.preview}</p>
              </div>
              <div className="postActions">
                <button 
                  className="generateImageButton"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGenerateImage(post);
                  }}
                  title={t('generateImage')}
                >
                  <Sparkles size={14} />
                  {t('generateImage')}
                </button>
              </div>
            </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;