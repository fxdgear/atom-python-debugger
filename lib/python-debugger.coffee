PythonDebuggerView = require './python-debugger-view'

module.exports =
  pythonDebuggerView: null

  activate: ->
    atom.commands.add 'atom-workspace', "python-debugger:insert", => @insert()
    atom.commands.add 'atom-workspace', "python-debugger:remove", => @remove()

  insert: ->
    IMPORT_STATEMENT = "import ipdb\n"
    editor = atom.workspace.activePaneItem
    cursors = editor.getCursors()
    for cursor in cursors
      cursor.moveToFirstCharacterOfLine()

    editor.insertText(
      "ipdb.set_trace()  ######### Break Point ###########\n",
      options={
        "autoIndentNewline": true
        "autoIndent": true
      }
    )

    editor.moveCursorToTop()
    editor.moveCursorToBeginningOfLine()
    editor.selectToEndOfLine()
    line = editor.getSelectedText()
    if not line.startsWith "from __future__"
      console.log "First import is not from __future__"
      if not IMPORT_STATEMENT.startsWith line
        editor.moveCursorToBeginningOfLine()
        editor.insertText(IMPORT_STATEMENT)

    else
      console.log "First import is from __future__"
      editor.moveCursorToBeginningOfLine()
      editor.moveCursorDown()
      editor.selectToEndOfLine()
      line = editor.getSelectedText()
      if not IMPORT_STATEMENT.startsWith line
        editor.moveCursorToBeginningOfLine()
        editor.insertText(IMPORT_STATEMENT)

  remove: ->
    editor = atom.workspace.activePaneItem
    console.log('removing all imports')
    matches = []
    editor.buffer.backwardsScan /ipdb/g, (match) -> matches.push(match)
    for match in matches
      console.log(match)
      editor.setCursorScreenPosition([match.range.start.row, 1])
      editor.deleteLine()
