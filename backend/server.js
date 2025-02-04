require('dotenv').config();
const express = require('express')
const cors = require('cors')
const helmet = require('helmet'); 
const connection = require('./config/connection')
const userRoutes = require('./routes/userRoutes')
const cardRoutes = require('./routes/cardRoutes')
const bookmarkRoutes = require("./routes/bookmarkRoutes");

//init app
const app = express();
const port = 8080;


// Connect to the database (check if needed)
connection();

//middleware
app.use(express.json({ limit: "50mb" })); // Increase JSON payload limit
app.use(express.urlencoded({ limit: "10mb", extended: true })); // For URL-encoded payloads

// Configure CORS
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173", // Local development
        "https://syncbro.netlify.app", // Deployed frontend on Netlify
      ];

      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin) {
        return callback(null, true);
      }

      // Check if the request's origin is in the allowed list
      if (allowedOrigins.includes(origin)) {
        callback(null, true); // Allow the request
      } else {
        console.error("Blocked by CORS:", origin); // Log blocked origins for debugging
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true, // Allow cookies and authentication headers
  })
);

// Add Helmet for Security
app.use(helmet()); // Enable default security headers

//routes -middleware router "const router = express.Router();"
app.use("/users", userRoutes);
app.use("/cards", cardRoutes);
app.use("/bookmarks", bookmarkRoutes);



app.listen(port, () => {
  console.log(` app listening on port ${port}`)
})



//HELMET Read


//  using app.use(helmet()); is enough to enable the default security settings provided by Helmet, which is a great starting point for securing your Node.js/Express app.

// What app.use(helmet()); Does by Default:
// When you call helmet() without any configuration, it applies a set of predefined security headers that are considered a best practice for most applications. These include:

// X-DNS-Prefetch-Control:

// Disables DNS prefetching to prevent privacy leaks.
// X-Frame-Options:

// Prevents clickjacking by disallowing your app from being embedded in an <iframe>.
// X-Content-Type-Options:

// Prevents MIME type sniffing, reducing the risk of content-sniffing attacks.
// Strict-Transport-Security (HSTS):

// Forces HTTPS connections for your site. (Only applied if your site uses HTTPS.)
// X-Permitted-Cross-Domain-Policies:

// Restricts cross-domain interactions for Flash and other plugins.
// Referrer-Policy:

// Controls what information is included in the Referer header for requests.
// Cross-Origin-Embedder-Policy:

// Helps prevent certain types of cross-origin attacks.
// When You Might Need Customization:
// While the default settings are sufficient for many use cases, you might want to customize the behavior based on your app’s needs. For example:

// Example 1: Add a Content Security Policy (CSP)
// CSP helps prevent XSS attacks by restricting which resources (scripts, styles, images, etc.) can be loaded.

// javascript
// Copy code
// const helmet = require('helmet');

// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         scriptSrc: ["'self'", "https://trustedscripts.example.com"],
//       },
//     },
//   })
// );
// Example 2: Disable Specific Middleware
// If a particular security header is causing issues, you can disable it:

// javascript
// Copy code
// app.use(
//   helmet({
//     frameguard: false, // Disable X-Frame-Options
//   })
// );
// Example 3: Enforce HTTPS with HSTS
// Ensure that all traffic uses HTTPS:

// javascript
// Copy code
// app.use(
//   helmet.hsts({
//     maxAge: 31536000, // 1 year in seconds
//     includeSubDomains: true, // Apply to subdomains
//   })
// );
// Best Practices for Using Helmet:
// Use it in Production: Make sure helmet() is included in the middleware stack for production environments.
// Test Locally: Use Helmet in your development environment to ensure it doesn’t interfere with legitimate functionality.
// Combine with Other Middleware: Helmet doesn’t handle authentication or other application-level concerns, so use it alongside tools like cors, express.json(), and your own security mechanisms.
// Final Answer:
// Yes, just installing Helmet and adding app.use(helmet()); is enough to apply its default protection. However, for advanced use cases or stricter security, consider customizing it to fit your application’s needs.