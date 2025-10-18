import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Mic, Square, Play, Pause, Plus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import BusinessInfoForm from './BusinessInfoForm';
import './RecordVoiceModal.css';
import axios from 'axios';

const RecordVoiceModal = ({ isOpen, onClose, businesses = [], onBusinessAdded }) => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [isBusinessFormOpen, setIsBusinessFormOpen] = useState(false);

  const [timer, setTimer] = useState(null);
  
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
    if (!recordedAudio) {
      alert(t('recordAudioFirst'));
      return;
    }
    
    console.log('Selected business ID:', data.businessId);
  
    const formData = new FormData();
    formData.append("audioFile", recordedAudio, "recording.webm");
    if (data.voiceDescription) formData.append("voiceDescription", data.voiceDescription);
  
    setIsLoading(true);
    try {
      const res = await axios.post("https://future-content-creator-2.onrender.com/api/prompts/voice", formData);
    
      const result = await res.json();
      console.log("Gemini result:", result);
      alert("Gemini response: " + result.message);
    } catch (err) {
      console.error(err);
      alert("Failed to send recording.");
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      // Ask for microphone permission
     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/webm' });
          const url = URL.createObjectURL(blob);
          setRecordedAudio(blob);
          setAudioURL(url);
          stream.getTracks().forEach(track => track.stop()); // Stop mic
          console.log('Recording stopped, audio saved');
        };

        recorder.start();
        setMediaRecorder(recorder);
        setIsRecording(true);
        setRecordingTime(0);

        // Timer
        const recordingInterval = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);

        // Auto-stop after 5 mins
        const autoStopTimeout = setTimeout(() => stopRecording(), 300000);

        setTimer({ interval: recordingInterval, timeout: autoStopTimeout });

        console.log('Recording started...');
      } catch (error) {
      console.error('Error accessing microphone:', error);
       alert('Microphone access denied or not available.');
     }
    };


  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }

    setIsRecording(false);

    if (timer) {
      if (timer.interval) clearInterval(timer.interval);
      if (timer.timeout) clearTimeout(timer.timeout);
      setTimer(null);
    }
  };


  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Cleanup timer when modal closes or component unmounts
  useEffect(() => {
    return () => {
      if (timer) {
        if (timer.interval) clearInterval(timer.interval);
        if (timer.timeout) clearTimeout(timer.timeout);
      }
    };
  }, [timer]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsRecording(false);
      setRecordedAudio(null);
      setRecordingTime(0);
      if (timer) {
        if (timer.interval) clearInterval(timer.interval);
        if (timer.timeout) clearTimeout(timer.timeout);
        setTimer(null);
      }
    }
  }, [isOpen, timer]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t('recordAudioContent')}</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="record-form">
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

          {/* Voice Recording */}
          <div className="form-group">
            <label>{t('voiceRecording')}</label>
            <div className="recording-container">
              <div className="recording-controls">
                {!isRecording && !recordedAudio && (
                  <button
                    type="button"
                    className="record-button start"
                    onClick={startRecording}
                  >
                    <Mic size={24} />
                    {t('startRecording')}
                  </button>
                )}
                
                {isRecording && (
                  <button
                    type="button"
                    className="record-button stop"
                    onClick={stopRecording}
                  >
                    <Square size={24} />
                    {t('stopRecording')}
                  </button>
                )}
                
                {recordedAudio && (
              <div className="recording-info">
                <div className="recording-status">
                  <Play size={20} />
                  <span>{t('recordingCompleted')} ({formatTime(recordingTime)})</span>
                </div>
                {audioURL && (
                  <audio controls src={audioURL} className="audio-preview" />
                )}
                <button
                  type="button"
                  className="re-record-button"
                  onClick={() => {
                    setRecordedAudio(null);
                    setAudioURL(null);
                    setRecordingTime(0);
                  }}
                >
                  {t('recordAgain')}
                </button>
              </div>
            )}
              </div>
              
              {isRecording && (
                <div className="recording-indicator">
                  <div className="recording-pulse"></div>
                  <span>{t('recordingIndicator')} {formatTime(recordingTime)}</span>
                </div>
              )}
            </div>
            {!recordedAudio && <span className="error-message">{t('recordAudioFirst')}</span>}
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
              disabled={isLoading || !recordedAudio}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  {t('loading')}
                </>
              ) : (
                t('uploadRecording')
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

export default RecordVoiceModal;
