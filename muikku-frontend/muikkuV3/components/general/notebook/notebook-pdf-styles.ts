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
    fontSize: 16,
    fontFamily: "Helvetica",
    flexBasis: "auto",
    flexShrink: 1,
    flexGrow: 1,
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: "Helvetica",
    marginLeft: 5,
    flexBasis: "300",
    flexShrink: 0,
    textAlign: "right",
  },
  headerPageNumber: {
    fontSize: 12,
    fontFamily: "Helvetica",
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
    fontFamily: "Helvetica",
    marginBottom: 10,
  },
  noteFieldValue: {
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  empty: {
    fontSize: 12,
    fontFamily: "Helvetica",
    marginVertical: 10,
  },
  pageTitle: {
    fontSize: 12,
    fontFamily: "Helvetica",
    marginVertical: 10,
    textTransform: "uppercase",
  },
});

export const htmlStyles = {
  p: {
    fontSize: 12,
    fontFamily: "Helvetica",
    marginVertical: 5,
  },
  "p:first-child": {
    marginTop: 0,
  },
  h3: {
    fontSize: 14,
    fontFamily: "Helvetica",
    marginTop: 15,
    marginBottom: 5,
  },
  "h3:first-child": {
    marginTop: 0,
  },
  h4: {
    fontSize: 13,
    fontFamily: "Helvetica",
    marginTop: 15,
    marginBottom: 5,
  },
  "h4:first-child": {
    marginTop: 0,
  },
  blockquote: {
    backgroundColor: "#f8f8f8",
    borderLeft: "5px solid #f2f2f2",
    fontSize: 12,
    fontFamily: "Helvetica",
    marginVertical: 10,
    marginRight: 0,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  "blockquote:first-child": {
    marginTop: 0,
  },
  b: {
    fontFamily: "Helvetica-Bold",
  },
  strong: {
    fontFamily: "Helvetica-Bold",
  },
  i: {
    fontFamily: "Helvetica-Oblique",
  },
  em: {
    fontFamily: "Helvetica-Oblique",
  },
  u: {
    textDecoration: "underline",
  },
};
