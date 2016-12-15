$(function() {
  mApi().user.students.read(MUIKKU_LOGGED_USER).callback(function (err, student) {
    if (student.has)
  });
});