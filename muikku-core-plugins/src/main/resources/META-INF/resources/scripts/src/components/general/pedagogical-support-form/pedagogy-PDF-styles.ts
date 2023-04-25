import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 24,
    fontFamily: "Oswald",
  },
  subtitle: {
    fontSize: 18,
    fontFamily: "Oswald",
  },
  pageTitle: {
    fontSize: 18,
    fontFamily: "Oswald",
    textTransform: "uppercase",
  },
  header: {
    color: "grey",
    display: "flex",
    flexDirection: "row",
    marginBottom: 20,
    height: "auto",
  },
  headerInfoContainer: {
    width: "60%",
  },
  headerImageContainer: {
    width: "40%",
  },
  headerImage: {
    height: "auto",
    width: 100,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    right: 0,
    marginTop: 20,
    paddingHorizontal: 35,
  },
  footerImage: {
    height: "auto",
    width: 100,
  },
  pageNumber: {
    fontSize: 12,
    color: "grey",
  },
  basicInfoContainer: {
    display: "flex",
    flexDirection: "column",
  },
  infoField: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    flexShrink: 1,
    marginVertical: 10,
  },
  infoFieldLabel: {
    fontWeight: "bold",
    fontSize: 14,
  },
  infoFieldValue: {
    fontSize: 10,
  },
  infoListValueContainer: {
    display: "flex",
    flexDirection: "column",
  },
  infoListItemValue: {
    fontSize: 10,
  },
  implementedActionsList: {},
  implementedAction: {
    display: "flex",
    flexDirection: "column",
    marginVertical: 10,
  },
  implementationInfo: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  implementationExtraInfo: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    borderBottom: "1px solid #b4b4b4",
    paddingBottom: "10px",
  },
  opinionList: {},
  opinion: {
    display: "flex",
    flexDirection: "column",
    paddingVertical: 5,
    borderBottom: "1px solid #b4b4b4",
  },
  opinionInfo: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  opinionExtraInfo: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
});
