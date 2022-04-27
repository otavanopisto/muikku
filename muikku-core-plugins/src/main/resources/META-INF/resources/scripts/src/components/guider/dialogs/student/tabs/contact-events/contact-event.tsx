import * as React from "react";
import "~/sass/elements/contact-event.scss";
import "~/sass/elements/rich-text.scss";
import { i18nType } from "~/reducers/base/i18n";
import { IContactEvent } from "~/reducers/main-function/guider";
import * as moment from "moment";
interface ContactEventProps {
  event: IContactEvent;
  modifier?: string;
  i18n: i18nType;
}

const ContactEvent: React.FC<ContactEventProps> = (props) => {
  const { entryDate, type, creatorName, text, comments, id } = props.event;
  const modifier = props.modifier;
  const i18n = props.i18n;
  return (
    <div
      className={`contact-event ${
        modifier ? "contact-event--" + modifier : ""
      }`}
    >
      <div className="contact-event__header">
        <div className="contact-event__title">
          <div className="contact-event__creator">{creatorName}</div>
          <div className="contact-event__type">
            {i18n.text.get("plugin.guider.contact.type." + type)}
          </div>
          <div className="contact-event__date">
            {moment(entryDate).format("dddd, MMMM Do YYYY")}
          </div>
        </div>
        <div className="contact-event__header-actions">
          <span>Muokkaa</span>
          <span>Poista</span>
        </div>
      </div>
      <div className="contact-event__body">{text}</div>
      {/* {comments ? (
        <div className="contact-event__replies">
          {comments.map((comment) => (
            <div key={comment.id} className="contact-event__reply">
              <div className="contact-event__header contact-event__header--reply">
                <div className="contact-event__date">{comment.commentDate}</div>
                <div className="contact-event__creator">
                  {comment.creatorName}
                </div>
              </div>
              <div className="contact-event__body contact-event__body--reply">
                {comment.text}
              </div>
            </div>
          ))}
        </div>
      ) : null} */}
      <div className="contact-event__replies">
        <div className="contact-event__reply">
          <div className="contact-event__header contact-event__header--reply">
            <div className="contact-event__creator">Kerkko Kommentoija</div>
            <div className="contact-event__date">
              {moment().format("dddd, MMMM Do YYYY")}
            </div>
          </div>
          <div className="contact-event__body contact-event__body--reply">
            Niit' ennen isoni lauloi kirvesvartta vuollessansa; niitä äitini
            opetti väätessänsä värttinätä, minun lasna lattialla eessä polven
            pyöriessä, maitopartana pahaisna, piimäsuuna pikkaraisna. Sampo ei
            puuttunut sanoja eikä Louhi luottehia: vanheni sanoihin sampo, katoi
            Louhi luottehisin, virsihin Vipunen kuoli, Lemminkäinen
            leikkilöihin.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactEvent;
