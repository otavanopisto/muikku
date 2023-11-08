import * as React from "react";
import { ChatUser } from "~/generated/client";
import Avatar from "../general/avatar";
import { useChatContext } from "./context/chat-context";

/**
 * PeopleList
 * @returns JSX.Element
 */
function PeopleList() {
  const { people, loadingPeople } = useChatContext();

  if (loadingPeople) {
    return <div>Loading...</div>;
  }

  if (people.length === 0) {
    return <div>No people found</div>;
  }

  return (
    <div
      className="people-list"
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {people.map((user) => (
        <PeopleItem key={user.id} user={user} />
      ))}
    </div>
  );
}

/**
 * PeopleItem
 */
interface PeopleItemProps {
  user: ChatUser;
}

/**
 * PeopleItem
 * @param props props
 * @returns JSX.Element
 */
function PeopleItem(props: PeopleItemProps) {
  const { user } = props;

  return (
    <div
      className="people-item"
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "grey",
        borderRadius: "50px 0 0 50px",
        color: "white",
        marginBottom: "10px",
      }}
    >
      <div
        className="people-item__avatar"
        style={{
          marginRight: "10px",
        }}
      >
        <Avatar
          id={user.id}
          hasImage={user.hasImage}
          firstName={user.nick[0]}
        />
      </div>
      <div className="people-item__name">{user.nick} ONLINE</div>
    </div>
  );
}

export { PeopleList, PeopleItem };
