// GenPathEnvironment.styles.js
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');  // Get the width and height of the device to use for full-width components

export default StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  descriptionContainer: {
    width: '90%',
    padding: 20,
    marginBottom: 20,
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'  // Optional: Add background color if needed for visibility
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,  // Ensure spacing after the title within the description container
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  scrollableContentContainer: {
    maxHeight: 150, // Limits the height to make it scrollable
    width: '100%',  // Ensure it occupies the full width of the description container
  },
  descriptionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  sectionContainer: {
    marginBottom: 20, // Maintain spacing between sections
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 24,
    marginBottom: 15,
    color: 'white',
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  picker: {
    height: 60,
    width: '40%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    color: 'black',
    marginBottom: 20,
    borderRadius: 10,
  },
  button: {
    backgroundColor: "teal",
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 10,
    width: '40%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  continueButton: {
    backgroundColor: 'green',
    width: '40%',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: "center",
  },
  quitButton: {
    backgroundColor: 'red',
    width: '40%',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: "center",
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  modalDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: 'white',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  modalButtonYes: {
    backgroundColor: 'green',
  },
  modalButtonNo: {
    backgroundColor: 'red',
  },
});