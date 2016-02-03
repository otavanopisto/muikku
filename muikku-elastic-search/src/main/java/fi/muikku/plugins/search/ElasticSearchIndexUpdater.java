package fi.muikku.plugins.search;

import static org.elasticsearch.node.NodeBuilder.nodeBuilder;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.codehaus.jackson.map.ObjectMapper;
import org.elasticsearch.action.delete.DeleteResponse;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.common.lang3.StringUtils;
import org.elasticsearch.common.settings.ImmutableSettings.Builder;
import org.elasticsearch.node.Node;

import fi.muikku.search.IndexableEntityVault;
import fi.muikku.search.SearchIndexUpdater;
import fi.muikku.search.annotations.Indexable;
import fi.muikku.search.annotations.IndexableFieldMultiField;
import fi.muikku.search.annotations.IndexableFieldOption;

@ApplicationScoped
public class ElasticSearchIndexUpdater implements SearchIndexUpdater {

  @Inject
  private Logger logger;

  @Override
  public void init() {
    Builder settings = nodeBuilder().settings();
    settings.put("cluster.routing.allocation.disk.watermark.high", "99%");

    node = nodeBuilder().settings(settings).local(true).node();
    elasticClient = node.client();

    for (Indexable indexable : IndexableEntityVault.getEntities()) {
      String propertyName = indexable.name();
      Map<String, ElasticMappingProperty> properties = new HashMap<>();

      if (StringUtils.isNotBlank(propertyName)) {
        IndexableFieldOption[] fieldOptions = indexable.options();
        if (fieldOptions != null) {
          for (IndexableFieldOption fieldOption : fieldOptions) {
            if (StringUtils.isNotBlank(fieldOption.type())) {
              IndexableFieldMultiField[] multiFields = fieldOption.multiFields();
              Map<String, ElasticMappingPropertyOptionField> fields = null;

              if (multiFields != null && multiFields.length > 0) {
                fields = new HashMap<>();
                for (IndexableFieldMultiField multiField : multiFields) {
                  fields.put(multiField.name(), new ElasticMappingPropertyOptionField(multiField.type(), multiField.index()));
                }
              }

              properties.put(fieldOption.name(), new ElasticMappingProperty(fieldOption.type(), fields));
            }
          }
        }

        if (!properties.isEmpty()) {
          updateMapping(propertyName, new ElasticMappingProperties(properties));
        }
      }
    }
  }
  
  private void updateMapping(String propertyName, ElasticMappingProperties properties) {
    try {
      Map<String, ElasticMappingProperties> mappings = new HashMap<>();
      mappings.put(propertyName, properties);
      String mapping = new ObjectMapper().writeValueAsString(mappings);
      
      elasticClient.admin().indices()
          .preparePutMapping("muikku")
          .setType(propertyName)
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

  public static class ElasticMappingProperty {

    public ElasticMappingProperty(String type, Map<String, ElasticMappingPropertyOptionField> fields) {
      super();
      this.type = type;
      this.fields = fields;
    }

    public String getType() {
      return type;
    }

    public Map<String, ElasticMappingPropertyOptionField> getFields() {
      return fields;
    }

    private String type;
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
    node.close();
  }

  @Override
  public void addOrUpdateIndex(String typeName, Map<String, Object> entity) {
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
  public void deleteFromIndex(String typeName, String id) {
    @SuppressWarnings("unused")
    DeleteResponse response = elasticClient.prepareDelete("muikku", typeName, id).execute().actionGet();
  }

  @Override
  public String getName() {
    return "elastic-search";
  }

  private Client elasticClient;
  private Node node;

}
