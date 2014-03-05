var task = {
    options: {
        jshintrc: '.jshint',
        reporter: require('jshint-stylish')
    },
    all: ['*.js', 'src/**/*.js', 'grunt_tasks/*.js']
};

module.exports = task;