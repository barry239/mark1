const indexControllers = {};

indexControllers.index = (req, res) => {
    return res.json({
        message: 'Welcome to my Products API'
    });
};

export default indexControllers;