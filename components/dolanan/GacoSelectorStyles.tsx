import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
    marginBottom: 1,
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
    marginVertical: 10,
    paddingHorizontal: 10,
  
  },
  
  gacoCarousel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    minWidth: 280,
    paddingVertical: 10,
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
  
  // Center Gaco (Active) - Larger and in front
  gacoDisplayCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 140,
    paddingVertical: 20,
    paddingHorizontal: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#E5E7EB',
    zIndex: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  gacoImageCenter: {
    width: 80,
    height: 140,
    marginBottom: 8,
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
  
  gacoTaken: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: '#EF4444',
  },
  
  gacoTakenText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    color: '#EF4444',
    marginTop: 4,
  },

  // Gaco Confirm/Cancel Buttons
  gacoButtonContainer: {
    marginTop: 8,
    paddingHorizontal: 20,
  },
  
  gacoButtonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  
  confirmButton: {
    backgroundColor: '#2976BF',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
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
});
