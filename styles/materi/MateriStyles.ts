import { StyleSheet, Platform } from 'react-native';
import { vw, vh, rs, scaleFont } from '../../utils/responsive';

// City background & dimensions
export const CITY_IMG_W = vw(120);
export const CITY_LEFT_BLEED = vw(-10);
export const CITY_IMG_H = CITY_IMG_W * 0.74757; // 4:3 Aspect Ratio (412x308) to prevent distortion
export const BOTTOM_H = CITY_IMG_H;

const MateriStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A12', // Dark background matching profile screen
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
    paddingVertical: vh(4),
    paddingHorizontal: vw(5),
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
    fontSize: scaleFont(rs(18, 20, 22)),
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
  headerPlaceholder: {
    width: rs(36, 40, 44),
    height: rs(36, 40, 44),
  },
  contentBody: {
    flex: 1,
    paddingHorizontal: vw(5),
    paddingTop: vh(2),
    minHeight: vh(40), // Ensures space for future components
  },
  bottomSection: {
    width: '100%',
    height: BOTTOM_H,
    position: 'relative',
    overflow: 'hidden',
  },
  cityImg: {
    position: 'absolute',
    bottom: 0,
    left: CITY_LEFT_BLEED,
    width: CITY_IMG_W,
    height: CITY_IMG_H,
  },
});

export default MateriStyles;
