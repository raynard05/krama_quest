import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundImageStyle: {
    opacity: 0.9,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 40,
    marginBottom: 20,
    zIndex: 10,
  },
  headerPlaceholder: {
    width: 40, // Same width as back button for centering
  },
  contentBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  bottomCity: {
  
    position: 'absolute',
    bottom: -20,
    width: '100%',
    height: 430,
    zIndex: 1, // Keep it above background but below setup card
  },
});
