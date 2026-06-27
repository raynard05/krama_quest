import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  cardWrapper: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  cardContainer: {
    overflow: 'visible',
  },

  // Mode Tabs (Lokal/Online)
  tabContainer: {
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
    height: 65,
    marginBottom: -6,
    paddingHorizontal: 0,
  },
  tabButtonWrapper: {
    flex: 1,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonLeft: {
    borderTopLeftRadius: 24,
    borderTopEndRadius: 40,
  },
  tabButtonRight: {
    borderTopRightRadius: 24,
    borderTopStartRadius: 40,
  },

  tabButtonLokal: {
    backgroundColor: '#FFFFFF',
  },
  tabButtonOnline: {
    backgroundColor: '#2976BF',
  },

  tabInactiveLeft: {
    marginRight: 15,
  },
  tabInactiveRight: {
    marginLeft: 15,
  },

  tabTextLokal: {
    fontSize: 19,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
  },
  tabTextOnline: {
    fontSize: 19,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },

  // Content Section
  contentSection: {
    padding: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'visible',
  },

  // Player Tabs
  playerTabContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  playerTab: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  playerTabActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#2976BF',
  },
  playerTabOnlineMode: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  playerTabText: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    color: '#6B7280',
  },
  playerTabTextActive: {
    color: '#2976BF',
  },
  playerTabTextActiveOnline: {
    color: '#FFFFFF',
  },

  // Player Content
  playerContent: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
    marginBottom: -35,
    textAlign: 'center',
  },

  textWhite: {
    color: '#FFFFFF',
  },

  // Gaco Selector
  gacoSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  gacoCarousel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    minWidth: 280,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  gacoArrow: {
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  gacoArrowOnline: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  gacoArrowDisabled: {
    opacity: 0.3,
  },

  // Side Gacos (Previous/Next) - Smaller and behind
  gacoDisplaySide: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 120,
  },
  gacoImageSide: {
    width: 50,
    height: 90,
  },

  gacoDisplayCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 140,
    paddingVertical: 20,
    paddingHorizontal: 30,
    zIndex: 2,

  },
  gacoImageCenter: {
    width: 80,
    height: 140,
  },
  gacoImageWrapper: {
    padding: 8,
    borderWidth: 3,
    borderColor: 'transparent',
    borderRadius: 20,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gacoImageWrapperTaken: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
   
  },
  gacoImageTaken: {
    opacity: 0.4,
  },
  gacoName: {
    fontSize: 19,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
  },
  swipeGif: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    width: 90,
    height: 90,
    transform: [{ rotate: '0deg' }],
  },
  gacoTaken: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderColor: '#EF4444',
  },
  gacoTakenText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    color: '#EF4444',
    marginTop: 4,
  },

  // Opponent Type Selection
  opponentTypeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  opponentTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 5,
    paddingHorizontal: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  opponentTypeButtonActive: {
    backgroundColor: '#2976BF',
    borderColor: '#1E5A8E',
  },
  opponentTypeText: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    color: '#6B7280',
  },
  opponentTypeTextActive: {
    color: '#FFFFFF',
  },

  // Player Selection
  playerSelectionSection: {
    marginBottom: 24,
  },
  combobox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  comboboxText: {
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
    color: '#1F2937',
    flex: 1,
  },
  dropdown: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemText: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  dropdownItemSubtext: {
    fontSize: 13,
    fontWeight: '400',
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
  },

  // Gaco Section
  gacoSection: {
    marginTop: 12,
  },

  // Online Room Section
  onlineRoomSection: {
    marginTop: 24,
  },
  onlineContentWrapper: {
    width: '100%',
  },
  onlineRoomButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  onlineRoomButtonActive: {
    backgroundColor: '#FFFFFF',
  },
  onlineRoomTextActive: {
    color: '#2976BF',
  },

  // Room Form Section
  roomFormSection: {
    marginTop: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
    marginTop: 12,
  },
  formInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: '#1F2937',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  formInputOnline: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    color: '#1F2937',
  },

  // Gaco Confirm/Cancel Buttons
  gacoButtonContainer: {
    marginTop: 16,
    paddingHorizontal: 20,
  },
  gacoButtonRow: {
    flexDirection: 'row',
    gap: 12,
        marginTop:-60,
  },
  confirmButton: {
    backgroundColor: '#2976BF',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -60,

  },
  confirmButtonOnline: {
    backgroundColor: '#FFFFFF',
  },
  confirmButtonDisabled: {
    backgroundColor: '#D1D5DB',
    opacity: 0.5,
  },
  confirmButtonText: {

    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  confirmButtonTextOnline: {

    color: '#2976BF',
  },
  confirmedButton: {

    flex: 1,
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmedButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },

  // Start Button
  startButton: {
    backgroundColor: '#000000',
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,

  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
  },
});
