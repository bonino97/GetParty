const navigationConfig = [
  {
    id: 'applications',
    title: 'Applications',
    type: 'group',
    icon: 'apps',
    children: [
      {
        id: 'example-component',
        title: 'Example',
        type: 'item',
        icon: 'whatshot',
        url: '/example',
      },
      {
        id: 'map-component',
        title: 'Map',
        type: 'item',
        icon: 'map',
        url: '/map',
      },
    ],
  },
];

export default navigationConfig;
