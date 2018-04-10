const Joi = require('joi');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const { handleError } = require('../helpers');

const editUserSchema = Joi.object().keys({
  email: Joi.string().min(1).error(() => ({ message: 'Tato položka musí být string o minimální délce 1.' })),
  password: Joi.string().error(() => ({ message: 'Tato položka musí být string.' })),
});
module.exports = function editUser({ connectToMongo }) {
  return (req, res) =>
    Joi.validate(req.body, editUserSchema)
      .then(({ email, password }) =>
        connectToMongo()
          .then((db) =>
            db.collection('users')
              .updateOne(
              { _id: ObjectId(req.params.id) },
              {
                $set: Object.assign(
                  {
                    email,
                    lastUpdate: new Date(),
                  },
                  password ? { password: bcrypt.hashSync(password, 12) } : {}
                ),
              }
              )
              .then(() => res.json({
                code: 200,
                message: 'Změny uživalských informací byly úspěšně uloženy.',
              }))
          )
    )
    .catch(handleError(res));
};
