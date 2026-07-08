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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: rs(20, 22, 24),
    padding: rs(12, 14, 16),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vh(2),
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
  mascotImage: {
    width: rs(70, 80, 90),
    height: rs(70, 80, 90),
    borderRadius: rs(12, 14, 16),
    backgroundColor: '#F1F5F9',
    marginRight: vw(3.5),
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  materialTitle: {
    color: '#0F172A',
    fontSize: scaleFont(rs(13, 14, 15)),
    fontFamily: 'Poppins-Bold',
  },
  dateText: {
    color: '#64748B',
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
    color: '#0F172A',
    fontSize: scaleFont(rs(11, 12, 13)),
    fontFamily: 'Poppins-Bold',
  },
  chevronButton: {
    padding: rs(4, 6, 8),
  },
});
