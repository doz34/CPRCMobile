import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

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
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  descriptionContainer: {
    width: '90%',
    padding: 20,
    marginBottom: 20,
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  picker: {
    height: 60,
    width: '100%',
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
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  scrollableContentContainer: {
    flex: 1,
    width: '100%',
  },
  scrollableContent: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  caracContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-between',
    width: '90%',
  },
  caracTitle: {
    flex: 1,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'left',
    fontSize: 22,
    marginBottom: 10,
    marginRight: 20,
    textShadowColor: 'black',
    textShadowRadius: 2,
  },
  caracValueContainer: {
    width: '80%', // Limite la largeur des barres de progression à 40% de l'écran
    height: 45,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'flex-end', // Aligne les barres de progression à droite
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    overflow: 'hidden',
  },
  caracValue: {
    height: '100%',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  caracValueText: {
    color: 'black',
    fontWeight: "bold",
    fontSize: 20,
    textAlign: 'center',
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginBottom: 20,
  },
  quitButton: {
    backgroundColor: 'red',
    width: '40%',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: "center",
  },
  continueButton: {
    backgroundColor: 'green',
    width: '40%',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    fontSize: 22,
    marginBottom: 10,
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
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
    backgroundColor: "white",
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
  closeButtonText: {
    color: 'black', // Couleur du texte du bouton "Fermer"
    fontWeight: 'bold',
  },
  quitButtonText: {
    color: 'white', // Couleur du texte du bouton "Quitter"
    fontWeight: 'bold',
  },
  continueButtonText: {
    color: 'white', // Couleur du texte du bouton "Continuer"
    fontWeight: 'bold',
  },
});