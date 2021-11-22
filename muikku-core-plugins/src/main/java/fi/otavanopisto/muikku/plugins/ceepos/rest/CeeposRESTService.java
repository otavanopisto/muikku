package fi.otavanopisto.muikku.plugins.ceepos.rest;

import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Timer;
import java.util.TimerTask;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.DELETE;
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
import fi.otavanopisto.muikku.mail.MailType;
import fi.otavanopisto.muikku.mail.Mailer;
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
  
  private static final String API_VERSION = "2.1.2";
  
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
  private HttpServletRequest httpRequest;

  @Inject
  private Mailer mailer;

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
  
  @Path("/payViewUrl")
  @GET
  @RESTPermit(handling = Handling.INLINE)
  public Response payViewUrl(@QueryParam("order") Long order) {
    CeeposOrder ceeposOrder = ceeposController.findOrderById(order);
    // Debug endpoint for development purposes
    StringBuilder sb = new StringBuilder();
    sb.append(ceeposOrder.getId());
    sb.append("&");
    sb.append(ceeposOrder.getUserIdentifier());
    sb.append("&");
    sb.append(getSetting("key"));
    String hash = Hashing.sha256().hashString(sb.toString(), StandardCharsets.UTF_8).toString();
    sb.setLength(0);
    sb.append(httpRequest.getScheme());
    sb.append("://");
    sb.append(httpRequest.getServerName());
    sb.append("/ceepos/pay?");
    sb.append(String.format("order=%d&hash=%s", order, hash));
    return Response.ok(sb.toString()).build();
  }

  @Path("/doneViewUrl")
  @GET
  @RESTPermit(handling = Handling.INLINE)
  public Response doneViewUrl(@QueryParam("order") Long order, @QueryParam("status") Integer status) {
    // Debug endpoint for development purposes
    StringBuilder sb = new StringBuilder();
    sb.append(order);
    sb.append("&");
    sb.append(status);
    sb.append("&");
    sb.append("123456"); // Reference
    sb.append("&");
    sb.append(getSetting("key"));
    String hash = Hashing.sha256().hashString(sb.toString(), StandardCharsets.UTF_8).toString();
    sb.setLength(0);
    sb.append(httpRequest.getScheme());
    sb.append("://");
    sb.append(httpRequest.getServerName());
    sb.append("/ceepos/done?");
    sb.append(String.format("Id=%s&Status=%d&Reference=123456&Hash=%s", order, status, hash));
    return Response.ok(sb.toString()).build();
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
    
    SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(paymentRequest.getStudentIdentifier());
    UserEntity studentUserEntity = userEntityController.findUserEntityByUserIdentifier(studentIdentifier);
    if (studentUserEntity == null) {
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
      studentEmail = userController.getUserDefaultEmailAddress(studentIdentifier);
    }
    finally {
      schoolDataBridgeSessionController.endSystemSession();
    }
    
    // Create order and complement the payload object accordingly
    
    CeeposOrder order = null;
    if (product.getType() == CeeposProductType.STUDYTIME) {
      order = ceeposController.createStudyTimeOrder(paymentRequest.getStudentIdentifier(),
          product,
          studentEmail,
          sessionController.getLoggedUserEntity().getId());
    }
    else {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Unknown product type").build();
    }
    paymentRequest.setCreated(toOffsetDateTime(order.getCreated()));
    paymentRequest.setId(order.getId());
    paymentRequest.getProduct().setCode(order.getProductCode());
    paymentRequest.getProduct().setDescription(order.getProductDescription());
    paymentRequest.getProduct().setPrice(order.getProductPrice());
    paymentRequest.setState(order.getState());
    
    // Email student and guidance counselor about the order

    String hash = Hashing.sha256().hashString(
        String.format("%d&%s&%s",
            order.getId(),
            order.getUserIdentifier(),
            getSetting("key")), StandardCharsets.UTF_8).toString();
    StringBuffer paymentUrl = new StringBuffer();
    paymentUrl.append(httpRequest.getScheme());
    paymentUrl.append("://");
    paymentUrl.append(httpRequest.getServerName());
    paymentUrl.append("/ceepos/pay?order=");
    paymentUrl.append(order.getId());
    paymentUrl.append("&hash=");
    paymentUrl.append(hash);

    UserEntityName userEntityName = userEntityController.getName(studentUserEntity);
    String mailSubject = localeController.getText(sessionController.getLocale(), "ceepos.mail.orderCreated.subject", new String[] {
        order.getId().toString()
    });
    String mailContent = localeController.getText(sessionController.getLocale(), "ceepos.mail.orderCreated.content", new String[] {
        userEntityName.getDisplayNameWithLine(),
        order.getProductDescription(),
        String.format("%.2f", (double) order.getProductPrice() / 100),
        paymentUrl.toString(),
        staffEmail
    });
    mailer.sendMail(MailType.HTML,
        Arrays.asList(studentEmail),
        Arrays.asList(staffEmail),
        Collections.emptyList(),
        mailSubject,
        mailContent);
    
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
        logger.severe(String.format("Ceepos order %d: User %s access revoked", order.getId(), sessionController.getLoggedUser().toId()));
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    
    // Return object

    CeeposOrderRestModel restOrder = new CeeposOrderRestModel();
    restOrder.setCreated(toOffsetDateTime(order.getCreated()));
    restOrder.setId(order.getId());
    restOrder.setProduct(new CeeposProductRestModel(
        order.getProductCode(),
        1,
        order.getProductPrice(),
        order.getProductDescription()));
    restOrder.setState(order.getState());
    restOrder.setStudentIdentifier(order.getUserIdentifier());
    
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
    
    List<CeeposOrderRestModel> restOrders = new ArrayList<>();
    List<CeeposOrder> orders = ceeposController.listOrdersByUserIdentifier(userIdentifier);
    for (CeeposOrder order : orders) {
      CeeposOrderRestModel restOrder = new CeeposOrderRestModel();
      restOrder.setCreated(toOffsetDateTime(order.getCreated()));
      restOrder.setId(order.getId());
      restOrder.setProduct(new CeeposProductRestModel(
          order.getProductCode(),
          1,
          order.getProductPrice(),
          order.getProductDescription()));
      restOrder.setState(order.getState());
      restOrder.setStudentIdentifier(order.getUserIdentifier());
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
          getLocalizedDescription(product.getCode(), product.getDescription())));
    }
    return Response.ok(restProducts).build();
  }
  
  /**
   * REQUEST:
   * 
   * mApi().ceepos.pay.create({
   *   'id': '123' // order id
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
    
    // Find the order
    
    CeeposOrder order = ceeposController.findOrderByIdAndArchived(payload.getId(), false);
    if (order == null) {
      logger.warning(String.format("Ceepos order %d: Not found", payload.getId()));
      return Response.status(Status.NOT_FOUND).build();
    }
    
    // Ensure order ownership

    if (!sessionController.hasEnvironmentPermission(CeeposPermissions.PAY_ORDER)) {
      SchoolDataIdentifier sdi = SchoolDataIdentifier.fromId(order.getUserIdentifier());
      UserEntity userEntity = userEntityController.findUserEntityByUserIdentifier(sdi);
      if (userEntity == null || !userEntity.getId().equals(sessionController.getLoggedUserEntity().getId())) {
        logger.severe(String.format("Ceepos order %d: User %s access revoked", order.getId(), sessionController.getLoggedUser().toId()));
        return Response.status(Status.FORBIDDEN).build();
      }
    }
    
    // Ensure order hasn't been handled yet
    
    if (order.getState() != CeeposOrderState.CREATED && order.getState() != CeeposOrderState.ONGOING) {
      logger.warning(String.format("Ceepos order %d: Unable to pay as state is already %s", payload.getId(), order.getState()));
      switch (order.getState()) {
      case CANCELLED:
        return Response.status(Status.BAD_REQUEST).entity(localeController.getText(sessionController.getLocale(), "ceepos.error.cancelled")).build();
      case COMPLETE:
      case PAID:
        return Response.status(Status.BAD_REQUEST).entity(localeController.getText(sessionController.getLocale(), "ceepos.error.paid")).build();
      default:
        return Response.status(Status.BAD_REQUEST).entity(localeController.getText(
            sessionController.getLocale(),
            "ceepos.error.errored",
            new String[] {"999"})).build(); // just a random error code; endpoint should only be called for CREATED/ONGOING orders 
      }
    }
    
    // Resolve name and email
    
    UserEntity userEntity = sessionController.getLoggedUserEntity();
    UserEntityName userEntityName = userEntityController.getName(userEntity);
    String email = "";
    schoolDataBridgeSessionController.startSystemSession();
    try {
      email = userController.getUserDefaultEmailAddress(sessionController.getLoggedUser());
    }
    finally {
      schoolDataBridgeSessionController.endSystemSession();
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
        order.getProductCode(),
        1,
        order.getProductPrice(),
        "")); // getLocalizedDescription(order.getProductCode(), order.getProductDescription()) if store supports English
    ceeposPayload.setProducts(products);
    ceeposPayload.setEmail(email);
    ceeposPayload.setFirstName(userEntityName.getFirstName());
    ceeposPayload.setLastName(userEntityName.getLastName());
    ceeposPayload.setLanguage(""); // sessionController.getLocale().getLanguage() if store supports English
    ceeposPayload.setReturnAddress(getSetting("returnAddress"));
    ceeposPayload.setNotificationAddress(getSetting("notificationAddress"));
    ceeposPayload.setHash(calculateHash(ceeposPayload));
    
    try {
      String json = new ObjectMapper().writeValueAsString(ceeposPayload);
      logger.info(String.format("Ceepos order %d: Payment request %s", order.getId(), json));
    }
    catch (JsonProcessingException e) {
      logger.log(Level.SEVERE, String.format("Ceepos order %d: Unable to deserialize Ceepos payment request", order.getId()), e);
    }
    
    // Call Ceepos
    
    Client client = ClientBuilder.newClient();
    WebTarget target = client.target(getSetting("server"));
    Builder request = target.request().header("Content-Type", MediaType.APPLICATION_JSON);
    Entity<CeeposPaymentRestModel> entity = Entity.entity(ceeposPayload, MediaType.APPLICATION_JSON);
    Response response = request.post(entity);
    
    // Ensure the call went through (200 OK)
    
    if (response.getStatus() != 200) {
      ceeposController.updateOrderState(order, CeeposOrderState.ERRORED, sessionController.getLoggedUserEntity().getId());
      logger.severe(String.format("Ceepos order %d: Invalid payment request response: %d %s", order.getId(), response.getStatus(), response.toString()));
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity(String.format("Payment response status failure: %d", response.getStatus())).build();
    }
    
    // Deserialize the response json
    
    CeeposPaymentResponseRestModel ceeposPayloadResponse = null;
    try {
      ceeposPayloadResponse = response.readEntity(CeeposPaymentResponseRestModel.class);
      String json = new ObjectMapper().writeValueAsString(ceeposPayloadResponse);
      logger.info(String.format("Ceepos order %d: Payment request response %s", order.getId(), json));
    }
    catch (Exception e) {
      logger.log(Level.SEVERE, String.format("Ceepos order %d: Unable to deserialize Ceepos payment response", order.getId()), e);
    }
    
    // Ensure we got a proper response with status being PAYMENT_PROCESSING as expected
    
    if (ceeposPayloadResponse == null) {
      ceeposController.updateOrderState(order, CeeposOrderState.ERRORED, sessionController.getLoggedUserEntity().getId());
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Payment response deserialization failure").build();
    }
    else if (ceeposPayloadResponse.getStatus() != PAYMENT_PROCESSING) {
      logger.severe(String.format("Ceepos order %d: Unexpected payment response status %d", order.getId(), ceeposPayloadResponse.getStatus()));
      ceeposController.updateOrderState(order, CeeposOrderState.ERRORED, sessionController.getLoggedUserEntity().getId());
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity(localeController.getText(
          sessionController.getLocale(),
          "ceepos.error.errored",
          new String[] {ceeposPayloadResponse.getStatus() + ""})).build();
    }
    
    // Validate response hash
    
    boolean validHash = validateHash(ceeposPayloadResponse);
    if (!validHash) {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Payment response hash failure").build();
    }
    
    // Update order payment address and set its state to ONGOING
    
    order = ceeposController.updateOrderStateAndOrderNumberAndPaymentAddress(
        order,
        CeeposOrderState.ONGOING,
        ceeposPayloadResponse.getReference(),
        ceeposPayloadResponse.getPaymentAddress(),
        sessionController.getLoggedUserEntity().getId());
    
    // Return the address to which the user should be redirected to finish the payment
    // TODO Could be returned as plain text but due to an mApi bug, has to be returned
    // as json, hence the quotes
    
    return Response.ok(String.format("\"%s\"", order.getCeeposPaymentAddress())).build();
  }
  
  /**
   * REQUEST:
   * 
   * mApi().ceepos.manualCompletion.create({
   *   'id': '123' // order id
   * });
   * 
   * RESPONSE:
   * 
   * 200, no object
   * 
   * DESCRIPTION:
   * 
   * Forces the completion of an order in progress. The order may NOT be in state
   * COMPLETE. Forced order completion is only available for admins or the staff
   * member who originally created the order.
   * 
   * @param payload Payload object  
   * 
   * @return 200, no objcect
   */
  @Path("/manualCompletion")
  @POST
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response completeOrder(CeeposOrderRestModel payload) {

    // Validate payload
    
    if (payload.getId() == null) {
      return Response.status(Status.BAD_REQUEST).entity("Missing id").build();
    }
    
    // Find the order
    
    CeeposOrder order = ceeposController.findOrderByIdAndArchived(payload.getId(), false);
    if (order == null) {
      logger.warning(String.format("Ceepos order %d: Not found", payload.getId()));
      return Response.status(Status.NOT_FOUND).build();
    }
    
    // Ensure order ownership

    if (!sessionController.hasEnvironmentPermission(CeeposPermissions.COMPLETE_ORDER)) {
      if (!order.getCreatorId().equals(sessionController.getLoggedUserEntity().getId())) {
        logger.severe(String.format("Ceepos order %d: User %s access revoked", order.getId(), sessionController.getLoggedUser().toId()));
        return Response.status(Status.FORBIDDEN).build();
        
      }
    }
    
    // Ensure order sate
    
    if (order.getState() == CeeposOrderState.COMPLETE) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid order state").build();
    }

    // Manual completion

    logger.warning(String.format("Ceepos order %d: User %s triggered manual completion", order.getId(), sessionController.getLoggedUser().toId()));
    
    String reference = StringUtils.defaultIfEmpty(order.getCeeposOrderNumber(), "MANUAL");
    
    StringBuffer sb = new StringBuffer();
    sb.append(order.getId().toString());
    sb.append("&");
    sb.append(PAYMENT_SUCCESSFUL);
    sb.append("&");
    sb.append(reference);
    sb.append("&");
    sb.append(getSetting("key"));
    String hash = Hashing.sha256().hashString(sb.toString(), StandardCharsets.UTF_8).toString();
    
    CeeposPaymentConfirmationRestModel paymentConfirmation = new CeeposPaymentConfirmationRestModel();
    paymentConfirmation.setId(order.getId().toString());
    paymentConfirmation.setStatus(PAYMENT_SUCCESSFUL);
    paymentConfirmation.setReference(reference);
    paymentConfirmation.setHash(hash);
    return handlePaymentConfirmation(paymentConfirmation);
  }
  
  /**
   * REQUEST:
   * 
   * mApi().ceepos.order.del({
   *   'id': '123' // order id
   * });
   * 
   * RESPONSE:
   * 
   * 204 No content
   * 
   * DESCRIPTION:
   * 
   * Removes the given order. The order may NOT be in state PAID or COMPLETE.
   * Order removal is only available for admins or the staff member who originally
   * created the order.
   * 
   * @param payload Payload object  
   * 
   * @return 204 No content
   */
  @Path("/order")
  @DELETE
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response removeeOrder(CeeposOrderRestModel payload) {

    // Validate payload
    
    if (payload.getId() == null) {
      return Response.status(Status.BAD_REQUEST).entity("Missing id").build();
    }
    
    // Find the order
    
    CeeposOrder order = ceeposController.findOrderByIdAndArchived(payload.getId(), false);
    if (order == null) {
      logger.warning(String.format("Ceepos order %d: Not found", payload.getId()));
      return Response.status(Status.NOT_FOUND).build();
    }
    
    // Ensure order ownership

    if (!sessionController.hasEnvironmentPermission(CeeposPermissions.REMOVE_ORDER)) {
      if (!order.getCreatorId().equals(sessionController.getLoggedUserEntity().getId())) {
        logger.severe(String.format("Ceepos order %d: User %s access revoked", order.getId(), sessionController.getLoggedUser().toId()));
        return Response.status(Status.FORBIDDEN).build();
        
      }
    }
    
    // Ensure order sate
    
    if (order.getState() == CeeposOrderState.PAID || order.getState() == CeeposOrderState.COMPLETE) {
      return Response.status(Status.BAD_REQUEST).entity("Invalid order state").build();
    }
    
    // Archive the order
    
    ceeposController.archiveOrder(order, sessionController.getLoggedUserEntity().getId());
    
    return Response.noContent().build();
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
      logger.info(String.format("Ceepos order %s: Programmatic payment confirmation %s", paymentConfirmation.getId(), json));
    }
    catch (JsonProcessingException e) {
      logger.log(Level.SEVERE, String.format("Ceepos order %s: Unable to deserialize programmatic payment response", paymentConfirmation.getId()), e);
    }

    // Validate payload
    
    boolean validHash = validateHash(paymentConfirmation);
    if (!validHash) {
      logger.severe(String.format("Ceepos order %s: Payment confirmation hash check failure", paymentConfirmation.getId()));
      return Response.status(Status.BAD_REQUEST).entity("Invalid hash").build();
    }
    
    // Ensure our order exists (archived is semi-fine since this is a programmatic call)
    
    CeeposOrder order = ceeposController.findOrderById(new Long(paymentConfirmation.getId()));
    if (order == null) {
      logger.severe(String.format("Ceepos order %s: Not found", paymentConfirmation.getId()));
      return Response.status(Status.BAD_REQUEST).entity("Source system order not found").build();
    }
    if (order.getArchived()) {
      logger.warning(String.format("Ceepos order %d: Received programmatic payment confirmation for an archived order", order.getId()));
    }
    if (order.getState() != CeeposOrderState.ONGOING) {
      logger.warning(String.format("Ceepos order %d: Received programmatic payment confirmation with order in state %s", order.getId(), order.getState()));
    }
    
    // If the order has been marked as complete at our end, ignore the confirmation
    
    if (order.getState() == CeeposOrderState.COMPLETE) {
      logger.info(String.format("Ceepos order %d: Ignoring programmatic payment confirmation as it is already complete", order.getId()));
      return Response.ok().build();
    }
    
    // Handle various errors

    if (paymentConfirmation.getStatus() != PAYMENT_SUCCESSFUL) {
      logger.warning(String.format("Ceepos order %d: Unexpected payment confirmation status %d", order.getId(), paymentConfirmation.getStatus()));
      switch (paymentConfirmation.getStatus()) {
      case PAYMENT_FAILED_OR_CANCELLED:
      case PAYMENT_ALREADY_DELETED:
        if (order.getState() != CeeposOrderState.CANCELLED) {
          logger.warning(String.format("Ceepos order %d: Updating from %s to CANCELLED", order.getId(), order.getState()));
          ceeposController.updateOrderStateAndOrderNumber(order, CeeposOrderState.CANCELLED, paymentConfirmation.getReference(), order.getLastModifierId());
        }
        break;
      case DOUBLE_ID:
      case SYSTEM_ERROR:
      case FAULTY_PAYMENT_REQUEST:
        if (order.getState() != CeeposOrderState.ERRORED) {
          logger.warning(String.format("Ceepos order %d: Updating from %s to ERRORED", order.getId(), order.getState()));
          ceeposController.updateOrderStateAndOrderNumber(order, CeeposOrderState.ERRORED, paymentConfirmation.getReference(), order.getLastModifierId());
        }
        break;
      case PAYMENT_ALREADY_COMPLETED_CANNOT_DELETE:
        // We definitely shouldn't get this but if a payment is complete, let's not touch our payment object at all
        break;
      default:
        break;
      }
      return Response.ok().build();
    }
    
    // By now the payment was successful, so mark the order as PAID

    order = ceeposController.updateOrderStateAndOrderNumber(order, CeeposOrderState.PAID, paymentConfirmation.getReference(), order.getLastModifierId());
    
    // Fulfill the order
    
    CeeposProduct product = ceeposController.findProductById(order.getProductId());
    if (product != null && product.getType() == CeeposProductType.STUDYTIME) {
      int months = 0;
      String productCode = order.getProductCode();
      if (StringUtils.equals(productCode, getProductCodeForMonths(6))) {
        months = 6;
      }
      else if (StringUtils.equals(productCode,  getProductCodeForMonths(12))) {
        months = 12;
      }
      else {
        logger.severe(String.format("Ceepos order %d: Product code %s does not match configured monthly codes", order.getId(), productCode));
        ceeposController.updateOrderStateAndOrderNumber(order, CeeposOrderState.ERRORED, paymentConfirmation.getReference(), order.getLastModifierId());
        return Response.ok().build(); // Our configuration problem
      }

      // Increase study time end

      Date oldStudyTimeEnd = null;
      Date newStudyTimeEnd = null;
      schoolDataBridgeSessionController.startSystemSession();
      try {
        SchoolDataIdentifier sdi = SchoolDataIdentifier.fromId(order.getUserIdentifier());
        User user = userSchoolDataController.findUser(sdi);
        if (user == null) {
          logger.severe(String.format("User %s not found", order.getUserIdentifier()));
          return Response.ok().build(); // Our problem as well
        }
        oldStudyTimeEnd = user.getStudyTimeEnd() == null ? null : Date.from(user.getStudyTimeEnd().toInstant());
        user = userSchoolDataController.increaseStudyTime(sdi, months);
        newStudyTimeEnd = user.getStudyTimeEnd() == null ? null : Date.from(user.getStudyTimeEnd().toInstant());
        logger.info(String.format("Ceepos order %d: User %s study time raised from %tF to %tF",
            order.getId(),
            order.getUserIdentifier(),
            oldStudyTimeEnd,
            newStudyTimeEnd));
      }
      finally {
        schoolDataBridgeSessionController.endSystemSession();
      }

      // Mark the payment as complete

      ceeposController.updateStudyTimeOrderStateAndStudyDates(
          (CeeposStudyTimeOrder) order,
          CeeposOrderState.COMPLETE,
          oldStudyTimeEnd,
          newStudyTimeEnd,
          order.getLastModifierId());

      // Mail to user and guider
      
      String staffEmail = null;
      String studentEmail = null;
      SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(order.getUserIdentifier());
      UserEntity staffMember = userEntityController.findUserEntityById(order.getCreatorId());
      SchoolDataIdentifier staffIdentifier = new SchoolDataIdentifier(
          staffMember.getDefaultIdentifier(),
          staffMember.getDefaultSchoolDataSource().getIdentifier());
      schoolDataBridgeSessionController.startSystemSession();
      try {
        staffEmail = userController.getUserDefaultEmailAddress(staffIdentifier);
        studentEmail = userController.getUserDefaultEmailAddress(studentIdentifier);
      }
      finally {
        schoolDataBridgeSessionController.endSystemSession();
      }
      
      UserEntity userEntity = userEntityController.findUserEntityByUserIdentifier(studentIdentifier);
      UserEntityName userEntityName = userEntityController.getName(userEntity);
      Locale locale = new Locale(StringUtils.defaultIfEmpty(userEntity.getLocale(), "fi"));
      String mailSubject = localeController.getText(locale, "ceepos.mail.orderDelivered.subject", new String[] {
          paymentConfirmation.getId()
      });
      String mailContent = localeController.getText(locale, "ceepos.mail.orderDelivered.content", new String[] {
          userEntityName.getDisplayNameWithLine(),
          new SimpleDateFormat("d.M.yyyy").format(newStudyTimeEnd),
          staffEmail
      });
      
      mailer.sendMail(MailType.HTML,
          Arrays.asList(studentEmail),
          Arrays.asList(staffEmail),
          Collections.emptyList(),
          mailSubject,
          mailContent);
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
      sb.append(ceeposProduct.getAmount());
      sb.append("&");
      sb.append(ceeposProduct.getPrice() == null || ceeposProduct.getPrice() <= 0 ? "" : ceeposProduct.getPrice());
      sb.append("&");
      sb.append(StringUtils.defaultIfEmpty(ceeposProduct.getDescription(), ""));
      sb.append("&");
    }
    sb.append(StringUtils.defaultIfEmpty(ceeposPayment.getEmail(), ""));
    sb.append("&");
    sb.append(StringUtils.defaultIfEmpty(ceeposPayment.getFirstName(), ""));
    sb.append("&");
    sb.append(StringUtils.defaultIfEmpty(ceeposPayment.getLastName(), ""));
    sb.append("&");
    sb.append(StringUtils.defaultIfEmpty(ceeposPayment.getLanguage(), ""));
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
  
  private String getLocalizedDescription(String productCode, String defaultDescription) {
    String desc = localeController.getText(sessionController.getLocale(), String.format("ceepos.productDescription.%s", productCode));
    return StringUtils.isEmpty(desc) ? defaultDescription : desc;
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
