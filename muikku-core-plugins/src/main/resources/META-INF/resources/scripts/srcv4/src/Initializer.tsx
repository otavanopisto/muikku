import { useEffect, useRef } from "react";
import { useGlobalInitialization } from "./hooks/useGlobalInit";
import { useParams } from "react-router";
import { initializeWorkspaceStatusAtom } from "./atoms/workspace";
import { useSetAtom } from "jotai";
import { useAtom } from "jotai";
import {
  globalInitializedAtom,
  workspaceInitializedAtom,
} from "./atoms/shared";

/**
 * EnvironmentInitializer component
 * @param param0 - React.ReactNode
 * @returns React.ReactNode
 */
export function EnvironmentInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isGlobalInitialized, setIsGlobalInitialized] = useAtom(
    globalInitializedAtom
  );
  const globalInit = useGlobalInitialization();
  const isInitializing = useRef(false);

  useEffect(() => {
    if (isInitializing.current || isGlobalInitialized) return;
    isInitializing.current = true;

    async function init() {
      await globalInit();
      setIsGlobalInitialized(true);
    }
    init();
  }, [isGlobalInitialized, globalInit, setIsGlobalInitialized]);

  if (!isGlobalInitialized) return <></>;
  return <>{children}</>;
}

/**
 * WorkspaceInitializer component
 * @param param0 - React.ReactNode
 * @returns React.ReactNode
 */
export function WorkspaceInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { workspaceUrlName } = useParams();
  const [workspaceInitialized, setWorkspaceInitialized] = useAtom(
    workspaceInitializedAtom
  );
  const initializeWorkspaceStatus = useSetAtom(initializeWorkspaceStatusAtom);
  const isInitializing = useRef(false);

  useEffect(() => {
    // If the workspace URL name is not provided or the workspace is already initialized, return
    if (!workspaceUrlName || workspaceUrlName === workspaceInitialized) return;
    // If the workspace is already initializing, return
    if (isInitializing.current) return;

    isInitializing.current = true;

    // Initialize the workspace
    async function init() {
      await initializeWorkspaceStatus(workspaceUrlName);
      setWorkspaceInitialized(workspaceUrlName || null);
    }
    init();
  }, [
    workspaceUrlName,
    workspaceInitialized,
    initializeWorkspaceStatus,
    setWorkspaceInitialized,
  ]);

  if (workspaceUrlName !== workspaceInitialized) return <></>;
  return <>{children}</>;
}
