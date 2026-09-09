/**
 * Government Exam E-Admit Card & Official Application Form Generator
 * Conforms to authentic Indian Government Examination Authority Standards (NTA / SSC / UPSC).
 * 
 * 1. E-Admit Card (ई-प्रवेश पत्र):
 *    - Exam entry hall ticket only (NO payment/transaction details).
 *    - Roll No, Candidate details, Photo, Invigilator signature & Left Thumb Impression,
 *      Exam timings, strict gate closing time, center address, exam rules & controller stamp.
 * 
 * 2. Application Form & Fee Confirmation Receipt (आवेदन पत्र एवं शुल्क रसीद):
 *    - Complete registration confirmation.
 *    - All candidate personal info, address, contact, school/qualification,
 *      full payment transaction breakdown (Txn ID, Order ID, Gateway, Amount, Status, Timestamp),
 *      and Candidate/Parent Declaration with signature spaces.
 */

import { 
  NIICT_LOGO_DATA_URI, 
  NIICT_SEAL_DATA_URI, 
  NIICT_AUTH_SIGNATURE_DATA_URI 
} from './logoBase64';

// Generate SVG Barcode (Code 128 style visual representation)
const generateBarcodeSvg = (code = 'NIICT2026') => {
  const chars = String(code).toUpperCase().split('');
  let bars = '';
  let x = 10;
  
  // Guard bars
  bars += `<rect x="${x}" y="0" width="2" height="36" fill="#000"/>`;
  x += 3;
  bars += `<rect x="${x}" y="0" width="1" height="36" fill="#000"/>`;
  x += 3;

  chars.forEach((c) => {
    const codeVal = c.charCodeAt(0);
    const w1 = (codeVal % 3) + 1;
    const w2 = ((codeVal >> 1) % 3) + 1;
    const gap = ((codeVal >> 2) % 2) + 2;
    bars += `<rect x="${x}" y="0" width="${w1}" height="32" fill="#000"/>`;
    x += w1 + gap;
    bars += `<rect x="${x}" y="0" width="${w2}" height="32" fill="#000"/>`;
    x += w2 + 2;
  });

  // End guard
  bars += `<rect x="${x}" y="0" width="2" height="36" fill="#000"/>`;
  x += 3;
  bars += `<rect x="${x}" y="0" width="1" height="36" fill="#000"/>`;
  x += 10;

  return `<svg width="${x}" height="42" viewBox="0 0 ${x} 42" xmlns="http://www.w3.org/2000/svg">
    ${bars}
    <text x="${x / 2}" y="41" text-anchor="middle" font-family="'Courier New', monospace" font-size="9" font-weight="bold" fill="#000">* ${code} *</text>
  </svg>`;
};

// Generate QR Code Image
const generateQrImg = (payload = '') => {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(payload)}&margin=1`;
  return `<img src="${qrUrl}" alt="Verification QR" style="width: 100%; height: 100%; object-fit: contain;" />`;
};

// Timezone-safe DOB formatter (avoids UTC offset day/month shifting)
export const formatAdmitCardDob = (dateVal) => {
  if (!dateVal) return 'DD/MM/YYYY';
  if (typeof dateVal === 'string') {
    const match = dateVal.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const [, y, m, d] = match;
      return `${d}/${m}/${y}`;
    }
  }
  const dt = new Date(dateVal);
  if (isNaN(dt.getTime())) return 'DD/MM/YYYY';
  const d = String(dt.getUTCDate()).padStart(2, '0');
  const m = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const y = dt.getUTCFullYear();
  return `${d}/${m}/${y}`;
};

/* ═════════════════════════════════════════════════════════════════
   1. GOVERNMENT E-ADMIT CARD (HALL TICKET ONLY - NO PAYMENT DATA)
   ═════════════════════════════════════════════════════════════════ */
export const generateAdmitCardHtml = (application = {}) => {
  const rollNumber = application.rollNumber || 'NIICT2026XXXX';
  const name = (application.name || 'CANDIDATE NAME').toUpperCase();
  const fatherName = (application.fatherName || application.fathersName || 'FATHER NAME').toUpperCase();
  const motherName = (application.motherName || application.mothersName || 'MOTHER NAME').toUpperCase();
  const dobFormatted = formatAdmitCardDob(application.dateOfBirth);
  const school = (application.school || 'NIICT AFFILIATED ACADEMY').toUpperCase();
  const classPassed = application.classPassed || application.class || 'Intermediate (12th)';
  const aadhaar = application.aadhaar 
    ? application.aadhaar.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3')
    : 'XXXX-XXXX-7890 (VERIFIED)';
  const phone = application.phone || 'XXXXXXXXXX';
  const subject = application.subject ? `${application.subject.toUpperCase()} COMPETITION` : 'GENERAL KNOWLEDGE & COMPUTER LITERACY';
  
  const examTiming = (application.examTiming && application.examTiming.includes('11:30'))
    ? application.examTiming
    : (application.examTime && application.examTime.includes('11:30'))
      ? application.examTime
      : '10:00 AM – 11:30 AM (90 Min)';
  const examDate = application.examDate || '18 October 2026 (Sunday)';
  
  const qrPayload = JSON.stringify({
    document: 'E_ADMIT_CARD',
    authority: 'NIICT_EXAMINATION_AUTHORITY',
    roll: rollNumber,
    name: name,
    dob: dobFormatted,
    center: 'SKMIC-222201',
    session: '2026-2027',
    status: 'VALID_FOR_ENTRY'
  });

  const barcodeSvg = generateBarcodeSvg(rollNumber);
  const qrCodeImg = generateQrImg(qrPayload);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>E-ADMIT CARD - ${rollNumber} - ${name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800&family=Noto+Sans:wght@400;500;600;700;800&display=swap');

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }

    body {
      background-color: #525659;
      font-family: 'Noto Sans', 'Segoe UI', Arial, sans-serif;
      color: #0f172a;
      display: flex;
      justify-content: center;
      padding: 20px 10px;
    }

    .sheet {
      width: 210mm;
      min-height: 297mm;
      height: 297mm;
      background: #FFFFFF;
      padding: 6mm 8mm;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .border-container {
      border: 3px double #0f2744;
      outline: 1px solid #b45309;
      outline-offset: -5px;
      padding: 8px 10px 6px 10px;
      position: relative;
      background: #FFFFFF;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-32deg);
      font-size: 46px;
      font-weight: 800;
      color: rgba(15, 39, 68, 0.035);
      text-transform: uppercase;
      letter-spacing: 4px;
      pointer-events: none;
      z-index: 1;
      text-align: center;
      line-height: 1.4;
      width: 130%;
      user-select: none;
    }

    .content-layer {
      position: relative;
      z-index: 2;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .header-table {
      width: 100%;
      border-collapse: collapse;
      border-bottom: 2px solid #0f2744;
      padding-bottom: 6px;
      margin-bottom: 6px;
    }

    .logo-cell {
      width: 80px;
      text-align: center;
      vertical-align: middle;
    }

    .logo-cell img {
      width: 76px;
      height: 76px;
      object-fit: contain;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      padding: 2px;
      display: block;
      margin: 0 auto;
    }

    .title-cell {
      text-align: center;
      padding: 0 10px;
      vertical-align: middle;
    }

    .hindi-title {
      font-size: 13px;
      font-weight: 800;
      color: #92400e;
      letter-spacing: 0.5px;
      margin-bottom: 1px;
    }

    .institute-title {
      font-family: 'Cinzel', Georgia, serif;
      font-size: 18px;
      font-weight: 800;
      color: #0f2744;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      line-height: 1.15;
    }

    .institute-tagline {
      font-size: 8.5px;
      font-weight: 600;
      color: #475569;
      letter-spacing: 0.3px;
      margin-top: 2px;
      text-transform: uppercase;
    }

    .exam-title-badge {
      display: inline-block;
      margin-top: 4px;
      font-size: 10.5px;
      font-weight: 800;
      color: #1e3a8a;
      letter-spacing: 0.6px;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      padding: 2px 10px;
      border-radius: 4px;
      text-transform: uppercase;
    }

    .qr-header-cell {
      width: 80px;
      text-align: center;
      vertical-align: middle;
    }

    .header-qr-box {
      width: 74px;
      height: 74px;
      border: 1px solid #cbd5e1;
      padding: 2px;
      background: #fff;
      display: inline-block;
    }

    .ribbon-banner {
      background: #0f2744;
      color: #FFFFFF;
      text-align: center;
      padding: 4px 12px;
      margin: 6px 0;
      border-top: 2px solid #b45309;
      border-bottom: 2px solid #b45309;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .ribbon-banner h2 {
      font-size: 12.5px;
      font-weight: 800;
      letter-spacing: 1.2px;
      text-transform: uppercase;
    }

    .ribbon-badge {
      background: #b45309;
      color: #FFFFFF;
      font-size: 8.5px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 3px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    .tracking-strip {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2px 8px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      margin-bottom: 6px;
      font-size: 9px;
      font-weight: 600;
      color: #475569;
    }

    .section-header {
      background: #0f2744;
      color: #FFFFFF;
      font-size: 10px;
      font-weight: 800;
      padding: 3px 8px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      border-left: 4px solid #b45309;
      margin: 6px 0 4px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .profile-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 6px;
    }

    .profile-table td, .profile-table th {
      border: 1px solid #94a3b8;
      padding: 5.5px 8px;
      font-size: 10.5px;
      vertical-align: middle;
    }

    .field-label {
      background: #f1f5f9;
      font-weight: 700;
      color: #1e293b;
      width: 18%;
      text-transform: uppercase;
      font-size: 9.5px;
    }

    .field-val {
      font-weight: 600;
      color: #0f172a;
      width: 32%;
    }

    .field-val-highlight {
      font-weight: 800;
      color: #0f2744;
      font-size: 11px;
      letter-spacing: 0.5px;
    }

    .photo-cell {
      width: 130px;
      text-align: center;
      vertical-align: top;
      padding: 4px !important;
      background: #fafafa;
    }

    .photo-frame {
      width: 115px;
      height: 145px;
      border: 1.5px solid #0f2744;
      margin: 0 auto;
      background: #f8fafc;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .photo-frame img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .photo-caption {
      font-size: 8px;
      font-weight: 700;
      color: #475569;
      margin-top: 2px;
      text-transform: uppercase;
    }

    .signature-frame {
      width: 115px;
      height: 42px;
      border: 1px dashed #475569;
      margin: 4px auto 0;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 8px;
      color: #94a3b8;
      text-transform: uppercase;
      font-weight: 600;
    }

    .exam-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 6px;
    }

    .exam-table td, .exam-table th {
      border: 1px solid #94a3b8;
      padding: 4.5px 7px;
      font-size: 9.5px;
    }

    .exam-label-cell {
      background: #eff6ff;
      font-weight: 700;
      color: #1e3a8a;
      width: 25%;
      text-transform: uppercase;
      font-size: 9px;
    }

    .exam-val-cell {
      font-weight: 700;
      color: #0f172a;
      width: 25%;
    }

    .center-val-cell {
      font-weight: 600;
      color: #0f172a;
      font-size: 9.5px;
      line-height: 1.35;
    }

    .instructions-box {
      border: 1px solid #cbd5e1;
      background: #fdfefe;
      padding: 9px 12px;
      margin-bottom: 8px;
    }

    .instructions-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 7px 18px;
    }

    .instruction-item {
      font-size: 9.2px;
      color: #1e293b;
      line-height: 1.45;
      display: flex;
      align-items: flex-start;
      gap: 5px;
    }

    .instruction-num {
      font-weight: 800;
      color: #0f2744;
      min-width: 14px;
    }

    .sign-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 6px;
    }

    .sign-table td {
      border: 1px solid #94a3b8;
      width: 33.33%;
      padding: 4px 4px 3px 4px;
      text-align: center;
      vertical-align: bottom;
      height: 72px;
      background: #fff;
    }

    .sign-area {
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .sign-title {
      border-top: 1px solid #64748b;
      padding-top: 3px;
      font-size: 8.5px;
      font-weight: 700;
      color: #0f2744;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .sign-subtitle {
      font-size: 7.2px;
      color: #64748b;
      font-weight: 500;
      display: block;
    }

    .official-seal-badge {
      border: 1.5px dashed #b45309;
      color: #b45309;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 7px;
      font-weight: 800;
      text-transform: uppercase;
      transform: rotate(-10deg);
      line-height: 1;
      margin-bottom: -15px;
    }

    .footer-note {
      text-align: center;
      font-size: 7.5px;
      color: #64748b;
      margin-top: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
    }

    @media print {
      @page {
        size: A4 portrait;
        margin: 5mm 6mm;
      }
      body {
        background: #FFFFFF !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      .sheet {
        width: 100% !important;
        height: 286mm !important;
        min-height: 286mm !important;
        max-height: 286mm !important;
        padding: 0 !important;
        box-shadow: none !important;
        display: flex !important;
        flex-direction: column !important;
      }
      .border-container {
        border: 2.5px solid #0f2744 !important;
        outline: 1px solid #b45309 !important;
        outline-offset: -4px !important;
        flex: 1 !important;
        height: 100% !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: space-between !important;
        padding: 8px 10px 6px 10px !important;
      }
      .content-layer {
        flex: 1 !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: space-between !important;
      }
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="border-container">
      
      <div class="watermark">
        NIICT TALENT SEARCH & GK COMPETITION<br>
        OFFICIAL ADMIT CARD
      </div>

      <div class="content-layer">

        <!-- 1. OFFICIAL NATIONAL HEADER -->
        <table class="header-table">
          <tr>
            <td class="logo-cell">
              <img src="${NIICT_LOGO_DATA_URI}" alt="NIICT Logo" onerror="this.src='/logo.jpg'" />
            </td>
            <td class="title-cell">
              <div class="hindi-title">NIICT सूचना प्रौद्योगिकी एवं कम्प्यूटर प्रबंधन संस्थान</div>
              <div class="institute-title">NIICT Institute of Information & Computer Technology</div>
              <div class="institute-tagline">Autonomous Examination & Skill Certification Authority &bull; Regd. Govt. of India &bull; ISO 9001:2015 &bull; Official Website: www.niict.in</div>
              <div class="exam-title-badge">
                All India Talent Search & GK Computer Scholarship Exam — 2026-27
              </div>
            </td>
            <td class="qr-header-cell">
              <div class="header-qr-box">
                ${qrCodeImg}
              </div>
            </td>
          </tr>
        </table>

        <!-- 2. PROVISIONAL HALL TICKET RIBBON -->
        <div class="ribbon-banner">
          <span>Session: 2026-2027</span>
          <h2>E-ADMIT CARD / ई-प्रवेश पत्र (PROVISIONAL HALL TICKET)</h2>
          <span class="ribbon-badge">AUTHENTICATED</span>
        </div>

        <!-- 3. BARCODE STRIP & VERIFICATION TRACKING -->
        <div class="tracking-strip">
          <div>
            ${barcodeSvg}
          </div>
          <div style="text-align: right;">
            <div><strong>Security Token:</strong> ${rollNumber}-SEC-${Math.abs(rollNumber.hashCode ? rollNumber.hashCode() : 987654 % 100000)}</div>
            <div><strong>Application Ref:</strong> APP-2026-${rollNumber.replace(/\D/g, '') || '0129'}</div>
          </div>
        </div>

        <!-- 4. CANDIDATE PROFILE GRID -->
        <div class="section-header">
          <span>Candidate Information & Identification / अभ्यर्थी का विवरण</span>
          <span style="font-size: 8px;">Document Verification Stage-1</span>
        </div>

        <table class="profile-table">
          <tr>
            <td class="field-label">Roll Number (अनुक्रमांक):</td>
            <td class="field-val field-val-highlight" style="font-size: 13px; color: #1e3a8a;">${rollNumber}</td>
            <td class="field-label">Aadhaar / ID Proof:</td>
            <td class="field-val">${aadhaar}</td>
            <td rowspan="6" class="photo-cell">
              <div class="photo-frame">
                ${application.image 
                  ? `<img src="${application.image}" alt="Candidate Photo" onerror="this.parentElement.innerHTML='<span style=\\'font-size:9px;font-weight:700;color:#94a3b8;text-align:center;padding:10px;\\'>AFFIX RECENT PASSPORT PHOTO</span>'" />`
                  : `<span style="font-size: 9px; font-weight: 700; color: #64748b; text-align: center; padding: 10px;">AFFIX COLOR PASSPORT PHOTO</span>`
                }
              </div>
              <div class="photo-caption">Candidate Photograph</div>
              <div class="signature-frame">
                Candidate Signature
              </div>
            </td>
          </tr>
          <tr>
            <td class="field-label">Candidate Name:</td>
            <td class="field-val field-val-highlight">${name}</td>
            <td class="field-label">Date of Birth (जन्म तिथि):</td>
            <td class="field-val">${dobFormatted}</td>
          </tr>
          <tr>
            <td class="field-label">Father's Name (पिता):</td>
            <td class="field-val">${fatherName}</td>
            <td class="field-label">Mother's Name (माता):</td>
            <td class="field-val">${motherName}</td>
          </tr>
          <tr>
            <td class="field-label">Class / Standard:</td>
            <td class="field-val">${classPassed}</td>
            <td class="field-label">Contact / Mobile:</td>
            <td class="field-val">${phone}</td>
          </tr>
          <tr>
            <td class="field-label">School / Institution:</td>
            <td class="field-val" colspan="3">${school}</td>
          </tr>
          <tr>
            <td class="field-label">Subject / Stream:</td>
            <td class="field-val field-val-highlight" colspan="3" style="color: #b45309;">
              ${subject}
            </td>
          </tr>
        </table>

        <!-- 5. EXAMINATION SCHEDULE & VENUE DETAILS -->
        <div class="section-header">
          <span>Examination Schedule & Test Venue / परीक्षा कार्यक्रम एवं केंद्र</span>
          <span style="font-size: 8px;">Centre Code: SKMIC-222201</span>
        </div>

        <table class="exam-table">
          <tr>
            <td class="exam-label-cell">Date of Examination:</td>
            <td class="exam-val-cell" style="color: #b45309; font-size: 11px;">${examDate}</td>
            <td class="exam-label-cell">Examination Timings:</td>
            <td class="exam-val-cell" style="color: #0f2744; font-size: 10.5px;">${examTiming}</td>
          </tr>
          <tr>
            <td class="exam-label-cell">Reporting Time at Center:</td>
            <td class="exam-val-cell" style="color: #166534;">08:00 AM (Sharp)</td>
            <td class="exam-label-cell">Gate Closing Time:</td>
            <td class="exam-val-cell" style="color: #dc2626;">09:15 AM (Strictly No Entry)</td>
          </tr>
          <tr>
            <td class="exam-label-cell">Exam Centre Name & Full Address:</td>
            <td class="center-val-cell" colspan="3">
              <strong style="color: #0f2744; font-size: 10px;">S.K. Modern Intermediate College</strong><br>
              Semari, Janghai, District Jaunpur, Uttar Pradesh – 222201 (Landmark: Near Semari Crossing, Janghai Junction)<br>
              <span style="color: #475569; font-size: 8.5px;">Official Website: www.niict.in &bull; Contact Helpline: +91 81828 38680, +91 84234 15436 &bull; Email: niict01@gmail.com</span>
            </td>
          </tr>
        </table>

        <!-- 6. INSTRUCTIONS TO CANDIDATE (BILINGUAL / 2-COLUMN) -->
        <div class="section-header">
          <span>Important Instructions for the Candidate / अभ्यर्थी हेतु आवश्यक दिशा-निर्देश</span>
          <span style="font-size: 8px;">Strict Compliance Mandatory</span>
        </div>

        <div class="instructions-box">
          <div class="instructions-grid">
            <div class="instruction-item">
              <span class="instruction-num">1.</span>
              <span><strong>प्रवेश पत्र एवं पहचान पत्र:</strong> परीक्षार्थी को इस मूल प्रवेश पत्र (E-Admit Card) के साथ एक मूल सरकारी फोटो पहचान पत्र (आधार कार्ड/स्कूल पहचान पत्र) लाना अनिवार्य है।</span>
            </div>
            <div class="instruction-item">
              <span class="instruction-num">2.</span>
              <span><strong>गेट बंद होने का समय:</strong> परीक्षा केंद्र पर रिपोर्टिंग समय <strong>08:00 AM</strong> है। गेट <strong>09:15 AM</strong> पर पूर्णतः बंद कर दिया जाएगा, जिसके उपरांत किसी भी दशा में प्रवेश नहीं मिलेगा।</span>
            </div>
            <div class="instruction-item">
              <span class="instruction-num">3.</span>
              <span><strong>अनुमत सामग्री:</strong> केवल नीला या काला पारदर्शी बॉल प्वाइंट पेन (Ballpoint Pen), पारदर्शी पानी की बोतल एवं मूल पहचान पत्र ही परीक्षा कक्ष में ले जाने की अनुमति है।</span>
            </div>
            <div class="instruction-item">
              <span class="instruction-num">4.</span>
              <span><strong>प्रतिबंधित वस्तुएँ:</strong> मोबाइल फोन, डिजिटल/स्मार्ट वॉच, कैलकुलेटर, ब्लूटूथ डिवाइस, बैग या कोई भी इलेक्ट्रॉनिक गैजेट परीक्षा परिसर में पूर्णतः वर्जित हैं। केंद्र पर सामान रखने की व्यवस्था नहीं है।</span>
            </div>
            <div class="instruction-item">
              <span class="instruction-num">5.</span>
              <span><strong>ओएमआर शीट निर्देश:</strong> OMR उत्तर पत्रक पर सही गोलों को सावधानीपूर्वक भरें। OMR पत्रक पर कोई भी रफ कार्य, कटिंग या व्हाइटनर का प्रयोग अमान्य माना जाएगा।</span>
            </div>
            <div class="instruction-item">
              <span class="instruction-num">6.</span>
              <span><strong>हस्ताक्षर एवं उपस्थिति:</strong> परीक्षार्थी कक्ष निरीक्षक (Invigilator) के समक्ष ही उपस्थिति पत्रक तथा प्रवेश पत्र पर अपने हस्ताक्षर अंकित करें।</span>
            </div>
            <div class="instruction-item">
              <span class="instruction-num">7.</span>
              <span><strong>अनुचित साधन (UFM):</strong> परीक्षा में नकल या किसी भी प्रकार के अनुचित व्यवहार में लिप्त पाए जाने पर अभ्यर्थन तत्काल निरस्त कर विधिक कार्यवाही की जाएगी।</span>
            </div>
            <div class="instruction-item">
              <span class="instruction-num">8.</span>
              <span><strong>परीक्षा परिणाम घोषणा:</strong> प्रतियोगिता का परिणाम <strong>25 अक्टूबर 2026</strong> को आधिकारिक वेबसाइट एवं <strong>NIICT Computer Classes</strong> यू-ट्यूब चैनल पर घोषित होगा।</span>
            </div>
          </div>
        </div>

        <!-- 7. TRIPLE-TIER VERIFICATION SIGNATURE BLOCK -->
        <table class="sign-table">
          <tr>
            <td>
              <div class="sign-area"></div>
              <div class="sign-title">Candidate's Signature</div>
              <span class="sign-subtitle">(To be signed in presence of Invigilator)</span>
            </td>
            <td>
              <div class="sign-area" style="position: relative;">
                <img src="${NIICT_SEAL_DATA_URI}" alt="Centre Seal" style="max-height: 42px; max-width: 65px; object-fit: contain; opacity: 0.92; transform: rotate(-4deg);" />
              </div>
              <div class="sign-title">Invigilator's Signature & Center Stamp</div>
              <span class="sign-subtitle">(Verified Candidate Photo & Biometric)</span>
            </td>
            <td>
              <div class="sign-area" style="position: relative;">
                <img src="${NIICT_AUTH_SIGNATURE_DATA_URI}" alt="Controller Signature" style="max-height: 38px; max-width: 95px; object-fit: contain; transform: rotate(-2deg);" />
              </div>
              <div class="sign-title">Controller of Examinations</div>
              <span class="sign-subtitle">NIICT Central Examination Authority</span>
            </td>
          </tr>
        </table>

        <!-- FOOTER BAR -->
        <div class="footer-note">
          This is a computer generated official provisional E-Admit Card. Valid for All India Talent Search Exam 2026 entry only. &bull; Page 1 of 1
        </div>

      </div>
    </div>
  </div>
</body>
</html>`;
};


/* ═════════════════════════════════════════════════════════════════════════
   2. APPLICATION FORM & PAYMENT CONFIRMATION RECEIPT (FULL PAYMENT DATA)
   ═════════════════════════════════════════════════════════════════════════ */
export const generateApplicationFormHtml = (application = {}) => {
  const rollNumber = application.rollNumber || 'NIICT2026XXXX';
  const name = (application.name || 'CANDIDATE NAME').toUpperCase();
  const fatherName = (application.fatherName || application.fathersName || 'FATHER NAME').toUpperCase();
  const motherName = (application.motherName || application.mothersName || 'MOTHER NAME').toUpperCase();
  const dobFormatted = formatAdmitCardDob(application.dateOfBirth);
  const school = (application.school || 'NIICT AFFILIATED ACADEMY').toUpperCase();
  const classPassed = application.classPassed || application.class || 'Intermediate (12th)';
  const aadhaar = application.aadhaar 
    ? application.aadhaar.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3')
    : 'XXXX-XXXX-7890 (VERIFIED)';
  const phone = application.phone || 'XXXXXXXXXX';
  const parentPhone = application.parentPhone || 'Not Provided';
  const address = application.address || 'District Jaunpur, Uttar Pradesh';
  const subject = application.subject ? `${application.subject.toUpperCase()} COMPETITION` : 'GENERAL KNOWLEDGE & COMPUTER LITERACY';
  
  // Payment Details
  const isPaid = application.paymentStatus === 'paid' || application.paymentStatus === 'verified';
  const paymentStatus = isPaid ? 'SUCCESS (PAID & VERIFIED)' : application.paymentStatus ? application.paymentStatus.toUpperCase() : 'PENDING';
  const amountPaid = application.paymentAmount || 150;
  const txnId = application.paymentTransactionId || 'N/A';
  const orderId = application.paymentOrderId || `ORD_${rollNumber}`;
  const paymentDate = application.paidAt 
    ? new Date(application.paidAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : application.createdAt ? new Date(application.createdAt).toLocaleString('en-IN') : 'N/A';
  const appDate = application.createdAt ? new Date(application.createdAt).toLocaleDateString('en-GB') : '10/10/2026';

  const barcodeSvg = generateBarcodeSvg(`APP-${rollNumber.replace(/\D/g, '') || '202601'}`);
  
  const qrPayload = JSON.stringify({
    document: 'APPLICATION_CONFIRMATION_SLIP',
    roll: rollNumber,
    name: name,
    fee: amountPaid,
    status: paymentStatus,
    txnId: txnId,
    timestamp: paymentDate
  });
  const qrCodeImg = generateQrImg(qrPayload);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Confirmation & Fee Receipt - ${rollNumber} - ${name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800&family=Noto+Sans:wght@400;500;600;700;800&display=swap');

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }

    body {
      background-color: #525659;
      font-family: 'Noto Sans', 'Segoe UI', Arial, sans-serif;
      color: #0f172a;
      display: flex;
      justify-content: center;
      padding: 20px 10px;
    }

    .sheet {
      width: 210mm;
      min-height: 297mm;
      height: 297mm;
      background: #FFFFFF;
      padding: 6mm 8mm;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .border-container {
      border: 3px double #065f46;
      outline: 1px solid #059669;
      outline-offset: -5px;
      padding: 8px 10px 6px 10px;
      position: relative;
      background: #FFFFFF;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-32deg);
      font-size: 42px;
      font-weight: 800;
      color: rgba(6, 95, 70, 0.035);
      text-transform: uppercase;
      letter-spacing: 4px;
      pointer-events: none;
      z-index: 1;
      text-align: center;
      line-height: 1.4;
      width: 130%;
      user-select: none;
    }

    .content-layer {
      position: relative;
      z-index: 2;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .header-table {
      width: 100%;
      border-collapse: collapse;
      border-bottom: 2px solid #065f46;
      padding-bottom: 6px;
      margin-bottom: 6px;
    }

    .logo-cell {
      width: 80px;
      text-align: center;
      vertical-align: middle;
    }

    .logo-cell img {
      width: 76px;
      height: 76px;
      object-fit: contain;
      border-radius: 8px;
      border: 1px solid #a7f3d0;
      background: #ffffff;
      padding: 2px;
      display: block;
      margin: 0 auto;
    }

    .title-cell {
      text-align: center;
      padding: 0 10px;
      vertical-align: middle;
    }

    .hindi-title {
      font-size: 13px;
      font-weight: 800;
      color: #065f46;
      letter-spacing: 0.5px;
      margin-bottom: 1px;
    }

    .institute-title {
      font-family: 'Cinzel', Georgia, serif;
      font-size: 18px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      line-height: 1.15;
    }

    .institute-tagline {
      font-size: 8.5px;
      font-weight: 600;
      color: #475569;
      letter-spacing: 0.3px;
      margin-top: 2px;
      text-transform: uppercase;
    }

    .exam-title-badge {
      display: inline-block;
      margin-top: 4px;
      font-size: 10.5px;
      font-weight: 800;
      color: #047857;
      letter-spacing: 0.6px;
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
      padding: 2px 10px;
      border-radius: 4px;
      text-transform: uppercase;
    }

    .qr-header-cell {
      width: 80px;
      text-align: center;
      vertical-align: middle;
    }

    .header-qr-box {
      width: 74px;
      height: 74px;
      border: 1px solid #cbd5e1;
      padding: 2px;
      background: #fff;
      display: inline-block;
    }

    .ribbon-banner {
      background: #065f46;
      color: #FFFFFF;
      text-align: center;
      padding: 4px 12px;
      margin: 6px 0;
      border-top: 2px solid #059669;
      border-bottom: 2px solid #059669;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .ribbon-banner h2 {
      font-size: 12.5px;
      font-weight: 800;
      letter-spacing: 1.2px;
      text-transform: uppercase;
    }

    .ribbon-badge {
      background: #059669;
      color: #FFFFFF;
      font-size: 8.5px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 3px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    .tracking-strip {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2px 8px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      margin-bottom: 6px;
      font-size: 9px;
      font-weight: 600;
      color: #475569;
    }

    .section-header {
      background: #065f46;
      color: #FFFFFF;
      font-size: 10px;
      font-weight: 800;
      padding: 3px 8px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      border-left: 4px solid #10b981;
      margin: 6px 0 4px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 6px;
    }

    .data-table td, .data-table th {
      border: 1px solid #94a3b8;
      padding: 4.5px 7px;
      font-size: 9.8px;
      vertical-align: middle;
    }

    .field-label {
      background: #f1f5f9;
      font-weight: 700;
      color: #1e293b;
      width: 20%;
      text-transform: uppercase;
      font-size: 9.2px;
    }

    .field-val {
      font-weight: 600;
      color: #0f172a;
      width: 30%;
    }

    .photo-cell {
      width: 130px;
      text-align: center;
      vertical-align: middle;
      padding: 4px !important;
      background: #fafafa;
    }

    .photo-frame {
      width: 110px;
      height: 135px;
      border: 1.5px solid #065f46;
      margin: 0 auto;
      background: #f8fafc;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .photo-frame img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .photo-caption {
      font-size: 8px;
      font-weight: 700;
      color: #475569;
      margin-top: 2px;
      text-transform: uppercase;
    }

    /* Full Payment Box */
    .payment-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 6px;
      border: 1.5px solid #059669;
    }

    .payment-table td, .payment-table th {
      border: 1px solid #a7f3d0;
      padding: 5px 8px;
      font-size: 9.5px;
    }

    .pay-label {
      background: #ecfdf5;
      font-weight: 700;
      color: #065f46;
      width: 25%;
      text-transform: uppercase;
      font-size: 9px;
    }

    .pay-val {
      font-weight: 700;
      color: #0f172a;
      width: 25%;
    }

    .declaration-box {
      border: 1px solid #cbd5e1;
      background: #f8fafc;
      padding: 8px 10px;
      margin-bottom: 8px;
    }

    .declaration-title {
      font-weight: 800;
      font-size: 9.5px;
      color: #0f172a;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .declaration-text {
      font-size: 8.5px;
      line-height: 1.45;
      color: #334155;
      text-align: justify;
    }

    .sign-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 6px;
    }

    .sign-table td {
      border: 1px solid #94a3b8;
      width: 33.33%;
      padding: 4px 4px 3px 4px;
      text-align: center;
      vertical-align: bottom;
      height: 66px;
      background: #fff;
    }

    .sign-area {
      height: 42px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .sign-title {
      border-top: 1px solid #64748b;
      padding-top: 3px;
      font-size: 8.5px;
      font-weight: 700;
      color: #0f172a;
      text-transform: uppercase;
    }

    .footer-note {
      text-align: center;
      font-size: 7.5px;
      color: #64748b;
      margin-top: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
    }

    @media print {
      @page {
        size: A4 portrait;
        margin: 5mm 6mm;
      }
      body {
        background: #FFFFFF !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      .sheet {
        width: 100% !important;
        height: 286mm !important;
        min-height: 286mm !important;
        max-height: 286mm !important;
        padding: 0 !important;
        box-shadow: none !important;
        display: flex !important;
        flex-direction: column !important;
      }
      .border-container {
        border: 2.5px solid #065f46 !important;
        outline: 1px solid #059669 !important;
        outline-offset: -4px !important;
        flex: 1 !important;
        height: 100% !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: space-between !important;
        padding: 8px 10px 6px 10px !important;
      }
      .content-layer {
        flex: 1 !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: space-between !important;
      }
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="border-container">
      
      <div class="watermark">
        NIICT TALENT SEARCH & GK COMPETITION<br>
        APPLICATION & FEE RECEIPT
      </div>

      <div class="content-layer">

        <!-- 1. OFFICIAL NATIONAL HEADER -->
        <table class="header-table">
          <tr>
            <td class="logo-cell">
              <img src="${NIICT_LOGO_DATA_URI}" alt="NIICT Logo" onerror="this.src='/logo.jpg'" />
            </td>
            <td class="title-cell">
              <div class="hindi-title">NIICT सूचना प्रौद्योगिकी एवं कम्प्यूटर प्रबंधन संस्थान</div>
              <div class="institute-title">NIICT Institute of Information & Computer Technology</div>
              <div class="institute-tagline">Autonomous Examination & Skill Certification Authority &bull; Regd. Govt. of India &bull; ISO 9001:2015 &bull; Official Website: www.niict.in</div>
              <div class="exam-title-badge">
                All India Talent Search & GK Computer Scholarship Exam — 2026-27
              </div>
            </td>
            <td class="qr-header-cell">
              <div class="header-qr-box">
                ${qrCodeImg}
              </div>
            </td>
          </tr>
        </table>

        <!-- 2. APPLICATION TITLE RIBBON -->
        <div class="ribbon-banner">
          <span>Date: ${appDate}</span>
          <h2>APPLICATION CONFIRMATION & FEE RECEIPT / आवेदन पत्र एवं शुल्क रसीद</h2>
          <span class="ribbon-badge">PAID ACKNOWLEDGEMENT</span>
        </div>

        <!-- 3. BARCODE STRIP & TRACKING -->
        <div class="tracking-strip">
          <div>
            ${barcodeSvg}
          </div>
          <div style="text-align: right;">
            <div><strong>Application No:</strong> APP-2026-${rollNumber.replace(/\D/g, '') || '0129'}</div>
            <div><strong>Roll Number:</strong> <span style="color: #065f46; font-weight: 800;">${rollNumber}</span></div>
          </div>
        </div>

        <!-- 4. CANDIDATE PARTICULARS -->
        <div class="section-header">
          <span>Personal & Academic Details / अभ्यर्थी का व्यक्तिगत एवं शैक्षणिक विवरण</span>
          <span style="font-size: 8px;">Registration Record</span>
        </div>

        <table class="data-table">
          <tr>
            <td class="field-label">Candidate Full Name:</td>
            <td class="field-val" style="font-weight: 800; color: #065f46;">${name}</td>
            <td class="field-label">Date of Birth:</td>
            <td class="field-val">${dobFormatted}</td>
            <td rowspan="5" class="photo-cell">
              <div class="photo-frame">
                ${application.image 
                  ? `<img src="${application.image}" alt="Candidate Photo" onerror="this.parentElement.innerHTML='<span style=\\'font-size:9px;font-weight:700;color:#94a3b8;text-align:center;padding:10px;\\'>PASSPORT PHOTO</span>'" />`
                  : `<span style="font-size: 9px; font-weight: 700; color: #64748b; text-align: center; padding: 10px;">PASSPORT PHOTO</span>`
                }
              </div>
              <div class="photo-caption">Uploaded Photograph</div>
            </td>
          </tr>
          <tr>
            <td class="field-label">Father's Full Name:</td>
            <td class="field-val">${fatherName}</td>
            <td class="field-label">Mother's Full Name:</td>
            <td class="field-val">${motherName}</td>
          </tr>
          <tr>
            <td class="field-label">Aadhaar Card No:</td>
            <td class="field-val">${aadhaar}</td>
            <td class="field-label">Primary Mobile:</td>
            <td class="field-val">${phone}</td>
          </tr>
          <tr>
            <td class="field-label">Class Passed:</td>
            <td class="field-val">${classPassed}</td>
            <td class="field-label">Parent Mobile:</td>
            <td class="field-val">${parentPhone}</td>
          </tr>
          <tr>
            <td class="field-label">School / College:</td>
            <td class="field-val" colspan="3">${school}</td>
          </tr>
          <tr>
            <td class="field-label">Permanent Address:</td>
            <td class="field-val" colspan="4">${address}</td>
          </tr>
          <tr>
            <td class="field-label">Applied Stream:</td>
            <td class="field-val" colspan="4" style="color: #065f46; font-weight: 800;">${subject}</td>
          </tr>
        </table>

        <!-- 5. COMPREHENSIVE FEE & PAYMENT TRANSACTION DETAILS -->
        <div class="section-header" style="background: #047857;">
          <span>Official Fee & Payment Transaction Record / शुल्क एवं भुगतान विवरण</span>
          <span style="font-size: 8px;">Authorized Payment Gateway</span>
        </div>

        <table class="payment-table">
          <tr>
            <td class="pay-label">Application Registration Fee:</td>
            <td class="pay-val" style="font-size: 11px; color: #047857;">Rs. ${amountPaid}.00 INR</td>
            <td class="pay-label">Payment Status:</td>
            <td class="pay-val" style="color: ${isPaid ? '#059669' : '#d97706'}; font-weight: 800;">
              ${paymentStatus}
            </td>
          </tr>
          <tr>
            <td class="pay-label">Transaction Reference ID:</td>
            <td class="pay-val" style="font-family: monospace; font-size: 9px;">${txnId}</td>
            <td class="pay-label">Payment Order ID:</td>
            <td class="pay-val" style="font-family: monospace; font-size: 9px;">${orderId}</td>
          </tr>
          <tr>
            <td class="pay-label">Payment Gateway:</td>
            <td class="pay-val">Cashfree Payments India Pvt. Ltd.</td>
            <td class="pay-label">Payment Date & Time:</td>
            <td class="pay-val">${paymentDate}</td>
          </tr>
          <tr>
            <td class="pay-label">Exam Centre / Venue:</td>
            <td class="pay-val" colspan="3" style="font-weight: 600;">
              S.K. Modern Intermediate College, Semari, Janghai, District Jaunpur, Uttar Pradesh – 222201<br>
              <span style="color: #065f46; font-size: 8.5px; font-weight: 700;">Official Portal: www.niict.in &bull; Contact Helpline: +91 81828 38680, +91 84234 15436 &bull; Email: niict01@gmail.com</span>
            </td>
          </tr>
        </table>

        <!-- 6. CANDIDATE & GUARDIAN DECLARATION -->
        <div class="declaration-box">
          <div class="declaration-title">Declaration by Candidate & Parent/Guardian (अभ्यर्थी एवं अभिभावक की घोषणा)</div>
          <div class="declaration-text">
            1. I hereby solemnly declare that all statements made and information furnished in this application form are true, complete and correct to the best of my knowledge and belief.<br>
            2. I have read all the examination rules, syllabus, eligibility criteria, and instructions. I agree to abide by the decision of the Examination Authority in all matters.<br>
            3. In the event of any information being found false, fraudulent, or ineligible at any stage, my candidature will stand cancelled automatically, and legal action may be initiated.<br>
            4. I acknowledge that the registration fee of Rs. 150/- has been paid successfully and is non-refundable.
          </div>
        </div>

        <!-- 7. SIGNATURE CONFIRMATION BLOCK -->
        <table class="sign-table">
          <tr>
            <td>
              <div class="sign-area"></div>
              <div class="sign-title">Candidate's Signature</div>
              <span class="sign-subtitle">Date: ________________________</span>
            </td>
            <td>
              <div class="sign-area" style="position: relative;">
                <img src="${NIICT_SEAL_DATA_URI}" alt="Official Seal" style="max-height: 42px; max-width: 65px; object-fit: contain; opacity: 0.92; transform: rotate(-4deg);" />
              </div>
              <div class="sign-title">Official Institute Stamp</div>
              <span class="sign-subtitle">Verified &amp; Approved</span>
            </td>
            <td>
              <div class="sign-area" style="position: relative;">
                <img src="${NIICT_AUTH_SIGNATURE_DATA_URI}" alt="Authorized Signature" style="max-height: 38px; max-width: 95px; object-fit: contain; transform: rotate(-2deg);" />
              </div>
              <div class="sign-title">Authorized Signatory</div>
              <span class="sign-subtitle">NIICT Admissions Authority</span>
            </td>
          </tr>
        </table>

        <!-- FOOTER BAR -->
        <div class="footer-note">
          Official Confirmation Page & Fee Receipt &bull; Official Portal: www.niict.in &bull; NIICT Institute of Information & Computer Technology &bull; Page 1 of 1
        </div>

      </div>
    </div>
  </div>
</body>
</html>`;
};

/* ═════════════════════════════════════════════════════════════════
   PRINT WINDOW HANDLERS
   ═════════════════════════════════════════════════════════════════ */

// Open E-Admit Card in print window
export const openAdmitCardPrintWindow = (application) => {
  const htmlContent = generateAdmitCardHtml(application);
  const printWindow = window.open('', '_blank', 'width=920,height=1000');
  
  if (!printWindow) {
    alert('Please allow popups for this site to print the Admit Card.');
    return;
  }

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();

  const triggerPrint = () => {
    try {
      printWindow.focus();
      printWindow.print();
    } catch (err) {
      console.error('Print trigger error:', err);
    }
  };

  printWindow.onload = () => {
    setTimeout(triggerPrint, 350);
  };
  // Fallback in case onload already fired
  setTimeout(triggerPrint, 750);
};

// Open Application Form & Fee Receipt in print window
export const openApplicationFormPrintWindow = (application) => {
  const htmlContent = generateApplicationFormHtml(application);
  const printWindow = window.open('', '_blank', 'width=920,height=1000');
  
  if (!printWindow) {
    alert('Please allow popups for this site to print the Application Form.');
    return;
  }

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();

  const triggerPrint = () => {
    try {
      printWindow.focus();
      printWindow.print();
    } catch (err) {
      console.error('Print trigger error:', err);
    }
  };

  printWindow.onload = () => {
    setTimeout(triggerPrint, 350);
  };
  // Fallback in case onload already fired
  setTimeout(triggerPrint, 750);
};
