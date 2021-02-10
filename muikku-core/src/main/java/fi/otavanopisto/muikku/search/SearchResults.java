package fi.otavanopisto.muikku.search;

public class SearchResults<T> {

  public SearchResults(int firstResult, int lastResult, T results, long totalHitCount) {
    this.totalHitCount = totalHitCount;
    this.firstResult = firstResult;
    this.lastResult = lastResult;
    this.results = results;
  }

  public long getTotalHitCount() {
    return totalHitCount;
  }

  public T getResults() {
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
  private T results;
}
