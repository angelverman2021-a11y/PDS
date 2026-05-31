export const API_ROUTES = [
  { method: 'GET', path: '/api/v1/shops', controller: 'ShopController.search' },
  { method: 'GET', path: '/api/v1/shops/:fpsId', controller: 'ShopController.getById' },
  { method: 'POST', path: '/api/v1/complaints', controller: 'ComplaintController.create' },
  { method: 'GET', path: '/api/v1/complaints/:complaintId', controller: 'ComplaintController.track' },
  { method: 'GET', path: '/api/v1/complaints/:complaintId/timeline', controller: 'ComplaintController.timeline' },
  { method: 'PATCH', path: '/api/v1/complaints/:complaintId/status', controller: 'ComplaintController.transition' },
  { method: 'GET', path: '/api/v1/data-sources/disclosure', controller: 'DataSourceController.disclosure' },
  { method: 'POST', path: '/api/v1/support/tickets', controller: 'SupportController.create' },
  { method: 'PATCH', path: '/api/v1/support/tickets/:supportId/status', controller: 'SupportController.nextStatus' },
];
