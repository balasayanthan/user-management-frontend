export const environment = {
  production: false,
  apiBase: 'https://localhost:7156/api/v1',
  auth: {
    enabled: true,
    //token: 'admin-token-123' // ← dev token have no access to reports
    token: 'staff-token-123' // ← dev token have access to reports
  },
};
