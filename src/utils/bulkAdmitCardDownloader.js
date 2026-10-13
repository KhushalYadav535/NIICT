/**
 * Bulk Admit Card Zip Downloader for Admin Panel
 * Packages all candidate admit cards into a single ZIP archive.
 * Inside the ZIP, candidates are stored in the "admit-card/" directory.
 * When extracted, produces an "admit-card" folder containing individual 
 * self-contained, printable HTML files for every student.
 * 
 * Also includes:
 * - 00_ALL_CANDIDATES_BATCH_PRINT.html: Batch print all students in 1 click!
 * - 00_INDEX.html: Fast offline directory with links to all admit cards.
 */

import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { generateAdmitCardHtml, isCandidateOverAge } from './admitCardGenerator';

export const downloadBulkAdmitCardsZip = async (candidates = [], userOptions = {}, onProgress = () => {}) => {
  if (!candidates || candidates.length === 0) {
    alert('No candidate admit cards to download.');
    return { success: false, count: 0 };
  }

  const opt = {
    session: '2026-2027',
    folderName: 'admit-card',
    includeOverAge: true, // Admin can download all or mark overage
    ...userOptions
  };

  const total = candidates.length;
  onProgress(0, total, `Initializing ZIP package for ${total} candidates...`);

  const zip = new JSZip();
  // Root folder named "admit-card" as requested by user
  const admitFolder = zip.folder(opt.folderName);

  const candidateIndexList = [];
  const batchCardsHtml = [];

  for (let i = 0; i < total; i++) {
    const app = candidates[i];
    const roll = (app.rollNumber || `NIICT_${i + 1}`).trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    const cleanName = (app.name || 'STUDENT').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    const isOverAge = isCandidateOverAge(app.dateOfBirth, app.createdAt);

    const filename = `${roll}_${cleanName}.html`;
    const singleHtml = generateAdmitCardHtml(app);

    // Save individual candidate file
    admitFolder.file(filename, singleHtml);

    candidateIndexList.push({
      sno: i + 1,
      roll: app.rollNumber || roll,
      name: app.name || 'CANDIDATE',
      fatherName: app.fatherName || app.fathersName || 'N/A',
      school: app.school || 'N/A',
      subject: app.subject || 'GK',
      filename,
      isOverAge
    });

    // Extract sheet content for 00_ALL_CANDIDATES_BATCH_PRINT.html
    const sheetMatch = singleHtml.match(/<div class="sheet">([\s\S]*?)<\/div>\s*<\/body>/i);
    if (sheetMatch && sheetMatch[1]) {
      batchCardsHtml.push(`
        <div class="batch-sheet-wrapper">
          <div class="sheet">
            ${sheetMatch[1]}
          </div>
        </div>
      `);
    }

    if (i % 20 === 0 || i === total - 1) {
      onProgress(i + 1, total, `Generating admit cards... (${i + 1}/${total})`);
      await new Promise(r => setTimeout(r, 0)); // Keep UI responsive
    }
  }

  // 1. Create 00_ALL_CANDIDATES_BATCH_PRINT.html
  onProgress(total, total, 'Creating 00_ALL_CANDIDATES_BATCH_PRINT.html...');
  const batchMasterHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Batch Print All Admit Cards - ${opt.session} (${total} Students)</title>
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
      color: #0F172A;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px 10px;
    }

    .batch-print-nav {
      position: fixed;
      top: 15px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      background: #0F172A;
      color: #FFFFFF;
      padding: 10px 24px;
      border-radius: 40px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      border: 1px solid #334155;
    }
    .batch-print-nav button {
      background: #2563EB;
      color: #FFF;
      border: none;
      padding: 8px 20px;
      border-radius: 20px;
      font-weight: 800;
      font-size: 13px;
      cursor: pointer;
    }
    .batch-print-nav button:hover { background: #1D4ED8; }
    .batch-print-nav a {
      color: #94A3B8;
      text-decoration: none;
      font-size: 13px;
      font-weight: 600;
    }
    .batch-print-nav a:hover { color: #FFF; }

    .batch-sheet-wrapper {
      margin-bottom: 25px;
      page-break-after: always;
      break-after: page;
    }

    .sheet {
      width: 210mm;
      min-height: 297mm;
      height: 297mm;
      background: #FFFFFF;
      padding: 6mm 8mm;
      position: relative;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    @media print {
      body { background: transparent !important; padding: 0 !important; }
      .batch-print-nav { display: none !important; }
      .batch-sheet-wrapper {
        margin: 0 !important;
        page-break-after: always !important;
        break-after: page !important;
      }
      .sheet {
        box-shadow: none !important;
        margin: 0 !important;
        height: 297mm !important;
        min-height: 297mm !important;
        max-height: 297mm !important;
      }
    }
  </style>
</head>
<body>
  <div class="batch-print-nav">
    <span>📋 <strong>${total} Admit Cards Ready</strong> (Session ${opt.session})</span>
    <button onclick="window.print()">🖨️ Print All Admit Cards</button>
    <a href="00_INDEX.html">&larr; Open Index</a>
  </div>

  ${batchCardsHtml.join('')}
</body>
</html>`;

  admitFolder.file('00_ALL_CANDIDATES_BATCH_PRINT.html', batchMasterHtml);

  // 2. Create 00_INDEX.html
  onProgress(total, total, 'Creating 00_INDEX.html...');
  const indexRowsHtml = candidateIndexList.map(item => `
    <tr>
      <td style="text-align: center; font-weight: bold;">${item.sno}</td>
      <td style="font-family: monospace; font-weight: bold; color: #1E3A8A;">${item.roll}</td>
      <td><strong>${item.name}</strong></td>
      <td>${item.fatherName}</td>
      <td>${item.school}</td>
      <td style="text-align: center;"><span class="badge ${item.isOverAge ? 'badge-warning' : 'badge-success'}">${item.isOverAge ? 'OVER AGE (>20)' : 'ELIGIBLE'}</span></td>
      <td style="text-align: center;">
        <a href="${item.filename}" target="_blank" class="btn-link">📄 Open Admit Card</a>
      </td>
    </tr>
  `).join('');

  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admit Cards Directory - ${opt.session} (${total} Candidates)</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #F1F5F9;
      color: #0F172A;
      padding: 30px 20px;
      margin: 0;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: #FFFFFF;
      padding: 30px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #E2E8F0;
      padding-bottom: 20px;
      margin-bottom: 20px;
    }
    h1 { font-size: 22px; color: #1E3A8A; margin: 0 0 6px; }
    p { color: #64748B; margin: 0; font-size: 14px; }
    .btn-batch {
      background: linear-gradient(135deg, #2563EB, #1D4ED8);
      color: #FFF;
      text-decoration: none;
      font-weight: 700;
      padding: 12px 24px;
      border-radius: 12px;
      display: inline-block;
      box-shadow: 0 4px 14px rgba(37,99,235,0.3);
    }
    .btn-batch:hover { background: #1D4ED8; }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; }
    th { background: #0F172A; color: #FFF; padding: 10px 12px; text-align: left; }
    td { padding: 10px 12px; border-bottom: 1px solid #E2E8F0; }
    tr:hover { background: #F8FAFC; }
    .badge { padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; }
    .badge-success { background: #DCFCE7; color: #166534; }
    .badge-warning { background: #FEF3C7; color: #92400E; }
    .btn-link {
      color: #2563EB;
      text-decoration: none;
      font-weight: 700;
      background: #EFF6FF;
      padding: 4px 10px;
      border-radius: 6px;
      display: inline-block;
    }
    .btn-link:hover { background: #DBEAFE; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <h1>📦 NIICT E-Admit Cards Index Directory</h1>
        <p>Session ${opt.session} &bull; Total Candidates: <strong>${total}</strong></p>
      </div>
      <div>
        <a href="00_ALL_CANDIDATES_BATCH_PRINT.html" class="btn-batch">🖨️ Open Batch Print (All Students)</a>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 5%; text-align: center;">S.No</th>
          <th style="width: 15%;">Roll Number</th>
          <th style="width: 25%;">Candidate Name</th>
          <th style="width: 20%;">Father's Name</th>
          <th style="width: 20%;">School</th>
          <th style="width: 15%; text-align: center;">Age Status</th>
          <th style="width: 15%; text-align: center;">Action</th>
        </tr>
      </thead>
      <tbody>
        ${indexRowsHtml}
      </tbody>
    </table>
  </div>
</body>
</html>`;

  admitFolder.file('00_INDEX.html', indexHtml);

  // 3. Compress ZIP
  onProgress(total, total, 'Compressing into ZIP file...');
  const zipBlob = await zip.generateAsync(
    {
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    },
    (metadata) => {
      onProgress(total, total, `Compressing ZIP file: ${Math.round(metadata.percent)}%`);
    }
  );

  const zipFilename = `Admit_Cards_${opt.session || '2026-2027'}_${new Date().toISOString().split('T')[0]}.zip`;
  saveAs(zipBlob, zipFilename);

  onProgress(total, total, 'Download complete!');
  return { success: true, count: total, filename: zipFilename };
};
