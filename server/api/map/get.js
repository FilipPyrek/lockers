const { handleError } = require('../helpers');

module.exports = function getMaps({ connectToMongo }) {
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
              message: 'Mapy získány úspěšně.',
              response: {
                maps: data,
              },
            }))
    )
    .catch(handleError(res));
};
