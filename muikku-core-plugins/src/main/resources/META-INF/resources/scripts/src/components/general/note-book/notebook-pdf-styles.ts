import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  body: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 35,
    lineHeight: 1,
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
