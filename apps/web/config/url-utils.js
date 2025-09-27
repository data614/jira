const normalizeBaseUrl = (url) => {
  if (!url || typeof url !== "string") return "";
  return url.trim().replace(/\/+$/, "");
};

const normalizeBasePath = (path) => {
  if (!path || typeof path !== "string") return "";
  const trimmed = path.trim();
  if (!trimmed) return "";
  const withoutSlashes = trimmed.replace(/^\/+/, "").replace(/\/+$/, "");
  if (!withoutSlashes) return "";
  return `/${withoutSlashes}`;
};

const buildExternalRewrite = (baseUrl, basePath = "") => {
  const normalizedUrl = normalizeBaseUrl(baseUrl);
  if (!normalizedUrl) return "";
  const normalizedPath = normalizeBasePath(basePath);
  return `${normalizedUrl}${normalizedPath}`;
};

module.exports = {
  normalizeBaseUrl,
  normalizeBasePath,
  buildExternalRewrite,
};
