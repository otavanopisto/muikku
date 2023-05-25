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
    fontFamily: "Helvetica",
    flexBasis: "auto",
    flexShrink: 1,
    flexGrow: 1,
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: "Helvetica",
    marginLeft: 5,
    flexBasis: "100",
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
  pageTitle: {
    fontSize: 12,
    fontFamily: "Helvetica",
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
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  infoFieldValue: {
    fontSize: 12,
    fontFamily: "Helvetica",
    marginLeft: 70,
  },
  infoFieldContainerSameRow: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    flexGrow: 0,
    flexShrink: 0,
    marginVertical: 10,
    height: "auto",
    width: "100%",
    maxWidth: "100%",
  },
  infoFieldLabelSameRow: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginBottom: 0,
    flexBasis: 90,
    flexGrow: 0,
    flexShrink: 0,
  },
  infoFieldValueSameRow: {
    fontSize: 12,
    fontFamily: "Helvetica",
    flexBasis: 440,
    flexGrow: 0,
    flexShrink: 0,
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
  empty: {
    fontSize: 12,
    fontFamily: "Helvetica",
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
