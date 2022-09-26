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
 *
 * @param groupName group to add user tp
 * @param fromJId stanza sender JId
 * @param toJId stanza recipient JId
 * @param connection strophe connection
 * @returns
 */
export const setUserToRosterGroup = async (
  groupName: string,
  // fromJId: string,
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

/**
 * Subscribe to another user's presence
 * @param toJId stanza recipient
 * @param connection strophe connection
 * @param type should you subscribe or unsubscribe from the presence
 */
export const handlePresenceSubscribe = async (
  toJId: string,
  connection: Strophe.Connection,
  type: "subscribe" | "unsubscribe"
): Promise<void> => {
  await new Promise((resolve) =>
    resolve(
      connection.send(
        $pres({
          from: connection.jid,
          to: toJId,
          type: type,
        })
      )
    )
  );
};

/**
 * Allow another user's presence
 * @param toJId stanza recipient
 * @param connection strophe connection
 * @param type should allow or unallow other person's subscription
 */
export const handlePresenceSubscribed = async (
  toJId: string,
  connection: Strophe.Connection,
  type: "subscribed" | "unsubscribed"
): Promise<void> => {
  await new Promise((resolve) =>
    resolve(
      connection.send(
        $pres({
          from: connection.jid,
          to: toJId,
          type: "type",
        })
      )
    )
  );
};
