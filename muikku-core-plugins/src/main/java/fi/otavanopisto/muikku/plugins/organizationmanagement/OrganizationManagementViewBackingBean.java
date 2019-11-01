package fi.otavanopisto.muikku.plugins.organizationmanagement;

import javax.ejb.Stateful;
import javax.enterprise.context.RequestScoped;
import javax.inject.Named;

import org.ocpsoft.rewrite.annotation.Join;

@Named
@Stateful
@RequestScoped
@Join (path = "/organization", to = "/jsf/organization/index.jsf")

public class OrganizationManagementViewBackingBean {
}