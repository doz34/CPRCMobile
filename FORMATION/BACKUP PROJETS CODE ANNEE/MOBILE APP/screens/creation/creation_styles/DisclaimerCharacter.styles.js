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
  blurredBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 20,
  },
  capacityContainer: {
    flex: 1, // Assure que le gradient prend tout l'espace nécessaire
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
  },
  contentContainer: {
    flexGrow: 0, // Changé pour limiter la croissance à son contenu
    maxHeight: "70%", // Limite la hauteur pour garder de l'espace pour le bouton
  },
  modalGradient: {
    width: screenWidth * 0.8,
    maxWidth: "90%",
    maxHeight: screenHeight * 0.8,
    margin: 20,
    padding: 20,
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 2,
    alignItems: "center",
    zIndex: 1000,
    opacity: 0.9,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    marginVertical: 10,
    backgroundColor: "white",
    borderRadius: 5,
    color: "black",
  },
  createCharacterButton: {
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 5,
    width: "80%",
  },
  continueWithExistingButton: {
    backgroundColor: "teal",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 5,
    width: "80%",
  },
  confirmButton: {
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 5,
    width: "80%",
  },
  cancelButton: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 5,
    width: "80%",
  },
  modifyButton: {
    backgroundColor: "teal",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 5,
    width: "80%",
  },
  buttonText: {
    color: "white",
    fontWeight:"bold",
    fontSize: 16,
    textAlign: "center",
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
  placeholderContainer: {
    backgroundColor: "darkgray",
    borderRadius: 10,
    paddingHorizontal: 15,
    opacity: 0.8,
    justifyContent: "center", // Center content inside vertically
  },
  roleDescriptionText: {
    fontSize: 16,
    color: "white",
    textAlign: "justify",
    padding: 10,
    lineHeight: 20,
    opacity: 1,
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
  },
  characterContainer: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "white",
    marginBottom: 5,
  },
  characterIcon: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  characterInfo: {
    flex: 1,
  },
  characterName: {
    fontWeight: "bold",
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  characterDetails: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
  },
  sortContainer: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-between",
    width: "100%",
  },
  picker: {
    flex: 1,
    color: "white",
  },
  selectedCharacterContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 20,
  },
  characterList: {
    width: "100%",
    flexGrow: 1,
  },
});

export default styles;
