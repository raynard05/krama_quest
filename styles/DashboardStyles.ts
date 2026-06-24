/**
 * DashboardStyles.ts
 * Semua definisi style untuk halaman DashboardMenu.
 * Edit file ini untuk mengubah tampilan halaman dashboard.
 */

import { StyleSheet, Platform } from 'react-native';
import { vw, vh, rs, scaleFont } from '../utils/responsive';

// ─── Design Tokens (Responsive per Page) ────────────────────────────────────
export const AVATAR_SIZE = rs(55, 60, 65);
export const CARD_IMG_SIZE = rs(75, 80, 85);
export const BANNER_H = rs(180, 200, 220);

export const GREETING_SIZE = scaleFont(rs(18, 20, 22));
export const USERNAME_SIZE = scaleFont(rs(24, 26, 28));
export const CARD_TITLE_SIZE = scaleFont(rs(14, 15, 16));

export const MODAL_HEADER_SIZE = scaleFont(rs(16, 17, 18));
export const PROFILE_NAME_SIZE = scaleFont(rs(20, 21, 22));
export const PROFILE_USER_SIZE = scaleFont(rs(13, 14, 15));

export const SPACING_SM = rs(6, 8, 10);
export const SPACING_MD = rs(12, 16, 20);
export const SPACING_LG = rs(20, 24, 28);

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
  scrollContent: {
    paddingHorizontal: vw(5),
    paddingTop: SPACING_MD,
    paddingBottom: vh(4),
  },

  // ─── Header ──────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING_MD,
    marginTop: rs(8, 12, 16),
  },
  headerLeft: {
    flex: 1,
  },
  greetingText: {
    fontSize: GREETING_SIZE,
    color: '#4B5563', // Slate-600
    fontFamily: 'Poppins-Medium',
  },
  userNameText: {
    fontSize: USERNAME_SIZE,
    color: '#0F172A', // Slate-900
    fontFamily: 'Poppins-Bold',
    marginTop: -2,
  },
  avatarButton: {
    marginLeft: 15,
  },
  avatarRing: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#45B6E8',
    padding: 3,
    // Soft shadow for avatar
    ...Platform.select({
      ios: {
        shadowColor: '#45B6E8',
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
    borderRadius: (AVATAR_SIZE - 10) / 2,
  },

  // ─── Mascot Banner ───────────────────────────────────────────────────────
  bannerContainer: {
    width: '100%',
    height: BANNER_H,
    position: 'relative',
    marginBottom: SPACING_LG,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#45B6E8',
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

  // ─── Grid Menu Cards ─────────────────────────────────────────────────────
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  cardWrapper: {
    width: '47%',
    marginBottom: SPACING_MD,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: vw(4),
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1.0,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    // Shadow template
    ...Platform.select({
      ios: {
        shadowColor: '#1E293B',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      default: {},
    }),
  },
  cardImage: {
    width: CARD_IMG_SIZE,
    height: CARD_IMG_SIZE,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: CARD_TITLE_SIZE,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },

  // ─── Theme Colors for Cards (Overhauled Premium Aesthetics) ──────────────
  materiCardTheme: {
    backgroundColor: '#EDF7FF',
    borderColor: '#BEE3FF',
    ...Platform.select({
      ios: { shadowColor: '#2b72b8', shadowOpacity: 0.15 },
      android: { elevation: 4 },
    }),
  },
  materiTextTheme: {
    color: '#104E8B',
  },
  dolananCardTheme: {
    backgroundColor: '#F0FFF4',
    borderColor: '#C2F0C2',
    ...Platform.select({
      ios: { shadowColor: '#4CAF50', shadowOpacity: 0.15 },
      android: { elevation: 4 },
    }),
  },
  dolananTextTheme: {
    color: '#1E5A22',
  },
  cptpCardTheme: {
    backgroundColor: '#FFF0F3',
    borderColor: '#FFC2D1',
    ...Platform.select({
      ios: { shadowColor: '#FF3366', shadowOpacity: 0.15 },
      android: { elevation: 4 },
    }),
  },
  cptpTextTheme: {
    color: '#8B002A',
  },
  evaluasiCardTheme: {
    backgroundColor: '#FFFDF0',
    borderColor: '#FFEAA7',
    ...Platform.select({
      ios: { shadowColor: '#FFB300', shadowOpacity: 0.15 },
      android: { elevation: 4 },
    }),
  },
  evaluasiTextTheme: {
    color: '#B8860B',
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

  // ─── Profile Modal Elements ──────────────────────────────────────────────
  profileDetailsCard: {
    alignItems: 'center',
    backgroundColor: '#F8FAFC', // Slate-50
    borderRadius: 20,
    padding: SPACING_MD,
    marginBottom: SPACING_MD,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  largeAvatar: {
    width: rs(80, 85, 90),
    height: rs(80, 85, 90),
    borderRadius: rs(40, 42.5, 45),
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#45B6E8',
  },
  profileName: {
    fontSize: PROFILE_NAME_SIZE,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
  },
  profileUsername: {
    fontSize: PROFILE_USER_SIZE,
    color: '#64748B', // Slate-500
    fontFamily: 'Poppins-Regular',
    marginBottom: 12,
  },
  divider: {
    width: '100%',
    height: 1.5,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: scaleFont(rs(13, 14, 15)),
    color: '#64748B',
    fontFamily: 'Poppins-Medium',
  },
  infoValue: {
    fontSize: scaleFont(rs(14, 15, 16)),
    color: '#0F172A',
    fontFamily: 'Poppins-SemiBold',
  },
  logoutButton: {
    backgroundColor: '#EF4444', // Sleek red
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: rs(20, 20, 24), // Capsule pill shape
    paddingVertical: 14,
    marginTop: 8,
  },
  logoutText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
    fontSize: scaleFont(rs(14, 15, 16)),
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
});

export default DashboardStyles;
