/**
 * Official Examination Attendance Sheet & Desk Signature Register Generator
 * Standards-compliant A4 Multi-Candidate Exam Attendance Sheet
 * 
 * Fields per student:
 * 1. Roll Number (अनुक्रमांक)
 * 2. Candidate Name (परीक्षार्थी का नाम)
 * 3. Father's Name (पिता का नाम)
 * 4. Photo (पासपोर्ट आकार फोटो)
 * 5. Signature Box (परीक्षार्थी हस्ताक्षर बॉक्स)
 * 6. Invigilator Verification / Attendance Check (P/A)
 */

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { NIICT_LOGO_DATA_URI, NIICT_SEAL_DATA_URI } from './logoBase64';

const DEFAULT_OPTIONS = {
  session: '2026-2027',
  examDate: '18 October 2026 (Sunday)',
  examTiming: '10:00 AM – 11:30 AM (90 Min)',
  reportingTime: '8:00 AM',
  examCenter: 'S K Modern Intermediate College Semari Janghai Jaunpur',
  centerCode: 'SKMIC-222201',
  subject: 'GK & Computer Talent Competition 2026',
  studentsPerPage: 8
};

// Chunk array helper
const chunkArray = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

// Safe image loader to Base64 for jsPDF
const loadImageAsDataUrl = (url) => {
  return new Promise((resolve) => {
    if (!url || typeof url !== 'string') return resolve(null);
    if (url.startsWith('data:image/')) return resolve(url);

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 120;
        canvas.height = img.naturalHeight || 150;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/jpeg', 0.85);
        resolve(dataURL);
      } catch (err) {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
};

/* ═════════════════════════════════════════════════════════════════
   1. HTML ATTENDANCE REGISTER (PRINT & SAVE TO PDF VIA BROWSER)
   ═════════════════════════════════════════════════════════════════ */
export const generateAttendanceSheetHtml = (candidates = [], userOptions = {}) => {
  const opt = { ...DEFAULT_OPTIONS, ...userOptions };
  const chunks = chunkArray(candidates, opt.studentsPerPage);
  const totalPages = Math.max(1, chunks.length);
  const totalCandidates = candidates.length;

  const pagesHtml = chunks.map((slice, pageIdx) => {
    const pageNum = pageIdx + 1;
    const startSno = pageIdx * opt.studentsPerPage + 1;

    const rowsHtml = slice.map((app, idx) => {
      const sno = startSno + idx;
      const roll = app.rollNumber || 'NIICTXXXX';
      const name = (app.name || 'CANDIDATE NAME').toUpperCase();
      const father = (app.fatherName || app.fathersName || 'FATHER NAME').toUpperCase();
      const school = app.school || 'NIICT AFFILIATED ACADEMY';
      const subject = app.subject || 'GK';
      const photoSrc = app.image;

      return `
        <tr class="cand-row">
          <td class="col-sno">${sno}</td>
          <td class="col-roll">
            <div class="roll-badge">${roll}</div>
            <div class="roll-sub">${subject}</div>
          </td>
          <td class="col-photo">
            <div class="photo-frame">
              ${photoSrc 
                ? `<img src="${photoSrc}" alt="${name}" onerror="this.parentElement.innerHTML='<div class=\\\'no-photo\\\'>AFFIX PHOTO</div>'" />`
                : `<div class="no-photo">AFFIX PHOTO</div>`
              }
            </div>
          </td>
          <td class="col-details">
            <div class="cand-name">${name}</div>
            <div class="cand-father"><strong>Father:</strong> ${father}</div>
            <div class="cand-school">${school}</div>
          </td>
          <td class="col-sign">
            <div class="sign-box">
              <div class="sign-line"></div>
              <span class="sign-caption">Candidate Signature in Exam Hall</span>
            </div>
          </td>
          <td class="col-invig">
            <div class="att-status">
              <label><input type="checkbox" /> P</label>
              <label><input type="checkbox" /> A</label>
            </div>
            <div class="invig-sign-line"></div>
            <span class="sign-caption">Invigilator Initial</span>
          </td>
        </tr>
      `;
    }).join('');

    return `
      <div class="sheet-page">
        <!-- TOP CONTROLS (Screen only) -->
        ${pageNum === 1 ? `
          <div class="print-bar no-print">
            <div class="print-bar-title">
              📋 Official Examination Attendance Sheet &bull; ${totalCandidates} Candidates (${totalPages} Pages)
            </div>
            <div class="print-bar-actions">
              <button onclick="window.print()" class="btn-print">🖨️ Print Sheet (All Pages)</button>
              <button onclick="window.close()" class="btn-close">Close</button>
            </div>
          </div>
        ` : ''}

        <!-- PAGE HEADER -->
        <div class="header-container">
          <div class="header-logo">
            <img src="${NIICT_LOGO_DATA_URI}" alt="NIICT Logo" />
          </div>
          <div class="header-text">
            <div class="inst-hindi">राष्ट्रीय सूचना प्रौद्योगिकी एवं कम्प्यूटर संस्थान</div>
            <div class="inst-name">NATIONAL INSTITUTE OF INFORMATION &amp; COMPUTER TECHNOLOGY</div>
            <div class="exam-title">OFFICIAL EXAMINATION ATTENDANCE &amp; DESK VERIFICATION REGISTER</div>
            <div class="exam-sub">${opt.subject.toUpperCase()} &bull; SESSION ${opt.session}</div>
          </div>
          <div class="header-badge">
            <div class="page-badge">PAGE ${pageNum} OF ${totalPages}</div>
            <div class="center-code">CENTER CODE<br/><strong>${opt.centerCode}</strong></div>
          </div>
        </div>

        <!-- EXAM METADATA STRIP -->
        <div class="meta-strip">
          <div class="meta-item"><strong>Exam Date:</strong> ${opt.examDate}</div>
          <div class="meta-item"><strong>Timing:</strong> ${opt.examTiming}</div>
          <div class="meta-item"><strong>Exam Center:</strong> ${opt.examCenter}</div>
        </div>

        <!-- CANDIDATES TABLE -->
        <table class="attendance-table">
          <thead>
            <tr>
              <th style="width: 5%;">S.No</th>
              <th style="width: 14%;">Roll Number</th>
              <th style="width: 11%;">Photo</th>
              <th style="width: 34%;">Candidate Name &amp; Father's Name</th>
              <th style="width: 23%;">Candidate Signature</th>
              <th style="width: 13%;">Attendance</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <!-- PAGE FOOTER SUMMARY -->
        <div class="footer-summary">
          <div class="summary-box">
            <div class="stat-item">Candidates on Page: <strong>${slice.length}</strong></div>
            <div class="stat-item">Present (उपस्थित): _______</div>
            <div class="stat-item">Absent (अनुपस्थित): _______</div>
          </div>

          <div class="signatures-box">
            <div class="sign-block">
              <div class="sign-rule"></div>
              <div class="sign-label">Room Invigilator Signature</div>
              <div class="sign-sublabel">(हस्ताक्षर कक्ष निरीक्षक)</div>
            </div>

            <div class="sign-block" style="text-align: right;">
              <div class="sign-rule"></div>
              <div class="sign-label">Center Superintendent &amp; Seal</div>
              <div class="sign-sublabel">(केंद्राधीक्षक मुहर व हस्ताक्षर)</div>
            </div>
          </div>
        </div>

        <div class="bottom-watermark">
          NIICT Official Examination Register &bull; Page ${pageNum} of ${totalPages} &bull; Generated for Exam Control &bull; Strictly Confidential
        </div>
      </div>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Attendance Sheet - ${opt.session} - ${opt.centerCode}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800&family=Noto+Sans:wght@400;500;600;700;800&display=swap');

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }

    body {
      background-color: #475569;
      font-family: 'Noto Sans', 'Segoe UI', Arial, sans-serif;
      color: #0F172A;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px 0;
    }

    .sheet-page {
      width: 210mm;
      min-height: 297mm;
      height: 297mm;
      background: #FFFFFF;
      padding: 8mm 10mm;
      margin-bottom: 20px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.25);
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .no-print {
      display: flex;
    }

    .print-bar {
      position: fixed;
      top: 15px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      background: #0F172A;
      color: #FFFFFF;
      padding: 10px 22px;
      border-radius: 40px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
      border: 1px solid #334155;
    }
    .print-bar-title {
      font-weight: 700;
      font-size: 14px;
      color: #F8FAFC;
    }
    .print-bar-actions {
      display: flex;
      gap: 10px;
    }
    .btn-print {
      background: #2563EB;
      color: #FFF;
      border: none;
      padding: 8px 18px;
      border-radius: 20px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-print:hover { background: #1D4ED8; }
    .btn-close {
      background: #334155;
      color: #FFF;
      border: none;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }
    .btn-close:hover { background: #475569; }

    /* Header Container */
    .header-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #0F172A;
      padding-bottom: 6px;
      margin-bottom: 6px;
    }
    .header-logo img {
      width: 58px;
      height: 58px;
      object-fit: contain;
    }
    .header-text {
      text-align: center;
      flex: 1;
      padding: 0 10px;
    }
    .inst-hindi {
      font-size: 12px;
      font-weight: 800;
      color: #B91C1C;
      letter-spacing: 0.5px;
    }
    .inst-name {
      font-family: 'Cinzel', serif;
      font-size: 14px;
      font-weight: 800;
      color: #0F172A;
      letter-spacing: 0.8px;
      line-height: 1.2;
    }
    .exam-title {
      font-size: 12px;
      font-weight: 800;
      color: #1E3A8A;
      letter-spacing: 0.5px;
      margin-top: 1px;
    }
    .exam-sub {
      font-size: 10px;
      font-weight: 700;
      color: #475569;
    }
    .header-badge {
      text-align: right;
    }
    .page-badge {
      background: #0F172A;
      color: #FFFFFF;
      font-size: 10px;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 4px;
      display: inline-block;
      margin-bottom: 3px;
    }
    .center-code {
      font-size: 9px;
      color: #475569;
      line-height: 1.2;
    }
    .center-code strong {
      color: #0F172A;
      font-size: 11px;
    }

    /* Meta Strip */
    .meta-strip {
      background: #F1F5F9;
      border: 1px solid #CBD5E1;
      border-radius: 4px;
      padding: 4px 8px;
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: #1E293B;
      margin-bottom: 6px;
    }
    .meta-item strong {
      color: #0F172A;
    }

    /* Table Styles */
    .attendance-table {
      width: 100%;
      border-collapse: collapse;
      flex: 1;
    }
    .attendance-table th {
      background: #1E293B;
      color: #FFFFFF;
      font-size: 10px;
      font-weight: 800;
      padding: 5px 6px;
      text-align: center;
      border: 1px solid #0F172A;
      letter-spacing: 0.3px;
    }
    .attendance-table td {
      border: 1px solid #64748B;
      padding: 4px 6px;
      vertical-align: middle;
      font-size: 10.5px;
    }
    .cand-row {
      height: 25.5mm;
    }
    .cand-row:nth-child(even) {
      background: #F8FAFC;
    }

    .col-sno {
      text-align: center;
      font-weight: 800;
      font-size: 11px;
      color: #334155;
    }
    .col-roll {
      text-align: center;
    }
    .roll-badge {
      font-family: 'Courier New', monospace;
      font-size: 12px;
      font-weight: 800;
      color: #0F172A;
      background: #E2E8F0;
      padding: 3px 6px;
      border-radius: 4px;
      border: 1px solid #CBD5E1;
      display: inline-block;
    }
    .roll-sub {
      font-size: 9px;
      font-weight: 700;
      color: #2563EB;
      margin-top: 2px;
    }

    .col-photo {
      text-align: center;
    }
    .photo-frame {
      width: 38px;
      height: 48px;
      border: 1px solid #475569;
      background: #F1F5F9;
      border-radius: 3px;
      margin: 0 auto;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .photo-frame img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .no-photo {
      font-size: 7.5px;
      font-weight: 700;
      color: #64748B;
      text-align: center;
      line-height: 1.1;
      padding: 2px;
    }

    .col-details {
      line-height: 1.3;
    }
    .cand-name {
      font-weight: 800;
      font-size: 12px;
      color: #0F172A;
    }
    .cand-father {
      font-size: 10px;
      color: #334155;
      margin-top: 1px;
    }
    .cand-school {
      font-size: 9px;
      color: #64748B;
      font-style: italic;
      margin-top: 1px;
      max-width: 230px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .col-sign {
      padding: 4px 8px;
    }
    .sign-box {
      border: 1.5px dashed #94A3B8;
      background: #FFFFFF;
      height: 44px;
      border-radius: 4px;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 3px 6px;
    }
    .sign-line {
      border-bottom: 1px solid #CBD5E1;
      margin-bottom: 2px;
    }
    .sign-caption {
      font-size: 7.5px;
      color: #94A3B8;
      text-align: center;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .col-invig {
      text-align: center;
      padding: 4px;
    }
    .att-status {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-bottom: 6px;
      font-size: 10px;
      font-weight: 700;
    }
    .att-status label {
      display: flex;
      align-items: center;
      gap: 2px;
      cursor: pointer;
    }
    .invig-sign-line {
      border-bottom: 1px solid #CBD5E1;
      margin-bottom: 2px;
    }

    /* Footer Summary */
    .footer-summary {
      border-top: 1.5px solid #0F172A;
      padding-top: 8px;
      margin-top: 6px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .summary-box {
      font-size: 10px;
      color: #1E293B;
      display: flex;
      gap: 16px;
    }
    .stat-item strong {
      color: #0F172A;
      font-size: 11px;
    }

    .signatures-box {
      display: flex;
      gap: 40px;
    }
    .sign-block {
      min-width: 140px;
    }
    .sign-rule {
      border-bottom: 1px solid #0F172A;
      height: 24px;
      margin-bottom: 3px;
    }
    .sign-label {
      font-size: 9.5px;
      font-weight: 700;
      color: #0F172A;
      text-transform: uppercase;
    }
    .sign-sublabel {
      font-size: 8px;
      color: #475569;
    }

    .bottom-watermark {
      text-align: center;
      font-size: 7.5px;
      color: #94A3B8;
      margin-top: 4px;
      letter-spacing: 0.5px;
    }

    /* Print Styles */
    @media print {
      body {
        background: transparent !important;
        padding: 0 !important;
      }
      .no-print {
        display: none !important;
      }
      .sheet-page {
        margin: 0 !important;
        box-shadow: none !important;
        page-break-after: always !important;
        break-after: page !important;
        height: 297mm !important;
        min-height: 297mm !important;
        max-height: 297mm !important;
      }
    }
  </style>
</head>
<body>
  ${pagesHtml}
</body>
</html>`;
};

/* ═════════════════════════════════════════════════════════════════
   2. OPEN PRINT WINDOW (BROWSER PRINT & SAVE-TO-PDF)
   ═════════════════════════════════════════════════════════════════ */
export const openAttendanceSheetPrintWindow = (candidates = [], userOptions = {}) => {
  if (!candidates || candidates.length === 0) {
    alert('No candidates available to generate the Attendance Sheet.');
    return;
  }

  const html = generateAttendanceSheetHtml(candidates, userOptions);
  const printWindow = window.open('', '_blank', 'width=1100,height=900');

  if (!printWindow) {
    alert('Please allow popups to open the Attendance Sheet.');
    return;
  }

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  const trigger = () => {
    try {
      printWindow.focus();
      printWindow.print();
    } catch (_) {}
  };

  printWindow.onload = () => {
    setTimeout(trigger, 400);
  };
  setTimeout(trigger, 800);
};

/* ═════════════════════════════════════════════════════════════════
   3. DIRECT PDF DOWNLOAD (NATIVE jsPDF + autoTable)
   ═════════════════════════════════════════════════════════════════ */
export const downloadAttendanceSheetPdf = async (candidates = [], userOptions = {}, onProgress = () => {}) => {
  if (!candidates || candidates.length === 0) {
    alert('No candidates available to export Attendance Sheet.');
    return;
  }

  const opt = { ...DEFAULT_OPTIONS, ...userOptions };
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const chunks = chunkArray(candidates, opt.studentsPerPage);
  const totalPages = Math.max(1, chunks.length);

  // Pre-load photos in memory to prevent lag
  const loadedPhotos = {};
  onProgress(0, candidates.length, 'Loading candidate photos...');

  for (let i = 0; i < candidates.length; i++) {
    const c = candidates[i];
    if (c.image) {
      try {
        const dataUrl = await loadImageAsDataUrl(c.image);
        if (dataUrl) loadedPhotos[c.rollNumber] = dataUrl;
      } catch (_) {}
    }
    if (i % 25 === 0) {
      onProgress(i, candidates.length, `Pre-loading photos (${i}/${candidates.length})...`);
      await new Promise(r => setTimeout(r, 0));
    }
  }

  chunks.forEach((slice, pageIdx) => {
    const pageNum = pageIdx + 1;
    const startSno = pageIdx * opt.studentsPerPage + 1;

    if (pageIdx > 0) doc.addPage();

    // 1. HEADER
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(185, 28, 28);
    doc.text('NATIONAL INSTITUTE OF INFORMATION & COMPUTER TECHNOLOGY (NIICT)', 105, 12, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('EXAMINATION ATTENDANCE & DESK SIGNATURE REGISTER', 105, 17, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`${opt.subject.toUpperCase()} • SESSION ${opt.session}`, 105, 21.5, { align: 'center' });

    // Header metadata block
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(10, 24, 190, 8.5, 1.5, 1.5, 'FD');

    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`Exam Date: ${opt.examDate}`, 13, 29);
    doc.text(`Time: ${opt.examTiming}`, 78, 29);
    doc.text(`Center Code: ${opt.centerCode}`, 150, 29);
    doc.text(`Page: ${pageNum} / ${totalPages}`, 180, 29);

    // Table Data
    const tableBody = slice.map((app, idx) => {
      const sno = startSno + idx;
      const roll = app.rollNumber || 'NIICTXXXX';
      const name = (app.name || 'CANDIDATE NAME').toUpperCase();
      const father = (app.fatherName || app.fathersName || 'FATHER NAME').toUpperCase();
      const school = app.school || 'NIICT ACADEMY';

      return [
        String(sno),
        roll,
        '', // Handled in didDrawCell for Photo
        `${name}\nFather: ${father}\n${school}`,
        '', // Handled in didDrawCell for Signature Box
        ''  // Handled in didDrawCell for Attendance & Invigilator
      ];
    });

    autoTable(doc, {
      startY: 34.5,
      head: [['S.No', 'Roll No', 'Photo', "Candidate Details (Name & Father's Name)", 'Candidate Signature', 'Attendance']],
      body: tableBody,
      theme: 'grid',
      styles: {
        fontSize: 8.5,
        cellPadding: 2,
        valign: 'middle',
        lineColor: [100, 116, 139],
        lineWidth: 0.25,
        textColor: [15, 23, 42]
      },
      headStyles: {
        fillColor: [30, 41, 59],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center',
        fontSize: 8.5
      },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center', fontStyle: 'bold' },
        1: { cellWidth: 26, halign: 'center', fontStyle: 'bold' },
        2: { cellWidth: 22, halign: 'center' },
        3: { cellWidth: 64 },
        4: { cellWidth: 44, halign: 'center' },
        5: { cellWidth: 24, halign: 'center' }
      },
      didDrawCell: (data) => {
        if (data.section === 'body') {
          const rowApp = slice[data.row.index];
          if (!rowApp) return;

          // Photo Column
          if (data.column.index === 2) {
            const photoUrl = loadedPhotos[rowApp.rollNumber];
            const px = data.cell.x + 3;
            const py = data.cell.y + 2;
            const pw = 16;
            const ph = 21;

            if (photoUrl) {
              try {
                doc.addImage(photoUrl, 'JPEG', px, py, pw, ph);
                doc.setDrawColor(100, 116, 139);
                doc.rect(px, py, pw, ph);
              } catch (_) {
                doc.setDrawColor(148, 163, 184);
                doc.rect(px, py, pw, ph);
                doc.setFontSize(5.5);
                doc.setTextColor(148, 163, 184);
                doc.text('PHOTO', px + pw / 2, py + ph / 2, { align: 'center' });
              }
            } else {
              doc.setDrawColor(148, 163, 184);
              doc.rect(px, py, pw, ph);
              doc.setFontSize(5.5);
              doc.setTextColor(148, 163, 184);
              doc.text('AFFIX\nPHOTO', px + pw / 2, py + ph / 2 - 1, { align: 'center' });
            }
          }

          // Signature Box Column
          if (data.column.index === 4) {
            const sx = data.cell.x + 2;
            const sy = data.cell.y + 2.5;
            const sw = data.cell.width - 4;
            const sh = data.cell.height - 5;

            // Draw neat signature box
            doc.setDrawColor(148, 163, 184);
            doc.setLineDashPattern([1, 1], 0);
            doc.roundedRect(sx, sy, sw, sh, 1, 1, 'D');
            doc.setLineDashPattern([], 0); // reset dash

            doc.setFontSize(5.5);
            doc.setTextColor(148, 163, 184);
            doc.text('Candidate Signature', sx + sw / 2, sy + sh - 1.5, { align: 'center' });
          }

          // Attendance Verification Column
          if (data.column.index === 5) {
            const ax = data.cell.x + 2;
            const ay = data.cell.y + 4;
            doc.setFontSize(7.5);
            doc.setTextColor(15, 23, 42);
            doc.text('[ ] P   [ ] A', ax + 2, ay);

            const lineY = data.cell.y + data.cell.height - 4;
            doc.setDrawColor(203, 213, 225);
            doc.line(ax, lineY, ax + data.cell.width - 4, lineY);
            doc.setFontSize(5.5);
            doc.setTextColor(148, 163, 184);
            doc.text('Invigilator Sign', ax + (data.cell.width - 4) / 2, lineY + 2.5, { align: 'center' });
          }
        }
      }
    });

    // FOOTER SUMMARY
    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 4 : 260;

    doc.setDrawColor(15, 23, 42);
    doc.line(10, finalY, 200, finalY);

    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`Candidates on Page: ${slice.length}   |   Present (उपस्थित): ______   |   Absent (अनुपस्थित): ______`, 12, finalY + 5);

    // Signature lines
    doc.text('Room Invigilator Signature: __________________', 12, finalY + 14);
    doc.text('Center Superintendent Signature & Seal: __________________', 105, finalY + 14);

    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text(`NIICT Official Examination Attendance Register • Page ${pageNum} of ${totalPages} • Center: ${opt.examCenter}`, 105, 292, { align: 'center' });

    onProgress(Math.min(candidates.length, startSno + slice.length), candidates.length, `Building PDF pages: ${pageNum}/${totalPages}`);
  });

  const filename = `Attendance_Sheet_${opt.session || '2026-2027'}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
};
