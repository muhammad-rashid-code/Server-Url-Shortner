export default function sendResponse(res, statusCode, error, data, message) {
  res.status(statusCode).json({ error, data, message });
}
