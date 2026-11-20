package fi.otavanopisto.muikku.rest;

import java.time.LocalDate;

public class VacationPeriod {

  public VacationPeriod(LocalDate start, LocalDate end) {
    this.start = start;
    this.end = end;
  }

  public LocalDate getStart() {
    return start;
  }

  public void setStart(LocalDate start) {
    this.start = start;
  }

  public LocalDate getEnd() {
    return end;
  }

  public void setEnd(LocalDate end) {
    this.end = end;
  }

  private LocalDate start;
  private LocalDate end;
}
