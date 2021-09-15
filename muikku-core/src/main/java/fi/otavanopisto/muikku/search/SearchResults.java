package fi.otavanopisto.muikku.search;

public class SearchResults<T> {

  public SearchResults(int firstResult, T results, long totalHitCount) {
    this.totalHitCount = totalHitCount;
    this.firstResult = firstResult;
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

  private long totalHitCount;
  private int firstResult;
  private T results;
}
