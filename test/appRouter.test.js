import request from 'supertest';
import app from '../src/server.js';

describe('GET /lead-time', () => {
  it('should return the lead time of the issue', async () => {
    const response = await request(app)
      .get('/lead-time')
      .query({ issueId: '7' }); // issue id

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('days');
    expect(response.body).toHaveProperty('hours');
    expect(response.body).toHaveProperty('minutes');
    expect(response.body).toHaveProperty('seconds');
  });

  it('should return an error if the issue id is not valid', async () => {
    const response = await request(app)
      .get('/lead-time')
      .query({ issueId: '0' }); // Establece un issueId inválido

    expect(response.status).toBe(400); // Puedes ajustar el código de estado según tu lógica de manejo de errores
  });
});
