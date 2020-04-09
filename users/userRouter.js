const express = require('express');
const db = require('./userDb')
const postDb = require('../posts/postDb')
const router = express.Router();

// router.use(middleware here)
// router.use(validateUserId)

router.post('/', validateUser, (req, res) => { // needs a user in the header

  db.insert(req.body)
  .then(rep => {
    res.status(201).json(rep)
  })
  .catch(err => {
    res.status(500).json({
      message: `Server returned error: ${err}`
    });
  });

});

router.post('/:id/posts', validateUser, validatePost, (req, res) => {

  const comment = {
    text: req.body.text,
    user_id: req.params.id
  }
  
  postDb.insert(comment)
  .then(rep => {
    res.status(201).json(rep);
  })
  .catch(err => {
    res.status(500).json({
      message: `Server returned error: ${err}`
    });
  });

});

router.get('/', (req, res) => {

  db.get()
  .then(rep => {
    res.status(200).json(rep);
  })
  .catch(err => {
    res.status(500).json({
      message: `Server returned error: ${err}`
    });
  });

});

router.get('/:id', validateUserId, (req, res) => {

  const id = req.params.id;

  db.getById(id)
  .then(rep => {
    res.status(200).json(rep);
  })
  .catch(err => {
    res.status(500).json({
      message: `Server returned error: ${err}`
    });
  });

});

router.get('/:id/posts', (req, res) => {
  const id = req.params.id;

  db.getUserPosts(id)
  .then(rep => {
    res.status(200).json(rep)
  })
  .catch(err => {
    res.status(500).json({
      message: `Server returned error: ${err}`
    });
  });

});

router.delete('/:id', validateUserId, (req, res) => {

  const id = req.params.id

  db.remove(id)
  .then(count => {
    res.status(200).json({
      message: `${count} user(s) deleted.`
    });
  })
  .catch(err => {
    res.status(500).json({
      message: `Server returned error: ${err}`
    });
  });

});

router.put('/:id', validateUserId, (req, res) => {

  const id = parseInt(req.params.id);

  db.getById(id)
  .then(rep => {
    
    const user = {
      ...rep,
      id: req.body.id,
      name: req.body.name
    };

    console.log(user)
    console.log(rep)

    db.update(req.params.id, user)
    .then(count => {
      res.status(200).json({
        message: `${count} user(s) edited.`
      })
    })
    .catch(err => {
      res.status(500).json({
        message: `Server returned error nest: ${err}`
      });
    });

  })
  .catch(err => {
    res.status(500).json({
      message: `Server returned error: ${err}`
    });
  });
  

});

//custom middleware

function validateUserId(req, res, next) {

  const id = req.query.user;

  if (id === undefined) {
    res.status(400).json({
      message: `Please log in to use this function.`
    });
  };

  db.getById(id)
  .then(rep => {
    if (rep) {
      req.user = rep;
      next();
    } else {
      res.status(404).json({
        message: `User ID ${id} could not be found for login.`
      });
    };
  })
  .catch(err => {
    res.status(500).json({
      message: `Server error. ${err}`
    });
  });
};

function validateUser(req, res, next) {

  if (!req.body) {
    res.status(400).json({
      message: 'User data missing.'
    });
  } else if (!req.body.name) {
    res.status(400).json({
      message: 'Missing required user name.'
    });
  } else {
    next();
  };

};

function validatePost(req, res, next) {

  if(!req.body) {
    res.status(400).json({
      message: `Missing post data.`
    });
  } else if (!req.body.text) {
    res.status(400).json({
      message: `Missing post text data.`
    });
  } else {
    next();
  };

};

module.exports = router;
