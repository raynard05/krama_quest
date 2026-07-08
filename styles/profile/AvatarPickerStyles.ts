import { StyleSheet, Platform } from 'react-native';
import { vw, vh, rs, scaleFont } from '../../utils/responsive';

export const AvatarPickerStyles = StyleSheet.create({
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
    paddingBottom: vh(15), // Leaves room for the bottom "Selesai" button
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
  previewSection: {
    alignItems: 'center',
    marginVertical: vh(1.5),
  },
  avatarRing: {
    width: rs(100, 110, 120),
    height: rs(100, 110, 120),
    borderRadius: rs(50, 55, 60),
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    // No overflow:'hidden' - conflicts with elevation on Android
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: rs(50, 55, 60),
  },
  editBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: rs(28, 30, 32),
    height: rs(28, 30, 32),
    borderRadius: rs(14, 15, 16),
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: vh(2),
  },
  gridItemWrapper: {
    width: '31%', // 3 columns
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vh(2),
  },
  gridItemCircle: {
    width: '90%',
    height: '90%',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  gridItemCircleSelected: {
    borderColor: '#00F2FE',
    borderWidth: 3.5,
    backgroundColor: 'rgba(0, 242, 254, 0.1)',
    ...Platform.select({
      ios: {
        shadowColor: '#00F2FE',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
      default: {},
    }),
  },
  gridImage: {
    width: '90%',
    height: '90%',
    borderRadius: 999,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: vw(5),
    paddingVertical: vh(2.5),
    backgroundColor: 'transparent',
  },
  selesaiButton: {
    width: '100%',
    paddingVertical: vh(2),
    borderRadius: rs(15, 18, 20),
    backgroundColor: '#1E6FE3', // Blue color matching mockup button
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    ...Platform.select({
      ios: {
        shadowColor: '#1E6FE3',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
      default: {},
    }),
  },
  selesaiButtonText: {
    color: '#FFFFFF',
    fontSize: scaleFont(rs(14, 15, 16)),
    fontFamily: 'Poppins-Bold',
    letterSpacing: 1.2,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: rs(25, 25, 28),
    padding: 4,
    marginVertical: vh(1.5),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    width: '100%',
  },
  tabButton: {
    flex: 1,
    paddingVertical: vh(1.2),
    borderRadius: rs(20, 20, 24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#00F2FE',
  },
  tabText: {
    fontFamily: 'Poppins-Bold',
    fontSize: scaleFont(rs(12, 13, 14)),
    color: 'rgba(255, 255, 255, 0.6)',
  },
  tabTextActive: {
    color: '#0E101D',
  },
});
