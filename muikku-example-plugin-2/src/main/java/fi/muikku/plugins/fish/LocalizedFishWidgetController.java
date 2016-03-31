package fi.otavanopisto.muikku.plugins.fish;

import javax.ejb.Stateless;
import javax.enterprise.context.Dependent;

@Stateless
@Dependent
public class LocalizedFishWidgetController {
  
  public String getText(int index) {
    return texts[index];
  }
  
  public int getCount() {
    return texts.length;
  }
  
  private static final String[] texts = {
    "plugin.fish.message_01",
    "plugin.fish.message_02",
    "plugin.fish.message_03",
    "plugin.fish.message_04",
    "plugin.fish.message_05",
    "plugin.fish.message_06",
    "plugin.fish.message_07",
    "plugin.fish.message_08",
    "plugin.fish.message_09",
    "plugin.fish.message_10",
    "plugin.fish.message_11",
    "plugin.fish.message_12",
    "plugin.fish.message_13",
    "plugin.fish.message_14",
    "plugin.fish.message_15",
    "plugin.fish.message_16",
    "plugin.fish.message_17",
    "plugin.fish.message_18",
  };
}