package fi.otavanopisto.muikku.plugins.hops.rest;

public class AlternativeStudyOptionsRestModel {

  public String getNativeLanguageSelection() {
    return nativeLanguageSelection;
  }

  public void setNativeLanguageSelection(String nativeLanguageSelection) {
    this.nativeLanguageSelection = nativeLanguageSelection;
  }

  public String getReligionSelection() {
    return religionSelection;
  }

  public void setReligionSelection(String religionSelection) {
    this.religionSelection = religionSelection;
  }

  private String nativeLanguageSelection;
  private String religionSelection;
}
