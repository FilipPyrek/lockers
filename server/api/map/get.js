const { handleError } = require('../helpers');

module.exports = function getMap({ connectToMongo }) {
  return (req, res) =>
    connectToMongo()
      .then((db) =>
         db.collection('maps')
          .find()
          .project({
            name: 1,
            lastUpdate: 1,
          })
          .toArray()
            .then((data) => res.json({
              code: 200,
              message: 'Mapa získána úspěšně.',
              response: {
                layouts: data,
              },
            }))
    )
    .catch(handleError(res));
};
