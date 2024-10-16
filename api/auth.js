const express = require("express");
const router = express.Router();

// TODO: Import jwt and JWT_SECRET
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

// TODO: createToken
function createToken(id) {
  return jwt.sign({ id }, JWT_SECRET, {expiresIn: "1d"});
}

const prisma = require("../prisma");
// const { token } = require("morgan");

// This token-checking middleware should run before any other routes.

// It's the first in this file, and this router is imported first in `server.js`.
router.use(async (req, res, next) => {
  // Grab token from headers only if it exists
  const authHeader = req.headers.authorization;
  const token = authHeader?.slice(7); // "Bearer <token>"
  if (!token) return next();

  // TODO: Find customer with ID decrypted from the token and attach to the request
  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const customer = await prisma.customer.findUniqueOrThrow({
      where: { id },
    });
    req.customer = customer;
    next();
  } catch (e) {
    next(e);
  }
});

// TODO: POST /register
router.post("/register", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const customer = await prisma.customer.register(email, password);
    const token = createToken(customer.id);
    res.status(201).json({ token });
  } catch (e) {
    next(e);
  }
  });

// TODO: POST /login
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const customer = await prisma.customer.login(email, password);
    const token = createToken(customer.id);
    res.json({ token });
  } catch (e) {
    next(e);
  }
  });

/** Checks the request for an authenticated customer. */
function authenticate(req, res, next) {
  if (req.customer) {
    next();
  } else {
    next({ status: 401, message: "You must be logged in." });
  }
}

// Notice how we export the router _and_ the `authenticate` middleware!
module.exports = {
  router,
  authenticate,
};