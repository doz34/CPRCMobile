import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  headerContainer: {
    marginBottom: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  descriptionTitleText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  contentContainer: {
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 18,
    color: '#fff',
  },
  continueButton: {
    padding: 15,
    backgroundColor: '#007bff',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
  },
  roleButton: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#6a5acd',
    alignItems: 'center',
    borderRadius: 5,
  },
  roleButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  modalView: {
    margin: 20,
    backgroundColor: "red",  // Modifiez cette ligne pour mettre un fond rouge
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
}
});