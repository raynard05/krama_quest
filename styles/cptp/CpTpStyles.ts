import { StyleSheet, Platform } from 'react-native';
import { vw, vh, rs, scaleFont } from '../../utils/responsive';

// City background & dimensions
export const CITY_IMG_W = vw(120);
export const CITY_LEFT_BLEED = vw(-10);
export const CITY_IMG_H = CITY_IMG_W * 0.74757; // 4:3 Aspect Ratio (412x308) to prevent distortion
export const BOTTOM_H = CITY_IMG_H;

const CpTpStyles = StyleSheet.create({
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
    transform: [{ scale: 1 }],
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: vh(5),
    paddingHorizontal: vw(4),
    width: '100%',
    marginBottom: vh(1),
  },
  backButton: {
    padding: rs(8, 10, 12),
    borderRadius: rs(10, 12, 14),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: scaleFont(rs(17, 17, 17)),
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    lineHeight: scaleFont(rs(24, 26, 28)),
  },
  headerPlaceholder: {
    width: rs(36, 40, 44),
    height: rs(36, 40, 44),
  },
  contentBody: {
    flex: 1,
    paddingHorizontal: vw(5),
    paddingTop: vh(1),
  },

  // ─── Tabs Segmented Control ────────────────────────────────────────────────
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 4,
    marginBottom: vh(2.5),
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  tabButtonActive: {
    backgroundColor: '#1E6FE3', // Active tab color matching mock
    ...Platform.select({
      ios: {
        shadowColor: '#1E6FE3',
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
  tabText: {
    fontSize: scaleFont(rs(11, 12, 13)),
    fontFamily: 'Poppins-Medium',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
  },

  // ─── Dropdown ─────────────────────────────────────────────────────────────
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: vh(2.5),
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      default: {},
    }),
  },
  dropdownText: {
    fontSize: scaleFont(rs(13, 14, 14)),
    fontFamily: 'Poppins-Bold',
    color: '#1E293B',
  },

  // ─── Accordion Card ────────────────────────────────────────────────────────
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: vh(3),
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
      default: {},
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
  },
  cardHeaderActive: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: scaleFont(rs(12, 13, 14)),
    fontFamily: 'Poppins-Bold',
    color: '#1E293B',
    flex: 1,
    paddingRight: 8,
  },
  cardContent: {
    marginTop: 2,
  },
  paragraph: {
    fontSize: scaleFont(rs(11, 12, 12)),
    color: '#334155',
    fontFamily: 'Poppins-Regular',
    lineHeight: scaleFont(rs(16, 18, 18)),
    marginBottom: 12,
  },
  subHeading: {
    fontSize: scaleFont(rs(11, 12, 12)),
    fontFamily: 'Poppins-Bold',
    color: '#1E293B',
    marginTop: 6,
    marginBottom: 8,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingLeft: 4,
  },
  bulletChar: {
    color: '#334155',
    fontSize: scaleFont(rs(12, 13, 13)),
    marginRight: 6,
    lineHeight: scaleFont(rs(16, 18, 18)),
  },
  bulletText: {
    flex: 1,
    fontSize: scaleFont(rs(10, 11, 11)),
    color: '#475569',
    fontFamily: 'Poppins-Medium',
    lineHeight: scaleFont(rs(14, 16, 16)),
  },

  // ─── Bottom Monument ───────────────────────────────────────────────────────
  bottomSection: {
    width: '100%',
    height: BOTTOM_H,
    position: 'relative',
    overflow: 'hidden',
    marginTop: vh(4),
  },
  cityImg: {
    position: 'absolute',
    bottom: 0,
    left: CITY_LEFT_BLEED,
    width: CITY_IMG_W,
    height: CITY_IMG_H,
  },
});

export default CpTpStyles;
