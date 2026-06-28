const configuredOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const localDevPattern = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/;

export const corsOrigin = (origin, callback) => {
  if (!origin || configuredOrigins.includes(origin) || localDevPattern.test(origin)) {
    return callback(null, true);
  }

  return callback(new Error(`CORS blocked origin: ${origin}`));
};

export const socketCorsOrigin = configuredOrigins.some((origin) => localDevPattern.test(origin))
  ? [/^http:\/\/localhost:\d+$/, /^http:\/\/127\.0\.0\.1:\d+$/, ...configuredOrigins]
  : configuredOrigins;
