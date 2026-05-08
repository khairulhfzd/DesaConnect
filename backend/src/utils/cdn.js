const getFileUrl = (req, fileName) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const cloudfrontUrl = process.env.CLOUDFRONT_URL;
  
  if (isProduction && cloudfrontUrl) {
    // Remove trailing slash if present to avoid double slashes
    const baseUrl = cloudfrontUrl.endsWith('/') ? cloudfrontUrl.slice(0, -1) : cloudfrontUrl;
    return `${baseUrl}/${fileName}`;
  }
  
  // Return local url for development or if CDN not configured
  const protocol = req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}/uploads/${fileName}`;
};

module.exports = { getFileUrl };

