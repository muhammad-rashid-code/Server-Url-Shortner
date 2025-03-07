export default function sendResponse(res, status, error, data, message) {
  res.json({ status, error, data, message });
}
