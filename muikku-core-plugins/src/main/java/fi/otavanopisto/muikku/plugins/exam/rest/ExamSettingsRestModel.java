package fi.otavanopisto.muikku.plugins.exam.rest;

import java.util.List;

public class ExamSettingsRestModel {
  
  public List<ExamSettingsCategory> getCategories() {
    return categories;
  }

  public void setCategories(List<ExamSettingsCategory> categories) {
    this.categories = categories;
  }

  public int getRandomCount() {
    return randomCount;
  }

  public void setRandomCount(int randomCount) {
    this.randomCount = randomCount;
  }

  public ExamSettingsRandom getRandom() {
    return random;
  }

  public void setRandom(ExamSettingsRandom random) {
    this.random = random;
  }

  public boolean isAllowMultipleAttempts() {
    return allowMultipleAttempts;
  }

  public void setAllowMultipleAttempts(boolean allowMultipleAttempts) {
    this.allowMultipleAttempts = allowMultipleAttempts;
  }

  public int getMinutes() {
    return minutes;
  }

  public void setMinutes(int minutes) {
    this.minutes = minutes;
  }

  public boolean isOpenForAll() {
    return openForAll;
  }

  public void setOpenForAll(boolean openForAll) {
    this.openForAll = openForAll;
  }

  // How assignments are randomized, if at all
  private ExamSettingsRandom random;
  
  // Number of assignments to randomly select when random = GLOBAL
  private int randomCount;
  
  // Categories for assignments
  private List<ExamSettingsCategory> categories;
  
  // Can the user do this exam multiple times
  private boolean allowMultipleAttempts;
  
  // Is the exam for all course students or only the chosen ones (oooh!)
  private boolean openForAll;
  
  // Number of minutes the exam is available once started; 0 if no time limit
  private int minutes;

}
