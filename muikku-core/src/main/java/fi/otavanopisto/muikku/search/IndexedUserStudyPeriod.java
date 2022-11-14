package fi.otavanopisto.muikku.search;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

import fi.otavanopisto.muikku.schooldata.entity.UserStudyPeriodType;

public class IndexedUserStudyPeriod {
 
  public IndexedUserStudyPeriod() {
  }
  
  public IndexedUserStudyPeriod(LocalDate begin, LocalDate end, UserStudyPeriodType type) {
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

  @JsonFormat(pattern="yyyy-MM-dd")
  private LocalDate begin;
  @JsonFormat(pattern="yyyy-MM-dd")
  private LocalDate end;
  private UserStudyPeriodType type;
}
