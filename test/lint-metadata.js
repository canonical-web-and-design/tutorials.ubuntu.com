var assert = require('assert');
var gm = require('gray-matter');
var find = require('find');

var required_keys = [ 'id',
                 'summary',
                 'categories',
                 'tags',
                 'difficulty',
                 'status',
                 'feedback_url',
                 'published',
                 'author']

var common_mistakes = ['feedback_link',
                      'feedback-link',
                      'feedback link',
                      'feedback-url',
                      'feedback url']

var files = find.fileSync(/\.md$/,"tutorials");
var tutorial_ids = []
for(var i=0, len=files.length; i < len; i++){
  var f = gm.read(files[i]);
  validate(f, files[i]);
  tutorial_ids.push(f.data.id)
}
duplicates_check(tutorial_ids);

// Checks for duplicates in tutorials ids
function duplicates_check(array) {
  describe('The list of tutorials', function(){
    it('doesn\'t contain duplicated IDs', function(done){
      var sorted_arr = array.slice().sort();
      var duplicates = [];
      for (var i = 0; i < sorted_arr.length - 1; i++) {
          if (sorted_arr[i + 1] == sorted_arr[i]) {
              duplicates.push(sorted_arr[i]);
          }
      }
      assert(duplicates.length == 0, `duplicates found: ${duplicates}`);
      done();
    });
  });
}

// Validates metadata for each tutorial
function validate(f, fn) {
  describe('Metadata for ' + fn, function() {
    it('contains all required keys', function(done) {
      required_keys.forEach(contains)
      function contains(item){
        assert(Object.keys(f.data).includes(item), `does not contain "${item}"`);
      }
      done();
    });
    it('doesn\'t contain common mistakes', function(done) {
      common_mistakes.forEach(notcontains)
      function notcontains(item){
        assert(!Object.keys(f.data).includes(item), `contains "${item}"`);
      }
      done();
    });
    describe('id', function() {
      it('only contains alpha-numerical characters and dashes', function(done) {
        assert(f.data.id.match('^[a-zA-Z0-9-]+$'));
        done();
      });
    });
    describe('summary', function() {
      it('has no more than 40 words', function(done) {
        assert(f.data.summary.split(" ").length <= 40);
        done();
      });
    });
    describe('tags', function() {
      it('contains at least two comma-separated strings', function(done) {
        assert(f.data.tags.split(',').length >= 2);
        done();
      });
    });
    describe('difficulty', function() {
      it('is between 1 and 5', function(done) {
        assert(f.data.difficulty <= 5 && f.data.difficulty >= 1);
        done();
      });
    });
    describe('status', function() {
      it('is "published" or "draft"', function(done) {
        assert(['published', 'draft'].includes(f.data.status));
        done();
      });
    });
    describe('published', function() {
      it('is a date in the YYYY-MM-DD format', function(done) {
        assert(f.data.published instanceof Date);
        done();
      });
    });
    describe('feedback_url', function() {
      it('is a URL', function(done) {
        assert(f.data.feedback_url.match('^https?:\/\/.*$'));
        done();
      });
    });
    describe('author', function() {
      it('is in the "name <email>" format', function(done) {
        assert(f.data.author.match('^.*<.*@.*>$'));
        done();
      });
    });
  });
}
