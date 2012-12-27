module.exports = [
    {landTo: 'net', delay: 1000, pipeline: [
        { module: 'net' },
        { module: 'delta' }
    ]},
    {landTo: 'cpu', delay: 1000, pipeline: [
        { module: 'cpu' },
        { module: 'delta' }
    ]},
    {landTo: 'sensors', delay: 1000, pipeline: [
        { module: 'sensors' }
    ]}
];
