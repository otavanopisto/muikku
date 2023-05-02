import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  body: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 35,
    lineHeight: 1,
  },
  header: {
    color: "#000000",
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    marginBottom: 20,
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
  headerTitle: {
    fontSize: 16,
    fontFamily: "Times-Roman",
    fontWeight: "bold",
    flexBasis: "auto",
    flexShrink: 1,
    flexGrow: 1,
  },
  headerSubtitle: {
    fontSize: 10,
    fontFamily: "Times-Roman",
    marginLeft: 5,
    flexBasis: "100",
    flexShrink: 0,
    textAlign: "right",
  },
  headerPageNumber: {
    fontSize: 10,
    fontFamily: "Times-Roman",
    marginLeft: 5,
    flexBasis: "40",
    flexShrink: 0,
    textAlign: "right",
  },
  pageTitle: {
    fontSize: 10,
    fontFamily: "Times-Roman",
    marginVertical: 10,
    textTransform: "uppercase",
  },
  infoFieldContainer: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "nowrap",
    flexGrow: 0,
    flexShrink: 0,
    marginVertical: 10,
    height: "auto",
    width: "100%",
  },
  infoFieldLabel: {
    fontSize: 10,
    fontFamily: "Times-Bold",
    marginBottom: 5,
  },
  infoFieldValue: {
    fontSize: 10,
    fontFamily: "Times-Roman",
    marginLeft: 70,
  },
  infoListItemValue: {
    fontSize: 10,
    fontFamily: "Times-Roman",
  },
  implementedActionContainer: {
    display: "flex",
    flexDirection: "column",
    marginVertical: 5,
    paddingBottom: 10,
    borderBottom: "1px solid #000",
  },
  implementationInfo: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "nowrap",
    width: "100%",
  },
  opinionContainer: {
    display: "flex",
    flexDirection: "column",
    marginVertical: 5,
    paddingBottom: 10,
    borderBottom: "1px solid #000",
  },
  opinionInfo: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "nowrap",
    width: "100%",
  },
});

export const htmlStyles = {
  p: {
    fontSize: 10,
    fontFamily: "Times-Roman",
    marginVertical: 5,
  },
  h3: {
    fontSize: 10,
    fontFamily: "Times-Roman",
    marginTop: 10,
    marginBottom: 5,
  },
  h4: {
    fontSize: 10,
    fontFamily: "Times-Roman",
    marginTop: 10,
    marginBottom: 5,
  },
};
