const initialState = [];

const filesReducer = (state = initialState, action) => {
switch (action.type) {
    case 'SET_FILES':
     return action.payload;
    case 'CLEAR_FILES':
     return [];
    default:
     return state;
}
};

export default filesReducer;