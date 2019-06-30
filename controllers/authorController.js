var Author = require('../models/author');
var Book = require('../models/book');

const { body,validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');

var async = require('async');

// Display Author create form on GET.
exports.author_create_get = function(req, res) {
    // res.send('NOT IMPLEMENTED: Author create GET');

    res.render('author_form', { title: 'Create Author' })

};

// Handle Author create on POST.
// exports.author_create_post = function(req, res) { res.send('NOT IMPLEMENTED: Author create POST'); };
exports.author_create_post = [

    // Validate fields.
    body('first_name').isLength({ min: 1 }).trim().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('family_name').isLength({ min: 1 }).trim().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601(),
    body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601(),

    // Sanitaze fields.
    sanitizeBody('first_name').escape(),
    sanitizeBody('family_name').escape(),
    sanitizeBody('date_of_birth').toDate(),
    sanitizeBody('date_of_death').toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {
    
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('author_form', { title: 'Create Author', author: req.body, errors: errors.array() });
            return;
        } else {
            //Data from form is valid.

            // Create an Author object with escaped and trimmed data.
            var author = new Author({
                first_name      :   req.body.first_name,
                family_name     :   req.body.family_name,
                date_of_birth   :   req.body.date_of_birth,
                date_of_death   :   req.body.date_of_death
            });
            author.save( function (err) {
                if (err) { return next(err); }
                // Succesful, redirect to new author record.
                res.redirect(author.url);
            } );
        }

    }

]

// Display Author update form on GET.
exports.author_update_get = function(req, res, next) {
    // res.send('NOT IMPLEMENTED: Author update GET');

    Author.findById(req.params.id).exec( function (err, author) {
        if (err) { return next(err); }
        // Successful, so render.
        res.render('author_form', { title: 'author_form', author: author });
    } );

};

// Handle Author update on POST.
// exports.author_update_post = function(req, res) { res.send('NOT IMPLEMENTED: Author update POST'); };
exports.author_update_post = [

    // Validate fields.
    body('first_name').isLength({ min: 1 }).trim().withMessage('First Name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric character.'),
    body('family_name').isLength({ min: 1 }).trim().withMessage('First Name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumerc character.'),
    body('date_of_birth', 'Invalid date of birth.').optional({ checkFalsy: true }).isISO8601(),
    body('date_of_death', 'Invalid date of death.').optional({ checkFalsy: true }).isISO8601(),

    sanitizeBody('first_name').escape(),
    sanitizeBody('family_name').escape(),
    sanitizeBody('date_of_birth').toDate(),
    sanitizeBody('date_of_death').toDate(),

    // Process the request after validation and sanitization
    (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('author_form', { title: 'Update Author', author: author, errors: errors.array() });
            return;
        } else {
            var author = new Author({
                first_name: req.body.first_name,
                family_name: req.body.family_name,
                date_of_birth: req.body.date_of_birth,
                date_of_death: req.body.date_of_death,
                _id: req.params.id // This is required, or a new ID will be assigned!
            });

            Author.findByIdAndUpdate(req.params.id, author, {}, (err, theauthor) => {
                if (err) { return next(err); }
                // Success, so redirect.
                res.redirect(theauthor.url);
            })
        }

    }

]

// Display Author delete form on GET.
exports.author_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete GET');
};

// Handle Author delete on POST.
exports.author_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete POST');
};

// Display detail page for a specific Author.
exports.author_detail = function(req, res, next) {

    // res.send('NOT IMPLEMENTED: Author detail: ' + req.params.id);

    async.parallel({
        author: function (callback) {
            Author.findById(req.params.id)
              .exec(callback)
        },
        authors_books: function (callback) {
          Book.find({ 'author': req.params.id }, 'title summary')
          .exec(callback)
        }
    }, function (err, results) {
        if (err) { return next(err) } // Error in API usage.
        if (results.author == null) { // No results.
            var err = new Error('Author not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('author_detail', { title: 'Author Detail', author: results.author, author_books: results.authors_books } );
    });

};

// Display list of all Authors.
exports.author_list = function(req, res, next) {
    // res.send('NOT IMPLEMENTED: Author list');

    Author.find()
        .sort([['family_name', 'ascending']])
        .exec( function (err, list_authors) {
            if (err) { return next(err) }
            // Successful, so render.
            res.render('author_list', { title: 'Author List', author_list: list_authors })
        } )

};