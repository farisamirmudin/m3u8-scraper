import { createCipheriv, createDecipheriv } from "crypto";

export const encrypt = (text: string, key: string, iv: string) => {
  const cipher = createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");

  return encrypted;
};

export const decrypt = (text: string, key: string, iv: string) => {
  const decipher = createDecipheriv("aes-256-cbc", key, iv);
  decipher.setAutoPadding(false);

  let decrypted = decipher.update(text, "base64", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};
