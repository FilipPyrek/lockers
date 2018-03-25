const Joi = require('joi');
const { ObjectId } = require('mongodb');
const { handleError } = require('./helpers');

const addLayoutSchema = Joi.object().keys({
  boxes: Joi.object().required().error(() => ({ message: 'Musíte odeslat objekt s boxy.' })),
});
module.exports = function lockerLayoutEdit({ connectToMongo }) {
  return (req, res) =>
    Joi.validate(req.body, addLayoutSchema)
      .then(({ boxes }) =>
        connectToMongo()
          .then((db) =>
            db.collection('layouts')
              .updateOne(
                { _id: ObjectId(req.params.id) },
                { $set: { boxes } }
              )
              .then((data) => res.json({
                code: 200,
                message: 'Změny v rozložení byly úspěšně uloženy.',
                result: {
                  data,
                },
              }))
        )
    )
    .catch(handleError(res));
};
