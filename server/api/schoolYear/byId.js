const { ObjectId } = require('mongodb');
const { handleError } = require('../helpers');

module.exports = function schoolYearById({ connectToMongo }) {
  return (req, res) =>
    connectToMongo()
      .then((db) =>
         db.collection('schoolYears')
          .findOne(
            { _id: ObjectId(req.params.id) },
            { projection: { _id: 1, lockers: 1, name: 1, classes: 1 } }
          )
          .then((data) => res.json({
            code: 200,
            message: 'Školní rok získán úspěšně',
            response: data,
          }))
    )
    .catch(handleError(res));
};
