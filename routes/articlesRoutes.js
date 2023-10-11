const { Router } = require("express");
const router = Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const {
  authenticateUser,
  authorizePermissions,
} = require("../middlewares/authenticationMiddleware.js");

const {
  validateAddArticles,
  validateUpdateArticles,
  validateIdParamArticles,
} = require("../middlewares/validationMiddleware.js");

const {
  createArticle,
  getAllArticles,
  getSingleArticle,
  updateArticle,
  deleteArticle,
} = require("../controllers/articlesController.js");

router.route("/admin").get(authorizePermissions("admin"), getAllArticles);
router
  .route("/")
  .post(
    authenticateUser,
    authorizePermissions("admin"),
    upload.single("image"),
    validateAddArticles,
    createArticle
  )
  .get(getAllArticles);
router
  .route("/:id")
  .get(getSingleArticle)
  .put(
    authenticateUser,
    authorizePermissions("admin"),
    upload.single("image"),
    validateUpdateArticles,
    updateArticle
  )
  .delete(
    authenticateUser,
    authorizePermissions("admin"),
    validateIdParamArticles,
    deleteArticle
  );

module.exports = router;
