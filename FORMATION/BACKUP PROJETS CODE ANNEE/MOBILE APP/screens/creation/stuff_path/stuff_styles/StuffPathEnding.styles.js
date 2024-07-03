import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: width * 0.05,
    width: '100%',
  },
  descriptionContainer: {
    width: '90%',
    padding: width * 0.05,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    marginTop: height * 0.05, // Ajout d'une marge en haut pour espacer du bord supérieur
  },
  descriptionTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: height * 0.01,
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  scrollableContentContainer: {
    maxHeight: height * 0.2,
    width: '100%',
  },
  descriptionText: {
    color: 'white',
    fontSize: width * 0.04,
    textAlign: 'center',
  },
  bottomContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height * 0.05, // Ajout d'une marge en bas pour espacer du bord inférieur
  },
  continueButton: {
    backgroundColor: 'green',
    width: '60%',
    paddingVertical: height * 0.02,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: width * 0.045,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});