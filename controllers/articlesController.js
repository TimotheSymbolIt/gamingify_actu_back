const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const db = require("../db");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");

const getAllArticles = async (req, res) => {
  let parameters = [];
  let queryString = "SELECT * FROM articles ORDER BY date_of_creation DESC";

  // pagination + limite
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 6;
  const offset = (page - 1) * limit;

  queryString = `${queryString} LIMIT $${parameters.length + 1} OFFSET $${
    parameters.length + 2
  }`;

  parameters.push(limit, offset);
  const { rows: AllArticles } = await db.query(queryString, parameters);
  const {
    rows: [{ count: totalArticles }],
  } = await db.query("select count(*) from articles");

  const numOfPages = Math.ceil(totalArticles / limit);
  res.status(StatusCodes.OK).json({
    count: AllArticles.length,
    AllArticles,
    numOfPages,
    currentPage: page,
  });
};

const createArticle = async (req, res) => {
  const { title, description, content } = req.body;
  const { userId } = req.user;
  let img = null;

  if (req.file) {
    if (!req.file.mimetype.startsWith("image")) {
      throw new BadRequestError("Veuillez uploader une image");
    }
    const maxSize = 1024 * 1024;
    if (maxSize < req.file.size) {
      throw new BadRequestError("Veuillez uploader une image inférieure à 1mb");
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
      use_filename: true,
      folder: "blog-upload",
    });
    img = result.secure_url;
    fs.unlinkSync(req.file.path);
  }
  const {
    rows: [createdArticle],
  } = await db.query(
    "INSERT INTO articles (title, description, img, content, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [title, description, img, content, userId]
  );

  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Article créé", item: createdArticle });
};

const getSingleArticle = async (req, res) => {
  const { id } = req.params;

  const {
    rows: [singleArticle],
  } = await db.query(
    "SELECT * FROM articles JOIN users ON articles.user_id = users.user_id  WHERE articles.article_id = $1",
    [id]
  );
  delete singleArticle.password;
  //  "SELECT * FROM articles JOIN users ON articles.user_id = users.user_id && JOIN commentary ON articles.article_id = commentary_id WHERE article_id = $1",
  // const {
  //   rows: [commentaries],
  // } = await db.query("SELECT * FROM commentary WHERE article_id = $1", [id]);

  res.status(StatusCodes.OK).json({ singleArticle });
};

const updateArticle = async (req, res) => {
  const { title, description, content, img } = req.body;
  const { id } = req.params;
  let image = img;
  let imgPublicId = null;
  if (req.file) {
    if (!req.file.mimetype.startsWith("image")) {
      throw new BadRequestError("Veuillez uploader une image");
    }
    const maxSize = 1024 * 1024;
    if (maxSize < req.file.size) {
      throw new BadRequestError("Veuillez uploader une image inférieure à 1mb");
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
      use_filename: true,
      folder: "blog-upload",
    });
    image = result.secure_url;
    imgPublicId = result.img_public_id;
  }
  const {
    rows: [article],
  } = await db.query("SELECT * FROM articles WHERE article_id = $1", [id]);

  if (req.file && imgPublicId) {
    await cloudinary.uploader.destroy(article.img_public_id);
  }
  const {
    rows: [updatedArticle],
  } = await db.query(
    "UPDATE articles SET title = $1, description = $2, img = $3, content = $4, img_public_id = $5 WHERE article_id = $6 RETURNING *",
    [title, description, image, content, imgPublicId, id]
  );

  res
    .status(StatusCodes.OK)
    .json({ msg: "Article modifié", item: updatedArticle });
};

const deleteArticle = async (req, res) => {
  const { id } = req.params;

  const {
    rows: [deletedCommentary],
  } = await db.query(
    "DELETE FROM commentary WHERE article_id = $1 RETURNING *",
    [id]
  );

  const {
    rows: [deletedArticle],
  } = await db.query("DELETE FROM articles WHERE article_id = $1 RETURNING *", [
    id,
  ]);

  res.status(StatusCodes.OK).json({
    msg: "Article supprimé",
    item: deletedCommentary,
    item: deletedArticle,
  });
};

module.exports = {
  createArticle,
  getAllArticles,
  getSingleArticle,
  updateArticle,
  deleteArticle,
};
