var task = {
    options: {
        jshintrc: '.jshint',
        reporter: require('jshint-stylish')
    },
    all: ['*.js', 'tasks/**/*.js', 'grunt_tasks/*.js', 'tests/**/*.js']
};

module.exports = task;