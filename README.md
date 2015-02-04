# atom-python-debugger package

Quick and Easy way to add Python Debugger statements

## Usage

Use "F7" / "shift+F7" to insert/remove `ipdb.set_trace()` statements on current line. Takes into consideration indentation and tab preference. Enter as many `ipdb.set_trace()` statemements as you like. Only one import statement is ever used. "shift+f7" will remove all debug statements.

Mac users need to use the function key: Fn+F7 and Fn+Shift+F7

### Example

Before:

```python
import datetime

class MyClass(object):
    def __init__(self, *args, **kwargs):
        pass

    def my_function(self, *args, **kwargs):
        print date][time.datetime.now()  # ][ denotes cursor location
```


After pressing F7:

```python
import ipdb
import datetime

class MyClass(object):
    def __init__(self, *args, **kwargs):
        pass

    def my_function(self, *args, **kwargs):
        ipdb.set_trace() ################## Break Point ######################
        print datetime.datetime.now()
```

Using Shift+F7 will return the code to the "Before" state.
