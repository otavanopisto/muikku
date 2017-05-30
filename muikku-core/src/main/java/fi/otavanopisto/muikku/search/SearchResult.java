package fi.otavanopisto.muikku.search;

import java.util.List;
import java.util.Map;

public class SearchResult {

  public SearchResult(int firstResult, int lastResult, List<Map<String, Object>> results, long totalHitCount) {
    this.totalHitCount = totalHitCount;
    this.firstResult = firstResult;
    this.lastResult = lastResult;
    this.results = results;
  }

  public long getTotalHitCount() {
    return totalHitCount;
  }

  public List<Map<String, Object>> getResults() {
    return results;
  }

  public int getFirstResult() {
    return firstResult;
  }

  public int getLastResult() {
    return lastResult;
  }

  private long totalHitCount;
  private int firstResult;
  private int lastResult;
  private List<Map<String, Object>> results;
}
