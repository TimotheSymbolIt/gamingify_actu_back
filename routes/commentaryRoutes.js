const { Router } = require("express");
const router = Router();

const {
  authenticateUser,
} = require("../middlewares/authenticationMiddleware.js");

const {
  validateAddCommentary,
  // validateUpdateCommentary,
  validateIdParamCommentary,
} = require("../middlewares/validationMiddleware.js");

const {
  createCommentary,
  getAllCommentaryArticles,
  // getAllCommentary,
  // getSingleCommentary,
  // updateCommentary,
  deleteCommentary,
} = require("../controllers/commentaryController.js");

router.route("/"), router.route("/:article_id").get(getAllCommentaryArticles);
// router
//   .use(authenticateUser)
//   .route("/:id")
//   // .get(getSingleCommentary)
//   .post(createCommentary)
//   // .put(validateUpdateCommentary, updateCommentary)
//   .delete(validateIdParamCommentary, deleteCommentary);

router.post("/:id", authenticateUser, createCommentary);

module.exports = router;

// router.post("/:article_id", async (req, res) => {
//   try {
//     createCommentary(req, res);
//   } catch (error) {
//     console.log(error);
//   }
// });
