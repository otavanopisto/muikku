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

import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.common.settings.ImmutableSettings.Builder;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.FilterBuilder;
import org.elasticsearch.index.query.FilterBuilders;
import org.elasticsearch.index.query.FilteredQueryBuilder;
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
    Builder settings = nodeBuilder().settings();
    settings.put("cluster.routing.allocation.disk.watermark.high", "99%");
    
    node = nodeBuilder()
      .settings(settings)
      .local(true)
      .node();
    
    elasticClient = node.client();
  }
  
  @Override
  public void deinit() {
    elasticClient.close();
    node.close();
  }
  
  private boolean isEmptyCollection(Collection<?> c) {
    if (c == null)
      return true;
    
    return c.isEmpty();
  }
  
  private String sanitizeSearchString(String query) {
    if (query == null)
      return null;
    
    // TODO: query_string search for case insensitive searches??
    // http://stackoverflow.com/questions/17266830/case-insensitivity-does-not-work
    String ret = query.toLowerCase();

    // Replace characters we don't support at the moment
    ret = ret.replace('-', ' ');
    
    ret = ret.trim();
    return ret;
  }
  
  @Override
  public SearchResult searchUsers(String text, String[] textFields, EnvironmentRoleArchetype archetype, 
      Collection<Long> groups, Collection<Long> workspaces, int start, int maxResults) {
    try {
      text = sanitizeSearchString(text);

      QueryBuilder query = QueryBuilders.matchAllQuery();

      List<FilterBuilder> filters = new ArrayList<FilterBuilder>();
      
      filters.add(FilterBuilders.notFilter(FilterBuilders.termFilter("hidden", true)));
      
      if (StringUtils.isNotBlank(text)) {
        StringTokenizer tokenizer = new StringTokenizer(text, " ");

        while (tokenizer.hasMoreTokens()) {
          String token = tokenizer.nextToken();

          List<FilterBuilder> fieldFilters = new ArrayList<FilterBuilder>();
          
          for (String textField : textFields)
            fieldFilters.add(FilterBuilders.prefixFilter(textField, token));
          
          if (!fieldFilters.isEmpty()) {
            if (fieldFilters.size() > 1)
              filters.add(FilterBuilders.orFilter(fieldFilters.toArray(new FilterBuilder[0])));
            else
              filters.add(fieldFilters.get(0));
          }
        }
      }
      
      if (archetype != null) {
        filters.add(FilterBuilders.termsFilter("archetype", archetype.name().toLowerCase())); 
      }
      
      if (!isEmptyCollection(groups)) {
        filters.add(FilterBuilders.inFilter("groups", ArrayUtils.toPrimitive(groups.toArray(new Long[0]))));
      }
      
      if (!isEmptyCollection(workspaces)) {
        filters.add(FilterBuilders.inFilter("workspaces", ArrayUtils.toPrimitive(workspaces.toArray(new Long[0]))));
      }
      
      FilterBuilder filter;
      
      if (!filters.isEmpty()) {
        if (filters.size() > 1)
          filter = FilterBuilders.andFilter(filters.toArray(new FilterBuilder[0]));
        else
          filter = filters.get(0);
      } else
        filter = FilterBuilders.matchAllFilter();
      
      FilteredQueryBuilder filteredQuery = QueryBuilders.filteredQuery(query, filter);

      SearchRequestBuilder requestBuilder = elasticClient
        .prepareSearch("muikku")
        .setTypes("User")
        .setFrom(start)
        .setSize(maxResults);

      SearchResponse response = requestBuilder
          .setQuery(filteredQuery)
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
    
    QueryBuilder query = QueryBuilders.matchAllQuery();
    
    freeText = sanitizeSearchString(freeText);
    
    try {
      List<FilterBuilder> filters = new ArrayList<FilterBuilder>();
      
      if (!includeUnpublished) {
        filters.add(FilterBuilders.termFilter("published", Boolean.TRUE));
      }
      
      if (StringUtils.isNotBlank(schoolDataSource)) {
        filters.add(FilterBuilders.termFilter("schoolDataSource", schoolDataSource.toLowerCase()));
      }
      
      if (subjects != null && !subjects.isEmpty()) {
        filters.add(FilterBuilders.termsFilter("subjectIdentifier", subjects));
      }
      
      if (identifiers != null) {
        filters.add(FilterBuilders.termsFilter("identifier", identifiers));
      }
  
      if (StringUtils.isNotBlank(freeText)) {
        FilterBuilder[] fieldFilters = {
            FilterBuilders.prefixFilter("name", freeText),
            FilterBuilders.prefixFilter("description", freeText)
        };

        filters.add(FilterBuilders.orFilter(fieldFilters));
      }
      
      FilterBuilder filter;

      if (!filters.isEmpty()) {
        if (filters.size() > 1)
          filter = FilterBuilders.andFilter(filters.toArray(new FilterBuilder[0]));
        else
          filter = filters.get(0);
      } else
        filter = FilterBuilders.matchAllFilter();
      
      FilteredQueryBuilder filteredQuery = QueryBuilders.filteredQuery(query, filter);
      
      SearchRequestBuilder requestBuilder = elasticClient
        .prepareSearch("muikku")
        .setTypes("Workspace")
        .setFrom(start)
        .setSize(maxResults);
      
      SearchResponse response = requestBuilder.setQuery(filteredQuery).execute().actionGet();
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
      query = sanitizeSearchString(query);
      
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
  
      SearchResponse response = requestBuilder
          .setQuery(boolQuery)
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
  public SearchResult freeTextSearch(String text, int start, int maxResults) {
    try {
      text = sanitizeSearchString(text);
      
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

  @Override
  public String getName() {
    return "elastic-search";
  }

  private Client elasticClient;
  private Node node;
}
