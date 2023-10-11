const db = require("../db");
const { StatusCodes } = require("http-status-codes");

const getAllSubjects = async (_req, res) => {
  const { rows: AllSubjects } = await db.query(
    "SELECT * FROM community_forums"
  );
  res.status(StatusCodes.OK).json({ count: AllSubjects.length, AllSubjects });
};

const createSubject = async (req, res) => {
  const { name, description, img } = req.body;
  const { userId } = req.user;

  const {
    rows: [createdSubject],
  } = await db.query(
    "INSERT INTO community_forums (name, description, img, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, description, img, userId]
  );

  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Sujet créé", item: createdSubject });
};

const getSingleSubject = async (req, res) => {
  const { id } = req.params;

  const {
    rows: [SingleSubject],
  } = await db.query(
    "SELECT * FROM community_forums WHERE community_forums_id = $1",
    [id]
  );

  res.status(StatusCodes.OK).json({ SingleSubject });
};

const updateSubject = async (req, res) => {
  const { name, description, img } = req.body;
  const { id } = req.params;

  const {
    rows: [updatedSubject],
  } = await db.query(
    "UPDATE community_forums SET name = $1, description = $2, img = $3 WHERE community_forums_id = $4 RETURNING *",
    [name, description, img, id]
  );

  res
    .status(StatusCodes.OK)
    .json({ msg: "Sujet modifié", item: updatedSubject });
};

const deleteSubject = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const {
    rows: [deletedSubject],
  } = await db.query(
    "DELETE FROM community_forums WHERE community_forums_id = $1 RETURNING *",
    [id]
  );

  res
    .status(StatusCodes.OK)
    .json({ msg: "Sujet supprimé", item: deletedSubject });
};

module.exports = {
  createSubject,
  getAllSubjects,
  getSingleSubject,
  updateSubject,
  deleteSubject,
};
