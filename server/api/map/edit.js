const Joi = require('joi');
const { ObjectId } = require('mongodb');
const { handleError } = require('../helpers');

const editMapSchema = Joi.object().keys({
  boxes: Joi.object().required().error(() => ({ message: 'Musíte odeslat objekt s boxy.' })),
});
module.exports = function editMap({ connectToMongo }) {
  return (req, res) =>
    Joi.validate(req.body, editMapSchema)
      .then(({ boxes }) =>
        connectToMongo()
          .then((db) =>
            db.collection('maps')
              .updateOne(
                { _id: ObjectId(req.params.id) },
                { $set: { boxes, lastUpdate: new Date() } }
              )
              .then(() => res.json({
                code: 200,
                message: 'Změny v mapách byly úspěšně uloženy.',
              }))
        )
    )
    .catch(handleError(res));
};
