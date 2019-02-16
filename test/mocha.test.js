const { dbDeleteTable } = require('./helper/db.helper');

after(async () => {
  await dbDeleteTable('Teacher_Student');
  await dbDeleteTable('Teachers');
  await dbDeleteTable('Students');
});
