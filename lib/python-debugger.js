var PythonDebuggerView;

PythonDebuggerView = require('./python-debugger-view');

module.exports = {
  pythonDebuggerView: null,
  activate: function() {
    atom.commands.add('atom-workspace', "python-debugger:insert", (function(_this) {
      return function() {
        return _this.insert();
      };
    })(this));
    return atom.commands.add('atom-workspace', "python-debugger:remove", (function(_this) {
      return function() {
        return _this.remove();
      };
    })(this));
  },
  insert: function() {
    var IMPORT_STATEMENT, cursor, cursors, editor, i, index, insert_position, j, len, len1, line, options, results, saved_positions;
    IMPORT_STATEMENT = "import ipdb\n";
    editor = atom.workspace.getActivePaneItem();
    cursors = editor.getCursors();
    saved_positions = [];
    for (i = 0, len = cursors.length; i < len; i++) {
      cursor = cursors[i];
      cursor.moveToFirstCharacterOfLine();
      saved_positions.push(cursor.getBufferPosition());
    }
    editor.insertText("ipdb.set_trace()  ######### Break Point ###########\n", options = {
      "autoIndentNewline": true,
      "autoIndent": true
    });
    editor.moveToTop();
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
    results = [];
    for (index = j = 0, len1 = cursors.length; j < len1; index = ++j) {
      cursor = cursors[index];
      results.push(cursor.setBufferPosition(saved_positions[index]));
    }
    return results;
  },
  remove: function() {
    var editor, i, len, match, matches, results;
    editor = atom.workspace.getActivePaneItem();
    console.log('removing all imports');
    matches = [];
    editor.buffer.backwardsScan(/ipdb/g, function(match) {
      return matches.push(match);
    });
    results = [];
    for (i = 0, len = matches.length; i < len; i++) {
      match = matches[i];
      console.log(match);
      editor.setCursorScreenPosition([match.range.start.row, 1]);
      results.push(editor.deleteLine());
    }
    return results;
  }
};
