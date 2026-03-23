package fi.otavanopisto.muikku.atests;

import java.util.List;

public class HopsCourseMatrixSubject {

  public String getName() {
    return name;
  }
  public void setName(String name) {
    this.name = name;
  }
  public String getCode() {
    return code;
  }
  public void setCode(String code) {
    this.code = code;
  }
  public List<HopsCourseMatrixModule> getModules() {
    return modules;
  }
  public void setModules(List<HopsCourseMatrixModule> modules) {
    this.modules = modules;
  }
  public boolean isChoiceSubject() {
    return choiceSubject;
  }
  public void setChoiceSubject(boolean choiceSubject) {
    this.choiceSubject = choiceSubject;
  }
  public boolean isHiddenFromHops() {
    return hiddenFromHops;
  }
  public void setHiddenFromHops(boolean hiddenFromHops) {
    this.hiddenFromHops = hiddenFromHops;
  }

  private String name;
  private String code;
  private List<HopsCourseMatrixModule> modules;
  private boolean choiceSubject;
  private boolean hiddenFromHops;
  
}
