export const initialState = {
    pallete: [],
}

const reducer = ( state , action ) => {

    switch(action.type) {
        case "HANDLE_CHANGE":
            return state;
        case "RESET":
        return state;
        case "HANDLE_PALETTE_COLOR_CHANGE":
        return state;
        default:
            return state;
    }
};

export default reducer