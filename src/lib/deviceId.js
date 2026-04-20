export function getDeviceId() {
  let id = localStorage.getItem('wkd_deviceId');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('wkd_deviceId', id);
  }
  return id;
}
