import { StyleSheet, Platform } from 'react-native';
import { vw, vh, rs, scaleFont } from '../../utils/responsive';

export const HistoryStyles = StyleSheet.create({
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
    marginBottom: vh(2),
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: vh(10),
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    padding: vw(8),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  emptyText: {
    color: '#A0A0B0',
    fontSize: scaleFont(rs(14, 15, 16)),
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    marginTop: vh(2),
  },
  cardWrapper: {
    marginBottom: vh(2.5),
    position: 'relative',
  },
  card: {
    borderRadius: rs(20, 22, 24),
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: rs(14, 16, 18),
    paddingRight: rs(14, 16, 18),
    paddingLeft: rs(100, 110, 120),
    minHeight: rs(90, 110, 110),
    ...Platform.select({
      ios: {
        shadowColor: '#5C3D11',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
      default: {},
    }),
  },
  cardTextureImage: {
    borderRadius: rs(20, 22, 24),
  },
  mascotArea: {
    // spacer so text doesn't overlap with absolute character
  },
  mascotImage: {
    backgroundColor: "#C17F4F",
    borderRadius: 10,
    position: 'absolute',
    left: rs(-6, 12, 14),
    bottom: rs(-8,8, 5),
    width: rs(80, 90, 95),
    height: rs(80, 95, 110),
    zIndex: 10,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  materialTitle: {
    color: '#3B1E08',
    fontSize: scaleFont(rs(13, 14, 15)),
    fontFamily: 'Poppins-Bold',
  },
  dateText: {
    color: '#7C5227',
    fontSize: scaleFont(rs(10, 11, 12)),
    fontFamily: 'Poppins-Regular',
    marginTop: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vh(1.2),
  },
  statusText: {
    color: '#3B1E08',
    fontSize: scaleFont(rs(11, 12, 13)),
    fontFamily: 'Poppins-Bold',
  },
  chevronButton: {
    padding: rs(4, 6, 8),
  },
});
