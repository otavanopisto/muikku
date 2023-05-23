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
    flexBasis: "300",
    flexGrow: 1,
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
    fontSize: 12,
    fontFamily: "Times-Bold",
    marginBottom: 10,
  },
  noteFieldValue: {
    fontSize: 10,
    fontFamily: "Times-Roman",
  },
  empty: {
    fontSize: 10,
    fontFamily: "Times-Roman",
    marginVertical: 10,
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
    fontSize: 12,
    fontFamily: "Times-Roman",
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
  },
  h4: {
    fontSize: 11,
    fontFamily: "Times-Roman",
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
  },
  blockquote: {
    backgroundColor: "#f8f8f8",
    borderLeft: "5px solid #f2f2f2",
    fontSize: 12,
    fontFamily: "Times-Roman",
    marginVertical: 10,
    marginRight: 0,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  b: {
    fontWeight: "bold",
  },
  strong: {
    fontWeight: "bold",
  },
  i: {
    fontStyle: "italic",
  },
  em: {
    fontStyle: "italic",
  },
  u: {
    textDecoration: "underline"
  },
};
