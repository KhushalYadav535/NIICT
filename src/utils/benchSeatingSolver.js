/**
 * Anti-Cheating Bench Seating Solver & Bench-Wise Candidate Sorter
 * Used by Admin Panel to generate Seat/Bench-Wise Attendance Sheets & Seating Registers
 */

export function cleanSchoolForGrouping(name) {
  if (!name || name.trim() === '' || name.trim().toUpperCase() === 'NA') return 'NA / INDEPENDENT';
  let s = name.trim().toUpperCase().replace(/\s+/g, ' ');
  if (s.includes('DHYEYA') || s.includes('DHEYA')) return 'DHYEYA STUDY';
  if (s.includes('TOP 10')) return 'TOP 10 CLASSES';
  if (s.includes('NDC')) return 'NDC COACHING/INSTITUTE';
  if (s.includes('VIJAY')) return 'VIJAY COACHING';
  if (s.includes('NIC JANGHAI') || s.includes('N.I.C JANGHAI') || s.includes('NIC')) return 'NIC JANGHAI';
  if (s.includes('NIICT')) return 'NIICT COMPUTER';
  if (s.includes('KDS') || s.includes('K.D.S')) return 'KDS SCHOOL';
  if (s.includes('SACHIN COACHING')) return 'SACHIN COACHING';
  if (s.includes('KRISHNA COACHING')) return 'KRISHNA COACHING';
  if (s.includes('GYANDEEP') || s.includes('GYAN DEEP')) return 'GYANDEEP COACHING';
  if (s.includes('LAKSHYA')) return 'LAKSHYA COACHING';
  if (s.includes('SARVODAYA') || s.includes('SARVODYA')) return 'SARVODAYA VIDYAPEETH';
  if (s.includes('RD MEMORIAL') || s.includes('R.D MEMORIAL') || s.includes('R D MEMORIAL')) return 'RD MEMORIAL IC';
  if (s.includes('NAGRIK') || s.includes('NAGARIK')) return 'NAGRIK DEGREE COLLEGE';
  return s;
}

export function formatCleanSchool(raw) {
  if (!raw || raw.trim() === '' || raw.trim().toUpperCase() === 'NA') {
    return 'INDEPENDENT / NA';
  }
  let s = raw.trim().replace(/\s+/g, ' ');
  const upper = s.toUpperCase();

  if (upper.includes('DHYEYA') || upper.includes('DHEYA')) return 'DHYEYA STUDY';
  if (upper.includes('TOP 10')) return 'TOP 10 CLASSES';
  if (upper.includes('NDC')) return 'NDC COACHING';
  if (upper.includes('VIJAY')) return 'VIJAY COACHING';
  if (upper.includes('NIC JANGHAI') || upper.includes('N.I.C JANGHAI') || upper.includes('NIC')) return 'NIC JANGHAI';
  if (upper.includes('NIICT')) return 'NIICT COMPUTER';
  if (upper.includes('KDS') || upper.includes('K.D.S')) return 'KDS SCHOOL';
  if (upper.includes('SACHIN')) return 'SACHIN COACHING';
  if (upper.includes('KRISHNA')) return 'KRISHNA COACHING';
  if (upper.includes('GYANDEEP') || upper.includes('GYAN DEEP')) return 'GYANDEEP COACHING';
  if (upper.includes('LAKSHYA')) return 'LAKSHYA COACHING';
  if (upper.includes('SARVODAYA') || upper.includes('SARVODYA')) return 'SARVODAYA IC';
  if (upper.includes('RD MEMORIAL') || upper.includes('R.D MEMORIAL') || upper.includes('R D MEMORIAL')) return 'RD MEMORIAL IC';
  if (upper.includes('NAGRIK') || upper.includes('NAGARIK')) return 'NAGRIK DEGREE COLLEGE';
  if (upper.includes('DASAVANITI')) return 'DASAVANITI DEVI MV';
  if (upper.includes('SHREE DEVI') || upper.includes('SRI DEVI')) return 'SHREE DEVI PRASAD MV';
  if (upper.includes('SPEAK WELL')) return 'SPEAK WELL ACADEMY';
  if (upper.includes('MATA PITA')) return 'MATA PITA IC';
  if (upper.includes('SITA DEVI')) return 'SITA DEVI IC';
  if (upper.includes('SDPG') || upper.includes('S D P G')) return 'SDPG COLLEGE';
  if (upper.includes('SUBHASH')) return 'SUBHASH IC';
  if (upper.includes('SIC GARIYAW')) return 'SIC GARIYAW';
  if (upper.includes('SICSM')) return 'SICSM INSTITUTE';
  if (upper.includes('DIVINE')) return 'DIVINE COACHING';
  if (upper.includes('NAVDISHA') || upper.includes('NAV DISHA')) return 'NAV DISHA COACHING';
  if (upper.includes('SMART COACHING')) return 'SMART COACHING';

  s = s.replace(/Mahavidyalay[a-z]*/gi, 'MV');
  s = s.replace(/INTERMIDIAT COLLEGE|Intermediate college|Intermediate College|Inter college|Inter College/gi, 'IC');
  s = s.replace(/Degree College/gi, 'DC');
  s = s.replace(/Coaching center|Coaching Center|Coaching classes|Coaching Classes|Coaching Clasess/gi, 'Coaching');
  s = s.replace(/English medium school|English Medium School/gi, 'EMS');
  s = s.replace(/Convent school|Convent School/gi, 'Convent');
  s = s.replace(/Public school|Public School/gi, 'PS');
  s = s.replace(/Academy/gi, 'Acad.');
  s = s.replace(/Prayagraj|Jaunpur|Janghai/gi, '').trim();

  if (s.length > 20) {
    s = s.slice(0, 19) + '…';
  }
  return s.toUpperCase();
}

export function solveBenchRoom(students, benchRows = 5, benchCols = 4) {
  const grid = Array.from({ length: benchRows }, () =>
    Array.from({ length: benchCols }, () => ({ L: null, R: null }))
  );

  const schoolGroups = {};
  for (const s of students) {
    const sc = s.schoolClean || cleanSchoolForGrouping(s.school);
    if (!schoolGroups[sc]) schoolGroups[sc] = [];
    schoolGroups[sc].push(s);
  }

  const sortedSchools = Object.keys(schoolGroups).sort((a, b) => {
    if (a === 'NA / INDEPENDENT') return 1;
    if (b === 'NA / INDEPENDENT') return -1;
    return schoolGroups[b].length - schoolGroups[a].length;
  });

  const orderedStudents = [];
  for (const sc of sortedSchools) {
    orderedStudents.push(...schoolGroups[sc]);
  }

  const allSlots = [];
  for (let r = 0; r < benchRows; r++) {
    for (let c = 0; c < benchCols; c++) {
      allSlots.push({ r, c, side: 'L' });
      allSlots.push({ r, c, side: 'R' });
    }
  }

  allSlots.sort((a, b) => {
    const parityA = (a.r + a.c) % 2;
    const parityB = (b.r + b.c) % 2;
    if (parityA !== parityB) return parityA - parityB;
    return a.side.localeCompare(b.side);
  });

  function isSafe(r, c, side, school) {
    if (school === 'NA / INDEPENDENT') return true;

    const otherSide = side === 'L' ? 'R' : 'L';
    if (grid[r][c][otherSide] && (grid[r][c][otherSide].schoolClean || cleanSchoolForGrouping(grid[r][c][otherSide].school)) === school) {
      return false;
    }

    if (r > 0) {
      if (grid[r - 1][c][side] && (grid[r - 1][c][side].schoolClean || cleanSchoolForGrouping(grid[r - 1][c][side].school)) === school) {
        return false;
      }
    }

    if (r < benchRows - 1) {
      if (grid[r + 1][c][side] && (grid[r + 1][c][side].schoolClean || cleanSchoolForGrouping(grid[r + 1][c][side].school)) === school) {
        return false;
      }
    }

    if (side === 'L' && c > 0) {
      if (grid[r][c - 1]['R'] && (grid[r][c - 1]['R'].schoolClean || cleanSchoolForGrouping(grid[r][c - 1]['R'].school)) === school) {
        return false;
      }
    }
    if (side === 'R' && c < benchCols - 1) {
      if (grid[r][c + 1]['L'] && (grid[r][c + 1]['L'].schoolClean || cleanSchoolForGrouping(grid[r][c + 1]['L'].school)) === school) {
        return false;
      }
    }

    return true;
  }

  function backtrack(studentIdx) {
    if (studentIdx === orderedStudents.length) return true;
    const student = orderedStudents[studentIdx];
    const school = student.schoolClean || cleanSchoolForGrouping(student.school);

    for (const slot of allSlots) {
      if (grid[slot.r][slot.c][slot.side] === null) {
        if (isSafe(slot.r, slot.c, slot.side, school)) {
          grid[slot.r][slot.c][slot.side] = student;
          const benchNo = slot.r * benchCols + slot.c + 1;
          student.benchNo = benchNo;
          student.benchRow = slot.r + 1;
          student.benchCol = slot.c + 1;
          student.side = slot.side;
          student.seatSide = slot.side === 'L' ? 'Seat 1 (Left)' : 'Seat 2 (Right)';
          student.seatCode = `Bench ${benchNo} (${slot.side === 'L' ? 'Left' : 'Right'})`;

          if (backtrack(studentIdx + 1)) return true;

          grid[slot.r][slot.c][slot.side] = null;
          delete student.benchNo;
          delete student.benchRow;
          delete student.benchCol;
          delete student.side;
          delete student.seatSide;
          delete student.seatCode;
        }
      }
    }
    return false;
  }

  const success = backtrack(0);
  return { success, grid };
}

/**
 * Organizes any list of candidates into Room & Bench Seating Order
 * @param {Array} rawCandidates - List of applications/candidates
 * @param {number} chunkSize - Number of candidates per room (default 40)
 * @returns {{ rooms: Array, benchOrderedCandidates: Array }}
 */
export function generateBenchSeatingPlanForCandidates(rawCandidates = [], chunkSize = 40) {
  if (!rawCandidates || rawCandidates.length === 0) {
    return { rooms: [], benchOrderedCandidates: [] };
  }

  // 1. Sort candidates sequentially by roll number
  const sorted = [...rawCandidates].sort((a, b) => {
    const rA = String(a.rollNumber || '');
    const rB = String(b.rollNumber || '');
    return rA.localeCompare(rB, undefined, { numeric: true });
  });

  const rooms = [];
  const benchOrderedCandidates = [];

  for (let i = 0; i < sorted.length; i += chunkSize) {
    const chunk = sorted.slice(i, i + chunkSize);
    const roomNum = Math.floor(i / chunkSize) + 1;

    const students = chunk.map(d => ({
      ...d,
      schoolClean: cleanSchoolForGrouping(d.school),
      schoolDisplay: formatCleanSchool(d.school)
    }));

    const benchRows = 5;
    const benchCols = 4;
    const { success, grid } = solveBenchRoom(students, benchRows, benchCols);

    // Flat list of students in bench order:
    // Bench 1 Left, Bench 1 Right, Bench 2 Left, Bench 2 Right, etc.
    const roomCards = [];
    for (let r = 0; r < benchRows; r++) {
      for (let c = 0; c < benchCols; c++) {
        const benchNo = r * benchCols + c + 1;
        const b = grid[r][c];
        if (b.L) {
          const item = {
            ...b.L,
            roomNumber: roomNum,
            benchNo,
            seatSide: 'Seat 1 (Left)',
            seatLabel: 'SEAT 1 (LEFT)',
            benchTag: `Room ${roomNum} • Bench ${benchNo} (Left)`,
            rowPos: `Row ${r + 1}, Col ${c + 1}`,
            benchRow: r + 1,
            benchCol: c + 1,
            sideType: 'L'
          };
          roomCards.push(item);
          benchOrderedCandidates.push(item);
        }
        if (b.R) {
          const item = {
            ...b.R,
            roomNumber: roomNum,
            benchNo,
            seatSide: 'Seat 2 (Right)',
            seatLabel: 'SEAT 2 (RIGHT)',
            benchTag: `Room ${roomNum} • Bench ${benchNo} (Right)`,
            rowPos: `Row ${r + 1}, Col ${c + 1}`,
            benchRow: r + 1,
            benchCol: c + 1,
            sideType: 'R'
          };
          roomCards.push(item);
          benchOrderedCandidates.push(item);
        }
      }
    }

    rooms.push({
      roomNumber: roomNum,
      studentCount: students.length,
      rollRange: `${chunk[0].rollNumber} to ${chunk[chunk.length - 1].rollNumber}`,
      grid,
      roomCards,
      success
    });
  }

  return { rooms, benchOrderedCandidates };
}
