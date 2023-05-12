import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  body: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 35,
    lineHeight: 1,
  },
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    marginVertical: 5,
    paddingBottom: 10,
    borderBottom: "1px solid #cfcfcf",
  },
  tocTopicContainer: {
    display: "flex",
    flexDirection: "column",
    marginTop: "5px",
  },
  tocTopicTitle: {
    textTransform: "uppercase",
  },
  tocTopicContent: {
    display: "flex",
    flexDirection: "column",
  },
  tocElementContainer: {
    display: "flex",
    flexDirection: "row",
    borderLeft: "3px solid #ffffff",
    margin: "5px",
    color: "#2c2c2c",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tocElementTitle: {
    padding: "4px 4px 4px 8px",
  },
  tocElementIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "4px",
  },
  tocElementAssignment: {
    borderLeft: "3px solid #ce01bd",
  },
  tocElementExcercise: {
    borderLeft: "3px solid #ff9900",
  },
  tocElementJournal: {
    borderLeft: "3px solid #29b0c4",
  },
  tocElementInterimEvaluation: {
    borderLeft: "3px solid black",
  },
  tocElementStateSubmitted: {
    backgroundColor: "#009fe3",
    color: "#ffffff",
  },
  tocElementStateAnswered: {
    backgroundColor: "transparent",
    color: "#009fe3",
  },
  tocElementStateWithdrawn: {
    backgroundColor: "#b3b2b2",
    color: "#ffffff",
  },
  tocElementStatePassed: {
    backgroundColor: "#24c118",
    color: "#ffffff",
  },
  tocElementStateIncomplete: {
    backgroundColor: "#ea7503",
    color: "#ffffff",
  },
  tocElementStateFailed: {
    backgroundColor: "#de3211",
    color: "#ffffff",
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
