import type { Role, UserWhoAmI } from "~/generated/client";
import MApi from "~/api";
import { PermissionsService, type UserPermissions } from "./permissions";

export interface User {
  loggedIn: boolean;
  id: UserWhoAmI["id"];
  identifier: UserWhoAmI["identifier"];
  displayName: UserWhoAmI["displayName"];
  roles: Role[];
  permissions: UserPermissions;
  isActive: UserWhoAmI["isActive"];
  hasImage: UserWhoAmI["hasImage"];
  services: UserWhoAmI["services"];
  profile: {
    addresses: UserWhoAmI["addresses"];
    emails: UserWhoAmI["emails"];
    phoneNumbers: UserWhoAmI["phoneNumbers"];
    studyEndDate: UserWhoAmI["studyEndDate"];
    studyStartDate: UserWhoAmI["studyStartDate"];
    studyTimeLeftStr: UserWhoAmI["studyTimeLeftStr"];
    studyProgrammeName: UserWhoAmI["studyProgrammeName"];
    curriculumName: UserWhoAmI["curriculumName"];
  };
}

/**
 * Auth service
 */
export class AuthService {
  /**
   * Login to the system
   * @param loginPath - The path to redirect to after login
   * @returns The user data
   */
  static async login(
    loginPath: string = `/login?redirectUrl=${window.location.pathname}`
  ) {
    window.location.href = loginPath;
  }

  /**
   * Logout from the system
   */
  static async logout() {
    // Clear session, redirect to logout
    window.location.replace("/logout");
  }

  /**
   * Refresh the session
   * @returns The user data
   */
  static async checkAuthenticationStatus() {
    const userApi = MApi.getUserApi();
    const whoAmI = await userApi.getWhoAmI();
    return this.transformUserData(whoAmI);
  }

  /**
   * Transform the user data
   * @param whoAmI - The user data
   * @returns The transformed user data
   */
  private static transformUserData(whoAmI: UserWhoAmI): User {
    return {
      loggedIn: !!whoAmI.id,
      id: whoAmI.id,
      identifier: whoAmI.identifier,
      displayName: whoAmI.displayName,
      roles: Array.from(whoAmI.roles),
      permissions: PermissionsService.transformUserPermissions(
        whoAmI.permissions,
        whoAmI.services
      ),
      isActive: whoAmI.isActive,
      hasImage: whoAmI.hasImage,
      services: whoAmI.services,
      profile: {
        addresses: whoAmI.addresses,
        emails: whoAmI.emails,
        phoneNumbers: whoAmI.phoneNumbers,
        studyEndDate: whoAmI.studyEndDate,
        studyStartDate: whoAmI.studyStartDate,
        studyTimeLeftStr: whoAmI.studyTimeLeftStr,
        studyProgrammeName: whoAmI.studyProgrammeName,
        curriculumName: whoAmI.curriculumName,
      },
    };
  }
}
