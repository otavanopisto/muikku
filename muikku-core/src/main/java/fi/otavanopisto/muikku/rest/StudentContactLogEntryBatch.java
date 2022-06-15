package fi.otavanopisto.muikku.rest;

import java.util.List;

public class StudentContactLogEntryBatch {
  
  public StudentContactLogEntryBatch() {
    
  }

  public StudentContactLogEntryBatch(int firstResult, List<StudentContactLogEntryRestModel> results, long totalHitCount) {
    this.totalHitCount= totalHitCount;
    this.results = results;
    this.firstResult = firstResult;
  }

  public long getTotalHitCount() {
    return totalHitCount;
  }
  public void setTotalHitCount(long totalHitCount) {
    this.totalHitCount = totalHitCount;
  }


  public int getFirstResult() {
    return firstResult;
  }


  public void setFirstResult(int firstResult) {
    this.firstResult = firstResult;
  }


  public List<StudentContactLogEntryRestModel> getResults() {
    return results;
  }


  public void setResults(List<StudentContactLogEntryRestModel> results) {
    this.results = results;
  }


  private long totalHitCount;
  private int firstResult;
  private List<StudentContactLogEntryRestModel> results;

}