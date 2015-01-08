package fi.muikku.plugins.material.fieldprocessing;


public class SelectFieldMaterialFieldProcessor {
//
//  @Inject
//  private QuerySelectFieldController querySelectFieldController;
//  
//  @Override
//  public void process(Material material, String content) throws JsonParseException, JsonMappingException, IOException {
//    ObjectMapper objectMapper = new ObjectMapper();
//    
//    SelectFieldMeta selectFieldMeta = objectMapper.readValue(content, SelectFieldMeta.class);
//    QuerySelectField querySelectField = querySelectFieldController.findQuerySelectFieldByMaterialAndName(material, selectFieldMeta.getName());
//    if (querySelectField == null) {
//      querySelectField = querySelectFieldController.createQuerySelectField(material, selectFieldMeta.getName());
//    }
//    
//    for (SelectFieldOptionMeta selectFieldOptionMeta : selectFieldMeta.getOptions()) {
//      QuerySelectFieldOption querySelectFieldOption = querySelectFieldController.findQuerySelectFieldOptionBySelectFieldAndName(querySelectField, selectFieldOptionMeta.getName());
//      if (querySelectFieldOption == null) {
//        querySelectFieldController.createQuerySelectFieldOption(querySelectField, selectFieldOptionMeta.getName(), selectFieldOptionMeta.getText());
//      } else {
//        querySelectFieldController.updateQuerySelectFieldOptionText(querySelectFieldOption, selectFieldOptionMeta.getText());
//      }
//    }
//  }
//
//  @Override
//  public String getType() {
//    return "application/vnd.muikku.field.select";
//  }

}
