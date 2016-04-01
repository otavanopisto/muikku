package fi.otavanopisto.muikku.plugins.workspacecopywizard;

import java.util.ArrayList;
import java.util.List;
import java.util.ResourceBundle;

import org.apache.commons.lang3.LocaleUtils;

import fi.otavanopisto.muikku.i18n.LocaleBundle;
import fi.otavanopisto.muikku.i18n.LocaleLocation;
import fi.otavanopisto.muikku.plugin.LocalizedPluginDescriptor;
import fi.otavanopisto.muikku.plugin.PluginDescriptor;

public class WorkspaceCopyWizardPluginDescriptor implements PluginDescriptor, LocalizedPluginDescriptor {
  
  @Override
  public void init() {
	}
  
  @Override
  public String getName() {
    return "workspace-copy-wizard";
  }
  
	@Override
  public List<LocaleBundle> getLocaleBundles() {
    List<LocaleBundle> bundles = new ArrayList<LocaleBundle>();
    bundles.add(new LocaleBundle(LocaleLocation.JAVASCRIPT, ResourceBundle.getBundle("fi.otavanopisto.muikku.plugins.workspacecopywizard.WorkspaceCopyWizardJsPluginMessages", LocaleUtils.toLocale("fi"))));
    bundles.add(new LocaleBundle(LocaleLocation.JAVASCRIPT, ResourceBundle.getBundle("fi.otavanopisto.muikku.plugins.workspacecopywizard.WorkspaceCopyWizardJsPluginMessages", LocaleUtils.toLocale("en"))));
    return bundles;
  }

}
