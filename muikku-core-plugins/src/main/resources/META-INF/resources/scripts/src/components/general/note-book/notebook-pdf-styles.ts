import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  body: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 35,
    lineHeight: 1.25,
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
    fontSize: 18,
    fontFamily: "Times-Roman",
    fontWeight: "bold",
    flexBasis: "auto",
    flexShrink: 1,
    flexGrow: 1,
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: "Times-Roman",
    marginLeft: 5,
    flexBasis: "300",
    flexGrow: 1,
    flexShrink: 0,
    textAlign: "right",
  },
  headerPageNumber: {
    fontSize: 12,
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
    fontSize: 16,
    fontFamily: "Times-Roman",
    marginBottom: 10,
  },
  noteFieldValue: {
    fontSize: 12,
    fontFamily: "Times-Roman",
  },
  empty: {
    fontSize: 12,
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
    fontSize: 12,
    fontFamily: "Times-Roman",
    marginVertical: 5,
  },
  h3: {
    fontSize: 14,
    fontFamily: "Times-Roman",
    marginTop: 15,
    marginBottom: 5,
  },
  h4: {
    fontSize: 13,
    fontFamily: "Times-Roman",
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
    fontFamily: "Times-Bold",
  },
  strong: {
    fontFamily: "Times-Bold",
  },
  i: {
    fontFamily: "Times-Italic",
  },
  em: {
    fontFamily: "Times-Italic",
  },
  u: {
    textDecoration: "underline",
  },
};
