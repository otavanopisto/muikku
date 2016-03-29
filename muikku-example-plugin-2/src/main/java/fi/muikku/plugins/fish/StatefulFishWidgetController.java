package fi.otavanopisto.muikku.plugins.fish;

import java.io.Serializable;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;

@Stateless
@Dependent
public class StatefulFishWidgetController implements Serializable {
  
  /**
   * 
   */
  private static final long serialVersionUID = -4444032147234323954L;

  public String getText(int index) {
    return texts[index];
  }
  
  public int getCount() {
    return texts.length;
  }
  
  private static final String[] texts = {
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
  };
}
