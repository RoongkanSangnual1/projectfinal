
async def is_array(data):
    try:
        ast.literal_eval(data)
        return True
    except (SyntaxError, ValueError):
        return False
