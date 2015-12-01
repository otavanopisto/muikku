package fi.muikku.plugins.schooldatapyramus.rest.cache;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.ejb.Singleton;
import javax.enterprise.context.ApplicationScoped;

@ApplicationScoped
@Singleton
public class EntityCacheStatistics {
  
  @PostConstruct
  public void init() {
    statistics = new HashMap<>();
  }
  
  public void addHit(String type, String path) {
    getStatistics(type).addHit(path);
  }
  
  public void addMiss(String type, String path) {
    getStatistics(type).addMiss(path);
  }

  public void addSkip(String type, String path) {
    getStatistics(type).addSkip(path);
  }
  
  public List<String> getCacheTypes() {
    List<String> reuslt = new ArrayList<>(statistics.keySet());
    Collections.sort(reuslt);
    return reuslt;
  }
  
  public Statistics getStatistics(String type) {
    Statistics statistics = this.statistics.get(type);
    if (statistics == null) {
      statistics = new Statistics();
      this.statistics.put(type, statistics);
    }
    
    return statistics;
  }
  
  private Map<String, Statistics> statistics;
  
  public static class Statistics {
    
    public Statistics() {
      pathStatistics = new HashMap<>();
    }
    
    public void addSkip(String path) {
      getPathStatistics(path).incSkip();
    }

    public void addHit(String path) {
      getPathStatistics(path).incHit();
    }

    public void addMiss(String path) {
      getPathStatistics(path).incMiss();
    }
    
    public int getHits(String path) {
      return getPathStatistics(path).getHits();
    }
    
    public int getMisses(String path) {
      return getPathStatistics(path).getMisses();
    }

    public int getSkips(String path) {
      return getPathStatistics(path).getSkips();
    }
    
    public List<String> getPaths() {
      List<String> result = new ArrayList<>(pathStatistics.keySet());
      Collections.sort(result);
      return result;
    }
    
    private PathStatistics getPathStatistics(String path) {
      PathStatistics result = pathStatistics.get(path);
      if (result == null) {
        result = new PathStatistics();
        pathStatistics.put(path, result);
      }
      
      return result;
    }
    
    private Map<String, PathStatistics> pathStatistics;
  }
  
  public static class PathStatistics {
    
    public int getHits() {
      return hits;
    }
    
    public void incHit() {
      hits++;
    }
    
    public int getMisses() {
      return misses;
    }
    
    public void incMiss() {
      misses++;
    }
    
    public int getSkips() {
      return skips;
    }
    
    public void incSkip() {
      skips++;
    }
    
    private int hits;
    private int misses;
    private int skips;
  }
  
}
