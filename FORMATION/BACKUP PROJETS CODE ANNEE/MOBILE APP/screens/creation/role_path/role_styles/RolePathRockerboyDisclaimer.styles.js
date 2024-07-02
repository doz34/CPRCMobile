import { StyleSheet, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 20,
  },
  placeholderContainer: {
    borderRadius: 10,
    paddingHorizontal: 15,
    opacity: 0.7, // Réduire l'opacité du placeholder
    justifyContent: "center",
    zIndex: 2,
    flexShrink: 1,
    flexGrow: 0,
    maxHeight: "70%", // Limiter la hauteur pour garder de l'espace pour le bouton
  },
  textContainer: {
    opacity: 1, // Assurer que le texte n'est pas affecté par l'opacité du placeholder
  },
  roleDescriptionTitleText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 16,
    textShadowColor: "black",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
    zIndex: 3,
  },
  contentContainer: {
    flexShrink: 1,
    flexGrow: 0,
  },
  roleDescriptionText: {
    fontSize: 16,
    color: "white",
    textAlign: "justify",
    padding: 10,
    lineHeight: 20,
    opacity: 1,
  },
  imageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  rockerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  continueButton: {
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
    width: "30%",
    alignSelf: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});

export default styles;