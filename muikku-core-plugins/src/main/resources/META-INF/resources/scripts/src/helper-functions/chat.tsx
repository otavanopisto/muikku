/**
 * getUserChatId gets user chat ID
 * @param userId string version of user Id
 * @param type staff or student ID
 * @returns chat Jid
 */
export const getUserChatId = (userId: number, type: "staff" | "student") => {
  let muikkuChatIdBeginning = "";

  if (type === "staff") {
    muikkuChatIdBeginning = "muikku-staff-";
  } else {
    muikkuChatIdBeginning = "muikku-student-";
  }

  const chatHostName = window.sessionStorage.getItem("strophe-bosh-hostname");

  if (chatHostName !== null) {
    return muikkuChatIdBeginning + userId + "@" + chatHostName;
  }
};

/**
 * subscribeToUser adds user to roster ( subscribes and is subscribed()
 * @param toJId stanza recipient JId
 * @param connection strophe connection
 */
export const subscribeToUser = (
  toJId: string,
  connection: Strophe.Connection
) => {
  const subscribe = $pres({
    from: connection.jid,
    to: toJId,
    type: "subscribe",
  });
  const subscribed = $pres({
    from: connection.jid,
    to: toJId,
    type: "subscribed",
  });
  connection.send(subscribe);
  connection.send(subscribed);
};

/**
 * handleRosterDelete manipulates roster
 * @param toJId stanza recipient JId
 * @param connection strophe connection
 *
 * @returns an answer stanza element
 */
export const handleRosterDelete = async (
  toJId: string,
  connection: Strophe.Connection
): Promise<Element> => {
  const stanza = $iq({
    from: connection.jid,
    type: "set",
  })
    .c("query", { xmlns: Strophe.NS.ROSTER })
    .c("item", { jid: toJId, subscription: "remove" });

  const answer: Element = await new Promise((resolve) =>
    connection.sendIQ(stanza, (answerStanza: Element) => resolve(answerStanza))
  );

  return answer;
};

/**
 *
 * @param groupName group to add user tp
 * @param fromJId stanza sender JId
 * @param toJId stanza recipient JId
 * @param connection strophe connection
 * @returns
 */
export const setUserToRosterGroup = async (
  groupName: string,
  toJId: string,
  connection: Strophe.Connection
): Promise<Element> => {
  const stanza = $iq({
    from: connection.jid,
    type: "set",
  })
    .c("query", { xmlns: Strophe.NS.ROSTER })
    .c("item", { jid: toJId })
    .c("group", groupName);

  const answer: Element = await new Promise((resolve) =>
    connection.sendIQ(stanza, (answerStanza: Element) => resolve(answerStanza))
  );

  return answer;
};

/**
 * requestPrescense
 * @param toJId stanza recipient
 * @param connection strophe connection
 */
export const requestPrescense = (
  toJId: string,
  connection: Strophe.Connection
) => {
  connection.send(
    $pres({
      from: connection.jid,
      to: toJId,
      type: "probe",
    })
  );
};
