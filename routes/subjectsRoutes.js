const { Router } = require("express");
const router = Router();

const {
  authenticateUser,
} = require("../middlewares/authenticationMiddleware.js");

const {
  validateAddSubjects,
  validateUpdateSubjects,
  validateIdParamSubjects,
} = require("../middlewares/validationMiddleware.js");

const {
  createSubject,
  getAllSubjects,
  getSingleSubject,
  updateSubject,
  deleteSubject,
} = require("../controllers/subjectsController.js");

router.use(authenticateUser);
router.route("/").get(getAllSubjects);
router.route("/").post(validateAddSubjects, createSubject);
router
  .route("/:id")
  .get(getSingleSubject)
  .put(validateUpdateSubjects, updateSubject)
  .delete(validateIdParamSubjects, deleteSubject);

module.exports = router;
