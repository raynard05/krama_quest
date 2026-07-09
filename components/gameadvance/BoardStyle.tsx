import { StyleSheet } from 'react-native';
import { vw, vh } from '../../utils/responsive';

const styles = StyleSheet.create({
  boardContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15

  },
  boardImage: {
    width: '70%',
    height: '100%',
    transform: [{ scale: 1.15 }],
  },
});

export default styles;
