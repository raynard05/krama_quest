import { StyleSheet, Platform } from 'react-native';
import { vw, rs, scaleFont } from '../../utils/responsive';

export const MODAL_HEADER_SIZE = scaleFont(rs(16, 17, 18));
export const PROFILE_NAME_SIZE = scaleFont(rs(20, 21, 22));
export const PROFILE_USER_SIZE = scaleFont(rs(13, 14, 15));

export const SPACING_SM = rs(6, 8, 10);
export const SPACING_MD = rs(12, 16, 20);
export const SPACING_LG = rs(20, 24, 28);

const DashboardProfileStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)', // Sleek modern overlay color
    justifyContent: 'center',
    alignItems: 'center',
    padding: vw(5),
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: SPACING_LG,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
      },
      android: {
        elevation: 8,
      },
      default: {},
    }),
    alignItems: 'stretch',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING_MD,
    borderBottomWidth: 1.5,
    borderBottomColor: '#F1F5F9',
    paddingBottom: SPACING_SM,
  },
  modalHeaderText: {
    fontSize: MODAL_HEADER_SIZE,
    fontFamily: 'Poppins-Bold',
    color: '#1E293B', // Slate-800
  },
  closeButton: {
    padding: 4,
  },
  profileDetailsCard: {
    alignItems: 'center',
    backgroundColor: '#F8FAFC', // Slate-50
    borderRadius: 20,
    padding: SPACING_MD,
    marginBottom: SPACING_MD,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  largeAvatar: {
    width: rs(180, 120, 120),
    height: rs(80, 120, 120),
    borderRadius: rs(40, 42.5, 45),
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#45B6E8',
  },
  profileName: {
    fontSize: PROFILE_NAME_SIZE,
    fontFamily: 'Poppins-Bold',
    color: '#0F172A',
  },
  profileUsername: {
    fontSize: PROFILE_USER_SIZE,
    color: '#64748B', // Slate-500
    fontFamily: 'Poppins-Regular',
    marginBottom: 12,
  },
  divider: {
    width: '100%',
    height: 1.5,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: scaleFont(rs(13, 14, 15)),
    color: '#64748B',
    fontFamily: 'Poppins-Medium',
  },
  infoValue: {
    fontSize: scaleFont(rs(14, 15, 16)),
    color: '#0F172A',
    fontFamily: 'Poppins-SemiBold',
  },
  logoutButton: {
    backgroundColor: '#EF4444', // Sleek red
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: rs(20, 20, 24), // Capsule pill shape
    paddingVertical: 14,
    marginTop: 8,
  },
  logoutText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
    fontSize: scaleFont(rs(14, 15, 16)),
  },
});

export default DashboardProfileStyles;
