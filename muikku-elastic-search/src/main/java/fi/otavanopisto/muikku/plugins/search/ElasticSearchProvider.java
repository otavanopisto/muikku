package fi.otavanopisto.muikku.plugins.search;

import static org.elasticsearch.index.query.QueryBuilders.boolQuery;
import static org.elasticsearch.index.query.QueryBuilders.existsQuery;
import static org.elasticsearch.index.query.QueryBuilders.idsQuery;
import static org.elasticsearch.index.query.QueryBuilders.prefixQuery;
import static org.elasticsearch.index.query.QueryBuilders.rangeQuery;
import static org.elasticsearch.index.query.QueryBuilders.termQuery;
import static org.elasticsearch.index.query.QueryBuilders.termsQuery;

import java.io.IOException;
import java.time.OffsetDateTime;
import java.time.temporal.ChronoField;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpHost;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.Requests;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.common.document.DocumentField;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.IdsQueryBuilder;
import org.elasticsearch.index.query.Operator;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.sort.SortOrder;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JSR310Module;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceAccess;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.UserGroup;
import fi.otavanopisto.muikku.search.CommunicatorMessageSearchBuilder;
import fi.otavanopisto.muikku.search.IndexedCommunicatorMessage;
import fi.otavanopisto.muikku.search.IndexedCommunicatorMessageRecipient;
import fi.otavanopisto.muikku.search.IndexedCommunicatorMessageSender;
import fi.otavanopisto.muikku.search.IndexedUser;
import fi.otavanopisto.muikku.search.IndexedWorkspace;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.search.SearchResult;
import fi.otavanopisto.muikku.search.SearchResults;
import fi.otavanopisto.muikku.search.WorkspaceSearchBuilder;
import fi.otavanopisto.muikku.search.WorkspaceSearchBuilder.OrganizationRestriction;
import fi.otavanopisto.muikku.session.SessionController;

@ApplicationScoped
public class ElasticSearchProvider implements SearchProvider {
  
  public static final String MUIKKU_COMMUNICATORMESSAGE_INDEX = IndexedCommunicatorMessage.INDEX_NAME;
  public static final String MUIKKU_USER_INDEX = IndexedUser.INDEX_NAME;
  public static final String MUIKKU_USERGROUP_INDEX = UserGroup.INDEX_NAME;
  public static final String MUIKKU_WORKSPACE_INDEX = IndexedWorkspace.INDEX_NAME;
  
  @Inject
  private Logger logger;

  @Inject
  private WorkspaceEntityController workspaceEntityController;
  
  @Inject
  private SessionController sessionController;
  
  @Override
  public void init() {
//    String clusterName = pluginSettingsController.getPluginSetting("elastic-search", "clusterName");
//    if (clusterName == null) {
//      clusterName = System.getProperty("elasticsearch.cluster.name");
//    }
//    if (clusterName == null) {
//      clusterName = "elasticsearch";
//    }
    String portNumberProperty = System.getProperty("elasticsearch.node.port");
    int portNumber;
    if (portNumberProperty != null) {
      portNumber = Integer.decode(portNumberProperty);
    } else {
      portNumber = 9200;
    }

    elasticClient = new RestHighLevelClient(
        RestClient.builder(
                new HttpHost("localhost", portNumber, "http")));    
    
//    Settings settings = Settings.settingsBuilder()
//        .put("cluster.name", clusterName).build();
//    try {
//      elasticClient = TransportClient.builder().settings(settings).build()
//          .addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName("127.0.0.1"), portNumber));
//    } catch (UnknownHostException e) {
//      logger.log(Level.SEVERE, "Failed to connect to elasticsearch cluster", e);
//      return;
//    }
    
  }
  
  @Override
  public void deinit() {
    try {
      elasticClient.close();
    } catch (IOException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
    }
    //node.close();
  }
  
  private String sanitizeSearchString(String query) {
    if (query == null)
      return null;
    
    // TODO: query_string search for case insensitive searches??
    // http://stackoverflow.com/questions/17266830/case-insensitivity-does-not-work
    String ret = query.toLowerCase();

    // Escape special characters including elastic's control characters and some other additions
    String escapedCharacters = Pattern.quote("\\/+-&|!(){}[]^~*?:" + ".,");
    
    ret = ret.replaceAll(String.format("([%s])", escapedCharacters), " ");
    
    // Trims and removes double spaces (incl. tabs etc)
    ret = StringUtils.normalizeSpace(ret);
    
    return ret;
  }

//  private static SearchRequest searchRequest(String index, QueryBuilder query) {
//    SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
//    searchSourceBuilder.query(query);
//    
//    SearchRequest searchRequest = Requests.searchRequest(index);
//    searchRequest.source(searchSourceBuilder);
//    
//    return searchRequest;
//  }
//
//  private static SearchRequest searchRequest(String index, QueryBuilder query, int from, int numberOfHits) {
//    SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder()
//        .query(query)
//        .from(from)
//        .size(numberOfHits);
//    
//    SearchRequest searchRequest = Requests.searchRequest(index);
//    searchRequest.source(searchSourceBuilder);
//    
//    return searchRequest;
//  }

  @Override
  public SearchResult findWorkspace(SchoolDataIdentifier identifier) {
    
//    GetRequest getRequest = Requests.getRequest(MUIKKU_WORKSPACE_INDEX);
//    getRequest.id()
    
    BoolQueryBuilder query = boolQuery().must(termQuery("identifier", identifier.getIdentifier()));

    // Elastic Search API block
    
    SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder()
        .query(query);

    SearchRequest searchRequest = Requests.searchRequest(MUIKKU_WORKSPACE_INDEX);
    searchRequest.source(searchSourceBuilder);
    
    SearchResponse response;
    try {
      response = elasticClient.search(searchRequest, RequestOptions.DEFAULT);
    } catch (IOException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
      throw new RuntimeException("KÄÄK");
    }
    
    // Elastic Search API block

    List<Map<String, Object>> searchResults = new ArrayList<Map<String, Object>>();
    SearchHits searchHits = response.getHits();
    long totalHitCount = searchHits.getTotalHits().value;
    SearchHit[] results = searchHits.getHits();
    for (SearchHit hit : results) {
      Map<String, Object> hitSource = hit.getSourceAsMap();
      if (hitSource == null){
        hitSource = new HashMap<>();
        for(String key : hit.getFields().keySet()){
          hitSource.put(key, hit.getFields().get(key).getValue().toString());
        }
      }
      hitSource.put("indexType", "Workspace");
      searchResults.add(hitSource);
    }
    return new SearchResult(0, searchResults, totalHitCount);
  }
  
  @Override
  public SearchResult findUser(SchoolDataIdentifier identifier, boolean includeInactive) {

    // Query that checks activity based on user having a study end date set
    
    BoolQueryBuilder query = boolQuery();
    if (!includeInactive) {
      query.mustNot(existsQuery("studyEndDate"));
    }
    
    IdsQueryBuilder includeIdsQuery = idsQuery();
    includeIdsQuery.addIds(String.format("%s/%s", identifier.getIdentifier(), identifier.getDataSource()));
    query.must(includeIdsQuery);
    
//    // Search
//    
//    SearchRequest searchRequest = searchRequest(MUIKKU_USER_INDEX, query);
//    
//    // Results processing
//
//    SearchResponse response = elasticClient.search(searchRequest, RequestOptions.DEFAULT);

    // Elastic Search API block
    
    SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder()
        .query(query);

    SearchRequest searchRequest = Requests.searchRequest(MUIKKU_USER_INDEX);
    searchRequest.source(searchSourceBuilder);
    
    SearchResponse response;
    try {
      response = elasticClient.search(searchRequest, RequestOptions.DEFAULT);
    } catch (IOException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
      throw new RuntimeException("KÄÄK");
    }
    
    // Elastic Search API block

    List<Map<String, Object>> searchResults = new ArrayList<Map<String, Object>>();
    SearchHits searchHits = response.getHits();
    long totalHitCount = searchHits.getTotalHits().value;
    SearchHit[] results = searchHits.getHits();
    for (SearchHit hit : results) {
      Map<String, Object> hitSource = hit.getSourceAsMap();
      if(hitSource == null){
        hitSource = new HashMap<>();
        for(String key : hit.getFields().keySet()){
          hitSource.put(key, hit.getFields().get(key).getValue().toString());
        }
      }
      hitSource.put("indexType", "User");
      searchResults.add(hitSource);
    }
    return new SearchResult(0, searchResults, totalHitCount);
  }

  @Override
  public SearchResult searchUsers(List<OrganizationEntity> organizations, String text, String[] textFields, Collection<EnvironmentRoleArchetype> archetypes, 
      Collection<Long> groups, Collection<Long> workspaces, Collection<SchoolDataIdentifier> userIdentifiers,
      Boolean includeInactiveStudents, Boolean includeHidden, Boolean onlyDefaultUsers, int start, int maxResults, 
      Collection<String> fields, Collection<SchoolDataIdentifier> excludeSchoolDataIdentifiers, 
      Date startedStudiesBefore, Date studyTimeEndsBefore) {
    try {
      long now = OffsetDateTime.now().toEpochSecond();

      if (CollectionUtils.isEmpty(organizations)) {
        throw new IllegalArgumentException("Cannot search with no organizations specified.");
      }
      
      text = sanitizeSearchString(text);

      BoolQueryBuilder query = boolQuery();
      
      if (!Boolean.TRUE.equals(includeHidden)) {
        query.mustNot(termQuery("hidden", true));
      }
      
      if (Boolean.TRUE.equals(onlyDefaultUsers)) {
        query.must(termQuery("isDefaultIdentifier", true));
      }
      
      if (StringUtils.isNotBlank(text) && !ArrayUtils.isEmpty(textFields)) {
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
        IdsQueryBuilder excludeIdsQuery = idsQuery();
        
        for (SchoolDataIdentifier excludeSchoolDataIdentifier : excludeSchoolDataIdentifiers) {
          excludeIdsQuery.addIds(String.format("%s/%s", excludeSchoolDataIdentifier.getIdentifier(), excludeSchoolDataIdentifier.getDataSource()));
        }
        query.mustNot(excludeIdsQuery);
      }
      
      if (startedStudiesBefore != null) {
        query.must(rangeQuery("studyStartDate").lt((long) startedStudiesBefore.getTime() / 1000));
      }

      if (studyTimeEndsBefore != null) {
        query.must(rangeQuery("studyTimeEnd").lt((long) studyTimeEndsBefore.getTime() / 1000));
      }
      
      if (archetypes != null) {
        List<String> archetypeNames = new ArrayList<>(archetypes.size());
        for (EnvironmentRoleArchetype archetype : archetypes) {
          archetypeNames.add(archetype.name().toLowerCase());
        }

        query.must(termsQuery("archetype", archetypeNames.toArray(new String[0]))); 
      }
      
      Set<String> organizationIdentifiers = organizations
          .stream()
          .filter(Objects::nonNull).map(organization -> String.format("%s-%s", organization.getDataSource().getIdentifier(), organization.getIdentifier()))
          .collect(Collectors.toSet());
      if (CollectionUtils.isNotEmpty(organizationIdentifiers)) {
        query.must(termsQuery("organizationIdentifier", organizationIdentifiers.toArray()));
      }
      
      if (groups != null) {
        query.must(termsQuery("groups", ArrayUtils.toPrimitive(groups.toArray(new Long[0]))));
      }

      if (workspaces != null) {
        query.must(termsQuery("workspaces", ArrayUtils.toPrimitive(workspaces.toArray(new Long[0]))));
      }
      
      if (userIdentifiers != null) {
        IdsQueryBuilder includeIdsQuery = idsQuery();
        for (SchoolDataIdentifier userIdentifier : userIdentifiers) {
          includeIdsQuery.addIds(String.format("%s/%s", userIdentifier.getIdentifier(), userIdentifier.getDataSource()));
        }
        query.must(includeIdsQuery);
      }

      if (includeInactiveStudents == false) {
        /**
         * List only active users. 
         * 
         * Active user is
         * - staff member (teacher, manager, study guider, study programme leader, administrator)
         * - student that has study start date (in the past) and no study end date
         * - student that has study start date (in the past) and study end date in the future
         * - student that has no study start and end date but belongs to an active workspace
         *   
         * Active workspace is
         * - published and
         * - either has no start/end date or current date falls between them
         */
        
        Set<Long> activeWorkspaceEntityIds = getActiveWorkspaces();
        
        query.must(
          boolQuery()
          .should(termsQuery("archetype",
              EnvironmentRoleArchetype.TEACHER.name().toLowerCase(),
              EnvironmentRoleArchetype.MANAGER.name().toLowerCase(),
              EnvironmentRoleArchetype.STUDY_GUIDER.name().toLowerCase(),
              EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER.name().toLowerCase(),
              EnvironmentRoleArchetype.ADMINISTRATOR.name().toLowerCase())
            )
            .should(boolQuery()
              .must(termQuery("archetype", EnvironmentRoleArchetype.STUDENT.name().toLowerCase()))
              .must(existsQuery("studyStartDate"))
              .must(rangeQuery("studyStartDate").lte(now))
              .mustNot(existsQuery("studyEndDate"))
            )
            .should(boolQuery()
              .must(termQuery("archetype", EnvironmentRoleArchetype.STUDENT.name().toLowerCase()))
              .must(existsQuery("studyStartDate"))
              .must(rangeQuery("studyStartDate").lte(now))
              .must(existsQuery("studyEndDate"))
              .must(rangeQuery("studyEndDate").gte(now))
            )
            .should(boolQuery()
              .must(termQuery("archetype", EnvironmentRoleArchetype.STUDENT.name().toLowerCase()))
              .mustNot(existsQuery("studyEndDate"))
              .mustNot(existsQuery("studyStartDate"))
              .must(termsQuery("workspaces", ArrayUtils.toPrimitive(activeWorkspaceEntityIds.toArray(new Long[0]))))
            )
        );
      }
            
      // Elastic Search API block
      
      SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder()
          .query(query)
          .from(start)
          .size(maxResults)
          .sort("_score", SortOrder.DESC)
          .sort("lastName.untouched", SortOrder.ASC)
          .sort("firstName.untouched", SortOrder.ASC);

      if (CollectionUtils.isNotEmpty(fields)) {
        fields.forEach(field -> searchSourceBuilder.fetchField(field)); // TODO Stored vs docfield vs fetchfield?
      }
      
      SearchRequest searchRequest = Requests.searchRequest(MUIKKU_USER_INDEX);
      searchRequest.source(searchSourceBuilder);
      
      SearchResponse response = elasticClient.search(searchRequest, RequestOptions.DEFAULT);
      
      // Elastic Search API block

      List<Map<String, Object>> searchResults = new ArrayList<Map<String, Object>>();
      SearchHits searchHits = response.getHits();
      long totalHitCount = searchHits.getTotalHits().value;
      SearchHit[] results = searchHits.getHits();
      for (SearchHit hit : results) {
        Map<String, Object> hitSource = hit.getSourceAsMap();
        if(hitSource == null){
          hitSource = new HashMap<>();
          for(String key : hit.getFields().keySet()){
            hitSource.put(key, hit.getFields().get(key).getValue().toString());
          }
        }
        hitSource.put("indexType", "User");
        searchResults.add(hitSource);
      }
      
      SearchResult result = new SearchResult(start, searchResults, totalHitCount);
      return result;
    } catch (Exception e) {
      logger.log(Level.SEVERE, "ElasticSearch query failed unexpectedly", e);
      return new SearchResult(0, new ArrayList<Map<String,Object>>(), 0); 
    }
  }
  
  @Override
  public SearchResult searchUsers(List<OrganizationEntity> organizations, String text, String[] textFields, Collection<EnvironmentRoleArchetype> archetypes, 
      Collection<Long> groups, Collection<Long> workspaces, Collection<SchoolDataIdentifier> userIdentifiers,
      Boolean includeInactiveStudents, Boolean includeHidden, Boolean onlyDefaultUsers, int start, int maxResults,
      Collection<String> fields, Collection<SchoolDataIdentifier> excludeSchoolDataIdentifiers, Date startedStudiesBefore) {
    return searchUsers(organizations, text, textFields, archetypes, groups, workspaces, userIdentifiers, includeInactiveStudents, includeHidden, 
        onlyDefaultUsers, start, maxResults, fields, excludeSchoolDataIdentifiers, startedStudiesBefore, null);
  }
  
  @Override
  public SearchResult searchUsers(List<OrganizationEntity> organizations, String text, String[] textFields, Collection<EnvironmentRoleArchetype> archetypes, 
      Collection<Long> groups, Collection<Long> workspaces, Collection<SchoolDataIdentifier> userIdentifiers,
      Boolean includeInactiveStudents, Boolean includeHidden, Boolean onlyDefaultUsers, int start, int maxResults) {
    return searchUsers(organizations, text, textFields, archetypes, groups, workspaces, userIdentifiers, includeInactiveStudents, includeHidden, 
        onlyDefaultUsers, start, maxResults, null, null, null);
  }
  
  @Override
  public SearchResult searchUsers(List<OrganizationEntity> organizations, String text, String[] textFields, Collection<EnvironmentRoleArchetype> archetypes, 
      Collection<Long> groups, Collection<Long> workspaces, Collection<SchoolDataIdentifier> userIdentifiers,
      Boolean includeInactiveStudents, Boolean includeHidden, Boolean onlyDefaultUsers, int start, int maxResults, Collection<String> fields) {
    return searchUsers(organizations, text, textFields, archetypes, groups, workspaces, userIdentifiers, includeInactiveStudents, includeHidden, 
        onlyDefaultUsers, start, maxResults, fields, null, null);
  }
  
  private Set<Long> getActiveWorkspaces() {
    
    long now = OffsetDateTime.now().with(ChronoField.MILLI_OF_DAY, 0).toInstant().toEpochMilli() / 1000;
    
    BoolQueryBuilder query = boolQuery();
    
    query.must(termQuery("published", Boolean.TRUE));
    query.must(
      boolQuery()
        .should(boolQuery()
          .mustNot(existsQuery("beginDate"))
          .mustNot(existsQuery("endDate"))
        )
        .should(boolQuery()
          .must(existsQuery("beginDate"))
          .must(existsQuery("endDate"))
          .must(rangeQuery("beginDate").lte(now))
          .must(rangeQuery("endDate").gte(now))
        )
    );

    // Elastic Search API block
    
    // TODO: to list all, use Scroll API
    
    SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder()
        .query(query)
        .fetchSource(false)       // Previously .setNoFields()
        .size(10000); // Integer.MAX_VALUE

    SearchRequest searchRequest = Requests.searchRequest(MUIKKU_WORKSPACE_INDEX);
    searchRequest.source(searchSourceBuilder);
    
    SearchResponse response;
    try {
      response = elasticClient.search(searchRequest, RequestOptions.DEFAULT);
    } catch (IOException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
      throw new RuntimeException("KÄÄK");
    }
    
    // Elastic Search API block
    
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
  public SearchResult searchWorkspaces(SchoolDataIdentifier subjectIdentifier, int courseNumber) {
    BoolQueryBuilder query = boolQuery();
    query.must(termQuery("published", Boolean.TRUE));
    query.must(termQuery("subjects.subjectIdentifier.untouched", subjectIdentifier.toId()));
    query.must(termQuery("subjects.courseNumber", courseNumber));
    // query.must(termQuery("access", WorkspaceAccess.LOGGED_IN));
    
    // Elastic Search API block
    
    SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder()
        .query(query)
        .from(0)
        .size(50);

    SearchRequest searchRequest = Requests.searchRequest(MUIKKU_USER_INDEX);
    searchRequest.source(searchSourceBuilder);
    
    SearchResponse response;
    try {
      response = elasticClient.search(searchRequest, RequestOptions.DEFAULT);
    } catch (IOException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
      throw new RuntimeException("KÄÄK");
    }
    
    // Elastic Search API block
    
    List<Map<String, Object>> searchResults = new ArrayList<Map<String, Object>>();
    SearchHits searchHits = response.getHits();
    SearchHit[] results = searchHits.getHits();
    long totalHits = searchHits.getTotalHits().value;
    for (SearchHit hit : results) {
      Map<String, Object> hitSource = hit.getSourceAsMap();
      hitSource.put("indexType", "Workspace");
      searchResults.add(hitSource);
    }
    
    SearchResult result = new SearchResult(0, searchResults, totalHits);
    return result;
  }
  
  private BoolQueryBuilder prepareWorkspaceSearchQuery(
      List<SchoolDataIdentifier> subjects,
      List<SchoolDataIdentifier> identifiers,
      List<SchoolDataIdentifier> educationTypes,
      List<SchoolDataIdentifier> curriculumIdentifiers,
      Collection<OrganizationRestriction> organizationRestrictions,
      String freeText,
      Collection<WorkspaceAccess> accesses,
      SchoolDataIdentifier accessUser) {

    BoolQueryBuilder query = boolQuery();

    freeText = sanitizeSearchString(freeText);

    if (accesses != null) {
      BoolQueryBuilder accessQuery = boolQuery();
      for (WorkspaceAccess access : accesses) {
        switch (access) {
          case LOGGED_IN:
          case ANYONE:
            accessQuery.should(termQuery("access", access));
          break;
          case MEMBERS_ONLY:
            BoolQueryBuilder memberQuery = boolQuery();
            IdsQueryBuilder idsQuery = idsQuery(IndexedWorkspace.INDEX_NAME);
            for (SchoolDataIdentifier userWorkspace : getUserWorkspaces(accessUser)) {
              idsQuery.addIds(String.format("%s/%s", userWorkspace.getIdentifier(), userWorkspace.getDataSource()));
            }
            memberQuery.must(idsQuery);
            memberQuery.must(termQuery("access", access));
            accessQuery.should(memberQuery);
          break;
        }
      }
      query.must(accessQuery);
    }

    if (CollectionUtils.isNotEmpty(subjects)) {
      List<String> subjectIds = subjects.stream().map(SchoolDataIdentifier::toId).collect(Collectors.toList());
      query.must(termsQuery("subjects.subjectIdentifier.untouched", subjectIds));
    }

    if (CollectionUtils.isNotEmpty(educationTypes)) {
      List<String> educationTypeIds = educationTypes.stream().map(SchoolDataIdentifier::toId).collect(Collectors.toList());
      query.must(termsQuery("educationTypeIdentifier.untouched", educationTypeIds));
    }

    if (CollectionUtils.isNotEmpty(curriculumIdentifiers)) {
      List<String> curriculumIds = curriculumIdentifiers.stream().map(SchoolDataIdentifier::toId).collect(Collectors.toList());
      query.must(boolQuery()
          .should(termsQuery("curriculumIdentifiers.untouched", curriculumIds))
          .should(boolQuery().mustNot(existsQuery("curriculumIdentifiers")))
          .minimumShouldMatch(1));
    }

    BoolQueryBuilder organizationQuery = boolQuery();

    for (OrganizationRestriction organizationRestriction : organizationRestrictions) {
      SchoolDataIdentifier organizationIdentifier = organizationRestriction.getOrganizationIdentifier();

      BoolQueryBuilder organizationRestrictionQuery = boolQuery().must(termQuery("organizationIdentifier.untouched", organizationIdentifier.toId()));

      switch (organizationRestriction.getPublicityRestriction()) {
        case ONLY_PUBLISHED:
          organizationRestrictionQuery = organizationRestrictionQuery.must(termQuery("published", Boolean.TRUE));
        break;
        case ONLY_UNPUBLISHED:
          organizationRestrictionQuery = organizationRestrictionQuery.must(termQuery("published", Boolean.FALSE));
        break;
        case LIST_ALL:
        break;
      }

      switch (organizationRestriction.getTemplateRestriction()) {
        case ONLY_WORKSPACES:
          organizationRestrictionQuery.must(termQuery("isTemplate", Boolean.FALSE));
        break;
        case ONLY_TEMPLATES:
          organizationRestrictionQuery.must(termQuery("isTemplate", Boolean.TRUE));
        break;
        case LIST_ALL:
          // No restrictions
        break;
      }

      organizationQuery.should(organizationRestrictionQuery);
    }

    query.must(organizationQuery.minimumShouldMatch(1));

    if (identifiers != null) {
      List<String> identifiersStrList = identifiers.stream()
          .map(SchoolDataIdentifier::toId)
          .collect(Collectors.toList());
      query.must(termsQuery("identifier.untouched", identifiersStrList));
    }

    if (StringUtils.isNotBlank(freeText)) {
      String[] words = freeText.split(" ");
      for (int i = 0; i < words.length; i++) {
        if (StringUtils.isNotBlank(words[i])) {
          query.must(boolQuery()
              .should(prefixQuery("name", words[i]))
              .should(prefixQuery("description", words[i]))
              .should(prefixQuery("subjects.subjectName", words[i]))
              .should(prefixQuery("staffMembers.firstName", words[i]))
              .should(prefixQuery("staffMembers.lastName", words[i]))
              );
        }
      }
    }

    return query;
  }

//  private BoolQueryBuilder prepareWorkspaceSearchQuery(
//      List<SchoolDataIdentifier> subjects, 
//      List<SchoolDataIdentifier> identifiers, 
//      List<SchoolDataIdentifier> educationTypes, 
//      List<SchoolDataIdentifier> curriculumIdentifiers, 
//      Collection<OrganizationRestriction> organizationRestrictions,
//      String freeText, 
//      Collection<WorkspaceAccess> accesses, 
//      SchoolDataIdentifier accessUser) {
//    
//    BoolQueryBuilder query = boolQuery();
//    
//    freeText = sanitizeSearchString(freeText);
//
//    try {
//      
//      if (accesses != null) {
//        BoolQueryBuilder accessQuery = boolQuery();
//        for (WorkspaceAccess access : accesses) {
//          switch (access) {
//            case LOGGED_IN:  
//            case ANYONE:
//              accessQuery.should(termQuery("access", access));
//            break;
//            case MEMBERS_ONLY:
//              BoolQueryBuilder memberQuery = boolQuery();
//              IdsQueryBuilder idsQuery = idsQuery();
//              for (SchoolDataIdentifier userWorkspace : getUserWorkspaces(accessUser)) {
//                idsQuery.addIds(String.format("%s/%s", userWorkspace.getIdentifier(), userWorkspace.getDataSource()));
//              }
//              memberQuery.must(idsQuery);
//              memberQuery.must(termQuery("access", access));
//              accessQuery.should(memberQuery);
//            break;
//          }
//        }
//        query.must(accessQuery);
//      }
//      
//      if (StringUtils.isNotBlank(schoolDataSource)) {
//        query.must(termQuery("schoolDataSource", schoolDataSource.toLowerCase()));
//      }
//      
//      if (subjects != null && !subjects.isEmpty()) {
//        query.must(termsQuery("subjectIdentifier", subjects));
//      }
//      
//      if (educationTypes != null && !educationTypes.isEmpty()) {
//        List<String> educationTypeIds = new ArrayList<>(educationTypes.size());
//        for (SchoolDataIdentifier educationType : educationTypes) {
//          educationTypeIds.add(educationType.toId());
//        }
//      }
//      query.must(accessQuery);
//    }
//    
//    if (CollectionUtils.isNotEmpty(subjects)) {
//      List<String> subjectIds = subjects.stream().map(SchoolDataIdentifier::toId).collect(Collectors.toList());
//      query.must(termsQuery("subjects.subjectIdentifier.untouched", subjectIds));
//    }
//    
//    if (CollectionUtils.isNotEmpty(educationTypes)) {
//      List<String> educationTypeIds = educationTypes.stream().map(SchoolDataIdentifier::toId).collect(Collectors.toList());
//      query.must(termsQuery("educationTypeIdentifier.untouched", educationTypeIds));
//    }
//
//    if (CollectionUtils.isNotEmpty(curriculumIdentifiers)) {
//      List<String> curriculumIds = curriculumIdentifiers.stream().map(SchoolDataIdentifier::toId).collect(Collectors.toList());
//      query.must(boolQuery()
//          .should(termsQuery("curriculumIdentifiers.untouched", curriculumIds))
//          .should(boolQuery().mustNot(existsQuery("curriculumIdentifiers")))
//          .minimumNumberShouldMatch(1));
//    }
//
////<<<<<<< HEAD
////        query.must(boolQuery()
////            .should(termsQuery("curriculumIdentifiers.untouched", curriculumIds))
////            .should(boolQuery().mustNot(existsQuery("curriculumIdentifiers")))
////            .minimumShouldMatch(1));
////      }
////=======
//    BoolQueryBuilder organizationQuery = boolQuery();
//    
//    for (OrganizationRestriction organizationRestriction : organizationRestrictions) {
//      SchoolDataIdentifier organizationIdentifier = organizationRestriction.getOrganizationIdentifier();
////>>>>>>> devel
//
//      BoolQueryBuilder organizationRestrictionQuery = boolQuery().must(termQuery("organizationIdentifier.untouched", organizationIdentifier.toId()));
//      
//      switch (organizationRestriction.getPublicityRestriction()) {
//        case ONLY_PUBLISHED:
//          organizationRestrictionQuery = organizationRestrictionQuery.must(termQuery("published", Boolean.TRUE));
//        break;
//        case ONLY_UNPUBLISHED:
//          organizationRestrictionQuery = organizationRestrictionQuery.must(termQuery("published", Boolean.FALSE));
//        break;
//        case LIST_ALL:
//        break;
//      }
//      
////<<<<<<< HEAD
////      query.must(organizationQuery.minimumShouldMatch(1));
////      
////      if (identifiers != null) {
////        query.must(termsQuery("identifier", identifiers));
////=======
//      switch (organizationRestriction.getTemplateRestriction()) {
//        case ONLY_WORKSPACES:
//          organizationRestrictionQuery.must(termQuery("isTemplate", Boolean.FALSE));
//        break;
//        case ONLY_TEMPLATES:
//          organizationRestrictionQuery.must(termQuery("isTemplate", Boolean.TRUE));
//        break;
//        case LIST_ALL:
//          // No restrictions
//        break;
////>>>>>>> devel
//      }
//      
//      organizationQuery.should(organizationRestrictionQuery);
//    }
//    
//    query.must(organizationQuery.minimumNumberShouldMatch(1));
//    
//    if (identifiers != null) {
//      List<String> identifiersStrList = identifiers.stream()
//          .map(SchoolDataIdentifier::toId)
//          .collect(Collectors.toList());
//      query.must(termsQuery("identifier.untouched", identifiersStrList));
//    }
//
//    if (StringUtils.isNotBlank(freeText)) {
//      String[] words = freeText.split(" ");
//      for (int i = 0; i < words.length; i++) {
//        if (StringUtils.isNotBlank(words[i])) {
//          query.must(boolQuery()
//              .should(prefixQuery("name", words[i]))
//              .should(prefixQuery("description", words[i]))
//              .should(prefixQuery("subjects.subjectName", words[i]))
//              .should(prefixQuery("staffMembers.firstName", words[i]))
//              .should(prefixQuery("staffMembers.lastName", words[i]))
//              );
//        }
//      }
////<<<<<<< HEAD
////
////      // Elastic Search API block
////      
////      SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder()
////          .query(query)
////          .from(start)
////          .size(maxResults);
////
////      if (CollectionUtils.isNotEmpty(sorts)) {
////        sorts.forEach(sort -> searchSourceBuilder.sort(sort.getField(), SortOrder.valueOf(sort.getOrder().name())));
////      }
////      
////      SearchRequest searchRequest = Requests.searchRequest(MUIKKU_WORKSPACE_INDEX);
////      searchRequest.source(searchSourceBuilder);
////      
////      SearchResponse response = elasticClient.search(searchRequest, RequestOptions.DEFAULT);
////      
////      // Elastic Search API block
////
//////      SearchRequestBuilder requestBuilder = elasticClient
//////        .prepareSearch(MUIKKU_WORKSPACE_INDEX)
////////        .setTypes("Workspace")
//////        .setFrom(start)
//////        .setSize(maxResults);
//////      
//////      if (sorts != null && !sorts.isEmpty()) {
//////        for (Sort sort : sorts) {
//////          requestBuilder.addSort(sort.getField(), SortOrder.valueOf(sort.getOrder().name()));
//////        }
//////      }
//////      
//////      SearchResponse response = requestBuilder.setQuery(query).execute().actionGet();
////=======
//    }
//
//    return query;
//  }
    
  @Override
  public SearchResult searchWorkspaces(
      List<SchoolDataIdentifier> subjects, 
      List<SchoolDataIdentifier> identifiers, 
      List<SchoolDataIdentifier> educationTypes, 
      List<SchoolDataIdentifier> curriculumIdentifiers, 
      Collection<OrganizationRestriction> organizationRestrictions,
      String freeText, 
      Collection<WorkspaceAccess> accesses, 
      SchoolDataIdentifier accessUser, 
      int start, 
      int maxResults, 
      List<Sort> sorts) {
      
    if ((identifiers != null && identifiers.isEmpty()) || CollectionUtils.isEmpty(organizationRestrictions)) {
      return new SearchResult(0, new ArrayList<Map<String,Object>>(), 0);
    }

    BoolQueryBuilder query = prepareWorkspaceSearchQuery(subjects, identifiers, educationTypes, curriculumIdentifiers, organizationRestrictions, freeText, accesses, accessUser);

    try {
      // Elastic Search API block
      
      SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder()
          .query(query)
          .from(start)
          .size(maxResults);

      if (sorts != null && !sorts.isEmpty()) {
        for (Sort sort : sorts) {
          searchSourceBuilder.sort(sort.getField(), SortOrder.valueOf(sort.getOrder().name()));
        }
      }

      SearchRequest searchRequest = Requests.searchRequest(IndexedWorkspace.INDEX_NAME);
      searchRequest.source(searchSourceBuilder);
      
      SearchResponse response = elasticClient.search(searchRequest, RequestOptions.DEFAULT);
      
      // Elastic Search API block

      List<Map<String, Object>> searchResults = new ArrayList<Map<String, Object>>();
      SearchHits searchHits = response.getHits();
      long totalHitCount = searchHits.getTotalHits().value;
      SearchHit[] results = searchHits.getHits();
      for (SearchHit hit : results) {
        Map<String, Object> hitSource = hit.getSourceAsMap();
        hitSource.put("indexType", "Workspace");
        searchResults.add(hitSource);
      }
      
      SearchResult result = new SearchResult(start, searchResults, totalHitCount);
      return result;
    } catch (Exception e) {
      logger.log(Level.SEVERE, "ElasticSearch query failed unexpectedly", e);
      return new SearchResult(0, new ArrayList<Map<String,Object>>(), 0); 
    }
  }

  @Override
  public SearchResults<List<IndexedWorkspace>> searchIndexedWorkspaces(
      List<SchoolDataIdentifier> subjects, 
      List<SchoolDataIdentifier> identifiers, 
      List<SchoolDataIdentifier> educationTypes, 
      List<SchoolDataIdentifier> curriculumIdentifiers, 
      Collection<OrganizationRestriction> organizationRestrictions,
      String freeText, 
      Collection<WorkspaceAccess> accesses, 
      SchoolDataIdentifier accessUser, 
      int start, 
      int maxResults, 
      List<Sort> sorts) {
      
    if ((identifiers != null && identifiers.isEmpty()) || CollectionUtils.isEmpty(organizationRestrictions)) {
      return new SearchResults<List<IndexedWorkspace>>(0, new ArrayList<IndexedWorkspace>(), 0); 
    }
    
    try {
      BoolQueryBuilder query = prepareWorkspaceSearchQuery(subjects, identifiers, educationTypes, curriculumIdentifiers, organizationRestrictions, freeText, accesses, accessUser);

      // Elastic Search API block
      
      SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder()
          .query(query)
          .from(start)
          .size(maxResults);

      if (sorts != null && !sorts.isEmpty()) {
        for (Sort sort : sorts) {
          searchSourceBuilder.sort(sort.getField(), SortOrder.valueOf(sort.getOrder().name()));
        }
      }

      SearchRequest searchRequest = Requests.searchRequest(IndexedWorkspace.INDEX_NAME);
      searchRequest.source(searchSourceBuilder);
      
      SearchResponse response = elasticClient.search(searchRequest, RequestOptions.DEFAULT);
      
      // Elastic Search API block
      
      SearchHits searchHits = response.getHits();
      long totalHitCount = searchHits.getTotalHits().value;
      
      ObjectMapper objectMapper = new ObjectMapper();
      objectMapper.registerModule(new JSR310Module());
      SearchHit[] results = searchHits.getHits();
      List<IndexedWorkspace> searchResults = Arrays.stream(results)
          .map(hit -> {
            String source = hit.getSourceAsString();
            try {
              return objectMapper.readValue(source, IndexedWorkspace.class);
            }
            catch (Exception e) {
              String documentId = hit != null ? hit.getId() : null;
              logger.log(Level.SEVERE, String.format("Couldn't parse indexed workspace (id: %s)", documentId), e);
            }
            return null;
          })
          .collect(Collectors.toList());
      
      return new SearchResults<List<IndexedWorkspace>>(start, searchResults, totalHitCount);
      
    } catch (Exception e) {
      logger.log(Level.SEVERE, "ElasticSearch query failed unexpectedly", e);
      return new SearchResults<List<IndexedWorkspace>>(0, new ArrayList<IndexedWorkspace>(), 0); 
    }
  }

  @Override
  public WorkspaceSearchBuilder searchWorkspaces() {
    return new ElasticWorkspaceSearchBuilder(this);
  }

  private Set<SchoolDataIdentifier> getUserWorkspaces(SchoolDataIdentifier userIdentifier) {
    Set<SchoolDataIdentifier> result = new HashSet<>();
    
    IdsQueryBuilder query = idsQuery();
    query.addIds(String.format("%s/%s", userIdentifier.getIdentifier(), userIdentifier.getDataSource()));

    // Elastic Search API block
    
    SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder()
        .query(query)
        .fetchField("workspaces") // fetch/stored/docvalue?
        .size(1);

    SearchRequest searchRequest = Requests.searchRequest(MUIKKU_USER_INDEX);
    searchRequest.source(searchSourceBuilder);
    
    SearchResponse response;
    try {
      response = elasticClient.search(searchRequest, RequestOptions.DEFAULT);
    } catch (IOException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
      throw new RuntimeException("KÄÄK");
    }
    
    // Elastic Search API block

    SearchHit[] hits = response.getHits().getHits();
    for (SearchHit hit : hits) {
      Map<String, DocumentField> fields = hit.getFields();
      DocumentField workspaceField = fields.get("workspaces");
      if (workspaceField != null && workspaceField.getValues() != null) {
        for (Object value : workspaceField.getValues()) {
          if (value instanceof Number) {
            Long workspaceEntityId = ((Number) value).longValue();
            WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
            if (workspaceEntity != null) {
              result.add(workspaceEntity.schoolDataIdentifier());
            }
          }
        }
      }
    }
    
    return result;
  }
  
  @Override
  public CommunicatorMessageSearchBuilder searchCommunicatorMessages() {
    return new ElasticCommunicatorMessageSearchBuilder(this);
  }
  
  @Override
  public IndexedCommunicatorMessage findCommunicatorMessage(Long communicatorMessageId) {
    if (communicatorMessageId == null) {
      throw new IllegalArgumentException();
    }
    
    IdsQueryBuilder query = idsQuery(IndexedCommunicatorMessage.TYPE_NAME);
    query.addIds(String.valueOf(communicatorMessageId));
    
    // Elastic Search API block
    
    SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder()
        .query(query)
        .size(1);

    SearchRequest searchRequest = Requests.searchRequest(MUIKKU_COMMUNICATORMESSAGE_INDEX);
    searchRequest.source(searchSourceBuilder);
    
    SearchResponse response;
    try {
      response = elasticClient.search(searchRequest, RequestOptions.DEFAULT);
    } catch (IOException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
      throw new RuntimeException("KÄÄK");
    }
    
    // Elastic Search API block
    
    SearchHit[] results = response.getHits().getHits();

    // Technically never possible, but check anyways for errors
    if (results.length > 1) {
      logger.log(Level.SEVERE, String.format("Found multiple messages (id: %d)", communicatorMessageId));
      return null;
    }

    if (results.length == 1) {
      SearchHit hit = results[0];
      String source = hit.getSourceAsString();
      try {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(source, IndexedCommunicatorMessage.class);
      }
      catch (Exception e) {
        String documentId = hit != null ? hit.getId() : null;
        logger.log(Level.SEVERE, String.format("Couldn't parse indexed communicator message (id: %s)", documentId), e);
        return null;
      }
    }
    
    return null;
  }

  @Override
  public SearchResults<List<IndexedCommunicatorMessage>> searchCommunicatorMessages(
      String queryString,
      long senderId,
      IndexedCommunicatorMessageSender sender,
      List<IndexedCommunicatorMessageRecipient> recipients,
      Date created,
      Set<Long> tags,
      int start, 
      int maxResults, 
      List<Sort> sorts) {
    BoolQueryBuilder query = boolQuery();
    
    UserEntity loggedUser = sessionController.getLoggedUserEntity();
    Long loggedUserId = loggedUser.getId();
    String loggedUserIdStr = String.valueOf(loggedUserId);

    queryString = sanitizeSearchString(queryString);
    queryString = prepareQueryString(queryString);

    query.must(boolQuery()
        .must(
            boolQuery()
              .should(
                  QueryBuilders.queryStringQuery(queryString)
                      .defaultOperator(Operator.AND)
                      .field("caption")
                      .field("message")
                      .field("sender.firstName")
                      .field("sender.nickName")
                      .field("sender.lastName")
                      .field("recipients.firstName")
                      .field("recipients.nickName")
                      .field("recipients.lastName")
                      .field("groupRecipients.groupName")
              )
              .should(
                  boolQuery()
                    .must(QueryBuilders.queryStringQuery(queryString)
                        .defaultOperator(Operator.AND)
                        .field("caption")
                        .field("message")
                        .field("sender.firstName")
                        .field("sender.nickName")
                        .field("sender.lastName")
                        .field("recipients.firstName")
                        .field("recipients.nickName")
                        .field("recipients.lastName")
                        .field("groupRecipients.groupName")
                        .field("sender.labels.label")
                    )
                    .must(termsQuery("sender.userEntityId", loggedUserIdStr))
              )
              .should(
                  boolQuery()
                    .must(QueryBuilders.queryStringQuery(queryString)
                        .defaultOperator(Operator.AND)
                        .field("caption")
                        .field("message")
                        .field("sender.firstName")
                        .field("sender.nickName")
                        .field("sender.lastName")
                        .field("recipients.firstName")
                        .field("recipients.nickName")
                        .field("recipients.lastName")
                        .field("groupRecipients.groupName")
                        .field("recipients.labels.label")
                    )
                    .must(termsQuery("recipients.userEntityId", loggedUserIdStr))
              )
              .should(
                  boolQuery()
                    .must(QueryBuilders.queryStringQuery(queryString)
                        .defaultOperator(Operator.AND)
                        .field("caption")
                        .field("message")
                        .field("sender.firstName")
                        .field("sender.nickName")
                        .field("sender.lastName")
                        .field("recipients.firstName")
                        .field("recipients.nickName")
                        .field("recipients.lastName")
                        .field("groupRecipients.groupName")
                        .field("groupRecipients.recipients.labels.label")
                    )
                    .must(termsQuery("groupRecipients.recipients.userEntityId", loggedUserIdStr))
              )
              .minimumShouldMatch(1)
        )
        .should(
            boolQuery()
              .must(termQuery("sender.userEntityId", loggedUserIdStr))
              .must(termQuery("sender.archivedBySender", Boolean.FALSE)))
        .should(
            boolQuery()
              .must(termQuery("recipients.userEntityId", loggedUserIdStr))
              .must(termQuery("recipients.archivedByReceiver", Boolean.FALSE)))
        .should(
            boolQuery()
              .must(termQuery("groupRecipients.recipients.userEntityId", loggedUserIdStr))
              .must(termQuery("groupRecipients.recipients.archivedByReceiver", Boolean.FALSE)))
        .minimumShouldMatch(1));
    
    try {

      // Elastic Search API block
      
      SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder()
          .query(query)
          .from(start)
          .size(maxResults);

      if (CollectionUtils.isNotEmpty(sorts)) {
        sorts.forEach(sort -> searchSourceBuilder.sort(sort.getField(), SortOrder.valueOf(sort.getOrder().name())));
      }
      
      SearchRequest searchRequest = Requests.searchRequest(MUIKKU_COMMUNICATORMESSAGE_INDEX);
      searchRequest.source(searchSourceBuilder);
      
      SearchResponse response = elasticClient.search(searchRequest, RequestOptions.DEFAULT);
      
      // Elastic Search API block

      SearchHits searchHits = response.getHits();
      long totalHitCount = searchHits.getTotalHits().value;
      
      ObjectMapper objectMapper = new ObjectMapper();
      SearchHit[] results = searchHits.getHits();
      List<IndexedCommunicatorMessage> searchResults = Arrays.stream(results)
          .map(hit -> {
            String source = hit.getSourceAsString();
            try {
              return objectMapper.readValue(source, IndexedCommunicatorMessage.class);
            }
            catch (Exception e) {
              String documentId = hit != null ? hit.getId() : null;
              logger.log(Level.SEVERE, String.format("Couldn't parse indexed communicator message (id: %s)", documentId), e);
            }
            return null;
          })
          .collect(Collectors.toList());
      
      SearchResults<List<IndexedCommunicatorMessage>> result = new SearchResults<List<IndexedCommunicatorMessage>>(start, searchResults, totalHitCount);
      return result;
      
    } catch (Exception e) {
      logger.log(Level.SEVERE, "ElasticSearch query failed unexpectedly", e);
      return new SearchResults<List<IndexedCommunicatorMessage>>(0, new ArrayList<IndexedCommunicatorMessage>(), 0); 
    }
  }
  
  private String prepareQueryString(String queryString) {
    String prepared = queryString.trim();
    while (prepared.contains("  ")) {
      prepared = prepared.replace("  ", " ");
    }
    prepared = prepared.replace(" ", "* ");
    return prepared + "*";
  }
  
  @Override
  public SearchResult findUserGroup(SchoolDataIdentifier identifier) {
    
    BoolQueryBuilder query = boolQuery();
    IdsQueryBuilder includeIdsQuery = idsQuery("UserGroup");
    includeIdsQuery.addIds(String.format("%s/%s", identifier.getIdentifier(), identifier.getDataSource()));
    query.must(includeIdsQuery);
    
    // Search
    
    // Elastic Search API block
    
    SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder()
        .query(query);

    SearchRequest searchRequest = Requests.searchRequest(MUIKKU_USERGROUP_INDEX);
    searchRequest.source(searchSourceBuilder);
    
    SearchResponse response;
    try {
      response = elasticClient.search(searchRequest, RequestOptions.DEFAULT);
    } catch (IOException e) {
      // TODO Auto-generated catch block
      e.printStackTrace();
      throw new RuntimeException("KÄÄK");
    }
    
    // Elastic Search API block
    
    // Results processing
    
    List<Map<String, Object>> searchResults = new ArrayList<Map<String, Object>>();
    SearchHits searchHits = response.getHits();
    long totalHitCount = searchHits.getTotalHits().value;
    SearchHit[] results = searchHits.getHits();
    for (SearchHit hit : results) {
      Map<String, Object> hitSource = hit.getSourceAsMap();
      if(hitSource == null){
        hitSource = new HashMap<>();
        for(String key : hit.getFields().keySet()){
          hitSource.put(key, hit.getFields().get(key).getValue().toString());
        }
      }
      hitSource.put("indexType", hit.getType());
      searchResults.add(hitSource);
    }
    return new SearchResult(0, searchResults, totalHitCount);
  }

  @Override
  public SearchResult searchUserGroups(String query, String archetype, List<OrganizationEntity> organizations, int start, int maxResults) {
    try {
      if (CollectionUtils.isEmpty(organizations)) {
        throw new IllegalArgumentException("Cannot search with no organizations specified.");
      }
      
      query = sanitizeSearchString(query);
      
      BoolQueryBuilder boolQuery = boolQuery();

      if (StringUtils.isNotBlank(query)) {
        String[] words = query.split(" ");
        for (int i = 0; i < words.length; i++) {
          if (StringUtils.isNotBlank(words[i])) {
            boolQuery.must(prefixQuery("name", words[i]));
          }
        }
      }
      
      if (StringUtils.isNotBlank(archetype)) {
        boolQuery.must(termQuery("archetype", StringUtils.lowerCase(archetype)));
      }

      Set<String> organizationIdentifiers = organizations
          .stream()
          .filter(Objects::nonNull).map(organization -> String.format("%s-%s", organization.getDataSource().getIdentifier(), organization.getIdentifier()))
          .collect(Collectors.toSet());
      if (CollectionUtils.isNotEmpty(organizationIdentifiers)) {
        boolQuery.must(termsQuery("organizationIdentifier", organizationIdentifiers.toArray()));
      }

      // Elastic Search API block
      
      SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder()
          .query(boolQuery)
          .from(start)
          .size(maxResults);

      SearchRequest searchRequest = Requests.searchRequest(MUIKKU_USERGROUP_INDEX);
      searchRequest.source(searchSourceBuilder);
      
      SearchResponse response = elasticClient.search(searchRequest, RequestOptions.DEFAULT);
      
      // Elastic Search API block

      List<Map<String, Object>> searchResults = new ArrayList<Map<String, Object>>();
      SearchHits searchHits = response.getHits();
      long totalHitCount = searchHits.getTotalHits().value;
      SearchHit[] results = searchHits.getHits();
      for (SearchHit hit : results) {
        Map<String, Object> hitSource = hit.getSourceAsMap();
        hitSource.put("indexType", "UserGroup");
        searchResults.add(hitSource);
      }
      
      SearchResult result = new SearchResult(start, searchResults, totalHitCount);
      return result;
    } catch (Exception e) {
      logger.log(Level.SEVERE, "ElasticSearch query failed unexpectedly", e);
      return new SearchResult(0, new ArrayList<Map<String,Object>>(), 0);
    }
  }

  @Override
  public long countActiveStudents(OrganizationEntity organizationEntity) {
    long now = OffsetDateTime.now().toEpochSecond();
    String organizationIdentifier = String.format("%s-%s",
        organizationEntity.getDataSource().getIdentifier(), organizationEntity.getIdentifier());
    
    BoolQueryBuilder query = boolQuery();
    query.must(termsQuery("organizationIdentifier.untouched", organizationIdentifier));
    query.must(termQuery("isDefaultIdentifier", true));
    query.must(termsQuery("archetype", StringUtils.lowerCase(EnvironmentRoleArchetype.STUDENT.name()))); 

    Set<Long> activeWorkspaceEntityIds = getActiveWorkspaces();
    query.must(
      boolQuery()
        .should(boolQuery()
          .must(existsQuery("studyStartDate"))
          .must(rangeQuery("studyStartDate").lte(now))
          .mustNot(existsQuery("studyEndDate"))
        )
        .should(boolQuery()
          .must(existsQuery("studyStartDate"))
          .must(rangeQuery("studyStartDate").lte(now))
          .must(existsQuery("studyEndDate"))
          .must(rangeQuery("studyEndDate").gte(now))
        )
        .should(boolQuery()
          .mustNot(existsQuery("studyEndDate"))
          .mustNot(existsQuery("studyStartDate"))
          .must(termsQuery("workspaces", ArrayUtils.toPrimitive(activeWorkspaceEntityIds.toArray(new Long[0]))))
        )
    );

    try {
      SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder()
          .query(query)
          .from(0)
          .size(1);
  
      SearchRequest searchRequest = Requests.searchRequest(MUIKKU_USER_INDEX);
      searchRequest.source(searchSourceBuilder);
      
      SearchResponse response = elasticClient.search(searchRequest, RequestOptions.DEFAULT);
  
      return response.getHits().getTotalHits().value;
    } catch (Exception e) {
      logger.log(Level.SEVERE, "ElasticSearch query failed unexpectedly", e);
      return 0;
    }
  }

  @Override
  public long countInactiveStudents(OrganizationEntity organizationEntity) {
    long now = OffsetDateTime.now().toEpochSecond();
    String organizationIdentifier = String.format("%s-%s",
        organizationEntity.getDataSource().getIdentifier(), organizationEntity.getIdentifier());

    BoolQueryBuilder query = boolQuery();
    query.must(termsQuery("organizationIdentifier.untouched", organizationIdentifier));
    query.must(termQuery("isDefaultIdentifier", true));
    query.must(termsQuery("archetype", StringUtils.lowerCase(EnvironmentRoleArchetype.STUDENT.name()))); 
    
    Set<Long> activeWorkspaceEntityIds = getActiveWorkspaces();
    query.must(
      boolQuery()
        .should(boolQuery()
          .must(existsQuery("studyStartDate"))
          .must(rangeQuery("studyStartDate").gte(now))
          .mustNot(existsQuery("studyEndDate"))
        )
        .should(boolQuery()
          .must(existsQuery("studyEndDate"))
          .must(rangeQuery("studyEndDate").lte(now))
        )
        .should(boolQuery()
          .mustNot(existsQuery("studyEndDate"))
          .mustNot(existsQuery("studyStartDate"))
          .mustNot(termsQuery("workspaces", ArrayUtils.toPrimitive(activeWorkspaceEntityIds.toArray(new Long[0]))))
        )
    );

    try {
      SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder()
          .query(query)
          .from(0)
          .size(1);
  
      SearchRequest searchRequest = Requests.searchRequest(MUIKKU_USER_INDEX);
      searchRequest.source(searchSourceBuilder);
      
      SearchResponse response = elasticClient.search(searchRequest, RequestOptions.DEFAULT);
      
      return response.getHits().getTotalHits().value;
    } catch (Exception e) {
      logger.log(Level.SEVERE, "ElasticSearch query failed unexpectedly", e);
      return 0;
    }
  }

  @Override
  public String getName() {
    return "elastic-search";
  }

  private RestHighLevelClient elasticClient;
}
