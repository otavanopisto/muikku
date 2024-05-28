import * as React from "react";
import "~/sass/util/base.scss";
import { registerLocale } from "react-datepicker";
import { enGB, fi } from "date-fns/locale";
import "../locales/i18n";
import { useCountdown } from "./useCountdown";
import "./index.css";
import LoginButton from "~/components/base/login-button";
import { AudioPoolComponent } from "~/components/general/audio-pool-component";

registerLocale("fi", fi);
registerLocale("enGB", enGB);

/**
 * IndexFrontPage
 */
const IndexFrontPage = () => {
  const [days, hours, minutes, seconds] = useCountdown(
    new Date("2024-08-05T09:00:00.000+03:00")
    //new Date("2024-05-28T09:00:00.000+03:00")
  );

  const parsedHourses = hours < 10 ? `0${hours}` : hours;
  const parsedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const parsedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {
    return (
      <div className="staging-information-wrapper">
        <h1 className="staging-title">
          Tervehdimme tulevaa ... tästä se alkaa!
        </h1>
        <LoginButton key="0" modifier="campus-nightmare" />
      </div>
    );
  }

  return (
    <>
      <div className="staging-information-wrapper">
        <h1 className="staging-title">
          Te! Osoitteessa oikeassa. Sinne löytäneet!
        </h1>
        <h2 className="staging-secondary-title">
          Kaikille äänite. Kuunneltavaksi!
        </h2>
        <AudioPoolComponent
          className="audiofield__file"
          controls
          preload="metadata"
        />
      </div>
      <div className="timer-wrapper" id="timer">
        <div className="timer-row">
          <div className="timer-item" id="days">
            <div className="timer-item-number">{days}</div>
            <div className="timer-item-overlay"></div>
            <div className="timer-item-text">Päivää</div>
          </div>
          <div className="timer-item" id="hours">
            <div className="timer-item-number">{parsedHourses}</div>
            <div className="timer-item-overlay"></div>
            <div className="timer-item-text">Tuntia</div>
          </div>
        </div>
        <div className="timer-row">
          <div className="timer-item" id="minutes">
            <div className="timer-item-number">{parsedMinutes}</div>
            <div className="timer-item-overlay"></div>
            <div className="timer-item-text">Minuuttia</div>
          </div>
          <div className="timer-item" id="seconds">
            <div className="timer-item-number">{parsedSeconds}</div>
            <div className="timer-item-overlay"></div>
            <div className="timer-item-text">Sekuntia</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IndexFrontPage;
