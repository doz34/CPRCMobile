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
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  mainTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  sectionContainer: {
    marginBottom: 50, // Maintain spacing between sections
    alignItems: 'center',
    width: '100%',
  },
  fullContainer: {
    flexGrow: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  contentStyle: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  descriptionContainer: {
    width: '90%',
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    opacity: 0.8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Optional: Add background color if needed for visibility
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
    width: '100%',  // Ensure it occupies the full width of the description container
  },
  descriptionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
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
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    color: 'black',
    borderRadius: 10,
  },
  pickerContainer: {
    flex: 1,
    marginLeft: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "teal",
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 10,
    width: '30%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    minHeight: '20%',  // Minimum height to ensure it doesn't get too small
    maxHeight: '80%',  // Maximum height to ensure it doesn't get too large
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Assurez-vous que le fond est semi-transparent pour une meilleure visibilité
    flexShrink: 1,  // Allow the modal to shrink if needed
    flexGrow: 1,  // Allow the modal to grow if needed
  },
  modalContentCommon: {
    width: '80%',
    minHeight: '20%',  // Minimum height to ensure it doesn't get too small
    maxHeight: '80%',  // Maximum height to ensure it doesn't get too large
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Assurez-vous que le fond est semi-transparent pour une meilleure visibilité
    flexShrink: 1,  // Allow the modal to shrink if needed
    flexGrow: 1,  // Allow the modal to grow if needed
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContentContainer: {
    alignItems: 'flex-start',  // Align content to the left
    width: '100%',
  },
  modalPair: {
    marginBottom: 10,  // Add space between key-value pairs
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
    textAlign: 'center',  // Center the title
    width: '100%',
  },
  modalKey: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  modalValue: {
    fontSize: 16,
    color: 'black',  // Set the color of the values to black
    marginBottom: 5,
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
  closeButton: {
    backgroundColor: "teal",
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
    alignSelf: 'center',  // Center the button
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  clickableTitle: {
    borderWidth: 2,
    borderColor: 'white',
    padding: 5,
    marginBottom: 10,
    marginRight: 10,
    height: 60,  // Adjust the height to match the dropdown
    justifyContent: 'center',  // Center the text vertically
  },
  clickableTitleText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',  // Center vertically
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  rowItem: {
    flex: 1,
  },
  confirmButton: {
    backgroundColor: 'green',
    width: '40%',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: "center",
  },
  headArmorPicker: {
    width: "70%",
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    color: 'black',
    borderRadius: 10,
  },
  bodyArmorPicker: {
    width: "67%",
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    color: 'black',
    borderRadius: 10,
  },
});