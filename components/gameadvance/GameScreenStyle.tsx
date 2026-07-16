import { StyleSheet } from 'react-native';
import { vw, vh } from '../../utils/responsive';



// City background & dimensions
export const CITY_IMG_W = vw(120);
export const CITY_LEFT_BLEED = vw(-10);
export const CITY_IMG_H = CITY_IMG_W * 0.74757; // 4:3 Aspect Ratio to prevent distortion
export const BOTTOM_H = CITY_IMG_H;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F4FE',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundImageStyle: {
    opacity: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: vw(5),
    paddingTop: vh(2),
    paddingBottom: vh(1.5),
    position: 'relative',
  },
  headerCenterContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    pointerEvents: 'none',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    flex: 1,
  },
  headerPlaceholder: {
    width: 40,
    height: 40,
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
    marginTop: -430, // Pull the section up
    zIndex: 1, // Layer 2 (draw behind the card component)
    elevation: 1,
  },
  cityImg: {
    position: "absolute",
    bottom: 0,
    left: CITY_LEFT_BLEED,
    width: CITY_IMG_W,
    height: CITY_IMG_H,
  },
  boardWrapper: {
    position: 'relative',
    width: vw(85),
    height: vh(65),
    alignSelf: 'center',
    marginTop: vh(3),
  },
  topScoreContainer: {
    position: 'absolute',
    top: -25,
    left: 43,
    zIndex: 10,
  },
  bottomScoreContainer: {
    position: 'absolute',
    bottom: -60,
    right: 40,
    zIndex: 10,
  },
  topDiceContainer: {
    position: 'absolute',
    top: -7,
    right: 46,
    zIndex: 5,
  },
  bottomDiceContainer: {
    position: 'absolute',
    bottom: -40,
    left: 45,
    zIndex: 5,
  },
  diceImage: {
    width: 45,
    height: 45,
  },

});

export default styles;
