import formatISO from 'date-fns/formatISO';
export const openGoogleCalendar = (pin) => {
  const startDate = formatISO(new Date(pin?.startDate), { format: 'basic' });
  const endDate = formatISO(new Date(pin?.endDate), { format: 'basic' });

  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&dates=${startDate}/${endDate}&location=${
    pin?.location?.city
  },${pin?.location?.country}&text=${pin?.title}&details=${pin?.content?.slice(
    0,
    15
  )}`;
  window.open(url, '_blank');
};
