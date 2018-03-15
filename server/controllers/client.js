const Client = require('../models').Client;

module.exports = {
  create(req, res) {
    const {body: {firstName, lastName, company, phone}} = req;
    return Client
      .create({
        first_name: firstName,
        last_name: lastName,
        company: company,
        phone: phone,
        todoId: req.params.todoId,
      })
      .then(todoItem => res.status(201).send(todoItem))
      .catch(error => res.status(400).send(error));
  }
};