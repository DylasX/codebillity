import * as crypto from 'crypto';

const defaultAlgorithm = 'aes256';

const encrypt = (str, options: any = {}) => {
  try {
    const key = crypto
      .createHash('sha256')
      .update(String(options.key))
      .digest('base64')
      .substr(0, 32);
    const algorithm = options.algorithm || defaultAlgorithm;

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = [
      iv.toString('hex'),
      ':',
      cipher.update(str, 'utf8', 'hex'),
      cipher.final('hex'),
    ];

    return encrypted.join('');
  } catch (error) {
    console.error(error);
  }
};

const decrypt = (str, options) => {
  const key = crypto
    .createHash('sha256')
    .update(String(options.key))
    .digest('base64')
    .substr(0, 32);
  const algorithm = options.algorithm || defaultAlgorithm;

  const encryptedArray = str.split(':');
  const iv = Buffer.from(encryptedArray[0], 'hex');
  const encrypted = Buffer.from(encryptedArray[1], 'hex');
  const decipher: any = crypto.createDecipheriv(algorithm, key, iv);
  const decrypted =
    decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');

  return decrypted;
};

export { encrypt, decrypt };
