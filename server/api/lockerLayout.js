const { handleError } = require('./helpers');

module.exports = function lockerLayoutAdd({ connectToMongo }) {
  return (req, res) =>
    connectToMongo()
      .then((db) =>
         db.collection('layouts')
          .find()
          .project({
            name: 1,
            lastUpdate: 1,
          })
          .toArray()
            .then((data) => res.json({
              code: 200,
              message: 'Rozložení získána úspěšně.',
              response: {
                layouts: data,
              },
            }))
    )
    .catch(handleError(res));
};
