import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  cardWrapper: {
    marginHorizontal: 20,
    marginVertical: 10,
  
  },
  cardContainer: {
   
    overflow: 'hidden', // Prevent tabs from going outside
  },
  
  // Tab Switcher Styles with 3D Effect matching card colors
  tabContainer: {
    flexDirection: 'row',
  
    overflow: 'hidden',
    position: 'relative',
    height: 65,
    marginBottom:-6,
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
    borderTopEndRadius:40,
  },
  tabButtonRight: {
    borderTopRightRadius: 24,
    borderTopStartRadius: 40,
  },
  
  // Tab button colors matching card colors
  tabButtonPemantik: {
    backgroundColor: '#FFFFFF',
    
  },
  tabButtonDolanan: {
    backgroundColor: '#2976BF',
  },
  
  // Tab inactive margins
  tabInactiveLeft: {
    marginRight: 15,
  },
  tabInactiveRight: {
    marginLeft: 15,
  },
  
  // Tab text colors
  tabText: {
    fontSize: 19,
    fontWeight: '700',
   fontFamily: 'Poppins-Bold',
  },
  tabTextPemantik: {
    color: '#1F2937',
  },
  tabTextDolanan: {
    color: '#FFFFFF',
  },

  // Content Section Styles
  contentSection: {
    padding: 28,
    minHeight: 320,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  
  // Icon Styles
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    marginTop: 12,
  },
  
  contentTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 14,
    textAlign: 'center',
  },
  contentTitleWhite: {
    color: '#FFFFFF',
  },
  contentDescription: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 23,
    marginBottom: 28,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  contentDescriptionWhite: {
    color: '#F3F4F6',
  },

  // Button Styles
  startButton: {
    backgroundColor: '#000000',
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    shadowColor: '#000',
    borderWidth:1,
    borderColor: "#fff",
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
  },
});
