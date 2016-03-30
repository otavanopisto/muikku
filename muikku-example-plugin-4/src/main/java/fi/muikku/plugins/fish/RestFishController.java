package fi.otavanopisto.muikku.plugins.fish;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;

@Stateless
@Dependent
public class RestFishController {
  
  public FishMessage getMessage(int index) {
    return fishMessages.getMessages()[index];
  }
  
  public int getCount() {
    return (int)fishMessages.getCount();
  }
  
  public FishMessages getMessages() {
    return fishMessages; 
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
  
  private static final FishMessages fishMessages;
  
  static {
    FishMessage[] fishMessageArray = new FishMessage[texts.length];
    for (int i = 0; i < fishMessageArray.length; i++) {
      fishMessageArray[i] = new FishMessage(texts[i]);
    }
    
    fishMessages = new FishMessages(fishMessageArray);
  }
}
