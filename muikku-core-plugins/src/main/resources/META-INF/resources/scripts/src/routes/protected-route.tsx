import * as React from "react";
import { Redirect, RouteComponentProps } from "react-router-dom";

/**
 * Props for the ProtectedRoute component
 */
interface ProtectedRouteProps {
  /**
   * Whether the route requires authentication. Optional, defaults to false.
   * @default false
   */
  requireAuth?: boolean;
  /**
   * Whether the user is authenticated. Optional, defaults to false.
   * @default false
   */
  isAuthenticated?: boolean;
  /**
   * Whether the user has permission to access the route. Optional, defaults to false.
   * @default false
   */
  hasPermission?: boolean;
  /**
   * The path to redirect to if the user has no permission. Optional, defaults to "/".
   * @default "/"
   */
  redirectPath?: string;
  /**
   * The path to redirect to if the user is not authenticated. Optional, defaults to "/login".
   * @default `/login?redirectUrl=${window.location.pathname}`
   */
  loginPath?: string;
  /**
   * The route props.
   */
  routeProps?: RouteComponentProps;
  /**
   * The children of the ProtectedRoute component.
   */
  children:
    | React.ReactNode
    | ((routeProps?: RouteComponentProps) => React.ReactNode);
}

/**
 * ProtectedRoute component. Handles authentication and permission checks for routes
 * and redirects to the appropriate path.
 * @param props props
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = (props) => {
  const {
    requireAuth = false,
    isAuthenticated = false,
    hasPermission = false,
    loginPath = `/login?redirectUrl=${window.location.pathname}`,
    redirectPath = "/",
    children,
  } = props;

  console.log("window.location.href", { ...window.location });
  console.log("loginPath", loginPath);

  // If the route requires authentication and the user is not authenticated, redirect to the login path
  if (requireAuth && !isAuthenticated) {
    window.location.href = loginPath;
    return null;
  }

  // If the user has no permission, redirect to the redirect path
  if (!hasPermission) {
    return <Redirect to={redirectPath} />;
  }

  // If the user has permission, render the children
  // If the children is a function, call it with the route props
  // Otherwise, render the children directly
  return (
    <>
      {typeof children === "function" ? children(props.routeProps) : children}
    </>
  );
};
