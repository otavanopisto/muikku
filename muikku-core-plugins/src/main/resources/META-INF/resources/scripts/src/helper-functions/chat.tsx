/**
 * getUserChatId gets user chat ID
 * @param userId string version of user Id
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
