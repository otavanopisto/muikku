package fi.muikku.plugins.schooldatapyramus.rest.cache;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.ejb.Singleton;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

@ApplicationScoped
@Singleton
public class EntityCacheStatistics {
  
  @Inject
  private Logger logger;
  
  @PostConstruct
  public void init() {
    statistics = new HashMap<>();
  }
  
  public void addHit(String type, String path) {
    getStatistics(type).addHit(path);
    logger.log(Level.INFO, String.format("(%s) Hits %d in %s", type, getStatistics(type).getHits(path), path));
  }
  
  public void addMiss(String type, String path) {
    getStatistics(type).addMiss(path);
    logger.log(Level.INFO, String.format("(%s) Misses %d in %s", type, getStatistics(type).getMisses(path), path));
  }

  public void addSkip(String type, String path) {
    getStatistics(type).addSkip(path);
    logger.log(Level.INFO, String.format("(%s) Skips %d in %s", type, getStatistics(type).getSkips(path), path));
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
