import { useEffect, useRef, useState } from 'react';
import { Camera, Video, Square, Download } from 'lucide-react';

const ARViewer = ({ modelSrc, poster }) => {
  const viewerRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    import('@google/model-viewer');
  }, []);

  const takeScreenshot = async () => {
    if (!viewerRef.current) return;
    try {
      const blob = await viewerRef.current.toBlob({ idealAspect: true });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `4seasons-snapshot-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Snapshot failed:', err);
    }
  };

  const startRecording = () => {
    if (!viewerRef.current) return;
    const canvas = viewerRef.current.shadowRoot?.querySelector('canvas');
    if (!canvas) {
      console.error('Could not find canvas in shadowRoot');
      return;
    }

    const stream = canvas.captureStream(30); // 30 FPS
    const mimeType = MediaRecorder.isTypeSupported('video/webm; codecs=vp9') 
      ? 'video/webm; codecs=vp9' 
      : 'video/webm';

    const recorder = new MediaRecorder(stream, { mimeType });
    mediaRecorderRef.current = recorder;
    chunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `4seasons-recording-${Date.now()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
    };

    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const btnStyle = {
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    backdropFilter: 'blur(4px)',
    transition: 'all 0.2s ease',
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <model-viewer
        ref={viewerRef}
        src={modelSrc}
        poster={poster}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate
        shadow-intensity="1"
        style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
        alt="A 3D model of the seasonal outfit"
      >
        <div slot="ar-button" style={{ display: 'none' }}>
           {/* Hiding default button to use custom overlay */}
        </div>
      </model-viewer>

      {/* Control Overlay */}
      <div style={{
        position: 'absolute',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '20px',
        zIndex: 100,
        pointerEvents: 'auto'
      }}>
        {/* Snapshot Button */}
        <button 
          onClick={takeScreenshot} 
          style={btnStyle}
          title="Take Snapshot"
        >
          <Camera size={24} />
        </button>

        {/* Recording Button */}
        {!isRecording ? (
          <button 
            onClick={startRecording} 
            style={{...btnStyle, backgroundColor: 'rgba(255, 59, 48, 0.8)'}}
            title="Start Recording"
          >
            <Video size={24} />
          </button>
        ) : (
          <button 
            onClick={stopRecording} 
            style={{...btnStyle, backgroundColor: 'rgba(255, 59, 48, 1)'}}
            title="Stop Recording"
          >
            <Square size={20} fill="white" />
          </button>
        )}
      </div>
      
      {/* Recording Indicator */}
      {isRecording && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(255, 0, 0, 0.8)',
          color: 'white',
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'white', animation: 'pulse 1s infinite' }} />
          REC
        </div>
      )}
      
      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ARViewer;
