import * as React from "react";
import { getUserImageUrl } from "~/util/modifiers";
import "~/sass/elements/avatar.scss";
import { StateType } from "../../reducers/index";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "../../reducers/base/i18n";

interface AvatarProps {
  hasImage: boolean;
  id: number;
  firstName: string;
  userCategory?: number;
  i18n: i18nType;
  avatarAriaLabel?: string;
}

interface AvatarState {}

class Avatar extends React.Component<AvatarProps, AvatarState> {
  constructor(props: AvatarProps) {
    super(props);
  }

  render() {
    const { id, userCategory, hasImage, firstName, avatarAriaLabel } = this.props;

    const category = (userCategory && userCategory) || id > 10 ? (id % 10) + 1 : id;

    return hasImage ? (
      <object
        className="avatar-container"
        data={getUserImageUrl(id)}
        type="image/jpeg"
        aria-label={avatarAriaLabel}
      >
        <div className={`avatar avatar--category-${category}`}>{firstName[0]}</div>
      </object>
    ) : (
      <div className="avatar-container">
        <div className={`avatar avatar--category-${category}`}>{firstName[0]}</div>
      </div>
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Avatar);
