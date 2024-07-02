import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  sortContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    padding: 5,
  },
  picker: {
    width: 150,
    color: 'white',
  },
  placeholderContainer: {
    backgroundColor: 'darkgray',
    borderRadius: 10,
    padding: 20,
    marginTop: 70,
    width: screenWidth * 0.95,
    height: screenHeight * 0.8,
    opacity: 0.8,
  },
  headerContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    marginBottom: 5,
  },
  iconHeaderPlaceholder: {
    width: 50,
    height: 20,
    marginRight: 10,
  },
  headerText: {
    flex: 3,
    fontWeight: 'bold',
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  characterContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    marginBottom: 5,
  },
  characterIcon: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  characterName: {
    flex: 3,
    fontWeight: 'bold',
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  characterRole: {
    flex: 3,
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  characterDate: {
    flex: 3,
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default styles;