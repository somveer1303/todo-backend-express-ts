const JwtExpireIn = {
  month: 60 * 60 * 24 * 30,
  week: 60 * 60 * 24 * 7,
  day: 60 * 60 * 24,
  hour: 60 * 60,
} as const;

const JWT = {
  expireIn: JwtExpireIn,
};

export const UserConstant = {
  JWT: JWT,
};
