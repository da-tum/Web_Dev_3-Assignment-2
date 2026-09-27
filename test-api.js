const http = require('http');
const app = require('./app');

// Automated API test script
async function runTests() {
  const PORT = 3001;
  const server = app.listen(PORT, async () => {
    console.log(`\n--- Running API Verification Suite on port ${PORT} ---\n`);

    const request = (path, method = 'GET', body = null) => {
      return new Promise((resolve, reject) => {
        const reqOptions = {
          hostname: '127.0.0.1',
          port: PORT,
          path,
          method,
          headers: {
            'Content-Type': 'application/json'
          }
        };

        const req = http.request(reqOptions, (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            try {
              resolve({
                status: res.statusCode,
                body: data ? JSON.parse(data) : {}
              });
            } catch (err) {
              resolve({ status: res.statusCode, body: data });
            }
          });
        });

        req.on('error', reject);
        if (body) {
          req.write(typeof body === 'string' ? body : JSON.stringify(body));
        }
        req.end();
      });
    };

    let passed = 0;
    let failed = 0;

    const assert = (condition, title) => {
      if (condition) {
        console.log(` PASS: ${title}`);
        passed++;
      } else {
        console.error(` FAIL: ${title}`);
        failed++;
      }
    };

    try {
      // 1. GET /
      const rootRes = await request('/');
      assert(rootRes.status === 200, 'GET / returns 200 OK');

      // 2. GET /students
      const getRes = await request('/students');
      assert(getRes.status === 200 && Array.isArray(getRes.body) && getRes.body.length >= 3, 'GET /students returns array of students');

      // 3. GET /students/:id (existing)
      const getByIdRes = await request('/students/1');
      assert(getByIdRes.status === 200 && getByIdRes.body.id === 1, 'GET /students/1 returns student object');

      // 4. GET /students/:id (non-existing)
      const getNonExistent = await request('/students/999');
      assert(getNonExistent.status === 404, 'GET /students/999 returns 404');

      // 5. POST /students (validation error - missing id/name/course)
      const postInvalid = await request('/students', 'POST', {});
      assert(postInvalid.status === 400, 'POST /students without payload returns 400');

      // 6. POST /students (success)
      const newStudentPayload = { id: 4, name: 'Lucas Scott', course: 'Cybersecurity' };
      const postRes = await request('/students', 'POST', newStudentPayload);
      assert(postRes.status === 201 && postRes.body.name === 'Lucas Scott' && postRes.body.id === 4, 'POST /students creates student');

      // 7. PUT /students/:id (success)
      const putRes = await request('/students/4', 'PUT', { name: 'Lucas Scott', course: 'Network Security' });
      assert(putRes.status === 200 && putRes.body.course === 'Network Security', 'PUT /students/:id updates student');

      // 8. PUT /students/:id (non-existing)
      const putNonExistent = await request('/students/999', 'PUT', { name: 'Ghost', course: 'None' });
      assert(putNonExistent.status === 404, 'PUT /students/999 returns 404');

      // 9. DELETE /students/:id (success)
      const deleteRes = await request('/students/4', 'DELETE');
      assert(deleteRes.status === 200 && deleteRes.body.message === 'Student deleted successfully', 'DELETE /students/:id deletes student');

      // 10. DELETE /students/:id (non-existing)
      const deleteNonExistent = await request('/students/999', 'DELETE');
      assert(deleteNonExistent.status === 404, 'DELETE /students/999 returns 404');

      // 11. 404 Not Found Route
      const notFoundRes = await request('/non-existent-endpoint');
      assert(notFoundRes.status === 404, 'Unhandled route returns 404');

      console.log(`\nTest Summary: ${passed} passed, ${failed} failed.\n`);
    } catch (error) {
      console.error('Test execution error:', error);
    } finally {
      server.close(() => {
        process.exit(failed > 0 ? 1 : 0);
      });
    }
  });
}

runTests();
