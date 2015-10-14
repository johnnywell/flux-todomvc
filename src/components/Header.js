var React = require('react');
var TodoActions = require('../actions/TodoActions');
var TodoTextInput = require('./TodoTextInput');

var Header = React.createClass({

  /**
  * @return {object}
  */
  render: function() {
    return(
      <header id="header">
        <h1>todos</h1>
        <TodoTextInput
          id="new-todo"
          placeholder="What needs to be done?"
          onSave={this._onsave}
        />
      </header>
    );
  },

  /**
  * Event handler called withing TodoTextInput.
  * Defining this here allows TodoTextInput to be used in multiple places
  * in differente ways.
  * @params {string} text
  */
  _onsave: function(text) {
    if (text.trim()) {
      TodoActions.create(text);
    }
  }

});

module.exports = Header;