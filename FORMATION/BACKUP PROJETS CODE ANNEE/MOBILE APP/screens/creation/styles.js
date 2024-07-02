// screens/account/styles.js
import { StyleSheet, Dimensions } from "react-native";

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
  titleContainer: {
    gridArea: 'titleContainer',
  },
  title: {
    fontSize: 35,
    textAlign: 'center',
    color: 'white',
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: { width: -3, height: 3 },
    textShadowRadius: 1,
    zIndex: 2,
  },
  briefTitle: {
    color: 'white',
    fontWeight: 'bold',
    // ... Autres styles ...
  },
  advantagesDisadvantagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 10,
  },
  advantagesContainer: {
    flex: 1,
    marginHorizontal: 8,
    width: '48%',
    padding: 10,
    borderRadius: 25,
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
    padding: 10,
    color: 'white',
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  disadvantagesContainer: {
    flex: 1,
    marginHorizontal: 8,
    width: '48%',
    padding: 10,
    borderRadius: 25,
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
    padding: 10,
    color: 'white',
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  descriptionContainer: {
    gridArea: 'description',
    padding: 10,
    borderRadius: 25,
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
  },
  descriptionText: {
    color: 'white',
    textAlign: 'center',
    padding: 10,
    borderRadius: 5,
    flexWrap: 'wrap',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  learnMoreButton: {
    backgroundColor: 'teal',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  selectButton: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  roleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  roleImageWrapper: {
    position: 'absolute', // Positionne l'image absolument à l'intérieur de 'roleContainer'
    top: 0, // Alignement en haut
    bottom: 0, // Alignement en bas
    left: 0, // Alignement à gauche
    right: 0, // Alignement à droite
    width: screenWidth, // Largeur de l'écran
    height: screenHeight, // Hauteur de l'écran
    resizeMode: 'cover', // Assurez-vous que l'image couvre tout l'espace sans déformation
    zIndex: -1, // Assurez-vous que l'image est derrière tous les autres éléments
  },
  roleContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    position: 'relative', // Assurez-vous que le conteneur est positionné relativement
  },
});

export default styles;
