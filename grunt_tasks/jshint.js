var task = {
    options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
    },
    all: ['*.js', 'tasks/**/*.js', 'grunt_tasks/*.js', 'tests/**/*.js']
};

module.exports = task;