import { StyleSheet, Platform } from 'react-native';
import { vw, rs, scaleFont } from '../../utils/responsive';

export const CARD_IMG_SIZE = rs(75, 80, 85);
export const CARD_TITLE_SIZE = scaleFont(rs(16, 16, 16));

const DashboardMenuCardStyles = StyleSheet.create({
  cardWrapper: {
    width: '47%',
    marginBottom: rs(12, 16, 20),
  },
  menuCard: {
    borderRadius: 24,
    paddingHorizontal: vw(4),
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1.0,
    borderWidth: 1.5,
    ...Platform.select({
      ios: {
        shadowColor: '#1E293B',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        // Removed harsh black shadow elevation
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
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 3,
  },

  // Glassmorphic Themes - Premium tinted frosted glass panels
  materiCardTheme: {
    backgroundColor: 'rgba(204, 251, 241, 0.22)', // Frosted teal glass
    borderColor: 'rgba(255, 255, 255, 0.5)', // Specular white glass border
    ...Platform.select({
      ios: { shadowColor: '#B45309', shadowOpacity: 0.15, shadowOffset: { width: 0, height: 4 }, shadowRadius: 6 },
      android: {},
    }),
  },
  materiTextTheme: {
    color: '#FFFFFF',
  },
  dolananCardTheme: {
    backgroundColor: 'rgba(204, 251, 241, 0.22)', // Frosted teal glass
    borderColor: 'rgba(255, 255, 255, 0.5)', // Specular white glass border
    ...Platform.select({
      ios: { shadowColor: '#0F766E', shadowOpacity: 0.15, shadowOffset: { width: 0, height: 4 }, shadowRadius: 6 },
      android: {},
    }),
  },
  dolananTextTheme: {
    color: '#FFFFFF',
  },
  cptpCardTheme: {
    backgroundColor: 'rgba(204, 251, 241, 0.22)', // Frosted teal glass
    borderColor: 'rgba(255, 255, 255, 0.5)', // Specular white glass border
    ...Platform.select({
      ios: { shadowColor: '#B91C1C', shadowOpacity: 0.15, shadowOffset: { width: 0, height: 4 }, shadowRadius: 6 },
      android: {},
    }),
  },
  cptpTextTheme: {
    color: '#FFFFFF',
  },
  evaluasiCardTheme: {
    backgroundColor: 'rgba(204, 251, 241, 0.22)', // Frosted teal glass
    borderColor: 'rgba(255, 255, 255, 0.5)', // Specular white glass border
    ...Platform.select({
      ios: { shadowColor: '#6D28D9', shadowOpacity: 0.15, shadowOffset: { width: 0, height: 4 }, shadowRadius: 6 },
      android: {},
    }),
  },
  evaluasiTextTheme: {
    color: '#FFFFFF',
  },
});

export default DashboardMenuCardStyles;
