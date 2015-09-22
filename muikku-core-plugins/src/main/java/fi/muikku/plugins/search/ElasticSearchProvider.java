package fi.muikku.plugins.search;

import static org.elasticsearch.node.NodeBuilder.nodeBuilder;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.StringTokenizer;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.indices.IndexMissingException;
import org.elasticsearch.node.Node;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.sort.SortOrder;

import fi.muikku.model.users.EnvironmentRoleArchetype;
import fi.muikku.search.SearchProvider;
import fi.muikku.search.SearchResult;

@ApplicationScoped
@Stateful
public class ElasticSearchProvider implements SearchProvider {
  
  @Inject
  private Logger logger;

  @Override
  public void init() {
    Node node = nodeBuilder().local(true).node();
    elasticClient = node.client();
  }
  
  @Override
  public void deinit() {
    elasticClient.close();
  }
  
  private boolean isEmptyCollection(Collection<?> c) {
    if (c == null)
      return true;
    
    return c.isEmpty();
  }
  
  @Override
  public SearchResult searchUsers(String text, String[] textFields, EnvironmentRoleArchetype archetype, 
      Collection<Long> groups, Collection<Long> workspaces, int start, int maxResults) {
    try {
      // TODO: query_string search for case insensitive searches??
      // http://stackoverflow.com/questions/17266830/case-insensitivity-does-not-work
      text = text != null ? text.toLowerCase() : null;

      QueryBuilder query = null;

      if ((archetype == null) && StringUtils.isBlank(text) && isEmptyCollection(groups) && isEmptyCollection(workspaces)) {
        query = QueryBuilders.matchAllQuery();
      } else {
        query = QueryBuilders.boolQuery();
        
        if (archetype != null) {
          ((BoolQueryBuilder) query).must(QueryBuilders.termsQuery("archetype", archetype.name().toLowerCase()));
        }
    
        if (!isEmptyCollection(groups)) {
          ((BoolQueryBuilder) query).must(QueryBuilders.termsQuery("groups", groups));
        }

        if (!isEmptyCollection(workspaces)) {
          ((BoolQueryBuilder) query).must(QueryBuilders.termsQuery("workspaces", workspaces));
        }
    
        if (StringUtils.isNotBlank(text)) {
          StringTokenizer tokenizer = new StringTokenizer(text, " ");

          while (tokenizer.hasMoreTokens()) {
            String token = tokenizer.nextToken();

            for (String textField : textFields)
              ((BoolQueryBuilder) query).should(QueryBuilders.prefixQuery(textField, token));
          }
        }
      }
      
      SearchRequestBuilder requestBuilder = elasticClient
        .prepareSearch("muikku")
        .setTypes("User")
        .setFrom(start)
        .setSize(maxResults);

      SearchResponse response = requestBuilder
          .setQuery(query)
          .addSort("_score", SortOrder.DESC)
          .addSort("lastName", SortOrder.ASC)
          .addSort("firstName", SortOrder.ASC)
          .execute()
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
    } catch (IndexMissingException ime) {
      return new SearchResult(0, 0, 0, new ArrayList<Map<String,Object>>()); 
    } catch (Exception e) {
      logger.log(Level.SEVERE, "ElasticSearch query failed unexpectedly", e);
      return new SearchResult(0, 0, 0, new ArrayList<Map<String,Object>>()); 
    }
  }
  
  @Override
  public SearchResult searchWorkspaces(String schoolDataSource, List<String> subjects, List<String> identifiers, String freeText, boolean includeUnpublished, int start, int maxResults) {
    if (identifiers != null && identifiers.isEmpty()) {
      return new SearchResult(0, 0, 0, new ArrayList<Map<String,Object>>());
    }
    
    QueryBuilder query = null;
    
    try {
      if (StringUtils.isBlank(schoolDataSource) && (subjects == null || subjects.isEmpty()) && StringUtils.isBlank(freeText)) {
        if (includeUnpublished) {
          query = QueryBuilders.matchAllQuery();
        } else {
          query = QueryBuilders.matchQuery("published", Boolean.TRUE);
        }
      } else {
        query = QueryBuilders.boolQuery();
        
        if (!includeUnpublished) {
          ((BoolQueryBuilder) query).must(QueryBuilders.matchQuery("published",Boolean.TRUE));
        }
        
        if (StringUtils.isNotBlank(schoolDataSource)) {
          ((BoolQueryBuilder) query).must(QueryBuilders.matchQuery("schoolDataSource", schoolDataSource));
        }
        
        if (subjects != null && !subjects.isEmpty()) {
          ((BoolQueryBuilder) query).must(QueryBuilders.termsQuery("subjectIdentifier", subjects));
        }
        
        if (identifiers != null) {
          ((BoolQueryBuilder) query).must(QueryBuilders.termsQuery("identifier", identifiers));
        }
    
        if (StringUtils.isNotBlank(freeText)) {
          ((BoolQueryBuilder) query).should(QueryBuilders.prefixQuery("name", freeText));
          ((BoolQueryBuilder) query).should(QueryBuilders.prefixQuery("description", freeText));
        }
      }
      
      SearchRequestBuilder requestBuilder = elasticClient
        .prepareSearch("muikku")
        .setTypes("Workspace")
        .setFrom(start)
        .setSize(maxResults);
      
      SearchResponse response = requestBuilder.setQuery(query).execute().actionGet();
      List<Map<String, Object>> searchResults = new ArrayList<Map<String, Object>>();
      SearchHit[] results = response.getHits().getHits();
      for (SearchHit hit : results) {
        Map<String, Object> hitSource = hit.getSource();
        hitSource.put("indexType", hit.getType());
        searchResults.add(hitSource);
      }
      
      SearchResult result = new SearchResult(searchResults.size(), start, maxResults, searchResults);
      return result;
    } catch (IndexMissingException ime) {
      return new SearchResult(0, 0, 0, new ArrayList<Map<String,Object>>()); 
    } catch (Exception e) {
      logger.log(Level.SEVERE, "ElasticSearch query failed unexpectedly", e);
      return new SearchResult(0, 0, 0, new ArrayList<Map<String,Object>>()); 
    }
  }
  
  @Override
  public SearchResult search(String query, String[] fields, int start, int maxResults, Class<?>... types) {
    try {
      // TODO: query_string search for case insensitive searches??
      // http://stackoverflow.com/questions/17266830/case-insensitivity-does-not-work
      query = query != null ? query.toLowerCase() : null;
      
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
    } catch (IndexMissingException ime) {
      return new SearchResult(0, 0, 0, new ArrayList<Map<String,Object>>()); 
    } catch (Exception e) {
      logger.log(Level.SEVERE, "ElasticSearch query failed unexpectedly", e);
      return new SearchResult(0, 0, 0, new ArrayList<Map<String,Object>>()); 
    }
  }

  @Override
  public SearchResult freeTextSearch(String text, int start, int maxResults) {
    try {
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
    } catch (IndexMissingException ime) {
      return new SearchResult(0, 0, 0, new ArrayList<Map<String,Object>>()); 
    } catch (Exception e) {
      logger.log(Level.SEVERE, "ElasticSearch query failed unexpectedly", e);
      return new SearchResult(0, 0, 0, new ArrayList<Map<String,Object>>()); 
    }
  }

  @Override
  public SearchResult matchAllSearch(int start, int maxResults) {
    try {
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
    } catch (IndexMissingException ime) {
      return new SearchResult(0, 0, 0, new ArrayList<Map<String,Object>>()); 
    } catch (Exception e) {
      logger.log(Level.SEVERE, "ElasticSearch query failed unexpectedly", e);
      return new SearchResult(0, 0, 0, new ArrayList<Map<String,Object>>()); 
    }
  }
  
  @Override
  public SearchResult matchAllSearch(int start, int maxResults, Class<?>... types) {
    try {
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

    } catch (IndexMissingException ime) {
      return new SearchResult(0, 0, 0, new ArrayList<Map<String,Object>>()); 
    } catch (Exception e) {
      logger.log(Level.SEVERE, "ElasticSearch query failed unexpectedly", e);
      return new SearchResult(0, 0, 0, new ArrayList<Map<String,Object>>()); 
    }
  }

  private Client elasticClient;

  @Override
  public String getName() {
    return "elastic-search";
  }

}
