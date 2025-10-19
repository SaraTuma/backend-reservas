export const permissions: Record<string, string[]> = {
  CLIENT: [
    "createReservation",
    "cancelReservation",
    "viewServices",
    "viewOwnReservations",
    "findAllService",
    "viewStats"
  ],
  PROVIDER: [
    "createService",
    "updateService",
    "deleteService",
    "viewMyReservations",
    "findAllService",
    "lientsByProviderUser",
    "viewStats"
  ],
  ADMIN: ["*"], 
};

export function checkPermission(role: string, action: string): boolean {
  const allowed = permissions[role];
  return allowed?.includes("*") || allowed?.includes(action) || false;
}
