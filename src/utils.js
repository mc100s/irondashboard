

export function getBackgroundOfTheDay() {
  let images = [
    'https://images.unsplash.com/photo-1525183995014-bd94c0750cd5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1476937673710-8174834aa065?w=1600&q=80',
    'https://images.unsplash.com/photo-1505852679233-d9fd70aff56d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1541623089466-8e777dd05d70?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjI0MX0&auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1498429089284-41f8cf3ffd39?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1552632438-a8df228733dc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1552679699-dafca9d2c58c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1600&q=80'
  ]

  let now = new Date();
  let start = new Date(now.getFullYear(), 0, 0);
  let diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  let oneDay = 1000 * 60 * 60 * 24;
  let day = Math.floor(diff / oneDay); // The day of the year (10th February = 41)

  return images[day % images.length]
}