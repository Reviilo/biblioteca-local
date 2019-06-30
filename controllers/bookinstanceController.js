var BookInstance = require('../models/bookinstance');
var Book = require('../models/book');
const { body, validationResult, sanitizeBody } = require('express-validator');
var async = require('async');

// Display list of all BookInstances.
exports.bookinstance_list = function(req, res, next) {
    // res.send('NOT IMPLEMENTED: BookInstance list');

    BookInstance.find()
        .populate('book')
        .exec( function (err, list_bookinstances) {
            if (err) { return next(err); }
            // Succesful, so render
            res.render('bookinstance_list', { title: 'Book Instances list', bookinstances_list: list_bookinstances });
        } );

};

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = function(req, res, next) {

    // res.send('NOT IMPLEMENTED: BookInstance detail: ' + req.params.id);

    BookInstance.findById(req.params.id)
        .populate('book')
        .exec( function (err, bookinstance) {
            if (err) { return next(err); }
            if (bookinstance == null) { // No results
                var err = new Error('Book copy not found.')
                err.status = 404;
                return next(err);
            }
            // Succesful, so render.
            res.render('bookinstance_detail', { title: 'BookInstance', bookinstance: bookinstance });
        } );
};

// Display BookInstance create form on GET.
exports.bookinstance_create_get = function(req, res, next) {
    // res.send('NOT IMPLEMENTED: BookInstance create GET');

    // 
    Book.find({}, 'title')
        .exec( function (err, books) {
            if (err) { return next(err); }
            // Success, so render.
            res.render( 'bookinstance_form', { title: 'Create BookInstance', book_list: books });
        } );

};

// Handle BookInstance create on POST.
// exports.bookinstance_create_post = function(req, res, next) { // res.send('NOT IMPLEMENTED: BookInstance create POST'); };
exports.bookinstance_create_post = [

    // Validate fields.
    body('book', 'Book must be specified').isLength({ min: 1 }).trim(),
    body('imprint', 'Imprint must be specified').isLength({ min: 1 }).trim(),
    body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),

    // Sanitize fields.
    sanitizeBody('book').escape(),
    sanitizeBody('imprint').escape(),
    sanitizeBody('status').trim().escape(),
    sanitizeBody('due_back').toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a BookInstance object with escaped and trimmed data.
        var bookinstance = new BookInstance( {
            book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back
        });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values and error messages.
            Book.find({}, 'title')
                .exec( function (err, books) {
                    if (err) { return next(err); }
                    // Success, so render.
                    res.render('bookinstance_form', { title: 'Create BookInstance', list_books: books })
                } );
        } else {
            // Data from form is valid
            bookinstance.save( function (err) {
                if (err) {return next(err); }
                res.redirect(bookinstance.url);
            } );
        }
    }
];

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = function(req, res) {
    // res.send('NOT IMPLEMENTED: BookInstance delete GET');

    BookInstance.findById(req.params.id).populate('book').exec( (err, bookinstance) => {
        if (err) { return next(err); }
        if (bookinstance==null) { // No results
            var err = new Error('Book copy not found.')
            err.status = 404;
            return next(err);
        }
        // Succesful, so render.
        res.render('bookinstance_delete', { title: 'Delete BookInstance', bookinstance: bookinstance })
    })

};

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = function(req, res) {
    // res.send('NOT IMPLEMENTED: BookInstance delete POST');

    BookInstance.findByIdAndRemove(req.body.bookinstanceid, function deleteBookInstance (err) {
        if (err) { return next(err); }
        // Succes, so redirect.
        res.redirect('/catalog/bookinstances')
      })

};

// Display BookInstance update form on GET.
exports.bookinstance_update_get = function(req, res) {
    // res.send('NOT IMPLEMENTED: BookInstance update GET');

    async.parallel({
        book_list: function(callback) {
            Book.find(callback);
        },
        bookinstance: function (callback) {
            BookInstance.findById(req.params.id).populate('book').exec(callback)
        },
        
    }, function (err, results) {
        if (err) { return next(err); }
        if (results==null) { // No results.
            var err = new Error('Book copy not found.');
            err.status = 400;
            return next(err);
        }
        // Sucessful, so render.
        res.render('bookinstance_form', { title: 'Update BookInstance',bookinstance: results.bookinstance, book_list: results.book_list });
    })

};

// Handle bookinstance update on POST.
exports.bookinstance_update_post = function(req, res) { res.send('NOT IMPLEMENTED: BookInstance update POST'); };
exports.bookinstance_update_post = [

    body('book', 'Book must to be specified').isLength({ min: 1 }).trim(),
    body('imprint', 'Imprimnt must be specified').isLength({ min: 1 }).trim(),
    body('status', 'Status must to be specified').isLength({ min: 1 }).trim(),
    body('due_back').optional({ checkFalse: true }).isISO8601(),

    sanitizeBody('book').escape(),
    sanitizeBody('imprint').escape(),
    sanitizeBody('status').escape(),
    sanitizeBody('due_back').toDate(),

    (req, res, next) => {

        // Extract the validation errors from the req.
        const errors = validationResult(req);

        // Create a bookinstance with escaped and trimed data.
        var bookinstance = ({
            book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back,
            _id: req.params.id // This is required, or a new ID will be assigned!
        });

        if (!errors.isEmpty()) {
            Book.find({}, (err, books) => {
                if (err) { return next(err); }
                // Success, so render.
                res.render('bookinstance_form', { title: 'Update BookInstance', bookinstance: bookinstance, book_list: books })
            })
        } else {
            BookInstance.findByIdAndUpdate(req.params.id, bookinstance, {}, function (err, thebookinstance) {
                if (err) { return next(err); }
                // Successful - redirect to bookinstance page.
                res.redirect(thebookinstance.url)
            })

        }

    }




]