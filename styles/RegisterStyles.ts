/**
 * RegisterStyles.ts
 * Semua definisi style untuk halaman RegisterScreen.
 * Edit file ini untuk mengubah tampilan halaman register.
 */

import { StyleSheet, Platform } from 'react-native';
import { vw, vh, rs, scaleFont } from '../utils/responsive';

// ─── Design Tokens (Responsive per Page) ────────────────────────────────────
export const LOGO_W = rs(40, 250, 260);
export const LOGO_H = rs(85, 85, 60);

export const HEADING_SIZE = scaleFont(rs(21, 23, 25));
export const SUBHEADING_SIZE = scaleFont(rs(12, 13, 14));

export const LABEL_SIZE = scaleFont(rs(12, 13, 14));
export const INPUT_H = rs(38, 44, 48);
export const INPUT_FONT = scaleFont(rs(12, 13, 14));
export const EYE_SIZE = rs(16, 18, 20);

export const BTN_H = rs(38, 44, 48);
export const BTN_FONT = scaleFont(rs(13, 14, 15));
export const LINK_FONT = scaleFont(rs(12, 13, 14));

// City background & dimensions
export const CITY_IMG_W = vw(120);
export const CITY_LEFT_BLEED = vw(-10);
export const CITY_IMG_H = CITY_IMG_W * 0.74757; // 4:3 Aspect Ratio (412x308) to prevent distortion
export const BOTTOM_H = CITY_IMG_H;

// Screen structure & paddings
export const CARD_H_PAD = vw(6);
export const SCROLL_PT = rs(vh(1), vh(2), vh(3));
export const CARD_PT = rs(vh(1), vh(1.5), vh(2));

export const SPACING_SM = rs(4, 6, 8);
export const SPACING_MD = rs(8, 12, 16);

const RegisterStyles = StyleSheet.create({
  // ─── Root & Scroll ─────────────────────────────────────────────────────────
  root: {
    flex: 1,
    backgroundColor: '#E6F4FE',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingTop: SCROLL_PT,
  },

  // ─── Card (form container) ──────────────────────────────────────────────────
  card: {
    marginHorizontal: CARD_H_PAD,
    paddingHorizontal: CARD_H_PAD,
    paddingTop: CARD_PT,
    paddingBottom: SPACING_MD,
  },

  // ─── Logo ───────────────────────────────────────────────────────────────────
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING_MD,
    gap: 12,
  },
  logoIcon: {
    width: rs(45, 50, 55),
    height: rs(45, 50, 55),
  },
  logoText: {
    fontFamily: 'Poppins-Bold',
    fontSize: scaleFont(rs(24, 26, 28)),
    color: '#2b72b8',
    letterSpacing: 0.5,
  },

  // ─── Heading & Sub-heading ──────────────────────────────────────────────────
  heading: {
    fontFamily: 'Poppins-ExtraBold',
    fontSize: HEADING_SIZE,
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.2,
    marginBottom: SPACING_SM,
  },
  subheading: {
    fontFamily: 'Poppins-Regular',
    fontSize: SUBHEADING_SIZE,
    color: '#E2E8F0',
    textAlign: 'center',
    lineHeight: SUBHEADING_SIZE * 1.55,
    marginBottom: SPACING_MD,
  },

  // ─── Error message ──────────────────────────────────────────────────────────
  errorText: {
    fontFamily: 'Poppins-Medium',
    fontSize: rs(10, 11, 12),
    color: '#D94040',
    textAlign: 'center',
    marginBottom: SPACING_MD,
    backgroundColor: '#FFF0F0',
    borderRadius: 8,
    paddingVertical: SPACING_SM,
    paddingHorizontal: vw(3),
  },

  // ─── Form label ─────────────────────────────────────────────────────────────
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: LABEL_SIZE,
    color: '#FFFFFF',
    marginBottom: SPACING_SM,
    // Lebih rapat di layar kecil supaya 5 field muat
    marginTop: rs(vh(0.2), vh(0.3), vh(0.4)),
  },

  // ─── Input field ────────────────────────────────────────────────────────────
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: rs(8, 8, 10),
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    // Jarak antar field lebih rapat di layar kecil
    marginBottom: rs(vh(1.0), vh(1.4), vh(1.6)),
    paddingHorizontal: vw(3.5),
    height: INPUT_H,
  },
  inputWrapFocused: {
    borderColor: '#2b72b8',
  },
  input: {
    fontFamily: 'Poppins-Regular',
    flex: 1,
    fontSize: INPUT_FONT,
    color: '#09090B', // Shadcn slate-950
    height: '100%',
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
      default: {},
    }),
  } as any,
  eyeBtn: {
    paddingLeft: vw(2),
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ─── Primary button ─────────────────────────────────────────────────────────
  primaryBtn: {
    backgroundColor: '#1E1B1B',
    borderRadius: rs(20, 20, 24),
    height: BTN_H,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING_MD,
  },
  primaryBtnText: {
    fontFamily: 'Poppins-Medium',
    color: '#FAFAFA', // Shadcn slate-50
    fontSize: BTN_FONT,
    letterSpacing: 0.3,
  },

  // ─── Bottom section: link text + city illustration ──────────────────────────
  bottomSection: {
    width: '100%',
    marginTop: rs(-vh(6), -vh(4), -vh(5)),
    height: BOTTOM_H,
    position: 'relative',
    overflow: 'hidden',
  },
  // Link text — rendered on top of city image (JSX order matters)
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING_MD,
    paddingHorizontal: vw(4),
    zIndex: 2,
  },
  linkText: {
    fontFamily: 'Poppins-Regular',
    fontSize: LINK_FONT,
    color: '#FFFFFF',
  },
  linkAccent: {
    fontFamily: 'Poppins-Bold',
    fontSize: LINK_FONT,
    color: '#2b72b8',
    textDecorationLine: 'underline',
  },
  // City illustration — rendered behind link text
  cityImg: {
    position: 'absolute',
    bottom: 0,
    left: CITY_LEFT_BLEED,
    width: CITY_IMG_W,
    height: CITY_IMG_H,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default RegisterStyles;
