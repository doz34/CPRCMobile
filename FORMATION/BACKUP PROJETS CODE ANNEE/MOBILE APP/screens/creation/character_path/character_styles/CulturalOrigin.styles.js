import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');  // Get the width of the device to use for full-width components

export default StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  sectionContainer: {
    marginBottom: 150, // Add spacing between sections
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
    height: 60,  // Increased height for better touch interaction
    width: width * 0.8,  // Use 80% of screen width for picker width
    backgroundColor: 'rgba(255, 255, 255, 0.5)',  // White background with 0.8 opacity
    color: 'black',  // Text color inside the picker
    marginBottom: 20,
    borderRadius: 10,  // Rounded corners for the picker
},
  button: {
    backgroundColor: "teal",  // Changed to teal for randomize buttons
    paddingVertical: 12,  // Increased padding for a larger button
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 10,  // Space between buttons
    width: width * 0.5,  // Buttons take up 50% of screen width
    alignItems: 'center',  // Center text horizontally
  },
  buttonText: {
    color: 'white',
    fontSize: 18,  // Larger text size for readability
  },
  continueButton: {
    position: 'absolute',  // Positioning the button at the bottom
    bottom: 30,  // 30 pixels from the bottom
    backgroundColor: 'green',  // Distinct color for continue button
    width: width * 0.8,  // Same width as picker for consistency
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  }
});
