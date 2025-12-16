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
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
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
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceUserEntity;
import fi.otavanopisto.muikku.plugins.assessmentrequest.AssessmentRequestController;
import fi.otavanopisto.muikku.plugins.ceepos.CeeposController;
import fi.otavanopisto.muikku.plugins.ceepos.CeeposPermissions;
import fi.otavanopisto.muikku.plugins.ceepos.model.CeeposAssessmentRequestOrder;
import fi.otavanopisto.muikku.plugins.ceepos.model.CeeposOrder;
import fi.otavanopisto.muikku.plugins.ceepos.model.CeeposOrderState;
import fi.otavanopisto.muikku.plugins.ceepos.model.CeeposProduct;
import fi.otavanopisto.muikku.plugins.ceepos.model.CeeposProductType;
import fi.otavanopisto.muikku.plugins.ceepos.model.CeeposStudyTimeOrder;
import fi.otavanopisto.muikku.plugins.communicator.CommunicatorAssessmentRequestController;
import fi.otavanopisto.muikku.schooldata.SchoolDataBridgeSessionController;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.UserSchoolDataController;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.User;
import fi.otavanopisto.muikku.schooldata.entity.WorkspaceAssessmentRequest;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.session.SessionController;
import fi.otavanopisto.muikku.users.UserEmailEntityController;
import fi.otavanopisto.muikku.users.UserEntityController;
import fi.otavanopisto.muikku.users.UserEntityName;
import fi.otavanopisto.muikku.users.WorkspaceUserEntityController;
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
  private UserEmailEntityController userEmailEntityController;

  @Inject
  private UserEntityController userEntityController;
  
  @Inject
  private WorkspaceUserEntityController workspaceUserEntityController;
  
  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private AssessmentRequestController assessmentRequestController;

  @Inject
  private CommunicatorAssessmentRequestController communicatorAssessmentRequestController;

  @Inject
  private UserSchoolDataController userSchoolDataController;

  @Inject
  private PluginSettingsController pluginSettingsController;
  
  @Inject
  private CeeposController ceeposController;

  @Inject
  private SchoolDataBridgeSessionController schoolDataBridgeSessionController;

  @Inject
  @Any
  private Instance<SearchProvider> searchProviders;
  
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
   *   'state': 'CREATED',
   *   'paid': null, 
   *   'created': 2021-10-28T08:57:57+03:00,
   *   'creator': {
   *     'id': 'PYRAMUS-STAFF-123',
   *     'userEntityId': 456,
   *     'firstName': 'Guido',
   *     'lastName': 'Councelor',
   *     'email': 'guido.councelor@email.com'
   *   } 
   * }
   * 
   * DESCRIPTION:
   * 
   * Creates a new order for a student.
   * 
   * @param payload Payload object
   * 
   * @return Created order
   */
  @Path("/order")
  @POST
  @RESTPermit(CeeposPermissions.CREATE_ORDER)
  public Response createOrder(CeeposOrderRestModel payload) {
    
    // Validate payload
    
    SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(payload.getStudentIdentifier());
    UserEntity studentUserEntity = userEntityController.findUserEntityByUserIdentifier(studentIdentifier);
    if (studentUserEntity == null) {
      return Response.status(Status.BAD_REQUEST).entity(String.format("Invalid student %s", payload.getStudentIdentifier())).build();
    }
    CeeposProduct product = ceeposController.findProductByCode(payload.getProduct().getCode());
    if (product == null) {
      return Response.status(Status.BAD_REQUEST).entity(String.format("Invalid product %s", payload.getProduct().getCode())).build();
    }
    
    // Contact emails and student name for this order
    
    String staffEmail = userEmailEntityController.getUserDefaultEmailAddress(sessionController.getLoggedUser(), false);
    String studentEmail = userEmailEntityController.getUserDefaultEmailAddress(studentIdentifier, false);
    UserEntityName userEntityName = userEntityController.getName(studentUserEntity, false);
    if (staffEmail == null) {
      return Response.status(Status.BAD_REQUEST).entity(String.format("Missing staff email %s", sessionController.getLoggedUserIdentifier())).build();
    }
    if (studentEmail == null) {
      return Response.status(Status.BAD_REQUEST).entity(String.format("Missing student email %s", payload.getStudentIdentifier())).build();
    }
    if (userEntityName == null) {
      return Response.status(Status.BAD_REQUEST).entity(String.format("Unable to resolve student name %s", payload.getStudentIdentifier())).build();
    }
    
    // Create order and complement the payload object accordingly
    
    CeeposOrder order = null;
    if (product.getType() == CeeposProductType.STUDYTIME) {
      order = ceeposController.createStudyTimeOrder(payload.getStudentIdentifier(),
          product,
          studentEmail,
          sessionController.getLoggedUserEntity().getId());
    }
    else {
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Unknown product type").build();
    }
    payload = toRestModel(order);
    
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
    
    return Response.ok(payload).build();
  }
  
  /**
   * REQUEST:
   * 
   * mApi().ceepos.user.order.read('PYRAMUS-STUDENT-123', 123);
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
   *     'Price': 5000, // Product price in cents
   *     'Description': 'Product description to be shown in UI'
   *   }
   *   'state': 'CREATED' | 'ONGOING' | 'PAID' | 'CANCELLED' | 'ERRORED' | 'COMPLETE',
   *   'created': 2021-10-28T08:57:57+03:00,
   *   'creator': {
   *     'id': 'PYRAMUS-STAFF-123',
   *     'userEntityId': 456,
   *     'firstName': 'Guido',
   *     'lastName': 'Councelor',
   *     'email': 'guido.councelor@email.com'
   *   }  
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
    
    return Response.ok(toRestModel(order)).build();
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
   *   'state': 'CREATED' | 'ONGOING' | 'PAID' | 'CANCELLED' | 'ERRORED' | 'COMPLETE',
   *   'created': 2021-10-28T08:57:57+03:00,
   *   'creator': {
   *     'id': 'PYRAMUS-STAFF-123',
   *     'userEntityId': 456,
   *     'firstName': 'Guido',
   *     'lastName': 'Councelor',
   *     'email': 'guido.councelor@email.com'
   *   }
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
      restOrders.add(toRestModel(order));
    }
    
    return Response.ok(restOrders).build();
  }
  
  /**
   * REQUEST:
   * 
   * mApi().ceepos.products.read({line: 'nettilukio'});
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
  public Response listProducts(@QueryParam("line") String line) {
    List<CeeposProduct> products = ceeposController.listProducts(line);
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
   * mApi().ceepos.pay.create(123); // order id
   * 
   * RESPONSE:
   * 
   * https://www.somesite.com/gopay.html
   * 
   * DESCRIPTION:
   * 
   * Sends a payment request for an order to Ceepos.
   * 
   * @param orderId Order id  
   * 
   * @return The url to which the user should be redirected to complete payment.
   */
  @Path("/pay/{ORDERID}")
  @POST
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response sendPaymentRequest(@PathParam("ORDERID") Long orderId) {
    
    // Validate payload
    
    if (orderId == null) {
      return Response.status(Status.BAD_REQUEST).entity("Missing id").build();
    }
    
    // Find the order
    
    CeeposOrder order = ceeposController.findOrderByIdAndArchived(orderId, false);
    if (order == null) {
      logger.warning(String.format("Ceepos order %d: Not found", orderId));
      return Response.status(Status.NOT_FOUND).build();
    }
    
    // Ensure order ownership

    SchoolDataIdentifier sdi = SchoolDataIdentifier.fromId(order.getUserIdentifier());
    UserEntity orderUserEntity = userEntityController.findUserEntityByUserIdentifier(sdi);
    if (orderUserEntity == null || !orderUserEntity.getId().equals(sessionController.getLoggedUserEntity().getId())) {
      logger.severe(String.format("Ceepos order %d: User %s access revoked", order.getId(), sessionController.getLoggedUser().toId()));
      return Response.status(Status.FORBIDDEN).build();
    }
    
    // Ensure order hasn't been handled yet
    
    if (order.getState() != CeeposOrderState.CREATED && order.getState() != CeeposOrderState.ONGOING) {
      logger.warning(String.format("Ceepos order %d: Unable to pay as state is already %s", orderId, order.getState()));
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
    UserEntityName userEntityName = userEntityController.getName(userEntity, false);
    if (userEntityName == null) {
      return Response.status(Status.BAD_REQUEST).entity(String.format("Unable to resolve user name %s", sessionController.getLoggedUserIdentifier())).build();
    }
    String email = userEmailEntityController.getUserDefaultEmailAddress(sessionController.getLoggedUser(), false);
    if (email == null) {
      return Response.status(Status.BAD_REQUEST).entity(String.format("Unable to resolve student email %s", sessionController.getLoggedUserIdentifier())).build();
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
        StringUtils.isBlank(order.getProductDescription()) ? "" : order.getProductDescription()));
    ceeposPayload.setProducts(products);
    ceeposPayload.setEmail(email);
    ceeposPayload.setFirstName(userEntityName.getFirstName());
    ceeposPayload.setLastName(userEntityName.getLastName());
    ceeposPayload.setLanguage("");
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
      ceeposController.updateOrderState(order, CeeposOrderState.ERRORED, sessionController.getLoggedUserEntity().getId());
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Payment response hash failure").build();
    }
    
    // Status is PAYMENT_PROCESSING, so we really should have a redirect link to the webstore at this point 
    
    if (StringUtils.isEmpty(ceeposPayloadResponse.getPaymentAddress())) {
      ceeposController.updateOrderState(order, CeeposOrderState.ERRORED, sessionController.getLoggedUserEntity().getId());
      return Response.status(Status.INTERNAL_SERVER_ERROR).entity("Missing payment link").build();
    }
    
    // Update order payment address and set its state to ONGOING
    
    order = ceeposController.updateOrderStateAndOrderNumberAndPaid(
        order,
        CeeposOrderState.ONGOING,
        ceeposPayloadResponse.getReference(),
        order.getPaid(),
        sessionController.getLoggedUserEntity().getId());
    
    // Return the address to which the user should be redirected to finish the payment
    // TODO Could be returned as plain text but due to an mApi bug, has to be returned
    // as json, hence the quotes
    
    return Response.ok(String.format("\"%s\"", ceeposPayloadResponse.getPaymentAddress())).build();
  }
  
  // Just a convenience endpoint to make it easier to complete orders via browser
  
  @Path("/manualCompletion/{ORDERID}")
  @GET
  @RESTPermit(CeeposPermissions.COMPLETE_ORDER)
  public Response completeOrderGet(@PathParam("ORDERID") Long orderId) {
    return completeOrder(orderId);
  }
  
  /**
   * REQUEST:
   * 
   * mApi().ceepos.manualCompletion.create(123); // order id
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
   *   'state': 'COMPLETE',
   *   'paid': 2021-10-28T08:57:57+03:00,
   *   'created': 2021-10-28T08:57:57+03:00,
   *   'creator': {
   *     'id': 'PYRAMUS-STAFF-123',
   *     'userEntityId': 456,
   *     'firstName': 'Guido',
   *     'lastName': 'Councelor',
   *     'email': 'guido.councelor@email.com'
   *   }
   * }
   * 
   * DESCRIPTION:
   * 
   * Forces the completion of an order in progress. The order may NOT be in state
   * COMPLETE. Forced order completion is only available for admins.
   * 
   * @param orderId Order id  
   * 
   * @return 200, no objcect
   */
  @Path("/manualCompletion/{ORDERID}")
  @POST
  @RESTPermit(CeeposPermissions.COMPLETE_ORDER)
  public Response completeOrder(@PathParam("ORDERID") Long orderId) {

    // Validate payload
    
    if (orderId == null) {
      return Response.status(Status.BAD_REQUEST).entity("Missing id").build();
    }
    
    // Find the order
    
    CeeposOrder order = ceeposController.findOrderByIdAndArchived(orderId, false);
    if (order == null) {
      logger.warning(String.format("Ceepos order %d: Not found", orderId));
      return Response.status(Status.NOT_FOUND).build();
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
    
    Response response = handlePaymentConfirmation(paymentConfirmation);
    if (response.getStatusInfo() == Status.OK) {
      order = ceeposController.findOrderById(orderId);
      return Response.ok(toRestModel(order)).build();
    }
    else {
      return response; // Confirmation failed, return original response
    }
  }
  
  /**
   * REQUEST:
   * 
   * mApi().ceepos.order.del(123); // order id
   * 
   * RESPONSE:
   * 
   * 204 No content
   * 
   * DESCRIPTION:
   * 
   * Removes the given order. The order may NOT be in state PAID, or COMPLETE.
   * Order removal is only available for admins or the staff member who originally
   * created the order.
   * 
   * @param orderId Order id  
   * 
   * @return 204 No content
   */
  @Path("/order/{ORDERID}")
  @DELETE
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response removeOrder(@PathParam("ORDERID") Long orderId) {

    // Validate payload
    
    if (orderId == null) {
      return Response.status(Status.BAD_REQUEST).entity("Missing id").build();
    }
    
    // Find the order
    
    CeeposOrder order = ceeposController.findOrderByIdAndArchived(orderId, false);
    if (order == null) {
      logger.warning(String.format("Ceepos order %d: Not found", orderId));
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
  
  @Path("/order/{ORDERID}/returnLink")
  @GET
  @RESTPermit(handling = Handling.INLINE, requireLoggedIn = true)
  public Response getReturnLink(@PathParam("ORDERID") Long orderId) {

    // Validate payload
    
    if (orderId == null) {
      return Response.status(Status.BAD_REQUEST).entity("Missing id").build();
    }
    
    // Find the order
    
    CeeposOrder order = ceeposController.findOrderByIdAndArchived(orderId, false);
    if (order == null) {
      logger.warning(String.format("Ceepos order %d: Not found", orderId));
      return Response.status(Status.NOT_FOUND).build();
    }
    
    // Verify order ownership
    
    if (!StringUtils.equals(order.getUserIdentifier(), sessionController.getLoggedUser().toId())) {
      logger.severe(String.format("Ceepos order %d illegal user access %s", orderId, sessionController.getLoggedUser().toId()));
      return Response.status(Status.FORBIDDEN).build();
    }
    
    // Figure out the product
    
    CeeposProduct product = ceeposController.findProductById(order.getProductId());
    if (product == null) {
      logger.warning(String.format("Ceepos product %d: Not found", order.getProductId()));
      return Response.status(Status.NOT_FOUND).build();
    }
    
    // Return data
    
    String path;
    String text;
    if (product.getType() == CeeposProductType.ASSESSMENTREQUEST || product.getType() == CeeposProductType.ASSESSMENTREQUEST_FUNDED) {
      CeeposAssessmentRequestOrder assessmentRequestOrder = ceeposController.findAssessmentRequestOrderById(orderId);
      if (assessmentRequestOrder == null) {
        logger.warning(String.format("Ceepos assessment request order %d: Not found", orderId));
        return Response.status(Status.NOT_FOUND).build();
      }
      Long workspaceEntityId = assessmentRequestOrder.getWorkspaceEntityId();
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
      if (workspaceEntity == null) {
        logger.warning(String.format("Workspace entity %d: Not found", workspaceEntityId));
        return Response.status(Status.NOT_FOUND).build();
      }
      path = String.format("/workspace/%s", workspaceEntity.getUrlName());
      text = localeController.getText(sessionController.getLocale(), "ceepos.returnLink.workspace");
    }
    else {
      path = "/";
      text = localeController.getText(sessionController.getLocale(), "ceepos.returnLink.frontPage");
    }
    return Response.ok(new CeeposReturnLinkRestModel(path, text)).build();
  }
  
  @Path("/paymentConfirmation")
  @POST
  @RESTPermit(handling = Handling.INLINE)
  public Response paymentConfirmation(CeeposPaymentConfirmationRestModel paymentConfirmation) {
    return handlePaymentConfirmation(paymentConfirmation);
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
    
    CeeposOrder order = ceeposController.findOrderById(Long.valueOf(paymentConfirmation.getId()));
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
          ceeposController.updateOrderStateAndOrderNumberAndPaid(
              order,
              CeeposOrderState.CANCELLED,
              paymentConfirmation.getReference(),
              order.getPaid(),
              order.getLastModifierId());
        }
        break;
      case DOUBLE_ID:
      case SYSTEM_ERROR:
      case FAULTY_PAYMENT_REQUEST:
        if (order.getState() != CeeposOrderState.ERRORED) {
          logger.warning(String.format("Ceepos order %d: Updating from %s to ERRORED", order.getId(), order.getState()));
          ceeposController.updateOrderStateAndOrderNumberAndPaid(
              order,
              CeeposOrderState.ERRORED,
              paymentConfirmation.getReference(),
              order.getPaid(),
              order.getLastModifierId());
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

    order = ceeposController.updateOrderStateAndOrderNumberAndPaid(
        order,
        CeeposOrderState.PAID,
        paymentConfirmation.getReference(),
        new Date(),
        order.getLastModifierId());
    
    // Fulfill the order
    
    CeeposProduct product = ceeposController.findProductById(order.getProductId());
    if (product == null) {
      logger.severe(String.format("Product %d not found", order.getProductId()));
      order = ceeposController.updateOrderStateAndOrderNumberAndPaid(
          order,
          CeeposOrderState.ERRORED,
          paymentConfirmation.getReference(),
          order.getPaid(),
          order.getLastModifierId());
      return Response.ok().build(); // Our configuration problem
    }
    switch (product.getType()) {
    
    case STUDYTIME:
      int months = 0;
      String productCode = order.getProductCode();
      Set<String> codes = getProductCodesForMonths(6);
      if (codes.contains(productCode)) {
        months = 6;
      }
      else {
        codes = getProductCodesForMonths(12);
        if (codes.contains(productCode)) {
          months = 12;
        }
      }
      if (months == 0) {
        logger.severe(String.format("Ceepos order %d: Product code %s does not match configured monthly codes", order.getId(), productCode));
        order = ceeposController.updateOrderStateAndOrderNumberAndPaid(
            order,
            CeeposOrderState.ERRORED,
            paymentConfirmation.getReference(),
            order.getPaid(),
            order.getLastModifierId());
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

      // Mark the order as complete

      ceeposController.updateStudyTimeOrderStateAndStudyDates(
          (CeeposStudyTimeOrder) order,
          CeeposOrderState.COMPLETE,
          oldStudyTimeEnd,
          newStudyTimeEnd,
          order.getLastModifierId());

      // Mail to user and guider
      
      SchoolDataIdentifier studentIdentifier = SchoolDataIdentifier.fromId(order.getUserIdentifier());
      UserEntity staffMember = userEntityController.findUserEntityById(order.getCreatorId());
      SchoolDataIdentifier staffIdentifier = new SchoolDataIdentifier(
          staffMember.getDefaultIdentifier(),
          staffMember.getDefaultSchoolDataSource().getIdentifier());
      String staffEmail = userEmailEntityController.getUserDefaultEmailAddress(staffIdentifier, false); 
      String studentEmail = userEmailEntityController.getUserDefaultEmailAddress(studentIdentifier, false);
      
      UserEntity userEntity = userEntityController.findUserEntityByUserIdentifier(studentIdentifier);
      UserEntityName userEntityName = userEntityController.getName(userEntity, false);
      if (userEntityName == null) {
        // Programmatic confirmation; we'd really like a name here but settle with email if there's a problem 
        userEntityName = new UserEntityName(studentEmail, null, null, null);
      }
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
      break;
    
    case ASSESSMENTREQUEST:
    case ASSESSMENTREQUEST_FUNDED:
      CeeposAssessmentRequestOrder assessmentRequestOrder = ceeposController.findAssessmentRequestOrderById(order.getId());
      if (assessmentRequestOrder == null) {
        logger.severe(String.format("Assessment request order %d not found", order.getId()));
        order = ceeposController.updateOrderStateAndOrderNumberAndPaid(
            order,
            CeeposOrderState.ERRORED,
            paymentConfirmation.getReference(),
            order.getPaid(),
            order.getLastModifierId());
        return Response.ok().build(); // Our configuration problem
      }
      WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(assessmentRequestOrder.getWorkspaceEntityId());
      if (workspaceEntity == null) {
        logger.severe(String.format("Workspace entity %d not found", assessmentRequestOrder.getWorkspaceEntityId()));
        order = ceeposController.updateOrderStateAndOrderNumberAndPaid(
            order,
            CeeposOrderState.ERRORED,
            paymentConfirmation.getReference(),
            order.getPaid(),
            order.getLastModifierId());
        return Response.ok().build(); // Our configuration problem
      }
      SchoolDataIdentifier identifier = SchoolDataIdentifier.fromId(order.getUserIdentifier());
      WorkspaceUserEntity workspaceUserEntity = workspaceUserEntityController.findActiveWorkspaceUserByWorkspaceEntityAndUserIdentifier(
          workspaceEntity, identifier);
      if (workspaceUserEntity == null) {
        logger.severe(String.format("Workspace user entity not found for user %s and workspace %d", order.getUserIdentifier(), workspaceEntity.getId()));
        order = ceeposController.updateOrderStateAndOrderNumberAndPaid(
            order,
            CeeposOrderState.ERRORED,
            paymentConfirmation.getReference(),
            order.getPaid(),
            order.getLastModifierId());
        return Response.ok().build(); // Our configuration problem
      }
      schoolDataBridgeSessionController.startSystemSession();
      try {
        
        // Create the assessment request
        
        WorkspaceAssessmentRequest workspaceAssessmentRequest = assessmentRequestController.createWorkspaceAssessmentRequest(
            workspaceUserEntity, assessmentRequestOrder.getRequestText());
        if (workspaceAssessmentRequest == null) {
          logger.severe("Workspace assessment request creation failed");
          order = ceeposController.updateOrderStateAndOrderNumberAndPaid(
              order,
              CeeposOrderState.ERRORED,
              paymentConfirmation.getReference(),
              order.getPaid(),
              order.getLastModifierId());
          return Response.ok().build(); // Our configuration problem
        }

        // Message teachers about the assessment request
        
        communicatorAssessmentRequestController.sendAssessmentRequestMessage(new Locale("fi"), workspaceAssessmentRequest);
      }
      finally {
        schoolDataBridgeSessionController.endSystemSession();
      }

      // Mark the order as complete

      order = ceeposController.updateOrderStateAndOrderNumberAndPaid(
          order,
          CeeposOrderState.COMPLETE,
          paymentConfirmation.getReference(),
          order.getPaid(),
          order.getLastModifierId());
      
      break;
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
    sb.append(StringUtils.defaultIfEmpty(paymentResponse.getPaymentAddress(), ""));
    sb.append("&");
    sb.append(getSetting("key"));
    String expectedHash = Hashing.sha256().hashString(sb.toString(), StandardCharsets.UTF_8).toString();
    return StringUtils.equals(expectedHash, paymentResponse.getHash());
  }
  
  private String getLocalizedDescription(String productCode, String defaultDescription) {
    String desc = localeController.getText(sessionController.getLocale(), String.format("ceepos.productDescription.%s", productCode));
    return StringUtils.isEmpty(desc) ? defaultDescription : desc;
  }

  private Set<String> getProductCodesForMonths(int months) {
    return Arrays.stream(pluginSettingsController.getPluginSetting("ceepos", String.format("%dMonthCode", months)).split(",")).collect(Collectors.toSet());
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
  
  private CeeposOrderRestModel toRestModel(CeeposOrder order) {
    CeeposOrderRestModel restOrder = new CeeposOrderRestModel();
    restOrder.setPaid(order.getPaid() == null ? null : toOffsetDateTime(order.getPaid()));
    restOrder.setCreated(toOffsetDateTime(order.getCreated()));
    restOrder.setId(order.getId());
    CeeposProductRestModel restProduct = new CeeposProductRestModel();
    restProduct.setAmount(1);
    restProduct.setCode(order.getProductCode());
    restProduct.setDescription(order.getProductDescription());
    restProduct.setPrice(order.getProductPrice());
    restOrder.setProduct(restProduct);
    restOrder.setState(order.getState());
    restOrder.setStudentIdentifier(order.getUserIdentifier());
    restOrder.setUserEntityId(order.getCreatorId());
    return restOrder;
  }

}
