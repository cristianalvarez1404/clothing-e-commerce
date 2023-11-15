export const createCookieUser = (token, user, res) => {
  if (!token || !user) {
    return res.status(400).json({
      success: false,
      message: `Token or user does not exist`,
    });
  }

  const cookieDaysExpire = 1000 * 60 * 60 * 24;
  const cookieDateExpire = new Date() + cookieDaysExpire;

  res
    .cookie("user-id", `${token}`, {
      expire: cookieDateExpire,
      httpOnly: true,
    })
    .status(200)
    .json({ success: true, user });
};
