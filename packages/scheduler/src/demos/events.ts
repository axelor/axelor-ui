import moment from 'moment';

const now = moment().startOf('day').toDate();

export default [
  {
    id: 1,
    title: 'Point in Time Event',
    start: now,
    end: now,
  },
  {
    id: 2,
    title: 'Record dance',
    start: now,
    end: now,
  },
  {
    id: 3,
    title: 'Edit Music',
    start: now,
    end: now,
  },
];
