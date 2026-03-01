import React, { useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Download, QrCode as QrCodeIcon } from 'lucide-react';

const QRCodeModal = ({ isOpen, onClose, sessionId, course, facultyName }) => {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Generate feedback URL
  const feedbackUrl = `${window.location.origin}/feedback/${sessionId}`;

  // Download QR code as PNG
  const downloadQRCode = () => {
    const svg = document.getElementById('qr-code-svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      
      const downloadLink = document.createElement('a');
      downloadLink.download = `QR-${sessionId}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <QrCodeIcon className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Feedback QR Code</h2>
                <p className="text-sm text-blue-100">Session Active</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors"
            >
              <X className="text-white" size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto flex-1">
          {/* Course Info */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Course</p>
            <p className="font-semibold text-gray-900 text-lg">{course}</p>
            <p className="text-sm text-gray-600 mt-1">{facultyName}</p>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center mb-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg border-4 border-gray-100">
              <QRCodeSVG
                id="qr-code-svg"
                value={feedbackUrl}
                size={220}
                level="H"
                includeMargin={true}
                bgColor="#ffffff"
                fgColor="#1f2937"
              />
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center max-w-xs">
              Students can scan this QR code to provide anonymous feedback for this session
            </p>
          </div>

          {/* Session ID */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-xs text-gray-500 mb-1">Session ID</p>
            <p className="font-mono text-sm text-gray-900 font-medium">{sessionId}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={downloadQRCode}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Download size={18} />
              Download QR
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4">
            <p className="text-xs font-semibold text-blue-900 mb-2">📱 How to use:</p>
            <ol className="text-xs text-blue-800 space-y-1 pl-4 list-decimal">
              <li>Display this QR code to your students</li>
              <li>Students scan with their phone camera</li>
              <li>They submit anonymous feedback</li>
              <li>View results in your report dashboard</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;
