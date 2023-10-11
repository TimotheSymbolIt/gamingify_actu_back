const { body, param, validationResult } = require("express-validator");
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require("../errors/index.js");
const db = require("../db");

const withValidationErrors = (validateValues) => {
  return [
    validateValues,
    (req, _res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);

        if (errorMessages[0].startsWith("Aucun sujet de discussion trouvé")) {
          throw new NotFoundError(errorMessages);
        }

        if (errorMessages[0].startsWith("Accès non")) {
          throw new UnauthorizedError(errorMessages);
        }

        throw new BadRequestError(errorMessages);
      }

      next();
    },
  ];
};

//  test
const validateTest = withValidationErrors([
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Le nom est requis")
    .isLength({ min: 3, max: 50 })
    .withMessage("Le nom doit contenir entre 3 et 50 caractères")
    .escape(),
]);

const validateRegisterInput = withValidationErrors([
  body("name").trim().notEmpty().withMessage("Le nom est requis").escape(),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("L'email est requis")
    .isEmail()
    .withMessage("Format d'email non valide")
    .escape()
    .custom(async (email) => {
      const {
        rows: [user],
      } = await db.query("SELECT * FROM users WHERE email = $1", [email]);

      if (user) {
        throw new Error("L'email existe déjà");
      }
    }),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Le mot de passe est requis")
    .escape(),
]);

const validateLoginInput = withValidationErrors([
  body("email")
    .trim()
    .notEmpty()
    .withMessage("L'email est requis")
    .isEmail()
    .withMessage("Format d'email non valide")
    .escape(),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Le mot de passe est requis")
    .escape(),
]);

const validateAddArticles = withValidationErrors([
  body("title").trim().notEmpty().withMessage("Le titre est requis").escape(),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("La description de l'article est requis")
    .escape(),
]);

const validateAddCommentary = withValidationErrors([
  body("description")
    .trim()
    .notEmpty()
    .withMessage("La description du commentaire est requis")
    .escape(),
]);

const validateUpdateArticles = withValidationErrors([
  body("title").trim().notEmpty().withMessage("Le titre est invalide").escape(),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("La description est invalide")
    .escape(),
]);

const validateUpdateCommentary = withValidationErrors([
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Le commentaire est invalide")
    .escape(),
]);

// validateIdParam
const validateIdParamArticles = withValidationErrors(
  param("id").custom(async (id, { req }) => {
    if (isNaN(Number(id))) {
      throw new Error("Id non valide");
    }

    const {
      rows: [articles],
    } = await db.query("SELECT * FROM articles WHERE article_id = $1", [id]);

    if (!articles) {
      throw new Error(`Pas d'article avec l'id ${id}`);
    }
  })
);

const validateIdParamCommentary = withValidationErrors(
  param("id").custom(async (id, { req }) => {
    if (isNaN(Number(id))) {
      throw new Error("Id non valide");
    }

    const {
      rows: [commentary],
    } = await db.query("SELECT * FROM commentary WHERE commentary_id = $1", [
      id,
    ]);

    if (!commentary) {
      throw new Error(`Pas de commentaire avec l'id ${id}`);
    }

    const isOwner = req.user.userId === commentary.user_id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      throw new Error("Accès non autorisé");
    }
  })
);

module.exports = {
  validateTest,
  validateLoginInput,
  validateRegisterInput,
  validateAddArticles,
  validateAddCommentary,
  validateUpdateArticles,
  validateUpdateCommentary,
  validateIdParamArticles,
  validateIdParamCommentary,
};
