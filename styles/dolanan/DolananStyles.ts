import { StyleSheet } from 'react-native';
import { vw, vh, rs, scaleFont } from '../../utils/responsive';

// City background & dimensions
export const CITY_IMG_W = vw(120);
export const CITY_LEFT_BLEED = vw(-10);
export const CITY_IMG_H = CITY_IMG_W * 0.74757; // 4:3 Aspect Ratio to prevent distortion
export const BOTTOM_H = CITY_IMG_H;

const DolananStyles = StyleSheet.create({
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
    paddingHorizontal: vw(5),
    paddingTop: vh(2),
    paddingBottom: vh(2),
    zIndex: 2, // Layer 3 (draw on top of the bridge illustration)
    elevation: 2,
  },
  bottomSection: {
    width: '100%',
    height: BOTTOM_H,
    position: 'relative',
    overflow: 'hidden',
    marginTop: -190, // Pull the section up
    zIndex: 1, // Layer 2 (draw behind the card component)
    elevation: 1,
  },
  cityImg: {
    position: 'absolute',
    bottom: 0, // Reset to 0 to prevent cropping at the top and empty space at the bottom
    left: CITY_LEFT_BLEED,
    width: CITY_IMG_W,
    height: CITY_IMG_H,
  },
});

export default DolananStyles;
