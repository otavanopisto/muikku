package fi.muikku.plugins.search;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.elasticsearch.action.delete.DeleteResponse;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.node.Node;
import org.elasticsearch.search.SearchHit;

import static org.elasticsearch.node.NodeBuilder.*;

@ApplicationScoped
@Stateful
public class ElasticSearchProvider implements SearchProvider {

  private Client elasticClient;

  @Inject
  private Logger logger;

  @PostConstruct
  public void init() {
    Node node = nodeBuilder().node();
    elasticClient = node.client();
  }

  @PreDestroy
  public void shutdown() {
    elasticClient.close();
  }

  @Override
  public SearchResult search(Map<String, String> Query, int start, int lastResult, Class<?>... types) {
    String[] typenames = new String[types.length];
    for (int i = 0; i < types.length; i++) {
      typenames[i] = types[i].getSimpleName();
    }
    SearchResponse response = elasticClient.prepareSearch("muikku").setTypes(typenames).setQuery(Query).execute().actionGet();
    List<Map<String, Object>> searchResults = new ArrayList<Map<String, Object>>();
    SearchHit[] results = response.getHits().getHits();
    for (SearchHit hit : results) {
      Map<String,Object> hitSource = hit.getSource();
      searchResults.add(hitSource);
    }
    SearchResult result = new SearchResult(searchResults.size(), start, lastResult, searchResults);
    return result;
  }
  
  @Override
  public SearchResult freeTextSearch(String text, int start, int lastResult) {
    SearchResponse response = elasticClient.prepareSearch().setQuery(
          QueryBuilders.matchQuery("_all", text)
        ).setFrom(start).setSize(lastResult).execute().actionGet();
    List<Map<String, Object>> searchResults = new ArrayList<Map<String, Object>>();
    SearchHit[] results = response.getHits().getHits();
    for (SearchHit hit : results) {
      Map<String,Object> hitSource = hit.getSource();
      searchResults.add(hitSource);
    }
    SearchResult result = new SearchResult(searchResults.size(), start, lastResult, searchResults);
    return result;
  }

  @Override
  public SearchResult matchAllSearch(int start, int lastResult) {
    SearchResponse response = elasticClient.prepareSearch().setQuery(
          QueryBuilders.matchAllQuery()
        ).setFrom(start).setSize(lastResult).execute().actionGet();
    List<Map<String, Object>> searchResults = new ArrayList<Map<String, Object>>();
    SearchHit[] results = response.getHits().getHits();
    for (SearchHit hit : results) {
      Map<String,Object> hitSource = hit.getSource();
      searchResults.add(hitSource);
    }
    SearchResult result = new SearchResult(searchResults.size(), start, lastResult, searchResults);
    return result;
    
  }

  @Override
  public void addToIndex(Map<String, Object> entity) {
    ObjectMapper mapper = new ObjectMapper();
    String json;
    try {
      json = mapper.writeValueAsString(entity);
      JsonNode objectRoot = mapper.readTree(json);
      String id = objectRoot.get("id").asText();
      IndexResponse response = elasticClient.prepareIndex("muikku", entity.getClass().getSimpleName(), id).setSource(json).execute().actionGet();
    } catch (IOException e) {
      logger.log(Level.SEVERE, "Adding to index failed because of exception", e);
    }

  }

  @Override
  public void deleteFromIndex(Map<String, Object> entity) { // Map<String, Object>
    ObjectMapper mapper = new ObjectMapper();
    String json;
    try {
      json = mapper.writeValueAsString(entity);
      JsonNode objectRoot = mapper.readTree(json);
      String id = objectRoot.path("id").getTextValue();
      DeleteResponse response = elasticClient.prepareDelete("muikku", entity.getClass().getSimpleName(), id).execute().actionGet();
    } catch (IOException e) {
      logger.log(Level.SEVERE, "Removing item from index failed because of exception", e);
    }

  }



}
