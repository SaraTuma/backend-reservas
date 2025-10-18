export const permissions: Record<string, string[]> = {
  CLIENT: [
    "createReservation",
    "cancelReservation",
    "viewServices",
    "viewOwnReservations",
  ],
  PROVIDER: [
    "createService",
    "updateService",
    "deleteService",
    "viewMyReservations",
  ],
  ADMIN: ["*"], 
};

export function checkPermission(role: string, action: string): boolean {
  const allowed = permissions[role];
  return allowed?.includes("*") || allowed?.includes(action) || false;
}
