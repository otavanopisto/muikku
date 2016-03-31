package fi.otavanopisto.muikku.search;

import java.util.List;
import java.util.Map;

public class SearchResult {

  public SearchResult(int totalHitCount, int firstResult, int lastResult, List<Map<String, Object>> results) {
    this.totalHitCount = totalHitCount;
    this.firstResult = firstResult;
    this.lastResult = lastResult;
    this.results = results;
  }

  public int getTotalHitCount() {
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

  private int totalHitCount;
  private int firstResult;
  private int lastResult;
  private List<Map<String, Object>> results;
}
