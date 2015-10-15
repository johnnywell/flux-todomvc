var AppDispatcher = require('../dispatcher/AppDispatcher');
var TodoConstants = require('../constants/TodoConstants');

var TodoActions = {

    /**
    * @param {string} text
    */
    create: function(text) {
        AppDispatcher.handleViewAction({
            actionType: TodoConstants.TODO_CREATE,
            text: text
        });
    },

    /**
    * @param {string} id The TODO item
    * @param {string} text
    */
    updateText: function(id, text) {
        AppDispatcher.handleViewAction({
            actionType: TodoConstants.TODO_UPDATE_TEXT,
            id: id,
            text: text
        });
    },

    /**
    * Toggle wheter a single TODO is complete
    * @param {object} todo
    */
    toggleComplete: function(todo){
        var id= todo.id;
        var actionType = todo.complete ?
            TodoConstants.TODO_UNDO_COMPLETE:
            TodoConstants.TODO_COMPLETE;

        AppDispatcher.handleViewAction({
            actionType: actionType,
            id: id
        });
    },

    /**
    * Mark all TODOs as complete
    */
    toggleCompleteAll: function(){
        AppDispatcher.handleViewAction({
            actionType: TodoConstants.TODO_TOGGLE_COMPLETE_ALL
        });
    },

    /*
    * @param {string} id
    */
    destroy: function(id) {
        AppDispatcher.handleViewAction({
            actionType: TodoConstants.TODO_DESTROY,
            id:id
        });
    },

    /**
    * Delete all the completed TODOS
    */
    destroyCompleted: function() {
        AppDispatcher.handleViewAction({
            actionType: TodoConstants.TODO_DESTROY_COMPLETED
        });
    }

};

module.exports = TodoActions;