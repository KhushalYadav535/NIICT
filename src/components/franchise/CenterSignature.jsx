import React, { useState } from 'react';
import { PenTool, UploadCloud, CheckCircle } from 'lucide-react';

const CenterSignature = () => {
  const [signature, setSignature] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSignature(URL.createObjectURL(file));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8">
        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
          <PenTool className="text-indigo-600" size={28} />
          Center Signature
        </h2>
        <p className="text-slate-500 mt-1">Upload an authorized signature with a transparent background for digital documents.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">Upload Guidelines</h3>
            <ul className="space-y-4 text-slate-600">
              <li className="flex gap-3">
                <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
                <span>Use a clear, dark ink (preferably blue or black) on a solid white paper before scanning.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
                <span>Remove the background (make it transparent) using tools like remove.bg.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
                <span>Upload a PNG file only, maximum size 2MB.</span>
              </li>
            </ul>

            <div className="mt-8 border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-indigo-500 hover:bg-indigo-50 transition-all cursor-pointer relative">
              <input 
                type="file" 
                accept="image/png" 
                onChange={handleFileChange} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <UploadCloud className="mx-auto text-indigo-400 mb-3" size={40} />
              <p className="font-bold text-slate-700">Click to upload signature</p>
              <p className="text-xs text-slate-500 mt-1">PNG files only</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">Current Signature</h3>
            <div className="border border-slate-200 bg-slate-50 rounded-2xl h-64 flex items-center justify-center relative overflow-hidden">
              {/* Checkerboard background to show transparency */}
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), repeating-linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px' }}></div>
              
              {signature ? (
                <img src={signature} alt="Center Signature" className="max-w-[80%] max-h-[80%] object-contain relative z-10" />
              ) : (
                <p className="text-slate-400 font-medium relative z-10">No signature uploaded yet.</p>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => alert('Signature saved securely! It will now appear on all generated certificates.')}
                className={`px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${signature ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                disabled={!signature}
              >
                Save Signature
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CenterSignature;
