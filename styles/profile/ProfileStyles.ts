import { StyleSheet, Platform } from 'react-native';
import { vw, vh, rs, scaleFont } from '../../utils/responsive';

export const ProfileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A12',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundImageStyle: {
    transform: [{ scale: 1.15 }],
  },
  scrollContent: {
    paddingHorizontal: vw(5),
    paddingBottom: vh(5),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: vh(2),
    width: '100%',
    marginBottom: vh(1),
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: scaleFont(rs(18, 20, 22)),
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
  headerPlaceholder: {
    width: rs(36, 40, 44),
    height: rs(36, 40, 44),
  },
  profileInfoSection: {
    alignItems: 'center',
    marginVertical: vh(2),
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: vh(2),
  },
  avatarRing: {
    width: rs(110, 120, 130),
    height: rs(110, 120, 130),
    borderRadius: rs(55, 60, 65),
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    // NOTE: No overflow:'hidden' here — on Android it conflicts with elevation
    // and causes child images to not render at all.
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
      default: {},
    }),
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: rs(55, 60, 65), // Clip the image directly, safe on Android
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  editBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: rs(32, 34, 36),
    height: rs(32, 34, 36),
    borderRadius: rs(16, 17, 18),
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      default: {},
    }),
  },
  userNameText: {
    color: '#FFFFFF',
    fontSize: scaleFont(rs(20, 22, 24)),
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  userSubtitleText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: scaleFont(rs(13, 14, 15)),
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    marginTop: 2,
  },
  // ─── Stats Card Unified ──────────────────────────────────────────────────
  statsCardUnified: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: rs(20, 22, 24),
    paddingVertical: vh(2.2),
    marginVertical: vh(2),
    width: '100%',
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: vw(1),
  },
  statDivider: {
    width: 1.2,
    height: '60%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  statIcon: {
    width: rs(32, 36, 40),
    height: rs(32, 36, 40),
    marginBottom: vh(0.6),
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: scaleFont(rs(15, 17, 19)),
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: scaleFont(rs(9, 10, 11)),
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginTop: 1,
  },

  // ─── Options Card Unified ────────────────────────────────────────────────
  optionsCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: rs(20, 22, 24),
    paddingVertical: vh(1),
    marginTop: vh(1),
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: vh(1.8),
    paddingHorizontal: vw(5),
  },
  optionRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listIconWrapper: {
    width: 36,
    height: 36,
    minWidth: 36,
    maxWidth: 36,
    minHeight: 36,
    maxHeight: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 242, 254, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: vw(4),
  },
  optionRowText: {
    color: '#FFFFFF',
    fontSize: scaleFont(rs(14, 15, 16)),
    fontFamily: 'Poppins-SemiBold',
  },
  optionDivider: {
    height: 1.2,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginHorizontal: vw(5),
  },
});
