const pageModel = require('../models/pageModel.js');

const pageController = {};

pageController.get = (req, res) => {
    let data = pageModel.get();
    console.log({...data})
    res.render('page', { ...data });
}

pageController.post = (req, res) => {
    let { id } = req.query;
    let { body } = req;
    let data = pageModel.post({id, ...body});
    res.render('page', { data });
}

pageController.put = (req, res) => {
    let { body } = req;
    let data = pageModel.put(body);
    res.render('page', { data });
}

pageController.delete = (req, res) => {
    let { id } = req.query;
    let data = pageModel.delete(id);
    res.render('page', { data });
}

module.exports = pageController;