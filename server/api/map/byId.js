const { ObjectId } = require('mongodb');
const { handleError } = require('../helpers');

module.exports = function getMapById({ connectToMongo }) {
  return (req, res) =>
    connectToMongo()
      .then((db) =>
         db.collection('maps')
          .findOne(
            { _id: ObjectId(req.params.id) },
            { projection: { _id: 1, lockers: 1, name: 1 } }
          )
          .then((data) => res.json({
            code: 200,
            message: 'Mapa získána úspěšně',
            response: data,
          }))
    )
    .catch(handleError(res));
};
