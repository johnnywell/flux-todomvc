var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var TodoConstants = require('../constants/TodoConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _todos = {}; // collection of todo items

/**
* Crete a TODO item.
* @param {string} text The content of the TODO
*/
function create(text) {
    // Hand waving here -- not showing how this interacts with XHR or persistent
    // server-side storage.
    // Using the current timestamp + random number in place of a real id.
    var id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    _todos[id] = {
        id: id,
        complete: false,
        text: text
    };
}

/**
* update a TODO item.
* @param {string} id
* @param {object} updates an object literal containig only the data to be 
* updated.
*/
function update(id, updates) {
    _todos[id] = assign({}, _todos[id], updates);
}

/**
* Update all of the TODO items with the smae object.
* @param {object} updates an object literal containing only the data to be 
* updated
*/
function updateAll(updates) {
    for (var id in _todos) {
        update(id, updates);
    }
}

/**
* Delete a TODO item.
* @param {string} id
*/
function destroy(id) {
    delete _todos[id];
}

/**
* Delete all the completed TODO items.
*/
function destroyCompleted(){
    for (var id in _todos) {
        if (_todos[id].complete) {
            destroy(id);
        }
    }
}


var TodoStore = assign({}, EventEmitter.prototype, {

    /**
    * Get the entire collection of TODOs.
    * @return {object}
    */
    getAll: function() {
        return _todos;
    },

    /**
    * Tests whether all the remaining TODO items are marked as completed.
    * @return {boolean}
    */
    areAllComplete: function() {
        for (var id in _todos) {
            if (!_todos[id].complete) {
                return false;
            }
        }
        return true;
    },

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    /**
    * @param {function} callback
    */
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    /**
    * @param {function} callback
    */
    removeChangeListener: function(callback) {
        this.removeListner(CHANGE_EVENT, callback);
    },

    dispatcherIndex: AppDispatcher.register(function(payload) {
        var action = payload.action;
        var text;

        switch(action.actionType) {
            case TodoConstants.TODO_CREATE:
                text = action.text.trim();
                if (text != '') {
                    create(text);
                    TodoStore.emitChange();
                }
                break;

            case TodoConstants.TODO_TOGGLE_COMPLETE_ALL:
                if (TodoStore.areAllComplete()) {
                    updateAll({complete: false});
                } else {
                    updateAll({complete: true});
                }
                TodoStore.emitChange();
                break;

            case TodoConstants.TODO_UNDO_COMPLETE:
                update(action.id, {complete: false});
                TodoStore.emitChange();
                break;

            case TodoConstants.TODO_COMPLETE:
                update(action.id, {complete: true});
                TodoStore.emitChange();
                break;

            case TodoConstants.TODO_UPDATE_TEXT:
                text = action.text.trim();
                if (text !== '') {
                    update(action.id, {text: text});
                    TodoStore.emitChange();
                }
                break;

            case TodoConstants.TODO_DESTROY:
                destroy(action.id);
                TodoStore.emitChange();
                break;

            case TodoConstants.TODO_DESTROY_COMPLETED:
                destroyCompleted();
                TodoStore.emitChange();
                break;

            default:
                // no op

            // add more cases for other actionTypes, like TODO_UPDATE, etc.
        }

        return true; // No errors. Needed by promise in Dispatcher.
    })
});


module.exports = TodoStore;