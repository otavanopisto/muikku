package fi.otavanopisto.muikku.schooldata.entity;

import java.time.LocalDate;

public class UserStudyPeriod {

  public UserStudyPeriod() {
  }
  
  public UserStudyPeriod(LocalDate begin, LocalDate end, UserStudyPeriodType type) {
    this.begin = begin;
    this.end = end;
    this.type = type;
  }

  public LocalDate getBegin() {
    return begin;
  }
  
  public void setBegin(LocalDate begin) {
    this.begin = begin;
  }

  public LocalDate getEnd() {
    return end;
  }

  public void setEnd(LocalDate end) {
    this.end = end;
  }

  public UserStudyPeriodType getType() {
    return type;
  }

  public void setType(UserStudyPeriodType type) {
    this.type = type;
  }

  private LocalDate begin;
  private LocalDate end;
  private UserStudyPeriodType type;
}
