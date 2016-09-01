package fi.otavanopisto.muikku.plugins.search;

import static org.elasticsearch.index.query.QueryBuilders.boolQuery;
import static org.elasticsearch.index.query.QueryBuilders.existsQuery;
import static org.elasticsearch.index.query.QueryBuilders.idsQuery;
import static org.elasticsearch.index.query.QueryBuilders.matchAllQuery;
import static org.elasticsearch.index.query.QueryBuilders.matchQuery;
import static org.elasticsearch.index.query.QueryBuilders.prefixQuery;
import static org.elasticsearch.index.query.QueryBuilders.rangeQuery;
import static org.elasticsearch.index.query.QueryBuilders.termQuery;
import static org.elasticsearch.index.query.QueryBuilders.termsQuery;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.IdsQueryBuilder;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHitField;
import org.elasticsearch.search.sort.SortOrder;
import java.time.OffsetDateTime;
import java.time.temporal.ChronoField;
import java.time.temporal.ChronoUnit;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.workspace.WorkspaceAccess;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.search.SearchResult;

@ApplicationScoped
public class ElasticSearchProvider implements SearchProvider {
  
  @Inject
  private Logger logger;

  @Inject
  private WorkspaceEntityController workspaceEntityController;
  
  @Inject
  private PluginSettingsController pluginSettingsController;
  
  @Override
  public void init() {
    String clusterName = pluginSettingsController.getPluginSetting("elastic-search", "clusterName");
    if (clusterName == null) {
      clusterName = System.getProperty("elasticsearch.cluster.name");
    }
    if (clusterName == null) {
      clusterName = "elasticsearch";
    }
    String portNumberProperty = System.getProperty("elasticsearch.node.port");
    int portNumber;
    if (portNumberProperty != null) {
      portNumber = Integer.decode(portNumberProperty);
    } else {
      portNumber = 9300;
    }

    Settings settings = Settings.settingsBuilder()
        .put("cluster.name", clusterName).build();
    
    try {
      elasticClient = TransportClient.builder().settings(settings).build()
          .addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName("127.0.0.1"), portNumber));
   } catch (UnknownHostException e) {
      logger.log(Level.SEVERE, "Failed to connect to elasticsearch cluster", e);
      return;
    }
    
  }
  
  @Override
  public void deinit() {
    elasticClient.close();
    //node.close();
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
  public SearchResult searchUsers(String text, String[] textFields, Collection<EnvironmentRoleArchetype> archetypes, 
      Collection<Long> groups, Collection<Long> workspaces, Collection<SchoolDataIdentifier> userIdentifiers,
      Boolean includeInactiveStudents, Boolean includeHidden, int start, int maxResults, Collection<String> fields, Collection<SchoolDataIdentifier> excludeSchoolDataIdentifiers, Date startedStudiesBefore, Date studyTimeEndsBefore){
    try {
      text = sanitizeSearchString(text);

      BoolQueryBuilder query = boolQuery();
      
      if (!Boolean.TRUE.equals(includeHidden)) {
        query.mustNot(termQuery("hidden", true));
      }
      
      if (StringUtils.isNotBlank(text)) {
        String[] words = text.split(" ");
        for (int i = 0; i < words.length; i++) {
          if (StringUtils.isNotBlank(words[i])) {
            BoolQueryBuilder fieldBuilder = boolQuery();
            for (String textField : textFields) {
              fieldBuilder.should(prefixQuery(textField, words[i]));
            }
            query.must(fieldBuilder);
          }
        }
      }
      
      if (excludeSchoolDataIdentifiers != null) {
        IdsQueryBuilder excludeIdsQuery = idsQuery("User");
        
        for (SchoolDataIdentifier excludeSchoolDataIdentifier : excludeSchoolDataIdentifiers) {
          excludeIdsQuery.addIds(String.format("%s/%s", excludeSchoolDataIdentifier.getIdentifier(), excludeSchoolDataIdentifier.getDataSource()));
        }
        query.mustNot(excludeIdsQuery);
      }
      
      if (startedStudiesBefore != null ) {
        query.must(rangeQuery("studyStartDate").lt(startedStudiesBefore.getTime()));
      }
      
      if(studyTimeEndsBefore != null) {
        query.must(rangeQuery("studyTimeEnd").lt(studyTimeEndsBefore.getTime()));
      }
      
      if (archetypes != null) {
        List<String> archetypeNames = new ArrayList<>(archetypes.size());
        for (EnvironmentRoleArchetype archetype : archetypes) {
          archetypeNames.add(archetype.name().toLowerCase());
        }

        query.must(termsQuery("archetype", archetypeNames.toArray(new String[0]))); 
      }
      
      if (!isEmptyCollection(groups)) {
        query.must(termsQuery("groups", ArrayUtils.toPrimitive(groups.toArray(new Long[0]))));
      }

      if (!isEmptyCollection(workspaces)) {
        query.must(termsQuery("workspaces", ArrayUtils.toPrimitive(workspaces.toArray(new Long[0]))));
      }
      
      if (userIdentifiers != null) {
        IdsQueryBuilder includeIdsQuery = idsQuery("User");
        for (SchoolDataIdentifier userIdentifier : userIdentifiers) {
          includeIdsQuery.addIds(String.format("%s/%s", userIdentifier.getIdentifier(), userIdentifier.getDataSource()));
        }
        query.must(includeIdsQuery);
      }

      if (includeInactiveStudents == false) {
        /**
         * List only active users. 
         * 
         * Active user is:
         * 
         * StaffMember (TEACHER, MANAGER, ADMINISTRATOR, STUDY PROGRAMME LEADER) or
         * Student that has
         *   active flag true or
         *     has not started nor finished studies (ie. in study programme that never expires) and
         *     is student in active workspace
         *   
         * Active workspace is:
         *   published and
         *   non-stop (no start and end dates) or
         *   current date is between start and end date
         */
        
        Set<Long> activeWorkspaceEntityIds = getActiveWorkspaces();
        
        query.must(
            boolQuery()
              .should(termsQuery("archetype",
                  EnvironmentRoleArchetype.TEACHER.name().toLowerCase(),
                  EnvironmentRoleArchetype.MANAGER.name().toLowerCase(),
                  EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER.name().toLowerCase(),
                  EnvironmentRoleArchetype.ADMINISTRATOR.name().toLowerCase()))
              .should(boolQuery()
                  .must(termQuery("archetype", EnvironmentRoleArchetype.STUDENT.name().toLowerCase()))
                  .must(termQuery("startedStudies", true))
                  .mustNot(termQuery("active", false)))
              .should(boolQuery()
                  .must(termQuery("archetype", EnvironmentRoleArchetype.STUDENT.name().toLowerCase()))
                  .must(termQuery("startedStudies", false))
                  .must(termQuery("finishedStudies", false))
                  .must(termsQuery("workspaces", ArrayUtils.toPrimitive(activeWorkspaceEntityIds.toArray(new Long[0]))))));
      }

      SearchRequestBuilder requestBuilder = elasticClient
        .prepareSearch("muikku")
        .setTypes("User")
        .setFrom(start)
        .setSize(maxResults);
      
      if (!isEmptyCollection(fields)) {
        requestBuilder.addFields(fields.toArray(new String[0]));
      }
      
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
        if(hitSource == null){
          hitSource = new HashMap<>();
          for(String key : hit.getFields().keySet()){
            hitSource.put(key, hit.getFields().get(key).getValue().toString());
          }
        }
        hitSource.put("indexType", hit.getType());
        searchResults.add(hitSource);
      }
      
      SearchResult result = new SearchResult(searchResults.size(), start, maxResults, searchResults);
      return result;
    } catch (Exception e) {
      logger.log(Level.SEVERE, "ElasticSearch query failed unexpectedly", e);
      return new SearchResult(0, 0, 0, new ArrayList<Map<String,Object>>()); 
    }
  }
  
  @Override
  public SearchResult searchUsers(String text, String[] textFields, Collection<EnvironmentRoleArchetype> archetypes, 
      Collection<Long> groups, Collection<Long> workspaces, Collection<SchoolDataIdentifier> userIdentifiers,
      Boolean includeInactiveStudents, Boolean includeHidden, int start, int maxResults, Collection<String> fields, Collection<SchoolDataIdentifier> excludeSchoolDataIdentifiers, Date startedStudiesBefore){
    return searchUsers(text, textFields, archetypes, groups, workspaces, userIdentifiers, includeInactiveStudents, includeHidden, start, maxResults, fields, excludeSchoolDataIdentifiers, startedStudiesBefore, null);
  }
  
  @Override
  public SearchResult searchUsers(String text, String[] textFields, Collection<EnvironmentRoleArchetype> archetypes, 
      Collection<Long> groups, Collection<Long> workspaces, Collection<SchoolDataIdentifier> userIdentifiers,
      Boolean includeInactiveStudents, Boolean includeHidden, int start, int maxResults) {
    return searchUsers(text, textFields, archetypes, groups, workspaces, userIdentifiers, includeInactiveStudents, includeHidden, start, maxResults, null);
  }
  
  @Override
  public SearchResult searchUsers(String text, String[] textFields, Collection<EnvironmentRoleArchetype> archetypes, 
      Collection<Long> groups, Collection<Long> workspaces, Collection<SchoolDataIdentifier> userIdentifiers,
      Boolean includeInactiveStudents, Boolean includeHidden, int start, int maxResults, Collection<String> fields) {
    return searchUsers(text, textFields, archetypes, groups, workspaces, userIdentifiers, includeInactiveStudents, includeHidden, start, maxResults, fields, null, null);
  }
  
  private Set<Long> getActiveWorkspaces() {
    OffsetDateTime now = OffsetDateTime.now();
    OffsetDateTime low = now.with(ChronoField.MILLI_OF_DAY, 0);
    OffsetDateTime high = low.plusDays(1).minus(1, ChronoUnit.MILLIS); 
    
    BoolQueryBuilder query = boolQuery();
    
    query.must(termQuery("published", Boolean.TRUE));
    query
        .should(boolQuery()
          .must(existsQuery("beginDate"))
          .must(existsQuery("endDate")))
        .should(boolQuery()
          .must(rangeQuery("beginDate").lte(low.toInstant().toEpochMilli()))
          .must(rangeQuery("endDate").gte(high.toInstant().toEpochMilli())));

    SearchResponse response = elasticClient
      .prepareSearch("muikku")
      .setTypes("Workspace")
      .setQuery(query)
      .setNoFields()
      .setSize(Integer.MAX_VALUE)
      .execute()
      .actionGet();
    
    SearchHit[] hits = response.getHits().getHits();
    Set<SchoolDataIdentifier> identifiers = new HashSet<>();
    
    for (SearchHit hit : hits) {
      String[] id = hit.getId().split("/", 2);
      if (id.length == 2) {
        String dataSource = id[1];
        String identifier = id[0];
        identifiers.add(new SchoolDataIdentifier(identifier, dataSource));
      }
    }
    
    return workspaceEntityController.findWorkspaceEntityIdsByIdentifiers(identifiers);
  }

  @Override
  public SearchResult searchWorkspaces(String schoolDataSource, List<String> subjects, List<String> identifiers, String freeText, boolean includeUnpublished, int start, int maxResults) {
    return searchWorkspaces(schoolDataSource, subjects, identifiers, null, null, freeText, null, null, includeUnpublished, start, maxResults, null);
  }
  
  @Override
  public SearchResult searchWorkspaces(
      String schoolDataSource, 
      List<String> subjects, 
      List<String> identifiers, 
      List<SchoolDataIdentifier> educationTypes, 
      List<SchoolDataIdentifier> curriculumIdentifiers, 
      String freeText, 
      List<WorkspaceAccess> accesses, 
      SchoolDataIdentifier accessUser, 
      boolean includeUnpublished, 
      int start, 
      int maxResults, 
      List<Sort> sorts) {
    
    if (identifiers != null && identifiers.isEmpty()) {
      return new SearchResult(0, 0, 0, new ArrayList<Map<String,Object>>());
    }
    
    BoolQueryBuilder query = boolQuery();
    
    freeText = sanitizeSearchString(freeText);
    
    try {
      
      if (!includeUnpublished) {
        query.must(termQuery("published", Boolean.TRUE));
      }
      
      if (accesses != null) {
        
        for (WorkspaceAccess access : accesses) {
          BoolQueryBuilder accessQuery = boolQuery();
          switch (access) {
            case LOGGED_IN:  
            case ANYONE:
              accessQuery.must(termQuery("access", access));
            break;
            case MEMBERS_ONLY:
              IdsQueryBuilder idsQuery = idsQuery("Workspace");
              for (SchoolDataIdentifier userWorkspace : getUserWorkspaces(accessUser)) {
                idsQuery.addIds(String.format("%s/%s", userWorkspace.getIdentifier(), userWorkspace.getDataSource()));
              }
              accessQuery.must(idsQuery);
              accessQuery.must(termQuery("access", access));
            break;
          }
          
          query.should(accessQuery);
        }
      }
      
      if (StringUtils.isNotBlank(schoolDataSource)) {
        query.must(termQuery("schoolDataSource", schoolDataSource.toLowerCase()));
      }
      
      if (subjects != null && !subjects.isEmpty()) {
        query.must(termsQuery("subjectIdentifier", subjects));
      }
      
      if (educationTypes != null && !educationTypes.isEmpty()) {
        List<String> educationTypeIds = new ArrayList<>(educationTypes.size());
        for (SchoolDataIdentifier educationType : educationTypes) {
          educationTypeIds.add(educationType.toId());
        }
        query.must(termsQuery("educationTypeIdentifier.untouched", educationTypeIds));
      }
      
      if (curriculumIdentifiers != null && !curriculumIdentifiers.isEmpty()) {
        List<String> curriculumIds = new ArrayList<>(curriculumIdentifiers.size());
        for (SchoolDataIdentifier curriculumIdentifier : curriculumIdentifiers) {
          curriculumIds.add(curriculumIdentifier.toId());
        }
        
        query.must(termsQuery("curriculumIdentifier.untouched", curriculumIds));
      }
  
      if (identifiers != null) {
        query.must(termsQuery("identifier", identifiers));
      }
  
      if (StringUtils.isNotBlank(freeText)) {
        String[] words = freeText.split(" ");
        for (int i = 0; i < words.length; i++) {
          if (StringUtils.isNotBlank(words[i])) {
            query.must(boolQuery()
                .should(prefixQuery("name", words[i]))
                .should(prefixQuery("description", words[i])));
          }
        }
      }
      
      SearchRequestBuilder requestBuilder = elasticClient
        .prepareSearch("muikku")
        .setTypes("Workspace")
        .setFrom(start)
        .setSize(maxResults);
      
      if (sorts != null && !sorts.isEmpty()) {
        for (Sort sort : sorts) {
          requestBuilder.addSort(sort.getField(), SortOrder.valueOf(sort.getOrder().name()));
        }
      }
      
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
    } catch (Exception e) {
      logger.log(Level.SEVERE, "ElasticSearch query failed unexpectedly", e);
      return new SearchResult(0, 0, 0, new ArrayList<Map<String,Object>>()); 
    }
  }

  private Set<SchoolDataIdentifier> getUserWorkspaces(SchoolDataIdentifier userIdentifier) {
    Set<SchoolDataIdentifier> result = new HashSet<>();
    
    IdsQueryBuilder query = idsQuery("User");
    query.addIds(String.format("%s/%s", userIdentifier.getIdentifier(), userIdentifier.getDataSource()));
    
    SearchResponse response = elasticClient
      .prepareSearch("muikku")
      .setTypes("User")
      .setQuery(query)
      .addField("workspaces")
      .setSize(1)
      .execute()
      .actionGet();
    
    SearchHit[] hits = response.getHits().getHits();
    for (SearchHit hit : hits) {
      Map<String, SearchHitField> fields = hit.getFields();
      SearchHitField workspaceField = fields.get("workspaces");
      if (workspaceField != null && workspaceField.getValues() != null) {
        for (Object value : workspaceField.getValues()) {
          if (value instanceof Number) {
            Long workspaceEntityId = ((Number) value).longValue();
            WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
            if (workspaceEntity != null) {
              result.add(new SchoolDataIdentifier(workspaceEntity.getIdentifier(), workspaceEntity.getDataSource().getIdentifier()));
            }
          }
        }
      }
    }
    
    return result;
  }

  @Override
  public SearchResult searchWorkspaces(String searchTerm, int start, int maxResults) {
    return searchWorkspaces(null, null, null, searchTerm, false, start, maxResults);
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
      
      BoolQueryBuilder boolQuery = boolQuery();
      for (String field : fields) {
        boolQuery.should(prefixQuery(field, query));
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
    } catch (Exception e) {
      logger.log(Level.SEVERE, "ElasticSearch query failed unexpectedly", e);
      return new SearchResult(0, 0, 0, new ArrayList<Map<String,Object>>()); 
    }
  }

  @Override
  public SearchResult freeTextSearch(String text, int start, int maxResults) {
    try {
      text = sanitizeSearchString(text);
      
      SearchResponse response = elasticClient.prepareSearch().setQuery(matchQuery("_all", text)).setFrom(start).setSize(maxResults).execute()
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
    } catch (Exception e) {
      logger.log(Level.SEVERE, "ElasticSearch query failed unexpectedly", e);
      return new SearchResult(0, 0, 0, new ArrayList<Map<String,Object>>()); 
    }
  }

  @Override
  public SearchResult matchAllSearch(int start, int maxResults) {
    try {
      SearchResponse response = elasticClient.prepareSearch().setQuery(matchAllQuery()).setFrom(start).setSize(maxResults).execute().actionGet();
      List<Map<String, Object>> searchResults = new ArrayList<Map<String, Object>>();
      SearchHit[] results = response.getHits().getHits();
      for (SearchHit hit : results) {
        Map<String, Object> hitSource = hit.getSource();
        hitSource.put("indexType", hit.getType());
        searchResults.add(hitSource);
      }
      
      SearchResult result = new SearchResult(searchResults.size(), start, maxResults, searchResults);
      return result;
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
          .setQuery(matchAllQuery())
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
  //private Node node;

}
