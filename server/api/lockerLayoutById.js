const { ObjectId } = require('mongodb');
const { handleError } = require('./helpers');

module.exports = function lockerLayoutById({ connectToMongo }) {
  return (req, res) =>
    connectToMongo()
      .then((db) =>
         db.collection('layouts')
          .findOne(
            { _id: ObjectId(req.params.id) },
            { projection: { _id: 1, boxes: 1, name: 1 } }
          )
          .then((data) => res.json({
            code: 200,
            message: 'Rozložení získáno úspěšně',
            response: data,
          }))
    )
    .catch(handleError(res));
};
