import { StyleSheet, Platform } from 'react-native';
import { rs, scaleFont } from '../../utils/responsive';

const MateriRoadmapStyles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    marginVertical: 20,
  },
  svgBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  roadmapRow: {
    height: 140,
    width: '100%',
    flexDirection: 'row',
    zIndex: 2,
  },
  circleColumn: {
    width: '44%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColumn: {
    width: '56%',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  nodeCircle: {
    width: rs(64, 68, 72),
    height: rs(64, 68, 72),
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
      default: {},
    }),
  },
  circleNumber: {
    color: '#FFFFFF',
    fontSize: scaleFont(rs(24, 26, 28)),
    fontFamily: 'Poppins-Bold',
  },
  titleBadge: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
      default: {},
    }),
  },
  titleBadgeText: {
    color: '#1E293B',
    fontSize: scaleFont(rs(10, 11, 11)),
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
  descriptionText: {
    color: '#FFFFFF',
    fontSize: scaleFont(rs(11, 12, 12)),
    fontFamily: 'Poppins-Medium',
    lineHeight: scaleFont(rs(15, 17, 18)),
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 3,
  },
});

export default MateriRoadmapStyles;
