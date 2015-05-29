(function() {
  var PythonDebuggerView;

  PythonDebuggerView = require('./python-debugger-view');

  module.exports = {
    pythonDebuggerView: null,
    activate: function() {
      atom.workspaceView.command("python-debugger:insert", (function(_this) {
        return function() {
          return _this.insert();
        };
      })(this));
      return atom.workspaceView.command("python-debugger:remove", (function(_this) {
        return function() {
          return _this.remove();
        };
      })(this));
    },
    insert: function() {
      var IMPORT_STATEMENT, cursor, cursors, editor, index, insert_position, line, options, saved_positions, _i, _j, _len, _len1, _results;
      IMPORT_STATEMENT = "import ipdb\n";
      editor = atom.workspace.activePaneItem;
      cursors = editor.getCursors();
      saved_positions = [];
      for (_i = 0, _len = cursors.length; _i < _len; _i++) {
        cursor = cursors[_i];
        cursor.moveToFirstCharacterOfLine();
        saved_positions.push(cursor.getBufferPosition());
      }
      editor.insertText("ipdb.set_trace()  ######### Break Point ###########\n", options = {
        "autoIndentNewline": true,
        "autoIndent": true
      });
      editor.moveCursorToTop();
      insert_position = editor.getCursorBufferPosition();
      editor.moveToBeginningOfLine();
      editor.selectToEndOfLine();
      line = editor.getSelectedText();
      while ((line.startsWith("#")) || (line.startsWith("from __future__")) || (!line)) {
        editor.moveToBeginningOfLine();
        editor.moveCursorDown();
        editor.selectToEndOfLine();
        if (line) {
          insert_position = editor.getCursorBufferPosition();
        }
        line = editor.getSelectedText();
      }
      editor.setCursorBufferPosition(insert_position);
      if (!(IMPORT_STATEMENT.startsWith(line))) {
        editor.moveToBeginningOfLine();
        editor.insertText(IMPORT_STATEMENT);
      }
      _results = [];
      for (index = _j = 0, _len1 = cursors.length; _j < _len1; index = ++_j) {
        cursor = cursors[index];
        _results.push(cursor.setBufferPosition(saved_positions[index]));
      }
      return _results;
    },
    remove: function() {
      var editor, match, matches, _i, _len, _results;
      editor = atom.workspace.activePaneItem;
      console.log('removing all imports');
      matches = [];
      editor.buffer.backwardsScan(/ipdb/g, function(match) {
        return matches.push(match);
      });
      _results = [];
      for (_i = 0, _len = matches.length; _i < _len; _i++) {
        match = matches[_i];
        console.log(match);
        editor.setCursorScreenPosition([match.range.start.row, 1]);
        _results.push(editor.deleteLine());
      }
      return _results;
    }
  };

}).call(this);
