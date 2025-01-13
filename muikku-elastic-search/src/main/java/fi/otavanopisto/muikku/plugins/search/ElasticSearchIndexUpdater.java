package fi.otavanopisto.muikku.plugins.search;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpHost;
import org.elasticsearch.action.delete.DeleteRequest;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.client.indices.CreateIndexRequest;
import org.elasticsearch.client.indices.GetIndexRequest;
import org.elasticsearch.client.indices.PutMappingRequest;
import org.elasticsearch.xcontent.XContentType;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.search.IndexableEntityVault;
import fi.otavanopisto.muikku.search.SearchIndexUpdater;
import fi.otavanopisto.muikku.search.annotations.Indexable;
import fi.otavanopisto.muikku.search.annotations.IndexableFieldMultiField;
import fi.otavanopisto.muikku.search.annotations.IndexableFieldOption;
import fi.otavanopisto.muikku.search.annotations.IndexableFieldType;
import fi.otavanopisto.muikku.search.annotations.IndexableSubObject;

@ApplicationScoped
public class ElasticSearchIndexUpdater implements SearchIndexUpdater {

  private static final String DEFAULT_CLUSTERNAME = "elasticsearch";
  private static final int DEFAULT_PORTNUMBER = 9200;
  
  @Inject
  private Logger logger;
  
  @Inject
  private PluginSettingsController pluginSettingsController;

  @Override
  public void init() {
   /* Builder settings = nodeBuilder().settings();
    settings.put("cluster.routing.allocation.disk.watermark.high", "99%");
    settings.put("path.home", "./");

    node = nodeBuilder()
      .settings(settings)
      .local(true)
      .node();
    
    elasticClient = node.client();*/
    String clusterName = pluginSettingsController.getPluginSetting("elastic-search", "clusterName");
    if (clusterName == null) {
      clusterName = System.getProperty("elasticsearch.cluster.name");
    }
    if (clusterName == null) {
      clusterName = DEFAULT_CLUSTERNAME;
    }
    String portNumberProperty = System.getProperty("elasticsearch.node.port");
    int portNumber;
    if (portNumberProperty != null) {
      portNumber = Integer.decode(portNumberProperty);
    } else {
      portNumber = DEFAULT_PORTNUMBER;
    }

    elasticClient = new RestHighLevelClient(
        RestClient.builder(
                new HttpHost("localhost", portNumber, "http")));    

    for (Indexable indexable : IndexableEntityVault.getEntities()) {
      String indexName = indexable.indexName();

      try {
        ensureIndexExists(indexName);
      } catch (IOException ioe) {
        logger.log(Level.SEVERE, String.format("Failed to ensure index %s exists", indexName), ioe);
        continue;
      }
      
      Map<String, ElasticMappingProperty> properties = new HashMap<>();

      if (StringUtils.isNotBlank(indexName)) {
        IndexableFieldOption[] fieldOptions = indexable.options();
        if (fieldOptions != null) {
          for (IndexableFieldOption fieldOption : fieldOptions) {
            TypedElasticMappingProperty fieldMapping = fieldOptionToMapping(fieldOption);

            if (fieldMapping != null) {
              properties.put(fieldOption.name(), fieldMapping);
            }
          }
        }
        
        IndexableSubObject[] subObjects = indexable.subObjects();
        if (subObjects != null) {
          for (IndexableSubObject subObject : subObjects) {
            IndexableFieldOption[] subObjectOptions = subObject.options();
            
            if (subObjectOptions != null) {
              Map<String, ElasticMappingProperty> subObjectProperties = new HashMap<>();
              
              for (IndexableFieldOption subObjectOption : subObject.options()) {
                TypedElasticMappingProperty property = fieldOptionToMapping(subObjectOption);
                if (property != null) {
                  subObjectProperties.put(subObjectOption.name(), property);
                }
              }
              
              if (!subObjectProperties.isEmpty()) {
                properties.put(subObject.name(), new ElasticMappingProperties(subObjectProperties));
              }
            }
          }
        }

        if (!properties.isEmpty()) {
          try {
            updateMapping(indexName, new ElasticMappingProperties(properties));
          } catch (IOException e) {
            logger.log(Level.SEVERE, String.format("Failed to update mapping for index %s.", indexName), e);
          }
        }
      }
    }
  }

  private TypedElasticMappingProperty fieldOptionToMapping(IndexableFieldOption fieldOption) {
    TypedElasticMappingProperty fieldMapping = null;
    
    switch (fieldOption.type()) {
      case KEYWORD:
      case TEXT:
        fieldMapping = new ElasticMappingStringProperty(fieldOption.type(), fieldOption.index());
      break;
      case DATE:
        // For elastic: date = yyyy-MM-dd
        fieldMapping = new ElasticMappingDateProperty("date");
      break;
    }
    
    if (fieldMapping == null) {
      logger.severe(String.format("Unknown field type %s", fieldOption.type()));
    } else {
      IndexableFieldMultiField[] multiFields = fieldOption.multiFields();

      if (multiFields != null && multiFields.length > 0) {
        for (IndexableFieldMultiField multiField : multiFields) {
          fieldMapping.addField(multiField.name(), new ElasticMappingPropertyOptionField(multiField.type(), multiField.index()));
        }
      }
    }

    return fieldMapping;
  }
  
  private void ensureIndexExists(String indexName) throws IOException {
    GetIndexRequest getIndexRequest = new GetIndexRequest(indexName);
    if (!elasticClient.indices().exists(getIndexRequest, RequestOptions.DEFAULT)) {
      logger.info(String.format("Creating index: %s", indexName));
      CreateIndexRequest createIndexRequest = new CreateIndexRequest(indexName);
      elasticClient.indices().create(createIndexRequest, RequestOptions.DEFAULT);
    }
  }
  
  private void updateMapping(String indexName, ElasticMappingProperties properties) throws IOException {
    String mapping = new ObjectMapper().writeValueAsString(properties);
    
    PutMappingRequest mappingRequest = new PutMappingRequest(indexName);
    mappingRequest.source(mapping, XContentType.JSON);
    
    elasticClient.indices().putMapping(mappingRequest, RequestOptions.DEFAULT);
  }

  public static String elasticType(IndexableFieldType type) {
    switch (type) {
      case TEXT:
        return "text";
      case KEYWORD:
        return "keyword";
      case DATE:
        return "date";
    }
    
    return null;
  }
  
  public abstract static class ElasticMappingProperty {
  }
  
  public static class ElasticMappingProperties extends ElasticMappingProperty {

    public ElasticMappingProperties(Map<String, ElasticMappingProperty> properties) {
      super();
      this.properties = properties;
    }

    public Map<String, ElasticMappingProperty> getProperties() {
      return properties;
    }

    private Map<String, ElasticMappingProperty> properties;
  }
  
  public abstract static class TypedElasticMappingProperty extends ElasticMappingProperty {

    public TypedElasticMappingProperty(String type) {
      this.type = type;
    }
    
    public String getType() {
      return type;
    }

    public void addField(String name, ElasticMappingPropertyOptionField field) {
      this.fields.put(name, field);
    }
    
    public Map<String, ElasticMappingPropertyOptionField> getFields() {
      return fields;
    }

    private String type;
    private Map<String, ElasticMappingPropertyOptionField> fields = new HashMap<>();
  }

  public static class ElasticMappingStringProperty extends TypedElasticMappingProperty {

    public ElasticMappingStringProperty(IndexableFieldType indexableFieldType, boolean indexed) {
      super(indexableFieldType == IndexableFieldType.KEYWORD ? "keyword" : "text");
      this.index = indexed;
    }

    public boolean getIndex() {
      return index;
    }
      
    private boolean index;
  }
  
  public static class ElasticMappingDateProperty extends TypedElasticMappingProperty {

    public ElasticMappingDateProperty(String format) {
      super("date");
      this.format = format;
    }

    public String getFormat() {
      return format;
    }

    private final String format;
  }
  
  public static class ElasticMappingPropertyOptionField {

    public ElasticMappingPropertyOptionField(IndexableFieldType indexableFieldType, boolean indexed) {
      super();
      this.type = elasticType(indexableFieldType);
      this.index = indexed;
    }

    public boolean getIndex() {
      return index;
    }

    public String getType() {
      return type;
    }

    private String type;
    private boolean index;
  }

  @Override
  public void deinit() {
    try {
      elasticClient.close();
    } catch (IOException e) {
      logger.log(Level.SEVERE, "Couldn't deinitialize connection.", e);
    }
  }

  @Override
  public void addOrUpdateIndex(String indexName, String typeName, Map<String, Object> entity) {
    ObjectMapper mapper = new ObjectMapper();
    mapper.registerModule(new JavaTimeModule());
    
    String json;
    try {
      json = mapper.writeValueAsString(entity);
      String id = entity.get("id").toString();
      
      IndexRequest indexRequest = new IndexRequest(indexName)
          .id(id)
          .source(json, XContentType.JSON);
      
      elasticClient.index(indexRequest, RequestOptions.DEFAULT);
    } catch (IOException e) {
      logger.log(Level.WARNING, "Adding to index failed because of exception", e);
    }
  }

  @Override
  public void deleteFromIndex(String indexName, String typeName, String id) {
    DeleteRequest deleteRequest = new DeleteRequest(indexName, id);
    try {
      elasticClient.delete(deleteRequest, RequestOptions.DEFAULT);
    } catch (IOException e) {
      logger.log(Level.SEVERE, String.format("Couldn't delete a document %s from index %s.", id, indexName), e);
    }
  }

  @Override
  public String getName() {
    return "elastic-search";
  }

  private RestHighLevelClient elasticClient;
}
