const { handleError } = require('../helpers');

module.exports = function getSchoolYear({ connectToMongo }) {
  return (req, res) =>
    connectToMongo()
      .then((db) =>
         db.collection('schoolYears')
          .find()
          .project({
            name: 1,
            lastUpdate: 1,
          })
          .toArray()
            .then((data) => res.json({
              code: 200,
              message: 'Školní rok získán úspěšně.',
              response: {
                schoolYears: data,
              },
            }))
    )
    .catch(handleError(res));
};
