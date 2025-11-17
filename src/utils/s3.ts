/**
 * Converts an S3 URI (s3://bucket/key) to HTTPS URL format
 * @param s3Url - The S3 URL in s3:// format or already in HTTPS format
 * @param region - AWS region (defaults to us-east-1)
 * @returns HTTPS URL that can be accessed by browsers
 */
export function s3ToHttps(s3Url: string, region: string = 'us-east-1'): string {
  // If already in HTTPS format, return as-is
  if (s3Url.startsWith('https://') || s3Url.startsWith('http://')) {
    return s3Url;
  }

  // Check if it's a valid s3:// URL
  if (!s3Url.startsWith('s3://')) {
    console.warn('Invalid S3 URL format:', s3Url);
    return s3Url;
  }

  try {
    // Remove s3:// prefix
    const withoutProtocol = s3Url.slice(5);
    
    // Split into bucket and key
    const firstSlashIndex = withoutProtocol.indexOf('/');
    
    if (firstSlashIndex === -1) {
      throw new Error('Invalid S3 URL: missing key path');
    }
    
    const bucket = withoutProtocol.slice(0, firstSlashIndex);
    const key = withoutProtocol.slice(firstSlashIndex + 1);
    
    if (!bucket || !key) {
      throw new Error('Invalid S3 URL: empty bucket or key');
    }
    
    // Encode the key path (preserve forward slashes, encode special characters)
    const encodedKey = key.split('/').map(segment => encodeURIComponent(segment)).join('/');
    
    // Construct HTTPS URL
    // For us-east-1, can use either format, but .s3.amazonaws.com is more standard
    return `https://${bucket}.s3.${region}.amazonaws.com/${encodedKey}`;
  } catch (error) {
    console.error('Error converting S3 URL:', error, s3Url);
    return s3Url;
  }
}

/**
 * Transforms multiple S3 URLs in an object
 * Useful for transforming API response objects with multiple S3 URL fields
 */
export function transformS3Urls<T extends Record<string, any>>(
  obj: T,
  fields: (keyof T)[],
  region?: string
): T {
  const result = { ...obj };
  
  for (const field of fields) {
    if (typeof result[field] === 'string') {
      result[field] = s3ToHttps(result[field] as string, region) as any;
    }
  }
  
  return result;
}

