package fi.otavanopisto.muikku.plugins.ceepos.rest;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.Invocation.Builder;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.apache.commons.lang3.StringUtils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.hash.Hashing;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.i18n.LocaleController;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.ceepos.CeeposController;
import fi.otavanopisto.muikku.plugins.ceepos.CeeposPermissions;
import fi.otavanopisto.muikku.plugins.ceepos.model.CeeposOrder;
import fi.otavanopisto.muikku.plugins.ceepos.model.CeeposOrderState;
import fi.otavanopisto.muikku.plugins.ceepos.model.CeeposProduct;
import fi.otavanopisto.muikku.plugins.ceepos.model.CeeposProductType;
import fi.otavanopisto.muikku.plugins.ceepos.model.CeeposStudyTimeOrder;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.UserSchoolDataController;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserEntityName;
import fi.otavanopisto.security.rest.RESTPermit;
import fi.otavanopisto.security.rest.RESTPermit.Handling;

@Path("/ceepos")
@RequestScoped
@Stateful
@Produces(MediaType.APPLICATION_JSON)
public class CeeposRESTService {
  
  private static final String API_VERSION = "3.0.0";
  
  private static final int PAYMENT_FAILED_OR_CANCELLED = 0;
  private static final int PAYMENT_SUCCESSFUL = 1;
  private static final int PAYMENT_PROCESSING = 2;
  private static final int PAYMENT_ALREADY_COMPLETED_CANNOT_DELETE = 3;
  private static final int PAYMENT_ALREADY_DELETED = 4;
  private static final int DOUBLE_ID = 97;
  private static final int SYSTEM_ERROR = 98;
  private static final int FAULTY_PAYMENT_REQUEST = 99;

  @Inject
  private Logger logger;
  
  @Inject
  private SessionController sessionController;

  @Inject
  private LocaleController localeController;

  @Inject
  private UserController userController;

  @Inject
  private UserEntityController userEntityController;

  @Inject
  private UserSchoolDataController userSchoolDataController;

  @Inject
  private PluginSettingsController pluginSettingsController;
  
  @Inject
  private CeeposController ceeposController;

  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;
  
  @Path("/test")
  @GET
  @RESTPermit(handling = Handling.INLINE)
  public Response test() {
    // For quick debug purposes
    return Response.ok().build();
  }
  
  /**
   * REQUEST:
   * 
   * mApi().ceepos.order.create({
   *   'studentIdentifier': 'PYRAMUS-STUDENT-123',
   *   'product': {
   *     'Code': 'PRODUCT0001'
   *   }
   * });
   * 
   * RESPONSE:
   * 
   * {
   *   'id': 123, // order id
   *   'studentIdentifier': 'PYRAMUS-STUDENT-123',
   *   'studentEmail': 'student@email.com',
   *   'product': {
   *     'Code': 'PRODUCT0001',
   *     'Amount': 1, // Irrelevant, always defaults to one
   *     'Description': 'Product description to be shown in UI',
   *     'Price': 5000 // Product price in cents
   *   }
   *   'state': CREATED
   *   'created': 2021-10-28T08:57:57+03:00 
   * }
   * 
   * DESCRIPTION:
   * 
   * Creates a new order for a student.
   * 
   * @param paymentRequest Payload object
   * 
   * @return Created payment request
   */
  @Path("/order")
  @POST
  @RESTPermit(CeeposPermissions.CREATE_ORDER)
  public Response createPaymentRequest(CeeposOrderRestModel paymentRequest) {
    
    // Validate payload
    
    SchoolDataIdentifier sdi = SchoolDataIdentifier.fromId(paymentRequest.getStudentIdentifier());
    User student = userController.findUserByIdentifier(sdi);
    if (student == null) {
      return Response.status(Status.BAD_REQUEST).entity(String.format("Invalid student %s", paymentRequest.getStudentIdentifier())).build();
    }
    CeeposProduct product = ceeposController.findProductByCode(paymentRequest.getProduct().getCode());
    if (product == null) {
      return Response.status(Status.BAD_REQUEST).entity(String.format("Invalid product %s", paymentRequest.getProduct().getCode())).build();
    }
    
    // Contact emails for this order
    
    String staffEmail = null;
    String studentEmail = null;
    schoolDataBridgeSessionController.startSystemSession();
    try {
      staffEmail = userController.getUserDefaultEmailAddress(sessionController.getLoggedUser());
      studentEmail = userController.getUserDefaultEmailAddress(sdi);
    }
    finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
    
    // Create order and complement the payload object accordingly
    
    CeeposOrder order = null;
    if (product.getType() == CeeposProductType.STUDYTIME) {
      order = ceeposController.createStudyTimeOrder(paymentRequest.getStudentIdentifier(), product, studentEmail, staffEmail);
    }
    else {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Unknown product type").build();
    }
    paymentRequest.setCreated(toOffsetDateTime(order.getCreated()));
    paymentRequest.setId(order.getId());
    paymentRequest.getProduct().setDescription(order.getProduct().getDescription());
    paymentRequest.getProduct().setPrice(order.getProduct().getPrice());
    paymentRequest.setState(order.getState());
    paymentRequest.setStudentEmail(studentEmail);
    
    // TODO Email student about the order
    
    return Response.ok(paymentRequest).build();
  }
  
  /**
   * REQUEST:
   * 
   * mApi().ceepos.user.order.read('PYRAMUS-STUDENT-123', 123);
   * 
   * RESPONSE:
   * 
   * {'id': 123, // order id
   *  'studentIdentifier': 'PYRAMUS-STUDENT-123',
   *  'studentEmail': 'student@email.com',
   *  'product': {
   *    'Code': 'PRODUCT0001',
   *    'Amount': 1, // Irrelevant, always defaults to one
   *    'Price': 5000, // Product price in cents
   *    'Description': 'Product description to be shown in UI'
   *  }
   *  'state': CREATED | ONGOING | PAID | CANCELLED | ERRORED | COMPLETE
   *  'created': 2021-10-28T08:57:57+03:00 
   * }
   * 
   * DESCRIPTION:
   * 
   * Returns a single order belonging to the given user.
   * 
   * @param userIdentifier User identifier
   * @param orderId Order id
   * 
   * @return Order of the given user
   */
  @Path("/user/{USERIDENTIFIER}/order/{ORDERID}")
  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response getOrder(@PathParam("USERIDENTIFIER") String userIdentifier, @PathParam("ORDERID") Long orderId) {
    
    // Find order
    
    CeeposOrder order = ceeposController.findOrderByIdAndArchived(orderId, false);
    if (order == null) {
      return Response.status(Status.NOT_FOUND).build();
    }
    if (!StringUtils.equals(order.getUserIdentifier(), userIdentifier)) {
      return Response.status(Status.BAD_REQUEST).entity("Order user mismatch").build();
    }
    
    // Access check

    if (!sessionController.hasEnvironmentPermission(CeeposPermissions.FIND_ORDER)) {
      SchoolDataIdentifier sdi = SchoolDataIdentifier.fromId(userIdentifier);
      UserEntity userEntity = userEntityController.findUserEntityByUserIdentifier(sdi);
      if (userEntity == null || !userEntity.getId().equals(sessionController.getLoggedUserEntity().getId())) {
        logger.severe(String.format("User %s access to order of %s revoked", sessionController.getLoggedUser().toId(), userIdentifier));
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    
    // Return object

    CeeposOrderRestModel restOrder = new CeeposOrderRestModel();
    restOrder.setCreated(toOffsetDateTime(order.getCreated()));
    restOrder.setId(order.getId());
    restOrder.setProduct(new CeeposProductRestModel(
        order.getProduct().getCode(),
        1,
        order.getProduct().getPrice(),
        getLocalizedDescription(order.getProduct())));
    restOrder.setState(order.getState());
    restOrder.setStudentIdentifier(order.getUserIdentifier());
    restOrder.setStudentEmail(order.getEmail());
    
    return Response.ok(restOrder).build();
  }

  /**
   * REQUEST:
   * 
   * mApi().ceepos.user.orders.read('PYRAMUS-STUDENT-123');
   * 
   * RESPONSE:
   * 
   * [{
   *   'id': 123, // order id
   *   'studentIdentifier': 'PYRAMUS-STUDENT-123',
   *   'studentEmail': 'student@email.com',
   *   'product': {
   *     'Code': 'PRODUCT0001',
   *     'Description': 'Product description to be shown in UI',
   *     'Price': 5000 // Product price in cents
   *   }
   *   'state': CREATED | ONGOING | PAID | CANCELLED | ERRORED | COMPLETE
   *   'created': 2021-10-28T08:57:57+03:00 
   * },
   * ...]
   * 
   * DESCRIPTION:
   * 
   * Returns a list of orders belonging to the given user.
   * 
   * @param userIdentifier User identifier
   * 
   * @return Orders of the given user
   */
  @Path("/user/{USERIDENTIFIER}/orders")
  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response listOrdersByUser(@PathParam("USERIDENTIFIER") String userIdentifier) {
    
    // Access check

    if (!sessionController.hasEnvironmentPermission(CeeposPermissions.LIST_USER_ORDERS)) {
      SchoolDataIdentifier sdi = SchoolDataIdentifier.fromId(userIdentifier);
      UserEntity userEntity = userEntityController.findUserEntityByUserIdentifier(sdi);
      if (userEntity == null || !userEntity.getId().equals(sessionController.getLoggedUserEntity().getId())) {
        logger.severe(String.format("User %s access to list orders of %s revoked", sessionController.getLoggedUser().toId(), userIdentifier));
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    
    // TODO Filter orders that failed or got cancelled?
    
    List<CeeposOrderRestModel> restOrders = new ArrayList<>();
    List<CeeposOrder> orders = ceeposController.listOrdersByUserIdentifier(userIdentifier);
    for (CeeposOrder order : orders) {
      CeeposOrderRestModel restOrder = new CeeposOrderRestModel();
      restOrder.setCreated(toOffsetDateTime(order.getCreated()));
      restOrder.setId(order.getId());
      restOrder.setProduct(new CeeposProductRestModel(
          order.getProduct().getCode(),
          1,
          order.getProduct().getPrice(),
          getLocalizedDescription(order.getProduct())));
      restOrder.setState(order.getState());
      restOrder.setStudentIdentifier(order.getUserIdentifier());
      restOrder.setStudentEmail(order.getEmail());
      restOrders.add(restOrder);
    }
    
    return Response.ok(restOrders).build();
  }
  
  /**
   * REQUEST:
   * 
   * mApi().ceepos.products.read();
   * 
   * RESPONSE:
   * 
   * [{
   *   'Code': 'XXXX',
   *   'Amount': 1, // irrelevant, always defaults to one
   *   'Price': 5000, // price in cents
   *   'Description': 'Some product to buy',
   * },
   * ...]
   * 
   * DESCRIPTION:
   * 
   * Returns a list of products to buy
   * 
   * @return Product list 
   */
  @Path("/products")
  @GET
  @RESTPermit(CeeposPermissions.LIST_PRODUCTS)
  public Response listProducts() {
    List<CeeposProduct> products = ceeposController.listProducts();
    List<CeeposProductRestModel> restProducts = new ArrayList<>();
    for (CeeposProduct product : products) {
      restProducts.add(new CeeposProductRestModel(
          product.getCode(),
          1,
          product.getPrice(),
          getLocalizedDescription(product)));
    }
    return Response.ok(restProducts).build();
  }
  
  /**
   * REQUEST:
   * 
   * mApi().ceepos.pay.create({
   *   'id': '123', // order id
   *   'studentEmail': 'student@email.com' // email confirmed by user in pay page
   * });
   * 
   * RESPONSE:
   * 
   * https://www.somesite.com/gopay.html
   * 
   * DESCRIPTION:
   * 
   * Sends a payment request for an order to Ceepos.
   * 
   * @param payload Payload object  
   * 
   * @return The url to which the user should be redirected to complete payment.
   */
  @Path("/pay")
  @POST
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response sendPaymentRequest(CeeposOrderRestModel payload) {
    
    // Validate payload
    
    if (payload.getId() == null) {
      return Response.status(Status.BAD_REQUEST).entity("Missing id").build();
    }
    if (StringUtils.isEmpty(payload.getStudentEmail())) {
      return Response.status(Status.BAD_REQUEST).entity("Missing studentEmail").build();
    }
    
    // Find the order
    
    CeeposOrder order = ceeposController.findOrderByIdAndArchived(payload.getId(), false);
    if (order == null) {
      logger.warning(String.format("Order %d not found", payload.getId()));
      return Response.status(Status.NOT_FOUND).build();
    }
    
    // Ensure order ownership

    if (!sessionController.hasEnvironmentPermission(CeeposPermissions.PAY_ORDER)) {
      SchoolDataIdentifier sdi = SchoolDataIdentifier.fromId(order.getUserIdentifier());
      UserEntity userEntity = userEntityController.findUserEntityByUserIdentifier(sdi);
      if (userEntity == null || !userEntity.getId().equals(sessionController.getLoggedUserEntity().getId())) {
        logger.severe(String.format("User %s access to order %d revoked", sessionController.getLoggedUser().toId(), order.getId()));
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    
    // Ensure order hasn't been paid yet
    
    if (order.getState() == CeeposOrderState.PAID || order.getState() == CeeposOrderState.COMPLETE) {
      logger.warning(String.format("Unable to pay order %d. State is already %s", payload.getId(), order.getState()));
      return Response.status(Status.BAD_REQUEST).entity(String.format("Invalid order state %s", order.getState())).build();
    }
    
    // Resolve name
    
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    UserEntityName userEntityName = userEntityController.getName(userEntity);
    
    // TODO Can we retry payments that are CANCELLED or ERRORED?
    
    // Set the payment user email
    
    if (!StringUtils.equals(payload.getStudentEmail(), order.getEmail())) {
      order = ceeposController.updateOrderEmail(order, payload.getStudentEmail());
    }
    
    // Create payload to Ceepos
    
    CeeposPaymentRestModel ceeposPayload = new CeeposPaymentRestModel();
    ceeposPayload.setApiVersion(API_VERSION);
    ceeposPayload.setSource(getSetting("source"));
    ceeposPayload.setId(order.getId().toString());
    ceeposPayload.setMode(3);
    ceeposPayload.setAction("new payment");
    ceeposPayload.setDescription(userEntityName.getDisplayNameWithLine());
    List<CeeposProductRestModel> products = new ArrayList<>();
    products.add(new CeeposProductRestModel(
        order.getProduct().getCode(),
        1,
        order.getProduct().getPrice(),
        getLocalizedDescription(order.getProduct())));
    ceeposPayload.setProducts(products);
    ceeposPayload.setEmail(payload.getStudentEmail());
    ceeposPayload.setFirstName(userEntityName.getFirstName());
    ceeposPayload.setLastName(userEntityName.getLastName());
    ceeposPayload.setLanguage(sessionController.getLocale().getLanguage());
    ceeposPayload.setReturnAddress(getSetting("returnAddress"));
    ceeposPayload.setNotificationAddress(getSetting("notificationAddress"));
    ceeposPayload.setHash(calculateHash(ceeposPayload));
    
    try {
      String json = new ObjectMapper().writeValueAsString(ceeposPayload);
      logger.info("Ceepos payment request: " + json);
    }
    catch (JsonProcessingException e) {
      logger.log(Level.SEVERE, "Unable to deserialize Ceepos payment request", e);
    }
    
    // Call Ceepos
    
    Client client = ClientBuilder.newClient();
    WebTarget target = client.target(getSetting("server"));
    Builder request = target.request().header("Content-Type", MediaType.APPLICATION_JSON);
    Entity<CeeposPaymentRestModel> entity = Entity.entity(ceeposPayload, MediaType.APPLICATION_JSON);
    Response response = request.post(entity);
    
    // Check success response
    
    if (response.getStatus() != 200) {
      logger.severe(String.format("Ceepos payment request response: %d", response.getStatus()));
      logger.severe("Ceepos payment request response entity: " + response.getEntity());
      if (response.getEntity() != null) {
        logger.severe("Ceepos payment request response entity: " + response.getEntity().toString());
      }
      logger.severe("Ceepos payment request response: " + response.toString());
      // TODO Figure out what went wrong
      return Response.status(Status.INTERNAL_SERVER_ERROR).build();
    }
    
    // Check payment being in progress
    
    CeeposPaymentResponseRestModel ceeposPayloadResponse = response.readEntity(CeeposPaymentResponseRestModel.class);
    try {
      String json = new ObjectMapper().writeValueAsString(ceeposPayloadResponse);
      logger.info("Ceepos payment response: " + json);
    }
    catch (JsonProcessingException e) {
      logger.log(Level.SEVERE, "Unable to deserialize Ceepos payment request", e);
    }
    if (ceeposPayloadResponse.getStatus() != PAYMENT_PROCESSING) {
      logger.severe(String.format("Unexpected payment response status %d", ceeposPayloadResponse.getStatus()));
      // TODO Figure out what went wrong
      return Response.status(Status.INTERNAL_SERVER_ERROR).build();
    }
    boolean validHash = validateHash(ceeposPayloadResponse);
    if (!validHash) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Payment response hash failure").build();
    }
    
    // Update order payment address
    
    order = ceeposController.updateOrderStateAndOrderNumberAndPaymentAddress(
        order,
        CeeposOrderState.ONGOING,
        ceeposPayloadResponse.getReference(),
        ceeposPayloadResponse.getPaymentAddress());
    
    // Return the address to which the user should be redirected to finish the payment
    // TODO Could be returned as plain text but due to an mApi bug, has to be returned
    // as json, hence the quotes
    
    return Response.ok(String.format("\"%s\"", order.getCeeposPaymentAddress())).build();
  }
  
  @Path("/dummyPaymentResponse")
  @POST
  @RESTPermit(handling = Handling.INLINE)
  public Response dummyPaymentAddress(CeeposPaymentRestModel payload) {
    logger.info("dummyPaymentResponse"); 

    CeeposPaymentResponseRestModel r = new CeeposPaymentResponseRestModel();
    r.setId(payload.getId());
    r.setStatus(2);
    r.setReference("123");
    r.setAction("new payment");
    String retu = getSetting("returnAddress");
    r.setPaymentAddress(retu);
    String s = payload.getId() + "&2&123&new payment&" + getSetting("returnAddress") + "&" + getSetting("key");
    s = Hashing.sha256().hashString(s, StandardCharsets.UTF_8).toString();
    r.setHash(s);

    Timer timer = new Timer();
    timer.schedule(new TimerTask() {
      @Override
      public void run() {
        CeeposPaymentConfirmationRestModel dummyConfirmation = new CeeposPaymentConfirmationRestModel();
        dummyConfirmation.setId(payload.getId());
        dummyConfirmation.setStatus(1);
        dummyConfirmation.setReference("123");
        String s = payload.getId() + "&1&123&" + getSetting("key");
        s = Hashing.sha256().hashString(s, StandardCharsets.UTF_8).toString();
        dummyConfirmation.setHash(s);
        Client client = ClientBuilder.newClient();
        WebTarget target = client.target("https://dev.muikkuverkko.fi/rest/ceepos/paymentConfirmation");
        Builder request = target.request().header("Content-Type", MediaType.APPLICATION_JSON);
        Entity<CeeposPaymentConfirmationRestModel> entity = Entity.entity(dummyConfirmation, MediaType.APPLICATION_JSON);
        request.post(entity);
      }
    }, 3000);
    
    
    return Response.ok(r).build();
  }
  
  @Path("/paymentConfirmation")
  @POST
  @RESTPermit(handling = Handling.INLINE)
  public Response paymentConfirmation(CeeposPaymentConfirmationRestModel paymentConfirmation) {
    return handlePaymentConfirmation(paymentConfirmation);
  }
  
  @Path("/paymentConfirmationManual")
  @GET
  @RESTPermit(handling = Handling.INLINE)
  public Response paymentConfirmationManual(@QueryParam("id") String id, @QueryParam("status") Integer status, @QueryParam("reference") String reference, @QueryParam("hash") String hash) {
    CeeposPaymentConfirmationRestModel paymentConfirmation = new CeeposPaymentConfirmationRestModel();
    paymentConfirmation.setId(id);
    paymentConfirmation.setStatus(status);
    paymentConfirmation.setReference(reference);
    paymentConfirmation.setHash(hash);
    return handlePaymentConfirmation(paymentConfirmation);
  }
  
  @Path("/paymentConfirmationDebug")
  @POST
  @RESTPermit(handling = Handling.INLINE)
  public Response paymentConfirmationDebug(Object object) {
    ObjectMapper objectMapper = new ObjectMapper();
    try {
      String json = objectMapper.writeValueAsString(object);
      logger.info("---------- Payment confirmation debug ----------");
      logger.info(json);
    }
    catch (JsonProcessingException e) {
      logger.log(Level.SEVERE, "Payment confirmation debug", e);
    }
    return Response.ok().build();
  }
  
  /**
   * Handles a payment confirmation message from Ceepos by validating it and fulfilling the order
   * if it went through without any issues.
   * 
   * @param paymentConfirmation Ceepos payment confirmation
   * 
   * @return Response to be delivered back to Ceepos
   */
  private Response handlePaymentConfirmation(CeeposPaymentConfirmationRestModel paymentConfirmation) {
    
    // Log the payment confirmation 

    String json = null;
    ObjectMapper objectMapper = new ObjectMapper();
    try {
      json = objectMapper.writeValueAsString(paymentConfirmation);
      logger.info(String.format("Received payment confirmation: %s", json));
    }
    catch (JsonProcessingException e) {
      logger.log(Level.SEVERE, "Unable to deserialize payment response", e);
    }

    // Validate payload
    
    boolean validHash = validateHash(paymentConfirmation);
    if (!validHash) {
      logger.severe(String.format("Invalid hash for confirmed payment %s", paymentConfirmation.getId()));
      return Response.status(Status.BAD_REQUEST).entity("Invalid hash").build();
    }
    
    // Ensure our order exists (archived is semi-fine since this is a programmatic call)
    
    CeeposOrder order = ceeposController.findOrderById(new Long(paymentConfirmation.getId()));
    if (order == null) {
      logger.severe(String.format("Order %s not found", paymentConfirmation.getId()));
      return Response.status(Status.BAD_REQUEST).entity("Source system order not found").build();
    }
    if (order.getArchived()) {
      logger.warning(String.format("Received payment confirmation for an archived order %d", order.getId()));
    }
    if (order.getState() != CeeposOrderState.ONGOING) {
      logger.warning(String.format("Received payment confirmation for order %d in state %s", order.getId(), order.getState()));
    }
    
    // Handle various errors

    if (paymentConfirmation.getStatus() != PAYMENT_SUCCESSFUL) {
      logger.warning(String.format("Unexpected payment confirmation status %d", paymentConfirmation.getStatus()));
      switch (paymentConfirmation.getStatus()) {
      case PAYMENT_FAILED_OR_CANCELLED:
      case PAYMENT_ALREADY_DELETED:
        logger.warning(String.format("Updating CeeposPayment %d to CANCELLED", order.getId()));
        ceeposController.updateOrderStateAndOrderNumber(order, CeeposOrderState.CANCELLED, paymentConfirmation.getReference());
        break;
      case DOUBLE_ID:
      case SYSTEM_ERROR:
      case FAULTY_PAYMENT_REQUEST:
        logger.warning(String.format("Updating CeeposPayment %d to ERRORED", order.getId()));
        ceeposController.updateOrderStateAndOrderNumber(order, CeeposOrderState.ERRORED, paymentConfirmation.getReference());
        break;
      case PAYMENT_ALREADY_COMPLETED_CANNOT_DELETE:
        // We definitely shouldn't get this but if a payment is complete, let's not touch our payment object at all
        break;
      default:
        break;
      }
      return Response.ok().build(); // TODO Are all of these technically our problem?
    }
    
    // By now the payment was successful, so mark the order as PAID

    order = ceeposController.updateOrderStateAndOrderNumber(order, CeeposOrderState.PAID, paymentConfirmation.getReference());
    
    // Fulfill the order
    
    if (order.getProduct().getType() == CeeposProductType.STUDYTIME) {
      int months = 0;
      String productCode = order.getProduct().getCode();
      if (StringUtils.equals(productCode, getProductCodeForMonths(6))) {
        months = 6;
      }
      else if (StringUtils.equals(productCode,  getProductCodeForMonths(12))) {
        months = 12;
      }
      else {
        logger.severe(String.format("Order %d product code %s does not match configured monthly codes", order.getId(), productCode));
        ceeposController.updateOrderStateAndOrderNumber(order, CeeposOrderState.ERRORED, paymentConfirmation.getReference());
        return Response.ok().build(); // Horrible configuration problem in our end
      }

      // Increase study time end

      Date oldStudyTimeEnd = null;
      Date newStudyTimeEnd = null;
      schoolDataBridgeSessionController.startSystemSession();
      try {
        String dataSource = "PYRAMUS";
        User user = userSchoolDataController.findUser(dataSource, order.getUserIdentifier());
        if (user == null) {
          logger.severe(String.format("User %s not found", order.getUserIdentifier()));
          return Response.ok().build(); // Our problem as well
        }
        oldStudyTimeEnd = user.getStudyTimeEnd() == null ? null : Date.from(user.getStudyTimeEnd().toInstant());
        user = userSchoolDataController.increaseStudyTime(dataSource, order.getUserIdentifier(), months);
        newStudyTimeEnd = user.getStudyTimeEnd() == null ? null : Date.from(user.getStudyTimeEnd().toInstant());
        logger.info(String.format("User %s study time raised from %tF to %tF",  order.getUserIdentifier(), oldStudyTimeEnd, newStudyTimeEnd));
      }
      finally {
        schoolDataBridgeSessionController.endSystemSession();
      }

      // TODO Mail to user and guider

      // Mark the payment as complete

      ceeposController.updateStudyTimeOrderStateAndStudyDates(
          (CeeposStudyTimeOrder) order,
          CeeposOrderState.COMPLETE,
          oldStudyTimeEnd,
          newStudyTimeEnd);
    }
    
    return Response.ok().build();
  }
  
  /**
   * Calculates the checksum for the given payment object (Ceepos API documentation chapter 3.2.3)
   *  
   * @param ceeposPayment Payment object
   * 
   * @return Checksum based on the values of the given payment object
   */
  private String calculateHash(CeeposPaymentRestModel ceeposPayment) {
    
    // The values of the parameters have to be added in the order indicated under 3.2.1
    
    StringBuilder sb = new StringBuilder();
    sb.append(ceeposPayment.getApiVersion());
    sb.append("&");
    sb.append(ceeposPayment.getSource());
    sb.append("&");
    sb.append(ceeposPayment.getId());
    sb.append("&");
    sb.append(ceeposPayment.getMode());
    sb.append("&");
    sb.append(ceeposPayment.getAction());
    sb.append("&");
    sb.append(StringUtils.defaultIfEmpty(ceeposPayment.getDescription(), ""));
    sb.append("&");
    for (CeeposProductRestModel ceeposProduct : ceeposPayment.getProducts()) {
      sb.append(ceeposProduct.getCode());
      sb.append("&");
      sb.append(ceeposProduct.getPrice() == null || ceeposProduct.getPrice() <= 0 ? "" : ceeposProduct.getPrice());
      sb.append("&");
      sb.append(StringUtils.defaultIfEmpty(ceeposProduct.getDescription(), ""));
      sb.append("&");
    }
    sb.append(ceeposPayment.getEmail());
    sb.append("&");
    sb.append(ceeposPayment.getFirstName());
    sb.append("&");
    sb.append(ceeposPayment.getLastName());
    sb.append("&");
    sb.append(ceeposPayment.getLanguage());
    sb.append("&");
    sb.append(ceeposPayment.getReturnAddress());
    sb.append("&");
    sb.append(ceeposPayment.getNotificationAddress());
    sb.append("&");
    sb.append(getSetting("key"));
    
    return Hashing.sha256().hashString(sb.toString(), StandardCharsets.UTF_8).toString();
  }
  
  /**
   * Validates the hash of the given payment confirmation (Ceepos API documentation chapter 3.3)
   * 
   * @param paymentConfirmation Payment confirmation object
   * 
   * @return Whether the object checksum is valid or not
   */
  private boolean validateHash(CeeposPaymentConfirmationRestModel paymentConfirmation) {
    if (StringUtils.isEmpty(paymentConfirmation.getHash())) {
      // Hash may not be empty if status is 1 (Payment successful/action complete)
      return paymentConfirmation.getStatus() != 1;
    }
    StringBuilder sb = new StringBuilder();
    sb.append(paymentConfirmation.getId());
    sb.append("&");
    sb.append(paymentConfirmation.getStatus());
    sb.append("&");
    sb.append(paymentConfirmation.getReference());
    sb.append("&");
    sb.append(getSetting("key"));
    String expectedHash = Hashing.sha256().hashString(sb.toString(), StandardCharsets.UTF_8).toString();
    return StringUtils.equals(expectedHash, paymentConfirmation.getHash());
  }
  
  /**
   * Validates the hash of the given payment response (Ceepos API documentation chapter 3.2.4)
   * 
   * @param paymentConfirmation Payment response object
   * 
   * @return Whether the object checksum is valid or not
   */
  private boolean validateHash(CeeposPaymentResponseRestModel paymentResponse) {
    if (StringUtils.isEmpty(paymentResponse.getHash())) {
      // Hash may not be empty if status is 2 (Processing of payment in progress)
      return paymentResponse.getStatus() != 2; 
    }
    StringBuilder sb = new StringBuilder();
    sb.append(paymentResponse.getId());
    sb.append("&");
    sb.append(paymentResponse.getStatus());
    sb.append("&");
    sb.append(paymentResponse.getReference());
    sb.append("&");
    sb.append(paymentResponse.getAction());
    sb.append("&");
    sb.append(paymentResponse.getPaymentAddress());
    sb.append("&");
    sb.append(getSetting("key"));
    String expectedHash = Hashing.sha256().hashString(sb.toString(), StandardCharsets.UTF_8).toString();
    return StringUtils.equals(expectedHash, paymentResponse.getHash());
  }
  
  private String getLocalizedDescription(CeeposProduct product) {
    String desc = localeController.getText(sessionController.getLocale(), String.format("ceepos.productDescription.%s", product.getCode()));
    return StringUtils.isEmpty(desc) ? product.getDescription() : desc;
  }

  private String getProductCodeForMonths(int months) {
    return pluginSettingsController.getPluginSetting("ceepos", String.format("%dMonthCode", months));
  }
  
  private String getSetting(String setting) {
    return pluginSettingsController.getPluginSetting("ceepos", setting);
  }

  private OffsetDateTime toOffsetDateTime(Date date) {
    Instant instant = date.toInstant();
    ZoneId systemId = ZoneId.systemDefault();
    ZoneOffset offset = systemId.getRules().getOffset(instant);
    return date.toInstant().atOffset(offset);
  }

}
