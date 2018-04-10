const { handleError } = require('../helpers');

module.exports = function getUsers({ connectToMongo }) {
  return (req, res) =>
    connectToMongo()
      .then((db) =>
         db.collection('users')
          .find()
          .project({
            email: 1,
            lastLogin: 1,
            lastUpdate: 1,
            isApi: 1,
          })
          .toArray()
            .then((data) => res.json({
              code: 200,
              message: 'Uživatelé získáni úspěšně.',
              response: {
                users: data,
              },
            }))
    )
    .catch(handleError(res));
};
