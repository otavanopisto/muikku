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
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    marginVertical: 5,
    paddingBottom: 10,
  },
  tocTopicContainer: {
    display: "flex",
    flexDirection: "row",
    margin: "5px 0px",
    color: "#2c2c2c",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tocTopicTitle: {
    textTransform: "uppercase",
  },
  tocTopicIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "4px",
    borderRadius: "50%",
  },
  tocTopicIconRestrictedToLoggedUsers: {
    backgroundColor: "#de3211",
    color: "#ffffff",
  },
  tocTopicIconRestrictedToMembers: {
    backgroundColor: "#62c3eb",
    color: "#ffffff",
  },
  tocElementContainer: {
    display: "flex",
    flexDirection: "row",
    borderLeft: "3px solid #ffffff",
    margin: "5px 5px 5px 0px",
    color: "#2c2c2c",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tocElementTitle: {
    padding: "4px 4px 4px 8px",
  },
  tocIconContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "4px",
    borderRadius: "50%",
  },
  tocElementIcon: {
    height: "28px",
    width: "28px",
  },
  tocElementIconRestrictedToLoggedUsers: {
    backgroundColor: "#de3211",
    color: "#ffffff",
  },
  tocElementIconRestrictedToMembers: {
    backgroundColor: "#62c3eb",
    color: "#ffffff",
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
  pageTitle: {
    fontSize: 10,
    fontFamily: "Times-Roman",
    marginVertical: 10,
    textTransform: "uppercase",
  },
  empty: {
    fontSize: 10,
    fontFamily: "Times-Roman",
    marginVertical: 10,
  },
  arrowIcon: {
    display: "flex",
    width: "1em",
    height: "1em",
    strokeWidth: 0,
    stroke: "#000000",
    fill: "#000000",
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
