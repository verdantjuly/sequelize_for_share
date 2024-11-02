// require no
module.exports = (sequelize, DataTypes) => {
  // create table Posts (
  //     id integer primary key autoincrement
  //     title TEXT not null
  //     content text
  //     author text
  // )

  const Post = sequelize.define("Post", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: DataTypes.STRING,
    author: DataTypes.STRING,
  });
  Post.associate = function (models) {
    Post.hasMany(models.Comment);
  };
  return Post;
};
