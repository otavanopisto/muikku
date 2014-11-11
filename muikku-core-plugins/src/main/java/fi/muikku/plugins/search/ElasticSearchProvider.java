package fi.muikku.plugins.search;

import static org.elasticsearch.node.NodeBuilder.nodeBuilder;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.codehaus.jackson.map.ObjectMapper;
import org.elasticsearch.action.delete.DeleteResponse;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.node.Node;
import org.elasticsearch.search.SearchHit;

import fi.muikku.search.SearchProvider;
import fi.muikku.search.SearchResult;

@ApplicationScoped
@Stateful
public class ElasticSearchProvider implements SearchProvider {

  @Inject
  private Logger logger;

  @Override
  public void init() {
    Node node = nodeBuilder().node();
    elasticClient = node.client();
  }
  
  @Override
  public void deinit() {
    elasticClient.close();
  }
  
  
  @Override
  public SearchResult search(String query, String[] fields, int start, int maxResults, Class<?>... types) {
    String[] typenames = new String[types.length];
    for (int i = 0; i < types.length; i++) {
      typenames[i] = types[i].getSimpleName();
    }
    
    SearchRequestBuilder requestBuilder = elasticClient
        .prepareSearch("muikku")
        .setTypes(typenames)
        .setFrom(start)
        .setSize(maxResults);
    
    BoolQueryBuilder boolQuery = QueryBuilders.boolQuery();
    for (String field : fields) {
      boolQuery.should(QueryBuilders.prefixQuery(field, query));
    }

    SearchResponse response = requestBuilder.setQuery(boolQuery).execute().actionGet();
    
    List<Map<String, Object>> searchResults = new ArrayList<Map<String, Object>>();
    SearchHit[] results = response.getHits().getHits();
    for (SearchHit hit : results) {
      Map<String, Object> hitSource = hit.getSource();
      hitSource.put("indexType", hit.getType());
      searchResults.add(hitSource);
    }
    SearchResult result = new SearchResult(searchResults.size(), start, maxResults, searchResults);
    return result;
  }

  @Override
  public SearchResult freeTextSearch(String text, int start, int maxResults) {
    SearchResponse response = elasticClient.prepareSearch().setQuery(QueryBuilders.matchQuery("_all", text)).setFrom(start).setSize(maxResults).execute()
        .actionGet();
    List<Map<String, Object>> searchResults = new ArrayList<Map<String, Object>>();
    SearchHit[] results = response.getHits().getHits();
    for (SearchHit hit : results) {
      Map<String, Object> hitSource = hit.getSource();
      hitSource.put("indexType", hit.getType());
      searchResults.add(hitSource);
    }
    SearchResult result = new SearchResult(searchResults.size(), start, maxResults, searchResults);
    return result;
  }

  @Override
  public SearchResult matchAllSearch(int start, int maxResults) {
    SearchResponse response = elasticClient.prepareSearch().setQuery(QueryBuilders.matchAllQuery()).setFrom(start).setSize(maxResults).execute().actionGet();
    List<Map<String, Object>> searchResults = new ArrayList<Map<String, Object>>();
    SearchHit[] results = response.getHits().getHits();
    for (SearchHit hit : results) {
      Map<String, Object> hitSource = hit.getSource();
      hitSource.put("indexType", hit.getType());
      searchResults.add(hitSource);
    }
    SearchResult result = new SearchResult(searchResults.size(), start, maxResults, searchResults);
    return result;
    
  }
  
  @Override
  public SearchResult matchAllSearch(int start, int maxResults, Class<?>... types) {
    String[] typenames = new String[types.length];
    for (int i = 0; i < types.length; i++) {
      typenames[i] = types[i].getSimpleName();
    }
    
    SearchRequestBuilder requestBuilder = elasticClient
        .prepareSearch("muikku")
        .setQuery(QueryBuilders.matchAllQuery())
        .setTypes(typenames)
        .setFrom(start)
        .setSize(maxResults);
    
    SearchResponse response = requestBuilder.execute().actionGet();
    List<Map<String, Object>> searchResults = new ArrayList<Map<String, Object>>();
    SearchHit[] results = response.getHits().getHits();
    for (SearchHit hit : results) {
      Map<String, Object> hitSource = hit.getSource();
      hitSource.put("indexType", hit.getType());
      searchResults.add(hitSource);
    }
    SearchResult result = new SearchResult(searchResults.size(), start, maxResults, searchResults);
    return result;
  }

  @Override
  public synchronized void addOrUpdateIndex(String typeName, Map<String, Object> entity) {
    ObjectMapper mapper = new ObjectMapper();
    String json;
    try {
      json = mapper.writeValueAsString(entity);
      String id = entity.get("id").toString();
      @SuppressWarnings("unused")
      IndexResponse response = elasticClient.prepareIndex("muikku", typeName, id).setSource(json).execute().actionGet();
    } catch (IOException e) {
      logger.log(Level.WARNING, "Adding to index failed because of exception", e);
    }
  }

  @Override
  public synchronized void deleteFromIndex(String typeName, String id) {
    @SuppressWarnings("unused")
    DeleteResponse response = elasticClient.prepareDelete("muikku", typeName, id).execute().actionGet();
  }

  private Client elasticClient;

  @Override
  public String getName() {
    return "elastic-search";
  }

}
