const Joi = require('joi');
const bcrypt = require('bcrypt');
const { handleError } = require('../helpers');

const addUserSchema = Joi.object().keys({
  email: Joi.string().min(1).required().error(() => ({ message: 'Tato položka musí být string o minimální délce 1.' })),
  password: Joi.string().min(1).required().error(() => ({ message: 'Tato položka musí být string o minimální délce 1.' })),
  isApi: Joi.boolean().required().error(() => ({ message: 'Tato položka musí být boolean.' })),
});
module.exports = function addUser({ connectToMongo }) {
  return (req, res) =>
    Joi.validate(req.body, addUserSchema)
      .then(({ email, password, isApi }) =>
        connectToMongo()
          .then((db) =>
            bcrypt.hash(password, 12)
              .then((hash) =>
                db.collection('users').insert({
                  email,
                  isApi,
                  lastUpdate: new Date(),
                  password: hash,
                })
                .then(() => res.json({
                  code: 201,
                  message: 'Uživatel byl úspěšně vytvořena.',
                }))
              )
          )
        )
        .catch(handleError(res));
};
