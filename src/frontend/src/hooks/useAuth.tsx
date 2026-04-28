import { useInternetIdentity } from "@caffeineai/core-infrastructure";

export function useAuth() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();

  const isAuthenticated = loginStatus === "success" && identity !== undefined;
  const isLoading =
    loginStatus === "logging-in" || loginStatus === "initializing";
  const isIdle = loginStatus === "idle";

  return {
    isAuthenticated,
    isLoading,
    isIdle,
    loginStatus,
    identity,
    login,
    logout: clear,
  };
}
