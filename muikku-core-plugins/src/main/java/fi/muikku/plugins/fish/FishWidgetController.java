package fi.muikku.plugins.fish;

import javax.ejb.Stateful;
import javax.enterprise.inject.Model;

@Model
@Stateful
public class FishWidgetController {
  
  public String getText(Long widgetId) {
    int index = Double.valueOf(Math.round(Math.random() * (texts.length - 1))).intValue();
    return texts[index];
  }
  
  private String[] texts = {
    "Pilkkiin en tartu enää!",
    "Vastarannan kiiski?",
    "Kuin kala verkossa",
    "Vastustan verkkokalastusta",
    "Sano muikku!",
    "Hyppää sekaan soppaan",
    "Simmut kiinni kun sukellat",
    "Tieto ei kellu, se pitää sukeltaa",
    "Älä anna virran viedä",
    "Kuka pelkää paholaisrauskua",
    "Onpa komia kampela",
    "Älä elä suomut silmillä",
    "Kato, kalapuikko!",
    "Liikaa happea, taju lähtee",
    "Jansson kiusaa mua",
    "Hauki on kala",
    "Syökää kanaa, syökää kanaa!",
    "Ajattelen, siis olen!",
    "Parsa!"
  };
}
