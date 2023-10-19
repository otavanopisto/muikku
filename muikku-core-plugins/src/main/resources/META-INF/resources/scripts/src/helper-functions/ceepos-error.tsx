import { CeeposOrder } from "~/generated/client";
import i18n, { localize } from "~/locales/i18n";

/**
 * getErrorMessageContent
 * @param order  order
 * @param message  message
 */
export function getErrorMessageContent(order: CeeposOrder, message?: string) {
  /**
   * errorMessage which can come from backend or from localization properties
   */
  const errorMessage: string = message
    ? "<div><em>" + message + "</em></div>"
    : "";

  // Pretext is functioning as a empty place holder paragraph enabling user to place caret above of the prefilled content
  const pretext = "<p></p>";

  i18n.t("labels.created");

  // Error message's prefilled content
  const content: string =
    '<div class="message-from-ceepos-error">' +
    "<div><b>" +
    order.product.Description +
    "</b></div>" +
    errorMessage +
    "<div><b>" +
    i18n.t("labels.id", { ns: "orders" }) +
    "</b>: " +
    order.id +
    "</div>" +
    "<div><b>" +
    i18n.t("labels.created") +
    "</b>: " +
    localize.date(order.created) +
    "</div>" +
    "</div>";

  return pretext + content;
}

/**
 * errorMessageTitle
 * @param order order
 * @returns title
 */
export function getErrorMessageTitle(order: CeeposOrder) {
  // Error message's prefilled title
  const title: string =
    order.product.Description + " - " + "[" + order.id + "]";
  return title;
}
