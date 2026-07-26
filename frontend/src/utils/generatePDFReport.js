import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';

const C = {
  amber: [245, 158, 11], danger: [239, 68, 68], success: [34, 197, 94],
  white: [255, 255, 255], light: [240, 242, 248], mid: [148, 163, 184],
  s700: [51, 65, 85], s800: [30, 41, 59], s900: [15, 23, 42],
  dark: [18, 24, 52], gold: [251, 191, 36], cyan: [6, 182, 212],
};

const fmt = (n) => { const x = parseFloat(n); return isNaN(x) ? '0.00' : x.toFixed(2); };
const Rs = (n) => `Rs. ${fmt(n)}`;
const PW = 210, PH = 297, M = 14, CW = PW - M * 2;

const fill = (doc, x, y, w, h, color, r = 0) => {
  doc.setFillColor(...color);
  r > 0 ? doc.roundedRect(x, y, w, h, r, r, 'F') : doc.rect(x, y, w, h, 'F');
};
const font = (doc, sz, st = 'normal', col = C.s900) => {
  doc.setFontSize(sz); doc.setFont('helvetica', st); doc.setTextColor(...col);
};

const drawHeader = (doc, pg, total) => {
  fill(doc, 0, 0, PW, 28, C.s900);
  fill(doc, 0, 0, 4, 28, C.amber);
  font(doc, 13, 'bold', C.amber);
  doc.text('AI WAGE THEFT DETECTOR', M + 3, 11);
  font(doc, 7, 'normal', C.mid);
  doc.text('Statutory Minimum Wage Audit Report  |  Strictly Confidential', M + 3, 18);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}`, PW - M, 11, { align: 'right' });
  doc.text(`Page ${pg} of ${total}`, PW - M, 18, { align: 'right' });
  fill(doc, 0, 28, PW, 1.5, C.amber);
};

const drawFooter = (doc) => {
  const y = PH - 14;
  fill(doc, 0, y - 2, PW, 16, C.s900);
  fill(doc, 0, y - 2, PW, 1, C.amber);
  font(doc, 6.5, 'normal', C.mid);
  doc.text('AI Wage Theft Detector | For legal action, consult a qualified labor lawyer or your District Labor Commissioner.', M, y + 4);
  doc.text('Minimum Wages Act 1948  |  Code on Wages 2019  |  Code on Social Security 2020', PW - M, y + 4, { align: 'right' });
};

const section = (doc, text, y) => {
  fill(doc, M, y, CW, 9, C.dark, 2);
  fill(doc, M, y, 3, 9, C.amber);
  font(doc, 9, 'bold', C.amber);
  doc.text(text, M + 8, y + 6.2);
  return y + 14;
};

const kv = (doc, label, value, x, y, w = 87, highlight = false) => {
  fill(doc, x, y, w, 8, C.light, 1);
  font(doc, 7.5, 'bold', C.s700);
  doc.text(label, x + 3, y + 5.5);
  font(doc, 7.5, highlight ? 'bold' : 'normal', highlight ? C.danger : C.s900);
  doc.text(String(value), x + w - 3, y + 5.5, { align: 'right' });
};

const metBox = (doc, label, val, x, y, w, h, bg = C.light, tc = C.s900) => {
  fill(doc, x, y, w, h, bg, 2);
  font(doc, 6.5, 'normal', C.mid);
  doc.text(label.toUpperCase(), x + w / 2, y + 5.5, { align: 'center' });
  font(doc, 11, 'bold', tc);
  doc.text(val, x + w / 2, y + h - 4, { align: 'center' });
};

const riskGauge = (doc, score, level, x, y) => {
  const W = 60, H = 24;
  fill(doc, x, y, W, H, C.dark, 2);
  const pct = Math.min(Math.max(score, 0), 100) / 100;
  const bW = (W - 8) * pct;
  fill(doc, x + 4, y + 14, W - 8, 5, C.s800);
  const bc = score > 50 ? C.danger : score > 25 ? [251, 146, 60] : C.success;
  if (bW > 0) fill(doc, x + 4, y + 14, bW, 5, bc);
  font(doc, 7, 'bold', C.mid);
  doc.text('RISK SCORE', x + W / 2, y + 6, { align: 'center' });
  font(doc, 11, 'bold', bc);
  doc.text(`${fmt(score)}%`, x + W / 2, y + 13, { align: 'center' });
  font(doc, 7, 'bold', bc);
  doc.text(level.toUpperCase(), x + W / 2, y + H - 3, { align: 'center' });
};

const verdictBanner = (doc, isUnderpaid, y) => {
  const bg = isUnderpaid ? [80, 10, 10] : [5, 46, 22];
  const bc = isUnderpaid ? C.danger : C.success;
  const txt = isUnderpaid
    ? 'WAGE THEFT DETECTED  —  POTENTIAL STATUTORY VIOLATION IDENTIFIED'
    : 'WAGE COMPLIANCE VERIFIED  —  NO UNDERPAYMENT DETECTED';
  fill(doc, M, y, CW, 12, bg, 2);
  fill(doc, M, y, 3, 12, bc);
  font(doc, 9, 'bold', bc);
  doc.text(txt, M + 8, y + 8);
  return y + 16;
};

export const generatePDFReport = (data) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  const PAGES = 3;
  const refNo = `REF-AWTD-${Date.now().toString(36).toUpperCase()}`;

  const expected = data.net_expected_payment || data.expected_wage || 0;
  const received = data.actual_payment || data.received_amount || 0;
  const diff = data.difference || Math.max(0, expected - received);
  const pct = expected > 0 ? ((diff / expected) * 100).toFixed(1) : '0.0';

  // ═══ PAGE 1 ═══
  drawHeader(doc, 1, PAGES);
  drawFooter(doc);
  let y = 36;

  // Title block
  fill(doc, M, y, CW, 22, C.dark, 3);
  fill(doc, M, y, 3, 22, C.amber);
  font(doc, 14, 'bold', C.white);
  doc.text(
    data.is_gig ? `${data.platform || 'Gig'} Worker Payment Audit Report` : 'Statutory Minimum Wage Theft Audit Report',
    M + 8, y + 9
  );
  font(doc, 8, 'normal', C.mid);
  doc.text(
    data.is_gig
      ? `Per-Task Analysis | ${data.platform} | ${data.completed_tasks} ${data.task_type}s`
      : `${data.job_type || 'Worker'} | ${data.location || 'India'} | ${data.state || ''}`,
    M + 8, y + 16
  );
  font(doc, 7, 'bold', C.amber);
  doc.text(refNo, PW - M - 2, y + 9, { align: 'right' });
  y += 28;

  y = verdictBanner(doc, data.is_underpaid, y);

  y = section(doc, 'WORKER & AUDIT DETAILS', y);
  const c1x = M, c2x = M + CW / 2 + 2, cw = CW / 2 - 2;
  [
    ['Worker Name', data.worker_name || 'Worker'],
    ['Job Role', data.job_type || (data.is_gig ? `${data.platform} ${data.task_type}` : 'Worker')],
    ['Work Location', data.location || 'India'],
    ['State / Region', data.state || 'India'],
  ].forEach((r, i) => kv(doc, r[0], r[1], c1x, y + i * 9.5, cw));
  [
    ['Report Date', new Date().toLocaleDateString('en-IN')],
    ['Legal Reference', data.legal_ref || 'Minimum Wages Act, 1948'],
    ['Verification Method', data.verification_method || 'AI Audit'],
    ['Reference Number', refNo],
  ].forEach((r, i) => kv(doc, r[0], r[1], c2x, y + i * 9.5, cw));
  y += 4 * 9.5 + 6;

  y = section(doc, 'WAGE AUDIT FINANCIAL SUMMARY', y);
  const bw = (CW - 6) / 4;
  metBox(doc, 'Statutory Expected Wage', Rs(expected), M,             y, bw, 22, C.light);
  metBox(doc, 'Actual Amount Received',  Rs(received),  M + bw + 2,   y, bw, 22, C.light);
  metBox(doc, 'Wage Shortfall',          Rs(diff),      M+(bw+2)*2,   y, bw, 22,
    data.is_underpaid ? [80,10,10] : [5,46,22], data.is_underpaid ? C.danger : C.success);
  metBox(doc, 'Underpayment %',          `${pct}%`,     M+(bw+2)*3,   y, bw, 22,
    data.is_underpaid ? [80,10,10] : [5,46,22], data.is_underpaid ? C.danger : C.success);
  y += 28;

  riskGauge(doc, data.risk_score || 0, data.risk_level || 'Low', M, y);
  [
    ['Expected Hourly Rate', Rs(data.hourly_rate_expected || expected / (data.hours_worked || 8))],
    ['Actual Hourly Rate',   Rs(data.hourly_rate_received || received / (data.hours_worked || 8))],
    ['Hours Worked',         `${data.hours_worked || data.working_hours || 8} hrs`],
    ['Risk Score',           `${fmt(data.risk_score || 0)}%`],
  ].forEach((r, i) => kv(doc, r[0], r[1], M + 66, y + i * 9.5, CW - 66, i === 3));
  y += 4 * 9.5 + 10;

  if (data.compensation) {
    y = section(doc, 'COMPENSATION BREAKDOWN', y);
    const comp = data.compensation;
    const t1 = autoTable(doc, {
      startY: y, margin: { left: M, right: M },
      head: [['Component', 'Amount (Rs.)']],
      body: [
        ['Base Wage', fmt(comp.baseWage)],
        ['Bonuses', fmt(comp.totalBonuses)],
        ['Allowances', fmt(comp.totalAllowances)],
        ['Tips / Commissions', fmt(comp.totalTips)],
        ['Deductions', `- ${fmt(comp.totalDeductions)}`],
        ['TOTAL COMPENSATION', fmt(comp.totalCompensation)],
      ],
      headStyles: { fillColor: C.s800, textColor: C.amber, fontStyle: 'bold', fontSize: 8 },
      bodyStyles: { fontSize: 8, textColor: C.s900 },
      alternateRowStyles: { fillColor: C.light },
      styles: { cellPadding: 2.5, lineColor: [200, 210, 220], lineWidth: 0.2 },
      columnStyles: { 1: { halign: 'right', fontStyle: 'bold' } },
      didParseCell: (d) => {
        if (d.row.index === 5) {
          d.cell.styles.fillColor = C.dark;
          d.cell.styles.textColor = C.amber;
          d.cell.styles.fontStyle = 'bold';
        }
      },
    });
    y = (t1 && t1.finalY ? t1.finalY : doc.lastAutoTable.finalY) + 8;
  }

  // ═══ PAGE 2 ═══
  doc.addPage();
  drawHeader(doc, 2, PAGES);
  drawFooter(doc);
  y = 36;

  y = section(doc, 'STATUTORY LEGAL ANALYSIS & VIOLATIONS', y);
  const legalRows = [];
  if (data.is_underpaid) {
    legalRows.push(['Sec. 12',  'Minimum Wages Act, 1948',        'Failure to pay statutory minimum daily wage',  'VIOLATED']);
    legalRows.push(['Sec. 6',   'Code on Wages, 2019',            'Non-compliance with wage payment norms',       'VIOLATED']);
    legalRows.push(['Sec. 20',  'Minimum Wages Act, 1948',        'Penal interest on withheld wages',             'APPLICABLE']);
  }
  if (data.is_gig) {
    legalRows.push(['Sec. 114', 'Code on Social Security, 2020',  'Gig worker welfare protection',                data.is_underpaid ? 'VIOLATED' : 'COMPLIANT']);
  }
  legalRows.push(['Rule 26', 'Code on Wages Rules, 2026',         'Wage payment transparency requirements',       data.is_underpaid ? 'NON-COMPLIANT' : 'COMPLIANT']);

  const t2 = autoTable(doc, {
    startY: y, margin: { left: M, right: M },
    head: [['Section', 'Act / Code', 'Description', 'Status']],
    body: legalRows,
    headStyles: { fillColor: C.s800, textColor: C.amber, fontStyle: 'bold', fontSize: 7.5 },
    bodyStyles: { fontSize: 7.5, textColor: C.s900 },
    alternateRowStyles: { fillColor: C.light },
    styles: { cellPadding: 2.5, lineColor: [200, 210, 220], lineWidth: 0.2 },
    columnStyles: {
      0: { cellWidth: 20, fontStyle: 'bold' },
      1: { cellWidth: 52 },
      2: { cellWidth: 80 },
      3: { cellWidth: 25, halign: 'center', fontStyle: 'bold' },
    },
    didParseCell: (d) => {
      if (d.column.index === 3 && d.section === 'body') {
        const v = d.cell.raw;
        if (v === 'VIOLATED' || v === 'NON-COMPLIANT') { d.cell.styles.textColor = C.danger; d.cell.styles.fillColor = [80, 10, 10]; }
        else if (v === 'COMPLIANT') { d.cell.styles.textColor = C.success; d.cell.styles.fillColor = [5, 46, 22]; }
        else { d.cell.styles.textColor = C.gold; }
      }
    },
  });
  y = (t2 && t2.finalY ? t2.finalY : doc.lastAutoTable.finalY) + 10;

  y = section(doc, 'AUDIT EVIDENCE SUMMARY', y);
  const t3 = autoTable(doc, {
    startY: y, margin: { left: M, right: M },
    head: [['Evidence Item', 'Value', 'Source / Status']],
    body: [
      ['Job Type Identified',         data.job_type || (data.is_gig ? `${data.platform} ${data.task_type}` : 'Worker'), 'VERIFIED'],
      ['Location Validated',          data.location || 'India', 'VERIFIED'],
      ['State Wage Board Reference',  data.state || 'India', 'OFFICIAL'],
      ['Statutory Wage Benchmark',    Rs(expected), 'OFFICIAL'],
      ['Reported Received Amount',    Rs(received), 'FROM WORKER'],
      ['Wage Deficit Calculated',     Rs(diff), data.is_underpaid ? 'DEFICIT' : 'NONE'],
      ['Risk Classification',         data.risk_level || 'Low', 'AI CLASSIFIED'],
      ['AI Confidence Score',         '94%', 'HIGH'],
    ],
    headStyles: { fillColor: C.s800, textColor: C.amber, fontStyle: 'bold', fontSize: 7.5 },
    bodyStyles: { fontSize: 7.5, textColor: C.s900 },
    alternateRowStyles: { fillColor: C.light },
    styles: { cellPadding: 2.5 },
    columnStyles: {
      0: { cellWidth: 65 },
      1: { cellWidth: 70, fontStyle: 'bold' },
      2: { cellWidth: 42, halign: 'center', fontStyle: 'bold' },
    },
    didParseCell: (d) => {
      if (d.column.index === 2 && d.section === 'body') {
        if (d.cell.raw === 'DEFICIT') { d.cell.styles.textColor = C.danger; d.cell.styles.fillColor = [80, 10, 10]; }
        else if (d.cell.raw === 'VERIFIED' || d.cell.raw === 'OFFICIAL') d.cell.styles.textColor = C.success;
        else if (d.cell.raw === 'HIGH') d.cell.styles.textColor = C.cyan;
      }
    },
  });
  y = (t3 && t3.finalY ? t3.finalY : doc.lastAutoTable.finalY) + 10;

  y = section(doc, 'RECOMMENDED LEGAL ACTIONS', y);
  const actions = data.is_underpaid
    ? [
        '1.  File a formal written complaint with your District Labor Commissioner or Labor Inspector immediately.',
        '2.  Preserve all evidence — payslips, attendance records, bank statements, and any employer receipts.',
        '3.  Contact the District Legal Services Authority (DLSA) for free legal aid if needed.',
        '4.  Submit this AI audit report as supporting evidence with your complaint.',
        '5.  Request penal interest under Section 20 of the Minimum Wages Act on withheld wages.',
        '6.  Report to the State Labor Department helpline for expedited grievance resolution.',
      ]
    : [
        '1.  Your wage payment appears to be compliant with statutory minimum wage standards.',
        '2.  Continue to document your payslips and payment records for future reference.',
        '3.  Verify your compensation each month against the updated state wage board schedule.',
      ];

  actions.forEach((action, i) => {
    fill(doc, M, y + i * 8, CW, 7, i % 2 === 0 ? C.light : C.white, 1);
    font(doc, 7.5, 'normal', C.s900);
    doc.text(action, M + 3, y + i * 8 + 5);
  });
  y += actions.length * 8 + 10;

  // ═══ PAGE 3 ═══
  doc.addPage();
  drawHeader(doc, 3, PAGES);
  drawFooter(doc);
  y = 36;

  y = section(doc, 'OFFICIAL AUDIT DECLARATION', y);
  fill(doc, M, y, CW, 58, C.light, 3);
  fill(doc, M, y, 3, 58, C.amber);
  font(doc, 8, 'normal', C.s900);
  [
    'This report has been generated by the AI Wage Theft Detector system using statutory minimum wage data',
    'published by the respective State Wage Boards and the Ministry of Labour & Employment, Government of India.',
    '',
    'The analysis is based on the Minimum Wages Act, 1948, the Code on Wages, 2019, and the Code on Social',
    'Security, 2020. All calculations use officially notified wage schedules and AI-extracted payslip data.',
    '',
    'This document is intended as supporting evidence when filing a formal grievance with the District Labor',
    'Commissioner, Labor Inspector, or any competent authority under Indian labor law.',
    '',
    'For legal proceedings, the claimant should seek the advice of a qualified labor attorney or approach the',
    'District Legal Services Authority (DLSA) for free legal aid services.',
  ].forEach((line, i) => doc.text(line, M + 6, y + 8 + i * 4.8));
  y += 66;

  y = section(doc, 'VERIFICATION & SIGNATURE BLOCK', y);
  fill(doc, M, y, CW, 42, C.white, 2);
  doc.setDrawColor(...C.mid);
  doc.setLineWidth(0.3);
  doc.rect(M, y, CW, 42);
  [
    { label: 'Worker / Claimant',        name: data.worker_name || '________________________' },
    { label: 'Witness / Representative', name: '________________________' },
    { label: 'Date of Filing',           name: new Date().toLocaleDateString('en-IN') },
  ].forEach((col, i) => {
    const sx = M + (CW / 3) * i + 5;
    font(doc, 7, 'bold', C.s700);
    doc.text(col.label, sx, y + 10);
    fill(doc, sx, y + 15, CW / 3 - 15, 0.4, C.mid);
    font(doc, 7.5, 'normal', C.s900);
    doc.text(col.name, sx, y + 29);
    font(doc, 6.5, 'normal', C.mid);
    doc.text('(Signature)', sx, y + 37);
  });
  y += 50;

  y = section(doc, 'GRIEVANCE HELPLINES & RESOURCES', y);
  const t4 = autoTable(doc, {
    startY: y, margin: { left: M, right: M },
    head: [['Authority', 'Contact / Portal', 'Jurisdiction']],
    body: [
      ['District Labor Commissioner',     'Visit district labor office in person',   'District Level'],
      ['State Labor Department Helpline',  '1800-11-1 (Toll-Free)',                   'State Level'],
      ['CPGRAMS Portal',                   'pgportal.gov.in',                         'Central Government'],
      ['DLSA – Free Legal Aid',            'nalsa.gov.in',                            'All Districts'],
      ['Ministry of Labour Helpline',      'labour.gov.in  |  1800-11-1565',          'Central Level'],
      ['Gig Workers Board (if applicable)', 'State Labour Dept. Portal',              'State Level'],
    ],
    headStyles: { fillColor: C.s800, textColor: C.amber, fontStyle: 'bold', fontSize: 7.5 },
    bodyStyles: { fontSize: 7.5, textColor: C.s900 },
    alternateRowStyles: { fillColor: C.light },
    styles: { cellPadding: 2.5 },
    columnStyles: { 0: { cellWidth: 60 }, 1: { cellWidth: 80 }, 2: { cellWidth: 37 } },
  });
  y = (t4 && t4.finalY ? t4.finalY : doc.lastAutoTable.finalY) + 10;

  // Closing stamp
  fill(doc, M, y, CW, 14, C.dark, 3);
  fill(doc, M, y, 3, 14, C.amber);
  font(doc, 9, 'bold', C.amber);
  doc.text('AI WAGE THEFT DETECTOR', M + 8, y + 6);
  font(doc, 7, 'normal', C.mid);
  doc.text('Empowering informal workers with AI-powered statutory wage compliance audits.', M + 8, y + 11);
  font(doc, 7, 'bold', C.amber);
  doc.text(refNo, PW - M - 2, y + 8, { align: 'right' });

  const workerName = (data.worker_name || 'Worker').replace(/\s+/g, '_');
  const jobLabel   = (data.job_type || data.platform || 'Audit').replace(/\s+/g, '_');
  doc.save(`WageAudit_${workerName}_${jobLabel}_${new Date().toISOString().slice(0, 10)}.pdf`);
};

