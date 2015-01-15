package fi.muikku.plugins.material.fieldprocessing;

public class MultiSelectFieldMaterialFieldProcessor {
//
//  @Inject
//  private QueryMultiSelectFieldController queryMultiSelectFieldController;
//  
//  @Override
//  public void process(Material material, String content) throws JsonParseException, JsonMappingException, IOException {
//    ObjectMapper objectMapper = new ObjectMapper();
//    
//    MultiSelectFieldMeta multiSelectFieldMeta = objectMapper.readValue(content, MultiSelectFieldMeta.class);
//    QueryMultiSelectField queryMultiSelectField = queryMultiSelectFieldController.findQueryMultiSelectFieldByMaterialAndName(material, multiSelectFieldMeta.getName());
//    if (queryMultiSelectField == null) {
//      queryMultiSelectField = queryMultiSelectFieldController.createQueryMultiSelectField(material, multiSelectFieldMeta.getName());
//    }
//    
//    for (MultiSelectFieldOptionMeta multiSelectFieldOptionMeta : multiSelectFieldMeta.getOptions()) {
//      QueryMultiSelectFieldOption queryMultiSelectFieldOption = queryMultiSelectFieldController.findQueryMultiSelectFieldOptionByFieldAndName(queryMultiSelectField, multiSelectFieldOptionMeta.getName());
//      if (queryMultiSelectFieldOption == null) {
//        queryMultiSelectFieldController.createQueryMultiSelectFieldOption(queryMultiSelectField, multiSelectFieldOptionMeta.getName(), multiSelectFieldOptionMeta.getText());
//      } else {
//        queryMultiSelectFieldController.updateQueryMultiSelectFieldOptionText(queryMultiSelectFieldOption, multiSelectFieldOptionMeta.getText());
//      }
//    }
//  }
//
//  @Override
//  public String getType() {
//    return "application/vnd.muikku.field.multiselect";
//  }

}
