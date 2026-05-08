const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';

const s3Client = process.env.AWS_REGION ? new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
}) : null;

const BUCKET_NAME = process.env.S3_BUCKET_NAME;

const uploadToS3 = async (fileBuffer, fileName, mimetype) => {
  // If no AWS config is present or not in production, save locally (mock S3)
  if (!s3Client || !BUCKET_NAME || !isProduction) {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, fileBuffer);
    
    // Log local upload for debugging
    if (!isProduction) {
      console.log(`[Local Storage] File saved: ${fileName}`);
    }
    
    return { local: true, fileName };
  }

  // Upload to real AWS S3
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: fileBuffer,
      ContentType: mimetype,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    
    console.log(`[AWS S3] File uploaded successfully: ${fileName} to bucket: ${BUCKET_NAME}`);
    
    return { local: false, fileName };
  } catch (error) {
    console.error(`[AWS S3] Upload failed for ${fileName}:`, error);
    throw error;
  }
};

module.exports = { uploadToS3 };

