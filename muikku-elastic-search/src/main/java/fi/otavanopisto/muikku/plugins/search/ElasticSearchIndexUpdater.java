package fi.otavanopisto.muikku.plugins.search;

import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.elasticsearch.action.delete.DeleteResponse;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.InetSocketTransportAddress;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JSR310Module;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.search.IndexableEntityVault;
import fi.otavanopisto.muikku.search.SearchIndexUpdater;
import fi.otavanopisto.muikku.search.annotations.Indexable;
import fi.otavanopisto.muikku.search.annotations.IndexableFieldMultiField;
import fi.otavanopisto.muikku.search.annotations.IndexableFieldOption;

@ApplicationScoped
public class ElasticSearchIndexUpdater implements SearchIndexUpdater {

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
        
    for (Indexable indexable : IndexableEntityVault.getEntities()) {
      String indexName = indexable.indexName();
      
      if (!indexExists(indexName)) {
        createIndex(indexName);
      }

      String typeName = indexable.typeName();
      
      Map<String, ElasticMappingProperty> properties = new HashMap<>();

      if (StringUtils.isNotBlank(typeName)) {
        IndexableFieldOption[] fieldOptions = indexable.options();
        if (fieldOptions != null) {
          for (IndexableFieldOption fieldOption : fieldOptions) {
            switch (fieldOption.type()) {
              case "multi_field":
                if (StringUtils.isNotBlank(fieldOption.type())) {
                  IndexableFieldMultiField[] multiFields = fieldOption.multiFields();
                  Map<String, ElasticMappingPropertyOptionField> fields = null;

                  if (multiFields != null && multiFields.length > 0) {
                    fields = new HashMap<>();
                    for (IndexableFieldMultiField multiField : multiFields) {
                      fields.put(multiField.name(), new ElasticMappingPropertyOptionField(multiField.type(), multiField.index()));
                    }
                  }

                  properties.put(fieldOption.name(), new ElasticMappingMultifieldProperty(fields));
                }
              break;
              case "string":
                properties.put(fieldOption.name(), new ElasticMappingStringProperty(fieldOption.index()));
              break;
              default:
                logger.severe(String.format("Unknown field type %s", fieldOption.type()));
              break;
            }
          }
        }

        if (!properties.isEmpty()) {
          updateMapping(indexName, typeName, new ElasticMappingProperties(properties));
        }
      }
    }
  }
  
  private void createIndex(String indexName) {
    logger.info(String.format("Creating elastic index %s", indexName));
    elasticClient
      .admin()
      .indices()
      .prepareCreate(indexName)
      .execute()
      .actionGet();
  }

  private boolean indexExists(String indexName) {
    return elasticClient
      .admin()
      .indices()
      .prepareExists(indexName)
      .execute()
      .actionGet()
      .isExists();
  }

  private void updateMapping(String indexName, String typeName, ElasticMappingProperties properties) {
    try {
      Map<String, ElasticMappingProperties> mappings = new HashMap<>();
      mappings.put(typeName, properties);
      String mapping = new ObjectMapper()
        .writeValueAsString(mappings);
      
      elasticClient.admin().indices()
          .preparePutMapping(indexName)
          .setType(typeName)
          .setSource(mapping)
          .execute()
          .actionGet();
    } catch (IOException e) {
      logger.severe("Failed to update ElasticSearch mappings");
    }
  }

  public static class ElasticMappingProperties {

    public ElasticMappingProperties(Map<String, ElasticMappingProperty> properties) {
      super();
      this.properties = properties;
    }

    public Map<String, ElasticMappingProperty> getProperties() {
      return properties;
    }

    private Map<String, ElasticMappingProperty> properties;
  }
  
  public abstract static class ElasticMappingProperty {

    public ElasticMappingProperty(String type) {
      this.type = type;
    }
    
    public String getType() {
      return type;
    }

    private String type;
  }

  public static class ElasticMappingStringProperty extends ElasticMappingProperty {

    public ElasticMappingStringProperty(String index) {
      super("string");
      this.index = index;
    }

    public String getIndex() {
      return index;
    }
      
    private String index;
  }
  
  public static class ElasticMappingMultifieldProperty extends ElasticMappingProperty {

    public ElasticMappingMultifieldProperty(Map<String, ElasticMappingPropertyOptionField> fields) {
      super("multi_field");
      this.fields = fields;
    }

    public Map<String, ElasticMappingPropertyOptionField> getFields() {
      return fields;
    }

    private Map<String, ElasticMappingPropertyOptionField> fields;
  }

  public static class ElasticMappingPropertyOptionField {

    public ElasticMappingPropertyOptionField(String type, String index) {
      super();
      this.type = type;
      this.index = index;
    }

    public String getIndex() {
      return index;
    }

    public String getType() {
      return type;
    }

    private String type;
    private String index;
  }

  @Override
  public void deinit() {
    elasticClient.close();
    //node.close();
  }

  @Override
  public void addOrUpdateIndex(String indexName, String typeName, Map<String, Object> entity) {
    ObjectMapper mapper = new ObjectMapper();
    mapper.registerModule(new JSR310Module());
    
    String json;
    try {
      json = mapper.writeValueAsString(entity);
      String id = entity.get("id").toString();
      @SuppressWarnings("unused")
      IndexResponse response = elasticClient.prepareIndex(indexName, typeName, id).setSource(json).execute().actionGet();
    } catch (IOException e) {
      logger.log(Level.WARNING, "Adding to index failed because of exception", e);
    }
  }

  @Override
  public void deleteFromIndex(String indexName, String typeName, String id) {
    @SuppressWarnings("unused")
    DeleteResponse response = elasticClient.prepareDelete(indexName, typeName, id).execute().actionGet();
  }

  @Override
  public String getName() {
    return "elastic-search";
  }

  private Client elasticClient;
  //private Node node;

}
