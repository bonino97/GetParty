const navigationConfig = [
  {
    id: 'applications',
    title: 'Applications',
    type: 'group',
    icon: 'apps',
    children: [
      {
        id: 'map-component',
        title: 'Map',
        type: 'item',
        icon: 'map',
        url: '/map',
      },
      {
        id: 'parties-component',
        title: 'Parties',
        type: 'item',
        icon: 'whatshot',
        url: '/parties',
      },
    ],
  },
];

export default navigationConfig;
