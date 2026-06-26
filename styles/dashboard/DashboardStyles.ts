/**
 * DashboardStyles.ts
 * Semua definisi style untuk halaman DashboardMenu.
 * Edit file ini untuk mengubah tampilan halaman dashboard.
 */

import { StyleSheet, Platform } from 'react-native';
import { vw, vh, rs, scaleFont } from '../../utils/responsive';

// ─── Design Tokens (Responsive per Page) ────────────────────────────────────
export const AVATAR_SIZE = rs(80, 90, 100);
export const BANNER_H = rs(180, 200, 220);

export const GREETING_SIZE = scaleFont(rs(16, 18, 20));
export const USERNAME_SIZE = scaleFont(rs(20, 22, 24));

export const MODAL_HEADER_SIZE = scaleFont(rs(16, 17, 18));

export const SPACING_SM = rs(6, 8, 10);
export const SPACING_MD = rs(12, 30, 40);
export const SPACING_LG = rs(20, 30, 40);

const DashboardStyles = StyleSheet.create({
  // ─── Container & Scroll ──────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundImageStyle: {
    transform: [{ scale: 1 }],
  },
  scrollContent: {
    paddingHorizontal: 0,
    paddingTop: vh(5),
    paddingBottom: vh(5),

  },

  // ─── Header ──────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'transparent', // Transparent to show SVG split-color background

    paddingHorizontal: vw(5),
    paddingVertical: vh(2.2),
    marginBottom: SPACING_LG,
    ...Platform.select({
      ios: {
        shadowColor: '#00F2FE',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
      default: {},
    }),
  },
  headerLeft: {
    flex: 1,
  },
  greetingText: {
    fontSize: GREETING_SIZE,
    color: '#ffffff',
    fontFamily: 'Poppins-Medium',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    opacity: 0.8,
  },
  userNameText: {
    alignSelf: 'flex-start', // Wraps container tightly around text
    backgroundColor: 'rgba(15, 23, 42, 0.8)', // Translucent dark card base
    paddingHorizontal: 14,
    paddingVertical: 4,
    fontSize: USERNAME_SIZE,
    color: '#00F2FE', // Neon cyan text color
    fontFamily: 'Poppins-Bold',
    marginTop: 6,
    borderWidth: 1.5,
    borderRadius: 10,
    borderColor: '#00F2FE', // Neon cyan border frame
    textShadowColor: 'rgba(0, 242, 254, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6, // Neon glowing text effect
    // Soft shadow for premium floating tag feel
    ...Platform.select({
      ios: {
        shadowColor: '#00F2FE',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 4,
      },
      default: {},
    }),
  },
  avatarButton: {
    marginLeft: 15,
  },
  avatarRing: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    padding: 3,
    // Soft shadow for avatar
    ...Platform.select({
      ios: {
        shadowColor: '#ffffff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
      default: {},
    }),
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
  },

  // ─── Mascot Banner ───────────────────────────────────────────────────────
  bannerContainer: {
    width: vw(90),
    alignSelf: 'center',
    height: BANNER_H,
    position: 'relative',
    marginBottom: SPACING_LG,
    overflow: 'hidden',
    borderRadius: 20, // Clean rounded card frame matching layout
    // Premium shadow for banner
    ...Platform.select({
      ios: {
        shadowColor: '#1E293B',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
      default: {},
    }),
  },
  bannerMain: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },

  // ─── Grid Menu Cards Container ───────────────────────────────────────────
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: vw(5),
  },

  // ─── Modals ──────────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)', // Sleek modern overlay color
    justifyContent: 'center',
    alignItems: 'center',
    padding: vw(5),
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: SPACING_LG,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
      },
      android: {
        elevation: 8,
      },
      default: {},
    }),
    alignItems: 'stretch',
  },
  largeModalContent: {
    width: '95%',
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING_MD,
    borderBottomWidth: 1.5,
    borderBottomColor: '#F1F5F9',
    paddingBottom: SPACING_SM,
  },
  modalHeaderText: {
    fontSize: MODAL_HEADER_SIZE,
    fontFamily: 'Poppins-Bold',
    color: '#1E293B', // Slate-800
  },
  closeButton: {
    padding: 4,
  },

  // ─── Scrollable Modal Content ───────────────────────────────────────────
  modalScroll: {
    paddingBottom: SPACING_MD,
  },
  materiIntro: {
    fontSize: scaleFont(rs(13, 14, 14)),
    color: '#334155',
    fontFamily: 'Poppins-Medium',
    lineHeight: scaleFont(rs(18, 20, 20)),
    marginBottom: 16,
    textAlign: 'center',
  },
  materiCard: {
    backgroundColor: '#F8FAFC',
    borderLeftWidth: 5,
    borderRadius: 14,
    padding: SPACING_MD,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  materiTitle: {
    fontSize: scaleFont(rs(14, 15, 16)),
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    marginBottom: 6,
  },
  materiDesc: {
    fontSize: scaleFont(rs(12, 13, 13)),
    fontFamily: 'Poppins-Regular',
    color: '#334155',
    lineHeight: scaleFont(rs(16, 18, 18)),
    marginBottom: 10,
  },
  exampleBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  exampleLabel: {
    fontSize: scaleFont(rs(10, 11, 11)),
    fontFamily: 'Poppins-Bold',
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  exampleText: {
    fontSize: scaleFont(rs(12, 13, 13)),
    fontFamily: 'Poppins-SemiBold',
    color: '#0F172A',
    fontStyle: 'italic',
  },

  // ─── CP / TP Modal ───────────────────────────────────────────────────────
  cptpSection: {
    marginBottom: 20,
  },
  cptpHeader: {
    fontSize: scaleFont(rs(14, 15, 16)),
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
    marginBottom: 12,
  },
  cptpCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: SPACING_MD,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  cptpText: {
    fontSize: scaleFont(rs(13, 14, 14)),
    fontFamily: 'Poppins-Medium',
    color: '#334155',
    lineHeight: scaleFont(rs(20, 22, 22)),
  },
  tpRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  tpNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF3366',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  tpNumText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: 'Poppins-Bold',
  },
  tpText: {
    flex: 1,
    fontSize: scaleFont(rs(12, 13, 13)),
    fontFamily: 'Poppins-Medium',
    color: '#0F172A',
    lineHeight: scaleFont(rs(16, 18, 18)),
  },

  // ─── Evaluasi Modal ──────────────────────────────────────────────────────
  statsPanel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  statNum: {
    fontSize: scaleFont(rs(20, 22, 22)),
    fontFamily: 'Poppins-Bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: scaleFont(rs(10, 11, 11)),
    fontFamily: 'Poppins-Medium',
    color: '#64748B',
    marginTop: 2,
  },
  quizList: {
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    padding: 10,
  },
  quizItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  quizInfo: {
    flex: 1,
    paddingRight: 10,
  },
  quizTitle: {
    fontSize: scaleFont(rs(13, 14, 14)),
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
  },
  quizDate: {
    fontSize: scaleFont(rs(10, 11, 11)),
    fontFamily: 'Poppins-Regular',
    color: '#64748B',
    marginTop: 2,
  },
  scoreBadge: {
    width: 44,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreGreen: {
    backgroundColor: '#E3FCEF',
  },
  scoreYellow: {
    backgroundColor: '#FFF9DB',
  },
  scoreText: {
    fontSize: scaleFont(rs(13, 14, 14)),
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
  },
  quizStartBtn: {
    backgroundColor: '#007AFF',
    borderRadius: rs(8, 8, 10),
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  quizStartBtnText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
    fontSize: scaleFont(rs(11, 12, 12)),
  },
  badgeContainer: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: rs(30, 34, 38),
    height: rs(30, 34, 38),
    borderRadius: 999,
    backgroundColor: '#0F172A', // Deep dark slate background
    borderWidth: 2,
    borderColor: '#00F2FE', // Neon cyan border
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#00F2FE',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
      default: {},
    }),
  },
  badgeText: {
    fontSize: scaleFont(rs(15, 17, 19)),
    textAlign: 'center',
    lineHeight: scaleFont(rs(16, 18, 20)),
  },
});

export default DashboardStyles;
