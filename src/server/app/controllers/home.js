module.exports = (app) => {
  const HomeController = {
    index(req, res) {
      res.render('index');
    }
  };
  return HomeController;
};
