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
  noteContainer: {
    display: "flex",
    flexDirection: "column",
    marginVertical: 5,
    paddingBottom: 10,
    borderBottom: "1px solid #cfcfcf",
  },
  noteFieldLabel: {
    fontSize: 10,
    fontFamily: "Times-Bold",
    marginBottom: 5,
  },
  noteFieldValue: {
    fontSize: 10,
    fontFamily: "Times-Roman",
  },
  pageTitle: {
    fontSize: 10,
    fontFamily: "Times-Roman",
    marginVertical: 10,
    textTransform: "uppercase",
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
