import { setLocale, SetLocaleTriggerType } from "~/actions/base/locales";
import Dropdown from "~/components/general/dropdown";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { i18nType } from "~/reducers/base/i18n";
import Link from "~/components/general/link";
import { LocaleState, LocaleType } from "~/reducers/base/locales";
import { StateType } from "~/reducers";
import "~/sass/elements/dropdown.scss";
import "~/sass/elements/link.scss";
import "~/sass/elements/buttons.scss";
import { AnyActionType } from "../../../actions/index";

const LOCALES: LocaleType[] = ["fi", "en"];

/**
 * LanguagePickerProps
 */
interface LanguagePickerProps {
  locales: LocaleState;
  i18n: i18nType;
  setLocale: SetLocaleTriggerType;
}

/**
 * LanguagePickerState
 */
interface LanguagePickerState {}

/**
 * LanguagePicker
 */
class LanguagePicker extends React.Component<
  LanguagePickerProps,
  LanguagePickerState
> {
  /**
   * Handles set locale click
   * @param locale locale
   */
  handleSetLocaleClick =
    (locale: LocaleType) =>
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      this.props.setLocale({
        locale: locale,
        // eslint-disable-next-line jsdoc/require-jsdoc
        onSuccess: () => window.location.reload(),
      });
    };

  /**
   * Component render method
   */
  render() {
    return (
      <Dropdown
        modifier="language-picker"
        items={LOCALES.map((locale) => (
          <Link
            key={locale}
            className={`link link--full link--language-picker-dropdown`}
            onClick={this.handleSetLocaleClick(locale)}
            role="menuitem"
          >
            <span className={`link__locale link__locale--${locale}`}>
              {this.props.i18n.text.get(`plugin.navigation.language.${locale}`)}
            </span>
          </Link>
        ))}
      >
        <Link
          className={`button-pill button-pill--current-language`}
          role="menuitem"
          tabIndex={0}
          aria-haspopup="true"
          aria-label={this.props.i18n.text.get(
            "plugin.wcag.localeMenu.aria.label"
          )}
        >
          <span
            className={`button-pill__current-locale button-pill__current-locale--${this.props.locales.current}`}
          >
            {this.props.locales.current}
          </span>
        </Link>
      </Dropdown>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 * @returns object
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    locales: state.locales,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 * @returns object
 */
const mapDispatchToProps = (dispatch: Dispatch<AnyActionType>) =>
  bindActionCreators({ setLocale }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(LanguagePicker);
