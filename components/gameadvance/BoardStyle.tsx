import { StyleSheet } from 'react-native';
import { vw, vh } from '../../utils/responsive';

const styles = StyleSheet.create({
  boardContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
   
  },
  boardImage: {
    marginTop:-120 ,
    width: vw(90),
    height: vw(209),
    maxWidth: 600,
    maxHeight: 600,
  },
});

export default styles;
