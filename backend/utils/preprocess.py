def preprocess_input(data):
    mapping = {
        'Month-to-month': 0,
        'One year': 1,
        'Two year': 2,
        'DSL': 0,
        'Fiber optic': 1,
        'None': 2
    }
    return [[
        int(data['tenure']),
        float(data['monthly_charges']),
        mapping[data['contract']],
        mapping[data['internet_service']]
    ]]
