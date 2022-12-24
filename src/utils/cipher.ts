import { createCipheriv, createDecipheriv } from "crypto";

export const encryptData = (text: string) => {
  const cipher = createCipheriv(
    "aes-256-cbc",
    process.env.NEXT_PUBLIC_SECRET_KEY!,
    process.env.NEXT_PUBLIC_IV!
  );
  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");

  return encrypted;
};

export const decryptData = (text: string) => {
  const decipher = createDecipheriv(
    "aes-256-cbc",
    process.env.NEXT_PUBLIC_SECRET_KEY!,
    process.env.NEXT_PUBLIC_IV!
  );
  decipher.setAutoPadding(false);

  let decrypted = decipher.update(text, "base64", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};
