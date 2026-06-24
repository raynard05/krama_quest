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
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },

  // Glassmorphic Themes
  materiCardTheme: {
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderColor: 'rgba(255, 255, 255, 0.54)',
    ...Platform.select({
      ios: { shadowColor: '#ffffff', shadowOpacity: 0.1 },
      android: { elevation: 2 },
    }),
  },
  materiTextTheme: {
    color: '#FFFFFF',
  },
  dolananCardTheme: {
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderColor: 'rgba(255, 255, 255, 0.54)',
    ...Platform.select({
      ios: { shadowColor: '#ffffff', shadowOpacity: 0.1 },
      android: { elevation: 2 },
    }),
  },
  dolananTextTheme: {
    color: '#FFFFFF',
  },
  cptpCardTheme: {
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderColor: 'rgba(255, 255, 255, 0.54)',
    ...Platform.select({
      ios: { shadowColor: '#ffffff', shadowOpacity: 0.1 },
      android: { elevation: 2 },
    }),
  },
  cptpTextTheme: {
    color: '#FFFFFF',
  },
  evaluasiCardTheme: {
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderColor: 'rgba(255, 255, 255, 0.54)',
    ...Platform.select({
      ios: { shadowColor: '#ffffff', shadowOpacity: 0.1 },
      android: { elevation: 2 },
    }),
  },
  evaluasiTextTheme: {
    color: '#FFFFFF',
  },
});

export default DashboardMenuCardStyles;
