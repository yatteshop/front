export function requireAuth(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect(302, "/produits");
  }
  next();
}
