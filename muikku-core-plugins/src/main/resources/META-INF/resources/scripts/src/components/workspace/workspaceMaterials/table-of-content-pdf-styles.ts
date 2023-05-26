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
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    marginVertical: 5,
    paddingBottom: 10,
  },
  tocTopicContainer: {
    display: "flex",
    fontSize: 12,
    flexDirection: "row",
    margin: "10px 0px 5px",
    color: "#2c2c2c",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tocTopicTitle: {
    textTransform: "uppercase",
    fontSize: 12,
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
    fontSize: 12,
    flexDirection: "row",
    borderLeft: "3px solid #ffffff",
    margin: "5px 5px 5px 0px",
    color: "#2c2c2c",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tocElementTitle: {
    padding: "2px 4px 2px 8px",
    fontSize: 12,
  },
  tocIconContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2px",
    borderRadius: "50%",
  },
  tocElementIcon: {
    height: "10px",
    width: "10px",
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
