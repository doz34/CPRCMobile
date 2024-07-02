// screens/account/styles.js
import { StyleSheet, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const roleIconStyle = StyleSheet.create({
  roleIcon: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    margin: 10,
  },
});

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  gridContainer: {
    flex: 1, // Prendre toute la hauteur disponible
    justifyContent: "space-between", // Positionner les enfants aux extrémités
    alignItems: "center",
    width: screenWidth,
    paddingVertical: 20, // Ajouter de l'espace au sommet et au bas
    zIndex: 2,
  },
  title: {
    fontSize: 35,
    textAlign: "center",
    color: "white",
    fontFamily: "Roboto",
    fontWeight: "bold",
    textShadowColor: "black",
    textShadowOffset: { width: -3, height: 3 },
    textShadowRadius: 1,
    zIndex: 2,
  },
  advantagesDisadvantagesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: screenWidth - 70,
    marginBottom: 50,
    top: screenHeight - 1700,
    left : screenWidth - 605,
    zIndex: 1,
  },
  advantagesContainer: {
    width: "28%",
    padding: 10,
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: -2, // pour une bordure interne à gauche
      height: -2, // pour une bordure interne en haut
    },
    shadowOpacity: 0.8, // Augmenter l'opacité de l'ombre
    shadowRadius: 8, // Augmenter le rayon de l'ombre
    elevation: 5, // Pour Android
    opacity: 0.8,
  },

  advantagesTitle: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  advantagesText: {
    padding: 10,
    color: "white",
    textAlign: "center",
    flexWrap: "wrap",
  },
  disadvantagesContainer: {
    width: "28%",
    padding: 10,
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: -2, // pour une bordure interne à gauche
      height: -2, // pour une bordure interne en haut
    },
    shadowOpacity: 0.8, // Augmenter l'opacité de l'ombre
    shadowRadius: 8, // Augmenter le rayon de l'ombre
    elevation: 5, // Pour Android
    opacity: 0.8,
  },

  disadvantagesTitle: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },

  disadvantagesText: {
    padding: 10,
    color: "white",
    textAlign: "center",
    flexWrap: "wrap",
  },
  descriptionContainer: {
    position: "absolute",
    top: 55,
    left: 30,
    right: 30,
    padding: 10,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "transparent",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5, // Pour Android
    opacity: 0.8,
    zIndex: 2,
  },
  descriptionText: {
    color: "white",
    textAlign: "center",
    padding: 10,
    borderRadius: 5,
    flexWrap: "wrap",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: screenWidth - 200,
    top: -50,
  },
  learnMoreButton: {
    backgroundColor: "teal",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  selectButton: {
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
    marginLeft: 10,
  },
  continueButton: {
    backgroundColor: "green", // ou toute autre couleur souhaitée
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: screenWidth - 40, // Prend la largeur de l'écran moins une marge
    alignSelf: "center", // Ajouté pour centrer le bouton
    alignItems: "center",
    marginVertical: 10, // Ajoute de l'espace vertical si nécessaire
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  roleImage: {
    width: "100%", // Utiliser 100% de la View container
    height: "100%", // Utiliser 100% de la View container
    resizeMode: "contain", // Adapter l'image dans la View sans la déformer
  },
  roleImageWrapper: {
    width: screenWidth * 0.5, // 80% de la largeur de l'écran
    height: screenHeight * 0.8, // 50% de la hauteur de l'écran
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20, // Ajouter de l'espace vertical
    zIndex: 0, // Assurez-vous que c'est derrière tous les autres éléments
    shadowColor: "#000", // La couleur de l'ombre
    shadowOffset: { width: 0, height: 4 }, // La direction et la distance de l'ombre
    shadowOpacity: 0.9, // La transparence de l'ombre
    shadowRadius: 5, // Le flou de l'ombre
    elevation: 10, // Pour Android, ajuster selon le besoin pour l'intensité de l'ombre
    overflow: "visible", // Pour s'assurer que l'ombre n'est pas coupée
    zIndex: 2,
  },
  headerContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: screenHeight * 0.1, // Ajustez en fonction de l'espacement souhaité du haut
  },
  headerText: {
    fontSize: 24,
    color: "white",
    fontFamily: "Roboto",
    fontWeight: "bold",
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  contentContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  contentText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24, // Ajuster pour l'espacement des lignes
    marginBottom: 20, // Ajuster en fonction de l'espacement souhaité du bas
    fontFamily: "Roboto",
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
});
export default styles;
