/**
 * Admin Panel Premium Light Theme Design Tokens & Utilities
 * Modern, clean, enterprise-grade light theme for NIICT Admin
 */

export const adminTheme = {
  // Page Background & Gradients
  bg: '#F8FAFC', // Slate 50
  glowTop: 'radial-gradient(circle, rgba(37, 99, 235, 0.05) 0%, rgba(248, 250, 252, 0) 70%)',
  glowBottom: 'radial-gradient(circle, rgba(99, 102, 241, 0.04) 0%, rgba(248, 250, 252, 0) 70%)',

  // Surface & Cards
  cardBg: '#FFFFFF',
  cardBorder: '1px solid #E2E8F0',
  cardShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.02)',
  cardHoverShadow: '0 12px 28px -4px rgba(15, 23, 42, 0.08), 0 4px 10px -2px rgba(15, 23, 42, 0.03)',

  // Typography Colors
  textPrimary: '#0F172A',   // Slate 900
  textSecondary: '#334155', // Slate 700
  textMuted: '#64748B',     // Slate 500
  textLight: '#94A3B8',     // Slate 400
  
  // Brand Accents
  primary: '#2563EB',       // Blue 600
  primaryHover: '#1D4ED8',  // Blue 700
  primaryLight: '#EFF6FF',  // Blue 50
  primaryBorder: '#BFDBFE', // Blue 200

  // Semantic Status Tints
  success: {
    bg: '#ECFDF5',
    text: '#059669',
    border: '#A7F3D0',
    hover: '#D1FAE5',
  },
  warning: {
    bg: '#FFFBEB',
    text: '#D97706',
    border: '#FDE68A',
    hover: '#FEF3C7',
  },
  danger: {
    bg: '#FEF2F2',
    text: '#DC2626',
    border: '#FECACA',
    hover: '#FEE2E2',
  },
  info: {
    bg: '#F0F9FF',
    text: '#0284C7',
    border: '#BAE6FD',
    hover: '#E0F2FE',
  },

  // Table Styles
  tableHeadBg: '#F8FAFC',
  tableHeadText: '#475569',
  tableRowBorder: '1px solid #F1F5F9',
  tableRowHover: '#F8FAFC',
  tableCellText: '#1E293B',

  // MUI TextField / Select Standard Sx
  inputSx: {
    input: { color: '#0F172A' },
    label: { color: '#64748B' },
    '& label.Mui-focused': { color: '#2563EB', fontWeight: 600 },
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#FFFFFF',
      '& fieldset': { borderColor: '#CBD5E1' },
      '&:hover fieldset': { borderColor: '#94A3B8' },
      '&.Mui-focused fieldset': {
        borderColor: '#2563EB',
        borderWidth: '2px',
        boxShadow: '0 0 0 4px rgba(37, 99, 235, 0.1)'
      },
    },
    '& .MuiInputBase-inputMultiline': { color: '#0F172A' },
    '& .MuiSelect-select': { color: '#0F172A' },
    '& .MuiFormHelperText-root': { color: '#64748B' }
  }
};

export default adminTheme;
