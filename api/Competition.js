var competitionRoutes = function (app, Competition) {

    app.get('/competitions', function (req, res) {
        console.log('GET /competitions');
        Competition.find({})
            .sort({status: 'descending', name: 'ascending'})
            .exec()
            .then(function (docs) {
                res.send(docs);
            }, function (error) {
                console.log('Ooops: ' + error);
                res.status(500).send('Ooops: Unable to retrieve data!');
            });
    });

    app.get('/competition/:competitionId', function (req, res) {
        console.log('GET /competition/' + req.params.competitionId);

        Competition
            .findOne({'_id': req.params.competitionId})
            .exec()
            .then(function (comp) {
                res.send(comp);
            }, function (error) {
                console.log('Ooops: ' + error);
                res.status(500).send('Ooops: Unable to retrieve data!');
            });

    });

    app.put('/auth/competition/push/:competitionId', function (req, res) {
        console.log('PUT /auth/competition/push/' + req.params.competitionId + ' BODY: ' + JSON.stringify(req.body));

        //TODO check admin user
        //TODO check payload

        Competition
            .findOne(req.params.competitionId)
            .update({'selections.selection': req.body.selectionId}, {
                updated: Number((new Date().getTime() / 1000).toFixed(0)),
                $set: {
                    'selections.$.score': req.body.score
                }
            })
            .exec()
            .then(function (comp) {
                res.send(comp);
            }, function (error) {
                console.log('Ooops: ' + error);
                res.status(500).send('Ooops: Unable to retrieve data!');
            });
    });

    app.put('/auth/competition/selection/push/:competitionId', function (req, res) {
        console.log('PUT /auth/competition/selection/push/' + req.params.competitionId + ' BODY: ' + JSON.stringify(req.body));

        //TODO check admin user
        if (!req.body || !req.body.selection) {
            console.log('Ooops: ' + 'invalid data' + JSON.stringify(req.body));
            res.status(500).send('Ooops: Unable to add selection data for competition:' + req.params.competitionId);
        }

        Competition
            .findByIdAndUpdate(
                req.params.competitionId,
                {$push: {'selections': req.body}},
                {safe: true, upsert: true, new : true}
            )
            .exec()
            .then(function (comp) {
                res.send(comp);
            }, function (error) {
                console.log('Ooops: ' + error);
                res.status(500).send('Ooops: Unable to add selection data for competition:' + req.params.competitionId);
            });
    });

    app.put('/competition/status/:competitionId', function (req, res) {
        console.log('PUT /competition/status/' + req.params.competitionId + ' BODY: ' + JSON.stringify(req.body));

        Competition
            .findOne(req.params.competitionId)
            .update({
                updated: Number((new Date().getTime() / 1000).toFixed(0)),
                status: req.body.status
            })
            .exec()
            .then(function (comp) {
                res.send(comp);
            }, function (error) {
                console.log('Ooops: ' + error);
                res.status(500).send('Ooops: Unable to retrieve data!');
            });
    });
};

exports = module.exports = competitionRoutes;