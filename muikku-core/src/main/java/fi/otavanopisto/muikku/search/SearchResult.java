package fi.otavanopisto.muikku.search;

import java.util.List;
import java.util.Map;

public class SearchResult {

  public SearchResult(int firstResult, List<Map<String, Object>> results, long totalHitCount) {
    this.totalHitCount = totalHitCount;
    this.firstResult = firstResult;
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

  private long totalHitCount;
  private int firstResult;
  private List<Map<String, Object>> results;
}
