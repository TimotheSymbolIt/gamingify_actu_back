const db = require("../db");
const { StatusCodes } = require("http-status-codes");

const getAllCommentaryArticles = async (req, res) => {
  const { article_id } = req.params;
  const result = await db.query(
    "SELECT commentary_id, description, date_of_creation, name FROM commentary JOIN users ON commentary.user_id = users.user_id where article_id = $1 order by date_of_creation ASC",
    [article_id]
  );
  res.status(StatusCodes.CREATED).json({ items: result.rows });
};

const createCommentary = async (req, res) => {
  console.log(req.user.userId);
  const { description } = req.body;
  const userId = req.user.userId;
  const { id } = req.params;
  console.log(req.params);

  const result = await db.query(
    "INSERT INTO commentary (description, user_id, article_id) VALUES ($1, $2, $3) RETURNING *",
    [description, userId, id]
  );

  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Commentaire créé", item: result });
};

// const getSingleCommentary = async (req, res) => {
//   const { id } = req.params;

//   const {
//     rows: [SingleCommentary],
//   } = await db.query(
//     "SELECT * FROM commentary JOIN users USING (user_id) WHERE commentary_id = $1",
//     [id]
//   );

//   res.status(StatusCodes.OK).json({ SingleCommentary });
// };

// const updateCommentary = async (req, res) => {
//   const { description } = req.body;
//   const { id } = req.params;

//   const {
//     rows: [updatedCommentary],
//   } = await db.query(
//     "UPDATE commentary SET description = $1 WHERE commentary_id = $2 RETURNING *",
//     [description, id]
//   );

//   res
//     .status(StatusCodes.OK)
//     .json({ msg: "Commentaire modifié", item: updatedCommentary });
// };

const deleteCommentary = async (req, res) => {
  const { id } = req.params;

  const {
    rows: [deletedCommentary],
  } = await db.query(
    "DELETE FROM commentary WHERE commentary_id = $1 RETURNING *",
    [id]
  );

  res
    .status(StatusCodes.OK)
    .json({ msg: "Commentaire supprimé", item: deletedCommentary });
};

module.exports = {
  createCommentary,
  getAllCommentaryArticles,
  // getAllCommentary,
  // getSingleCommentary,
  // updateCommentary,
  deleteCommentary,
};
