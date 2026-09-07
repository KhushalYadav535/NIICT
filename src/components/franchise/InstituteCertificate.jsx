import React, { useState, useEffect } from 'react';
import { Award, Printer, Download } from 'lucide-react';

const InstituteCertificate = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('franchiseData');
    if (data) {
      setProfile(JSON.parse(data));
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (!profile) return null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 flex justify-between items-center print:hidden">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <Award className="text-indigo-600" size={28} />
            Institute Certificate
          </h2>
          <p className="text-slate-500 mt-1">View and print your center affiliation certificate.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handlePrint} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-indigo-200">
            <Printer size={18} /> Print Certificate
          </button>
        </div>
      </div>

      {/* Certificate Preview */}
      <div className="bg-slate-100 p-8 rounded-3xl border border-slate-200 flex justify-center print:p-0 print:bg-white print:border-none">
        
        {/* Actual Certificate */}
        <div className="bg-white w-[1122px] h-[793px] relative shadow-2xl overflow-hidden print:shadow-none border-[12px] border-indigo-900">
          
          {/* Background Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Award size={600} />
          </div>
          
          {/* Decorative Corners */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-900 border-r-4 border-b-4 border-yellow-500" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-900 border-l-4 border-b-4 border-yellow-500" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }}></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-900 border-r-4 border-t-4 border-yellow-500" style={{ clipPath: 'polygon(0 100%, 0 0, 100% 100%)' }}></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-900 border-l-4 border-t-4 border-yellow-500" style={{ clipPath: 'polygon(100% 100%, 0 100%, 100% 0)' }}></div>

          <div className="p-16 flex flex-col h-full text-center relative z-10">
            <h1 className="text-5xl font-black text-indigo-900 tracking-wider uppercase mb-2">
              Certificate of Affiliation
            </h1>
            <p className="text-xl text-slate-600 tracking-widest uppercase mb-12">Nihanshi Institute of Information & Computer Technology</p>
            
            <p className="text-lg text-slate-700 italic mb-6">This is to certify that</p>
            
            <h2 className="text-6xl font-extrabold text-slate-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              {profile.instituteName}
            </h2>
            
            <p className="text-lg text-slate-700 mb-4">run by</p>
            <h3 className="text-3xl font-bold text-slate-800 mb-8">{profile.ownerName}</h3>
            
            <p className="text-lg text-slate-700 max-w-2xl mx-auto leading-relaxed mb-12">
              is recognized as an Authorized Training Center (ATC) for conducting NIICT courses. 
              The center is located at <strong>{profile.instituteAddress}, {profile.district}, {profile.state}</strong>.
            </p>
            
            <div className="mt-auto flex justify-between items-end px-16">
              <div className="text-center">
                <div className="w-48 border-b-2 border-slate-400 mb-2"></div>
                <p className="font-bold text-slate-700 uppercase tracking-wider text-sm">Issue Date</p>
                <p className="text-slate-500">{new Date(profile.applicationDate || Date.now()).toLocaleDateString()}</p>
              </div>
              
              <div className="w-32 h-32 bg-yellow-500 rounded-full flex items-center justify-center border-4 border-indigo-900 shadow-xl relative -top-8">
                <div className="w-28 h-28 border-2 border-dashed border-indigo-900 rounded-full flex items-center justify-center text-center">
                  <span className="text-indigo-900 font-black text-xs uppercase tracking-widest rotate-[-15deg]">Valid<br/>Center</span>
                </div>
              </div>
              
              <div className="text-center">
                <div className="w-48 border-b-2 border-slate-400 mb-2 h-16 flex items-end justify-center">
                  {/* Signature Mock */}
                  <span className="font-['Brush_Script_MT',cursive] text-4xl text-blue-900">Director</span>
                </div>
                <p className="font-bold text-slate-700 uppercase tracking-wider text-sm">Managing Director</p>
                <p className="text-slate-500">NIICT HO</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          .print\\:hidden { display: none !important; }
          .bg-white.w-\\[1122px\\] {
            visibility: visible;
            position: absolute;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            border: none;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .bg-white.w-\\[1122px\\] * { visibility: visible; }
        }
      `}} />
    </div>
  );
};

export default InstituteCertificate;
