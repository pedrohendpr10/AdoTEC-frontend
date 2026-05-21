import client from './client';

/**
 * Endpoints de horários disponíveis para visita.
 * Retornam listas planas (sem paginação) de TimeSlotResponseDTO:
 *   { id, date, startTime, endTime }
 */

/** GET /timeslots?date=YYYY-MM-DD */
export function getTimeSlotsByDate(date) {
  return client
    .get('/timeslots', { params: { date } })
    .then((res) => res.data.data);
}

/** GET /timeslots?startDate=&endDate= */
export function getTimeSlotsByRange(startDate, endDate) {
  return client
    .get('/timeslots', { params: { startDate, endDate } })
    .then((res) => res.data.data);
}
