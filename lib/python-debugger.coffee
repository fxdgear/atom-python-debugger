PythonDebuggerView = require './python-debugger-view'

module.exports =
  pythonDebuggerView: null

  activate: ->
    atom.commands.add 'atom-workspace', "python-debugger:insert", => @insert()
    atom.commands.add 'atom-workspace', "python-debugger:remove", => @remove()

  insert: ->
    IMPORT_STATEMENT = "import ipdb\n"
    editor = atom.workspace.getActivePaneItem()
    cursors = editor.getCursors()
    saved_positions = []

    for cursor in cursors
      cursor.moveToFirstCharacterOfLine()
      saved_positions.push cursor.getBufferPosition()

    editor.insertText(
      "ipdb.set_trace()  ######### Break Point ###########\n",
      options={
        "autoIndentNewline": true
        "autoIndent": true
      }
    )

    editor.moveToTop()
    insert_position = editor.getCursorBufferPosition()
    editor.moveToBeginningOfLine()
    editor.selectToEndOfLine()
    line = editor.getSelectedText()

    # skip comments (and Python headers), "from __future__" imports and empty lines
    while (line.startsWith "#") or (line.startsWith "from __future__") or (not line)
      editor.moveToBeginningOfLine()
      editor.moveCursorDown()
      editor.selectToEndOfLine()
      if line
        insert_position = editor.getCursorBufferPosition()
      line = editor.getSelectedText()

    editor.setCursorBufferPosition(insert_position)

    if not (IMPORT_STATEMENT.startsWith line)
      editor.moveToBeginningOfLine()
      editor.insertText(IMPORT_STATEMENT)

    for cursor, index in cursors
      cursor.setBufferPosition(saved_positions[index])

  remove: ->
    editor = atom.workspace.getActivePaneItem()
    console.log('removing all imports')
    matches = []
    editor.buffer.backwardsScan /ipdb/g, (match) -> matches.push(match)
    for match in matches
      console.log(match)
      editor.setCursorScreenPosition([match.range.start.row, 1])
      editor.deleteLine()
