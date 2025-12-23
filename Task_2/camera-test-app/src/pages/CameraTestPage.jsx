import React, { useEffect, useRef, useState } from 'react';
import Button from '../components/Button';

// Keys kept small and explicit so they are easy to reason about.
const STATUS_KEY = 'camera:lastStatus';
const ERROR_KEY = 'camera:lastError';
const VALID_STATUSES = ['idle', 'loading', 'active', 'stopped', 'error'];

const readStoredStatus = () => {
  try {
    const stored = localStorage.getItem(STATUS_KEY);
    // Never hydrate into active/loading because we only start on a fresh click.
    if (stored === 'active' || stored === 'loading') return 'idle';
    return VALID_STATUSES.includes(stored) ? stored : 'idle';
  } catch {
    return 'idle';
  }
};

const readStoredError = () => {
  try {
    return localStorage.getItem(ERROR_KEY) || '';
  } catch {
    return '';
  }
};

function CameraTestPage() {
  const [status, setStatus] = useState(() => readStoredStatus());
  const [errorMessage, setErrorMessage] = useState(() => readStoredError());
  const [resolution, setResolution] = useState(null);
  const [needsManualPlay, setNeedsManualPlay] = useState(false);
  const mediaStreamRef = useRef(null);
  const videoRef = useRef(null);

  const persistStatus = (nextStatus, nextError = '') => {
    try {
      localStorage.setItem(STATUS_KEY, nextStatus);
      if (nextStatus === 'error' && nextError) {
        localStorage.setItem(ERROR_KEY, nextError);
      } else {
        localStorage.removeItem(ERROR_KEY);
      }
    } catch {
      // If storage is blocked, we simply skip persisting.
    }
  };

  // Keep storage in sync with UI state.
  useEffect(() => {
    persistStatus(status, errorMessage);
  }, [status, errorMessage]);

  const stopTracks = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
      videoRef.current.onloadedmetadata = null;
    }
  };

  const startCamera = async () => {
    // Check browser support first
    if (!navigator.mediaDevices?.getUserMedia) {
      setErrorMessage('Camera access is not supported in this browser.');
      setStatus('error');
      return;
    }

    try {
      // Set loading state
      setStatus('loading');
      setErrorMessage('');
      setResolution(null);
      setNeedsManualPlay(false);
      stopTracks(); // Clean up any existing streams

      // Request camera access (prefer front camera)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'user' } },
      });

      // Store stream in ref
      mediaStreamRef.current = mediaStream;

      // We don't attach to video here because it might not be in the DOM yet (due to loading status)
      // Instead, we set status to active, which mounts the video, and a useEffect handles the attachment.
      setStatus('active');

    } catch (error) {
      console.error('Camera error:', error);
      stopTracks();

      // Determine user-friendly error message
      const friendlyMessage =
        error?.name === 'NotAllowedError'
          ? 'Camera permission denied. Please allow access and try again.'
          : error?.name === 'NotFoundError'
            ? 'No camera found on this device.'
            : 'Failed to start the camera. Please check your device and retry.';

      setErrorMessage(friendlyMessage);
      setStatus('error');
    }
  };

  const stopCamera = () => {
    // Stop all media tracks and clean up
    stopTracks();
    setStatus('stopped');
    setResolution(null);
    setNeedsManualPlay(false);
  };

  const retry = () => {
    // Reset to initial state
    stopTracks();
    setStatus('idle');
    setErrorMessage('');
    setResolution(null);
    setNeedsManualPlay(false);
  };

  // Always clean up camera access if the user leaves the page.
  useEffect(() => () => stopTracks(), []);

  // Effect to attach stream to video when status becomes active
  useEffect(() => {
    if (status === 'active' && videoRef.current && mediaStreamRef.current) {
      const videoEl = videoRef.current;
      videoEl.srcObject = mediaStreamRef.current;
      videoEl.muted = true;
      videoEl.playsInline = true;

      const playPromise = videoEl.play();
      if (playPromise?.catch) {
        playPromise.catch((err) => {
          console.error('Video play error:', err);
          setNeedsManualPlay(true);
          setErrorMessage('Click "Resume Preview" to start the camera view if it stays black.');
        });
      }

      videoEl.onloadedmetadata = () => {
        setResolution({ width: videoEl.videoWidth, height: videoEl.videoHeight });
      };
    }
  }, [status]);

  const handleResumePreview = async () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    try {
      await videoEl.play();
      setNeedsManualPlay(false);
      setResolution({ width: videoEl.videoWidth, height: videoEl.videoHeight });
      setStatus('active');
      setErrorMessage('');
    } catch (err) {
      console.error('Resume play error:', err);
      setErrorMessage('Preview is still blocked. Please click Start again or allow autoplay.');
    }
  };

  const renderStatusBlock = () => {
    if (status === 'loading') {
      return (
        <div className="space-y-3 text-center">
          <div className="flex items-center justify-center">
            <span className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" aria-hidden="true" />
          </div>
          <p className="text-slate-700">Requesting camera permission...</p>
        </div>
      );
    }

    if (status === 'active') {
      return (
        <div className="space-y-4">
          <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-green-800 text-sm font-medium">
            Camera is working ✅
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Live camera preview active</span>
              {resolution && (
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                  {resolution.width} x {resolution.height}
                </span>
              )}
            </div>

            <div className="rounded-lg border bg-slate-900 overflow-hidden shadow-inner">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full aspect-video object-cover"
              />
            </div>
            {needsManualPlay && (
              <div className="flex items-center gap-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-3">
                <span>If the preview is black, your browser blocked autoplay.</span>
                <Button onClick={handleResumePreview} variant="secondary">
                  Resume Preview
                </Button>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button onClick={stopCamera} variant="secondary">
              Stop Camera
            </Button>
            <Button onClick={retry}>Retry</Button>
          </div>
        </div>
      );
    }

    if (status === 'stopped') {
      return (
        <div className="space-y-3 text-center">
          <p className="text-slate-700 font-medium">Camera stopped</p>
          <p className="text-sm text-slate-500">Tracks were released. You can start again anytime.</p>
          <div className="flex justify-center">
            <Button onClick={startCamera}>Start Again</Button>
          </div>
        </div>
      );
    }

    if (status === 'error') {
      return (
        <div className="space-y-3">
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-800 text-sm">
            {errorMessage || 'Something went wrong while accessing the camera.'}
          </div>
          <div className="flex gap-3">
            <Button onClick={startCamera}>Try Again</Button>
            <Button onClick={retry} variant="secondary">
              Reset
            </Button>
          </div>
        </div>
      );
    }

    // Idle state
    return (
      <div className="space-y-4">
        <p className="text-slate-700">
          Ready to test your camera. We will request permission when you start.
        </p>
        <Button onClick={startCamera} isLoading={status === 'loading'}>
          Start Camera Test
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-slate-50">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl shadow p-6 space-y-4 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold">Camera Test</h1>
              <p className="text-sm text-slate-600">
                Checks permission, shows live preview, and lets you stop or retry.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-700">
              Status: {status}
            </span>
          </div>

          {renderStatusBlock()}
        </div>

        <div className="text-xs text-slate-500 text-center">
          Last status is saved locally (no video or permissions are stored).
        </div>
      </div>
    </div>
  );
}

export default CameraTestPage;
