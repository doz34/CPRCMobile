// screens/account/styles.js
import { StyleSheet, Dimensions, Animated } from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    position: 'absolute',
    zIndex: -1, // Z-index inférieur à celui du grid
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
  title: {
    fontSize: screenWidth * 0.08, // 8% de la largeur de l'écran
    textAlign: 'center',
    color: 'white',
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: { width: -3, height: 3 },
    textShadowRadius: 1,
    zIndex: 2,
    transform: [{ translateY: -screenHeight * 0.012 }],
  },
  briefTitle: {
    color: 'white',
    fontWeight: 'bold',
    // ... Autres styles ...
  },
  thirdContainer: {
    width: screenWidth < 411 ? '33.33%' : '45%', // Un tiers de la largeur de l'écran
    padding: screenWidth * 0.025, // 2.5% de la largeur de l'écran
  },
  advantagesDisadvantagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    bottom: screenHeight < 768 ? screenHeight * 0.2 : screenHeight * 0.42,
    padding: screenWidth < 411 ? screenWidth * 0.05 : screenWidth * 0.0001,
  },
  advantagesContainer: {
    width: '100%',
    padding: screenWidth * 0.025,
    borderRadius: 0, // Ajoutez cette ligne
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: -2,
      height: -2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
    opacity: 0.8,
  },
  advantagesTitle: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  advantagesText: {
    padding: screenWidth * 0.025, // 2.5% de la largeur de l'écran
    color: 'white',
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  disadvantagesContainer: {
    width: '100%',
    padding: screenWidth * 0.025,
    borderRadius: 0, // Ajoutez cette ligne
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: -2,
      height: -2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 5,
    opacity: 0.8,
  },
  disadvantagesTitle: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  disadvantagesText: {
    padding: screenWidth * 0.025, // 2.5% de la largeur de l'écran
    color: 'white',
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  descriptionContainer: {
    position: 'absolute',
    top: screenHeight * 0.06,
    left: screenWidth * 0.025, // 2.5% de la largeur de l'écran
    right: screenWidth * 0.025, // 2.5% de la largeur de l'écran
    padding: screenWidth * 0.025, // 2.5% de la largeur de l'écran
    borderRadius: screenWidth * 0.0625, // 6.25% de la largeur de l'écran
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
    opacity: 0.8,
    zIndex: 2,
    transform: [
      {
        translateY: screenHeight < 1080 ? screenHeight * 0.03 : screenHeight * 0.04,
      },
    ],
  },
  descriptionText: {
    color: 'white',
    textAlign: 'center',
    padding: screenWidth * 0.025, // 2.5% de la largeur de l'écran
    borderRadius: screenWidth * 0.0125, // 1.25% de la largeur de l'écran
    flexWrap: 'wrap',
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: screenHeight * 0.05, // 5% de la hauteur de l'écran depuis le bas
    alignSelf: 'center', // Centrer horizontalement le conteneur
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%', // 80% de la largeur de l'écran
    height: '10%',
  },
  learnMoreButton: {
    backgroundColor: 'teal',
    paddingVertical: screenHeight * 0.025, // 2.5% de la hauteur de l'écran
    paddingHorizontal: screenWidth * 0.05, // 5% de la largeur de l'écran
    borderRadius: screenWidth * 0.03, // 1.25% de la largeur de l'écran
    width: '45%',
    alignItems: 'center',
    zIndex: 2,
  },
  selectButton: {
    backgroundColor: 'green',
    paddingVertical: screenHeight * 0.025, // 2.5% de la hauteur de l'écran
    paddingHorizontal: screenWidth * 0.05, // 5% de la largeur de l'écran
    borderRadius: screenWidth * 0.03, // 1.25% de la largeur de l'écran
    width: '45%',
    alignItems: 'center',
    zIndex: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: screenWidth * 0.035, // 4.5% de la largeur de l'écran
    fontWeight: 'bold',
  },
  roleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  roleImageWrapper: {
    position: 'absolute',
    alignSelf: 'center',
    width: screenWidth * 0.5,
    height: screenHeight * 0.5,
    resizeMode: 'contain',
    transform: [{ translateY: screenHeight * 0.23 }],
    zIndex: 2,
  },
  roleContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: screenWidth * 0.04, // 4% de la largeur de l'écran
    position: 'relative',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent', // Supprimez l'arrière-plan semi-transparent
  },
  modalMainContainer: {
    position: 'absolute',
    top: screenHeight * 0.3,
    left: 0,
    right: 0,
    zIndex: 9999, // Un z-index élevé pour s'afficher par-dessus le reste du contenu
  },
modalContent: {
  backgroundColor: 'white',
  padding: 20,
  borderRadius: 10,
  alignItems: 'center',
},
modalContentContainer: {
  position: 'relative',
  backgroundColor: 'white',
  padding: 20,
  borderRadius: 10,
  alignItems: 'center',
},
modalTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 10,
},
modalText: {
  fontSize: 16,
  textAlign: 'center',
  marginBottom: 20,
},
modalCloseButton: {
  backgroundColor: 'teal',
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 5,
},
modalCloseButtonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
},
roleDescriptionTitleText: {
  fontSize: 24,
  fontWeight: 'bold',
  color: 'black',
  textAlign: 'center',
  marginBottom: 16,
},
roleDescriptionText: {
  fontSize: 20,
  color: 'white',
  textAlign: 'justify',
  padding: screenWidth * 0.05,
  lineHeight: 24,
  marginVertical: -25,
},

placeholderContainer: {
  backgroundColor: 'darkgray',
  borderRadius: 10,
  padding: 20,
  marginHorizontal: 20,
  marginVertical: 30,
  opacity: 0.6,
},

capacityContainer: {
  marginTop: 20,
},

continueButton: {
  backgroundColor: "green",
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 5,
  marginBottom: 10,
  width: "80%",
  alignItems: "center",
  alignSelf: "center",
},
arrowContainer: {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: [{ translateX: '-50' }, { translateY: '-50' }],
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
  paddingHorizontal: 20,
},
arrow: {
  fontSize: 30,
  color: 'white',
  opacity: 0.5,
  animation: 'blink 1s infinite',
},
'@keyframes blink': {
  '0%': { opacity: 0.5 },
  '50%': { opacity: 1 },
  '100%': { opacity: 0.5 },
},
});

export default styles;
