const router = require("express").Router();
const bookController = require("../controllers/bookController");
const auth = require("../middleware/auth");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() }); // Temporary memory storage

// Main Product Routes (UI)
// Note: Some rules are effectively API endpoints if returning JSON, 
// but here we are mixing UI and Logic. 
// For better practice, we should separate API and View routes, 
// but for this mini-ecommerce, we will keep them as requested in server.js structure refactoring.

// However, the original server.js had specific routes for pages.
// We will look at server.js again to see how to integrate.
// For now, let's export the router to be used in server.js (or main app).

// This file was originally "routes/product.js" which seemed to be an API route returning JSON.
// But the user's "server.js" had "app.get('/', ...)" rendering views.
// We should probably consolidate.

// Let's make this router handle the API/Action part, and let server.js (or a separate index router) handle the Views?
// OR, we move everything to controllers.

// DECISION: We will use this router for the defined endpoints in the controller.
// Since the controller renders views, we use GET for views and POST for actions.

router.get("/", bookController.getAll);
router.get("/add", auth, bookController.getAddPage);
router.post("/add", auth, upload.single("image"), bookController.create);
router.get("/edit/:id", auth, bookController.getEditPage);
router.post("/edit/:id", auth, upload.single("image"), bookController.update);
router.post("/delete/:id", auth, bookController.delete);

module.exports = router;