import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  body: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 35,
  },
  header: {
    color: "#000000",
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    marginBottom: 30,
    height: "auto",
  },
  headerImageContainer: {
    flexBasis: 50,
    marginRight: 20,
    flexShrink: 0,
    flexGrow: 0,
  },
  headerImage: {
    height: "auto",
    width: 50,
  },
  headerInfoContainer: {
    alignItems: "center",
    flexBasis: "auto",
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "flex-start",
    flexShrink: 1,
    flexGrow: 1,
  },
  title: {
    fontSize: 14,
    fontFamily: "Times-Roman",
    fontWeight: "bold",
    flexBasis: "auto",
    flexShrink: 1,
    flexGrow: 1,
  },
  subtitle: {
    fontSize: 10,
    fontFamily: "Times-Roman",
    marginLeft: 5,
    flexBasis: "100",
    flexShrink: 0,
    textAlign: "right",
  },
  pageNumber: {
    fontSize: 10,
    fontFamily: "Times-Roman",
    marginLeft: 5,
    flexBasis: "50",
    flexShrink: 0,
    textAlign: "right",
  },
  pageTitle: {
    fontSize: 14,
    fontFamily: "Times-Roman",
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
    backgroundColor: "red",
  },
  infoFieldLabel: {
    fontSize: 11,
    fontFamily: "Times-Roman",
    marginBottom: 10,
  },
  infoFieldValue: {
    fontSize: 11,
    fontFamily: "Times-Roman",
    marginLeft: 70,
  },
  infoListValueContainer: {
    display: "flex",
    flexDirection: "column",
    marginLeft: 70,
  },
  infoListItemValue: {
    fontSize: 11,
    fontFamily: "Times-Roman",
  },
  implementedActionsList: {},
  implementedAction: {
    display: "flex",
    flexDirection: "column",
    marginVertical: 10,
  },
  implementationInfo: {
    display: "flex",
    flexDirection: "column",
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
    fontSize: 11,
    fontFamily: "Times-Roman",
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
    fontSize: 11,
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
});

export const htmlStyles = {
  p: {
    fontSize: 10,
    fontFamily: "Times-Roman",
    marginVertical: 5,
  },
  h3: {
    fontSize: 12,
    fontFamily: "Times-Roman",
    marginTop: 10,
    marginBottom: 5,
  },
  h4: {
    fontSize: 11,
    fontFamily: "Times-Roman",
    marginTop: 10,
    marginBottom: 5,
  },
};
