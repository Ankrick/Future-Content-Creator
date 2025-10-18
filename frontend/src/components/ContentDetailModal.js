import React from 'react';
import { X, FileText, Image, Mic, Calendar, Copy, Download } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import './ContentDetailModal.css';

const ContentDetailModal = ({ isOpen, onClose, post }) => {
  const { t } = useLanguage();
  
  if (!isOpen || !post) return null;

  const handleCopyContent = () => {
    navigator.clipboard.writeText(post.fullContent || post.preview);
    // You could add a toast notification here
    console.log('Content copied to clipboard');
  };

  const handleDownload = () => {
    // Create content with title and content
    const fileContent = `${post.title}\n\n${post.fullContent || post.preview}`;
    
    const element = document.createElement('a');
    const file = new Blob([fileContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${post.title.substring(0, 30)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getIcon = () => {
    switch (post.type) {
      case 'text':
        return <FileText size={24} />;
      case 'image':
        return <Image size={24} />;
      case 'voice':
        return <Mic size={24} />;
      default:
        return <FileText size={24} />;
    }
  };

  return (
    <div className="content-modal-overlay" onClick={onClose}>
      <div className="content-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="content-modal-header">
          <div className="content-header-info">
            <div className="content-icon">
              {getIcon()}
            </div>
            <div className="content-meta">
              <h2 className="content-title">{post.title}</h2>
              <div className="content-date">
                <Calendar size={16} />
                <span>{post.createdAt}</span>
              </div>
            </div>
          </div>
          <button className="content-close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Content Body */}
        <div className="content-modal-body">
          <div className="content-text">
            {post.fullContent || post.preview}
          </div>
        </div>

        {/* Actions */}
        <div className="content-modal-actions">
          <button className="action-button copy-button" onClick={handleCopyContent}>
            <Copy size={16} />
            {t('copyContent')}
          </button>
          <button className="action-button download-button" onClick={handleDownload}>
            <Download size={16} />
            {t('download')}
          </button>
          <button className="action-button close-button" onClick={onClose}>
            {t('save')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentDetailModal;